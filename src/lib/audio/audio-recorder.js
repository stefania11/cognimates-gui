import 'get-float-time-domain-data';
import getUserMedia from 'get-user-media-promise';
import SharedAudioContext, {initializeAudioContextOnce} from './shared-audio-context.js';
import {computeRMS} from './audio-util.js';

class AudioRecorder {
    constructor () {
        this.audioContext = null;
        this.bufferLength = 1024;

        this.userMediaStream = null;
        this.mediaStreamSource = null;
        this.sourceNode = null;
        this.scriptProcessorNode = null;
        this.analyserNode = null;

        this.recordedSamples = 0;
        this.recording = false;
        this.started = false;
        this.buffers = [];

        this.disposed = false;
        this.localErrorLog = []; // Initialize localErrorLog as an empty array
    }

    getLocalErrorLog () {
        return [...this.localErrorLog]; // Return a copy of the array
    }

    clearLocalErrorLog () {
        this.localErrorLog = [];
    }

    logMessage (message, context = '') {
        this.localErrorLog.push({
            message: message.toString(),
            stack: message.stack,
            context: context
        });
    }

    startListening (onStarted, onUpdate, onError) {
        try {
            getUserMedia({audio: true})
                .then(userMediaStream => {
                    if (!this.disposed) {
                        this.started = true;
                        onStarted();
                        this.attachUserMediaStream(userMediaStream, onUpdate, onError);
                    }
                })
                .catch(e => {
                    if (!this.disposed) {
                        onError(e);
                    }
                });
        } catch (e) {
            if (!this.disposed) {
                onError(e);
            }
        }
    }

    async startRecording () {
        if (!this.audioContext) {
            this.logMessage('AudioContext is not initialized. Initializing now...');
            await initializeAudioContextOnce();
            this.audioContext = new SharedAudioContext();
            this.logMessage('AudioContext initialized.');
        }
        this.recording = true;
    }

    async attachUserMediaStream (userMediaStream, onUpdate, onError) {
        this.userMediaStream = userMediaStream;
        try {
            if (!this.audioContext) {
                this.logMessage('Initializing AudioContext...');
                await initializeAudioContextOnce();
                this.logMessage('AudioContext initialized.');
                this.audioContext = new SharedAudioContext();
                this.logMessage('SharedAudioContext created.');
                this.mediaStreamSource = this.audioContext.createMediaStreamSource(this.userMediaStream);
                this.sourceNode = this.audioContext.createGain();
                this.scriptProcessorNode = this.audioContext.createScriptProcessor(this.bufferLength, 2, 2);
                this.analyserNode = this.audioContext.createAnalyser();
                this.analyserNode.fftSize = 2048;
            }

            this.scriptProcessorNode.onaudioprocess = processEvent => {
                if (this.recording && !this.disposed) {
                    this.buffers.push(new Float32Array(processEvent.inputBuffer.getChannelData(0)));
                }
            };

            try {
                this.mediaStreamSource.connect(this.sourceNode);
                this.sourceNode.connect(this.analyserNode);
                this.analyserNode.connect(this.scriptProcessorNode);
                this.connectToDestination();
            } catch (error) {
                this.logMessage(error, 'Error connecting audio nodes in attachUserMediaStream');
                onError(error);
            }

            const update = () => {
                if (this.disposed) return;
                requestAnimationFrame(update);
                if (this.analyserNode) {
                    const bufferLength = this.analyserNode.frequencyBinCount;
                    const dataArray = new Float32Array(bufferLength);
                    this.analyserNode.getFloatTimeDomainData(dataArray);
                    onUpdate(computeRMS(dataArray));
                }
            };

            requestAnimationFrame(update);
        } catch (error) {
            this.logMessage(error, 'Error in attachUserMediaStream');
            onError(error);
        }
    }

    connectToDestination () {
        if (this.scriptProcessorNode && this.audioContext) {
            this.scriptProcessorNode.connect(this.audioContext.destination);
        }
    }

    stop () {
        if (!this.audioContext) {
            const error = new Error('AudioContext is not initialized.');
            this.logMessage(error);
            return null;
        }

        const chunkLevels = this.buffers.map(buffer => computeRMS(buffer));
        const maxRMS = Math.max.apply(null, chunkLevels);
        const threshold = maxRMS / 8;

        let firstChunkAboveThreshold = null;
        let lastChunkAboveThreshold = null;
        for (let i = 0; i < chunkLevels.length; i++) {
            if (chunkLevels[i] > threshold) {
                if (firstChunkAboveThreshold === null) firstChunkAboveThreshold = i + 1;
                lastChunkAboveThreshold = i + 1;
            }
        }

        let trimStart = Math.max(2, firstChunkAboveThreshold - 2) / this.buffers.length;
        let trimEnd = Math.min(this.buffers.length - 2, lastChunkAboveThreshold + 2) / this.buffers.length;

        // With very few samples, the automatic trimming can produce invalid values
        if (trimStart >= trimEnd) {
            trimStart = 0;
            trimEnd = 1;
        }

        const buffer = new Float32Array(this.buffers.length * this.bufferLength);

        let offset = 0;
        for (let i = 0; i < this.buffers.length; i++) {
            const bufferChunk = this.buffers[i];
            buffer.set(bufferChunk, offset);
            offset += bufferChunk.length;
        }

        return {
            levels: chunkLevels,
            samples: buffer,
            sampleRate: this.audioContext.sampleRate,
            trimStart: trimStart,
            trimEnd: trimEnd
        };
    }

    dispose () {
        if (this.started) {
            try {
                if (this.scriptProcessorNode) {
                    this.scriptProcessorNode.onaudioprocess = null;
                    this.scriptProcessorNode.disconnect();
                }
                if (this.analyserNode) {
                    this.analyserNode.disconnect();
                }
                if (this.sourceNode) {
                    this.sourceNode.disconnect();
                }
                if (this.mediaStreamSource) {
                    this.mediaStreamSource.disconnect();
                }
                if (this.userMediaStream) {
                    this.userMediaStream.getAudioTracks()[0].stop();
                }
            } catch (error) {
                this.logMessage(error, 'Error in dispose');
            }
        }
        this.disposed = true;
    }
}

export default AudioRecorder;
