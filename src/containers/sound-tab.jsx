import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import VM from 'scratch-vm';

import AssetPanel from '../components/asset-panel/asset-panel.jsx';
import soundIcon from '../components/asset-panel/icon--sound.svg';
import soundIconRtl from '../components/asset-panel/icon--sound-rtl.svg';
import addSoundFromLibraryIcon from '../components/asset-panel/icon--add-sound-lib.svg';
import addSoundFromRecordingIcon from '../components/asset-panel/icon--add-sound-record.svg';
import fileUploadIcon from '../components/action-menu/icon--file-upload.svg';
import surpriseIcon from '../components/action-menu/icon--surprise.svg';
import searchIcon from '../components/action-menu/icon--search.svg';

import RecordModal from './record-modal.jsx';
import SoundEditor from './sound-editor.jsx';
import SoundLibrary from './sound-library.jsx';

import soundLibraryContent from '../lib/libraries/sounds.json';
import {handleFileUpload, soundUpload} from '../lib/file-uploader.js';
import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import DragConstants from '../lib/drag-constants';
import downloadBlob from '../lib/download-blob';

import {connect} from 'react-redux';

import {
    closeSoundLibrary,
    openSoundLibrary,
    openSoundRecorder
} from '../reducers/modals';

import {
    activateTab,
    COSTUMES_TAB_INDEX
} from '../reducers/editor-tab';

import {setRestore} from '../reducers/restore-deletion';
import {showStandardAlert, closeAlertWithId} from '../reducers/alerts';

const SoundTab = props => {
    const intl = useIntl();
    const [selectedSoundIndex, setSelectedSoundIndex] = React.useState(0);
    const [fileInput, setFileInput] = React.useState(null);

    React.useEffect(() => {
        const {editingTarget, sprites, stage} = props;
        const target = editingTarget && sprites[editingTarget] ? sprites[editingTarget] : stage;
        if (!target || !target.sounds) {
            return;
        }

        if (props.editingTarget !== editingTarget) {
            setSelectedSoundIndex(0);
        } else if (selectedSoundIndex > target.sounds.length - 1) {
            setSelectedSoundIndex(Math.max(target.sounds.length - 1, 0));
        }
    }, [props.editingTarget, props.sprites, props.stage, selectedSoundIndex]);

    const handleDeleteSound = soundIndex => {
        const restoreFun = props.vm.deleteSound(soundIndex);
        if (soundIndex >= selectedSoundIndex) {
            setSelectedSoundIndex(Math.max(0, soundIndex - 1));
        }
        props.dispatchUpdateRestore({restoreFun, deletedItem: 'Sound'});
    };

    const handleSelectSound = soundIndex => {
        setSelectedSoundIndex(soundIndex);
    };

    const handleExportSound = soundIndex => {
        const item = props.vm.editingTarget.sprite.sounds[soundIndex];
        const blob = new Blob([item.asset.data], {type: item.asset.assetType.contentType});
        downloadBlob(`${item.name}.${item.asset.dataFormat}`, blob);
    };

    const handleDuplicateSound = soundIndex => {
        props.vm.duplicateSound(soundIndex).then(() => {
            setSelectedSoundIndex(soundIndex + 1);
        });
    };

    const handleNewSound = () => {
        if (!props.vm.editingTarget) {
            return null;
        }
        const sprite = props.vm.editingTarget.sprite;
        const sounds = sprite.sounds ? sprite.sounds : [];
        setSelectedSoundIndex(Math.max(sounds.length - 1, 0));
    };

    const handleSurpriseSound = () => {
        const soundItem = soundLibraryContent[Math.floor(Math.random() * soundLibraryContent.length)];
        const vmSound = {
            format: soundItem.format,
            md5: soundItem.md5,
            rate: soundItem.rate,
            sampleCount: soundItem.sampleCount,
            name: soundItem.name
        };
        props.vm.addSound(vmSound).then(() => {
            handleNewSound();
        });
    };

    const handleFileUploadClick = () => {
        fileInput.click();
    };

    const handleSoundUpload = e => {
        const storage = props.vm.runtime.storage;
        props.onShowImporting();
        handleFileUpload(e.target, (buffer, fileType, fileName, fileIndex, fileCount) => {
            soundUpload(buffer, fileType, storage, newSound => {
                newSound.name = fileName;
                props.vm.addSound(newSound).then(() => {
                    handleNewSound();
                    if (fileIndex === fileCount - 1) {
                        props.onCloseImporting();
                    }
                });
            });
        }, props.onCloseImporting);
    };

    const handleDrop = dropInfo => {
        if (dropInfo.dragType === DragConstants.SOUND) {
            const sprite = props.vm.editingTarget.sprite;
            const activeSound = sprite.sounds[selectedSoundIndex];

            props.vm.reorderSound(props.vm.editingTarget.id,
                dropInfo.index, dropInfo.newIndex);

            setSelectedSoundIndex(sprite.sounds.indexOf(activeSound));
        } else if (dropInfo.dragType === DragConstants.BACKPACK_COSTUME) {
            props.onActivateCostumesTab();
            props.vm.addCostume(dropInfo.payload.body, {
                name: dropInfo.payload.name
            });
        } else if (dropInfo.dragType === DragConstants.BACKPACK_SOUND) {
            props.vm.addSound({
                md5: dropInfo.payload.body,
                name: dropInfo.payload.name
            }).then(handleNewSound);
        }
    };

    const {
        dispatchUpdateRestore, // eslint-disable-line no-unused-vars
        isRtl,
        vm,
        onNewSoundFromLibraryClick,
        onNewSoundFromRecordingClick
    } = props;

    if (!vm.editingTarget) {
        return null;
    }

    const sprite = vm.editingTarget.sprite;

    const sounds = sprite.sounds ? sprite.sounds.map(sound => ({
        url: isRtl ? soundIconRtl : soundIcon,
        name: sound.name,
        details: (sound.sampleCount / sound.rate).toFixed(2),
        dragPayload: sound
    })) : [];

    const messages = defineMessages({
        fileUploadSound: {
            defaultMessage: 'Upload Sound',
            description: 'Button to upload sound from file in the editor tab',
            id: 'gui.soundTab.fileUploadSound'
        },
        surpriseSound: {
            defaultMessage: 'Surprise',
            description: 'Button to get a random sound in the editor tab',
            id: 'gui.soundTab.surpriseSound'
        },
        recordSound: {
            defaultMessage: 'Record',
            description: 'Button to record a sound in the editor tab',
            id: 'gui.soundTab.recordSound'
        },
        addSound: {
            defaultMessage: 'Choose a Sound',
            description: 'Button to add a sound in the editor tab',
            id: 'gui.soundTab.addSoundFromLibrary'
        }
    });

    return (
        <AssetPanel
            buttons={[{
                title: intl.formatMessage(messages.addSound),
                img: addSoundFromLibraryIcon,
                onClick: onNewSoundFromLibraryClick
            }, {
                title: intl.formatMessage(messages.fileUploadSound),
                img: fileUploadIcon,
                onClick: handleFileUploadClick,
                fileAccept: '.wav, .mp3',
                fileChange: handleSoundUpload,
                fileInput: setFileInput,
                fileMultiple: true
            }, {
                title: intl.formatMessage(messages.surpriseSound),
                img: surpriseIcon,
                onClick: handleSurpriseSound
            }, {
                title: intl.formatMessage(messages.recordSound),
                img: addSoundFromRecordingIcon,
                onClick: onNewSoundFromRecordingClick
            }, {
                title: intl.formatMessage(messages.addSound),
                img: searchIcon,
                onClick: onNewSoundFromLibraryClick
            }]}
            dragType={DragConstants.SOUND}
            isRtl={isRtl}
            items={sounds}
            selectedItemIndex={selectedSoundIndex}
            onDeleteClick={handleDeleteSound}
            onDrop={handleDrop}
            onDuplicateClick={handleDuplicateSound}
            onExportClick={handleExportSound}
            onItemClick={handleSelectSound}
        >
            {sprite.sounds && sprite.sounds[selectedSoundIndex] ? (
                <SoundEditor soundIndex={selectedSoundIndex} />
            ) : null}
            {props.soundRecorderVisible ? (
                <RecordModal
                    onNewSound={handleNewSound}
                />
            ) : null}
            {props.soundLibraryVisible ? (
                <SoundLibrary
                    vm={vm}
                    onNewSound={handleNewSound}
                    onRequestClose={props.onRequestCloseSoundLibrary}
                />
            ) : null}
        </AssetPanel>
    );
};

SoundTab.propTypes = {
    dispatchUpdateRestore: PropTypes.func,
    editingTarget: PropTypes.string,
    isRtl: PropTypes.bool,
    onActivateCostumesTab: PropTypes.func.isRequired,
    onCloseImporting: PropTypes.func.isRequired,
    onNewSoundFromLibraryClick: PropTypes.func.isRequired,
    onNewSoundFromRecordingClick: PropTypes.func.isRequired,
    onRequestCloseSoundLibrary: PropTypes.func.isRequired,
    onShowImporting: PropTypes.func.isRequired,
    soundLibraryVisible: PropTypes.bool,
    soundRecorderVisible: PropTypes.bool,
    sprites: PropTypes.shape({
        id: PropTypes.shape({
            sounds: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string.isRequired
            }))
        })
    }),
    stage: PropTypes.shape({
        sounds: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired
        }))
    }),
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
    editingTarget: state.scratchGui.targets.editingTarget,
    isRtl: state.locales.isRtl,
    sprites: state.scratchGui.targets.sprites,
    stage: state.scratchGui.targets.stage,
    soundLibraryVisible: state.scratchGui.modals.soundLibrary,
    soundRecorderVisible: state.scratchGui.modals.soundRecorder
});

const mapDispatchToProps = {
    onActivateCostumesTab: () => activateTab(COSTUMES_TAB_INDEX),
    onNewSoundFromLibraryClick: e => {
        e.preventDefault();
        return openSoundLibrary();
    },
    onNewSoundFromRecordingClick: openSoundRecorder,
    onRequestCloseSoundLibrary: closeSoundLibrary,
    dispatchUpdateRestore: setRestore,
    onCloseImporting: () => closeAlertWithId('importingAsset'),
    onShowImporting: () => showStandardAlert('importingAsset')
};

export default errorBoundaryHOC('Sound Tab')(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(SoundTab)
);