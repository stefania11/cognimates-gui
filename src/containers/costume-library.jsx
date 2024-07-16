import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import VM from 'scratch-vm';

import analytics from '../lib/analytics';
import costumeLibraryContent from '../lib/libraries/costumes.json';
import spriteTags from '../lib/libraries/sprite-tags';
import LibraryComponent from '../components/library/library.jsx';

const messages = defineMessages({
    libraryTitle: {
        defaultMessage: 'Choose a Costume',
        description: 'Heading for the costume library',
        id: 'gui.costumeLibrary.chooseACostume'
    }
});

const CostumeLibrary = props => {
    const intl = useIntl();

    const handleItemSelected = item => {
        const split = item.md5.split('.');
        const type = split.length > 1 ? split[1] : null;
        const rotationCenterX = type === 'svg' ? item.info[0] : item.info[0] / 2;
        const rotationCenterY = type === 'svg' ? item.info[1] : item.info[1] / 2;
        const vmCostume = {
            name: item.name,
            rotationCenterX,
            rotationCenterY,
            bitmapResolution: item.info.length > 2 ? item.info[2] : 1,
            skinId: null
        };
        props.vm.addCostumeFromLibrary(item.md5, vmCostume);
        analytics.event({
            category: 'library',
            action: 'Select Costume',
            label: item.name
        });
    };

    return (
        <LibraryComponent
            data={costumeLibraryContent}
            id="costumeLibrary"
            tags={spriteTags}
            title={intl.formatMessage(messages.libraryTitle)}
            onItemSelected={handleItemSelected}
            onRequestClose={props.onRequestClose}
        />
    );
};

CostumeLibrary.propTypes = {
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default CostumeLibrary;