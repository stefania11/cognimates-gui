const LOAD_EXTENSION_FROM_URL = 'scratch-gui/extension-loader/LOAD_EXTENSION_FROM_URL';
const SET_LOADING_STATE = 'scratch-gui/extension-loader/SET_LOADING_STATE';

const extensionLoadingStates = {
  EXTENSION_NOT_LOADED: 'EXTENSION_NOT_LOADED',
  EXTENSION_LOADING: 'EXTENSION_LOADING'
}

const initialState = {
    extensionUrl: '',
    extensionLoadingState: extensionLoadingStates.EXTENSION_NOT_LOADED
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
      case LOAD_EXTENSION_FROM_URL:
          return Object.assign({}, state, {
              extensionUrl: action.url
          });
      case SET_LOADING_STATE:
          return Object.assign({}, state, {
              extensionLoadingState: action.extensionLoadingState,
              extensionUrl: action.url
          });
      default:
          return state;
    }
}

const loadExtensionFromURL = function (url) {
    return {
      type: LOAD_EXTENSION_FROM_URL,
      url: url
    };
}

const setExtensionLoading = function () {
    return {
      type: SET_LOADING_STATE,
      extensionLoadingState: extensionLoadingStates.EXTENSION_LOADING
    }
}

const setExtensionLoaded = function () {
    return {
      type: SET_LOADING_STATE,
      extensionLoadingState: extensionLoadingStates.EXTENSION_NOT_LOADED,
      url: ''
    }
}

const isExtensionUrlProvided = function (extensionUrl) {
    return (extensionUrl != '');
}

export {
    reducer as default,
    initialState as extensionLoaderInitialState,
    extensionLoadingStates,
    loadExtensionFromURL,
    isExtensionUrlProvided,
    setExtensionLoading,
    setExtensionLoaded
};
