import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {defineMessages, useIntl} from 'react-intl';

import extensionLibraryContent from '../lib/libraries/extensions/index.jsx';

import analytics from '../lib/analytics';
import LibraryComponent from '../components/library/library.jsx';
import extensionIcon from '../components/action-menu/icon--sprite.svg';

const messages = defineMessages({
    extensionTitle: {
        defaultMessage: 'Choose an Extension',
        description: 'Heading for the extension library',
        id: 'gui.extensionLibrary.chooseAnExtension'
    },
    extensionUrl: {
        defaultMessage: 'Enter the URL of the extension',
        description: 'Prompt for unoffical extension url',
        id: 'gui.extensionLibrary.extensionUrl'
    }
});

const ExtensionLibrary = ({onCategorySelected, onRequestClose, visible, vm}) => {
    const intl = useIntl();

    const handleItemSelect = (item) => {
        const id = item.extensionId;
        let url = item.extensionURL ? item.extensionURL : id;
        if (!item.disabled && !id) {
            // eslint-disable-next-line no-alert
            url = prompt(intl.formatMessage(messages.extensionUrl));
        }
        if (id && !item.disabled) {
            if (vm.extensionManager.isExtensionLoaded(url)) {
                onCategorySelected(id);
            } else {
                vm.extensionManager.loadExtensionURL(url).then(() => {
                    onCategorySelected(id);
                });
            }
        }
        let gaLabel = '';
        if (typeof (item.name) === 'string') {
            gaLabel = item.name;
        } else {
            // Name is localized, get the default message for the gaLabel
            gaLabel = item.name.props.defaultMessage;
        }
        analytics.event({
            category: 'library',
            action: 'Select Extension',
            label: gaLabel
        });
    };

    const refresh = () => {
        // This function is empty as setState(state) is not needed in functional components
    };

    const extensionLibraryThumbnailData = extensionLibraryContent.map(extension => ({
        rawURL: extension.iconURL || extensionIcon,
        ...extension
    }));

    return (
        <LibraryComponent
            data={extensionLibraryThumbnailData}
            filterable={false}
            id="extensionLibrary"
            title={intl.formatMessage(messages.extensionTitle)}
            visible={visible}
            onItemSelected={handleItemSelect}
            onRequestClose={onRequestClose}
            refresh={refresh}
        />
    );
};

ExtensionLibrary.propTypes = {
    onCategorySelected: PropTypes.func,
    onRequestClose: PropTypes.func,
    visible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default ExtensionLibrary;