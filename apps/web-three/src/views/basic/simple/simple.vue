<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';

import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const container = useTemplateRef('container');

onMounted(() => {
  if (container.value) {
    // 创建场景
    const scene = new Scene();

    // 创建相机
    const camera = new PerspectiveCamera(
      45,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);

    // 创建渲染器
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(container.value.clientWidth, container.value.clientHeight);

    // 创建控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    // 开启阻尼
    controls.enableDamping = true;

    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });

    // 创建一个立方体
    const geometry = new BoxGeometry(3, 3, 3);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new Mesh(geometry, material);
    scene.add(cube);

    // 将渲染器的输出添加到容器中
    container.value.append(renderer.domElement);
  }
});
</script>

<template>
  <div ref="container" class="app-container"></div>
</template>

<style scoped>
.app-container {
  width: 100%;
  height: 100%;
}
</style>
