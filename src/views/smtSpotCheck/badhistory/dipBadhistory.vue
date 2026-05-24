<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0px 8px' }">
      <el-form ref="getFormRef" :model="getForm" :inline="true">
        <el-form-item label="登记时间" prop="timePeriod" class="mb-2">
          <el-date-picker :shortcuts="shortcuts" v-model="getForm.timePeriod" value-format="YYYY-MM-DD" type="daterange"
            range-separator="-" style="width: 240px" :clearable="true" size="small" />
        </el-form-item>
        <el-form-item label="工序" prop="Spec" class="mb-2">
          <el-select v-model="getForm.Spec" placeholder="" style="width: 200px" clearable @clear="getTableData"
            size="small">
            <el-option v-for="s in specList" :key="s.SpecName" :label="s.Description" :value="s.SpecName" />
          </el-select>
        </el-form-item>
        <el-form-item label="PCB条码" prop="cause" class="mb-2">
          <el-input v-model="getForm.ContainerName" style="width: 200px" clearable @clear="getTableData" size="small" />
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button type="primary" @click="getTableData" size="small">查询</el-button>
        </el-form-item>
      </el-form>
      <table-tem size="small" :tableData="tableData" :show-index="true" :tableHeight="tableHeight"
        :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"></table-tem>
    </el-card>
    <el-dialog v-model="detailVisible" draggable width="70%" :title="'PCB条码：' + title" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" align-center>
      <div class="flex flex-col border-solid border-1 border-[#bdbdbd]">
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            基本信息
          </div>
          <el-form ref="baseFormRef" :model="detailForm" label-width="auto" class="pt-[5px]">
            <el-row>
              <el-col :span="7">
                <el-form-item label="生产计划号" class="mb-[5px] flex" prop="MfgOrderName">
                  <el-input v-model="detailForm.MfgOrderName" style="width: 150px" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item class="mb-[5px]" label="产品编码" prop="ProductName">
                  <el-input v-model="detailForm.ProductName" style="width: 150px" disabled /> </el-form-item></el-col>
              <el-col :span="10">
                <el-form-item class="mb-[5px]" label="产品描述">
                  <el-input v-model="detailForm.ProductDesc" style="width: 300px" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row> </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item class="mb-[5px]" label="工序编码" prop="SpecName">
                  <el-input v-model="detailForm.SpecName" style="width: 150px" disabled /> </el-form-item></el-col>
              <el-col :span="7">
                <el-form-item class="mb-[5px]" label="工序描述" prop="SpecDesc">
                  <el-input v-model="detailForm.SpecDesc" style="width: 150px" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            不良列表
          </div>
          <el-table :data="detailData" :style="{ width: '100%' }" size="small" :height="200"  stripe border fit>
            <el-table-column  label="序号" type="index" width="50" align="center" />
              <el-table-column prop="DefectCode" label="不良代码"  />
              <el-table-column prop="DefectDesc" label="不良原因" />
              <el-table-column prop="ref_name" label="不良点位" />
              
              <el-table-column  label="序号"  width="50" align="center">
                <template template #default="scope">
                 
                      {{scope.row.DefectCode1==null|| scope.row.DefectCode1=="" ?"":detailData.length+scope.$index+1}}
                </template>
              </el-table-column >
              <el-table-column prop="DefectCode1" label="不良代码" />
              <el-table-column prop="DefectDesc1" label="不良原因" />
              <el-table-column prop="ref_name1" label="不良点位" />
          </el-table>
          <!-- <tableTemp size="small" :showIndex="true" :tableData="detailData" :tableHeight="200"
            :columnData="detailColumn">
          </tableTemp> -->
        </div>
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            维修记录
          </div>
          <el-form ref="formRef" :model="repairForm" :inline="true" label-width="auto" class="mt-2">
            <el-form-item label="维修工序" prop="WorkFolwStep">
              <el-input v-model="repairForm.WorkFolwStep" style="width: 150px" disabled />
            </el-form-item>
            <el-form-item label="维修人" prop="repairBy">
              <el-input v-model="repairForm.repairBy" style="width: 150px" disabled />
            </el-form-item>
            <el-form-item label="维修时间" prop="repairTime">
              <el-input v-model="repairForm.repairTime" style="width: 200px" disabled />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { shortcuts, setTodayDate, setLastDate } from "@/utils/dataMenu";
import {
  ref,
  watch,
  nextTick,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
} from "vue";
import {
  QueryDefectCode,
  QueryDefectCodeDetail,
  QuerySpec,
} from "@/api/operate";
import tableTem from "@/components/tableTem/index.vue";
import tableTemp from "@/components/tableTemp/index.vue";

interface spec {
  SpecName: string;
  Description: string;
}

const getForm = ref({
  timePeriod: <any>[],
  ContainerName: "",
  StartTime: "",
  EndTime: "",
  Spec: "",
  Line: "DIP",
});
const tableData = ref([]);
const detailVisible = ref(false);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 50,
  currentPage: 1,
});
const specList = ref<spec[]>([]);
const detailData = ref([]);
const title = ref("");
const repairForm = ref({
  repairBy: "",
  repairTime: "",
  WorkFolwStep: "",
});
const handleEdit = (data: any) => {
  repairForm.value = { ...data };
  title.value = data.ContainerName;
  QueryDefectCodeDetail(data.ContainerName).then((res: any) => {
    // console.log(res.content);

    if (res.success) {
      detailVisible.value = true;
      detailForm.value.ContainerName = res.content.ContainerName;
      detailForm.value.ProductDesc = res.content.ProductDesc;
      detailForm.value.MfgOrderName = res.content.MfgOrderName;
      detailForm.value.ProductName = res.content.ProductName;
      detailForm.value.SpecDesc = res.content.SpecDesc;
      detailForm.value.SpecName = res.content.SpecName;
      detailData.value = res.content.defectCodeDetail;
    } else {
      detailData.value = [];
    }
  });
};
const columnData = ref([
  {
    text: true,
    prop: "ContainerName",
    label: "PCB条码",
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
    prop: "BD_EmployeeName",
    label: "登记人",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "TxnDate",
    label: "登记时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "repairStatus",
    label: "是否已维修",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "repairBy",
    label: "维修人",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "repairTime",
    label: "维修时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    isOperation: true,
    label: "不良明细",
    width: "80",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "明细",
        icon: "Document",
        buttonClick: handleEdit,
      },
    ],
  },
]);
const detailColumn = ref([
  {
    text: true,
    prop: "DefectCode",
    label: "不良代码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "DefectDesc",
    label: "不良原因",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ref_name",
    label: "不良点位",
    width: "",
    min: true,
    align: "1",
  },

  {
    text: true,
    prop: "DefectCode1",
    label: "不良代码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "DefectDesc1",
    label: "不良原因",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ref_name1",
    label: "不良点位",
    width: "",
    min: true,
    align: "1",
  },
]);
const detailPageObj = ref({
  pageSize: 30,
  currentPage: 1,
});
const detailForm = ref({
  ContainerName: "",
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  SpecName: "",
  SpecDesc: "",
});

watch(
  () => getForm.value.timePeriod,
  (newVal: any, oldVal: any) => {
    if (newVal === null) {
      getForm.value.StartTime = "";
      getForm.value.EndTime = "";
      getTableData();
      return [];
    }
    if (newVal !== oldVal) {
      getForm.value.StartTime = newVal[0];
      getForm.value.EndTime = newVal[1];
      getTableData();
    }
  },
  { deep: true }
);

onBeforeMount(() => {
  getScreenHeight();
  let end: string = setTodayDate();
  let start: string = setLastDate();
  getForm.value.timePeriod = [start, end];
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getSpec();
  // getTableData();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getSpec = () => {
  QuerySpec("DIP").then((res: any) => {
    specList.value = res.content;
  });
};

const getTableData = () => {
  QueryDefectCode(getForm.value).then((res: any) => {
    tableData.value = res.content;
  });
};

// const getDetailData=()=>{
//   QueryDefectCodeDetail()
// }

const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const handleSizeChange1 = (val: any) => {
  detailPageObj.value.currentPage = 1;
  detailPageObj.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
  detailPageObj.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 194;
  });
};
</script>

<style scoped></style>
