<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue';

import { createMonaco } from '#/utils/monaco';

const containerRef = useTemplateRef('container');

const editor = shallowRef<any>();

const props = defineProps({
  language: {
    type: String,
    default: 'vue',
  },
});

const modelValue = defineModel('value');

watch(modelValue, (value) => {
  if (editor.value) {
    editor.value.setValue(value);
  }
});

let editorInstance: any;

onMounted(async () => {
  if (!containerRef.value) {
    return;
  }

  editorInstance = await createMonaco(containerRef.value, {
    value: modelValue.value,
    language: props.language,
    automaticLayout: true,
  });

  editor.value = editorInstance;
});

onBeforeUnmount(() => {
  if (editorInstance) {
    editorInstance.dispose();
  }
});
</script>

<template>
  <div ref="container" class="monaco-container"></div>
</template>

<style scoped>
.monaco-container {
  width: 100%;
  height: 100%;
}

:deep(.n-drawer-body-content-wrapper) {
  padding: 0;
}
</style>
