import classNames from 'classnames';
import {connect} from 'react-redux';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import bowser from 'bowser';
import React from 'react';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import CommunityButton from './community-button.jsx';
import ShareButton from './share-button.jsx';
import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import Divider from '../divider/divider.jsx';
import LanguageSelector from '../../containers/language-selector.jsx';
import SaveStatus from './save-status.jsx';
import SBFileUploader from '../../containers/sb-file-uploader.jsx';
import ProjectWatcher from '../../containers/project-watcher.jsx';
import MenuBarMenu from './menu-bar-menu.jsx';
import {MenuItem, MenuSection} from '../menu/menu.jsx';
import ProjectTitleInput from './project-title-input.jsx';
import AuthorInfo from './author-info.jsx';
import AccountNav from '../../containers/account-nav.jsx';
import LoginDropdown from './login-dropdown.jsx';
import SB3Downloader from '../../containers/sb3-downloader.jsx';
import DeletionRestorer from '../../containers/deletion-restorer.jsx';
import TurboMode from '../../containers/turbo-mode.jsx';

import {openTipsLibrary} from '../../reducers/modals';
import {setPlayer} from '../../reducers/mode';
import {
    autoUpdateProject,
    getIsUpdating,
    getIsShowingProject,
    manualUpdateProject,
    requestNewProject,
    remixProject,
    saveProjectAsCopy
} from '../../reducers/project-state';
import {
    openAccountMenu,
    closeAccountMenu,
    accountMenuOpen,
    openFileMenu,
    closeFileMenu,
    fileMenuOpen,
    openEditMenu,
    closeEditMenu,
    editMenuOpen,
    openLanguageMenu,
    closeLanguageMenu,
    languageMenuOpen,
    openLoginMenu,
    closeLoginMenu,
    loginMenuOpen
} from '../../reducers/menus';

import styles from './menu-bar.css';

import helpIcon from '../../lib/assets/icon--tutorials.svg';
import feedbackIcon from './icon--feedback.svg';
import profileIcon from './icon--profile.png';
import remixIcon from './icon--remix.svg';
import dropdownCaret from './dropdown-caret.svg';
import languageIcon from '../language-selector/language-icon.svg';

import scratchLogo from './scratch-logo.svg';

import sharedMessages from '../../lib/shared-messages';

const ariaMessages = defineMessages({
    language: {
        id: 'gui.menuBar.LanguageSelector',
        defaultMessage: 'language selector',
        description: 'accessibility text for the language selection menu'
    },
    tutorials: {
        id: 'gui.menuBar.tutorialsLibrary',
        defaultMessage: 'Tutorials',
        description: 'accessibility text for the tutorials button'
    }
});

const MenuBarItemTooltip = ({
    children,
    className,
    enable,
    id,
    place = 'bottom'
}) => {
    if (enable) {
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    }
    return (
        <ComingSoonTooltip
            className={classNames(styles.comingSoon, className)}
            place={place}
            tooltipClassName={styles.comingSoonTooltip}
            tooltipId={id}
        >
            {children}
        </ComingSoonTooltip>
    );
};


MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    enable: PropTypes.bool,
    id: PropTypes.string,
    place: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

const MenuItemTooltip = ({id, isRtl, children, className}) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        isRtl={isRtl}
        place={isRtl ? 'left' : 'right'}
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    isRtl: PropTypes.bool
};

const MenuBar = props => {
    const intl = useIntl();

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const handleClickNew = () => {
        let readyToReplaceProject = true;
        if (props.projectChanged && !props.canCreateNew) {
            readyToReplaceProject = confirm( // eslint-disable-line no-alert
                intl.formatMessage(sharedMessages.replaceProjectWarning)
            );
        }
        props.onRequestCloseFile();
        if (readyToReplaceProject) {
            props.onClickNew(props.canSave && props.canCreateNew);
        }
        props.onRequestCloseFile();
    };

    const handleClickRemix = () => {
        props.onClickRemix();
        props.onRequestCloseFile();
    };

    const handleClickSave = () => {
        props.onClickSave();
        props.onRequestCloseFile();
    };

    const handleClickSaveAsCopy = () => {
        props.onClickSaveAsCopy();
        props.onRequestCloseFile();
    };

    const handleClickSeeCommunity = (waitForUpdate) => {
        if (props.canSave) {
            props.autoUpdateProject();
            waitForUpdate(true);
        } else {
            waitForUpdate(false);
        }
    };

    const handleClickShare = (waitForUpdate) => {
        if (!props.isShared) {
            if (props.canShare) {
                props.onShare();
            }
            if (props.canSave) {
                props.autoUpdateProject();
                waitForUpdate(true);
            } else {
                waitForUpdate(false);
            }
        }
    };

    const handleRestoreOption = (restoreFun) => {
        return () => {
            restoreFun();
            props.onRequestCloseEdit();
        };
    };

    const handleCloseFileMenuAndThen = (fn) => {
        return () => {
            props.onRequestCloseFile();
            fn();
        };
    };

    const handleKeyPress = (event) => {
        const modifier = bowser.mac ? event.metaKey : event.ctrlKey;
        if (modifier && event.key === 's') {
            props.onClickSave();
            event.preventDefault();
        }
    };

    const handleLanguageMouseUp = (e) => {
        if (!props.languageMenuOpen) {
            props.onClickLanguage(e);
        }
    };

    const restoreOptionMessage = (deletedItem) => {
        switch (deletedItem) {
        case 'Sprite':
            return (
                <FormattedMessage
                    defaultMessage="Restore Sprite"
                    description="Menu bar item for restoring the last deleted sprite."
                    id="gui.menuBar.restoreSprite"
                />
            );
        case 'Sound':
            return (
                <FormattedMessage
                    defaultMessage="Restore Sound"
                    description="Menu bar item for restoring the last deleted sound."
                    id="gui.menuBar.restoreSound"
                />
            );
        case 'Costume':
            return (
                <FormattedMessage
                    defaultMessage="Restore Costume"
                    description="Menu bar item for restoring the last deleted costume."
                    id="gui.menuBar.restoreCostume"
                />
            );
        default:
            return (
                <FormattedMessage
                    defaultMessage="Restore"
                    description="Menu bar item for restoring the last deleted item in its disabled state." /* eslint-disable-line max-len */
                    id="gui.menuBar.restore"
                />
            );
        }
    };

    const saveNowMessage = (
        <FormattedMessage
            defaultMessage="Save now"
            description="Menu bar item for saving now"
            id="gui.menuBar.saveNow"
        />
    );
    const createCopyMessage = (
        <FormattedMessage
            defaultMessage="Save as a copy"
            description="Menu bar item for saving as a copy"
            id="gui.menuBar.saveAsCopy"
        />
    );
    const remixMessage = (
        <FormattedMessage
            defaultMessage="Remix"
            description="Menu bar item for remixing"
            id="gui.menuBar.remix"
        />
    );
    const newProjectMessage = (
        <FormattedMessage
            defaultMessage="New"
            description="Menu bar item for creating a new project"
            id="gui.menuBar.new"
        />
    );
    const remixButton = (
        <Button
            className={classNames(
                styles.menuBarButton,
                styles.remixButton
            )}
            iconClassName={styles.remixButtonIcon}
            iconSrc={remixIcon}
            onClick={handleClickRemix}
        >
            {remixMessage}
        </Button>
    );
    return (
        <Box
            className={classNames(
                props.className,
                styles.menuBar
            )}
        >
            <div className={styles.mainMenu}>
                <div className={styles.fileGroup}>
                    <div className={classNames(styles.menuBarItem)}>
                        <img
                            alt="Scratch"
                            className={classNames(styles.scratchLogo, {
                                [styles.clickable]: typeof props.onClickLogo !== 'undefined'
                            })}
                            draggable={false}
                            src={scratchLogo}
                            onClick={props.onClickLogo}
                        />
                    </div>
                    <div
                        className={classNames(styles.menuBarItem, styles.hoverable, styles.languageMenu)}
                    >
                        <div>
                            <img
                                className={styles.languageIcon}
                                src={languageIcon}
                            />
                            <img
                                className={styles.languageCaret}
                                src={dropdownCaret}
                            />
                        </div>
                        <LanguageSelector label={intl.formatMessage(ariaMessages.language)} />
                    </div>
                    <div
                        className={classNames(styles.menuBarItem, styles.hoverable, {
                            [styles.active]: props.fileMenuOpen
                        })}
                        onMouseUp={props.onClickFile}
                    >
                        <FormattedMessage
                            defaultMessage="File"
                            description="Text for file dropdown menu"
                            id="gui.menuBar.file"
                        />
                        <MenuBarMenu
                            className={classNames(styles.menuBarMenu)}
                            open={props.fileMenuOpen}
                            place={props.isRtl ? 'left' : 'right'}
                            onRequestClose={props.onRequestCloseFile}
                        >
                            <MenuSection>
                                <MenuItem
                                    isRtl={props.isRtl}
                                    onClick={handleClickNew}
                                >
                                    {newProjectMessage}
                                </MenuItem>
                            </MenuSection>
                            {(props.canSave || props.canCreateCopy || props.canRemix) && (
                                <MenuSection>
                                    {props.canSave ? (
                                        <MenuItem onClick={handleClickSave}>
                                            {saveNowMessage}
                                        </MenuItem>
                                    ) : []}
                                    {props.canCreateCopy ? (
                                        <MenuItem onClick={handleClickSaveAsCopy}>
                                            {createCopyMessage}
                                        </MenuItem>
                                    ) : []}
                                    {props.canRemix ? (
                                        <MenuItem onClick={handleClickRemix}>
                                            {remixMessage}
                                        </MenuItem>
                                    ) : []}
                                </MenuSection>
                            )}
                            <MenuSection>
                                <SBFileUploader onUpdateProjectTitle={props.onUpdateProjectTitle}>
                                    {(className, renderFileInput, loadProject) => (
                                        <MenuItem
                                            className={className}
                                            onClick={loadProject}
                                        >
                                            <FormattedMessage
                                                defaultMessage="Load from your computer"
                                                description={
                                                    'Menu bar item for uploading a project from your computer'
                                                }
                                                id="gui.menuBar.uploadFromComputer"
                                            />
                                            {renderFileInput()}
                                        </MenuItem>
                                    )}
                                </SBFileUploader>
                                <SB3Downloader>{(className, downloadProject) => (
                                    <MenuItem
                                        className={className}
                                        onClick={handleCloseFileMenuAndThen(downloadProject)}
                                    >
                                        <FormattedMessage
                                            defaultMessage="Save to your computer"
                                            description="Menu bar item for downloading a project to your computer"
                                            id="gui.menuBar.downloadToComputer"
                                        />
                                    </MenuItem>
                                )}</SB3Downloader>
                            </MenuSection>
                        </MenuBarMenu>
                    </div>
                    <div
                        className={classNames(styles.menuBarItem, styles.hoverable, {
                            [styles.active]: props.editMenuOpen
                        })}
                        onMouseUp={props.onClickEdit}
                    >
                    </div>
                </div>
                {props.canEditTitle ? (
                    <div className={classNames(styles.menuBarItem, styles.growable)}>
                        <MenuBarItemTooltip
                            enable
                            id="title-field"
                        >
                            <ProjectTitleInput
                                className={classNames(styles.titleFieldGrowable)}
                                onUpdateProjectTitle={props.onUpdateProjectTitle}
                            />
                        </MenuBarItemTooltip>
                    </div>
                ) : (
                    (props.authorUsername && props.authorUsername !== props.username) ? (
                        <AuthorInfo
                            className={styles.authorInfo}
                            imageUrl={props.authorThumbnailUrl}
                            projectTitle={props.projectTitle}
                            userId={props.authorId}
                            username={props.authorUsername}
                        />
                    ) : null
                )}
            </div>
            <div className={styles.accountInfoGroup}>
                <div className={styles.menuBarItem}>
                    {props.canSave && (
                        <SaveStatus />
                    )}
                </div>
                {props.sessionExists ? (
                    props.username ? (
                        <React.Fragment>
                            <a href="/mystuff/">
                                <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.hoverable,
                                        styles.mystuffButton
                                    )}
                                >
                                </div>
                            </a>
                            <AccountNav
                                className={classNames(
                                    styles.menuBarItem,
                                    styles.hoverable,
                                    {[styles.active]: props.accountMenuOpen}
                                )}
                                isOpen={props.accountMenuOpen}
                                isRtl={props.isRtl}
                                menuBarMenuClassName={classNames(styles.menuBarMenu)}
                                onClick={props.onClickAccount}
                                onClose={props.onRequestCloseAccount}
                                onLogOut={props.onLogOut}
                            />
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div
                                className={classNames(
                                    styles.menuBarItem,
                                    styles.hoverable
                                )}
                                key="join"
                                onMouseUp={props.onOpenRegistration}
                            >
                                <FormattedMessage
                                    defaultMessage="Join Scratch"
                                    description="Link for creating a Scratch account"
                                    id="gui.menuBar.joinScratch"
                                />
                            </div>
                            <div
                                className={classNames(
                                    styles.menuBarItem,
                                    styles.hoverable
                                )}
                                key="login"
                                onMouseUp={props.onClickLogin}
                            >
                                <FormattedMessage
                                    defaultMessage="Sign in"
                                    description="Link for signing in to your Scratch account"
                                    id="gui.menuBar.signIn"
                                />
                                <LoginDropdown
                                    className={classNames(styles.menuBarMenu)}
                                    isOpen={props.loginMenuOpen}
                                    isRtl={props.isRtl}
                                    renderLogin={props.renderLogin}
                                    onClose={props.onRequestCloseLogin}
                                />
                            </div>
                        </React.Fragment>
                    )
                ) : (
                    <React.Fragment>
                        <div className={classNames(styles.menuBarItem, styles.feedbackButtonWrapper)}>
                            <a
                                className={styles.feedbackLink}
                                href="https://scratch.mit.edu/discuss/topic/312261/"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <Button
                                    className={styles.feedbackButton}
                                    iconSrc={feedbackIcon}
                                >
                                    <FormattedMessage
                                        defaultMessage="Give Feedback"
                                        description="Label for feedback form modal button"
                                        id="gui.menuBar.giveFeedback"
                                    />
                                </Button>
                            </a>
                        </div>
                        {props.showComingSoon ? (
                            <React.Fragment>
                                <MenuBarItemTooltip id="mystuff">
                                    <div
                                        className={classNames(
                                            styles.menuBarItem,
                                            styles.hoverable,
                                            styles.mystuffButton
                                        )}
                                    >
                                    </div>
                                </MenuBarItemTooltip>
                                <MenuBarItemTooltip
                                    id="account-nav"
                                    place={props.isRtl ? 'right' : 'left'}
                                >
                                    <div
                                        className={classNames(
                                            styles.menuBarItem,
                                            styles.hoverable,
                                            styles.accountNavMenu
                                        )}
                                    >
                                        <img
                                            className={styles.profileIcon}
                                            src={profileIcon}
                                        />
                                        <span>
                                            {'cat'}
                                        </span>
                                        <img
                                            className={styles.dropdownCaretIcon}
                                            src={dropdownCaret}
                                        />
                                    </div>
                                </MenuBarItemTooltip>
                            </React.Fragment>
                        ) : null}
                    </React.Fragment>
                )}
            </div>
        </Box>
    );
}

MenuBar.propTypes = {
    accountMenuOpen: PropTypes.bool,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    autoUpdateProject: PropTypes.func,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    className: PropTypes.string,
    editMenuOpen: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    isShowingProject: PropTypes.bool,
    isUpdating: PropTypes.bool,
    languageMenuOpen: PropTypes.bool,
    loginMenuOpen: PropTypes.bool,
    onClickAccount: PropTypes.func,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
    onClickLanguage: PropTypes.func,
    onClickLogin: PropTypes.func,
    onClickLogo: PropTypes.func,
    onClickNew: PropTypes.func,
    onClickRemix: PropTypes.func,
    onClickSave: PropTypes.func,
    onClickSaveAsCopy: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onOpenTipLibrary: PropTypes.func,
    onRequestCloseAccount: PropTypes.func,
    onRequestCloseEdit: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onRequestCloseLanguage: PropTypes.func,
    onRequestCloseLogin: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    onUpdateProjectTitle: PropTypes.func,
    projectChanged: PropTypes.bool,
    projectTitle: PropTypes.string,
    renderLogin: PropTypes.func,
    sessionExists: PropTypes.bool,
    showComingSoon: PropTypes.bool,
    username: PropTypes.string
};

MenuBar.defaultProps = {
    onShare: () => {}
};

const mapStateToProps = state => {
    const loadingState = state.scratchGui.projectState.loadingState;
    const user = state.session && state.session.session && state.session.session.user;
    return {
        accountMenuOpen: accountMenuOpen(state),
        fileMenuOpen: fileMenuOpen(state),
        editMenuOpen: editMenuOpen(state),
        isRtl: state.locales.isRtl,
        isUpdating: getIsUpdating(loadingState),
        isShowingProject: getIsShowingProject(loadingState),
        languageMenuOpen: languageMenuOpen(state),
        loginMenuOpen: loginMenuOpen(state),
        projectChanged: state.scratchGui.projectChanged,
        projectTitle: state.scratchGui.projectTitle,
        sessionExists: state.session && typeof state.session.session !== 'undefined',
        username: user ? user.username : null
    };
};

const mapDispatchToProps = dispatch => ({
    autoUpdateProject: () => dispatch(autoUpdateProject()),
    onOpenTipLibrary: () => dispatch(openTipsLibrary()),
    onClickAccount: () => dispatch(openAccountMenu()),
    onRequestCloseAccount: () => dispatch(closeAccountMenu()),
    onClickFile: () => dispatch(openFileMenu()),
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onClickEdit: () => dispatch(openEditMenu()),
    onRequestCloseEdit: () => dispatch(closeEditMenu()),
    onClickLanguage: () => dispatch(openLanguageMenu()),
    onRequestCloseLanguage: () => dispatch(closeLanguageMenu()),
    onClickLogin: () => dispatch(openLoginMenu()),
    onRequestCloseLogin: () => dispatch(closeLoginMenu()),
    onClickNew: needSave => dispatch(requestNewProject(needSave)),
    onClickRemix: () => dispatch(remixProject()),
    onClickSave: () => dispatch(manualUpdateProject()),
    onClickSaveAsCopy: () => dispatch(saveProjectAsCopy()),
    onSeeCommunity: () => dispatch(setPlayer(true))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBar);

MenuBar.propTypes = {
    accountMenuOpen: PropTypes.bool,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    autoUpdateProject: PropTypes.func,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    className: PropTypes.string,
    editMenuOpen: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    intl: intlShape,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    isShowingProject: PropTypes.bool,
    isUpdating: PropTypes.bool,
    languageMenuOpen: PropTypes.bool,
    loginMenuOpen: PropTypes.bool,
    onClickAccount: PropTypes.func,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
    onClickLanguage: PropTypes.func,
    onClickLogin: PropTypes.func,
    onClickLogo: PropTypes.func,
    onClickNew: PropTypes.func,
    onClickRemix: PropTypes.func,
    onClickSave: PropTypes.func,
    onClickSaveAsCopy: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onOpenTipLibrary: PropTypes.func,
    onRequestCloseAccount: PropTypes.func,
    onRequestCloseEdit: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onRequestCloseLanguage: PropTypes.func,
    onRequestCloseLogin: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    onUpdateProjectTitle: PropTypes.func,
    projectChanged: PropTypes.bool,
    projectTitle: PropTypes.string,
    renderLogin: PropTypes.func,
    sessionExists: PropTypes.bool,
    showComingSoon: PropTypes.bool,
    username: PropTypes.string
};

MenuBar.defaultProps = {
    onShare: () => {}
};
