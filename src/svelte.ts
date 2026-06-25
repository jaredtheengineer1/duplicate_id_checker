import { findDuplicateIds } from "./core";

interface IOptions {
  onDuplicate?: (duplicates: any[]) => void;
}

export function duplicateIds(
  node: Document | Node | undefined,
  options: IOptions = {},
) {
  const check = () => {
    const found = findDuplicateIds(node as Document);
    if (found.length > 0) {
      options.onDuplicate?.(found);
    }
  };

  const observer = new MutationObserver(check);
  observer.observe(node as Node, {
    subtree: true,
    childList: true,
    attributes: true,
  });
  check();

  return { destroy: () => observer.disconnect() };
}
