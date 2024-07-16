import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import ButtonComponent from '../../../src/components/button/button';

describe('ButtonComponent', () => {
    test('renders correctly', () => {
        const onClick = jest.fn();
        render(<ButtonComponent onClick={onClick} />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    test('triggers callback when clicked', () => {
        const onClick = jest.fn();
        render(<ButtonComponent onClick={onClick} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(onClick).toHaveBeenCalled();
    });
});