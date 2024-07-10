import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import ConnectedIntlProvider from './connected-intl-provider.jsx';

import localesReducer, {initLocale, localesInitialState} from '../reducers/locales';

import {setPlayer, setFullScreen} from '../reducers/mode.js';

import locales from 'scratch-l10n';
import {detectLocale} from './detect-locale';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Logging middleware to capture state and actions
const loggerMiddleware = next => action => {
    const sanitizedAction = {...action};
    // Sanitize action payload if necessary
    return next(sanitizedAction);
};

/*
 * Higher Order Component to provide redux state. If an `intl` prop is provided
 * it will override the internal `intl` redux state
 * @param {React.Component} WrappedComponent - component to provide state for
 * @param {boolean} localesOnly - only provide the locale state, not everything
 *                      required by the GUI. Used to exclude excess state when
 *                      only rendering modals, not the GUI.
 * @returns {React.Component} component with redux and intl state provided
 */
const AppStateHOC = function (WrappedComponent, localesOnly) {
    class AppStateWrapper extends React.Component {
        constructor (props) {
            super(props);
            this.state = {
                hasError: false,
                errorMessage: ''
            };
            let initialState = {};
            let reducers = {};
            let enhancer;

            let initializedLocales = localesInitialState;
            const locale = detectLocale(Object.keys(locales));
            if (locale !== 'en') {
                initializedLocales = initLocale(initializedLocales, locale);
            }
            if (localesOnly) {
                // Used for instantiating minimal state for the unsupported
                // browser modal
                reducers = {locales: localesReducer};
                initialState = {locales: initializedLocales};
                enhancer = composeEnhancers(applyMiddleware(loggerMiddleware));
            } else {
                // You are right, this is gross. But it's necessary to avoid
                // importing unneeded code that will crash unsupported browsers.
                const guiRedux = require('../reducers/gui');
                const guiReducer = guiRedux.default;
                const {
                    guiInitialState,
                    guiMiddleware,
                    initFullScreen,
                    initPlayer,
                    initTelemetryModal
                } = guiRedux;
                const {ScratchPaintReducer} = require('scratch-paint');

                let initializedGui = guiInitialState;
                if (props.isFullScreen || props.isPlayerOnly) {
                    if (props.isFullScreen) {
                        initializedGui = initFullScreen(initializedGui);
                    }
                    if (props.isPlayerOnly) {
                        initializedGui = initPlayer(initializedGui);
                    }
                } else if (props.showTelemetryModal) {
                    initializedGui = initTelemetryModal(initializedGui);
                }
                reducers = {
                    locales: localesReducer,
                    scratchGui: guiReducer,
                    scratchPaint: ScratchPaintReducer
                };
                initialState = {
                    locales: initializedLocales,
                    scratchGui: initializedGui
                };
                enhancer = composeEnhancers(applyMiddleware(guiMiddleware, loggerMiddleware));
            }
            try {
                // Log the state of variables before creating the store

                const reducer = combineReducers(reducers);
                this.store = createStore(
                    reducer,
                    initialState,
                    enhancer
                );

                // Log the created store

                if (process.env.NODE_ENV === 'development') {
                    // Expose the store on the window object for debugging
                    window.store = this.store;
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error initializing Redux store:', error);

                // Additional detailed logging for debugging
                // eslint-disable-next-line no-console
                console.error('Reducers:', reducers);
                // eslint-disable-next-line no-console
                console.error('Initial State:', initialState);
                // eslint-disable-next-line no-console
                console.error('Enhancer:', enhancer);

                // Implement a more robust error logging mechanism
                // Intended use: send error details to a remote logging service
                fetch('http://localhost:8602/log-error', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        error: error.toString(),
                        stack: error.stack,
                        reducers: JSON.stringify(reducers),
                        initialState: JSON.stringify(initialState),
                        enhancer: enhancer.toString()
                    })
                }).catch(fetchError => {
                    // eslint-disable-next-line no-console
                    console.error('Failed to log error to server:', fetchError);
                });

                // Set the error state with additional information
                this.setState({hasError: true, errorMessage: error.message});
            }
        }
        componentDidUpdate (prevProps) {
            if (localesOnly) return;
            if (prevProps.isPlayerOnly !== this.props.isPlayerOnly) {
                this.store.dispatch(setPlayer(this.props.isPlayerOnly));
            }
            if (prevProps.isFullScreen !== this.props.isFullScreen) {
                this.store.dispatch(setFullScreen(this.props.isFullScreen));
            }
        }
        componentDidCatch (error, errorInfo) {
            // Log the error details to the console for debugging
            // eslint-disable-next-line no-console
            console.error('Error caught by componentDidCatch:', error, errorInfo);

            // Implement a more robust error logging mechanism
            // Intended use: send error details to a remote logging service
            fetch('http://localhost:8602/log-error', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    error: error.toString(),
                    errorInfo
                })
            }).catch(fetchError => {
                // eslint-disable-next-line no-console
                console.error('Failed to log error to server:', fetchError);
            });

            // Set the error state with additional information
            this.setState({hasError: true, errorMessage: error.message});
        }
        render () {
            const {
                isFullScreen, // eslint-disable-line no-unused-vars
                isPlayerOnly, // eslint-disable-line no-unused-vars
                showTelemetryModal, // eslint-disable-line no-unused-vars
                ...componentProps
            } = this.props;
            if (this.state.hasError || !this.store) {
                return <div>{`Error initializing Redux store: ${this.state.errorMessage || 'Store not found'}`}</div>;
            }
            return (
                <Provider store={this.store}>
                    <ConnectedIntlProvider>
                        <WrappedComponent
                            {...componentProps}
                        />
                    </ConnectedIntlProvider>
                </Provider>
            );
        }
    }
    AppStateWrapper.propTypes = {
        isFullScreen: PropTypes.bool,
        isPlayerOnly: PropTypes.bool
    };
    return AppStateWrapper;
};

export default AppStateHOC;
