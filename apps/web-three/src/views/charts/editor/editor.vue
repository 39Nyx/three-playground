<script setup lang="ts">
import { Repl, useStore, type SFCOptions, useVueImportMap } from '@vue/repl';
import Monaco from '@vue/repl/monaco-editor';
import { ref, watchEffect, onMounted, computed } from 'vue';
import { getChartOptions } from '#/api/charts/page';
import echartsTemplate from './echartsTemplate.vue?raw';

const replRef = ref<InstanceType<typeof Repl>>();
const defaultHash =
  '#eNp9kL1uwzAMhF9F4Bw4QzsFRoC2yNAObdF21GLIrKNElgSRcgwEfvdIMvIzBNnIu4/SkUd48b4aIsIKalJBexaEHP1a2no5C6lMDWPvTcOYOiHqVg/rLRrjxMEF09bLLOSRGwwWwKSc/dddtSNn0xfHPCxBud5rg+HLs3aWJKxEcbLXpEcPH0XjEHFx1tUW1f6OvqMxaxK+AxKGASVcPG5Chzzbm99PHFN9MXvXRpPoB+YPkjMxZ5yx12jbFPuGK2nfe+8Ca9v90WZktHReKgfN5FR4CenObw9Wv8Z9qp7LnLQTTCfL/orT';

const props = withDefaults(
  defineProps<{
    cid: string;
  }>(),
  {
    cid: '',
  },
);
const setVH = () => {
  document.documentElement.style.setProperty('--vh', window.innerHeight + `px`);
};
window.addEventListener('resize', setVH);
setVH();

const useSSRMode = ref(false);

const AUTO_SAVE_STORAGE_KEY = 'vue-sfc-playground-auto-save';
const initAutoSave: boolean = JSON.parse(
  localStorage.getItem(AUTO_SAVE_STORAGE_KEY) ?? 'true',
);
const autoSave = ref(initAutoSave);

const { productionMode, vueVersion, importMap } = useVueImportMap({
  runtimeDev: import.meta.env.PROD
    ? `${location.origin}/vue.runtime.esm-browser.js`
    : `${location.origin}/src/vue-dev-proxy`,
  runtimeProd: import.meta.env.PROD
    ? `${location.origin}/vue.runtime.esm-browser.prod.js`
    : `${location.origin}/src/vue-dev-proxy-prod`,
  serverRenderer: import.meta.env.PROD
    ? `${location.origin}/server-renderer.esm-browser.js`
    : `${location.origin}/src/vue-server-renderer-dev-proxy`,
});

// 添加echarts依赖
if (importMap.value.imports) {
  importMap.value.imports['echarts'] =
    'https://cdn.jsdelivr.net/npm/echarts@6.0.0/dist/echarts.esm.min.js';
}

let hash = location.hash.slice(1);
if (hash.startsWith('__DEV__')) {
  hash = hash.slice(7);
  productionMode.value = false;
}
if (hash.startsWith('__PROD__')) {
  hash = hash.slice(8);
  productionMode.value = true;
}
if (hash.startsWith('__SSR__')) {
  hash = hash.slice(7);
  useSSRMode.value = true;
}

// enable experimental features
const sfcOptions = computed(
  (): SFCOptions => ({
    script: {
      inlineTemplate: productionMode.value,
      isProd: productionMode.value,
      propsDestructure: true,
    },
    style: {
      isProd: productionMode.value,
    },
    template: {
      isProd: productionMode.value,
      compilerOptions: {
        isCustomElement: (tag: string) =>
          tag === 'mjx-container' || tag.startsWith('custom-'),
      },
    },
  }),
);

const store = useStore(
  {
    builtinImportMap: importMap,
    vueVersion,
    sfcOptions,
  },
  hash || defaultHash,
);
// @ts-expect-error
globalThis.store = store;

// persist state
watchEffect(() => {
  const newHash = store
    .serialize()
    .replace(/^#/, useSSRMode.value ? `#__SSR__` : `#`)
    .replace(/^#/, productionMode.value ? `#__PROD__` : `#`);
  // history.replaceState({}, '', newHash);
});

const theme = ref<'dark' | 'light'>('dark');

function toggleTheme(isDark: boolean) {
  theme.value = isDark ? 'dark' : 'light';
}

onMounted(() => {
  const cls = document.documentElement.classList;
  toggleTheme(cls.contains('dark'));

  // @ts-expect-error process shim for old versions of @vue/compiler-sfc dependency
  window.process = { env: {} };

  getChartOptions(props.cid).then((res) => {
    store.setFiles({
      'App.vue': echartsTemplate.replace(
        '// __PREVIEW__CHART_OPTIONS__',
        res.data,
      ),
    });
  });
});
</script>

<template>
  <div class="my-app-container h-full bg-white">
    <Repl
      ref="replRef"
      :theme="theme"
      :editor="Monaco"
      @keydown.ctrl.s.prevent
      @keydown.meta.s.prevent
      :ssr="useSSRMode"
      :model-value="autoSave"
      :editorOptions="{ autoSaveText: false }"
      :store="store"
      :showCompileOutput="true"
      :autoResize="true"
      :clearConsole="false"
      :show-import-map="false"
      :show-ts-config="false"
      :preview-options="{
        customCode: {
          importCode: `import { initCustomFormatter } from 'vue'`,
          useCode: `if (window.devtoolsFormatters) {
    const index = window.devtoolsFormatters.findIndex((v) => v.__vue_custom_formatter)
    window.devtoolsFormatters.splice(index, 1)
    initCustomFormatter()
  } else {
    initCustomFormatter()
  }`,
        },
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.my-app-container {
  padding: 12px;
}
</style>
