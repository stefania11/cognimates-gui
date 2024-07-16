import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './button.css';

const ButtonComponent = ({
    className,
    disabled,
    iconClassName,
    iconSrc,
    highlighted,
    onClick,
    children,
    ...props
}) => {
    if (disabled) {
        onClick = () => {};
    }

    const icon = iconSrc && (
        <img
            className={classNames(iconClassName, styles.icon)}
            draggable={false}
            src={iconSrc}
        />
    );

    return (
        <span
            className={classNames(
                styles.outlinedButton,
                styles.button,
                className,
                {
                    [styles.modDisabled]: disabled,
                    [styles.highlighted]: highlighted
                }
            )}
            role="button"
            onClick={onClick}
            {...props}
        >
            {icon}
            <div className={styles.content}>{children}</div>
        </span>
    );
};

ButtonComponent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    highlighted: PropTypes.bool,
    iconClassName: PropTypes.string,
    iconSrc: PropTypes.string,
    onClick: PropTypes.func.isRequired
};

export default ButtonComponent;