import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {defineMessages, useIntl, FormattedMessage} from 'react-intl';

import analytics from '../lib/analytics';
import log from '../lib/log';
import sharedMessages from '../lib/shared-messages';

import {
    LoadingStates,
    getIsLoadingUpload,
    getIsShowingWithoutId,
    onLoadedProject,
    requestProjectUpload
} from '../reducers/project-state';

import {
    openLoadingProject,
    closeLoadingProject
} from '../reducers/modals';
import {
    closeFileMenu
} from '../reducers/menus';

/**
 * SBFileUploader component passes a file input, load handler and props to its child.
 * It expects this child to be a function with the signature
 *     function (renderFileInput, loadProject) {}
 * The component can then be used to attach project loading functionality
 * to any other component:
 *
 * <SBFileUploader>{(renderFileInput, loadProject) => (
 *     <MyCoolComponent
 *         onClick={loadProject}
 *     >
 *         {renderFileInput()}
 *     </MyCoolComponent>
 * )}</SBFileUploader>
 */

const messages = defineMessages({
    loadError: {
        id: 'gui.projectLoader.loadError',
        defaultMessage: 'The project file that was selected failed to load.',
        description: 'An error that displays when a local project file fails to load.'
    }
});

const SBFileUploader = props => {
    const intl = useIntl();
    const [reader, setReader] = React.useState(null);
    const [fileToUpload, setFileToUpload] = React.useState(null);
    const fileInputRef = React.useRef(null);

    React.useEffect(() => {
        const newReader = new FileReader();
        newReader.onload = onload;
        setReader(newReader);
        return () => {
            setReader(null);
            resetFileInput();
        };
    }, []);

    React.useEffect(() => {
        if (props.isLoadingUpload && fileToUpload && reader) {
            reader.readAsArrayBuffer(fileToUpload);
        }
    }, [props.isLoadingUpload, fileToUpload, reader]);

    const resetFileInput = () => {
        setFileToUpload(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const getProjectTitleFromFilename = fileInputFilename => {
        if (!fileInputFilename) return '';
        const matches = fileInputFilename.match(/^(.*)\.sb[23]?$/);
        if (!matches) return '';
        return matches[1].substring(0, 100);
    };

    const handleChange = e => {
        const {
            isShowingWithoutId,
            loadingState,
            projectChanged
        } = props;

        const thisFileInput = e.target;
        if (thisFileInput.files) {
            const newFileToUpload = thisFileInput.files[0];
            setFileToUpload(newFileToUpload);

            const uploadAllowed = (isShowingWithoutId && projectChanged) ?
                confirm(intl.formatMessage(sharedMessages.replaceProjectWarning)) :
                true;

            if (uploadAllowed) props.requestProjectUpload(loadingState);
        }
    };

    const onload = () => {
        if (reader) {
            props.onLoadingStarted();
            const filename = fileToUpload && fileToUpload.name;
            props.vm.loadProject(reader.result)
                .then(() => {
                    analytics.event({
                        category: 'project',
                        action: 'Import Project File',
                        nonInteraction: true
                    });
                    try {
                        history.replaceState({}, document.title, '.');
                    } catch {
                        // No fallback, just do not trigger promise catch below
                    }
                    props.onLoadingFinished(props.loadingState, true);
                    if (filename) {
                        const uploadedProjectTitle = getProjectTitleFromFilename(filename);
                        props.onUpdateProjectTitle(uploadedProjectTitle);
                    }
                    resetFileInput();
                })
                .catch(error => {
                    log.warn(error);
                    alert(intl.formatMessage(messages.loadError));
                    props.onLoadingFinished(props.loadingState, false);
                    resetFileInput();
                });
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const renderFileInput = () => {
        return (
            <input
                accept=".sb,.sb2,.sb3"
                ref={fileInputRef}
                style={{display: 'none'}}
                type="file"
                onChange={handleChange}
            />
        );
    };

    return props.children(props.className, renderFileInput, handleClick);
};

SBFileUploader.propTypes = {
    canSave: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    children: PropTypes.func,
    className: PropTypes.string,
    isLoadingUpload: PropTypes.bool,
    isShowingWithoutId: PropTypes.bool,
    loadingState: PropTypes.oneOf(LoadingStates),
    onLoadingFinished: PropTypes.func,
    onLoadingStarted: PropTypes.func,
    onUpdateProjectTitle: PropTypes.func,
    projectChanged: PropTypes.bool,
    requestProjectUpload: PropTypes.func,
    vm: PropTypes.shape({
        loadProject: PropTypes.func
    })
};
SBFileUploader.defaultProps = {
    className: ''
};
const mapStateToProps = state => {
    const loadingState = state.scratchGui.projectState.loadingState;
    return {
        isLoadingUpload: getIsLoadingUpload(loadingState),
        isShowingWithoutId: getIsShowingWithoutId(loadingState),
        loadingState: loadingState,
        projectChanged: state.scratchGui.projectChanged,
        vm: state.scratchGui.vm
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    onLoadingFinished: (loadingState, success) => {
        dispatch(onLoadedProject(loadingState, ownProps.canSave, success));
        dispatch(closeLoadingProject());
        dispatch(closeFileMenu());
    },
    requestProjectUpload: loadingState => dispatch(requestProjectUpload(loadingState)),
    onLoadingStarted: () => dispatch(openLoadingProject())
});

// Allow incoming props to override redux-provided props. Used to mock in tests.
const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
    {}, stateProps, dispatchProps, ownProps
);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(SBFileUploader);
