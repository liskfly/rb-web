<template>
  <div class="flex w-[100vw] h-[100vh] min-w-[780px]">
    <TabMenu v-if="!appStore.getSystemType"></TabMenu>
    <div class="flex-1 relative">
      <div class="absolute w-full">
        <div>
          <ToolHeader class="bg-[#006487]"></ToolHeader>
          <TagsView></TagsView>
        </div>
        <!-- <el-scrollbar class=" h-[calc(100vh-85px)] p-[10px]"> -->
        <AppView class="sol  h-[calc(100vh-80px)] overflow-auto"></AppView>
        <!-- </el-scrollbar> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TabMenu from "../components/TabMenu/index.vue";
import TagsView from "../components/tagsView/index.vue";
import ToolHeader from "./components/ToolHeader.vue";
import AppView from "./components/AppView.vue";
import {useAppStore } from '@/stores/modules/app'
const appStore=useAppStore()
</script>

<style lang="scss" scoped>
.sol{
  overflow-x:hidden;
}
/* 解决自定义滚动条 x 轴显示问题 */
// .el-scrollbar__wrap
// {
//   overflow-x: hidden;
// }
</style>
