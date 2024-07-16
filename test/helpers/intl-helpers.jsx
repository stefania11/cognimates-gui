/*
 * Helpers for using react-test-renderer with react-intl
 * Updated for the latest react-intl API
 */
import React from 'react';
import renderer from 'react-test-renderer';
import {IntlProvider, createIntl, createIntlCache} from 'react-intl';

const cache = createIntlCache();
const createIntlForTests = (locale = 'en', messages = {}) => createIntl({locale, messages}, cache);

const intl = createIntlForTests();

const nodeWithIntlProp = node => React.cloneElement(node, {intl});

// react-test-renderer component for use with snapshot testing
const componentWithIntl = (children, props = {locale: 'en', messages: {}}) => renderer.create(
    <IntlProvider {...props}>{children}</IntlProvider>
);

export {
    componentWithIntl,
    createIntlForTests
};