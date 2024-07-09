import React from 'react';
import ReactDOM from 'react-dom';
import {compose} from 'redux';
import PropTypes from 'prop-types';

import AppStateHOC from '../lib/app-state-hoc.jsx';
import GUI from '../containers/gui.jsx';
import HashParserHOC from '../lib/hash-parser-hoc.jsx';
import TitledHOC from '../lib/titled-hoc.jsx';
import log from '../lib/log.js';

const onClickLogo = () => {
    window.location = 'http://cognimates.me';
};

const handleTelemetryModalCancel = () => {
    log('User canceled telemetry modal');
};

const handleTelemetryModalOptIn = () => {
    log('User opted into telemetry');
};

const handleTelemetryModalOptOut = () => {
    log('User opted out of telemetry');
};

/*
 * Render the GUI playground. This is a separate function because importing anything
 * that instantiates the VM causes unsupported browsers to crash
 * {object} appTarget - the DOM element to render to
 */
class ErrorBoundary extends React.Component {
    static getDerivedStateFromError (error) {
        // Update state so the next render will show the fallback UI.
        log.error('ErrorBoundary caught an error in getDerivedStateFromError:', error);
        return {hasError: true};
    }

    constructor (props) {
        super(props);
        this.state = {hasError: false};
    }

    componentDidCatch (error, errorInfo) {
        // Log the error to an error reporting service
        try {
            fetch('/log-error', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    error: error.toString(),
                    errorInfo
                })
            });
        } catch (fetchError) {
            log.error('Failed to log error to server:', fetchError);
        }
    }

    render () {
        if (this.state.hasError) {
            // Render custom fallback UI
            return (
                <div>
                    <h1>{'Something went wrong.'}</h1>
                    <p>{'Please try refreshing the page or contact support if the issue persists.'}</p>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node
};

export default appTarget => {
    GUI.setAppElement(appTarget);

    // note that redux's 'compose' function is just being used as a general utility to make
    // the hierarchy of HOC constructor calls clearer here; it has nothing to do with redux's
    // ability to compose reducers.
    const WrappedGui = compose(
        AppStateHOC,
        HashParserHOC,
        TitledHOC
    )(GUI);

    // TODO a hack for testing the backpack, allow backpack host to be set by url param
    const backpackHostMatches = window.location.href.match(/[?&]backpack_host=([^&]*)&?/);
    const backpackHost = backpackHostMatches ? backpackHostMatches[1] : null;

    const scratchDesktopMatches = window.location.href.match(/[?&]isScratchDesktop=([^&]+)/);
    let simulateScratchDesktop;
    if (scratchDesktopMatches) {
        try {
            // parse 'true' into `true`, 'false' into `false`, etc.
            simulateScratchDesktop = JSON.parse(scratchDesktopMatches[1]);
        } catch {
            // it's not JSON so just use the string
            // note that a typo like "falsy" will be treated as true
            simulateScratchDesktop = scratchDesktopMatches[1];
        }
    }

    if (process.env.NODE_ENV === 'production' && typeof window === 'object') {
        // Warn before navigating away
        window.onbeforeunload = () => true;
    }

    try {
        ReactDOM.render(
            // important: this is checking whether `simulateScratchDesktop` is truthy, not just defined!
            <ErrorBoundary>
                {simulateScratchDesktop ?
                    <WrappedGui
                        isScratchDesktop
                        showTelemetryModal
                        canSave={false}
                        onTelemetryModalCancel={handleTelemetryModalCancel}
                        onTelemetryModalOptIn={handleTelemetryModalOptIn}
                        onTelemetryModalOptOut={handleTelemetryModalOptOut}
                    /> :
                    <WrappedGui
                        backpackVisible
                        showComingSoon
                        backpackHost={backpackHost}
                        canSave={false}
                        onClickLogo={onClickLogo}
                    />}
            </ErrorBoundary>,
            appTarget);
    } catch (error) {
        log.error('Error during ReactDOM.render:', error);
    }
};
