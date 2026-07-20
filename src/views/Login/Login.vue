<script setup lang="ts">
import { onMounted, onBeforeMount } from "vue";
import {
  empolyeeLogin,
  getEmpoyeeInfo,
  findEmployeeRoles,
  GetVersion,
} from "@/api/permiss";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from "vue-router";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { useAppStore } from "@/stores/modules/app";
import { ref, watch } from "vue";
import axios from "axios";

const userStore = useUserStoreWithOut();
const { currentRoute, addRoute, push } = useRouter();
const appStore = useAppStore();
const version = ref("");
const form = ref({
  EmployeeName: "",
  DocManagerUser: "",
  EmployeeId: "",
  CanLogin: 0,
  FullName: "",
});
const redirect = ref<string>("");
const userNameRef = ref()
const passwordRef = ref()

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string;
  },
  {
    immediate: true,
  }
);
onBeforeMount(() => {
  GetVersion().then((res: any) => {
    version.value = res.content.CurrentVer;
  });
});
onMounted(() => {
  if (localStorage.getItem('LOGINNAME')) {
    let data = localStorage.getItem('LOGINNAME')
    if (data !== null) {
      form.value.EmployeeName = data
      if (form.value.EmployeeName !== "") {
        passwordRef.value.focus()
      } else {
        userNameRef.value.focus()
      }
    }
  }
});
const loginClick = () => {
  empolyeeLogin(form.value).then((data: any) => {
    const dataText = data.content;
    if (data.code == 100200) {
      localStorage.setItem('LOGINNAME', form.value.EmployeeName)
      localStorage.setItem("OPCENTER_ROLE", form.value.EmployeeName);
      setToken(dataText.Token);
      if (dataText.WorkCenterName) {
        localStorage.setItem("LOGIN_WORKCENTER", dataText.WorkCenterName);
      }
      if (dataText.MfgLineName) {
        localStorage.setItem("LOGIN_MFGLINE", dataText.MfgLineName);
      }
      if (appStore.getSystemType && localStorage.getItem("OPUIData")) {
        let routestr = appStore.getOpuiData.path || "/";
        push({ path: routestr });
      } else {
        push({ path: redirect.value || "/" });
      }
    }
  });
};
const switchSystems = () => {
  localStorage.setItem("SYSTEM_TYPE", JSON.stringify(!appStore.getSystemType));
  appStore.setSystemType(!appStore.getSystemType);
  if (appStore.getSystemType && localStorage.getItem("OPUIData")) {
    let routestr = appStore.getOpuiData.path || "/";
    push(routestr);
  } else {
    push({ path: "/login", query: { redirect: "/dashboard/index" } });
  }
};
</script>

<template>
  <div class="w-screen h-screen bg-no-repeat bg-cover bg-[url('../assets/bg.jpg')] relative flex flex-col">
    <!-- 遮罩 -->
    <div class="absolute inset-0 bg-[#00000036]" />

    <!-- 中间内容 -->
    <div class="relative z-10 flex flex-col items-center justify-center flex-1">
      <!-- 顶部：睿宝科技 LOGO -->
      <div class="flex flex-col items-center -mt-20 mb-10">
        <img src="../../assets/rb-logo-vertical.png" alt="睿宝科技" class="h-24 w-auto" />
      </div>

      <!-- 登录框 -->
      <div class="bg-white p-8 rounded-2xl shadow-2xl w-[480px]">
        <!-- 系统名称 -->
        <h2 class="text-center text-2xl font-bold mb-6">
          {{ appStore.getSystemType ? "OPUI登录" : "Portal登录" }}
        </h2>
        <el-form ref="formRef" label-position="top" :model="form" label-width="auto">
          <el-form-item label="用户名" prop="userName">
            <el-input ref="userNameRef" v-model="form.EmployeeName" size="large" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input ref="passwordRef" v-model="form.DocManagerUser" size="large" type="password"
              placeholder="请输入密码" show-password @keyup.enter.native="loginClick" />
          </el-form-item>
          <el-form-item class="mt-5">
            <el-button @click="loginClick" size="large" class="w-full" type="primary">
              <span class="font-bold">登录</span>
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="switchSystems" size="large" class="w-full">
              <span class="text-[#e6b33c] font-bold">切换系统</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 底部 -->
    <div class="relative z-10 flex flex-col items-center pb-6">
      <div class="flex items-center gap-6 mb-2">
        <div class="flex items-center gap-2">
          <img src="../../assets/logo201.png" alt="雨阳" class="h-8 w-auto" />
        </div>
        <img src="../../assets/logo-white.svg" alt="SIEMENS" class="h-5 w-auto" />
      </div>
      <div class="text-gray-300 text-xs">
        技术支持：SIEMENS | 实施服务：深圳雨阳电子
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flipper {
  transition: 0.6s;
  transform-style: preserve-3d;
  position: relative;
}
.front,
.back {
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  border: 1px solid #ccc;
}
.front {
  z-index: 2;
  background-color: white;
}
.back {
  transform: rotateY(180deg);
  background-color: #f8fafc;
}
.is-flipped .front {
  transform: rotateY(180deg);
}
.is-flipped .back {
  transform: rotateY(0deg);
  z-index: 2;
}
</style>
