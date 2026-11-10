<template>
  <div>
    <router-view>
      <template #default="{ Component, route }">
        <transition name="ios-fade" mode="out-in">
          <keep-alive>
            <component :is="Component"
              :key="`${route.fullPath}-${tagsViewStore.reloadMap[route.path] || 0}`" />
          </keep-alive>
        </transition>
      </template>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useTagsViewStore } from '@/stores/modules/tagsView'
const tagsViewStore = useTagsViewStore()

const getCaches = computed((): string[] => {
  return tagsViewStore.getCachedViews
})
</script>

<style lang="scss" scoped>

html,
body,
#app,
.box {
  margin: 0 auto;
  width: 50%;
  height: 100%;
  background: bisque;
}
.ios-fade-enter-active,
.ios-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.28, 0.11, 0.32, 1);
}

.ios-fade-enter-from,
.ios-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}


</style>
