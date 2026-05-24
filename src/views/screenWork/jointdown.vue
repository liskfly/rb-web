<template>
  <div class="flex flex-col w-full h-full">
    <div
      class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center"
    >
      <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
      <el-button type="primary" @click="materialFeeding">物料上料</el-button>
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
              <el-form-item label="生产计划号">
                <!-- <selectTa
                  ref="selectTable"
                  :table="orderTable"
                  :columns="orderColumns"
                  :max-height="400"
                  :tableWidth="700"
                  :keywords="{ label: 'order', value: 'order' }"
                  @radioChange="(...args: any) => radioChange(args)"
                  ><</selectTa
                > -->
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
          <div>
            <div
              class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
            >
              <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-[120px] p-3">
              <el-form
                class="inbound"
                ref="formRef"
                :inline="true"
                :model="form"
                label-width="auto"
                @submit.native.prevent
              >
                <el-form-item label="扫描条码">
                  <el-input
                    ref="inputRef"
                    v-model="barCode"
                    style="width: 500px"
                    placeholder="请扫描条码"
                    @keyup.enter.native="keyUp"
                  />
                </el-form-item>
                <el-form-item
                  :class="[stopsForm.result == 'OK' ? 'switchok' : 'switchng']"
                >
                  <el-switch
                    v-model="stopsForm.result"
                    size="large"
                    style="
                      zoom: 1.2;
                      --el-switch-on-color: #ff4949;
                      --el-switch-off-color: #13ce66;
                    "
                    :active-value="'NG'"
                    :inactive-value="'OK'"
                    active-text="NG"
                    inactive-text="OK"
                  />
                </el-form-item>
              </el-form>
              <div
                class="text-xl font-bold text-[#00B400]"
                v-show="
                  msgTitle === '成功' ||
                  msgTitle === '' ||
                  msgTitle === '成功存入'
                "
              >
                {{ msgTitle === "" ? "请扫描批次条码" : msgTitle }}
              </div>
              <div
                class="text-xl font-bold text-[red]"
                v-show="
                  msgTitle !== '成功' &&
                  msgTitle !== '' &&
                  msgTitle !== '成功存入'
                "
              >
                {{ msgTitle === "" ? "请扫描批次条码" : msgTitle }}
              </div>
            </div>
          </div>
          <div class="flex flex-col flex-1 tabs-css">
            <el-tabs v-model="tabsValue" type="border-card" class="demo-tabs">
              <el-tab-pane label="历史过站记录" name="history" :stretch="true">
                <table-tem
                  :showIndex="true"
                  :tableData="tableData1"
                  :tableHeight="tableHeight"
                  :columnData="columnData1"
                  :pageObj="pageObj"
                  @handleSizeChange="handleSizeChange"
                  @handleCurrentChange="handleCurrentChange"
                ></table-tem>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="feedVisible"
      title="物料上料"
      width="90%"
      align-center
      class="saveAsDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <feedTemp
        ref="feedRef"
        :form="feedForm"
        :form-header="FeedHeader"
        :tableData="feedTableData"
        :specName="'SMT-Burn'"
        @updateList="getFeedData"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="feedCancel">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  QueryBurnPrintData,
  PrintBurnModel,
  OrderQuery,
  QueryOrderMaterialRequired,
} from "@/api/smtApi";
import { cloneDeep } from "lodash-es";
import tableTem from "@/components/tableTem/index.vue";
import selectTa from "@/components/selectTable/index.vue";
import badInfoTem from "@/components/badInfoTem/index.vue";
import feedTemp from "@/components/feedTemp/index.vue";
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
const appStore = useAppStoreWithOut();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const barCode = ref("");
const tabsValue = ref("history");
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
});
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
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

const workOrderList = [
  {
    order: "1213434",
    models: "3A4621-01C",
    productCode: "24010606000131",
    productDes: "0402封装贴片电容 100pF ±5% 50V MURATA GRM1555C1H101JA01D",
    orderNum: "100",
  },
];

const tableData1 = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});

const feedTableData=ref([])//上料需求清单
const feedRef=ref()
const feedVisible = ref(false);
const feedForm = ref({
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
//打开物料上料
const materialFeeding = () => {
  feedVisible.value = true;
};
//关闭物料上料
const feedCancel = () => {
  feedVisible.value = false;
};

const getFeedData=()=>{
  QueryOrderMaterialRequired({
    MfgOrder: feedForm.value.MfgOrderName,
    Container: "",
    SpecName: "SMT-Burn",
    workstationName: opui.station,
    userAccount: userStore.getUserInfo,
  }).then((res: any) => {
    // console.log(OrganData(res.content));
    if(res.success){
      let data=cloneDeep(OrganData(res.content))   
      feedTableData.value=data
      // OrganData(res.content)
    }
  });
}

const formText = (data: string) => {
  let key = data as keyof typeof form;
  return form[key];
};



const keyUp = () => {
  if (checkStringType(barCode.value) == "result") {
    console.log("result", barCode.value);
    stopsForm.value.result = barCode.value;
    barCode.value = "";
    msgTitle.value = "成功存入";
  } else if (checkStringType(barCode.value) == "pcb") {
    console.log("pcb", barCode.value);
    stopsForm.value.ContainerName = barCode.value;
    barCode.value = "";
    msgTitle.value = "成功存入";
  } else if (checkStringType(barCode.value) == "tool") {
    console.log("tool", barCode.value);
    msgTitle.value = "成功存入";
    // stopsForm.value.ToolName = val
    barCode.value = "";
  } else {
    msgTitle.value = "扫描条码有误";
    // console.log('扫描条码有误');
  }
  inputRef.value.select();
  inputRef.value.focus();
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
    tableHeight.value = window.innerHeight - 374;
  });
};

const workOrderChoice = (value: any) => {
  form.order = value.order;
  form.models = value.models;
  form.productCode = value.productCode;
  form.productDes = value.productDes;
  form.orderNum = value.orderNum;
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
    return Array.from(organizationMap.values()).filter(org => org.originalMaterialName ==org.MaterialName);
  }
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
