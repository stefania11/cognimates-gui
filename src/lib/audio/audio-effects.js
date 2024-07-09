import EchoEffect from './effects/echo-effect.js';
import RobotEffect from './effects/robot-effect.js';
import VolumeEffect from './effects/volume-effect.js';
import {initializeAudioContext} from './shared-audio-context.js';

const effectTypes = {
    ROBOT: 'robot',
    REVERSE: 'reverse',
    LOUDER: 'higher',
    SOFTER: 'lower',
    FASTER: 'faster',
    SLOWER: 'slower',
    ECHO: 'echo'
};

class AudioEffects {
    static get effectTypes () {
        return effectTypes;
    }
    constructor (buffer, name) {
        // Some effects will modify the playback rate and/or number of samples.
        // Need to precompute those values to create the offline audio context.
        const pitchRatio = Math.pow(2, 4 / 12); // A major third
        let sampleCount = buffer.length;
        let playbackRate = 1;
        switch (name) {
        case effectTypes.ECHO:
            sampleCount = buffer.length + (0.25 * 3 * buffer.sampleRate);
            break;
        case effectTypes.FASTER:
            playbackRate = pitchRatio;
            sampleCount = Math.floor(buffer.length / playbackRate);
            break;
        case effectTypes.SLOWER:
            playbackRate = 1 / pitchRatio;
            sampleCount = Math.floor(buffer.length / playbackRate);
            break;
        }
        this.buffer = buffer;
        this.name = name;
    }
    async process () {
        try {
            // Ensure the AudioContext is initialized before processing
            await initializeAudioContext();

            // Create the OfflineAudioContext after the AudioContext is initialized
            const pitchRatio = Math.pow(2, 4 / 12); // A major third
            let sampleCount = this.buffer.length;
            let playbackRate = 1;
            switch (this.name) {
            case effectTypes.ECHO:
                sampleCount = this.buffer.length + (0.25 * 3 * this.buffer.sampleRate);
                break;
            case effectTypes.FASTER:
                playbackRate = pitchRatio;
                sampleCount = Math.floor(this.buffer.length / playbackRate);
                break;
            case effectTypes.SLOWER:
                playbackRate = 1 / pitchRatio;
                sampleCount = Math.floor(this.buffer.length / playbackRate);
                break;
            }
            if (window.OfflineAudioContext) {
                this.audioContext = new window.OfflineAudioContext(1, sampleCount, this.buffer.sampleRate);
            } else {
                // Need to use webkitOfflineAudioContext, which doesn't support all sample rates.
                // Resample by adjusting sample count to make room and set offline context to desired sample rate.
                const sampleScale = 44100 / this.buffer.sampleRate;
                this.audioContext = new window.webkitOfflineAudioContext(1, sampleScale * sampleCount, 44100);
            }

            // For the reverse effect we need to manually reverse the data into a new audio buffer
            // to prevent overwriting the original, so that the undo stack works correctly.
            // Doing buffer.reverse() would mutate the original data.
            if (this.name === effectTypes.REVERSE) {
                const originalBufferData = this.buffer.getChannelData(0);
                const newBuffer = this.audioContext.createBuffer(1, this.buffer.length, this.buffer.sampleRate);
                const newBufferData = newBuffer.getChannelData(0);
                const bufferLength = this.buffer.length;
                for (let i = 0; i < bufferLength; i++) {
                    newBufferData[i] = originalBufferData[bufferLength - i - 1];
                }
                this.buffer = newBuffer;
            }

            this.source = this.audioContext.createBufferSource();
            this.source.buffer = this.buffer;
            this.source.playbackRate.value = playbackRate;

            // Some effects need to use more nodes and must expose an input and output
            let input;
            let output;
            switch (this.name) {
            case effectTypes.LOUDER:
                ({input, output} = new VolumeEffect(this.audioContext, 1.25));
                break;
            case effectTypes.SOFTER:
                ({input, output} = new VolumeEffect(this.audioContext, 0.75));
                break;
            case effectTypes.ECHO:
                ({input, output} = new EchoEffect(this.audioContext, 0.25));
                break;
            case effectTypes.ROBOT:
                ({input, output} = new RobotEffect(this.audioContext, 0.25));
                break;
            }

            if (input && output) {
                this.source.connect(input);
                output.connect(this.audioContext.destination);
            } else {
                // No effects nodes are needed, wire directly to the output
                this.source.connect(this.audioContext.destination);
            }

            this.source.start();

            await this.audioContext.startRendering();

            // Start the oscillator for the RobotEffect after rendering
            if (this.name === effectTypes.ROBOT) {
                input.startOscillator();
            }
        } catch (error) {
            throw new Error(`Error initializing AudioContext: ${error.message}`);
        }
    }
}

export default AudioEffects;
