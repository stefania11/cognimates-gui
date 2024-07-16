import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';

import classNames from 'classnames';
import parseColor from 'parse-color';

import Slider, {CONTAINER_WIDTH, HANDLE_WIDTH} from '../forms/slider.jsx';
import LabeledIconButton from '../labeled-icon-button/labeled-icon-button.jsx';
import styles from './color-picker.css';
import GradientTypes from '../../lib/gradient-types';
import {MIXED} from '../../helper/style-path';

import eyeDropperIcon from './icons/eye-dropper.svg';
import noFillIcon from '../color-button/no-fill.svg';
import mixedFillIcon from '../color-button/mixed-fill.svg';
import fillHorzGradientIcon from './icons/fill-horz-gradient-enabled.svg';
import fillRadialIcon from './icons/fill-radial-enabled.svg';
import fillSolidIcon from './icons/fill-solid-enabled.svg';
import fillVertGradientIcon from './icons/fill-vert-gradient-enabled.svg';
import swapIcon from './icons/swap.svg';
import Modes from '../../lib/modes';

const hsvToHex = (h, s, v) =>
    // Scale hue back up to [0, 360] from [0, 100]
    parseColor(`hsv(${3.6 * h}, ${s}, ${v})`).hex
;

const messages = defineMessages({
    swap: {
        defaultMessage: 'Swap',
        description: 'Label for button that swaps the two colors in a gradient',
        id: 'paint.colorPicker.swap'
    }
});
const ColorPicker = props => {
    const intl = useIntl();

    const makeBackground = channel => {
        const stops = [];
        // Generate the color slider background CSS gradients by adding
        // color stops depending on the slider.
        for (let n = 100; n >= 0; n -= 10) {
            switch (channel) {
            case 'hue':
                stops.push(hsvToHex(n, props.saturation, props.brightness));
                break;
            case 'saturation':
                stops.push(hsvToHex(props.hue, n, props.brightness));
                break;
            case 'brightness':
                stops.push(hsvToHex(props.hue, props.saturation, n));
                break;
            default:
                throw new Error(`Unknown channel for color sliders: ${channel}`);
            }
        }

        // The sliders are a rounded capsule shape, and the slider handles are circles. As a consequence, when the
        // slider handle is fully to one side, its center is actually moved away from the start/end of the slider by
        // the slider handle's radius, meaning that the effective range of the slider excludes the rounded caps.
        // To compensate for this, position the first stop to where the rounded cap ends, and position the last stop
        // to where the rounded cap begins.
        const halfHandleWidth = HANDLE_WIDTH / 2;
        stops[0] += ` 0 ${halfHandleWidth}px`;
        stops[stops.length - 1] += ` ${CONTAINER_WIDTH - halfHandleWidth}px 100%`;

        return `linear-gradient(to left, ${stops.join(',')})`;
    };

    return (
        <div
            className={styles.colorPickerContainer}
            dir={props.rtl ? 'rtl' : 'ltr'}
        >
            {props.shouldShowGradientTools ? (
                <div>
                    <div className={styles.row}>
                        <div className={styles.gradientPickerRow}>
                            <img
                                className={classNames({
                                    [styles.inactiveGradient]: props.gradientType !== GradientTypes.SOLID,
                                    [styles.clickable]: true
                                })}
                                draggable={false}
                                src={fillSolidIcon}
                                onClick={props.onChangeGradientTypeSolid}
                            />
                            <img
                                className={classNames({
                                    [styles.inactiveGradient]:
                                        props.gradientType !== GradientTypes.HORIZONTAL,
                                    [styles.clickable]: true
                                })}
                                draggable={false}
                                src={fillHorzGradientIcon}
                                onClick={props.onChangeGradientTypeHorizontal}
                            />
                            <img
                                className={classNames({
                                    [styles.inactiveGradient]: props.gradientType !== GradientTypes.VERTICAL,
                                    [styles.clickable]: true
                                })}
                                draggable={false}
                                src={fillVertGradientIcon}
                                onClick={props.onChangeGradientTypeVertical}
                            />
                            <img
                                className={classNames({
                                    [styles.inactiveGradient]: props.gradientType !== GradientTypes.RADIAL,
                                    [styles.clickable]: true
                                })}
                                draggable={false}
                                src={fillRadialIcon}
                                onClick={props.onChangeGradientTypeRadial}
                            />
                        </div>
                    </div>
                    <div className={styles.divider} />
                    {props.gradientType === GradientTypes.SOLID ? null : (
                        <div className={styles.row}>
                            <div
                                className={classNames(
                                    styles.gradientPickerRow,
                                    styles.gradientSwatchesRow
                                )}
                            >
                                <div
                                    className={classNames({
                                        [styles.clickable]: true,
                                        [styles.swatch]: true,
                                        [styles.largeSwatch]: true,
                                        [styles.activeSwatch]: props.colorIndex === 0
                                    })}
                                    style={{
                                        backgroundColor: props.color === null || props.color === MIXED ?
                                            'white' : props.color
                                    }}
                                    onClick={props.onSelectColor}
                                >
                                    {props.color === null ? (
                                        <img
                                            className={styles.largeSwatchIcon}
                                            draggable={false}
                                            src={noFillIcon}
                                        />
                                    ) : props.color === MIXED ? (
                                        <img
                                            className={styles.largeSwatchIcon}
                                            draggable={false}
                                            src={mixedFillIcon}
                                        />
                                    ) : null}
                                </div>
                                <LabeledIconButton
                                    className={styles.swapButton}
                                    imgSrc={swapIcon}
                                    title={intl.formatMessage(messages.swap)}
                                    onClick={props.onSwap}
                                />
                                <div
                                    className={classNames({
                                        [styles.clickable]: true,
                                        [styles.swatch]: true,
                                        [styles.largeSwatch]: true,
                                        [styles.activeSwatch]: props.colorIndex === 1
                                    })}
                                    style={{
                                        backgroundColor: props.color2 === null || props.color2 === MIXED ?
                                            'white' : props.color2
                                    }}
                                    onClick={props.onSelectColor2}
                                >
                                    {props.color2 === null ? (
                                        <img
                                            className={styles.largeSwatchIcon}
                                            draggable={false}
                                            src={noFillIcon}
                                        />
                                    ) : props.color2 === MIXED ? (
                                        <img
                                            className={styles.largeSwatchIcon}
                                            draggable={false}
                                            src={mixedFillIcon}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
            <div className={styles.row}>
                <div className={styles.rowHeader}>
                    <span className={styles.labelName}>
                        <FormattedMessage
                            defaultMessage="Color"
                            description="Label for the hue component in the color picker"
                            id="paint.paintEditor.hue"
                        />
                    </span>
                    <span className={styles.labelReadout}>
                        {Math.round(props.hue)}
                    </span>
                </div>
                <div className={styles.rowSlider}>
                    <Slider
                        background={makeBackground('hue')}
                        value={props.hue}
                        onChange={props.onHueChange}
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowHeader}>
                    <span className={styles.labelName}>
                        <FormattedMessage
                            defaultMessage="Saturation"
                            description="Label for the saturation component in the color picker"
                            id="paint.paintEditor.saturation"
                        />
                    </span>
                    <span className={styles.labelReadout}>
                        {Math.round(props.saturation)}
                    </span>
                </div>
                <div className={styles.rowSlider}>
                    <Slider
                        background={makeBackground('saturation')}
                        value={props.saturation}
                        onChange={props.onSaturationChange}
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.rowHeader}>
                    <span className={styles.labelName}>
                        <FormattedMessage
                            defaultMessage="Brightness"
                            description="Label for the brightness component in the color picker"
                            id="paint.paintEditor.brightness"
                        />
                    </span>
                    <span className={styles.labelReadout}>
                        {Math.round(props.brightness)}
                    </span>
                </div>
                <div className={styles.rowSlider}>
                    <Slider
                        lastSlider
                        background={makeBackground('brightness')}
                        value={props.brightness}
                        onChange={props.onBrightnessChange}
                    />
                </div>
            </div>
            <div className={styles.swatchRow}>
                <div className={styles.swatches}>
                    {props.mode === Modes.BIT_LINE ||
                        props.mode === Modes.BIT_RECT ||
                        props.mode === Modes.BIT_OVAL ||
                        props.mode === Modes.BIT_TEXT ? null :
                        (<div
                            className={classNames({
                                [styles.clickable]: true,
                                [styles.swatch]: true,
                                [styles.activeSwatch]:
                                    (props.colorIndex === 0 && props.color === null) ||
                                    (props.colorIndex === 1 && props.color2 === null)
                            })}
                            onClick={props.onTransparent}
                        >
                            <img
                                className={styles.swatchIcon}
                                draggable={false}
                                src={noFillIcon}
                            />
                        </div>)
                    }
                </div>
                <div className={styles.swatches}>
                    <div
                        className={classNames({
                            [styles.clickable]: true,
                            [styles.swatch]: true,
                            [styles.activeSwatch]: props.isEyeDropping
                        })}
                        onClick={props.onActivateEyeDropper}
                    >
                        <img
                            className={styles.swatchIcon}
                            draggable={false}
                            src={eyeDropperIcon}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

ColorPicker.propTypes = {
    brightness: PropTypes.number.isRequired,
    color: PropTypes.string,
    color2: PropTypes.string,
    colorIndex: PropTypes.number.isRequired,
    gradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
    hue: PropTypes.number.isRequired,
    isEyeDropping: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(Object.keys(Modes)),
    onActivateEyeDropper: PropTypes.func.isRequired,
    onBrightnessChange: PropTypes.func.isRequired,
    onChangeGradientTypeHorizontal: PropTypes.func.isRequired,
    onChangeGradientTypeRadial: PropTypes.func.isRequired,
    onChangeGradientTypeSolid: PropTypes.func.isRequired,
    onChangeGradientTypeVertical: PropTypes.func.isRequired,
    onHueChange: PropTypes.func.isRequired,
    onSaturationChange: PropTypes.func.isRequired,
    onSelectColor: PropTypes.func.isRequired,
    onSelectColor2: PropTypes.func.isRequired,
    onSwap: PropTypes.func,
    onTransparent: PropTypes.func.isRequired,
    rtl: PropTypes.bool.isRequired,
    saturation: PropTypes.number.isRequired,
    shouldShowGradientTools: PropTypes.bool.isRequired
};

export default ColorPicker;
