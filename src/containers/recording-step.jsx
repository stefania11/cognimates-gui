import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import RecordingStepComponent from '../components/record-modal/recording-step.jsx';
import AudioRecorder from '../lib/audio/audio-recorder.js';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
    alertMsg: {
        defaultMessage: 'Could not start recording',
        description: 'Alert for recording error',
        id: 'gui.recordingStep.alertMsg'
    }
});

const RecordingStep = ({ onRecord, onStopRecording, recording, ...componentProps }) => {
    const intl = useIntl();
    const [listening, setListening] = useState(false);
    const [level, setLevel] = useState(0);
    const [levels, setLevels] = useState(null);
    const [audioRecorder, setAudioRecorder] = useState(null);

    const handleStarted = useCallback(() => {
        setListening(true);
    }, []);

    const handleRecordingError = useCallback(() => {
        alert(intl.formatMessage(messages.alertMsg)); // eslint-disable-line no-alert
    }, [intl]);

    const handleLevelUpdate = useCallback((newLevel) => {
        setLevel(newLevel);
        if (recording) {
            setLevels((prevLevels) => (prevLevels || []).concat([newLevel]));
        }
    }, [recording]);

    const handleRecord = useCallback(() => {
        audioRecorder.startRecording();
        onRecord();
    }, [audioRecorder, onRecord]);

    const handleStopRecording = useCallback(() => {
        const { samples, sampleRate, levels: recordedLevels, trimStart, trimEnd } = audioRecorder.stop();
        onStopRecording(samples, sampleRate, recordedLevels, trimStart, trimEnd);
    }, [audioRecorder, onStopRecording]);

    useEffect(() => {
        const newAudioRecorder = new AudioRecorder();
        setAudioRecorder(newAudioRecorder);
        window.audioRecorderInstance = newAudioRecorder; // Set the global audioRecorderInstance
        newAudioRecorder.startListening(handleStarted, handleLevelUpdate, handleRecordingError);

        return () => {
            newAudioRecorder.dispose();
            window.audioRecorderInstance = null; // Clean up the global audioRecorderInstance
        };
    }, [handleStarted, handleLevelUpdate, handleRecordingError]);

    return (
        <RecordingStepComponent
            level={level}
            levels={levels}
            listening={listening}
            onRecord={handleRecord}
            onStopRecording={handleStopRecording}
            {...componentProps}
        />
    );
};

RecordingStep.propTypes = {
    onRecord: PropTypes.func.isRequired,
    onStopRecording: PropTypes.func.isRequired,
    recording: PropTypes.bool
};

export default RecordingStep;