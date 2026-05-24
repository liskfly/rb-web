<template>
  <div class="flex flex-col w-full h-full">
    <!-- <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
      <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
      <div></div>
    </div> -->
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[350px]">
        <div class="w-full h-full box">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">基本信息</span>
          </div>
          <div class="p-[10px]">
            <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
              <el-form-item label="生产计划号" class="mb-[5px] flex">
                <selectTa ref="selectTable" :table="orderTable" :selectWidth="170" :columns="orderColumns"
                  :max-height="400" :tableWidth="700" :defaultSelectVal="defaultSelectVal" :keywords="{
                    label: 'MfgOrderName',
                    value: 'MfgOrderName',
                  }" @radioChange="(...args: any) => radioChange(args)">
                </selectTa>
                <el-tooltip content="刷新" placement="top">
                  <el-icon class="ml-2" color="#006487" :class="isLoding" size="24" @click="getOrderData">
                    <RefreshRight />
                  </el-icon>
                </el-tooltip>
              </el-form-item>
              <el-form-item v-for="f in formHeader" :key="f.value" :label="f.label">
                <span class="font-bold text-lg leading-[30px]" :class="f.value == 'TodayNum' ? 'text-[#00B400]' : ''">
                  {{ formText(f.value) }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-350px)]">
        <!-- <div class="w-full"> -->
        <div class="w-full h-full flex flex-col">
          <div>
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-[180px] pt-3 pr-5 pl-5 flex">
              <div>
                <div>
                  <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                    @submit.native.prevent>
                    <el-form-item label="扫描条码">
                      <el-input v-model.trim="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 500px"
                        placeholder="请扫描条码" @keyup.enter.native="getChange" />
                    </el-form-item>
                    <!-- <el-form-item :class="[stopsForm.result == 'OK' ? 'switchok' : 'switchng']" class="mb-2">
                      <el-switch v-model="stopsForm.result" size="large" style="
                      zoom: 1.2;
                      --el-switch-on-color: #ff4949;
                      --el-switch-off-color: #13ce66;
                    " :active-value="'NG'" :inactive-value="'OK'" active-text="NG" inactive-text="OK" />
                    </el-form-item> -->
                    <el-form-item class="mb-2">
                      <el-button type="primary" :disabled="form.MfgOrderName == '' || rowData.OrderNumber == ''
                        " @click="reWash">重新清洗</el-button>
                    </el-form-item>
                  </el-form>
                  <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                    {{ msgTitle === "" ? "请扫描屏材料批次条码" : msgTitle }}
                  </div>
                  <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                    {{ msgTitle }}
                  </div>
                </div>
                <!-- <div class="pt-2">
                  <el-button type="primary" :disabled="form.MfgOrderName == '' || rowData.OrderNumber == ''
                    " @click="reWash">重新清洗</el-button>
                </div> -->
              </div>
              <div>
                <el-table :data="detailsData" stripe border fit size="small" :height="160" :style="{ width: '100%' }"
                  :tooltip-effect="'dark'">
                  <el-table-column label="序号" width="50" type="index" align="center" />
                  <el-table-column prop="MaterialName" label="物料编码" width="120" />
                  <el-table-column prop="MaterialDesc" label="物料描述" width="250" :show-overflow-tooltip="true" />
                  <el-table-column prop="LoadQueueQty" label="上料总数" width="80" align="center" />
                  <el-table-column label="剩余数量" width="80" align="center">
                    <template #default="scope">

                      <span>{{
                        scope.row.Qty
                      }}</span>
                    </template>
                  </el-table-column>
                </el-table>

                <!-- <tableTemp size="small" :showIndex="true" :tableData="detailsData" :tableHeight="130"
                  :columnData="detailsColumn">
                </tableTemp> -->
              </div>
            </div>
          </div>

          <div class="flex flex-col flex-1 tabs-css">
            <div class="h-[35px] flex items-center justify-between text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5">历史过站记录</span>
              <div class="mr-5">
                <el-checkbox-group v-model="checkedHis" class="laser-table-filter">
                  <el-checkbox v-for="c in checkedHisList" :label="`${c.label}(${changeDataLength(c.value)})`"
                    :value="c.value" @change="changeHis(c.value)">
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <table-tem :showIndex="true" :tableData="changeData" :tableHeight="tableHeight" :columnData="columnData1"
              :pageObj="pageObj" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
              @row-click="rowClick"></table-tem>
          </div>
        </div>
      </div>
    </div>
    <!-- <el-dialog v-model="badVisible" title="不良登记" width="60%" :append-to-body="true" :close-on-click-modal="false"
      :close-on-press-escape="false" align-center @close="badCancel">
      <div>
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            基本信息
          </div>
          <el-form ref="badFormRef" :model="badheadForm" label-width="auto">
            <el-form-item label="PCB条码" class="mb-[5px] flex">
              <el-input v-model="badForm.containerName" style="width: 160px" disabled />
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="生产计划号" class="mb-[5px] flex">
                  <el-input v-model="badheadForm.MfgOrderName" style="width: 160px" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="mb-[5px]" label="产品编码">
                  <el-input v-model="badheadForm.ProductName" style="width: 160px" disabled /> </el-form-item></el-col>
              <el-col :span="10">
                <el-form-item class="mb-[5px]" label="产品描述">
                  <el-input v-model="badheadForm.ProductDesc" style="width: 320px" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            不良原因
          </div>
          <table-temp :showIndex="true" :show-select="true" :tableData="BadtableData" :tableHeight="300"
            :columnData="badColumn" @handleSelectionChange="badSelectionChange"></table-temp>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="badCancel">取消</el-button>
          <el-button type="primary" @click="badSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>

<script lang="ts" setup>
import tableTem from "@/components/tableTem/index.vue";
import tableTemp from "@/components/tableTemp/index.vue";
import selectTa from "@/components/selectTable/index.vue";
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { checkStringType } from "@/utils/barcodeFormat";
import type { Formspan, FormHeader, OrderData } from "@/typing";
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import {
  OrderQuery,
  CleanCodeSave,
  QueryCleanCodeRecord,
  ReloadCleanCode,
  DefectProductRecord,
  QueryDefectCode,
  
} from "@/api/asyApi";
import { QueryOrderMaterialRequired } from "@/api/smtApi";
import { QuerySpecBystation } from "@/api/dipApi";

import {
  ref,
  reactive,
  onMounted,
  nextTick,
  computed,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import { cloneDeep } from "lodash-es";
interface StopsForm {
  //   containerName: string;
  workstationName: string;
  ProductName: string;
  userAccount: string;
  txnDate: string;
  BarCode: string;
  OrderName: string;
  tools: string;
  result: string;
  MaterialName:Array<string>
}

interface ToolList {
  WorkStationName: string;
  OrderNumber: string;
  ToolName: string;
  sort: number;
  MaterialName: string;
  CompName: string;
}
const appStore = useAppStore();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const inputRef = ref();
const inputFocus = ref(true);
const barCode = ref("");
const stopsForm = ref<StopsForm>({
  workstationName: opui.station || "",
  userAccount: userStore.getUserInfo,
  txnDate: "",
  ProductName: "",
  OrderName: "",
  tools: "",
  BarCode: "",
  result: "",
  MaterialName:[]
});

const form = ref<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  Qty: "",
  ERPOrder: "",
  PlannedStartDate: "",
  PlannedCompletionDate: "",
  AllNum: "",
  TodayNum: "",
});
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
  // {
  //     label: "生产计划号",
  //     value: "MfgOrderName",
  //     disabled: true,
  //     type: "input",
  //     width: "",
  // },
  {
    label: "产品机型",
    value: "BD_ProductModel",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "工单号",
    value: "ERPOrder",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "计划数量",
    value: "Qty",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品编码",
    value: "ProductName",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品描述",
    value: "ProductDesc",
    disabled: true,
    type: "textarea",
    width: 300,
  },

]);
const columnData1 = reactive([
  {
    text: true,
    prop: "VirtualContainer",
    label: "虚拟条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "Container",
    label: "物料批次条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "CreatedBy",
    label: "扫描人",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "CreatedOn",
    label: "扫描时间",
    width: "",
    align: "1",
  },
]);
const tableData1 = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});

const msgTitle = ref("");
const msgType = ref(true);
const hisForm = ref({
  MfgOrderName: "",
  workstationName: opui.station,
});
const orderTable = ref<InstanceType<typeof OrderData>>({
  data: [],
});
const orderColumns = ref([
  { label: "生产计划号", width: "", prop: "MfgOrderName" },
  { label: "产品编码", width: "", prop: "ProductName" },
  { label: "产线", width: "", prop: "MfgLineDesc" },
  { label: "状态", width: "", prop: "OrderStatusDesc" },
  { label: "计划开始", width: "", prop: "PlannedStartDate" },
  { label: "计划完成", width: "", prop: "PlannedCompletionDate" },
]);
const defaultSelectVal = ref<string[]>([]);
const isLoding = ref("");
const checkedHis = ref(["today"]);
const checkedHisList = ref([
  {
    value: "today",
    label: "当日过序",
  },
  {
    value: "all",
    label: "工序汇总",
  },
]);
const detailsData = ref([]);
const detailsColumn = ref([
  {
    text: true,
    prop: "MaterialName",
    label: "物料编码",
    width: "",
    align: "1",
    min: true,
  },
  {
    text: true,
    prop: "MaterialDesc",
    label: "物料描述",
    width: "250",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "LoadQueueQty",
    label: "上料数量",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "level",
    label: "剩余数量",
    width: "",
    min: true,
    align: "1",
  },
]);
interface RowData {
  WorkStationName: string;
  OrderNumber: string;
  ProductName: string;
  Container: string;
  VirtualContainer: string;
  CreatedBy: string;
  CreatedOn: string;
}
const rowData = ref<RowData>({
  WorkStationName: "",
  OrderNumber: "",
  ProductName: "",
  Container: "",
  VirtualContainer: "",
  CreatedBy: "",
  CreatedOn: "",
});
const getFeedForm = ref({
  MfgOrder: "",
  workstationName: opui.station,
  SpecName: "",
});

interface Defect {
  isDefectLabel: string;
  isDefectType: number | string
}
interface BadForm {
  containerName: string;
  DefectDetails: Array<Defect>;
  workstationName: string;
  userAccount: string;
}
const badForm = ref<BadForm>({
  containerName: "",
  DefectDetails: [],
  workstationName: opui.station || "",
  userAccount: userStore.getUserInfo,
});
const badheadForm = ref<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: ""
});
const badColumn = reactive([
  {
    text: true,
    prop: "isDefectReasonName",
    label: "不良代码",
    width: "100",
    align: "1",
  },
  {
       text: true,
    prop: "isDefectReasonDesc",
    label: "不良原因",
    width: "",
    min:true,
    align: "1",
  },
]);
const badVisible = ref(false)
const changeList = ref([]);
const BadtableData = ref([]);


onBeforeMount(() => {
  getScreenHeight();
  getSpecName();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getOrderData();
  getFocus();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

//获取光标
const getFocus = () => {
  inputFocus.value = false;
  setTimeout(() => {
    inputFocus.value = true;
  }, 100);
};

const formText = (data: string) => {
  let key = data as keyof typeof form;
  return form.value[key];
};
const getSpecName = () => {
  QuerySpecBystation(opui.station).then((res: any) => {
    getFeedForm.value.SpecName = res.content[0].SpecName;
  });
};

//获取过站历史记录
const getHisData = () => {
  QueryCleanCodeRecord(hisForm.value).then((res: any) => {
    tableData1.value = res.content;
  });
};
const getMaterialRequired = () => {
  stopsForm.value.MaterialName=[]
  QueryOrderMaterialRequired(getFeedForm.value).then((res: any) => {
    if (
      res.content.length == 0 ||
      res.content == null ||
      res.content == undefined
    ) {
      detailsData.value = [];
      return;
    }
    detailsData.value = res.content;
    detailsData.value.forEach((d:any)=>{
      stopsForm.value.MaterialName.push(d.MaterialName)
    })
  });
};

const changeHis = (val: any) => {
  if (checkedHis.value.length == 0) {
    checkedHis.value = [];
  } else {
    checkedHis.value = [];
    checkedHis.value[0] = val;
  }
};
const changeData = computed(() => {
  if (checkedHis.value[0] == "today") {
    return geTodayData();
  } else {
    return tableData1.value;
  }
});
const changeDataLength = (val: any) => {
  if (val == "today") {
    let dataLength = geTodayData();
    return dataLength.length;
  } else {
    return tableData1.value.length;
  }
};
const geTodayData = () => {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  function getDateFromDateTimeString(dateTimeString: any) {
    return dateTimeString.split(" ")[0];
  }
  const todayDataArray = tableData1.value.filter((item: any) => {
    return getDateFromDateTimeString(item.CreatedOn) === todayString;
  });
  return todayDataArray;
};

//过站
const getChange = () => {
  let barCodeData = barCode.value;
  if (stopsForm.value.OrderName == "") {
    msgTitle.value = "请先选择生产计划号";
    msgType.value = false;
  } else {
let isZero=detailsData.value.findIndex((d:any)=>d.Qty==0)
    if (detailsData.value.length == 0||isZero!==-1) {
      msgTitle.value = `批次料为空或余量为0，请进行维护`
      msgType.value = false
    } else {
      stopsForm.value.BarCode = barCodeData;
      CleanCodeSave(stopsForm.value).then((res: any) => {
        msgTitle.value = res.msg;
        msgType.value = res.success;
        stopsForm.value.BarCode = "";
        // getFocus();
        if (res.success) {
          getHisData();
          getMaterialRequired();
        }

      });
    }

  }
  barCode.value = "";
  getFocus();
};

const badSelectionChange = (data: any) => {
  let content = cloneDeep(data);
  changeList.value = content;
};
const badCancel = () => {
  badVisible.value = false;
  BadtableData.value = [];
  changeList.value = [];
  badForm.value.DefectDetails = [];
  stopsForm.value.result = "OK";
};
const badSubmit = () => {
  changeList.value.forEach((c: any) => {
    badForm.value.DefectDetails.push({
      isDefectLabel: c.isDefectReasonName,
      isDefectType: 1
    });
  });
  DefectProductRecord(badForm.value).then((res: any) => {
    msgTitle.value = "";
    msgType.value = true;
    if (res.success) {
      badVisible.value = false;
      BadtableData.value = [];
      changeList.value = [];
      badForm.value.DefectDetails = [];
      stopsForm.value.result = "OK";
      getFocus()
    }
    ElNotification({
      title: "提示信息",
      message: res.msg,
      type: res.success ? "success" : "error",
    });
  });
};


const radioChange = (args: any) => {
  if (args[1] == null) {
    form.value.MfgOrderName = "";
    form.value.ProductName = "";
    form.value.ProductDesc = "";
    form.value.PlannedStartDate = "";
    form.value.BD_ProductModel = "";
    form.value.BD_SoftVersion = "";
    form.value.PlannedCompletionDate = "";
    form.value.Qty = "";
    form.value.ERPOrder = "";
    detailsData.value = []
    tableData1.value = []
  } else {

    if (args[1] !== form.value.MfgOrderName || form.value.MfgOrderName == "") {
      form.value.MfgOrderName = args[0].MfgOrderName;
      form.value.ProductName = args[0].ProductName;
      form.value.ProductDesc = args[0].ProductDesc;
      form.value.BD_ProductModel = args[0].BD_ProductModel;
      form.value.BD_SoftVersion = args[0].BD_SoftVersion;
      form.value.PlannedStartDate = args[0].PlannedStartDate;
      form.value.PlannedCompletionDate = args[0].PlannedCompletionDate;
      form.value.Qty = args[0].Qty;
      form.value.AllNum = args[0].AllNum;
      form.value.TodayNum = args[0].TodayNum;
      form.value.ERPOrder = args[0].ERPOrder;
      stopsForm.value.OrderName = args[0].MfgOrderName;
      stopsForm.value.ProductName = args[0].ProductName;
      hisForm.value.MfgOrderName = args[0].MfgOrderName;
      getFeedForm.value.MfgOrder = args[0].MfgOrderName;
      // getHisData();
      // getMaterialRequired();
    } else {

    }
    getHisData();
    getMaterialRequired();
  }
};
const getOrderData = () => {
  isLoding.value = "is-loading";
  defaultSelectVal.value = []
  OrderQuery({ lineName: opui.line }).then(
    (res: any) => {
      let data = res.content;
      let timer = setTimeout(() => {
        isLoding.value = "";
        clearTimeout(timer);
      }, 2000);
      if (data !== null && data.length !== 0) {
        orderTable.value.data = data;
        if (data.length >= 1) {
          defaultSelectVal.value[0] = data[0].MfgOrderName;
        }
      }
    }
  );
};

const rowClick = (row: any) => {
  // console.log(row);
  rowData.value = { ...row };
};
const reWash = () => {
  let reWashForm = {
    BarCode: "",
    OrderName: form.value.MfgOrderName,
    ProductName: "",
    workstationName: opui.station,
    userAccount: userStore.getUserInfo,
  };
  if (rowData.value.VirtualContainer == "") {
    let data = cloneDeep(tableData1.value[tableData1.value.length - 1]);
    reWashForm.BarCode = data.VirtualContainer;
    reWashForm.ProductName = data.ProductName;
  } else {
    reWashForm.BarCode = rowData.value.VirtualContainer;
    reWashForm.ProductName = rowData.value.ProductName;
  }

  ReloadCleanCode(reWashForm).then((res: any) => {
    msgTitle.value = res.msg;
    msgType.value = res.success;
    if (res.success) {
      getHisData();
    }
  });
  getFocus();
};

//分页
const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 380;
  });
};
</script>

<style lang="scss">
.inbound .el-form-item__label {
  font-size: 16px;
}

.setwidth {
  flex: 0 0 350px;
}

.box {
  border-right: 2px solid #cbcbcb;
}

.tabs-css .el-tabs--border-card {
  border-top: 1px solid #006487;
}

.tabs-css .el-tabs__header {
  background-color: #006487 !important;
}

.tabs-css .el-tabs__content {
  padding: 5px 0px;
}

.tabs-css .el-tabs__item {
  font-size: 1.1rem;
}

.tabs-css .el-tabs--border-card>.el-tabs__header .el-tabs__item {
  color: #fff;
  // padding: 0 !important;
}

.tabs-css .el-tabs__item.is-active {
  // color: #fff;
  color: #006487 !important;
  // font-weight: bold;
}

.el-switch__label {
  font-weight: bold;
}

.switchok .el-switch__label.is-active {
  color: #13ce66;
}

.switchng .el-switch__label.is-active {
  color: #ff4949;
}

.tabs-css .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
  // color: #fff;
  // background-color: #fff;
  background-color: rgba($color: #fff, $alpha: 0.8);
}

.saveAsDialog {
  min-width: 954px;
}

// .checked{
//   height: 14px;
// }
.checked .el-checkbox {
  height: 14px;
}
</style>
<style lang="scss" scoped>
::v-deep .laser-table-filter .el-checkbox__inner {
  /* 你的样式 */
  background-color: #409eff !important;
  /* 使用 !important，但请谨慎 */
  color: white !important;
}

::v-deep .laser-table-filter .el-checkbox__label {
  /* 你的样式 */
  color: white !important;
  font-size: 1.1rem;
}
</style>
