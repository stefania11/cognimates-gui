import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import parseColor from 'parse-color';
import {useIntl} from 'react-intl';

import {getSelectedLeafItems} from '../helper/selection';
import Formats, {isBitmap} from '../lib/format';
import GradientTypes from '../lib/gradient-types';

import ColorIndicatorComponent from '../components/color-indicator.jsx';
import {applyColorToSelection,
    applyGradientTypeToSelection,
    applyStrokeWidthToSelection,
    generateSecondaryColor,
    swapColorsInSelection,
    MIXED} from '../helper/style-path';

const makeColorIndicator = (label, isStroke) => {
    const ColorIndicator = props => {
        const intl = useIntl();
        const [hasChanged, setHasChanged] = React.useState(false);

        React.useEffect(() => {
            if (props.colorModalVisible && !props.colorModalVisible) {
                if (hasChanged) props.onUpdateImage();
                setHasChanged(false);
            }
        }, [props.colorModalVisible, props.onUpdateImage, hasChanged]);

        const handleChangeColor = newColor => {
            if (isStroke) {
                const oldStyleWasNull = props.gradientType === GradientTypes.SOLID ?
                    props.color === null :
                    props.color === null && props.color2 === null;

                const otherColor = props.colorIndex === 1 ? props.color : props.color2;
                const newStyleIsNull = props.gradientType === GradientTypes.SOLID ?
                    newColor === null :
                    newColor === null && otherColor === null;

                if (oldStyleWasNull && !newStyleIsNull) {
                    setHasChanged(applyStrokeWidthToSelection(1, props.textEditTarget) || hasChanged);
                    props.onChangeStrokeWidth(1);
                } else if (!oldStyleWasNull && newStyleIsNull) {
                    setHasChanged(applyStrokeWidthToSelection(0, props.textEditTarget) || hasChanged);
                    props.onChangeStrokeWidth(0);
                }
            }

            const formatIsBitmap = isBitmap(props.format);
            const isDifferent = applyColorToSelection(
                newColor,
                props.colorIndex,
                props.gradientType === GradientTypes.SOLID,
                isStroke || (formatIsBitmap && !props.fillBitmapShapes),
                props.textEditTarget);
            setHasChanged(hasChanged || isDifferent);
            props.onChangeColor(newColor, props.colorIndex);
        };

        const handleChangeGradientType = gradientType => {
            const formatIsBitmap = isBitmap(props.format);
            const isDifferent = applyGradientTypeToSelection(
                gradientType,
                isStroke || (formatIsBitmap && !props.fillBitmapShapes),
                props.textEditTarget);
            setHasChanged(hasChanged || isDifferent);
            const hasSelectedItems = getSelectedLeafItems().length > 0;
            if (hasSelectedItems) {
                if (isDifferent) {
                    props.setSelectedItems(props.format);
                }
            }
            if (props.gradientType === GradientTypes.SOLID && gradientType !== GradientTypes.SOLID) {
                if (!hasSelectedItems) {
                    props.onChangeColor(generateSecondaryColor(props.color), 1);
                }
                props.onChangeColorIndex(1);
            }
            if (props.onChangeGradientType) props.onChangeGradientType(gradientType);
        };

        const handleCloseColor = () => {
            if (props.isEyeDropping) return;
            props.onCloseColor();
            props.onChangeColorIndex(0);
        };

        const handleSwap = () => {
            if (getSelectedLeafItems().length) {
                const formatIsBitmap = isBitmap(props.format);
                const isDifferent = swapColorsInSelection(
                    isStroke || (formatIsBitmap && !props.fillBitmapShapes),
                    props.textEditTarget);
                props.setSelectedItems(props.format);
                setHasChanged(hasChanged || isDifferent);
            } else {
                let color1 = props.color;
                let color2 = props.color2;
                color1 = color1 === null || color1 === MIXED ? color1 : parseColor(color1).hex;
                color2 = color2 === null || color2 === MIXED ? color2 : parseColor(color2).hex;
                props.onChangeColor(color1, 1);
                props.onChangeColor(color2, 0);
            }
        };

        return (
            <ColorIndicatorComponent
                {...props}
                label={intl.formatMessage(label)}
                outline={isStroke}
                onChangeColor={handleChangeColor}
                onChangeGradientType={handleChangeGradientType}
                onCloseColor={handleCloseColor}
                onSwap={handleSwap}
            />
        );
    };

    ColorIndicator.propTypes = {
        colorIndex: PropTypes.number.isRequired,
        disabled: PropTypes.bool.isRequired,
        color: PropTypes.string,
        color2: PropTypes.string,
        colorModalVisible: PropTypes.bool.isRequired,
        fillBitmapShapes: PropTypes.bool.isRequired,
        format: PropTypes.oneOf(Object.keys(Formats)),
        gradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
        isEyeDropping: PropTypes.bool.isRequired,
        onChangeColorIndex: PropTypes.func.isRequired,
        onChangeColor: PropTypes.func.isRequired,
        onChangeGradientType: PropTypes.func,
        onChangeStrokeWidth: PropTypes.func,
        onCloseColor: PropTypes.func.isRequired,
        onUpdateImage: PropTypes.func.isRequired,
        setSelectedItems: PropTypes.func.isRequired,
        textEditTarget: PropTypes.number
    };

    return ColorIndicator;
};

export default makeColorIndicator;
