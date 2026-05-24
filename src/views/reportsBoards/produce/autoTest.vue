<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
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
              clearable
            />
          </el-form-item>
          <el-form-item label="计划单号" class="mb-2">
            <el-input
              style="width: 150px"
              v-model="getForm.order"
              placeholder=""
              clearable
              @change="getData"
            ></el-input>
          </el-form-item>
          <el-form-item label="MES条码" class="mb-2">
            <el-input
              style="width: 150px"
              v-model="getForm.pcb"
              placeholder=""
              clearable
              @change="getData"
            ></el-input>
          </el-form-item>
          <el-form-item label="TUID号" class="mb-2">
            <el-input
              style="width: 150px"
              v-model="getForm.TUID"
              placeholder=""
              clearable
              @change="getData"
            ></el-input>
          </el-form-item>
          <el-form-item label="" class="mb-2">
            <el-button type="primary" @click="getData()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <table-tem
        :show-index="true"
        size="small"
        :tableData="tableData"
        :tableHeight="tableHeight"
        :columnData="columnData"
        :pageObj="pageObj"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        @rowClick="rowClick"
      >
      </table-tem>
      <table-temp
        size="small"
        :tableData="detailData"
        :tableHeight="detailHeight"
        :columnData="detailColumn"
      >
      </table-temp>
    </el-card>
  </div>
</template>

<script setup lang="ts">
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
import tableTem from "@/components/tableTem/index.vue";
import tableTemp from "@/components/tableTemp/index.vue";
import { shortcuts, setTodayDate, setLastDate } from "@/utils/dataMenu";
import { getAutoTestData, GetAutoTestDetailsData } from "@/api/report";
const getForm = ref({
  order: "",
  PlanStartTime: "",
  PlanEndTime: "",
  TUID: "",
  pcb: "",
});
const choiceRow = ref("");
const searchDate = ref<any[]>([]);
const headerRef = ref();
const tableHeight = ref(0);
const detailHeight = ref(0);
const tableData = ref<any>([]);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});
const columnData = reactive([
  {
    text: true,
    prop: "time",
    label: "生产时间",
    width: "",
    min: true,
    align: "1",
  },

  {
    text: true,
    prop: "mfgorderName",
    label: "计划单号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ProductName",
    label: "产品编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "BD_ProductModel",
    label: "机型",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "factory",
    label: "车间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MfgLineName",
    label: "产线",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MESWorkStation",
    label: "测试工位",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Barcode",
    label: "MES条码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Tuid",
    label: "TUID号",
    width: "",
    min: true,
    align: "1",
  },
]);
const detailData = ref([]);
const detailColumn = reactive([
  {
    text: true,
    prop: "SNDetail",
    label: "序号",
    width: "50",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Project",
    label: "项目",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "LowerLimitValue",
    label: "下限值",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "UpperLimitValue",
    label: "上限值",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "TestValue",
    label: "测试值",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Unit",
    label: "单位",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "IsPass",
    label: "结果",
    width: "",
    min: true,
    align: "1",
  },
]);

watch(
  () => searchDate.value,
  (newVal: any, oldVal: any) => {
    if (newVal === null) {
      getForm.value.PlanStartTime = "";
      getForm.value.PlanEndTime = "";
      getData();
      return;
    }
    if (newVal !== oldVal) {
      getForm.value.PlanStartTime = newVal[0];
      getForm.value.PlanEndTime = newVal[1];
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

const getData = () => {
  getAutoTestData(getForm.value).then((res: any) => {
    if (res.success && res.content !== null) {
      tableData.value = res.content;
      detailData.value = [];
    } else {
      tableData.value = [];
      detailData.value = [];
    }
  });
};

const rowClick = (row: any) => {
  if (choiceRow.value === row.headId) {
    return;
  };
  choiceRow.value = row.headId;
  GetAutoTestDetailsData(row.headId).then((res: any) => {
    if (res && res.success && res.content !== null) {
      detailData.value = res.content;
    }
  });
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
    tableHeight.value = (window.innerHeight - 195) * 0.6;
    detailHeight.value = (window.innerHeight - 195) * 0.4;
  });
};
</script>

<style scoped></style>
