export function findDuplicateIds(root: Element | Document = document) {
  const seen = new Map<string, Element[]>();

  root.querySelectorAll("[id]").forEach((element) => {
    const id = element.id;
    if (!seen.has(id)) {
      seen.set(id, []);
    }
    seen.get(id)!.push(element);
  });

  return Array.from(seen.entries())
    .filter(([, elements]) => elements.length > 1)
    .map(([id, elements]) => ({ id, elements }));
}
