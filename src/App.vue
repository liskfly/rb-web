<script setup lang="ts">
import {  RouterView } from 'vue-router'
import { ElDialog } from 'element-plus';
ElDialog.props.lockScroll.default = false;
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
