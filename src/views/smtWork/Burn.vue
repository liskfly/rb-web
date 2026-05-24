<template>
  <div class="flex">
    <div class="w-[320px] border-solid border-r-2 border-[#cbcbcb]">
      <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
        <span class="ml-5">基本信息</span>
      </div>
      <div class="p-2">
        <el-form class="inbound" size="default" ref="formRef" :model="OrderForm" label-width="auto">
          <el-form-item label="生产计划号">
            <div class="flex items-center">
              <selectTa ref="selectTable" :table="orderTable" :columns="orderColumns" :selectWidth="170"
                :max-height="400" :tableWidth="700" :defaultSelectVal="defaultSelectVal"
                :keywords="{ label: 'MfgOrderName', value: 'MfgOrderName' }"
                @radioChange="(...args: any) => radioChange(args)">
              </selectTa>
              <el-tooltip content="刷新" placement="top">
                <el-icon class="ml-3" color="#006487" :class="isLoding" size="24" @click="getOrderData">
                  <RefreshRight />
                </el-icon>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item v-for="f in formHeader" :key="f.value" :label="f.label" class="mb-2">
            <span class="font-bold text-base leading-[30px]" :class="f.value == 'passNum' ? 'text-[#00B400]' : ''">
              {{ formText(f.value) }}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="w-[calc(100%-320px)] pt-[5px]">
      <div>
        <div class="ml-2">
          <el-form ref="formRef" :inline="true" size="default" :model="form" label-width="auto">
            <el-form-item label="烧录日期" prop="startTime" class="mb-2">
              <el-date-picker :shortcuts="shortcuts" v-model="form.date" type="daterange" range-separator="-"
                start-placeholder="开始时间" format="YYYY-MM-DD" :clearable="false" value-format="YYYY-MM-DD"
                end-placeholder="结束时间" />
            </el-form-item>
            <el-form-item label="生产计划号" prop="workOrder" class="mb-2"><el-input v-model="form.OrderNum"
                style="width: 180px" placeholder="请输入生产计划号" clearable /></el-form-item>
            <el-form-item label="原材料批次号" prop="barCode" class="mb-2"><el-input style="width: 180px" clearable
                v-model="form.BarCode" placeholder="请输入条码" /></el-form-item>
          </el-form>
        </div>
        <div class="mb-2 ml-2">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button icon="Printer" type="primary" @click="burnPrint"
            :disabled="BurnTableData.length == 0">打印</el-button>

          <el-button :disabled="OrderForm.MfgOrderName == ''" type="warning" @click="RawmaterialFeeding">
            烧录转批次</el-button>
        </div>
        <tableTem ref="BurnTableRef" :showIndex="true" :size="'small'" :tableData="tableData" :tableHeight="tableHeight"
          :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange" showSelect="ture" @handleSelectionChange="getChoice">
        </tableTem>
      </div>
    </div>
    <el-dialog v-model="feedVisible" title="烧录转批次" width="80%" align-center class="saveAsDialog"
      @open="handleDialogOpen" @close="feedCancel" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="flex box">
        <div class="setwidth box-border w-[320px]">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">基本信息</span>
          </div>
          <el-form ref="formRef" :model="form" label-width="auto" class="p-2">
            <div v-for="f in FeedHeader" :key="f.prop">
              <el-form-item :label="f.label" :prop="f.prop" :class="[f.prop == 'eqInfo' ? 'mb-2' : '']">
                <span class="font-bold text-[1rem] text-wrap break-all">{{
                  burnformText(f.prop)
                }}</span>
              </el-form-item>
              <el-divider class="mb-2 mt-2" v-if="f.prop == 'eqInfo'" />
            </div>
          </el-form>
        </div>
        <div class="w-[calc(100%-320px)] min-w-[600px]">
          <div class="w-full h-full flex flex-col">
            <div>
              <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                <span class="ml-5"> 扫描条码</span>
              </div>
              <div class="h-[120px] p-5">
                <el-form class="inbound" :inline="true" :model="form" label-width="auto" @submit.native.prevent>
                  <el-form-item label="扫描条码">
                    <el-input v-model="barCode" style="width: 500px" ref="inputRef" :autofocus="inputFocus"
                      placeholder="请扫描条码" @keyup.enter.native="getChange" />
                  </el-form-item>
                </el-form>
                <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                  {{ msgTitle === "" ? "请扫描条码" : msgTitle }}
                </div>
                <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                  {{ msgTitle }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="feedCancel">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- <el-dialog v-model="feedVisible" title="物料上料" width="90%" align-center class="saveAsDialog" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <feedTemp ref="feedRef" :form="feedForm" :form-header="FeedHeader" :tableData="feedTableData"
        :specName="'SMT-Burn'" @updateList="getFeedData" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="feedCancel">关闭</el-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElNotification } from "element-plus";
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";
import type {
  Formspan,
  FormHeader,
  OrderData,
  BurnForm,
  FeedForm,
} from "@/typing";
import selectTa from "@/components/selectTable/index.vue";
import tableTem from "@/components/tableTem/index.vue";
import feedTemp from "@/components/feedTemp/index.vue";

import { cloneDeep } from "lodash-es";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { shortcuts, setTodayDate, setLastDate } from "@/utils/dataMenu";
const userStore = useUserStoreWithOut();
const form = ref<InstanceType<typeof BurnForm>>({
  date: [],
  SpecName: "SMT-Burn",
  BarCode: "",
  OrderNum: "",
  StartTime: "",
  EndTime: "",
});
import { useAppStore } from "@/stores/modules/app";
import {
  QueryBurnPrintData,
  PrintBurnModel,
  OrderQuery,
  QueryOrderMaterialRequired,
  MESSaveBurnResult,
} from "@/api/smtApi";

const appStore = useAppStore();
const opui = appStore.getOPUIReal();

const BurnTableRef = ref();

const BurnTableData = ref([]);

const getChoice = (e: any) => {
  BurnTableData.value = e.map((item: any) => {
    return {
      Barcode: item.ContainerName,
      Itemcode: item.MaterialCode,
      OrderNum: item.MfgOrderName,
      Supplier: "",
      ManufacDate: "",
      Itemname: item.MaterialDesc,
      DeliveryNum: "",
      Burdate: item.TxnDate,
      Batchnum: item.VendorLotNumber,
      Number: item.Qty,
    };
  });
};

const lineOption = ref([
  {
    label: "line1",
    value: "line1",
  },
  {
    label: "line2",
    value: "line2",
  },
]);

const orderColumns = ref([
  { label: "生产计划号", width: "", prop: "MfgOrderName", fixed: true },
  { label: "产品编码", width: "", prop: "ProductName", fixed: true },
  // { label: "状态", width: "", prop: "OrderStatusDesc" },
  { label: "产品描述", width: "", prop: "ProductDesc" },
  { label: "产品机型", width: "", prop: "BD_ProductModel" },
  { label: "软件版本", width: "", prop: "BD_SoftVersion" },
  { label: "计划开始", width: "", prop: "PlannedStartDate" },
  { label: "计划完成", width: "", prop: "PlannedCompletionDate" },
]);

const orderTable = ref<InstanceType<typeof OrderData>>({
  data: [],
});
const defaultSelectVal = ref<string[]>([]);

const OrderForm = reactive<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  BD_ProductModel: "",
  BD_SoftVersion: "",
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
    width: "",
  },

  {
    label: "软件版本",
    value: "BD_SoftVersion",
    disabled: true,
    type: "textarea",
    width: "",
  },
  {
    label: "计划数量",
    value: "Qty",
    disabled: true,
    type: "input",
    width: "",
  },
]);

const tableData = ref([]);

watch(
  () => form.value.date,
  (newVal: any, oldVal: any) => {
    if (newVal === null) {
      form.value.StartTime = "";
      form.value.EndTime = "";
      onSubmit();
      return;
    }
    if (newVal !== oldVal) {
      form.value.StartTime = newVal[0];
      form.value.EndTime = newVal[1];
      onSubmit();
      // console.log( form.value);
    }
  }
);

const formText = (data: string) => {
  let key = data as keyof typeof OrderForm;
  return OrderForm[key];
};
const burnformText = (data: string) => {
  let key = data as keyof typeof feedForm;
  return feedForm.value[key];
};

const columnData = reactive([
  {
    text: true,
    prop: "Qty",
    label: "数量",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "FromContainerName",
    label: "原材料批次号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ContainerName",
    label: "半成品条码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MaterialCode",
    label: "产品编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MaterialDesc",
    label: "产品描述",
    // width: "600",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MfgOrderName",
    label: "生产计划号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "TxnDate",
    label: "烧录时间",
    width: "",
    min: true,
    align: "1",
  },
]); 

const burnPrint = () => {
  // console.log(BurnTableData.value);
  let data1=BurnTableData.value.map((b:any)=>{
    return {
      ...b,
      workStation:opui.station,
      userAccount: userStore.getUserInfo
    }
  })

  // console.log(data1);
  
  PrintBurnModel(data1).then((data: any) => {
    ElMessage({
      showClose: true,
      message: data.msg,
      type: "success",
    });
  });
  BurnTableRef.value.toggleSelection();
};

const feedTableData = ref([]); //上料需求清单
const feedRef = ref();
//打开物料上料
const RawmaterialFeeding = () => {
  // console.log(OrderForm.MfgOrderName);
  if (OrderForm.MfgOrderName === "") {
    ElMessage({
      message: `请选择生产计划号`,
      type: "warning",
    });
    return;
  }
  let data = cloneDeep(OrderForm);

  feedForm.value = { ...data };
  feedForm.value.type = data.BD_ProductModel;
  feedForm.value.eqInfo = opui.stationDec;
  feedVisible.value = true;
  nextTick(() => {
    inputRef.value.focus();
    getFocus();
  });
  // getFeedData()
};
const getFeedData = () => {
  QueryOrderMaterialRequired({
    MfgOrder: feedForm.value.MfgOrderName,
    Container: "",
    SpecName: "SMT-Burn",
    workstationName: opui.station,
    userAccount: userStore.getUserInfo,
  }).then((res: any) => {
    // console.log(OrganData(res.content));
    if (res.success) {
      let data = cloneDeep(OrganData(res.content));
      feedTableData.value = data;
      // OrganData(res.content)
    }
  });
};

const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 50,
  currentPage: 1,
});

const feedVisible = ref(false);

const feedForm = ref<InstanceType<typeof FeedForm>>({
  MfgOrderName: "",
  type: opui.station,
  ProductName: "",
  ProductDesc: "",
  Qty: "",
  eqInfo: opui.stationDec,
});

const FeedHeader = reactive([
  {
    label: "机台",
    prop: "eqInfo",
  },
  {
    label: "生产计划号",
    prop: "MfgOrderName",
  },

  {
    label: "产品机型",
    prop: "type",
  },
  {
    label: "产品编码",
    prop: "ProductName",
  },
  {
    label: "产品描述",
    prop: "ProductDesc",
  },
  {
    label: "计划数量",
    prop: "Qty",
  },
]);

//关闭物料上料
const feedCancel = () => {
  feedVisible.value = false;
  msgTitle.value=""
  msgType.value=false
};
const isLoding = ref("");
const msgTitle = ref("");
const msgType = ref(true);
const barCode = ref("");
const inputFocus = ref(true);
const inputRef = ref();

onBeforeMount(() => {
  getScreenHeight();
  let end: string = setTodayDate();
  let start: string = setLastDate();
  form.value.date = [start, end];
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getOrderData();
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
const getOrderData = () => {
  isLoding.value = "is-loading";
  defaultSelectVal.value = [];
  OrderQuery({ lineName: opui.line }).then(
    (res: any) => {
      // console.log(res);
      // let timer = setTimeout(() => {
      //   isLoding.value = "";
      //   clearTimeout(timer);
      // }, 2000);
      // if (res.content == null) {
      //   orderTable.value.data = [];
      //   return;
      // }
      // orderTable.value.data = res.content;
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

// const setDefaultDate = () => {
//   // 获取当前日期
//   const now = new Date();
//   // 格式化日期为YYYY-MM-DD
//   const formattedDate = `${now.getFullYear()}-${String(
//     now.getMonth() + 1
//   ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
//   return formattedDate;
// };

const radioChange = (args: any) => {
  // console.log(args);
  if (args[1] == null) {
    OrderForm.MfgOrderName = "";
    OrderForm.ProductName = "";
    OrderForm.ProductDesc = "";
    OrderForm.PlannedStartDate = "";
    OrderForm.BD_ProductModel = "";
    OrderForm.BD_SoftVersion = "";
    OrderForm.PlannedCompletionDate = "";
    OrderForm.ERPOrder = "";
    OrderForm.Qty = "";
  } else {
    orderTable.value.data.forEach((v: any) => {
      if (v.MfgOrderName == args[1]) {
        OrderForm.MfgOrderName = v.MfgOrderName;
        OrderForm.ProductName = v.ProductName;
        OrderForm.ProductDesc = v.ProductDesc;
        OrderForm.BD_ProductModel = v.BD_ProductModel;
        OrderForm.BD_SoftVersion = v.BD_SoftVersion;
        OrderForm.PlannedStartDate = v.PlannedStartDate;
        OrderForm.PlannedCompletionDate = v.PlannedCompletionDate;
        OrderForm.Qty = v.Qty;
        form.value.OrderNum = v.MfgOrderName;
        OrderForm.ERPOrder = v.ERPOrder;
      }
    });
    onSubmit();
  }

  //   inputRef.value.focus();
};
const onSubmit = () => {
  // console.log(form.value);
  QueryBurnPrintData(form.value).then((res: any) => {
    if (res.content == null || res.content.length == 0) {
      tableData.value = [];
      return;
    }

    tableData.value = res.content;
  });
};
const getChange = () => {
  let barCodeData = barCode.value;
  MESSaveBurnResult({
    PlanNo: feedForm.value.MfgOrderName,
    Barcode: barCodeData,
  }).then((res: any) => {
    msgTitle.value = res.msg;
    msgType.value = res.success;
    // ElNotification({
    //   title: "提示信息",
    //   message: res.msg,
    //   type: res.success ? "success" : "error",
    // });
    barCode.value = "";
    inputRef.value.focus();
    getFocus();
  });
};
const handleDialogOpen = () => {
  nextTick(() => {
    if (inputRef.value) {
      // el-input 组件的 $el 属性指向其根 DOM 元素，但我们需要内部的 input 元素
      inputRef.value.focus();
    }
  });
};

// const hasDuplicateValue = (array: any, propertyName: any) => {
//   // 创建一个新的Set，用于存储已经遍历过的属性值
//   const valuesSet = new Set();

//   // 使用reduce遍历数组
//   // 如果在遍历过程中发现某个属性值已经在valuesSet中存在，则返回true
//   // 否则，遍历完成后返回false
//   return array.reduce((hasDuplicate: any, item: any) => {
//     if (valuesSet.has(item[propertyName])) {
//       // 如果属性值已经存在于Set中，则存在重复
//       return true;
//     }
//     // 将当前属性值添加到Set中
//     valuesSet.add(item[propertyName]);
//     // 如果没有找到重复，继续遍历
//     return hasDuplicate;
//   }, false);
// };

const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 215;
  });
};
const OrganData = (organizations: any) => {
  const organizationMap = new Map();
  organizations.forEach((org: any) => {
    organizationMap.set(org.MaterialName, { ...org, children: [] });
  });
  organizations.forEach((org: any) => {
    if (org.originalMaterialName !== org.MaterialName) {
      const parentOrg = organizationMap.get(org.originalMaterialName);
      if (parentOrg) {
        parentOrg.children.push(organizationMap.get(org.MaterialName));
      }
    }
  });
  return Array.from(organizationMap.values()).filter(
    (org) => org.originalMaterialName == org.MaterialName
  );
};
</script>

<style lang="scss">
.saveAsDialog {
  min-width: 954px;
}
</style>
<style lang="scss" scoped>
.box {
  border: 2px solid #cbcbcb;

  .setwidth {
    flex: 0 0 320px;
    border-right: 2px solid #cbcbcb;
  }
}
</style>
