import React, { useState, useCallback } from 'react'
import { InputGroupAddon, InputGroup, Input, InputProps, FormGroup, FormFeedback } from 'reactstrap'
import { debounce, isUndefined } from 'lodash'
import AppButton from '../AppButton';

export const DEBOUNCE_RATE = 200;

export interface ValidationObject {
  isValid: boolean;
  errorMsg?: string;
}

export type InputValidator = (input: string) => ValidationObject; 
export type InputHook = (text: string) => void;
export type SubmitHook = (text: string) => ValidationObject;
export interface AppInputProps extends InputProps {
  submittable?: boolean;
  validations?: InputValidator[];
  changeHook?: InputHook; 
  onResultHook?: InputHook;
  submitHook?: SubmitHook;
}

const AppInput: React.FC<AppInputProps> = ({ validations, changeHook, onResultHook, submittable, submitHook, ...inputProps}) => {
  const [inputValue, setInputValue] = useState('');
  const [inError, setinError] = useState(false);
  const [errorText, seterrorText] = useState('');

  const getValidatedResultHook = () => {
    return debounce((newText: string) => {
      if (newText === '') {
        // reset to non error state
        setinError(false);
        seterrorText('');
        onResultHook?.('');
        return;
      }
      if (isUndefined(validations)) {
        onResultHook?.(newText);
        return;
      }
      if (validations.length === 0) {
        onResultHook?.(newText);
        return;
      }
      let errorVobj;
      validations.forEach(v => {
        const vobj = v(newText);
        if (vobj.isValid === false) {
          setinError(true);
          seterrorText(vobj.errorMsg || '');
          errorVobj = vobj;
          return vobj;
        }
      })
      if (errorVobj) return;
      setinError(false);
      seterrorText('');
      onResultHook?.(newText);
    }, DEBOUNCE_RATE)
  }
  const vFNs = (validations) ? validations : [];
  const dvHook = useCallback(getValidatedResultHook(), [...vFNs, onResultHook]);

  const handleChange = (newText: string) => {
    setInputValue(newText);
    changeHook?.(newText);
    dvHook?.(newText);
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (inError) return;
    if (!submitHook) return;
    const vobj = submitHook(inputValue);
    if (vobj.isValid) return;
    setinError(true); 
    seterrorText(vobj.errorMsg || '');
  }

  const renderSubmit = () => {
    return (
      <InputGroupAddon addonType="append">
        <AppButton disabled={inError || inputValue === ''} 
                   onClick={handleSubmit}>Submit</AppButton>
      </InputGroupAddon>
    )
  }

  const renderInput = () => {
    return (
      <FormGroup>
        <InputGroup>
          <Input className="app-input" 
                value={inputValue}
                {...inputProps}
                invalid={inError}
                onChange={(e) => handleChange(e.target.value)} />
          {submittable && renderSubmit()}
          {inError && <FormFeedback>{errorText}</FormFeedback>}
        </InputGroup>
      </FormGroup>
    )    
  }
  return renderInput();
}

export default AppInput
