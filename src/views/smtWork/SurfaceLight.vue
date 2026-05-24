<template>
  <div class="flex flex-col w-full h-full">
    <!-- <div class="h-[40px] pl-2 pr-2 flex justify-between items-center">
      <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
      <div></div>
    </div> -->
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[300px]">
        <div class="w-full h-full border-r border-solid border-[#cbcbcb]">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">产线与机台</span>
          </div>
          <div class="p-2">
            <el-form ref="formRef" :model="form" label-width="auto">
              <div class="h-20 flex items-center">
                <div class="flex items-center">
                  <img class="w-16 h-16" src="@/assets/svgs/MES-smt.svg" alt="" />
                  <div class="h-16 flex flex-col justify-between ml-4">
                    <div class="text-2xl cursor-default">
                      {{ opui.lineDec }}
                    </div>
                    <div class="flex h-4 items-center">
                      <el-checkbox v-model="selectBox" @change="AutoSplicing">
                        自动亮灯</el-checkbox>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-4 p-1 border border-solid border-[#c6c271]" v-for="item in deviceList"
                  @click="getMaterialList(item.NickName)">
                  <img alt="" style="width: 40px; height: 40px" src="@/assets/svgs/Mounter-blue.svg" class="ml-10" />
                  <span class="underline cursor-pointer">{{
                    item.Description1 + `（${item.NickName}）`
                  }}</span>
                </div>
                <!-- <div
                  class="flex items-center gap-4 p-1 border border-solid border-[#c6c271]"
                >
                  <img
                    alt=""
                    style="width: 40px; height: 40px"
                    src="@/assets/svgs/Mounter-blue.svg"
                    class="ml-10"
                  />
                  <span class="underline cursor-pointer"
                    >自动贴片机02（104）</span
                  >
                </div>
                <div
                  class="flex items-center gap-4 p-1 border border-solid border-[#c6c271]"
                >
                  <img
                    alt=""
                    style="width: 40px; height: 40px"
                    src="@/assets/svgs/Mounter-blue.svg"
                    class="ml-10"
                  />
                  <span class="underline cursor-pointer"
                    >自动贴片机03（105）</span
                  >
                </div> -->
              </div>
            </el-form>
            <!-- <div class="flex pt-2">
                            <el-button type="primary"> 备料历史查询</el-button>
                            <el-button type="primary"> 接料亮灯(人工/自动)</el-button>
                        </div> -->
          </div>
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">消息提示</span>
          </div>
          <div class="p-2">
            <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
              {{ msgTitle === "" ? "" : msgTitle }}
            </div>
            <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
              {{ msgTitle }}
            </div>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-300px)]">
        <!-- <div class="w-full"> -->
        <div class="w-full h-full flex flex-col">
          <div>
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5"> 生产计划号信息</span>
            </div>
            <div class="h-[130px] pt-3 pr-5 pl-5">
              <el-form ref="operateFormRef" :model="operateForm" :inline="true" label-width="auto">
                <el-form-item label="生产计划号" class="mb-2">
                  <el-input v-model="operateForm.MfgOrderName" style="width: calc((100vw - 850px) / 4)" disabled />
                </el-form-item>
                <el-form-item label="面别" class="mb-2">
                  <el-input v-model="operateForm.Side" style="width: calc((100vw - 850px) / 4)" disabled />
                </el-form-item>
                <el-form-item label="产品机型" class="mb-2">
                  <el-input v-model="operateForm.BD_ProductModel" style="width: calc((100vw - 850px) / 4)" disabled />
                </el-form-item>
                <el-form-item label="计划数量" class="mb-2">
                  <el-input v-model="operateForm.Qty" style="width: calc((100vw - 850px) / 4)" disabled />
                </el-form-item>
                <el-form-item label="产品编码" class="mb-2">
                  <el-input v-model="operateForm.ProductName" style="width: calc((100vw - 850px) / 4)" disabled />
                </el-form-item>
                <el-form-item label="产品描述" class="mb-2">
                  <el-input v-model="operateForm.ProductDesc" style="width: calc((100vw - 620px) / 2)" disabled />
                </el-form-item>
                <el-form-item label="货架号" class="mb-2">
                  <el-input v-model="operateForm.shelf_ids" style="width: calc((100vw - 850px) / 4)" disabled />
                </el-form-item>
              </el-form>
              <div class="flex items-center">
                <el-button type="primary" @click="getOrderQuery">刷新</el-button>
                <el-button type="warning" @click="lightUp" :disabled="selectList.length === 0">亮灯</el-button>
                <el-button type="info" @click="lightOut" :disabled="selectList.length === 0">取消亮灯</el-button>
                <el-button @click="materialView"
                  :disabled="operateForm.shelf_ids === '' || operateForm.shelf_ids === null || operateForm.shelf_ids === undefined">货架物料查看</el-button>
                <div class="text-[#606266] ml-[2rem] mr-2">扫描接料条码</div>
                <el-input class="code-input" sise="small" v-model.trim="code" style="width: 450px"
                  @keydown.enter="keydown" />
                <!-- <el-button type="warning">首套亮灯</el-button> -->
              </div>
            </div>
          </div>

          <div class="flex flex-col flex-1 tabs-css">
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5">机台物料清单</span>
            </div>
            <table-tem ref="lightTable" :showSelect="true" :showIndex="true" :tableData="tableData"
              :tableHeight="tableHeight" :columnData="columnData" :pageObj="pageObj"
              @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
              @handleSelectionChange="handleSelectionChange"></table-tem>
          </div>
        </div>
      </div>
    </div>

    <el-dialog align-center :append-to-body="true" draggable :close-on-click-modal="false" v-model="viewVisible" @close=""
      :title="'生产计划号：'+operateForm.MfgOrderName" width="80%">
      <el-tabs v-model="activeName" type="border-card" class="demo-tabs" >
        <el-tab-pane label="货架物料明细" name="shelveMaterial" >
      <table-tem ref="lightTable" size="small" :showIndex="true" :tableData="viewTableData" :tableHeight="420"
        :columnData="viewColumnData" :pageObj="viewPageObj" @handleSizeChange="viewSizeChange"
        @handleCurrentChange="viewCurrentChange"></table-tem>
      </el-tab-pane>
    </el-tabs>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click=""> 取消 </el-button>
          <el-button type="primary" @click=""> 确定 </el-button>
        </span>
      </template> -->
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import tableTem from "@/components/tableTem/index.vue";
import { Bottom } from "@element-plus/icons-vue";
import {
  QueryDeviceInfo,
  QueryMachineMaterialList,
  MaterialOrderQuery,
  SendOneLine,
  CancelOneLine,
  UpdateMfgLineAutoSplicing,
  AutoOnlineRack,
  QueryRackLightMaterials,
} from "@/api/smtApi";
const appStore = useAppStore();
const userStore = useUserStoreWithOut();
const loginName = userStore.getUserInfo;
const opui = appStore.getOPUIReal();
const form = ref({
  line: "",
});
const lineList = ref<any[]>([]);
const mcID = ref(0);
const operateForm = ref({
  MfgOrderName: "",
  MfgLineDesc: "",
  Qty: "",
  ProductName: "",
  ProductDesc: "",
  OrderStatusDesc: "",
  shelf_ids: "",
  Side: "",
  BD_ProductModel:''
});
const selectBox = ref(false);
const viewVisible = ref(false);
const viewTableData = ref([]);
const tableData = ref([]);
const tableHeight = ref(0);
const viewTableHeight = ref(0);
const selectList = ref<any[]>([]);
const lightTable = ref();
const code = ref("");
const msgTitle = ref("");
const msgType = ref(true);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});
const viewPageObj = ref({
  pageSize: 300,
  currentPage: 1,
});

const deviceList = ref<any[]>([]);

const columnData = reactive([
  {
    text: true,
    prop: "Station",
    label: "台车",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Slot",
    label: "站位",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "SubSlot",
    label: "子站位",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CompID",
    label: "物料批次号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "used",
    label: "总量",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CompName",
    label: "物料编码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Description",
    label: "物料描述",
    width: "",
    min: true,
    align: "left",
  },
]);

const viewColumnData = reactive([
  {
    text: true,
    prop: "ReelId",
    label: "物料批次条码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Amount",
    label: "数量",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Unit",
    label: "单位",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "part_number",
    label: "物料编码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "MaterialDesc",
    label: "物料描述",
    width: "350",
    // min: true,
    align: "1",
  },
  {
    text: true,
    prop: "shelf_id",
    label: "货架号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "BinCode",
    label: "储位编号",
    width: "",
    min: true,
    align: "center",
  },
]);
const activeName=ref('shelveMaterial')

const getDevice = () => {
  QueryDeviceInfo(opui.line).then((res: any) => {
    if (res && res.success) {
      deviceList.value = res.content;
      selectBox.value = res.content[0].BD_IsAutoSplicing;
    }
    msgTitle.value = res.msg;
    msgType.value = res.success;
  });
};

const getMaterialList = (item: any) => {
  mcID.value = item;
  QueryMachineMaterialList(item).then((res: any) => {
    if (res && res.success) {
      tableData.value = res.content;
      selectList.value = [];
    }
    msgTitle.value = res.msg;
    msgType.value = res.success;
  });
};

const getOrderQuery = () => {
  MaterialOrderQuery({ lineName: opui.line }).then((res: any) => {
    if (res && res.success && res.content.length > 0) {
      operateForm.value = res.content[0];
    }
    msgTitle.value = res.msg;
    msgType.value = res.success;
  });
};

const AutoSplicing = () => {
  ElMessageBox.confirm(
    `${selectBox.value ? "开启自动亮灯?" : "关闭自动亮灯?"}`,
    "确认操作",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      UpdateMfgLineAutoSplicing({
        MfgLineName: opui.line,
        BD_IsAutoSplicing: selectBox.value,
      }).then((res: any) => {
        // ElNotification({
        //   title: "提示",
        //   message: res.msg,
        //   type: "success",
        // });
        msgTitle.value = res.msg;
        msgType.value = res.success;
      });
    })
    .catch(() => {
      ElNotification({
        type: "info",
        message: "取消操作",
      });
      selectBox.value = !selectBox.value;
    });
};

const handleSelectionChange = (e: any) => {
  selectList.value = e.map((item: any) => {
    return {
      Station: item.Station,
      Slot: item.Slot,
      SubSlot: item.SubSlot,
      MaterialName: item.CompName,
      CompID: item.CompID,
    };
  });
};

const materialView = () => {
  QueryRackLightMaterials({
    OrderNumber: operateForm.value.MfgOrderName,
    shelf_ids: operateForm.value.shelf_ids,
  }).then((res: any) => {
    if (res && res.success) {
      viewVisible.value = true;
      viewTableData.value = res.content;
    }
    msgTitle.value = res.msg;
    msgType.value = res.success;
  });
};

const lightUp = (e: any) => {
  SendOneLine({
    McId: mcID.value,
    OrderNumber: operateForm.value.MfgOrderName,
    Side: operateForm.value.Side,
    shelf_ids: operateForm.value.shelf_ids,
    IssueList: selectList.value,
    OperatorName: loginName,
  }).then((res: any) => {
    msgTitle.value = res.msg;
    msgType.value = res.success;
  });
};

const lightOut = (e: any) => {
  CancelOneLine({
    McId: mcID.value,
    OrderNumber: operateForm.value.MfgOrderName,
    Side: operateForm.value.Side,
    shelf_ids: operateForm.value.shelf_ids,
    IssueList: selectList.value,
    OperatorName: loginName,
  }).then((res: any) => {
    msgTitle.value = res.msg;
    msgType.value = res.success;
  });
};

const keydown = () => {
  const rowToSelect = tableData.value.find(
    (row: any, index) => row.CompID === code.value
  );
  if (rowToSelect) {
    const exist = selectList.value.find(
      (item: any) => item.CompID === code.value
    );
    if (exist) {
      ElNotification({
        title: "提示",
        message: "此条码已选中",
        type: "warning",
      });
    } else {
      lightTable.value.toggleSelection([rowToSelect]);
    }
  } else {
    ElNotification({
      title: "提示",
      message: "未搜索到此批次号",
      type: "warning",
    });
  }
  code.value = "";
};

const codeSelect = () => {
  const rowToSelect = tableData.value.find((row, index) => index === 0);
  lightTable.value.toggleSelection([rowToSelect]);
};

onBeforeMount(() => {
  getScreenHeight();
});

onMounted(() => {
  getDevice();
  getOrderQuery();
  window.addEventListener("resize", getScreenHeight);
  // console.log(appStore.getOpuiData.stationDec);
});

onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

//分页
const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const viewSizeChange = (val: any) => {
  viewPageObj.value.currentPage = 1;
  viewPageObj.value.pageSize = val;
};
const viewCurrentChange = (val: any) => {
  viewPageObj.value.currentPage = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 330;
  });
};
</script>

<style lang="scss">
.setwidth {
  flex: 0 0 300px;
}

.code-input .el-input__wrapper {
  background-color: rgb(252.5, 245.7, 235.5);
}

.el-tabs--border-card {
  border-top: 1px solid #006487;
}

.demo-tabs .el-tabs__header {
  --el-tabs-header-height: 30px;
  background-color: #006487 !important;
}

.demo-tabs .el-tabs__content {
  padding: 5px;
}



.demo-tabs.el-tabs--border-card>.el-tabs__header .el-tabs__item {
  color: #fff;
  font-size: 0.8rem;
  // padding: 0 !important;
}

.demo-tabs .el-tabs__item.is-active {
  font-size: 0.8rem;
  // color: #fff;
  color: #006487 !important;
  // font-weight: bold;
}

.el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
  font-size: 0.8rem;
  color: #006487 !important;
  background-color: rgba($color: #fff, $alpha: 0.8);
}
</style>
