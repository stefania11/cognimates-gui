import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import CloseButton from '../close-button/close-button.jsx';
import styles from './sprite-selector-item.css';
import { ControlledMenu, useMenuState } from '@szhsin/react-menu';
import { BorderedMenuItem, MenuItem } from '../context-menu/context-menu.jsx';
import { FormattedMessage } from 'react-intl';

const SpriteSelectorItem = props => {
    const [menuProps, toggleMenu] = useMenuState();

    return (
        <div
            className={classNames(props.className, styles.spriteSelectorItem, {
                [styles.isSelected]: props.selected
            })}
            onClick={props.onClick}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onMouseDown}
            onContextMenu={e => {
                e.preventDefault();
                toggleMenu(true);
            }}
        >
            {typeof props.number === 'undefined' ? null : (
                <div className={styles.number}>{props.number}</div>
            )}
            {props.costumeURL ? (
                <div className={styles.spriteImageOuter}>
                    <div className={styles.spriteImageInner}>
                        <img
                            className={styles.spriteImage}
                            draggable={false}
                            src={props.costumeURL}
                        />
                    </div>
                </div>
            ) : null}
            <div className={styles.spriteInfo}>
                <div className={styles.spriteName}>{props.name}</div>
                {props.details ? (
                    <div className={styles.spriteDetails}>{props.details}</div>
                ) : null}
            </div>
            {(props.selected && props.onDeleteButtonClick) ? (
                <CloseButton
                    className={styles.deleteButton}
                    size={CloseButton.SIZE_SMALL}
                    onClick={props.onDeleteButtonClick}
                />
            ) : null }
            {props.onDuplicateButtonClick || props.onDeleteButtonClick || props.onExportButtonClick ? (
                <ControlledMenu {...menuProps}>
                    {props.onDuplicateButtonClick ? (
                        <MenuItem onClick={props.onDuplicateButtonClick}>
                            <FormattedMessage
                                defaultMessage="duplicate"
                                description="Menu item to duplicate in the right click menu"
                                id="gui.spriteSelectorItem.contextMenuDuplicate"
                            />
                        </MenuItem>
                    ) : null}
                    {props.onExportButtonClick ? (
                        <MenuItem onClick={props.onExportButtonClick}>
                            <FormattedMessage
                                defaultMessage="export"
                                description="Menu item to export the selected item"
                                id="gui.spriteSelectorItem.contextMenuExport"
                            />
                        </MenuItem>
                    ) : null }
                    {props.onDeleteButtonClick ? (
                        <BorderedMenuItem onClick={props.onDeleteButtonClick}>
                            <FormattedMessage
                                defaultMessage="delete"
                                description="Menu item to delete in the right click menu"
                                id="gui.spriteSelectorItem.contextMenuDelete"
                            />
                        </BorderedMenuItem>
                    ) : null }
                </ControlledMenu>
            ) : null}
        </div>
    );
};

SpriteSelectorItem.propTypes = {
    className: PropTypes.string,
    costumeURL: PropTypes.string,
    details: PropTypes.string,
    dragging: PropTypes.bool,
    name: PropTypes.string.isRequired,
    number: PropTypes.number,
    onClick: PropTypes.func,
    onDeleteButtonClick: PropTypes.func,
    onDuplicateButtonClick: PropTypes.func,
    onExportButtonClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    selected: PropTypes.bool.isRequired
};

export default SpriteSelectorItem;