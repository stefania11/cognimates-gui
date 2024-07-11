import GUI from './containers/gui.jsx';
import AppStateHOC from './lib/app-state-hoc.jsx';
import GuiReducer, {guiInitialState, guiMiddleware, initEmbedded, initFullScreen, initPlayer} from './reducers/gui';
import LocalesReducer, {localesInitialState, initLocale} from './reducers/locales';
import {ScratchPaintReducer} from 'scratch-paint';
import {setFullScreen, setPlayer} from './reducers/mode';
import {remixProject} from './reducers/project-state';
import {setAppElement} from 'react-modal';

// Import global SCSS files
import '../css/colors.scss';
import '../css/units.scss';
import '../css/z-index.scss';

console.log('Initializing application...');

const guiReducers = {
    locales: LocalesReducer,
    scratchGui: GuiReducer,
    scratchPaint: ScratchPaintReducer
};

console.log('Reducers initialized:', guiReducers);

try {
    console.log('Setting up application state...');
    const appState = AppStateHOC(GUI);
    console.log('Application state set up successfully:', appState);
} catch (error) {
    console.error('Error setting up application state:', error);
}

export {
    GUI as default,
    AppStateHOC,
    setAppElement,
    guiReducers,
    guiInitialState,
    guiMiddleware,
    initEmbedded,
    initPlayer,
    initFullScreen,
    initLocale,
    localesInitialState,
    remixProject,
    setFullScreen,
    setPlayer
};

console.log('Application setup complete.');
