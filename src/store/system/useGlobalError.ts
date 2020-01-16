import { useDispatch, useSelector } from "react-redux";
import { SystemState } from "./types";
import { setSystemError, setSystemErrorMsg, setSystemErrorType } from './actions'
import { useCallback } from "react";

interface RootState {
  system: SystemState,
}

interface ErrorInfo {
  isError: boolean;
  errorMsg: string;
  errorType: string;
}

  /**
   * Hook to access global error fields
   *
   * @returns ErrorInfo object
   *
   */

export function useGlobalError() { 
  const isError = useSelector((state: RootState) => state.system.error) 
  const errorMsg = useSelector((state: RootState) => state.system.errorMsg) 
  const errorType = useSelector((state: RootState) => state.system.errorType) 
  const errorInfo: ErrorInfo = {
    isError, 
    errorMsg, 
    errorType, 
  }
  return errorInfo;
}

type ErrorDispatch = (msg: string, type?: string) => void;
type ClearDispatch = () => void;
  /**
   * Hook to access set global error fields
   *
   * @returns [error dispatch function, clear error function]
   *
   */
export function useGlobalErrorDispatch(): [ErrorDispatch, ClearDispatch] {
  const dispatch = useDispatch();
  const dispatchFN = useCallback((msg: string, type?: string) => {
    const errorType = (type !== undefined) ? type : '';
    console.log('Dispatching Error Type: ' + type)
    dispatch(setSystemError(true));
    dispatch(setSystemErrorMsg(msg));
    dispatch(setSystemErrorType(errorType));
    console.log('Dispatched Error Type: ' + type)
  }, [dispatch])

  const clearFN = useCallback(() => {
    dispatch(setSystemError(false));
    dispatch(setSystemErrorMsg(''));
    dispatch(setSystemErrorType(''));
  }, [dispatch])

  return [dispatchFN, clearFN];
}