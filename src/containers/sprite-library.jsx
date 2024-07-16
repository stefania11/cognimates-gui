import PropTypes from 'prop-types';
import React from 'react';
import {useIntl, defineMessages} from 'react-intl';
import VM from 'scratch-vm';

import analytics from '../lib/analytics';
import spriteLibraryContent from '../lib/libraries/sprites.json';
import randomizeSpritePosition from '../lib/randomize-sprite-position';
import spriteTags from '../lib/libraries/sprite-tags';

import LibraryComponent from '../components/library/library.jsx';

const messages = defineMessages({
    libraryTitle: {
        defaultMessage: 'Choose a Sprite',
        description: 'Heading for the sprite library',
        id: 'gui.spriteLibrary.chooseASprite'
    }
});

const SpriteLibrary = ({onActivateBlocksTab, onRequestClose, vm}) => {
    const intl = useIntl();

    const handleItemSelect = (item) => {
        // Randomize position of library sprite
        randomizeSpritePosition(item);
        vm.addSprite(JSON.stringify(item.json)).then(() => {
            onActivateBlocksTab();
        });
        analytics.event({
            category: 'library',
            action: 'Select Sprite',
            label: item.name
        });
    };

    return (
        <LibraryComponent
            data={spriteLibraryContent}
            id="spriteLibrary"
            tags={spriteTags}
            title={intl.formatMessage(messages.libraryTitle)}
            onItemSelected={handleItemSelect}
            onRequestClose={onRequestClose}
        />
    );
};

SpriteLibrary.propTypes = {
    onActivateBlocksTab: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default SpriteLibrary;