import React from 'react';
import configureStore from 'redux-mock-store';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import HashParserHOC from '../../../src/lib/hash-parser-hoc.jsx';

jest.mock('react-ga');

describe('HashParserHOC', () => {
    const mockStore = configureStore();
    let store;

    beforeEach(() => {
        store = mockStore({
            scratchGui: {
                projectState: {}
            }
        });
    });

    test('when there is a hash, it passes the hash as projectId', () => {
        const Component = ({projectId}) => <div>{projectId}</div>;
        const WrappedComponent = HashParserHOC(Component);
        window.location.hash = '#1234567';
        const mockSetProjectIdFunc = jest.fn();
        render(
            <WrappedComponent
                setProjectId={mockSetProjectIdFunc}
                store={store}
            />
        );
        expect(mockSetProjectIdFunc).toHaveBeenCalledWith('1234567');
    });

    test('when there is no hash, it passes 0 as the projectId', () => {
        const Component = ({projectId}) => <div>{projectId}</div>;
        const WrappedComponent = HashParserHOC(Component);
        window.location.hash = '';
        const mockSetProjectIdFunc = jest.fn();
        render(
            <WrappedComponent
                setProjectId={mockSetProjectIdFunc}
                store={store}
            />
        );
        expect(mockSetProjectIdFunc).toHaveBeenCalledWith('0');
    });

    test('when the hash is not a number, it passes 0 as projectId', () => {
        const Component = ({projectId}) => <div>{projectId}</div>;
        const WrappedComponent = HashParserHOC(Component);
        window.location.hash = '#winning';
        const mockSetProjectIdFunc = jest.fn();
        render(
            <WrappedComponent
                setProjectId={mockSetProjectIdFunc}
                store={store}
            />
        );
        expect(mockSetProjectIdFunc).toHaveBeenCalledWith('0');
    });

    test('when hash change happens, the projectId state is changed', () => {
        const Component = ({projectId}) => <div>{projectId}</div>;
        const WrappedComponent = HashParserHOC(Component);
        window.location.hash = '';
        const mockSetProjectIdFunc = jest.fn();
        const { container } = render(
            <WrappedComponent
                setProjectId={mockSetProjectIdFunc}
                store={store}
            />
        );
        window.location.hash = '#1234567';
        act(() => {
            // Simulate hash change event
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        });
        expect(mockSetProjectIdFunc).toHaveBeenCalledTimes(2);
    });
});