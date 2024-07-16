import React from 'react';
import {render, screen, act} from '@testing-library/react';

import ThrottledPropertyHOC from '../../../src/lib/throttled-property-hoc.jsx';

describe('VMListenerHOC', () => {
    let renderResult;
    const throttleTime = 500;

    beforeEach(() => {
        jest.useFakeTimers();
        const Component = ({propToThrottle, doNotThrottle}) => (
            <input
                data-testid="test-input"
                name={doNotThrottle}
                value={propToThrottle}
            />
        );
        const WrappedComponent = ThrottledPropertyHOC('propToThrottle', throttleTime)(Component);

        global.Date.now = jest.fn(() => 0);

        renderResult = render(
            <WrappedComponent
                doNotThrottle="oldvalue"
                propToThrottle={0}
            />
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('it passes the props on initial render ', () => {
        const input = screen.getByTestId('test-input');
        expect(input).toHaveValue('0');
        expect(input).toHaveAttribute('name', 'oldvalue');
    });

    test('it does not rerender if throttled prop is updated too soon', () => {
        global.Date.now.mockReturnValue(throttleTime / 2);
        act(() => {
            renderResult.rerender(
                <WrappedComponent
                    doNotThrottle="oldvalue"
                    propToThrottle={1}
                />
            );
        });
        const input = screen.getByTestId('test-input');
        expect(input).toHaveValue('0');
    });

    test('it does rerender if throttled prop is updated after throttle timeout', () => {
        global.Date.now.mockReturnValue(throttleTime * 2);
        act(() => {
            renderResult.rerender(
                <WrappedComponent
                    doNotThrottle="oldvalue"
                    propToThrottle={1}
                />
            );
        });
        const input = screen.getByTestId('test-input');
        expect(input).toHaveValue('1');
    });

    test('it does rerender if a non-throttled prop is changed', () => {
        global.Date.now.mockReturnValue(throttleTime / 2);
        act(() => {
            renderResult.rerender(
                <WrappedComponent
                    doNotThrottle="newvalue"
                    propToThrottle={2}
                />
            );
        });
        const input = screen.getByTestId('test-input');
        expect(input).toHaveAttribute('name', 'newvalue');
        expect(input).toHaveValue('2');
    });
});