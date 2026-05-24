<script lang="ts" setup>
import { usePermissionStoreWithOut } from "@/stores/modules/permission";
import { ref, unref, computed, onMounted ,defineProps ,defineEmits} from 'vue'
import { useRouter } from "vue-router";
import smenuItem from "./components/smenuItem.vue";
import { pathResolve } from "@/utils/routerHelper";
// import path from "path-browserify";
const { currentRoute, push } = useRouter();
const permissionStore = usePermissionStoreWithOut()
const routers = computed(() =>
    permissionStore.getMenuTabRouters
)
const emit = defineEmits(['refresh'])

const props=defineProps({
    basePath:{
        type:String    
    }
})
onMounted(() => {
    // const a=activeMenu
    // console.log(routers)
})
const activeMenu = computed(() => {
    const { meta, path } = unref(currentRoute)
    if (meta.activeMenu) {
        return meta.activeMenu as string
    }
    return path
})
const menuSelect = (index: any) => {
    // console.log(index)
    emit('refresh')
    push(index)
}
// const resolvePath=(routePath:String)=>{
//    const fullPath=path.resolve(props.basePath, routePath);

// }
</script>
<template>
    <div>
        <el-scrollbar>
            <el-menu :defaultActive="activeMenu" backgroundColor="#003750" :uniqueOpened="true" text-color="#bfcbd9"
                active-text-color="#ffff" @select="menuSelect">
                <smenuItem v-for="v in routers" :key="v.path" :item="v" :base-path="'/'" ></smenuItem>
                <!-- <el-menu-item v-for="item  in routers" :index="pathResolve('/', item.path) ">
                <span>{{ item.meta.title }}</span>
            </el-menu-item> -->
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<style lang="scss" scoped>
.el-menu-item.is-active {
    color: #ffcd50 !important;
    // background-color: #006487 !important;
}
</style>
