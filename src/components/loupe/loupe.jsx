<<<<<<< HEAD
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';

import Box from '../box/box.jsx';
import styles from './loupe.css';

const zoomScale = 3;

class LoupeComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'setCanvas'
        ]);
    }
    componentDidUpdate () {
        this.draw();
    }
    draw () {
        const boxSize = 6 / zoomScale;
        const boxLineWidth = 1 / zoomScale;
        const colorRingWidth = 15 / zoomScale;

        const ctx = this.canvas.getContext('2d');
        const {color, data, width, height} = this.props.colorInfo;
        this.canvas.width = zoomScale * width;
        this.canvas.height = zoomScale * height;

        // In order to scale the image data, must draw to a tmp canvas first
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = width;
        tmpCanvas.height = height;
        const tmpCtx = tmpCanvas.getContext('2d');
        const imageData = tmpCtx.createImageData(width, height);
        imageData.data.set(data);
        tmpCtx.putImageData(imageData, 0, 0);

        // Scale the loupe canvas and draw the zoomed image
        ctx.save();
        ctx.scale(zoomScale, zoomScale);
        ctx.drawImage(tmpCanvas, 0, 0, width, height);

        // Draw an outlined square at the cursor position (cursor is hidden)
        ctx.lineWidth = boxLineWidth;
        ctx.strokeStyle = 'black';
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        ctx.beginPath();
        ctx.rect((width / 2) - (boxSize / 2), (height / 2) - (boxSize / 2), boxSize, boxSize);
        ctx.fill();
        ctx.stroke();

        // Draw a thick ring around the loupe showing the current color
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        ctx.lineWidth = colorRingWidth;
        ctx.beginPath();
        ctx.moveTo(width, height / 2);
        ctx.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }
    setCanvas (element) {
        this.canvas = element;
    }
    render () {
        const {
            colorInfo,
            ...boxProps
        } = this.props;
        return (
            <Box
                {...boxProps}
                className={styles.colorPicker}
                componentRef={this.setCanvas}
                element="canvas"
                height={colorInfo.height}
                style={{
                    top: colorInfo.y - ((zoomScale * colorInfo.height) / 2),
                    left: colorInfo.x - ((zoomScale * colorInfo.width) / 2),
                    width: colorInfo.width * zoomScale,
                    height: colorInfo.height * zoomScale
                }}
                width={colorInfo.width}
            />
        );
    }
}

LoupeComponent.propTypes = {
    colorInfo: PropTypes.shape({
        color: PropTypes.shape({
            r: PropTypes.number,
            g: PropTypes.number,
            b: PropTypes.number
        }),
        data: PropTypes.instanceOf(Uint8Array),
        width: PropTypes.number,
        height: PropTypes.number,
        x: PropTypes.number,
        y: PropTypes.number
    })
};

export default LoupeComponent;
||||||| empty tree
=======
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';

import Box from '../box/box.jsx';

import {LOUPE_RADIUS, ZOOM_SCALE} from '../../helper/tools/eye-dropper';

import styles from './loupe.css';

class LoupeComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'setCanvas'
        ]);
    }
    componentDidUpdate () {
        this.draw();
    }
    draw () {
        const boxSize = 5;
        const boxLineWidth = 1;
        const colorRingWidth = 15;
        const loupeRadius = ZOOM_SCALE * LOUPE_RADIUS;
        const loupeDiameter = loupeRadius * 2;

        const color = this.props.colorInfo.color;

        const ctx = this.canvas.getContext('2d');
        this.canvas.width = loupeDiameter;
        this.canvas.height = loupeDiameter;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, loupeDiameter, loupeDiameter);

        // In order to scale the image data, must draw to a tmp canvas first
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = loupeDiameter;
        tmpCanvas.height = loupeDiameter;
        const tmpCtx = tmpCanvas.getContext('2d');
        const imageData = tmpCtx.createImageData(
            loupeDiameter, loupeDiameter
        );

        // Since the color info comes from elsewhere there is no guarantee
        // about the size. Make sure it matches to prevent data.set from throwing.
        // See issue #966 for example of how that can happen.
        if (this.props.colorInfo.data.length === imageData.data.length) {
            imageData.data.set(this.props.colorInfo.data);
        } else {
            console.warn('Image data size mismatch drawing loupe'); // eslint-disable-line no-console
        }

        tmpCtx.putImageData(imageData, 0, 0);

        // Scale the loupe canvas and draw the zoomed image
        ctx.drawImage(tmpCanvas, 0, 0);

        // Draw an outlined square at the cursor position (cursor is hidden)
        ctx.lineWidth = boxLineWidth;
        ctx.strokeStyle = 'black';
        ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
        ctx.beginPath();
        ctx.rect(loupeRadius - (boxSize / 2), loupeRadius - (boxSize / 2), boxSize, boxSize);
        ctx.fill();
        ctx.stroke();

        // Draw a thick ring around the loupe showing the current color
        ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
        ctx.lineWidth = colorRingWidth;
        ctx.beginPath();
        ctx.moveTo(loupeDiameter, loupeDiameter);
        ctx.arc(loupeRadius, loupeRadius, loupeRadius, 0, 2 * Math.PI);
        ctx.stroke();
    }
    setCanvas (element) {
        this.canvas = element;
        // Make sure to draw a frame when this component is first mounted
        // Check for null ref because refs are called with null when unmounted
        if (this.canvas) {
            this.draw();
        }
    }
    render () {
        const {
            colorInfo,
            pixelRatio,
            ...boxProps
        } = this.props;
        const loupeDiameter = ZOOM_SCALE * LOUPE_RADIUS * 2;
        return (
            <Box
                {...boxProps}
                className={styles.eyeDropper}
                componentRef={this.setCanvas}
                element="canvas"
                height={LOUPE_RADIUS * 2}
                style={{
                    top: (colorInfo.y / pixelRatio) - (loupeDiameter / 2),
                    left: (colorInfo.x / pixelRatio) - (loupeDiameter / 2),
                    width: loupeDiameter,
                    height: loupeDiameter
                }}
                width={LOUPE_RADIUS * 2}
            />
        );
    }
}

LoupeComponent.propTypes = {
    colorInfo: PropTypes.shape({
        color: PropTypes.instanceOf(Uint8ClampedArray), // this is the [r,g,b,a] array
        x: PropTypes.number,
        y: PropTypes.number,
        data: PropTypes.instanceOf(Uint8ClampedArray)
    }),
    pixelRatio: PropTypes.number.isRequired
};

export default LoupeComponent;
>>>>>>> 44bfbedd623e6fb6bdaa93dd097bd29446df8917
