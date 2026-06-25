import { useState, useEffect, useCallback, useRef } from "react";
import { findDuplicateIds } from "./core";

interface IOptions {
  root?: Element | Document;
  onDuplicate?: (duplicates: any[]) => void;
}
export function useDuplicateIds(options = {} as IOptions) {
  const { root, onDuplicate } = options;
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const observer: React.RefObject<MutationObserver | null> = useRef(null);

  useEffect(() => {
    if (duplicates.length > 0) {
      onDuplicate?.(duplicates);
    }
  }, [duplicates, onDuplicate]);

  const check = useCallback(() => {
    setDuplicates(findDuplicateIds((root ?? document) as Document));
  }, [root, findDuplicateIds]);

  useEffect(() => {
    check();
    observer.current = new MutationObserver(check);
    observer.current.observe(root ?? document.body, {
      subtree: true,
      childList: true,
      attributes: true,
    });

    return () => observer.current?.disconnect();
  }, [check, root]);

  return duplicates;
}
