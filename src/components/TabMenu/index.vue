<template>
  <div class="w-[4.8rem]  bg-[#006487]" v-click-outside="clickOut">
    <!-- <div class="h-[50px]"></div> -->
    <el-scrollbar class="h-[calc(100%-120px)]">
      <!-- {{  routes}} -->

      <div class="w-[4.8rem]" v-for="item in tabRouters">
        <div class="text-center text-xs cursor-pointer pt-3 pb-3 hover:bg-[#005A79]"
          :class="{ isActive: isActive(item.path) }" @click="tabClick(isOnlyChildren(item))">
          <el-icon :size="24" color="#ffffff">
            <component :is="isOnlyChildren(item).meta?.icon" />
          </el-icon>
          <p class="text-[#ffffff] mt-5px px-2px">
            {{ isOnlyChildren(item).meta?.title || "" }}
          </p>
        </div>
        <!-- <div
          class="text-center text-xs cursor-pointer pt-3 pb-3 hover:bg-[#005A79]"
          :class="{ isActive: isActive(item.path) }"
          @click="tabClick(item)"
        >
          <el-icon :size="24" color="#ffffff">
            <component :is="item.meta?.icon" />
          </el-icon>
          <p class="text-[#ffffff] mt-5px px-2px">
            {{ item.meta?.title || "" }}
          </p> 
        </div> -->
      </div>
    </el-scrollbar>
    <div class="h-[120px] flex flex-col-reverse items-center">
      <el-dropdown trigger="click" placement="top">
        <div class="flex flex-col items-center">
          <div class="block">
            <el-avatar :size="35" icon="Avatar" />
          </div>
          <p class="w-[80px] p-1 font-bold text-base text-white text-center break-words text-pretty">
            {{ loginName }}
          </p>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click.native="fullScreen"><el-icon v-if="!isFull">
                <FullScreen />
              </el-icon>
              <el-icon v-if="isFull">
                <Minus />
              </el-icon>
              {{isFull?"正常":"全屏"}}</el-dropdown-item>
            <el-dropdown-item @click.native="getSolw"><el-icon >
                <Warning />
              </el-icon>系统版本</el-dropdown-item>
            
            <el-dropdown-item @click.native="openUpdatePwd"><el-icon>
                <Key />
              </el-icon>修改密码</el-dropdown-item>
              <!-- <el-dropdown-item @click.native="switchSystem"><el-icon>
                <Connection />
              </el-icon>切换系统</el-dropdown-item> -->
            <el-dropdown-item @click.native="logoutsys"><el-icon>
                <Promotion />
              </el-icon>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <Menu class="absolute top-0 z-[99] h-[100%] left-[4.8rem] bg-[#003750]"
      :class="{ 'w-[200px]': showMenu, 'w-0': !showMenu }" style="transition: width 0.2s, left 0.2s" :base-path="'/'"
      @refresh="clickOut"></Menu>

    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="修改密码" v-model="upPwVisible" width="400px"
      @close="upDateCancel()">
      <el-form :model="upPwForm" ref="upPwFormRef" :rules="rules" label-width="auto">
        <el-form-item label="新密码" prop="pwd">
          <el-input v-model="upPwForm.pwd" placeholder="请输入新密码" show-password clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input v-model="upPwForm.confirmPwd" placeholder="再次输入新密码" show-password clearable></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="upDateCancel()">取消</el-button>
          <el-button type="primary" @click="upDateSubmit()">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="solow" title="版本信息" width="700px" align-center @close="solwCanel()">
      <el-form ref="formRef" :model="versionForm" label-width="auto">
        <el-form-item label="版本" prop="name"><span class="ml-2">{{ versionForm.CurrentVer }}</span></el-form-item>
        <el-form-item label="更新日志" prop="zone">
          <!-- <pre class="text-base">{{ versionForm.UpdateLog }}</pre> -->
          <div class="w-[600px] h-[60vh] overflow-y-auto whitespace-pre-wrap">{{ versionForm.UpdateLog }}</div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, unref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import Menu from "@/components/menu/index.vue";
import { pathResolve } from "@/utils/routerHelper";
import { getToken } from "@/utils/auth";
import { updatePassword, GetVersion } from "@/api/permiss"
import { ElNotification, ElMessage, ElMessageBox } from "element-plus";
import {
  filterMenusPath,
  initTabMap,
  tabPathMap,
} from "@/components/TabMenu/helper";
import { usePermissionStoreWithOut } from "@/stores/modules/permission";
import { useUserStoreWithOut } from '@/stores/modules/user'
import { cloneDeep } from "lodash-es";
import { useAppStore } from "@/stores/modules/app";
import axios from "axios";
const { currentRoute, push } = useRouter();
const permissionStore = usePermissionStoreWithOut();
const userStore = useUserStoreWithOut()
const appStore = useAppStore();

const loginName = userStore.getUserInfo
const showMenu = ref(false); //展示子菜单
const upPwVisible = ref(false)
const upPwForm = reactive({
  employeeName: '',
  pwd: '',
  confirmPwd: ''
})

const upPwFormRef = ref()
const tabActive = ref("");
const solow = ref(false)
const versionForm = ref({
  CurrentVer: '',
  UpdateLog: ''
})

const equalToPassword = (rule: any, value: any, callback: any) => {
  if (upPwForm.pwd !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
}
const rules = reactive<any>({
  pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
  ],
  confirmPwd: [
    { required: true, trigger: "blur", message: "请再次输入您的密码" },
    { required: true, validator: equalToPassword, trigger: "blur" }
  ],

})


const routers = computed(() => permissionStore.getRouters);
console.log(routers);

const tabRouters = computed(() =>
  unref(routers).filter((v: any) => !v?.meta?.hidden)
);

watch(
  () => routers.value,
  (routers: AppRouteRecordRaw[]) => {
    initTabMap(routers);
    filterMenusPath(routers, routers);
  },
  {
    immediate: true,
    deep: true,
  }
);

onMounted(() => {
  // axios.get("http://localhost:5173/getvs.json").then((data) => {
  //   let res = data.data;
  //   versionForm.value ={...res.content}
  // });

});
//Tab高亮
const isActive = (currentPath: string) => {
  const { path } = unref(currentRoute);
  if (unref(tabPathMap[currentPath]).includes(path)) {
    return true;
  }
  return false;
};

const openUpdatePwd = () => {
  upPwVisible.value = true
}

const upDateCancel = () => {
  upPwVisible.value = false
  upPwFormRef.value.resetFields();
}
const upDateSubmit = () => {
  upPwFormRef.value.validate((valid: any) => {
    if (valid) {
      let data = {
        employeeName: userStore.getUserInfo,
        pwd: upPwForm.pwd
      }
      updatePassword(data).then((res: any) => {
        if (res.code == 100200) {
          ElNotification({
            title: "修改成功",
            type: "success",
          });
          ElMessageBox.confirm("密码修改成功即将退出登录", "提示", {
            confirmButtonText: "确定",
            type: "warning",
          })
            .then(() => {
              logoutsys()
            })
            .catch(() => {
              logoutsys()
            });
        } else {
          ElNotification({
            title: "修改失败",
            message: res.msg,
            type: "error",
          });
        }
        upPwVisible.value = false
      })

    } else {
      console.log("error submit!!");
      return false;
    }
  })
}
const getSolw = () => {

  GetVersion().then((res: any) => {
    solow.value = true
    versionForm.value ={...res.content}
  })
}
const solwCanel = () => {
  solow.value = false
}

const logoutsys = () => {
  userStore.logout()
}

const switchSystem=()=>{
  localStorage.setItem("SYSTEM_TYPE", JSON.stringify(!appStore.getSystemType));
  appStore.setSystemType(!appStore.getSystemType);
  if (appStore.getSystemType && localStorage.getItem("OPUIData")) {
    let routestr = appStore.getOpuiData.path || "/";
    push(routestr);
  } else {
    push({ path: "/login", query: { redirect: "/dashboard/index" } });
  }

  location.reload()
 
}
const tabClick = (item: any) => {
  const newPath = item.children ? item.path : item.path.split("/")[0];
  const oldPath = unref(tabActive);
  tabActive.value = item.children ? item.path : item.path.split("/")[0];
  if (item.children) {
    if (newPath === oldPath || !unref(showMenu)) {
      showMenu.value = !unref(showMenu);
    }
    if (unref(showMenu)) {
      permissionStore.setMenuTabRouters(
        cloneDeep(item.children).map((v: any) => {
          v.path = pathResolve(unref(tabActive), v.path);
          return v;
        })
      );
    }
  } else {
    push(item.path);
    permissionStore.setMenuTabRouters([]);
    showMenu.value = false;
  }

  // console.log(item);
};
const clickOut = () => {
  showMenu.value = false;
};
const isOnlyChildren = (item: any) => {
  // console.log(item)
  // if (item.children.length && item.children.length > 1)


  if (item.path !== '/dashboard') {
    // console.log(item.children)
    return item;

  } else {
    return {
      ...(item.children && item.children[0]),
      path: pathResolve(
        item.path,
        (item.children && item.children[0])?.path as string
      ),
    };
  }
};
// 全屏方法
const isFull=ref(false)
const fullScreen = () => {
    // 是否全屏，否为null
    let full = document.fullscreenElement
    // console.log(full)
    if (!full) {
        // document自带的全屏方法
        document.documentElement.requestFullscreen()
        isFull.value=true
    } else {
        // document自带的推出全屏方法
        document.exitFullscreen()
        isFull.value=false
    }
}
</script>
<script lang="ts">
import { ClickOutside } from "element-plus";
import { defineComponent } from "vue";
export default defineComponent({
  name: "TabMenu",
  directives: {
    ClickOutside,
  },
});
</script>
<style lang="scss" scoped>
.tell {
  height: calc(100% - 86px);
}

.isActive {
  // color: #006487;
  background: #005a79;
}


</style>
