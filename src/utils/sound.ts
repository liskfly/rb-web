// // src/utils/sound.ts
// import { ref, readonly } from 'vue'
// // 修改音效文件引入方式
import errorSound from '@/assets/mp3/fail.mp3'

// // 使用方式

// const audioInstance = ref<HTMLAudioElement | null>(null)
// const isInitialized = ref(false)

// export const useSound = () => {
//   // 初始化音频（需要用户交互触发）
//   const initAudio = () => {
//     if (!isInitialized.value) {
//       audioInstance.value = new Audio(errorSound)
//       audioInstance.value.volume = 0.8
//       isInitialized.value = true
//     }
//   }

//   // 播放错误音效
//   const playErrorSound = () => {
//     if (audioInstance.value) {
//       audioInstance.value.currentTime = 0
//       audioInstance.value.play().catch((err) => {
//         console.warn('音效播放失败:', err)
//       })
//     }
//   }

//   return {
//     initAudio,
//     playErrorSound,
//     isInitialized: readonly(isInitialized)
//   }
// }

// // 全局安装插件
// export const soundPlugin = {
//   install(app: any) {
//     const sound = useSound()
//     app.provide('$sound', sound)
//     app.config.globalProperties.$sound = sound
//   }
// }
// src/utils/sound.js
const audio = new Audio(errorSound)
audio.preload = 'auto'

export const playErrorSound = () => {
  audio.currentTime = 0 // 重置播放进度
  audio.play().catch(() => {
    console.log('音效播放被浏览器阻止')
  })
}