# duplicate-id-checker

Finds duplicate HTML `id` attributes in your DOM. Duplicate IDs break accessibility, confuse screen readers, and cause unpredictable behavior in CSS and JavaScript. This package helps you catch them at runtime — with framework integrations for React, Vue, Svelte, and Angular.

## Installation

```bash
npm install duplicate_id_checker
```

## Usage

### Vanilla JS

```js
import { findDuplicateIds } from 'duplicate_id_checker';

const duplicates = findDuplicateIds();

if (duplicates.length > 0) {
  console.warn('Duplicate IDs found:', duplicates);
}
```

By default, `findDuplicateIds` searches the entire document. You can optionally pass a root element to scope the search:

```js
const section = document.querySelector('#my-section');
const duplicates = findDuplicateIds(section);
```

Each result in the returned array has the shape:

```ts
{
  id: string;       // the duplicate ID value
  elements: Element[]; // all elements with this ID, in DOM order
}
```

---

### React

```tsx
import { useDuplicateIds } from 'duplicate_id_checker/react';

function App() {
  const duplicates = useDuplicateIds();

  if (duplicates.length > 0) {
    console.warn('Duplicate IDs:', duplicates);
  }

  return <div>...</div>;
}
```

The hook observes the DOM for changes and re-checks automatically. You can optionally scope it to a specific element:

```tsx
const ref = useRef<HTMLDivElement>(null);
const duplicates = useDuplicateIds({ root: ref.current });
```

You can also pass an `onDuplicate` callback:

```tsx
const duplicates = useDuplicateIds({
  onDuplicate: (dupes) => console.warn('Found:', dupes),
});
```

---

### Vue

```vue
<script setup>
import { useTemplateRef } from 'vue';
import { useDuplicateIds } from 'duplicate_id_checker/vue';

const root = useTemplateRef('root');
const { duplicates } = useDuplicateIds(root);
</script>

<template>
  <div ref="root">...</div>
</template>
```

---

### Svelte

```svelte
<script>
  import { duplicateIds } from 'duplicate_id_checker/svelte';

  function onDuplicate(dupes) {
    console.warn('Duplicate IDs:', dupes);
  }
</script>

<div use:duplicateIds={{ onDuplicate }}>
  ...
</div>
```

---

### Angular

Two options are available: a **service** for programmatic use, and a **directive** for declarative use in templates.

**Service**

```ts
import { Component, inject } from '@angular/core';
import { DuplicateIdChecker } from 'duplicate_id_checker/angular';

@Component({ ... })
export class AppComponent {
  checker = inject(DuplicateIdChecker);

  ngOnInit() {
    const dupes = this.checker.check();
    if (dupes.length) console.warn('Duplicate IDs:', dupes);
  }
}
```

**Directive**

```ts
import { DuplicateIdCheckDirective } from 'duplicate_id_checker/angular';

@Component({
  standalone: true,
  imports: [DuplicateIdCheckDirective],
  template: `
    <div duplicateIdCheck (duplicatesFound)="onDupes($event)">
      ...
    </div>
  `,
})
export class AppComponent {
  onDupes(dupes: any[]) {
    console.warn('Duplicate IDs:', dupes);
  }
}
```

---

## Why duplicate IDs matter

- **Accessibility**: Screen readers and assistive technologies rely on unique IDs for labels, descriptions, and landmark navigation. Duplicates cause incorrect or missing associations.
- **CSS**: `getElementById` and CSS attribute selectors behave unpredictably with duplicate IDs.
- **Forms**: `<label for="...">` and `aria-labelledby` both break silently when IDs aren't unique.

---

## Framework support

| Framework | Min version |
|-----------|------------|
| React     | 16.8+      |
| Vue       | 2.0+       |
| Svelte    | 3.0+       |
| Angular   | 20.0+      |

All framework integrations are optional peer dependencies — install only what you need.

---

## License

MIT © Jared Clayborn
