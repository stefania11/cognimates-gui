import 'web-audio-test-api';

import React from 'react';
import configureStore from 'redux-mock-store';
import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import VM from 'scratch-vm';
import {LoadingState} from '../../../src/reducers/project-state';

import vmManagerHOC from '../../../src/lib/vm-manager-hoc.jsx';

describe('VMManagerHOC', () => {
    const mockStore = configureStore();
    let store;
    let vm;

    beforeEach(() => {
        store = mockStore({
            scratchGui: {
                projectState: {},
                mode: {},
                vmStatus: {}
            }
        });
        vm = new VM();
        vm.attachAudioEngine = jest.fn();
        vm.setCompatibilityMode = jest.fn();
        vm.start = jest.fn();
    });
    test('when it mounts in player mode, the vm is initialized but not started', () => {
        const Component = () => (<div data-testid="test-component" />);
        const WrappedComponent = vmManagerHOC(Component);
        render(
            <WrappedComponent
                isPlayerOnly
                isStarted={false}
                store={store}
                vm={vm}
            />
        );
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
        expect(vm.attachAudioEngine).toHaveBeenCalledTimes(1);
        expect(vm.setCompatibilityMode).toHaveBeenCalledTimes(1);
        expect(vm.initialized).toBe(true);

        // But vm should not be started automatically
        expect(vm.start).not.toHaveBeenCalled();
    });
    test('when it mounts in editor mode, the vm is initialized and started', () => {
        const Component = () => (<div data-testid="test-component" />);
        const WrappedComponent = vmManagerHOC(Component);
        render(
            <WrappedComponent
                isPlayerOnly={false}
                isStarted={false}
                store={store}
                vm={vm}
            />
        );
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
        expect(vm.attachAudioEngine).toHaveBeenCalledTimes(1);
        expect(vm.setCompatibilityMode).toHaveBeenCalledTimes(1);
        expect(vm.initialized).toBe(true);

        expect(vm.start).toHaveBeenCalled();
    });
    test('if it mounts with an initialized vm, it does not reinitialize the vm but will start it', () => {
        const Component = () => <div data-testid="test-component" />;
        const WrappedComponent = vmManagerHOC(Component);
        vm.initialized = true;
        render(
            <WrappedComponent
                isPlayerOnly={false}
                isStarted={false}
                store={store}
                vm={vm}
            />
        );
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
        expect(vm.attachAudioEngine).not.toHaveBeenCalled();
        expect(vm.setCompatibilityMode).not.toHaveBeenCalled();
        expect(vm.initialized).toBe(true);

        expect(vm.start).toHaveBeenCalled();
    });

    test('if it mounts without starting the VM, it can be started by switching to editor mode', () => {
        const Component = () => <div data-testid="test-component" />;
        const WrappedComponent = vmManagerHOC(Component);
        vm.initialized = true;
        const {rerender} = render(
            <WrappedComponent
                isPlayerOnly
                isStarted={false}
                store={store}
                vm={vm}
            />
        );
        expect(vm.start).not.toHaveBeenCalled();
        act(() => {
            rerender(
                <WrappedComponent
                    isPlayerOnly={false}
                    isStarted={false}
                    store={store}
                    vm={vm}
                />
            );
        });
        expect(vm.start).toHaveBeenCalled();
    });
    test('if it mounts with an initialized and started VM, it does not start again', () => {
        const Component = () => <div data-testid="test-component" />;
        const WrappedComponent = vmManagerHOC(Component);
        vm.initialized = true;
        const { rerender } = render(
            <WrappedComponent
                isPlayerOnly
                isStarted
                store={store}
                vm={vm}
            />
        );
        expect(vm.start).not.toHaveBeenCalled();
        act(() => {
            rerender(
                <WrappedComponent
                    isPlayerOnly={false}
                    isStarted
                    store={store}
                    vm={vm}
                />
            );
        });
        expect(vm.start).not.toHaveBeenCalled();
    });
    test('if the isLoadingWithId prop becomes true, it loads project data into the vm', async () => {
        vm.loadProject = jest.fn(() => Promise.resolve());
        const mockedOnLoadedProject = jest.fn();
        const Component = () => <div data-testid="test-component" />;
        const WrappedComponent = vmManagerHOC(Component);
        const { rerender } = render(
            <WrappedComponent
                fontsLoaded
                isLoadingWithId={false}
                store={store}
                vm={vm}
                onLoadedProject={mockedOnLoadedProject}
            />
        );
        await act(async () => {
            rerender(
                <WrappedComponent
                    canSave
                    fontsLoaded
                    isLoadingWithId
                    loadingState={LoadingState.LOADING_VM_WITH_ID}
                    projectData="100"
                    store={store}
                    vm={vm}
                    onLoadedProject={mockedOnLoadedProject}
                />
            );
        });
        expect(vm.loadProject).toHaveBeenLastCalledWith('100');
        expect(mockedOnLoadedProject).toHaveBeenLastCalledWith(LoadingState.LOADING_VM_WITH_ID, true);
    });
    test('if the fontsLoaded prop becomes true, it loads project data into the vm', async () => {
        vm.loadProject = jest.fn(() => Promise.resolve());
        const mockedOnLoadedProject = jest.fn();
        const Component = () => <div data-testid="test-component" />;
        const WrappedComponent = vmManagerHOC(Component);
        const { rerender } = render(
            <WrappedComponent
                isLoadingWithId
                store={store}
                vm={vm}
                onLoadedProject={mockedOnLoadedProject}
            />
        );
        await act(async () => {
            rerender(
                <WrappedComponent
                    fontsLoaded
                    isLoadingWithId
                    loadingState={LoadingState.LOADING_VM_WITH_ID}
                    projectData="100"
                    store={store}
                    vm={vm}
                    onLoadedProject={mockedOnLoadedProject}
                />
            );
        });
        expect(vm.loadProject).toHaveBeenLastCalledWith('100');
        expect(mockedOnLoadedProject).toHaveBeenLastCalledWith(LoadingState.LOADING_VM_WITH_ID, false);
    });
    test('if the fontsLoaded prop is false, project data is never loaded', async () => {
        vm.loadProject = jest.fn(() => Promise.resolve());
        const mockedOnLoadedProject = jest.fn();
        const Component = () => <div data-testid="test-component" />;
        const WrappedComponent = vmManagerHOC(Component);
        const { rerender } = render(
            <WrappedComponent
                isLoadingWithId
                store={store}
                vm={vm}
                onLoadedProject={mockedOnLoadedProject}
            />
        );
        await act(async () => {
            rerender(
                <WrappedComponent
                    isLoadingWithId
                    loadingState={LoadingState.LOADING_VM_WITH_ID}
                    projectData="100"
                    store={store}
                    vm={vm}
                    onLoadedProject={mockedOnLoadedProject}
                />
            );
        });
        expect(vm.loadProject).not.toHaveBeenCalled();
        expect(mockedOnLoadedProject).not.toHaveBeenCalled();
    });
});
