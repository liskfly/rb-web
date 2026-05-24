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
            />
          </el-form-item>
          <el-form-item label="计划单号" class="mb-2">
            <el-input
              style="width: 130px"
              v-model="getForm.MfgOrderName"
              placeholder=""
              clearable
              @change="changeForm"
            ></el-input>
          </el-form-item>
          <el-form-item label="产品编码" class="mb-2">
            <el-input
              style="width: 130px"
              v-model="getForm.ProductName"
              placeholder=""
              clearable
              @change="changeForm"
            ></el-input>
          </el-form-item>
          <el-form-item label="MES条码" class="mb-2">
            <el-input
              style="width: 130px"
              v-model="getForm.ContainerName"
              placeholder=""
              clearable
              @change="changeForm"
            ></el-input>
          </el-form-item>
          <el-form-item label="产线" class="mb-2">
            <el-select
              v-model="getForm.Line"
              placeholder=""
              style="width: 130px"
              clearable
            >
              <el-option
                v-for="p in lineList"
                :label="p.Description"
                :value="p.MfgLineName"
                :key="p.MfgLineName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="工序" class="mb-2">
            <el-select
              v-model="getForm.SpecName"
              placeholder=""
              style="width: 130px"
              clearable
            >
              <el-option
                v-for="p in specnList"
                :label="p.Description"
                :value="p.SpecName"
                :key="p.SpecName"
              />
            </el-select>
          </el-form-item>

          <el-form-item class="mb-2">
            <el-button type="primary" @click="changeForm()">查询</el-button>
            <el-button type="warning" disabled>导出</el-button>
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
        :page-size="getForm.pageSize"
        :current-page="getForm.currentPage"
        :total="total1"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        @rowClick="rowClick"
      >
      </table-tem>
      <table-temp
        :show-index="true"
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
  QuertAllMfgLineInfo,
  QuertAllSpecNameInfo,
  InsequenceRetraceFirstInfo,
  InsequenceRetraceTwoInfo,
} from "@/api/report";
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
  MfgOrderName: "",
  ProductName: "",
  ContainerName: "",
  SpecName: "",
  Line: "",
  MaterialName: "",
  StartTime: "",
  EndTime: "",
  pageSize: 100,
  currentPage: 1,
});
const searchDate = ref<any[]>([]);
const lineList = ref<any[]>([]);
const specnList = ref<any[]>([]);
const headerRef = ref();
const tableHeight = ref(0);
const detailHeight = ref(0);
const tableData = ref<any>([]);
const total1 = ref(0);
const columnData = reactive([
  {
    text: true,
    prop: "ContainerName",
    label: "MES条码",
    width: "",
    min: true,
    align: "1",
  },

  {
    text: true,
    prop: "MfgOrderName",
    label: "计划单号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ProductModel",
    label: "机型",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "productName",
    label: "物料编码",
    width: "",
    min: true,
    align: "1",
  },

  {
    text: true,
    prop: "Description",
    label: "物料描述",
    width: "250",
    // min: true,
    align: "1",
  },

  {
    text: true,
    prop: "PlannedStartDate",
    label: "生产时间",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "WorkflowName",
    label: "工艺流程",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MfgLineDes",
    label: "产线",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "SpecDesc",
    label: "工序",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "tuid",
    label: "TUID号",
    width: "",
    min: true,
    align: "1",
  },
]);
const getDetailForm = ref({
  ContainerName: "",
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
    prop: "ContainerName",
    label: "原材料批号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ContainerName2",
    label: "原材料唯一码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MaterialDesc",
    label: "原材料描述",
    width: "300",
    // min: true,
    align: "1",
  },
  {
    text: true,
    prop: "BD_EmployeeName",
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
      getForm.value.currentPage = 1;
      detailData.value = [];

      getData();
      return;
    }
    if (newVal !== oldVal) {
      getForm.value.StartTime = newVal[0];
      getForm.value.EndTime = newVal[1];
      getForm.value.currentPage = 1;
      detailData.value = [];

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
  getLine();
  getSpecn();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getLine = () => {
  QuertAllMfgLineInfo().then((res: any) => {
    lineList.value = res.content;
  });
};
const getSpecn = () => {
  QuertAllSpecNameInfo().then((res: any) => {
    specnList.value = res.content;
  });
};
const changeForm = () => {
  getForm.value.currentPage = 1;
  detailData.value = [];

  getData();
};

const getData = () => {
  InsequenceRetraceFirstInfo(getForm.value).then((res: any) => {
    if (res.content.length !== 0) {
      total1.value = res.content[0].TotalCount;
    } else {
      total1.value = 0;
    }
    tableData.value = res.content;
  });
};
const rowClick = (val: any) => {
  getDetailForm.value.ContainerName = val.ContainerName;
  InsequenceRetraceTwoInfo(getDetailForm.value).then((res: any) => {
    if (res.content.length !== 0) {
      total2.value = res.content[0].TotalCount;
    } else {
      total2.value = 0;
    }
    detailData.value = res.content;
  });
};
const handleSizeChange = (val: any) => {
  getForm.value.currentPage = 1;
  getForm.value.pageSize = val;
  getData();
};
const handleCurrentChange = (val: any) => {
  getForm.value.currentPage = val;
  getData();
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = (window.innerHeight - 220) * 0.6;
    detailHeight.value = (window.innerHeight - 220) * 0.4;
  });
};
</script>

<style scoped></style>
