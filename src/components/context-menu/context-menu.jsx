import React from 'react';
import {Menu, MenuItem} from '@szhsin/react-menu';
import classNames from 'classnames';

import styles from './context-menu.css';

const StyledContextMenu = props => (
    <Menu
        {...props}
        className={styles.contextMenu}
    />
);

const StyledMenuItem = props => (
    <MenuItem
        {...props}
        className={styles.menuItem}
    />
);

const BorderedMenuItem = props => (
    <MenuItem
        {...props}
        className={classNames(styles.menuItem, styles.menuItemBordered)}
    />
);


export {
    BorderedMenuItem,
    StyledContextMenu as ContextMenu,
    StyledMenuItem as MenuItem
};