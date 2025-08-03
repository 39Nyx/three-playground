<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { NIcon } from 'naive-ui';

const codeFiles = import.meta.glob('/src/views/**/*.vue', { as: 'raw' });
const route = useRoute();

const codeUrl = `/src/views/${route.meta.codeUrl}`;

const isShow = computed(() => {
  return route.meta.codeUrl && codeFiles[codeUrl];
});

function codePreview() {
  if (codeFiles[codeUrl]) {
    codeFiles[codeUrl]().then((res: any) => {
      window.console.log(res);
    });
  }
}
</script>

<template>
  <div v-if="isShow" class="code-preview" @click="codePreview">
    <NIcon size="28">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 1024 1024"
      >
        <path
          d="M516 673c0 4.4 3.4 8 7.5 8h185c4.1 0 7.5-3.6 7.5-8v-48c0-4.4-3.4-8-7.5-8h-185c-4.1 0-7.5 3.6-7.5 8v48zm-194.9 6.1l192-161c3.8-3.2 3.8-9.1 0-12.3l-192-160.9A7.95 7.95 0 0 0 308 351v62.7c0 2.4 1 4.6 2.9 6.1L420.7 512l-109.8 92.2a8.1 8.1 0 0 0-2.9 6.1V673c0 6.8 7.9 10.5 13.1 6.1zM880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"
          fill="currentColor"
        />
      </svg>
    </NIcon>
  </div>
</template>

<style scoped lang="scss">
.code-preview {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  cursor: pointer;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 4px rgb(0 0 0 / 15%);
}
</style>
