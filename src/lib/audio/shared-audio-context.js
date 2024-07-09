import StartAudioContext from 'startaudiocontext';
import bowser from 'bowser';

let AUDIO_CONTEXT;

/**
 * Initialize the AudioContext on user interaction
 * @param {Error} error - The error object
 */
const handleError = error => {
    // Implement a more robust error handling strategy here
    // For example, log the error to a monitoring service or display a user-friendly message
    // Placeholder for error handling logic
    // Error logging to a monitoring service
    fetch('/log-error', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            error: error.toString()
        })
    }).catch(() => {
        // Fetch error handling (e.g., retry logic or alternative logging)
    });
};

const initializeAudioContext = function () {
    return new Promise((resolve, reject) => {
        if (!AUDIO_CONTEXT && !bowser.msie) {
            AUDIO_CONTEXT = new (window.AudioContext || window.webkitAudioContext)();
            StartAudioContext(AUDIO_CONTEXT);
            AUDIO_CONTEXT.resume().then(() => {
                // AudioContext resumed successfully
                resolve();
            })
                .catch(error => {
                    // Error resuming AudioContext
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

const initializeAudioContextOnce = () => {
    if (!audioContextInitialized) {
        audioContextInitialized = true;
        initializeAudioContext().catch(handleError);
    }
};

document.addEventListener('click', () => {
    initializeAudioContextOnce();
});

document.addEventListener('touchstart', () => {
    initializeAudioContextOnce();
});

/**
 * Wrap browser AudioContext because we shouldn't create more than one
 * @return {AudioContext} The singleton AudioContext
 */
export default async function () {
    if (!AUDIO_CONTEXT) {
        await initializeAudioContext();
    }
    return AUDIO_CONTEXT;
}

export {initializeAudioContext, initializeAudioContextOnce};
