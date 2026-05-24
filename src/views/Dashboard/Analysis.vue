<template>
  <div class="bgimg">
    <!-- <el-carousel height="400px" motion-blur type="card">
      <el-carousel-item v-for="item in dataimg" :key="item">
      
         <el-image :src="item" fit="cover" />
      </el-carousel-item>
    </el-carousel> -->
    <!-- <img src="../../assets/bg.jpg" alt=""> -->
    <!-- <el-image src="https://www.bicv.com/skin/default/images/pic09.png" fit="contain" /> -->
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
const dataimg=ref(['https://www.bicv.com/skin/default/images/homeabout.jpg','	https://www.bicv.com/skin/default/images/pic09_m.jpg','https://www.bicv.com/skin/default/images/mBanner02.jpg'])

</script>

<style scoped lang="scss">
.bgimg{
  height: calc(100vh - 80px);
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('../../assets/pic10.png');
}
</style>