<script setup lang="ts">
import { onMounted } from 'vue';
import { Error } from '@/components/Error'
import { usePermissionStoreWithOut } from '@/stores/modules/permission'
import { useRouter } from 'vue-router'

const { push } = useRouter()

const permissionStore = usePermissionStoreWithOut()

onMounted(()=>{
  errorClick()
})
const errorClick = () => {
  push('/')
  // console.log(permissionStore.addRouters)
  // push(permissionStore.addRouters[0]?.path as string)
}
</script>

<template>
  <Error @error-click="errorClick" />
</template>
