import { DirectiveBinding } from 'vue';  
  
export default {  
  name: 'clickoutside',  
  // 当被绑定的元素挂载到 DOM 中时……  
  mounted(el: HTMLElement, binding: DirectiveBinding) {  
    el.clickOutsideEvent = function (event) {  
      // 检查点击事件是否在元素外部  
      if (!(el === event.target || el.contains(event.target))) {  
        // 如果是，则调用提供的方法  
        binding.value(event);  
      }  
    };  
    document.body.addEventListener('click', el.clickOutsideEvent);  
  },  
  // 当指令与元素解绑时  
  unmounted(el: HTMLElement) {  
    // 移除事件监听器  
    document.body.removeEventListener('click', el.clickOutsideEvent);  
  },  
};