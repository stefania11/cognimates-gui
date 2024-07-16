import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, useIntl, FormattedMessage} from 'react-intl';
import ReactModal from 'react-modal';

import Box from '../box/box.jsx';

import styles from './telemetry-modal.css';

const messages = defineMessages({
    label: {
        id: 'gui.telemetryOptIn.label',
        defaultMessage: 'Report statistics to improve Scratch',
        description: 'Scratch 3.0 telemetry modal label - for accessibility'
    },
    bodyText1: {
        defaultMessage: 'The Scratch Team is always looking to better understand how Scratch is used around the ' +
            'world. To help support this effort, you can allow Scratch to automatically send usage information to ' +
            'the Scratch Team.',
        description: 'First paragraph of body text for telemetry opt-in modal',
        id: 'gui.telemetryOptIn.body1'
    },
    bodyText2: {
        defaultMessage: 'The information we collect includes language selection, blocks usage, and some events like ' +
            'saving, loading, and uploading a project. We DO NOT collect any personal information. Please see our ' +
            '{privacyPolicyLink} for more information.',
        description: 'First paragraph of body text for telemetry opt-in modal',
        id: 'gui.telemetryOptIn.body2'
    },
    privacyPolicyLink: {
        defaultMessage: 'Privacy Policy',
        description: 'Link to the Scratch privacy policy',
        id: 'gui.telemetryOptIn.privacyPolicyLink'
    },
    noButton: {
        defaultMessage: 'No, thanks',
        description: 'Text for telemetry modal opt-out button',
        id: 'gui.telemetryOptIn.buttonTextNo'
    },
    noTooltip: {
        defaultMessage: 'Disable telemetry',
        description: 'Tooltip for telemetry modal opt-out button',
        id: 'gui.telemetryOptIn.buttonTooltipNo'
    },
    yesButton: {
        defaultMessage: "Yes, I'd like to help improve Scratch",
        description: 'Text for telemetry modal opt-in button',
        id: 'gui.telemetryOptIn.buttonTextYes'
    },
    yesTooltip: {
        defaultMessage: 'Enable telemetry',
        description: 'Tooltip for telemetry modal opt-in button',
        id: 'gui.telemetryOptIn.buttonTooltipYes'
    }
});

const TelemetryModal = ({
    isRtl,
    onCancel,
    onOptIn,
    onOptOut,
    onRequestClose
}) => {
    const intl = useIntl();

    const handleCancel = () => {
        onRequestClose();
        if (onCancel) {
            onCancel();
        }
    };

    const handleOptIn = () => {
        onRequestClose();
        if (onOptIn) {
            onOptIn();
        }
    };

    const handleOptOut = () => {
        onRequestClose();
        if (onOptOut) {
            onOptOut();
        }
    };

    return (
        <ReactModal
            isOpen
            className={styles.modalContent}
            contentLabel={intl.formatMessage(messages.label)}
            overlayClassName={styles.modalOverlay}
            onRequestClose={handleCancel}
        >
            <div dir={isRtl ? 'rtl' : 'ltr'} >
                <Box className={styles.illustration} />

                <Box className={styles.body}>
                    <p><FormattedMessage {...messages.bodyText1} /></p>
                    <p><FormattedMessage
                        {...messages.bodyText2}
                        values={{
                            privacyPolicyLink: (
                                <a
                                    className={styles.privacyPolicyLink}
                                    href="https://scratch.mit.edu/privacy_policy/"
                                >
                                    <FormattedMessage {...messages.privacyPolicyLink} />
                                </a>
                            )
                        }}
                    /></p>
                    <Box className={styles.buttonRow}>
                        <button
                            className={styles.optOut}
                            title={intl.formatMessage(messages.noTooltip)}
                            onClick={handleOptOut}
                        >
                            <FormattedMessage {...messages.noButton} />
                        </button>
                        <button
                            className={styles.optIn}
                            title={intl.formatMessage(messages.yesTooltip)}
                            onClick={handleOptIn}
                        >
                            <FormattedMessage {...messages.yesButton} />
                        </button>
                    </Box>
                </Box>
            </div>
        </ReactModal>
    );
};

TelemetryModal.propTypes = {
    isRtl: PropTypes.bool,
    onCancel: PropTypes.func,
    onOptIn: PropTypes.func.isRequired,
    onOptOut: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func
};

export default TelemetryModal;
