import classNames from 'classnames';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import Input from '../forms/input.jsx';
const BufferedInput = BufferedInputHOC(Input);

import styles from './project-title-input.css';

const messages = defineMessages({
    projectTitlePlaceholder: {
        id: 'gui.gui.projectTitlePlaceholder',
        description: 'Placeholder for project title when blank',
        defaultMessage: 'Project title here'
    }
});

const ProjectTitleInput = (props) => {
    const intl = useIntl();

    // call onUpdateProjectTitle if it is defined (only defined when gui
    // is used within scratch-www)
    const handleUpdateProjectTitle = (newTitle) => {
        if (props.onUpdateProjectTitle) {
            props.onUpdateProjectTitle(newTitle);
        }
    };

    return (
        <BufferedInput
            className={classNames(styles.titleField, props.className)}
            maxLength="100"
            placeholder={intl.formatMessage(messages.projectTitlePlaceholder)}
            tabIndex="0"
            type="text"
            value={props.projectTitle}
            onSubmit={handleUpdateProjectTitle}
        />
    );
};

ProjectTitleInput.propTypes = {
    className: PropTypes.string,
    onUpdateProjectTitle: PropTypes.func,
    projectTitle: PropTypes.string
};

const mapStateToProps = state => ({
    projectTitle: state.scratchGui.projectTitle
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectTitleInput);