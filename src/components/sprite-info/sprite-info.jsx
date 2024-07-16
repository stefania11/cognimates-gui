import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Label from '../forms/label.jsx';
import Input from '../forms/input.jsx';
import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import DirectionPicker from '../../containers/direction-picker.jsx';

import {useIntl, defineMessages, FormattedMessage} from 'react-intl';

import {STAGE_DISPLAY_SIZES} from '../../lib/layout-constants.js';
import {isWideLocale} from '../../lib/locale-utils.js';

import styles from './sprite-info.css';

import xIcon from './icon--x.svg';
import yIcon from './icon--y.svg';
import showIcon from './icon--show.svg';
import hideIcon from './icon--hide.svg';

const BufferedInput = BufferedInputHOC(Input);

const messages = defineMessages({
    spritePlaceholder: {
        id: 'gui.SpriteInfo.spritePlaceholder',
        defaultMessage: 'Name',
        description: 'Placeholder text for sprite name'
    }
});

const SpriteInfo = props => {
    const intl = useIntl();

    const {
        stageSize
    } = props;

    const sprite = (
        <FormattedMessage
            defaultMessage="Sprite"
            description="Sprite info label"
            id="gui.SpriteInfo.sprite"
        />
    );
    const showLabel = (
        <FormattedMessage
            defaultMessage="Show"
            description="Sprite info show label"
            id="gui.SpriteInfo.show"
        />
    );
    const sizeLabel = (
        <FormattedMessage
            defaultMessage="Size"
            description="Sprite info size label"
            id="gui.SpriteInfo.size"
        />
    );

    const labelAbove = isWideLocale(intl.locale);

    const spriteNameInput = (
        <BufferedInput
            className={classNames(
                styles.spriteInput,
                {
                    [styles.columnInput]: labelAbove
                }
            )}
            disabled={props.disabled}
            placeholder={intl.formatMessage(messages.spritePlaceholder)}
            tabIndex="0"
            type="text"
            value={props.disabled ? '' : props.name}
            onSubmit={props.onChangeName}
        />
    );

    const xPosition = (
        <div className={styles.group}>
            {
                (stageSize === STAGE_DISPLAY_SIZES.large) ?
                    <div className={styles.iconWrapper}>
                        <img
                            aria-hidden="true"
                            className={classNames(styles.xIcon, styles.icon)}
                            src={xIcon}
                        />
                    </div> :
                    null
            }
            <Label text="x">
                <BufferedInput
                    small
                    disabled={props.disabled}
                    placeholder="x"
                    tabIndex="0"
                    type="text"
                    value={props.disabled ? '' : Math.round(props.x)}
                    onSubmit={props.onChangeX}
                />
            </Label>
        </div>
    );

    const yPosition = (
        <div className={styles.group}>
            {
                (stageSize === STAGE_DISPLAY_SIZES.large) ?
                    <div className={styles.iconWrapper}>
                        <img
                            aria-hidden="true"
                            className={classNames(styles.yIcon, styles.icon)}
                            src={yIcon}
                        />
                    </div> :
                    null
            }
            <Label text="y">
                <BufferedInput
                    small
                    disabled={props.disabled}
                    placeholder="y"
                    tabIndex="0"
                    type="text"
                    value={props.disabled ? '' : Math.round(props.y)}
                    onSubmit={props.onChangeY}
                />
            </Label>
        </div>
    );

    if (stageSize === STAGE_DISPLAY_SIZES.small) {
        return (
            <Box className={styles.spriteInfo}>
                <div className={classNames(styles.row, styles.rowPrimary)}>
                    <div className={styles.group}>
                        {spriteNameInput}
                    </div>
                </div>
                <div className={classNames(styles.row, styles.rowSecondary)}>
                    {xPosition}
                    {yPosition}
                </div>
            </Box>
        );
    }

    return (
        <Box className={styles.spriteInfo}>
            <div className={classNames(styles.row, styles.rowPrimary)}>
                <div className={styles.group}>
                    <Label
                        above={labelAbove}
                        text={sprite}
                    >
                        {spriteNameInput}
                    </Label>
                </div>
                {xPosition}
                {yPosition}
            </div>
            <div className={classNames(styles.row, styles.rowSecondary)}>
                <div className={labelAbove ? styles.column : styles.group}>
                    {
                        stageSize === STAGE_DISPLAY_SIZES.large ?
                            <Label
                                secondary
                                text={showLabel}
                            /> :
                            null
                    }
                    <div className={styles.radioWrapper}>
                        <div
                            className={classNames(
                                styles.radio,
                                styles.radioFirst,
                                styles.iconWrapper,
                                {
                                    [styles.isActive]: props.visible && !props.disabled,
                                    [styles.isDisabled]: props.disabled
                                }
                            )}
                            tabIndex="0"
                            onClick={props.onClickVisible}
                            onKeyPress={props.onPressVisible}
                        >
                            <img
                                className={styles.icon}
                                src={showIcon}
                            />
                        </div>
                        <div
                            className={classNames(
                                styles.radio,
                                styles.radioLast,
                                styles.iconWrapper,
                                {
                                    [styles.isActive]: !props.visible && !props.disabled,
                                    [styles.isDisabled]: props.disabled
                                }
                            )}
                            tabIndex="0"
                            onClick={props.onClickNotVisible}
                            onKeyPress={props.onPressNotVisible}
                        >
                            <img
                                className={styles.icon}
                                src={hideIcon}
                            />
                        </div>
                    </div>
                </div>
                <div className={classNames(styles.group, styles.largerInput)}>
                    <Label
                        secondary
                        above={labelAbove}
                        text={sizeLabel}
                    >
                        <BufferedInput
                            small
                            disabled={props.disabled}
                            label={sizeLabel}
                            tabIndex="0"
                            type="text"
                            value={props.disabled ? '' : Math.round(props.size)}
                            onSubmit={props.onChangeSize}
                        />
                    </Label>
                </div>
                <div className={classNames(styles.group, styles.largerInput)}>
                    <DirectionPicker
                        direction={Math.round(props.direction)}
                        disabled={props.disabled}
                        labelAbove={labelAbove}
                        rotationStyle={props.rotationStyle}
                        onChangeDirection={props.onChangeDirection}
                        onChangeRotationStyle={props.onChangeRotationStyle}
                    />
                </div>
            </div>
        </Box>
    );
};

SpriteInfo.propTypes = {
    direction: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    disabled: PropTypes.bool,
    name: PropTypes.string,
    onChangeDirection: PropTypes.func,
    onChangeName: PropTypes.func,
    onChangeRotationStyle: PropTypes.func,
    onChangeSize: PropTypes.func,
    onChangeX: PropTypes.func,
    onChangeY: PropTypes.func,
    onClickNotVisible: PropTypes.func,
    onClickVisible: PropTypes.func,
    onPressNotVisible: PropTypes.func,
    onPressVisible: PropTypes.func,
    rotationStyle: PropTypes.string,
    size: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    visible: PropTypes.bool,
    x: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    y: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};

export default SpriteInfo;
