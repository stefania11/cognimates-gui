<<<<<<< HEAD
import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import {defineMessages, useIntl, FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import ReactTooltip from 'react-tooltip';

import styles from './coming-soon.css';

import awwCatIcon from './aww-cat.png';
import coolCatIcon from './cool-cat.png';

const messages = defineMessages({
    message1: {
        defaultMessage: 'Don\'t worry, we\'re on it {emoji}',
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message1'
    },
    message2: {
        defaultMessage: 'Coming Soon...',
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message2'
    },
    message3: {
        defaultMessage: 'We\'re working on it {emoji}',
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message3'
    }
});

const ComingSoonContent = props => {
    const intl = useIntl();
    const [isShowing, setIsShowing] = useState(false);

    const setShow = () => {
        // needed to set the opacity to 1, since the default is .9 on show
        setIsShowing(true);
    };

    const setHide = () => {
        setIsShowing(false);
    };

    const getRandomMessage = () => {
        // randomly chooses a messages from `messages` to display in the tooltip.
        const images = [awwCatIcon, coolCatIcon];
        const messageNumber = Math.floor(Math.random() * Object.keys(messages).length) + 1;
        const imageNumber = Math.floor(Math.random() * Object.keys(images).length);
        return (
            <FormattedMessage
                {...messages[`message${messageNumber}`]}
                values={{
                    emoji: (
                        <img
                            className={styles.comingSoonImage}
                            src={images[imageNumber]}
                        />
                    )
                }}
            />
        );
    };

    return (
        <ReactTooltip
            afterHide={setHide}
            afterShow={setShow}
            className={classNames(
                styles.comingSoon,
                props.className,
                {
                    [styles.show]: isShowing,
                    [styles.left]: (props.place === 'left'),
                    [styles.right]: (props.place === 'right'),
                    [styles.top]: (props.place === 'top'),
                    [styles.bottom]: (props.place === 'bottom')
                }
            )}
            getContent={getRandomMessage}
            id={props.tooltipId}
        />
    );
};

ComingSoonContent.propTypes = {
    className: PropTypes.string,
    place: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    tooltipId: PropTypes.string.isRequired
};

ComingSoonContent.defaultProps = {
    place: 'bottom'
};

const ComingSoon = ComingSoonContent;

const ComingSoonTooltip = props => (
    <div className={props.className}>
        <div
            data-delay-hide={props.delayHide}
            data-delay-show={props.delayShow}
            data-effect="solid"
            data-for={props.tooltipId}
            data-place={props.place}
            data-tip="tooltip"
        >
            {props.children}
        </div>
        <ComingSoon
            className={props.tooltipClassName}
            place={props.place}
            tooltipId={props.tooltipId}
        />
    </div>
);

ComingSoonTooltip.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    delayHide: PropTypes.number,
    delayShow: PropTypes.number,
    place: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    tooltipClassName: PropTypes.string,
    tooltipId: PropTypes.string.isRequired
};

ComingSoonTooltip.defaultProps = {
    delayHide: 0,
    delayShow: 0
};

export {
    ComingSoon as ComingSoonComponent,
    ComingSoonTooltip
};
||||||| empty tree
=======
/* DO NOT EDIT
@todo This file is copied from GUI and should be pulled out into a shared library.
See #13 */

import classNames from 'classnames';
import {defineMessages, useIntl, FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import ReactTooltip from 'react-tooltip';

import styles from './coming-soon.css';

import awwCatIcon from './aww-cat.png';
import coolCatIcon from './cool-cat.png';

const messages = defineMessages({
    message1: {
        defaultMessage: 'Don\'t worry, we\'re on it {emoji}',
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message1'
    },
    message2: {
        defaultMessage: 'Coming Soon...',
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message2'
    },
    message3: {
        defaultMessage: 'We\'re working on it {emoji}',
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message3'
    }
});

const ComingSoonContent = props => {
    const [isShowing, setIsShowing] = useState(false);
    const intl = useIntl();

    const setShow = () => {
        // needed to set the opacity to 1, since the default is .9 on show
        setIsShowing(true);
    };

    const setHide = () => {
        setIsShowing(false);
    };

    const getRandomMessage = () => {
        // randomly chooses a messages from `messages` to display in the tooltip.
        const images = [awwCatIcon, coolCatIcon];
        const messageNumber = Math.floor(Math.random() * Object.keys(messages).length) + 1;
        const imageNumber = Math.floor(Math.random() * Object.keys(images).length);
        return (
            <FormattedMessage
                {...messages[`message${messageNumber}`]}
                values={{
                    emoji: (
                        <img
                            className={styles.comingSoonImage}
                            src={images[imageNumber]}
                        />
                    )
                }}
            />
        );
    };

    return (
        <ReactTooltip
            afterHide={setHide}
            afterShow={setShow}
            className={classNames(
                styles.comingSoon,
                props.className,
                {
                    [styles.show]: isShowing,
                    [styles.left]: (props.place === 'left'),
                    [styles.right]: (props.place === 'right'),
                    [styles.top]: (props.place === 'top'),
                    [styles.bottom]: (props.place === 'bottom')
                }
            )}
            getContent={getRandomMessage}
            id={props.tooltipId}
        />
    );
};

ComingSoonContent.propTypes = {
    className: PropTypes.string,
    place: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    tooltipId: PropTypes.string.isRequired
};

ComingSoonContent.defaultProps = {
    place: 'bottom'
};

const ComingSoon = ComingSoonContent;

const ComingSoonTooltip = props => (
    <div className={props.className}>
        <div
            data-delay-hide={props.delayHide}
            data-delay-show={props.delayShow}
            data-effect="solid"
            data-for={props.tooltipId}
            data-place={props.place}
            data-tip="tooltip"
        >
            {props.children}
        </div>
        <ComingSoon
            className={props.tooltipClassName}
            place={props.place}
            tooltipId={props.tooltipId}
        />
    </div>
);

ComingSoonTooltip.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    delayHide: PropTypes.number,
    delayShow: PropTypes.number,
    place: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    tooltipClassName: PropTypes.string,
    tooltipId: PropTypes.string.isRequired
};

ComingSoonTooltip.defaultProps = {
    delayHide: 0,
    delayShow: 0
};

export {
    ComingSoon as ComingSoonComponent,
    ComingSoonTooltip
};
>>>>>>> 44bfbedd623e6fb6bdaa93dd097bd29446df8917
