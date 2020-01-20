import React from 'react';
import AppInput, { InputHook, DEBOUNCE_RATE, AppInputProps } from './AppInput';
import { render, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

jest.useFakeTimers();

// let container: Element | null = null;
// beforeEach(() => {
//   container = document.createElement('div');
//   document.body.appendChild(container);
// })

// afterEach(() => {
//   if (!container) return;
//   unmountComponentAtNode(container);
//   container.remove();
//   container = null;
// })

const setup = (inputProps?: AppInputProps) => {
  const utils = render(<AppInput {...inputProps} />);
  const input = document.querySelector('input');
  return {
    input,
    ...utils,
  };
};

const testErrorMsg = 'Test Error Message';
const testInput = 'Test Input';
const testErrorMsgMatcher = new RegExp(testErrorMsg, 'g');
const testValidator = (text: string) => {
  return {
    isValid: false,
    errorMsg: testErrorMsg,
  };
};

test('test result returned from result hook, no validations', () => {
  const fn = jest.fn();
  const { input } = setup({
    onResultHook: fn,
  });
  if (!input) return;
  fireEvent.change(input, { target: { value: testInput } });
  act(() => {
    jest.runAllTimers();
  });
  expect(fn).toHaveBeenCalled();
});

test('test validation causes display of error message and does not return result', () => {
  const fn = jest.fn();
  const { input, getByText } = setup({
    onResultHook: fn,
    validations: [testValidator],
  });
  if (!input) return;
  fireEvent.change(input, { target: { value: testInput } });
  act(() => {
    jest.runAllTimers();
  });
  expect(fn).not.toHaveBeenCalled();

  getByText(testErrorMsgMatcher);
});
