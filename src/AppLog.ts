import useTypedSelector from "./store/rootReducer";
import { useDispatch } from "react-redux";
import { caughtGlobalError, AppErrorType } from "./store/system/systemSlice";
import { useCallback } from "react";




// TODO implement smarter error logging.  This will so far 
//      only catch one error at a time.
export const useErrorLog = () => {
  const error = useTypedSelector(s => s.system.error)
  const dispatch = useDispatch();

  const log = useCallback((e: Error, type?: AppErrorType) => {
    if (error.isError) return; 
    if (type) (e as any).errorType = type;
    dispatch(caughtGlobalError(e));
  }, [dispatch, error.isError])
  return log;
}

export const useAppLog = () => {
  const log = useCallback((data: any) => {
    console.log(data);
  }, [])
  return log;
}