import 'get-float-time-domain-data';
import getUserMedia from 'get-user-media-promise';
import SharedAudioContext, {initializeAudioContext} from './shared-audio-context.js';
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

    startRecording () {
        if (!this.audioContext) {
            throw new Error('AudioContext is not initialized.');
        }
        this.recording = true;
    }

    async attachUserMediaStream (userMediaStream, onUpdate, onError) {
        this.userMediaStream = userMediaStream;
        try {
            await initializeAudioContext();
            this.audioContext = new SharedAudioContext();
            this.mediaStreamSource = this.audioContext.createMediaStreamSource(userMediaStream);
            this.sourceNode = this.audioContext.createGain();
            this.scriptProcessorNode = this.audioContext.createScriptProcessor(this.bufferLength, 2, 2);

            this.scriptProcessorNode.onaudioprocess = processEvent => {
                if (this.recording && !this.disposed) {
                    this.buffers.push(new Float32Array(processEvent.inputBuffer.getChannelData(0)));
                }
            };

            this.analyserNode = this.audioContext.createAnalyser();
            this.analyserNode.fftSize = 2048;

            const bufferLength = this.analyserNode.frequencyBinCount;
            const dataArray = new Float32Array(bufferLength);

            const update = () => {
                if (this.disposed) return;
                requestAnimationFrame(update);
                this.analyserNode.getFloatTimeDomainData(dataArray);
                onUpdate(computeRMS(dataArray));
            };

            requestAnimationFrame(update);

            // Wire everything together, ending in the destination
            this.mediaStreamSource.connect(this.sourceNode);
            this.sourceNode.connect(this.analyserNode);
            this.analyserNode.connect(this.scriptProcessorNode);
            // Defer connection to audioContext.destination until after a user gesture
            document.addEventListener('click', this.connectToDestination.bind(this));
            document.addEventListener('touchstart', this.connectToDestination.bind(this));
        } catch (error) {
            onError(error);
        }
    }

    connectToDestination() {
        if (this.scriptProcessorNode && this.audioContext) {
            this.scriptProcessorNode.connect(this.audioContext.destination);
        }
    }

    stop () {
        if (!this.audioContext) {
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
        }
        this.disposed = true;
    }
}

export default AudioRecorder;
