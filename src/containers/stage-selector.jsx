import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import React, {useEffect, useCallback} from 'react';
import {useIntl} from 'react-intl';

import {connect} from 'react-redux';
import {openBackdropLibrary} from '../reducers/modals';
import {activateTab, COSTUMES_TAB_INDEX} from '../reducers/editor-tab';
import {showStandardAlert, closeAlertWithId} from '../reducers/alerts';
import {setHoveredSprite} from '../reducers/hovered-target';
import DragConstants from '../lib/drag-constants';
import DropAreaHOC from '../lib/drop-area-hoc.jsx';
import ThrottledPropertyHOC from '../lib/throttled-property-hoc.jsx';
import {emptyCostume} from '../lib/empty-assets';
import sharedMessages from '../lib/shared-messages';
import {fetchCode} from '../lib/backpack-api';

import StageSelectorComponent from '../components/stage-selector/stage-selector.jsx';

import backdropLibraryContent from '../lib/libraries/backdrops.json';
import {handleFileUpload, costumeUpload} from '../lib/file-uploader.js';

const dragTypes = [
    DragConstants.COSTUME,
    DragConstants.SOUND,
    DragConstants.BACKPACK_COSTUME,
    DragConstants.BACKPACK_SOUND,
    DragConstants.BACKPACK_CODE
];

const DroppableThrottledStage = DropAreaHOC(dragTypes)(
    ThrottledPropertyHOC('url', 500)(StageSelectorComponent)
);

const StageSelector = props => {
    const intl = useIntl();
    let fileInput = null;

    const addBackdropFromLibraryItem = useCallback(item => {
        const vmBackdrop = {
            name: item.name,
            md5: item.md5,
            rotationCenterX: item.info[0] && item.info[0] / 2,
            rotationCenterY: item.info[1] && item.info[1] / 2,
            bitmapResolution: item.info.length > 2 ? item.info[2] : 1,
            skinId: null
        };
        handleNewBackdrop(vmBackdrop);
    }, []);

    const handleClick = useCallback(() => {
        props.onSelect(props.id);
    }, [props.onSelect, props.id]);

    const handleNewBackdrop = useCallback(backdrops_ => {
        const backdrops = Array.isArray(backdrops_) ? backdrops_ : [backdrops_];
        return Promise.all(backdrops.map(backdrop =>
            props.vm.addBackdrop(backdrop.md5, backdrop)
        )).then(() =>
            props.onActivateTab(COSTUMES_TAB_INDEX)
        );
    }, [props.vm, props.onActivateTab]);

    const handleSurpriseBackdrop = useCallback(() => {
        // @todo should this not add a backdrop you already have?
        const item = backdropLibraryContent[Math.floor(Math.random() * backdropLibraryContent.length)];
        addBackdropFromLibraryItem(item);
    }, [addBackdropFromLibraryItem]);

    const handleEmptyBackdrop = useCallback(() => {
        handleNewBackdrop(emptyCostume(intl.formatMessage(sharedMessages.backdrop, {index: 1})));
    }, [handleNewBackdrop, intl]);

    const handleBackdropUpload = useCallback(e => {
        const storage = props.vm.runtime.storage;
        props.onShowImporting();
        handleFileUpload(e.target, (buffer, fileType, fileName, fileIndex, fileCount) => {
            costumeUpload(buffer, fileType, storage, vmCostumes => {
                vmCostumes.forEach((costume, i) => {
                    costume.name = `${fileName}${i ? i + 1 : ''}`;
                });
                handleNewBackdrop(vmCostumes).then(() => {
                    if (fileIndex === fileCount - 1) {
                        props.onCloseImporting();
                    }
                });
            }, props.onCloseImporting);
        }, props.onCloseImporting);
    }, [props.vm, props.onShowImporting, props.onCloseImporting, handleNewBackdrop]);

    const handleFileUploadClick = useCallback(() => {
        fileInput.click();
    }, []);

    const handleMouseEnter = useCallback(() => {
        props.dispatchSetHoveredSprite(props.id);
    }, [props.dispatchSetHoveredSprite, props.id]);

    const handleMouseLeave = useCallback(() => {
        props.dispatchSetHoveredSprite(null);
    }, [props.dispatchSetHoveredSprite]);

    const handleDrop = useCallback(dragInfo => {
        if (dragInfo.dragType === DragConstants.COSTUME) {
            props.vm.shareCostumeToTarget(dragInfo.index, props.id);
        } else if (dragInfo.dragType === DragConstants.SOUND) {
            props.vm.shareSoundToTarget(dragInfo.index, props.id);
        } else if (dragInfo.dragType === DragConstants.BACKPACK_COSTUME) {
            props.vm.addCostume(dragInfo.payload.body, {
                name: dragInfo.payload.name
            }, props.id);
        } else if (dragInfo.dragType === DragConstants.BACKPACK_SOUND) {
            props.vm.addSound({
                md5: dragInfo.payload.body,
                name: dragInfo.payload.name
            }, props.id);
        } else if (dragInfo.dragType === DragConstants.BACKPACK_CODE) {
            fetchCode(dragInfo.payload.bodyUrl)
                .then(blocks => {
                    props.vm.shareBlocksToTarget(blocks, props.id);
                    props.vm.refreshWorkspace();
                });
        }
    }, [props.vm, props.id]);

    const setFileInput = useCallback(input => {
        fileInput = input;
    }, []);

    const componentProps = omit(props, [
        'asset', 'dispatchSetHoveredSprite', 'id', 'intl',
        'onActivateTab', 'onSelect', 'onShowImporting', 'onCloseImporting']);

    return (
        <DroppableThrottledStage
            fileInputRef={setFileInput}
            onBackdropFileUpload={handleBackdropUpload}
            onBackdropFileUploadClick={handleFileUploadClick}
            onClick={handleClick}
            onDrop={handleDrop}
            onEmptyBackdropClick={handleEmptyBackdrop}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onSurpriseBackdropClick={handleSurpriseBackdrop}
            {...componentProps}
        />
    );
};
StageSelector.propTypes = {
    ...StageSelectorComponent.propTypes,
    id: PropTypes.string,
    onCloseImporting: PropTypes.func,
    onSelect: PropTypes.func,
    onShowImporting: PropTypes.func
};

const mapStateToProps = (state, {asset, id}) => ({
    url: asset && asset.encodeDataURI(),
    vm: state.scratchGui.vm,
    receivedBlocks: state.scratchGui.hoveredTarget.receivedBlocks &&
            state.scratchGui.hoveredTarget.sprite === id,
    raised: state.scratchGui.blockDrag
});

const mapDispatchToProps = dispatch => ({
    onNewBackdropClick: e => {
        e.stopPropagation();
        dispatch(openBackdropLibrary());
    },
    onActivateTab: tabIndex => {
        dispatch(activateTab(tabIndex));
    },
    dispatchSetHoveredSprite: spriteId => {
        dispatch(setHoveredSprite(spriteId));
    },
    onCloseImporting: () => dispatch(closeAlertWithId('importingAsset')),
    onShowImporting: () => dispatch(showStandardAlert('importingAsset'))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StageSelector);
