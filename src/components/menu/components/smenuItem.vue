<template>
  <div>
    <template
      v-if="hasOneShowingChild(props.item.children, props.item as any) &&
            (!onlyOneChild.children || onlyOneChild.noShowingChildren)"
    >
      <el-menu-item
        :index="pathResolve(props.basePath, onlyOneChild.path)"
        @click="clickMenu(onlyOneChild)"
      >
        <el-icon v-if="onlyOneChild.meta.icon">
          <component :is="onlyOneChild.meta.icon"
        /></el-icon>
        <span>{{ onlyOneChild.meta.title }}</span>
      </el-menu-item>
    </template>
    <el-sub-menu v-else :index="pathResolve(props.basePath, item.path)">
      <template #title>
        <el-icon v-if="item.meta.icon">
          <component :is="item.meta.icon"
        /></el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <smenuItem
        v-for="v in item.children"
        :key="v.path"
        :item="v"
        :base-path="pathResolve(props.basePath, item.path)"
      ></smenuItem>
    </el-sub-menu>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref } from "vue";
import type { RouteRecordRaw } from "vue-router";
import { pathResolve } from "@/utils/routerHelper";
// import { hasOneShowingChild } from '../helper'
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  basePath: {
    type: String,
  },
});
const onlyOneChild = ref();

const clickMenu = (item: any) => {
  // console.log(item)
};
const hasOneShowingChild = (
  children: RouteRecordRaw[] = [],
  parent: RouteRecordRaw
) => {
  // console.log(children,parent)
  // 子路由集合
  const showingChildren = children.filter((route: RouteRecordRaw) => {
    if (route.meta?.hidden) {
      // 过滤不显示的子路由
      return false;
    } else {
      route.meta!.hidden = false;
      // 临时变量（多个子路由 onlyOneChild 变量是用不上的）
      // console.log(route)
      onlyOneChild.value = route;
      return true;
    }
  });

  // 如果只有一个子路由, 返回 true
  // if (showingChildren.length === 1) {
  //   console.log(1111)
  //   return true;
  // }
  

  // 如果没有子路由，显示父级路由
  if (!showingChildren.length) {
    onlyOneChild.value = { ...parent, noShowingChildren: true };
    return true;
  }
  return false;
};
</script>
<style lang="scss" scoped>
.el-menu-item {
  height: 40px;
  line-height: 40px ;
  // background-color: #ffcd50;
}
.el-menu-item:hover {
  outline: 0 !important;
  color: #ffcd50 !important;
  background-color: #000 !important;
}
.el-menu-item.is-active {
  color: #ffcd50 !important;
  background-color: #000000 !important;
}


::v-deep .el-sub-menu .el-sub-menu__title {
  height: 45px;
  line-height: 45px ;
}

</style>
