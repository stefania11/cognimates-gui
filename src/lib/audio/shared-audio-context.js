import bowser from 'bowser';

let AUDIO_CONTEXT;

/**
 * Placeholder function for logging errors to a remote service
 * @param {Error} error - The error object
 */
const logErrorToService = error => {
    // Placeholder for error logging implementation
    // Using the error parameter to avoid linter warning
    const _errorMessage = error.toString();
    // Intended use: send _errorMessage to a remote logging service
};

/**
 * Initialize the AudioContext on user interaction
 * @param {Error} error - The error object
 */
const handleError = error => {
    // Implement a more robust error handling strategy here
    // For example, log the error to a monitoring service or display a user-friendly message
    // Placeholder for error handling logic
    logErrorToService(error);
};

const initializeAudioContext = function () {
    return new Promise((resolve, reject) => {
        if (!AUDIO_CONTEXT && !bowser.msie) {
            AUDIO_CONTEXT = new (window.AudioContext || window.webkitAudioContext)();
            AUDIO_CONTEXT.resume().then(() => {
                // AudioContext resumed successfully
                console.log('AudioContext resumed successfully');
                resolve();
            })
                .catch(error => {
                    // Error resuming AudioContext
                    console.error('Error resuming AudioContext:', error);
                    handleError(error);
                    reject(error);
                });
        } else {
            resolve();
        }
    });
};

/**
 * Initialize the AudioContext only once
 */
let audioContextInitialized = false;

const initializeAudioContextOnce = () => new Promise((resolve, reject) => {
    if (audioContextInitialized) {
        resolve();
        return;
    }
    audioContextInitialized = true;
    initializeAudioContext()
        .then(() => {
            // Remove event listeners after successful initialization
            document.removeEventListener('click', initializeAudioContextOnce);
            document.removeEventListener('touchstart', initializeAudioContextOnce);
            console.log('AudioContext initialized once');
            resolve();
        })
        .catch(error => {
            console.error('Error initializing AudioContext once:', error);
            handleError(error);
            reject(error);
        });
});

document.addEventListener('click', () => {
    initializeAudioContextOnce().then(() => {
        if (window.audioRecorderInstance) {
            window.audioRecorderInstance.handleUserGesture();
        }
    });
});
document.addEventListener('touchstart', () => {
    initializeAudioContextOnce().then(() => {
        if (window.audioRecorderInstance) {
            window.audioRecorderInstance.handleUserGesture();
        }
    });
});

/**
 * Wrap browser AudioContext because we shouldn't create more than one
 * @return {AudioContext} The singleton AudioContext
 */
export default async function () {
    try {
        await initializeAudioContextOnce();
        return AUDIO_CONTEXT;
    } catch (error) {
        console.error('Error in default export function:', error);
        handleError(error);
        throw error;
    }
}

export {initializeAudioContext, initializeAudioContextOnce};
