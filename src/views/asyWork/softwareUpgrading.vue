<template>
  <div class="flex flex-col w-full h-full">
    <!-- <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
      <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
      <div></div>
    </div> -->
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[320px]">
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
                <div class="font-bold text-lg leading-[30px] w-full" :class="[
                  f.value == 'TodayNum' ? 'text-[#00B400] text-center' : '',
                  f.value == 'TotalNum' ? 'text-[#006487] text-center' : '',
                ]">
                  {{ formText(f.value) }}
                </div>
              </el-form-item>
              
              <el-form-item label="过序汇总" class="item-form">
                <div class="flex justify-center items-center gap-4 p-1  border-2 border-solid border-[#f48000] w-28">
                <div class="font-bold text-xl  text-center  text-[#f48000]">
                  {{ form.TotalNum }}
                </div> </div>
              </el-form-item>
           
          
              <el-form-item label="当日过序" class="item-form">
                <div class="flex justify-center items-center gap-4 p-1 border-2 border-solid  border-[#09bb07] w-28 ">
                <div class="font-bold text-xl  text-center  text-[#09bb07]">
                  {{ form.TodayNum }}
                </div>
              </div>
              </el-form-item>
           
            </el-form>
            <!-- <div class="flex justify-center items-center pt-1 mb-2 border-2 border-solid border-[#f48000]">
              <el-form-item label="过序汇总" class="mb-1">
                <div class="font-bold text-xl text-[#f48000]">
                  {{ form.TotalNum }}
                </div>
              </el-form-item>
            </div>
            <div class="flex justify-center items-center gap-4 p-1 border-2 border-solid border-[#09bb07]">
              <el-form-item label="当日过序" class="mb-1 text-[#09bb07]">
                <div class="font-bold text-xl leading-[30px] text-[#09bb07]">
                  {{ form.TodayNum }}
                </div>
              </el-form-item>
            </div> -->
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-670px)]">
        <!-- <div class="w-full"> -->
        <div class="w-full h-full flex flex-col">
          <div>
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-[100px] pt-3 pr-5 pl-5">
              <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                @submit.native.prevent>
                <el-form-item label="扫描条码" class="mb-2">
                  <el-input v-model.trim="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 500px"
                    placeholder="请扫描MES条码" :disabled="isActive" @keyup.enter.native="scan" />
                </el-form-item>
                <el-form-item label="" class="mb-2">
                  <el-button type="primary" @click="reset">重置</el-button>
                </el-form-item>
              </el-form>
              <!-- <div
                  class="text-xl font-bold text-[#00B400]"
                  v-show="msgType === true || msgTitle === ''"
                >
                  {{ msgTitle === "" ? "请扫描成品SN条码" : msgTitle }}
                </div>
                <div
                  class="text-xl font-bold text-[red]"
                  v-show="msgType === false && msgTitle !== ''"
                >
                  {{ msgTitle }}
                </div> -->
            </div>
          </div>

          <div class="flex flex-col flex-1 tabs-css">
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487] justify-between">
              <span class="ml-5">软件信息</span>
              <el-button type="warning" :disabled="SoftwareStatus || changeList.length !== tableData1.length
                " @click="ManualSubmit">人工确认提交</el-button>
            </div>
            <el-table class="my-table" border fit :data="tableData1" :style="{ width: '100%' }" :height="tableHeight"
              @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
              <el-table-column type="selection" fixed width="55" align="center" />
              <!-- <el-table-column prop="SoftwareName" label="Name" width="250" /> -->
              <el-table-column prop="SoftwareName" label="名称" width="250" />
              <el-table-column prop="SoftwareVersion" label="版本" />
            </el-table>
            <!-- <table-tem class="my-table" :show-select="true" :tableData="tableData1" :tableHeight="tableHeight"
              :columnData="columnData1" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange" @handleSelectionChange="handleSelectionChange"></table-tem> -->
          </div>
        </div>
      </div>
      <div class="setwidth w-[350px] border-l border-solid border-[#cbcbcb]">
        <div class="w-full h-full box">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">当前MES码</span>
          </div>
          <div class="h-[100px] pt-3 pr-5 pl-5">
            <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
              @submit.native.prevent>
              <el-form-item label="" class="mb-2">
                <el-input class="custom-input custom-input-class" v-model.trim="currentCode" ref="inputRef"
                  style="width: 300px" disabled />
              </el-form-item>
            </el-form>
          </div>

          <div class="flex flex-col flex-1 tabs-css">
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5">检测结果与提示消息</span>
            </div>
            <div class="h-[160px] flex justify-around items-center">
              <div class="w-[120px] h-[120px] rounded-full" :style="{ backgroundColor: typeColor }"></div>
            </div>
            <div :style="{ height: `${boxHeight}px` }"
              class="m-2 border border-solid border-[#cbcbcb] text-2xl font-bold"
              :class="msgType ? 'text-[#00B400]' : 'text-[red]'">
              {{ msgTitle }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import tableTem from "@/components/tableTem/index.vue";
import badInfoTem from "@/components/badInfoTem/index.vue";
import formTem from "@/components/formTem/index.vue";
import feedTemp from "@/components/feedTemp/index.vue";
import selectTa from "@/components/selectTable/index.vue";
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { checkStringType } from "@/utils/barcodeFormat";
import type { Formspan, FormHeader, OrderData } from "@/typing";
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import {
  OrderQuery,
  VerifyContainer,
  QueryOrderSoftwareInfo,
  AutoComparisonInfoMovestd,
  ManualComparisonInfoMovestd,
  QueryMoveHistory,
} from "@/api/asyApi";
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
  containerName: string;
  workstationName: string;
  result: string;
  userAccount: string;
  txnDate: string;
  orderName: string;
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
const currentCode = ref("");
const dialogVisible = ref(false);
const materialTable = ref<any[]>([]);
const boxHeight = ref(0);
const changeList = ref([]);
const btnType = ref(false);
const SoftwareStatus = ref(true);
const typeColor = ref("grey");
const stopsForm = ref<StopsForm>({
  containerName: "",
  workstationName: opui.station || "",
  userAccount: userStore.getUserInfo,
  orderName: "",
  txnDate: "",
  result: "OK",
});

const form = ref<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  Qty: "",
  ERPOrder: "",
  BD_ProductModel: "",
  TotalNum: "",
  TodayNum: "",
});
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
  // {
  //   label: "生产计划号",
  //   value: "PlanNo",
  //   disabled: true,
  //   type: "input",
  //   width: "",
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
  // {
  //   label: "工序汇总",
  //   value: "TotalNum",
  //   disabled: true,
  //   type: "input",
  //   width: "",
  // },
  // {
  //   label: "当日过序",
  //   value: "TodayNum",
  //   disabled: true,
  //   type: "input",
  //   width: "",
  // },
]);
const columnData1 = reactive([
  {
    text: true,
    prop: "SoftwareName",
    label: "成品SN条码",
    width: "200px",
    align: "1",
  },

  {
    text: true,
    prop: "SoftwareVersion",
    label: "产品版本二维码",
    width: "",
    align: "1",
  },
]);

const materialColumnData = reactive([
  {
    text: true,
    prop: "SoftwareName",
    label: "版本信息",
    width: "",
    align: "1",
  },

  {
    text: true,
    prop: "SoftwareVersion",
    label: "对比结果",
    width: "",
    align: "1",
  },
]);

const tableData1 = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 10000,
  currentPage: 1,
  isShow: -1,
});

const materialPageObj = ref({
  pageSize: 100000,
  currentPage: 1,
  isShow: -1,
});

const msgTitle = ref("");
const msgType = ref(true);
const hisForm = ref({
  MfgOrderName: "",
  workstationName: opui.station,
});
const hisTableData = ref([]);

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
const isActive = ref(false);

const errorRow = ref("");

onBeforeMount(() => {
  getScreenHeight();
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
//获取过站历史记录
const getHisData = () => {
  QueryMoveHistory(hisForm.value).then((res: any) => {
    hisTableData.value = res.content;
    form.value.TotalNum = changeDataLength("all");
    form.value.TodayNum = changeDataLength("today");
  });
};
const changeDataLength = (val: any) => {
  if (val == "today") {
    let dataLength = geTodayData();
    return dataLength.length;
  } else {
    return hisTableData.value.length;
  }
};
const geTodayData = () => {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  function getDateFromDateTimeString(dateTimeString: any) {
    return dateTimeString.split(" ")[0];
  }
  const todayDataArray = hisTableData.value.filter((item: any) => {
    return getDateFromDateTimeString(item.TxnDate) === todayString;
  });
  return todayDataArray;
};
//获取工单软件信息
const getOrderMess = () => {
  // console.log(form.value.BD_ProductModel);
  let ProductModel =
    form.value.BD_ProductModel == null ? "" : form.value.BD_ProductModel;
  QueryOrderSoftwareInfo(ProductModel).then((res: any) => {
    if (res.content) {
      tableData1.value = res.content.SoftwareList;
      SoftwareStatus.value = res.content.SoftwareStatus;
    }
    if (!res.success) {
      msgType.value = res.success;
      msgTitle.value = res.msg;
    }
  });
};

//重置页面
const reset = () => {
  currentCode.value = "";
  barCode.value = "";
  msgTitle.value = "";
  msgType.value = true;
  typeColor.value = "grey";
  isActive.value = false;
  inputRef.value.focus()
};

//选中
const handleSelectionChange = (data: any) => {
  let content = cloneDeep(data);
  // console.log(data);

  changeList.value = content;
};

//扫描条码
const scan = () => {
  const barCodeData = barCode.value;
  if (currentCode.value === "") {
    VerifyContainer({
      containerName: barCodeData,
      orderName: form.value.MfgOrderName,
      workstationName: opui.station,
    }).then((res: any) => {
      msgType.value = res.success;
      msgTitle.value = res.msg;
      if (res.success) {
        currentCode.value = barCodeData;
        if (!SoftwareStatus.value) {
          isActive.value = true;
        } else {
          isActive.value = false;
        }
      }
    });
  } else {
    if (SoftwareStatus.value) {
      AutoComparisonInfoMovestd({
        ContainerName: currentCode.value,
        SoftwareCode: barCode.value,
        SoftwareInfo: tableData1.value,
        workstationName: opui.station,
        userAccount: userStore.getUserInfo,
      }).then((res: any) => {
        msgType.value = res.success;
        msgTitle.value = res.msg;
        if (res.success) {
          typeColor.value = "#00B400";
          getHisData();
          isActive.value = false;
          currentCode.value = "";
        } else {
          if (res.content) {
            errorRow.value = res.content.SoftwareName;
            console.log(errorRow);
          }
          typeColor.value = "red";
        }
      });
    }
  }
  barCode.value = "";
  getFocus();
};

const ManualSubmit = () => {
  ManualComparisonInfoMovestd({
    containerName: currentCode.value,
    workstationName: opui.station,
    userAccount: userStore.getUserInfo,
  }).then((res: any) => {
    msgType.value = res.success;
    msgTitle.value = res.msg;

    if (res.success) {
      typeColor.value = "#00B400";
      getHisData();
      isActive.value = false;
      currentCode.value = "";
      // getOrderMess()
      // QueryOrderSoftwareInfo({
      //   containerName: form.value.PlanNo,
      //   workstationName: opui.station,
      // }).then((res: any) => {
      //   if (res && res.success) {
      //     currentCode.value = "";
      //     SoftwareStatus.value = true;
      //     const today = new Date();
      //     const todayString = today.toISOString().split("T")[0];
      //     function getDateFromDateTimeString(dateTimeString: any) {
      //       return dateTimeString.split(" ")[0];
      //     }
      //     const todayDataArray = res.content.value.filter((item: any) => {
      //       return getDateFromDateTimeString(item.CreatedOn) === todayString;
      //     });
      //     form.value.TodayNum = todayDataArray.length;
      //     form.value.TotalNum = res.content.length;
      //     tableData1.value = [];
      //   } else {
      //     msgType.value = res.success;
      //     msgTitle.value = res.msg;
      //   }
      //   barCode.value = "";
      // });
    } else {
      typeColor.value = "red";
    }
  });
};

//过站
const getChange = () => {
  let barCodeData = barCode.value;

  stopsForm.value.containerName = barCodeData;
};
const getOrderData = () => {
  isLoding.value = "is-loading";
  defaultSelectVal.value = [];
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

const tableRowClassName = ({ row }: { row: any; rowIndex: number }) => {
  // 在这里判断行数据是否符合条件
  if (row.SoftwareName === errorRow.value) {
    tableData1.value = tableData1.value;
    return "has-material-row";
  } else {
  }
  return "";
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
    // detailsData.value = []
    tableData1.value = [];
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
      stopsForm.value.orderName = args[0].MfgOrderName;
      hisForm.value.MfgOrderName = args[0].MfgOrderName;

      // getMaterialRequired();
    } else {
    }
    msgType.value = true;
    msgTitle.value = "";
    getHisData();
    getOrderMess();
  }
};
//
onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  // getOrderData();
  getFocus();
  // getHisData();
});

//分页
const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};

//分页
const materialSizeChange = (val: any) => {
  materialPageObj.value.currentPage = 1;
  materialPageObj.value.pageSize = val;
};
const materialCurrentChange = (val: any) => {
  materialPageObj.value.currentPage = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 255;
    boxHeight.value = window.innerHeight - 440;
  });
};
</script>

<style lang="scss">
.inbound .el-form-item__label {
  font-size: 16px;
}
.item-form .el-form-item__label-wrap{
  align-items: center;
}

.setwidth {
  flex: 0 0 320px;
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

.custom-input .el-input__inner {
  font-weight: bold;
}

.custom-input-class.el-input.is-disabled .el-input__wrapper {
  background-color: rgba($color: #000000, $alpha: 0);
  color: black;
}

.custom-input-class.el-input.is-disabled .el-input__inner {
  color: black;
  -webkit-text-fill-color: black;
  font-size: large;
}

.my-table .el-table__cell {
  padding: 4px 0;
}

.my-table .has-material-row {
  --el-table-tr-bg-color: rgb(255 243 243);
}
</style>
