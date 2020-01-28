import { GroupProps, GroupSubmitOptions } from './Group';
import { ModalGroupProps } from '.';
import { useState, useMemo, useCallback } from 'react';
import produce from 'immer';
import { GroupStatePkg } from '.';

export type UseGroup<T> = [GroupStatePkg<T>, GroupProps<T>];
export const useGroup = <T>(
  pageHeaders: string[],
  submitOptions: GroupSubmitOptions<T>,
  initialState: T,
): UseGroup<T> => {
  const [currentPage, setCurrentPage] = useState(0);
  const [state, setState] = useState<T>(initialState);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _pageHeaders = useMemo(() => pageHeaders, []);

  const mergeState = useCallback((newState: Partial<T>) => {
    setState(
      produce(draft => {
        // draft = { ...draft, ...newState };
        Object.assign(draft, newState);
      }),
    );
  }, []);

  const _onNextPage = useCallback(() => {
    setCurrentPage(currentPage + 1);
  }, [currentPage]);

  const _onPrevPage = useCallback(() => {
    if (currentPage === 0) return;
    setCurrentPage(currentPage - 1);
  }, [currentPage]);

  // const groupStatePkg = useMemo(
  //   () => ({
  //     state,
  //     mergeState,
  //   }),
  //   [mergeState, state],
  // );

  const groupStatePkg = {
    state,
    mergeState,
  };

  return [
    groupStatePkg,
    {
      groupStatePkg,
      pageHeaders: _pageHeaders,
      currentPage,
      onNextPage: _onNextPage,
      onPrevPage: _onPrevPage,
      submitOptions,
    },
  ];
};

export type UseModalGroup<T> = [GroupStatePkg<T>, ModalGroupProps, () => void];
export const useModalGroup = <T>(
  pageHeaders: string[],
  submitOptions: GroupSubmitOptions<T>,
  initialState: T,
): UseModalGroup<T> => {
  const [gsp, groupProps] = useGroup(pageHeaders, submitOptions, initialState);
  const [active, setActive] = useState(false);

  const toggle = useCallback(() => {
    setActive(oldActive => !oldActive);
  }, []);

  return [
    gsp,
    {
      ...groupProps,
      toggle,
      active,
    },
    toggle,
  ];
};
