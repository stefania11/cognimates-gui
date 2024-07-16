import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import IconButton from '../../../src/components/icon-button/icon-button';

describe('IconButtonComponent', () => {
    test('renders correctly and triggers callback when clicked', () => {
        const onClick = jest.fn();
        const title = <div>Text</div>;
        const imgSrc = 'imgSrc';
        const className = 'custom-class-name';

        const {getByRole} = render(
            <IconButton
                className={className}
                img={imgSrc}
                title={title}
                onClick={onClick}
            />
        );

        const button = getByRole('button');
        expect(button).toHaveClass(className);
        expect(button.querySelector('img')).toHaveAttribute('src', imgSrc);
        expect(button).toHaveTextContent('Text');

        fireEvent.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});