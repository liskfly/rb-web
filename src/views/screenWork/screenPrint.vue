<template>
  <div class="flex">
    <div class="w-[350px] border-solid border-r-2 border-[#cbcbcb]">
      <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
        <span class="ml-5">基本信息</span>
      </div>
      <div class="p-2">
        <el-form
          class="inbound"
          size="default"
          ref="formRef"
          :model="OrderForm"
          label-width="auto"
        >
          <el-form-item label="生产计划号">
            <div class="flex items-center">
              <selectTa
                ref="selectTable"
                :table="orderTable"
                :columns="orderColumns"
                :selectWidth="170"
                :max-height="400"
                :tableWidth="700"
                :keywords="{ label: 'MfgOrderName', value: 'MfgOrderName' }"
                @radioChange="(...args: any) => radioChange(args)"
              >
              </selectTa>
              <el-tooltip content="刷新" placement="top">
                <el-icon
                  class="ml-3"
                  color="#777777"
                  :class="isLoding"
                  size="24"
                  @click="getOrderData"
                  ><RefreshRight
                /></el-icon>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item v-for="f in formHeader" :key="f.value" :label="f.label">
            <span
              class="font-bold text-base leading-[30px]"
              :class="f.value == 'passNum' ? 'text-[#00B400]' : ''"
            >
              {{ formText(f.value) }}</span
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="w-[calc(100%-350px)] pt-[5px]">
      <div>
        <div class="ml-2">
          <el-form
            ref="formRef"
            :inline="true"
            size="default"
            :model="form"
            label-width="auto"
          >
            <el-form-item label="创建时间" prop="startTime" class="mb-2">
              <el-date-picker
              :shortcuts="shortcuts"
                v-model="form.date"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                format="YYYY-MM-DD"
                :clearable="false"
                value-format="YYYY-MM-DD"
                end-placeholder="结束时间"
              />
            </el-form-item>
            <!-- <el-form-item label="产线" prop="line">
              <el-select
                v-model="form.line"
                placeholder="请选择"
                style="width: 150px"
              >
                <el-option
                  v-for="l in lineOption"
                  :key="l.value"
                  :label="l.label"
                  :value="l.value"
                />
              </el-select>
            </el-form-item> -->
            <el-form-item label="生产计划号" prop="workOrder" class="mb-2"
              ><el-input
                v-model="form.OrderNum"
                style="width: 180px"
                placeholder="请输入生产计划号"
                clearable
            /></el-form-item>
            <el-form-item label="条码" prop="barCode" class="mb-2"
              ><el-input
                style="width: 180px"
                clearable
                v-model="form.barCode"
                placeholder="请输入条码"
            /></el-form-item>
            <!-- <el-form-item class="mb-2">
              
            </el-form-item> -->
          </el-form>
        </div>
        <div class="mb-2 ml-2">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button
            icon="Printer"
            type="primary"
            @click="burnPrint"
            :disabled="BurnTableData.length == 0"
            >打印</el-button
          >

          <el-button
            :disabled="OrderForm.MfgOrderName == ''"
            type="warning"
            @click="RawmaterialFeeding"
            >物料上料</el-button
          >
        </div>
        <tableTem
          ref="BurnTableRef"
          :showIndex="true"
          :size="'small'"
          :tableData="tableData"
          :tableHeight="tableHeight"
          :columnData="columnData"
          :pageObj="pageObj"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          showSelect="ture"
          @handleSelectionChange="getChoice"
        >
        </tableTem>
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
import { ElMessage } from "element-plus";
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import type { Formspan, FormHeader, OrderData, BurnForm } from "@/typing";
import selectTa from "@/components/selectTable/index.vue";
import tableTem from "@/components/tableTem/index.vue";
import feedTemp from "@/components/feedTemp/index.vue";
import { cloneDeep } from "lodash-es";
import { useUserStoreWithOut } from "@/stores/modules/user";
  import {shortcuts} from "@/utils/dataMenu";
const userStore = useUserStoreWithOut();
const form = ref<InstanceType<typeof BurnForm>>({
  date: [],
  SpecName: "SMT-Burn",
  barCode: "",
  OrderNum: "",
});
import { useAppStore } from "@/stores/modules/app";
import {
  QueryBurnPrintData,
  PrintBurnModel,
  OrderQuery,
  QueryOrderMaterialRequired,
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
      Burdate: "",
      Batchnum: "",
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
  { label: "状态", width: "", prop: "OrderStatusDesc" },
  { label: "产品描述", width: "", prop: "ProductDesc" },
  { label: "产品机型", width: "", prop: "BD_ProductModel" },
  { label: "软件版本", width: "", prop: "BD_SoftVersion" },
  { label: "计划开始", width: "", prop: "PlannedStartDate" },
  { label: "计划完成", width: "", prop: "PlannedCompletionDate" },
]);

const orderTable = ref<InstanceType<typeof OrderData>>({
  data: [],
});

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
    label: "产品机型",
    value: "BD_ProductModel",
    disabled: true,
    type: "input",
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
    label: "计划开始",
    value: "PlannedStartDate",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "计划完成",
    value: "PlannedCompletionDate",
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
]);

const tableData = ref([]);

const formText = (data: string) => {
  let key = data as keyof typeof OrderForm;
  return OrderForm[key];
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
    label: "原材料码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ContainerName",
    label: "半成品码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MaterialCode",
    label: "物料编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MaterialDesc",
    label: "物料描述",
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
    label: "创建时间",
    width: "",
    min: true,
    align: "1",
  },
]);

const burnPrint = () => {
  // if (!hasDuplicateValue(BurnTableData.value,'OrderNum')) {
  //   ElMessage({
  //     showClose: true,
  //     message: '不可选重复生产计划号打印',
  //     type: "warning",
  //   });
  //   return;
  // }
  PrintBurnModel(BurnTableData.value).then((data: any) => {
    ElMessage({
      showClose: true,
      message: data.msg,
      type: "success",
    });
  });
  BurnTableRef.value.toggleSelection();
};

const feedTableData=ref([])//上料需求清单
const feedRef=ref()
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
  feedForm.value.type = opui.station;
  feedForm.value.eqInfo = opui.stationDec;
  feedVisible.value = true;
  // nextTick(()=>{
  //  feedRef.value.getFocus()
  // })
  getFeedData()
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

const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 50,
  currentPage: 1,
});

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

//关闭物料上料
const feedCancel = () => {
  feedVisible.value = false;
};
const isLoding = ref("");

onBeforeMount(() => {
  getScreenHeight();
  let date: string = setDefaultDate();
  form.value.date = [date, date];
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getOrderData();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getOrderData = () => {
  isLoding.value = "is-loading";
  OrderQuery('1111').then((res: any) => {
    // console.log(res);
    let timer = setTimeout(() => {
      isLoding.value = "";
      clearTimeout(timer);
    }, 2000);
    if (res.content == null) {
      orderTable.value.data = [];
      return;
    }
    orderTable.value.data = res.content;
  });
};

const setDefaultDate = () => {
  // 获取当前日期
  const now = new Date();
  // 格式化日期为YYYY-MM-DD
  const formattedDate = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return formattedDate;
};

const radioChange = (args: any) => {
  // console.log(args[1]);
  if (args[1] == null) {
    OrderForm.MfgOrderName = "";
    OrderForm.ProductName = "";
    OrderForm.ProductDesc = "";
    OrderForm.PlannedStartDate = "";
    OrderForm.BD_ProductModel = "";
    OrderForm.BD_SoftVersion = "";
    OrderForm.PlannedCompletionDate = "";
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
        form.value.OrderNum=v.MfgOrderName
        onSubmit()
      }
    });
  }

  //   inputRef.value.focus();
};
const onSubmit = () => {
  // console.log(form.value);
  QueryBurnPrintData({
    SpecName: form.value.SpecName,
    StartTime: form.value.date[0] ? form.value.date[0] : "",
    EndTime: form.value.date[1] ? form.value.date[1] : "",
    OrderNum: form.value.OrderNum,
    BarCode: form.value.barCode,
  }).then((res: any) => {
    if (res.content == null || res.content.length == 0) {
      tableData.value = [];
      return;
    }
    // const dataText = JSON.parse(data.content);
    tableData.value = res.content;
    // form.value = {
    //   // date: [],
    //   SpecName: "SMT-Laser",
    //   barCode: "",
    //   OrderNum: "",
    // };
  });
};

const hasDuplicateValue = (array: any, propertyName: any) => {
  // 创建一个新的Set，用于存储已经遍历过的属性值
  const valuesSet = new Set();

  // 使用reduce遍历数组
  // 如果在遍历过程中发现某个属性值已经在valuesSet中存在，则返回true
  // 否则，遍历完成后返回false
  return array.reduce((hasDuplicate: any, item: any) => {
    if (valuesSet.has(item[propertyName])) {
      // 如果属性值已经存在于Set中，则存在重复
      return true;
    }
    // 将当前属性值添加到Set中
    valuesSet.add(item[propertyName]);
    // 如果没有找到重复，继续遍历
    return hasDuplicate;
  }, false);
};

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
    return Array.from(organizationMap.values()).filter(org => org.originalMaterialName ==org.MaterialName);
  }
</script>

<style lang="scss">
.saveAsDialog {
  min-width: 954px;
}
</style>
