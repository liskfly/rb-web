<template>
    <div class="w-full h-[100vh]" style="position: relative;">
        <div id="index" ref="appRef">
        <!-- 1111 -->
        <div class="bg-[#004097]">
            1111
        </div>
    </div>
    </div>
   
</template>

<script setup lang="ts">
import {
    defineComponent,
    ref,
    reactive,
    onMounted,
    onUnmounted,
} from 'vue'
import useDraw from '@/utils/userDraw'
const { appRef, calcRate, windowDraw, unWindowDraw } = useDraw()
onMounted(() => {
    // todo 屏幕适应
    windowDraw()
    calcRate()
})

</script>

<style lang="scss" scoped>
@import '@/assets/css/index1.scss';
</style>