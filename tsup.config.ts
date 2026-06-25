import { SvelteComponent } from "svelte";
import { defineConfig } from "tsup";
import { VueElement } from "vue";

export default defineConfig({
  entry: {
    core: "src/core.ts",
    react: "src/react.ts",
    vue: "src/vue.ts",
    svelte: "src/svelte.ts",
    angular: "src/angular.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
});
