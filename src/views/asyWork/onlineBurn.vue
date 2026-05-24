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
                <span class="font-bold text-lg leading-[30px]" :class="f.value == 'TodayNum' ? 'text-[#00B400]' : ''">
                  {{ formText(f.value) }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-320px)]">
        <!-- <div class="w-full"> -->
        <div class="w-full h-full flex flex-col">
          <div>
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-[120px] pt-3 pr-5 pl-5">
              <div class="flex justify-between">
                <div>
                  <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                    @submit.native.prevent>
                    <el-form-item label="扫描条码" class="mb-2">
                      <el-input v-model.trim="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 500px"
                        placeholder="请扫描条码" @keyup.enter.native="getChange" />
                    </el-form-item>
                    <!-- <el-form-item label="" class="mb-2">
                      <el-button type="primary" @click="reset">重置</el-button>
                    </el-form-item>
                    <el-form-item label="" class="mb-2">
                      <el-input
                        class="custom-input custom-input-class"
                        v-model.trim="stopsForm.ContainerName"
                        style="width: 300px"
                        disabled
                      />
                    </el-form-item> -->
                  </el-form>
                </div>
                <div>
                  <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                    @submit.native.prevent>
                  </el-form>
                </div>
              </div>
              <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                {{ msgTitle === "" ? "请扫描成品条码" : msgTitle }}
              </div>
              <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                {{ msgTitle }}
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
              :pageObj="pageObj" @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"></table-tem>
          </div>
        </div>
      </div>
    </div>
    <!-- <el-dialog
      align-center
      :append-to-body="true"
      draggable
      :close-on-click-modal="false"
      v-model="viewVisible"
      @close=""
      title="选择烧录外部码（上位机）"
      width="90%"
    >
      <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
        <el-tab-pane label="车机外部码列表" name="shelveMaterial">
          <el-table
            ref="taskTableRef"
            class="my-table"
            border
            fit
            :data="popTableData"
            :style="{ width: '100%' }"
            :height="450"
            @select="selectClick"
            :row-class-name="tableRowClassName"
            size="large"
          >
            <el-table-column type="selection" fixed width="55" align="center" />
            <el-table-column type="index" width="75" label="序号" />
            <el-table-column
              prop="ProgramedDate"
              width="250"
              label="烧录时间"
            >
                  <template #default="scope">
                    <div style="font-size: 18px">{{ scope.row.ProgramedDate }}</div>
                  </template>
</el-table-column>
<el-table-column prop="tuid" label="tuid" width="350">
  <template #default="scope">
                    <div style="font-size: 18px">{{ scope.row.tuid }}</div>
                  </template>
</el-table-column>
<el-table-column prop="TUIDQRCode" label="车机外部码">
  <template #default="scope">
                    <div style="font-size: 18px">{{ scope.row.TUIDQRCode }}</div>
                  </template>
</el-table-column>
</el-table>
</el-tab-pane>
</el-tabs>
<template #footer>
        <span class="dialog-footer">
          <el-button @click="viewVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="submit"> 确定 </el-button>
        </span>
      </template>
</el-dialog> -->
  </div>
</template>

<script lang="ts" setup>
import tableTem from "@/components/tableTem/index.vue";
import selectTa from "@/components/selectTable/index.vue";
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { checkStringType } from "@/utils/barcodeFormat";
import type { Formspan, FormHeader, OrderData } from "@/typing";
import { cloneDeep } from "lodash-es";
import {
  JudgeContainerProProcess,
  JudgeAfterStartUpQrCode,
  QueryMoveHistory,
  OrderQuery,
  ueryOrderTUIDQRInfo,
  GetPLCExternalCodeList,
  SubmitPLCExternalCode,
} from "@/api/asyApi";
import { ElNotification } from "element-plus";
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  computed,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
interface StopsForm {
  ContainerName: string;
  QrCodeNews: string;
  workstationName: string;
  userAccount: string;
  txnDate: string;
  OrderName: string;
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
const loginName = userStore.getUserInfo;
const opui = appStore.getOPUIReal();
const inputRef = ref();
const inputFocus = ref(true);
const barCode = ref("");
const currentCode = ref("");
const SoftwareStatus = ref(true);
const isActive = ref(false);
const viewVisible = ref(false);
const activeName = ref("shelveMaterial");
const changeList = ref([]);
const taskTableRef = ref();
const stopsForm = ref<StopsForm>({
  ContainerName: "",
  QrCodeNews: "",
  OrderName: "",
  workstationName: opui.station || "",
  userAccount: userStore.getUserInfo,
  txnDate: "",
});

const form = ref<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  Qty: "",
  PlannedStartDate: "",
  PlannedCompletionDate: "",
});
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
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
    prop: "ContainerName",
    label: "成品条码",
    width: "180",
    align: "1",
  },
  {
    text: true,
    prop: "BurnQRCode",
    label: "车机外部码",
    width: "",
    align: "1",
  },

  {
    text: true,
      prop: "fullname",
    label: "扫描人",
    width: "150",
    align: "1",
  },
  {
    text: true,
    prop: "TxnDate",
    label: "扫描时间",
    width: "180",
    align: "1",
  },
]);
const popTableData = ref([]);
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

//提交
const submit = () => {
  if (changeList.value.length === 0) {
    ElNotification({
      title: `请选择`,
      // message: "取消操作",
      type: "warning",
    });
  }

  SubmitPLCExternalCode(stopsForm.value).then((res: any) => {
    msgTitle.value = res.msg;
    msgType.value = res.success;
    if (res.success) {
      stopsForm.value.ContainerName = "";
      stopsForm.value.QrCodeNews = "";
      viewVisible.value = false;
      isActive.value = false;
      getHisData();
    }
    barCode.value = "";
    getFocus();
  });
};

//获取过站历史记录
const getHisData = () => {
  QueryMoveHistory(hisForm.value).then((res: any) => {
    tableData1.value = res.content;
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
    return getDateFromDateTimeString(item.TxnDate) === todayString;
  });
  return todayDataArray;
};
const radioChange = (args: any) => {
  if (args[1] == null) {
    form.value.MfgOrderName = "";
    form.value.ProductName = "";
    form.value.ProductDesc = "";
    form.value.BD_ProductModel = "";
    form.value.BD_SoftVersion = "";
    form.value.Qty = "";
    form.value.ERPOrder = "";
    tableData1.value = [];
  } else {
    if (args[1] !== form.value.MfgOrderName || form.value.MfgOrderName == "") {
      form.value.MfgOrderName = args[0].MfgOrderName;
      form.value.ProductName = args[0].ProductName;
      form.value.ProductDesc = args[0].ProductDesc;
      form.value.BD_ProductModel = args[0].BD_ProductModel;
      form.value.BD_SoftVersion = args[0].BD_SoftVersion;
      form.value.Qty = args[0].Qty;
      form.value.ERPOrder = args[0].ERPOrder;
      stopsForm.value.OrderName = args[0].MfgOrderName;
      hisForm.value.MfgOrderName = args[0].MfgOrderName;
      // ueryOrderTUIDQRInfo(args[0].BD_ProductModel).then((data: any) => {
      //   if (data.content) {
      //     SoftwareStatus.value = data.content.IsTUIDQRCode;
      //   }
      // });
    } else {
    }
    getHisData();
  }
};

//选中
const handleSelectionChange = (data: any) => {
  let content = cloneDeep(data);
  // console.log(data);

  changeList.value = content;
};

//重置页面
// const reset = () => {
//   currentCode.value = "";
//   barCode.value = "";
//   msgTitle.value = "";
//   msgType.value = true;
//   stopsForm.value.QrCodeNews = "";
//   stopsForm.value.ContainerName = "";
//   isActive.value = false;
//   popTableData.value = [];
// };

//过站
const getChange = () => {
  let barCodeData = barCode.value;
  msgTitle.value = "";
  msgType.value = true;
  if (checkStringType(barCodeData) == "BDY") {
    JudgeContainerProProcess({
      OrderName: form.value.MfgOrderName,
      ContainerName: barCodeData,
      workstationName: opui.station,
      userAccount: userStore.getUserInfo,
      MfgLineName: opui.line
    }).then((res: any) => {
      msgTitle.value = res.msg;
      msgType.value = res.success;
      if (res.success) {
        if (!res.content.IsTUIDQRCode) {
          msgTitle.value = res.msg;
          msgType.value = true;
          barCode.value = '';
          getHisData();
          return;
        }
        stopsForm.value.ContainerName = barCodeData;
        // form.value = { ...res.content[0] };
        // hisForm.value.MfgOrderName = res.content[0].MfgOrderName;
        msgTitle.value = res.msg;
        msgType.value = true;
        // if (!SoftwareStatus.value) {
        //   isActive.value = true;
        //   GetPLCExternalCodeList({
        //     OrderName: form.value.MfgOrderName,
        //     userAccount: loginName,
        //   }).then((res: any) => {
        //     if (res.content) {
        //       popTableData.value = res.content;
        //       viewVisible.value = true;
        //     }
        //   });
        // } else {
        //   isActive.value = false;
        // }
      } else {
        stopsForm.value.ContainerName = "";
      }
      barCode.value = "";
    });
  } else {
    if (stopsForm.value.ContainerName != "") {
      stopsForm.value.QrCodeNews = barCodeData;
      JudgeAfterStartUpQrCode(stopsForm.value).then((res: any) => {
        msgTitle.value = res.msg;
        msgType.value = res.success;
        if (res.success) {
          stopsForm.value.ContainerName = "";
          stopsForm.value.QrCodeNews = "";
          getHisData();
        }
        barCode.value = "";
        getFocus();
      });
    } else {
      msgTitle.value = "请扫描成品条码进行验证！！！";
      msgType.value = false;
      return;
    }
  }
  // stopsForm.value.containerName = barCodeData;
  // DispenseStationMoveOut(stopsForm.value).then(
  //   (res: any) => {
  //     msgTitle.value = res.msg;
  //     msgType.value = res.success;
  //     stopsForm.value.containerName = "";
  //     form.value = { ...res.content[0] };

  //     hisForm.value.MfgOrderName = res.content[0].MfgOrderName;
  //     getFocus();
  //     getHisData();
  //   }
  // );
  // barCode.value = "";
};

const selectClick = (selection: any, row: any) => {
  if (selection.length > 1) {
    let del_row = selection.shift();
    taskTableRef.value.toggleRowSelection(del_row, false); // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）；第二个参数为true时又变成了多选
    // console.log(selection[0]);
    changeList.value = selection[0];
    stopsForm.value.QrCodeNews = selection[0].TUIDQRCode;
  } else {
    // console.log(selection[0]);
    changeList.value = selection[0];
    stopsForm.value.QrCodeNews = selection[0].TUIDQRCode;
  }
};

const getTextWidth = (str: string) => {
  let fontSizeNum = 16;
  let width = 0;
  const html = document.createElement("span");
  html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${fontSizeNum}px; font-family: Arial, sans-serif;`;
  html.innerText = str; // 去除字符串前后的空白字符
  document.body?.appendChild(html);

  const spanElement = html; // 无需再次查询，直接使用创建的元素
  if (spanElement) {
    width = spanElement.offsetWidth;
    spanElement.remove();
  }
  // console.log(width);
  return width;
};

const flexColumnWidth = (label: any, prop: any) => {
  const arr = popTableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
};

const getMaxLength = (arr: any) => {
  return arr.reduce((acc: any, item: any) => {
    if (item) {
      // console.log(acc,item);
      const calcLen = getTextWidth(item);

      if (acc < calcLen) {
        acc = calcLen;
      }
    }
    return acc;
  }, 0);
};

//判断是否可选中
const tableRowClassName = ({ row }: { row: any; rowIndex: number }) => {
  // 在这里判断行数据是否符合条件
  // if (row.SoftwareName === errorRow.value) {
  //   tableData1.value = tableData1.value;
  //   return "has-material-row";
  // }else {
  // }
  return "";
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
    tableHeight.value = window.innerHeight - 320;
  });
};
</script>

<style lang="scss">
.inbound .el-form-item__label {
  font-size: 16px;
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

::v-deep .el-table__header-wrapper {
  .el-checkbox__inner {
    display: none;
  }
}

//添加全选样式
::v-deep .el-table .addAllSelectClass .cell::before {
  content: "选择";
  // text-align: center;
  //   margin-left: 5px;
  //   /** 文本1 */
  // font-size: 16px;
  // font-weight: 400;
  // letter-spacing: 0px;
  // line-height: 23.17px;
  // color: rgba(128, 128, 128, 1);
}
</style>
