import { ref, onMounted, onUnmounted, watchEffect } from "vue";
import { findDuplicateIds } from "./core";

export function useDuplicateIds(rootRef: any = null) {
  const duplicates: any = ref([]);
  let observer: MutationObserver;

  const check = () => {
    duplicates.value = findDuplicateIds(rootRef?.value ?? document);
  };

  onMounted(() => {
    check();
    observer = new MutationObserver(check);
    observer.observe(rootRef?.value ?? document.body, {
      subtree: true,
      childList: true,
      attributes: true,
    });
  });

  onUnmounted(() => observer?.disconnect());

  return { duplicates };
}
