<script setup lang="ts">
import { ref, type Ref } from 'vue';

import { editor } from 'monaco-editor';
import { NButton, NDrawer, NDrawerContent, NSpace, NTooltip } from 'naive-ui';

import MonacoVue from '#/components/monaco-vue.vue';
import CodeIcon from '#/views/charts/preview/components/codeIcon/CodeIcon.vue';

const props = withDefaults(
  defineProps<{
    code: string;
  }>(),
  {
    code: '',
  },
);

const showCode = ref('');

const emit = defineEmits<{
  (e: 'runCode', code: string): void;
}>();

type IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

const active: Ref<boolean> = ref(false);

function openDrawer() {
  active.value = true;
}

let myEditor: IStandaloneCodeEditor | null = null;

function drawerEnter() {
  showCode.value = props.code;
}

function closeDrawer() {
  active.value = false;
}

function runCode() {
  emit('runCode', myEditor?.getValue() || '');
  closeDrawer();
}
</script>

<template>
  <NTooltip trigger="hover">
    <template #trigger>
      <NButton circle @click="openDrawer">
        <template #icon>
          <CodeIcon />
        </template>
      </NButton>
    </template>
    查看代码
  </NTooltip>
  <NDrawer
    v-model:show="active"
    :on-after-enter="drawerEnter"
    placement="right"
    width="60%"
  >
    <NDrawerContent>
      <monaco-vue v-model:value="showCode" language="javascript" />
      <template #footer>
        <div class="flex justify-end">
          <NSpace gap="8">
            <NButton @click="closeDrawer">关闭</NButton>
            <NButton type="primary" @click="runCode">运行</NButton>
          </NSpace>
        </div>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
