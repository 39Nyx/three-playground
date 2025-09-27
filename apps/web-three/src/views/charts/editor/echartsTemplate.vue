<script setup>
import * as echarts from 'echarts';
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';

var option;

// __PREVIEW__CHART_OPTIONS__

const containerRef = useTemplateRef('containerRef');
let chart;

function chartResize() {
  if (chart) {
    chart.resize();
  }
}
onMounted(() => {
  chart = echarts.init(containerRef.value);
  chart.setOption(option);

  window.addEventListener('resize', chartResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', chartResize);
  if (chart) {
    chart.dispose();
  }
});
</script>

<template>
  <div class="container" ref="containerRef"></div>
</template>

<style scoped>
.container {
  width: 100%;
  height: calc(100vh - 16px);
}
</style>
