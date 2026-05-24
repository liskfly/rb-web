<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }">
      <div ref="headerRef">
        <el-form ref="formRef" :inline="true" size="small">
          <el-form-item label="时间" class="mb-2">
            <el-date-picker
              :shortcuts="shortcuts"
              v-model="searchDate"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              size="small"
              style="width: 200px"
              :disabled-date="disabledDate"
              :clearable="false"
              @change="changeForm"
            />
          </el-form-item>
          <el-form-item label="生产计划号" class="mb-2">
            <el-input
              style="width: 130px"
              v-model="getForm.MfgOrderName"
              placeholder=""
              clearable
              @keyup.enter.native="changeForm"
              @clear="changeForm"
            ></el-input>
          </el-form-item>
          <el-form-item label="拼板号" class="mb-2">
            <el-input
              style="width: 130px"
              v-model="getForm.PanelID"
              placeholder=""
              clearable
              @keyup.enter.native="changeForm"
               @clear="changeForm"
            ></el-input>
          </el-form-item>
          <el-form-item label="PCB条码" class="mb-2">
            <el-input
              style="width: 130px"
              v-model="getForm.SN"
              placeholder=""
              clearable
 @clear="changeForm"
              @keyup.enter.native="changeForm"
            ></el-input>
          </el-form-item>
          <el-form-item label="物料条码" class="mb-2">
            <el-input
              style="width: 130px"
              v-model="getForm.MaterialBatchNo"
              placeholder=""
              clearable
               @clear="changeForm"
              @keyup.enter.native="changeForm"
            ></el-input>
          </el-form-item>
          <el-form-item label="物料批次号" class="mb-2">
            <el-input
              style="width: 130px"
              v-model="getForm.VendorLotNumber"
              placeholder=""
              clearable
               @clear="changeForm"
              @keyup.enter.native="changeForm"
            ></el-input>
          </el-form-item>

          <el-form-item class="mb-2">
            <el-button type="primary" @click="changeForm"
              >查询</el-button
            >
          </el-form-item>
          <!-- <el-form-item  class="mb-2">
                       
                    </el-form-item> -->
        </el-form>
      </div>
      <table-tem
      :show-index="true"
        size="small"
        :tableData="tableData"
        :tableHeight="tableHeight"
        :columnData="columnData"
        :page-size="getForm.PageSize"
        :current-page="getForm.PageNumber"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :total="total1"
      >
      </table-tem>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { OrderSNQuery } from "@/api/report";
import {
  ref,
  reactive,
  watch,
  computed,
  nextTick,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import tableTem from "@/components/tableTem/noAuto.vue";
import tableTemp from "@/components/tableTemp/index.vue";
import {
  shortcuts,
  setTodayDate,
  setLastDate,
  disabledDate,
} from "@/utils/dataMenu";
const getForm = ref({
  StartTime: "",
  EndTime: "",
  MfgOrderName: "",
  PanelID: "",
  SN: "",
  MaterialBatchNo: "",
  VendorLotNumber: "",
  PageNumber: 1,
  PageSize: 100,
});
const searchDate = ref<any[]>([]);
const lineList = ref<any[]>([]);
const specnList = ref<any[]>([]);
const headerRef = ref();
const tableHeight = ref(0);
const detailHeight = ref(0);
const tableData = ref<any>([]);
const total1 = ref(0);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});
const columnData = reactive([
  {
    text: true,
    prop: "ERPOrder",
    label: "工单号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ResourceNo",
    label: "设备编码",
    width: "",
    min: true,
    align: "1",
  },
  // {
  //   text: true,
  //   prop: "ProductModel",
  //   label: "机型",
  //   width: "",
  //   min: true,
  //   align: "cemterm",
  // },
  {
    text: true,
    prop: "PanelID",
    label: "拼板号",
    width: "",
    min: true,
    align: "centent",
  },
  {
    text: true,
    prop: "SN",
    label: "PCB条码",
    width: "",
    min: true,
    align: "cemterm",
  },
  {
    text: true,
    prop: "LastResponseDate",
    label: "镭雕时间",
    width: "",
    min: true,
    align: "centent",
  },
  {
    text: true,
    prop: "MaterialBatchNo",
    label: "物料条码",
    width: "",
    min: true,
    align: "centent",
  },
  {
    text: true,
    prop: "VendorLotNumber",
    label: "物料批次号",
    width: "",
    min: true,
    align: "centent",
  },
]);
const getDetailForm = ref({
  ContainerName: "",
  pageSize: 100,
  currentPage: 1,
});
const total2 = ref(0);
const detailData = ref([]);
const detailColumn = reactive([
  {
    text: true,
    prop: "SpecName",
    label: "工序",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "TxnDate",
    label: "生产时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MfgLinedesc",
    label: "产线",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MaterialName",
    label: "原材料编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "原材料批号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "原材料唯一码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MaterialDesc",
    label: "原材料描述",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "操作人",
    width: "",
    min: true,
    align: "1",
  },
]);

watch(
  () => searchDate.value,
  (newVal: any, oldVal: any) => {
    if (newVal === null) {
      getForm.value.StartTime = "";
      getForm.value.EndTime = "";
      pageObj.value.currentPage = 1;
      detailData.value = [];
      getDetailForm.value.currentPage = 1;
      getData();
      return;
    }
    if (newVal !== oldVal) {
      getForm.value.StartTime = newVal[0];
      getForm.value.EndTime = newVal[1];
      pageObj.value.currentPage = 1;
      detailData.value = [];
      getDetailForm.value.currentPage = 1;
      getData();
    }
  }
);
onBeforeMount(() => {
  getScreenHeight();
  let end: string = setTodayDate();
  let start: string = setLastDate();
  searchDate.value = [start, end];
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  //   getData();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});
const changeForm = () => {
  pageObj.value.currentPage = 1;
  detailData.value = [];
  getDetailForm.value.currentPage = 1;
  getData();
};

const getData = () => {
  OrderSNQuery(getForm.value).then((res: any) => {
    if (res.success) {
      if(res.content==null){
        total1.value=0
        tableData.value=[]
        return
      }
      total1.value = res.total;
      tableData.value = res.content;
    }
  });
};
const handleSizeChange = (val: any) => {
  getForm.value.PageNumber = 1;
  getForm.value.PageSize = val;
    getData();
};
const handleCurrentChange = (val: any) => {
  getForm.value.PageNumber = val;
    getData();
};
const handleSizeChange1 = (val: any) => {
  getDetailForm.value.currentPage = 1;
  getDetailForm.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
  getDetailForm.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 220;
  });
};
</script>

<style scoped></style>
