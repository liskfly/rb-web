<script lang="ts" setup>
import { computed, onMounted, unref, ref, watch, onActivated, onBeforeMount, reactive } from 'vue'
import { useTagsViewStore } from '@/stores/modules/tagsView'
import { usePermissionStoreWithOut } from '@/stores/modules/permission'
import { useRouter, type RouteLocationNormalizedLoaded } from 'vue-router'
import { filterAffixTags } from './helper'
import { cloneDeep } from 'lodash-es'
import { useAppStore } from '@/stores/modules/app'
const appStore = useAppStore()
const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStoreWithOut()
const { currentRoute, push } = useRouter()
import { useTagsView } from '@/hooks/useTagsView'
const { closeAll, closeLeft, closeRight, closeOther, closeCurrent, refreshPage } = useTagsView()
import { useUserStoreWithOut } from '@/stores/modules/user'
const userStore = useUserStoreWithOut()
const routeData = userStore.getRoleRouters
const loginName = userStore.getUserInfo
import { filterBreadcrumb } from "@/components/bread/helper";
import { filter, treeToList } from "@/utils/tree";
import { WorkCenterQuery, MfgLineQuery } from "@/api/operate";
import { updatePassword, GetVersion } from "@/api/permiss"
import { ElNotification, ElMessage, ElMessageBox } from "element-plus";


const visitedViews = computed(() => tagsViewStore.getVisitedViews)
const routers = computed(() => permissionStore.getRouters)
const setSelectTag = tagsViewStore.setSelectedTag
const affixTagArr = ref<any>([])
const solow=ref(false)
const versionForm = ref({
  CurrentVer: '',
  UpdateLog: ''
})
const upPwVisible = ref(false)
const upPwForm = reactive({
  employeeName: '',
  pwd: '',
  confirmPwd: ''
})

const upPwFormRef = ref()

const equalToPassword = (rule: any, value: any, callback: any) => {
  if (upPwForm.pwd !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
}
const rules1 = reactive<any>({
  pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
  ],
  confirmPwd: [
    { required: true, trigger: "blur", message: "请再次输入您的密码" },
    { required: true, validator: equalToPassword, trigger: "blur" }
  ],

})

//初始化
const initTags = () => {
    // console.log(permissionStore.getRouters)
    affixTagArr.value = filterAffixTags(unref(routers))
    for (const tag of unref(affixTagArr)) {
        if (tag.name) {
            tagsViewStore.addVisitedView(cloneDeep(tag))
        }
    }
}
const refreshSelectedTag = async (view?: RouteLocationNormalizedLoaded) => {
    refreshPage(view)
}
//增加
const addTags = () => {
    const { name } = unref(currentRoute)
    if (name) {
        setSelectTag(unref(currentRoute))
        tagsViewStore.addView(unref(currentRoute))
    }
}
//关闭tag
const closeSelectedTag = (view: any) => {
    tagsViewStore.delView(view)
    if (isActive(view)) {
        toLastView()
    }
}


const isActive = (route: RouteLocationNormalizedLoaded): boolean => {
    return route.path === unref(currentRoute).path
}

const toLastView = () => {
    const visitedViews = tagsViewStore.getVisitedViews
    const latestView = visitedViews.slice(-1)[0]
    // console.log(visitedViews,latestView)
    if (latestView) {
        push(latestView)
    } else {
        console.log(unref(currentRoute).path)
        if (
            unref(currentRoute).path === permissionStore.getAddRouters[0].path ||
            unref(currentRoute).path === permissionStore.getAddRouters[0].redirect
        ) {
            addTags()
            return
        }

        push(permissionStore.getAddRouters[0].path)
    }
}
watch(
    () => currentRoute.value,
    () => {
        addTags()
        // moveToCurrentTag()
    }
)
onMounted(() => {
    initTags()
    addTags()
    // 从 localStorage 恢复 OPUIData 显示值
    const saved = localStorage.getItem('OPUIData')
    if (saved) {
        try {
            const data = JSON.parse(saved)
            if (data.workShop) OPUIData.value.workShop = data.workShop
            if (data.workShopDec) OPUIData.value.workShopDec = data.workShopDec
            if (data.line) OPUIData.value.line = data.line
            if (data.lineDec) OPUIData.value.lineDec = data.lineDec
            if (data.path) OPUIData.value.path = data.path
        } catch {}
    }
    // 首次没有 OPUIData 时，从登录信息初始化车间产线
    if (!OPUIData.value.workShop) {
        const loginWork = localStorage.getItem('LOGIN_WORKCENTER')
        const loginLine = localStorage.getItem('LOGIN_MFGLINE')
        if (loginWork) OPUIData.value.workShop = loginWork
        if (loginLine) OPUIData.value.line = loginLine
    }
})
onActivated(() => {
    // console.log(111)
    initTags()
})

const textArr = reactive(['车间：', '产线：', '工位：'])
const logoutsys = () => {
    // console.log(1111)
    userStore.logout()
    // push('/login');
}

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

const switchSystem = () => {
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
const tabActive = ref("");
const addVisible = ref(false)
const form = ref({
    work: '',
    line: '',
    station: [] as string[]
})
const OPUIData = ref(
    {
        workShop: '',
        workShopDec: '',
        line: '',
        lineDec: '',
        station: '',
        stationDec: '',
        // equipment: '',
        // equipmentDesc: '',
        path: ''
    }
)
const rules = reactive({
    work: [
        { required: true, message: '请选择车间', trigger: 'change' },
    ],
    line: [
        { required: true, message: '请选择产线', trigger: 'change' },
    ],
    station: [
        { required: true, message: '请选择菜单页面', trigger: 'change' },
    ],
})

const tabRouters = computed(() => {
    let data = unref(routers).filter((v: any) => !v?.meta?.hidden)
    data = data.filter((v: any) => v.path !== '/dashboard')
    return data
}
);
const formRef = ref()
const workCenterOptions = ref<any[]>([])
const mfgLineOptions = ref<any[]>([])

// 车间、产线 API 加载（同生产过站）
const getWorkCenters = async () => {
  const res: any = await WorkCenterQuery({});
  if (res && res.success && res.code === 0) {
    workCenterOptions.value = res.content || [];
  }
};

const handleWorkChange = async (val: string) => {
  form.value.line = '';
  form.value.station = [];
  mfgLineOptions.value = [];
  OPUIData.value.workShop = val;
  const item = workCenterOptions.value.find((w: any) => w.WorkCenterName === val);
  OPUIData.value.workShopDec = item ? item.Description : '';
  if (!val) return;
  const res: any = await MfgLineQuery({ WorkCenterName: val });
  if (res && res.success && res.code === 0) {
    mfgLineOptions.value = res.content || [];
  }
};

const handleLineChange = (val: string) => {
  form.value.station = [];
  OPUIData.value.line = val;
  const item = mfgLineOptions.value.find((w: any) => w.MfgLineName === val);
  OPUIData.value.lineDec = item ? item.Description : '';
};

// 菜单级联选择器：取 OPUI 菜单树
const menuCascaderOptions = computed(() => {
  return (routeData || []).map((m: any) => ({
    value: m.path,
    label: m.title,
    children: (m.childMenu || []).map((c: any) => ({
      value: c.path,
      label: c.title,
      children: (c.childMenu || []).map((g: any) => ({
        value: g.path,
        label: g.title,
      })),
    })),
  }));
});

const openAdd = async () => {
    addVisible.value = true
    backupOPUIData.value = { ...OPUIData.value }
    await getWorkCenters()
    // 预填当前车间/产线
    if (OPUIData.value.workShop) {
        form.value.work = OPUIData.value.workShop
        await handleWorkChange(OPUIData.value.workShop)
        if (OPUIData.value.line) {
            form.value.line = OPUIData.value.line
        }
    }
}

const backupOPUIData = ref({} as any)
const isSubmitted = ref(false)

const addCancel = () => {
    addVisible.value = false
    formRef.value.resetFields();
    if (isSubmitted.value) {
        isSubmitted.value = false
        return
    }
    // 取消时恢复旧值
    OPUIData.value = { ...backupOPUIData.value }
}

const onSubmit = () => {
    formRef.value.validate((valid: any) => {
        if (valid) {
            let pathStr = ('/' + form.value.station.join('/')).replace(/\/\//g, '/')
            console.log('跳转路径:', pathStr, 'station:', form.value.station);
            OPUIData.value.path = pathStr
            localStorage.setItem('OPUIData', JSON.stringify(OPUIData.value))
            push(pathStr)
            formRef.value.resetFields();
            isSubmitted.value = true
            addVisible.value = false
        } else {
            console.log("校验失败", form.value);
            return false;
        }
    })

}
const cleanOPUIData = () => {
    OPUIData.value.workShop = ''
    OPUIData.value.workShopDec = ''
    OPUIData.value.line = ''
    OPUIData.value.lineDec = ''
    OPUIData.value.station = ''
    OPUIData.value.stationDec = ''
    OPUIData.value.path = ''

}
const menuRouters = computed(() => {
    const routers = permissionStore.getRouters;
    return filterBreadcrumb(routers);
});

// const breadcrumbs = ref<Array<RouteLocationMatched>>([]);
const levelList = ref([]);
const treeLength = ref(0)
watch(
    () => currentRoute.value,
    (route: RouteLocationNormalizedLoaded) => {
        if (route.path.startsWith("/redirect/")) {
            return;
        }
        getBreadcrumb();
    }
);
const getBreadcrumb = () => {
    const currentPath = currentRoute.value.matched.slice(-1)[0].path;
    levelList.value = filter(unref(menuRouters), (node: AppRouteRecordRaw) => {
        return node.path === currentPath;
    });
    levelList.value = levelList.value.filter((v: any) => v.path !== '/dashboard/index')
    let data = treeToList(unref(levelList))
    treeLength.value = data.length
    // console.log(treeLength.value) 
};
onBeforeMount(() => {
    getBreadcrumb();
    // console.log(treeToList(unref(levelList)));
});
// 全屏方法
const fullScreen = () => {
    // 是否全屏，否为null
    let full = document.fullscreenElement
    // console.log(full)
    if (!full) {
        // document自带的全屏方法
        document.documentElement.requestFullscreen()
    } else {
        // document自带的推出全屏方法
        document.exitFullscreen()
    }
}
</script>
<template>
    <div class="bood  h-[35px] flex w-full relative bg-[#fff]">
        <div class="overflow-hidden flex-1">
            <el-scrollbar class="h-full">
                <div class="flex h-full items-center" v-if="!appStore.getSystemType">
                    <div v-for="item in visitedViews" :key="item.fullPath" class="tag_item " :class="[item.meta.affix ? `affix` : '', {
                        'is-active': isActive(item)
                    }]">
                        <router-link :to="{ ...item }" custom v-slot="{ navigate }">
                            <div @click="navigate"
                                class="flex  whitespace-nowrap  justify-center items-center  pl-[15px]">

                                <!-- <el-tag size="large" type="primary" :effect="isActive(item) ? 'dark' : 'plain'"
                                :closable="item.fullPath === '/dashboard/analysis' ? false : true"
                                @close="closeSelectedTag(item)">
                                {{ item?.meta?.title as string }}
                            </el-tag> -->
                                {{ item?.meta?.title as string }}
                                <div class="qx" v-if="item.fullPath !== '/dashboard/analysis'">
                                    <el-icon :size="12" :color="isActive(item) ? '#fff' : '#333'"
                                        @click.prevent.stop="closeSelectedTag(item)">
                                        <Close />
                                    </el-icon>

                                </div>

                            </div>
                        </router-link>
                    </div>
                </div>
                <div v-else>
                    <div class="h-[34px] pr-[10px] pl-[10px] flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <el-tooltip content="工位设置" placement="top">
                                <el-icon size="24" @click="openAdd">
                                    <Setting />
                                </el-icon>
                            </el-tooltip>
                            <span>车间：<span class="text-[1.1rem] text-[#006487] underline">&nbsp;{{ OPUIData.workShopDec || '-' }}&nbsp;</span></span>
                            <span>产线：<span class="text-[1.1rem] text-[#006487] underline">&nbsp;{{ OPUIData.lineDec || '-' }}&nbsp;</span></span>
                        </div>
                        <div class="flex items-center gap-3">

                            <div class="flex items-center">
                                <el-tooltip content="全屏/正常" placement="top">
                                    <el-icon size="24" color="#777777" @click="fullScreen()">
                                        <FullScreen />
                                    </el-icon>
                                </el-tooltip>
                            </div>

                            <el-dropdown trigger="click" placement="bottom">
                                <div class="flex items-center">
                                    <div class="block mr-2">
                                        <el-avatar :size="30" icon="Avatar" />
                                    </div>
                                    <p class="font-bold text-base  text-center break-words text-pretty">
                                        {{ loginName }}
                                    </p>
                                </div>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click.native="getSolw"><el-icon>
                <Warning />
              </el-icon>系统版本</el-dropdown-item>
              <el-dropdown-item @click.native="openUpdatePwd"><el-icon>
                <Key />
              </el-icon>修改密码</el-dropdown-item>
                                        <!-- <el-dropdown-item @click.native="openUpdatePwd">修改密码</el-dropdown-item> -->
                                        <el-dropdown-item @click.native="switchSystem"><el-icon>
                                                <Connection />
                                            </el-icon>切换系统</el-dropdown-item>
                                        <el-dropdown-item @click.native="logoutsys"><el-icon>
                                                <Promotion />
                                            </el-icon>退出登录</el-dropdown-item>
                                      
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </div>
                </div>
            </el-scrollbar>

        </div>
        <el-dialog :append-to-body="true" :close-on-click-modal="false" v-model="addVisible" title="设置" width="400px"
            @close="addCancel">
            <div class="w-full flex justify-center">
                <el-form ref="formRef" :rules="rules" style="width:70%" :model="form" label-position="left"
                    label-width="auto">
                    <el-form-item label="车间" prop="work">
                        <el-select v-model="form.work" placeholder="选择车间" size="large" style="width:100%;"
                            @change="handleWorkChange">
                            <el-option v-for="item in workCenterOptions" :key="item.WorkCenterName" :label="item.Description"
                                :value="item.WorkCenterName" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="产线" prop="line">
                        <el-select v-model="form.line" placeholder="选择产线" size="large" style="width:100%;"
                            :disabled="!form.work" @change="handleLineChange">
                            <el-option v-for="item in mfgLineOptions" :key="item.MfgLineName" :label="item.Description"
                                :value="item.MfgLineName" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="菜单" prop="station">
                        <el-cascader v-model="form.station" :options="menuCascaderOptions" placeholder="选择页面" size="large"
                            style="width:100%;" :props="{ value: 'value', label: 'label', children: 'children', checkStrictly: false }" />
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addCancel()">取消</el-button>
                    <el-button type="primary" @click="onSubmit"> 确定 </el-button>
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
    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="修改密码" v-model="upPwVisible" width="400px"
      @close="upDateCancel()">
      <el-form :model="upPwForm" ref="upPwFormRef" :rules="rules1" label-width="auto">
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
    </div>
</template>
<style lang="scss" scoped>
.bood {
    box-sizing: border-box;
    border-bottom: 1px solid #cbd5e1;
}

.tag_item {
    position: relative;
    top: 2px;
    height: calc(100% - 6px);
    padding: 5px 15px 5px 0;
    margin-left: 4px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    border-radius: 2px;


    .qx {
        position: absolute;
        top: 28%;
        right: 1px;
        display: none;
        transform: translate(0, -50%);
    }


}

.tag_item:not(.affix) {
    &:hover {

        .qx {
            display: block;
        }
    }
}

.tag_item:not(.is-active) {
    &:hover {
        color: #006487;

    }
}

.is-active {
    color: #ffff;
    background-color: #006487;
    border: 1px solid #006487;

}
</style>