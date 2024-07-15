import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import LibraryItem from '../../containers/library-item.jsx';
import Modal from '../../containers/modal.jsx';
import Divider from '../divider/divider.jsx';
import Filter from '../filter/filter.jsx';
import TagButton from '../../containers/tag-button.jsx';
import analytics from '../../lib/analytics';

import styles from './library.css';

const messages = defineMessages({
    filterPlaceholder: {
        id: 'gui.library.filterPlaceholder',
        defaultMessage: 'Search',
        description: 'Placeholder text for library search field'
    },
    allTag: {
        id: 'gui.library.allTag',
        defaultMessage: 'All',
        description: 'Label for library tag to revert to all items after filtering by tag.'
    }
});

const ALL_TAG = {tag: 'all', intlLabel: messages.allTag};
const tagListPrefix = [ALL_TAG];

const LibraryComponent = props => {
    const intl = useIntl();
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [filterQuery, setFilterQuery] = React.useState('');
    const [selectedTag, setSelectedTag] = React.useState(ALL_TAG.tag);

    const handleClose = () => {
        props.onRequestClose();
        analytics.pageview(`/${props.id}/search?q=${filterQuery}`);
    };

    const handleFilterChange = event => {
        setFilterQuery(event.target.value);
        setSelectedTag(ALL_TAG.tag);
    };

    const handleFilterClear = () => {
        setFilterQuery('');
    };

    const handleMouseEnter = id => {
        if (props.onItemMouseEnter) props.onItemMouseEnter(getFilteredData()[id]);
    };

    const handleMouseLeave = id => {
        if (props.onItemMouseLeave) props.onItemMouseLeave(getFilteredData()[id]);
    };

    const handleSelect = id => {
        handleClose();
        props.onItemSelected(getFilteredData()[id]);
    };

    const handleTagClick = tag => {
        setFilterQuery('');
        setSelectedTag(tag.toLowerCase());
    };

    const getFilteredData = () => {
        if (selectedTag === 'all') {
            if (!filterQuery) return props.data;
            return props.data.filter(dataItem => (
                (dataItem.tags || [])
                    .map(String.prototype.toLowerCase.call, String.prototype.toLowerCase)
                    .concat(dataItem.name ?
                        (typeof dataItem.name === 'string' ?
                            dataItem.name : intl.formatMessage(dataItem.name.props)
                        ).toLowerCase() :
                        null)
                    .join('\n')
                    .indexOf(filterQuery.toLowerCase()) !== -1
            ));
        }
        return props.data.filter(dataItem => (
            dataItem.tags &&
            dataItem.tags
                .map(String.prototype.toLowerCase.call, String.prototype.toLowerCase)
                .indexOf(selectedTag) !== -1
        ));
    };

    const scrollToTop = () => {
        if (filteredDataRef.current) {
            filteredDataRef.current.scrollTop = 0;
        }
    };

    const filteredDataRef = React.useRef(null);

    React.useEffect(() => {
        scrollToTop();
    }, [filterQuery, selectedTag]);

    React.useEffect(() => {
        if (props.onItemMouseEnter) {
            const handleMouseEnter = id => props.onItemMouseEnter(getFilteredData()[id]);
            props.onItemMouseEnter = handleMouseEnter;
        }
        if (props.onItemMouseLeave) {
            const handleMouseLeave = id => props.onItemMouseLeave(getFilteredData()[id]);
            props.onItemMouseLeave = handleMouseLeave;
        }
    }, [props.onItemMouseEnter, props.onItemMouseLeave, getFilteredData]);
    return (
        <Modal
            fullScreen
            contentLabel={props.title}
            id={props.id}
            onRequestClose={handleClose}
        >
            {(props.filterable || props.tags) && (
                <div className={styles.filterBar}>
                    {props.filterable && (
                        <Filter
                            className={classNames(
                                styles.filterBarItem,
                                styles.filter
                            )}
                            filterQuery={filterQuery}
                            inputClassName={styles.filterInput}
                            placeholderText={intl.formatMessage(messages.filterPlaceholder)}
                            onChange={handleFilterChange}
                            onClear={handleFilterClear}
                        />
                    )}
                    {props.filterable && props.tags && (
                        <Divider className={classNames(styles.filterBarItem, styles.divider)} />
                    )}
                    {props.tags &&
                        <div className={styles.tagWrapper}>
                            {tagListPrefix.concat(props.tags).map((tagProps, id) => (
                                <TagButton
                                    active={selectedTag === tagProps.tag.toLowerCase()}
                                    className={classNames(
                                        styles.filterBarItem,
                                        styles.tagButton,
                                        tagProps.className
                                    )}
                                    key={`tag-button-${id}`}
                                    onClick={handleTagClick}
                                    {...tagProps}
                                />
                            ))}
                        </div>
                    }
                </div>
            )}
            <div
                className={classNames(styles.libraryScrollGrid, {
                    [styles.withFilterBar]: props.filterable || props.tags
                })}
                ref={filteredDataRef}
            >
                {getFilteredData().map((dataItem, index) => (
                    <LibraryItem
                        bluetoothRequired={dataItem.bluetoothRequired}
                        collaborator={dataItem.collaborator}
                        description={dataItem.description}
                        disabled={dataItem.disabled}
                        extensionId={dataItem.extensionId}
                        featured={dataItem.featured}
                        hidden={dataItem.hidden}
                        iconMd5={dataItem.md5}
                        iconRawURL={dataItem.rawURL}
                        icons={dataItem.json && dataItem.json.costumes}
                        id={index}
                        insetIconURL={dataItem.insetIconURL}
                        internetConnectionRequired={dataItem.internetConnectionRequired}
                        key={`item_${index}`}
                        name={dataItem.name}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onSelect={handleSelect}
                    />
                ))}
            </div>
        </Modal>
    );
};

LibraryComponent.propTypes = {
    data: PropTypes.arrayOf(
        /* eslint-disable react/no-unused-prop-types, lines-around-comment */
        // An item in the library
        PropTypes.shape({
            // @todo remove md5/rawURL prop from library, refactor to use storage
            md5: PropTypes.string,
            name: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.node
            ]),
            rawURL: PropTypes.string
        })
        /* eslint-enable react/no-unused-prop-types, lines-around-comment */
    ),
    filterable: PropTypes.bool,
    id: PropTypes.string.isRequired,
    onItemMouseEnter: PropTypes.func,
    onItemMouseLeave: PropTypes.func,
    onItemSelected: PropTypes.func,
    onRequestClose: PropTypes.func,
    tags: PropTypes.arrayOf(PropTypes.shape(TagButton.propTypes)),
    title: PropTypes.string.isRequired
};

LibraryComponent.defaultProps = {
    filterable: true
};
export default LibraryComponent;