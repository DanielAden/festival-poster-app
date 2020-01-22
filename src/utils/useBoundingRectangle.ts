import { useState, useRef, useEffect } from 'react';
import { useWindowSize } from './useWindowSize';

export type UseBoundingRectangle<T> = [DOMRect | null, React.RefObject<T>];
export function useBoundingRectangle<
  T extends HTMLElement
>(): UseBoundingRectangle<T> {
  const [w, h] = useWindowSize();
  const [rect, setrect] = useState<DOMRect | null>(null);
  const ref = useRef<T>(null);
  const { current } = ref;

  useEffect(() => {
    const rect = current?.getBoundingClientRect();
    setrect(rect || null);
  }, [current, w, h]);
  return [rect, ref];
}
