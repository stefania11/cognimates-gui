import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import VM from 'scratch-vm';
import AudioEngine from 'scratch-audio';

import analytics from '../lib/analytics';
import LibraryComponent from '../components/library/library.jsx';

import soundIcon from '../components/asset-panel/icon--sound.svg';
import soundIconRtl from '../components/asset-panel/icon--sound-rtl.svg';

import soundLibraryContent from '../lib/libraries/sounds.json';
import soundTags from '../lib/libraries/sound-tags';

import {connect} from 'react-redux';

const messages = defineMessages({
    libraryTitle: {
        defaultMessage: 'Choose a Sound',
        description: 'Heading for the sound library',
        id: 'gui.soundLibrary.chooseASound'
    }
});

const SoundLibrary = props => {
    const intl = useIntl();
    const [audioEngine, setAudioEngine] = useState(null);
    const [playingSoundPromise, setPlayingSoundPromise] = useState(null);

    useEffect(() => {
        setAudioEngine(new AudioEngine());
        return () => {
            stopPlayingSound();
        };
    }, []);

    const stopPlayingSound = () => {
        if (playingSoundPromise !== null) {
            if (playingSoundPromise.isPlaying) {
                playingSoundPromise.then(soundPlayer => {
                    soundPlayer.stop();
                });
            } else {
                playingSoundPromise.then(soundPlayer => {
                    soundPlayer.stopImmediately();
                });
            }
            setPlayingSoundPromise(null);
        }
    };

    const handleItemMouseEnter = soundItem => {
        const md5ext = soundItem._md5;
        const idParts = md5ext.split('.');
        const md5 = idParts[0];
        const vm = props.vm;

        stopPlayingSound();

        const newPlayingSoundPromise = vm.runtime.storage.load(vm.runtime.storage.AssetType.Sound, md5)
            .then(soundAsset => {
                const sound = {
                    md5: md5ext,
                    name: soundItem.name,
                    format: soundItem.format,
                    data: soundAsset.data
                };
                return audioEngine.decodeSoundPlayer(sound);
            })
            .then(soundPlayer => {
                soundPlayer.connect(audioEngine);
                soundPlayer.play();
                if (newPlayingSoundPromise !== null) {
                    newPlayingSoundPromise.isPlaying = true;
                }
                return soundPlayer;
            });

        setPlayingSoundPromise(newPlayingSoundPromise);
    };

    const handleItemMouseLeave = () => {
        stopPlayingSound();
    };

    const handleItemSelected = soundItem => {
        const vmSound = {
            format: soundItem.format,
            md5: soundItem._md5,
            rate: soundItem.rate,
            sampleCount: soundItem.sampleCount,
            name: soundItem.name
        };
        props.vm.addSound(vmSound).then(() => {
            props.onNewSound();
        });
        analytics.event({
            category: 'library',
            action: 'Select Sound',
            label: soundItem.name
        });
    };

    const soundLibraryThumbnailData = soundLibraryContent.map(sound => {
        const {
            md5,
            ...otherData
        } = sound;
        return {
            _md5: md5,
            rawURL: props.isRtl ? soundIconRtl : soundIcon,
            ...otherData
        };
    });

    return (
        <LibraryComponent
            data={soundLibraryThumbnailData}
            id="soundLibrary"
            tags={soundTags}
            title={intl.formatMessage(messages.libraryTitle)}
            onItemMouseEnter={handleItemMouseEnter}
            onItemMouseLeave={handleItemMouseLeave}
            onItemSelected={handleItemSelected}
            onRequestClose={props.onRequestClose}
        />
    );
};

SoundLibrary.propTypes = {
    isRtl: PropTypes.bool,
    onNewSound: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
    isRtl: state.locales.isRtl
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SoundLibrary);
