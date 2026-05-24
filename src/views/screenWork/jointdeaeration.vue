<template>
  <div class="flex flex-col w-full h-full">
    <div
      class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center"
    >
      <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
      <el-button type="primary" @click="openDialog">不良品登记</el-button>
    </div>
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[320px]">
        <div class="w-full h-full box">
          <div
            class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
          >
            <span class="ml-5">基本信息</span>
          </div>
          <div class="p-[10px]">
            <el-form
              class="inbound"
              ref="formRef"
              :model="form"
              label-width="auto"
            >
              <el-form-item size="large" label="生产计划号">
                <selectTa
                  ref="selectTable"
                  :table="orderTable"
                  :columns="orderColumns"
                  :max-height="400"
                  :tableWidth="1000"
                  :keywords="{ label: 'order', value: 'order' }"
                  @radioChange="(...args: any) => radioChange(args)"
                  ><</selectTa
                >
              </el-form-item>
              <el-form-item
                size="large"
                v-for="f in formHeader"
                :key="f.value"
                :label="f.label"
              >
                <span
                  class="font-bold text-[18px] leading-[30px]"
                  :class="f.value == 'passNum' ? 'text-[#00B400]' : ''"
                >
                  {{ formText(f.value) }}</span
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-320px)]">
        <div class="w-full h-full flex flex-col">
          <div class="flex flex-col flex-1 tabs-css">
            <div class="flex flex-col flex-1">
              <div
                class="h-[35px] flex items-center text-xl justify-between text-[#fff] bg-[#006487]"
              >
                <span class="ml-5"> 历史过站记录</span>
              </div>
              <div class="h-full">
                <table-tem
                  :showIndex="true"
                  :tableData="tableData1"
                  :tableHeight="tableHeight"
                  :columnData="columnData1"
                  :pageObj="pageObj"
                  @handleSizeChange="handleSizeChange"
                  @handleCurrentChange="handleCurrentChange"
                ></table-tem>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <badInfoTem
      :visible="editVisible"
      :list="list"
      :formHeader="formHeader1"
      :form="form"
      :badForm="badForm"
      :tableData="BadtableData"
      @cancel="editCancel"
      @submit="editSubmit"
      @deleteBad="deleteBad"
      @addBadData="addBadData"
      @openAddBad="openAddBad"
    />
  </div>
</template>

<script lang="ts" setup>
import tableTem from "@/components/tableTem/index.vue";
import badInfoTem from "@/components/badInfoTem/index.vue";
import selectTa from "@/components/selectTable/index.vue";
import { checkStringType } from "@/utils/barcodeFormat";
import { useAppStoreWithOut } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import type { Formspan, FormHeader } from "@/typing";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
const appStore = useAppStoreWithOut();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const barCode = ref("");
const tabsValue = ref("history");
const editVisible = ref(false);
const badVisible = ref(false);
const inputRef = ref();
const msgTitle = ref("");
const stopsForm = ref({
  ContainerName: "", //PCB
  result: "OK", //工装治具
  WorkStationName: opui.station, //工位
  ResourceName: opui.station !== null ? opui.station : "", //设备
  EmployeeName: userStore.getUserInfo, //用户
});
const form = reactive<InstanceType<typeof Formspan>>({
  order: "",
  models: "",
  productCode: "",
  productDes: "",
  orderNum: "",
  // passNum: '83'
});
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
  // {
  //   label: "生产计划号",
  //   value: "order",
  //   disabled: true,
  //   type: "input",
  //   width: "",
  // },
  {
    label: "产品机型",
    value: "models",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品编码",
    value: "productCode",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品描述",
    value: "productDes",
    disabled: true,
    type: "textarea",
    width: 300,
  },
  {
    label: "计划数量",
    value: "orderNum",
    disabled: true,
    type: "input",
    width: "",
  },
  // {
  //     label: '过站数量',
  //     value: 'passNum',
  //     disabled: true,
  //     type: 'input',
  //     width: ''
  // },
]);
const formHeader1 = reactive<InstanceType<typeof FormHeader>[]>([
  {
    label: "生产计划号",
    value: "order",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品机型",
    value: "models",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品编码",
    value: "productCode",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品描述",
    value: "productDes",
    disabled: true,
    type: "textarea",
    width: 300,
  },
  {
    label: "计划数量",
    value: "orderNum",
    disabled: true,
    type: "input",
    width: "",
  },
]);
const columnData1 = reactive([
  {
    text: true,
    prop: "eqty",
    label: "MES屏条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "eqName",
    label: "CG/TP条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "zcnumber",
    label: "LCM条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "level",
    label: "扫描时间",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "level",
    label: "扫描人",
    width: "",
    align: "1",
  },
]);

interface orderArr {
  order: string;
  models: string;
  productCode: string;
  productDes: string;
  orderNum: string;
}

interface OrderData {
  data: Array<orderArr>;
}

const orderTable = ref<OrderData>({
  data: [
    {
      order: "1213434",
      models: "3A4621-01C",
      productCode: "24010606000131",
      productDes: "0402封装贴片电容 100pF ±5% 50V MURATA GRM1555C1H101JA01D",
      orderNum: "100",
    },
  ],
});

const orderColumns = ref([
  { label: "生产计划号", width: "", prop: "order" },
  { label: "产品机型", width: "", prop: "models" },
  { label: "产品编码", width: "", prop: "productCode" },
  { label: "产品描述", width: "", prop: "productDes" },
  { label: "生产计划号描述", width: "", prop: "orderNum" },
]);

const radioChange = (args: any) => {
  // console.log(args);
  orderTable.value.data.forEach((v: any) => {
    if (v.order == args[1]) {
      form.order = v.order;
      form.models = v.models;
      form.productCode = v.productCode;
      form.productDes = v.productDes;
      form.orderNum = v.orderNum;
    }
  });
  inputRef.value.focus();
};

const tableData1 = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});
const badForm = ref({
  badCode: "",
  badCodeDec: "",
  backProcess: "",
  remark: "",
});
//不良信息table
const BadtableData = ref([
  {
    badCode: "E208711",
    badCodeDec: "切料刀缺口",
    backProcess: "总成外观",
    remark: "Test",
  },
  {
    badCode: "E208711",
    badCodeDec: "切料刀缺口",
    backProcess: "总成外观",
    remark: "测试",
  },
]);
const list = ref([
  {
    key: "切料刀缺口",
    value: "E208711",
  },
  {
    key: "划痕",
    value: "E208715",
  },
]);

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  // console.log(appStore.getOpuiData.stationDec);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const formText = (data: string) => {
  let key = data as keyof typeof form;
  return form[key];
};

const keyUp = () => {
  // if (barCode.value === "1213434") {
  //   msgTitle.value = "成功";
  //   barCode.value = "";
  //   form.order = "1213434";
  //   form.models = "3A4621-01C";
  //   form.productCode = "24010606000131";
  //   form.productDes =
  //     "0402封装贴片电容 100pF ±5% 50V MURATA GRM1555C1H101JA01D";
  //   form.orderNum = "100";
  //   return;
  // }

  // if (checkStringType(barCode.value) == "result") {
  //   console.log("result", barCode.value);
  //   stopsForm.value.result = barCode.value;
  //   barCode.value = "";
  // } else if (checkStringType(barCode.value) == "pcb") {
  //   console.log("pcb", barCode.value);
  //   stopsForm.value.ContainerName = barCode.value;
  //   barCode.value = "";
  // } else if (checkStringType(barCode.value) == "tool") {
  //   console.log("tool", barCode.value);
  //   // stopsForm.value.ToolName = val
  //   barCode.value = "";
  // } else {
  //   msgTitle.value = "扫描条码有误";
  //   // console.log('扫描条码有误');
  // }
  // inputRef.value.select();
  // inputRef.value.focus();
  // if (stopsForm.value.ContainerName && stopsForm.value.result) {
  //     console.log(stopsForm.value)
  // }
  if (barCode.value !== "1213434") {
    inputRef.value.select();
    msgTitle.value = "未搜索到此生产计划号";
    return;
  } else {
    msgTitle.value = "成功";
    barCode.value = "";
  }
  form.order = "1213434";
  form.models = "3A4621-01C";
  form.productCode = "24010606000131";
  form.productDes = "0402封装贴片电容 100pF ±5% 50V MURATA GRM1555C1H101JA01D";
  form.orderNum = "100";
};

//打开不良登记
const openDialog = () => {
  editVisible.value = true;
};

//关闭不良登记
const editCancel = () => {
  // BadtableData.value = [];
  // console.log(BadtableData.value);
  editVisible.value = false;
};
//提交不良信息
const editSubmit = () => {
  console.log(BadtableData.value);
  editVisible.value = false;
};
//删除不良信息
const deleteBad = (data: any) => {
  // BadtableData.value = BadtableData.value.filter((v: any) => {
  //   return data[0].badCode != v.badCode;
  // });
};
//打开不良登记
const openAddBad = () => {
  badVisible.value = true;
};
//增加不良信息
const addBadData = (data: any) => {
  BadtableData.value.push(data);
  // console.log(data);
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
    tableHeight.value = window.innerHeight - 219;
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

.tabs-css .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  color: #fff;
  // padding: 0 !important;
}

.tabs-css .el-tabs__item.is-active {
  // color: #fff;
  color: #006487 !important;
  // font-weight: bold;
}

.tabs-css
  .el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  // color: #fff;
  background-color: #fff;
}

// .switchbox .el-switch__label--right{
//   color: #13ce66;
// }

// .switchbox .el-switch__label--left {
//   color: #ff4949;
// }
.switchok .el-switch__label.is-active {
  color: #13ce66;
}

.switchng .el-switch__label.is-active {
  color: #ff4949;
}
</style>
