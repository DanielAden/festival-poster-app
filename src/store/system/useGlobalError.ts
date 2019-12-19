import { useDispatch, useSelector } from "react-redux";
import { SystemState } from "./types";
import { setSystemError, setSystemErrorMsg, setSystemErrorType } from './actions'

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
let dispatchFN: ErrorDispatch | undefined;
type ClearDispatch = () => void;
let clearFN: ClearDispatch;
  /**
   * Hook to access set global error fields
   *
   * @returns [error dispatch function, clear error function]
   *
   */
export function useGlobalErrorDispatch(): [ErrorDispatch, ClearDispatch] {
  const dispatch = useDispatch();
  if (dispatchFN === undefined) {
    dispatchFN = (msg: string, type?: string) => {
      const errorType = (type !== undefined) ? type : '';
      dispatch(setSystemError(true));
      dispatch(setSystemErrorMsg(msg));
      dispatch(setSystemErrorType(errorType));
    }
  }
  if (clearFN === undefined) {
    clearFN = () => {
      dispatch(setSystemError(false));
      dispatch(setSystemErrorMsg(''));
      dispatch(setSystemErrorType(''));
    }
  }
  return [dispatchFN, clearFN];
}