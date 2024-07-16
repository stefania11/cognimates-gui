<<<<<<< HEAD
import GUI from './containers/gui.jsx';
import AppStateHOC from './lib/app-state-hoc.jsx';
import GuiReducer, {guiInitialState, guiMiddleware, initEmbedded, initFullScreen, initPlayer} from './reducers/gui';
import LocalesReducer, {localesInitialState, initLocale} from './reducers/locales';
import {ScratchPaintReducer} from 'scratch-paint';
import {setFullScreen, setPlayer} from './reducers/mode';
import {remixProject} from './reducers/project-state';
import {setAppElement} from 'react-modal';

// Import main SCSS file
import './css/main.scss';

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
||||||| empty tree
=======
import PaintEditor from './containers/paint-editor.jsx';
import ScratchPaintReducer from './reducers/scratch-paint-reducer';

export {
    PaintEditor as default,
    ScratchPaintReducer
};
>>>>>>> 44bfbedd623e6fb6bdaa93dd097bd29446df8917
