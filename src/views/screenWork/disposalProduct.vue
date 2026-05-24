<template>
  <div class="flex flex-col w-full h-full">
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[350px]">
        <div class="w-full h-full box">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">基本信息</span>
          </div>
          <div class="p-[10px]">
            <el-form ref="formRef" :model="form" label-width="auto" @submit.native.prevent>
              <el-form-item label="MES屏条码" prop="scrBarCode">
                <el-input v-model="form.ContainerName" placeholder=""  @keyup.enter.native="getData"/>
              </el-form-item>
              <el-form-item label="生产计划号" prop="order">
                <el-input v-model="form.MfgOrderName" placeholder="" />
              </el-form-item>

              <el-form-item label="产品机型" prop="productCode">
                <el-input v-model="form.productmodel" placeholder="" />
              </el-form-item>
              <el-form-item label="产品编码" prop="order">
                <el-input v-model="form.productName" placeholder="" />
              </el-form-item>
             
              <el-form-item label="时间">
                <el-date-picker :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD" type="daterange"
                  range-separator="-" :disabled-date="disabledDate" :clearable="true" />
              </el-form-item>
            </el-form>
            <div class="flex justify-end">
              <el-button type="primary" @click="getData">查询</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-350px)]">
        <div class="w-full h-full flex flex-col">
          <div class="flex flex-col flex-1">
            <div class="h-[35px] flex items-center text-lg justify-between text-[#fff] bg-[#006487]">
              <span class="ml-5"> 不良品处置列表</span>
            </div>
            <div class="p-2">
              <el-button type="primary" @click="disassembly" :disabled="selectTable.length === 0">批量拆解</el-button>
            </div>
            <el-table :data="tableData" :height="tableHeight" stripe border fit
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column v-for="c in columnData" :key="c.prop" :label="c.label" :prop="c.prop" :width="c.width"
                :min-width="c.min ? flexColumnWidth(c.label, c.prop) : ''" :align="c.align">
                <template #default="scope">
                  <span v-if="c.text">{{ scope.row[c.prop] }}</span>
                  <el-tooltip v-if="c.isOperation" v-for="(o, oi) in c.operation" :key="oi" :content="o.label"
                    placement="top">
                    <el-button :icon="o.icon" size="small" :type="o.type" @click="quickRepair(scope.row)" />
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <div class="mt-3 bg-white">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageObj.currentPage" :page-size="pageObj.pageSize" :page-sizes="[10, 30, 50, 100, 150]"
                layout="total,sizes, prev, pager, next, jumper" :total="tableData.length">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="badVisible" width="80%" :fullscreen="false" :append-to-body="true" class="saveAsDialog"
      :close-on-click-modal="false" :close-on-press-escape="false" align-center title="快修">
      <div class="flex flex-col border-solid border-1 border-[#bdbdbd]">
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            基本信息
          </div>
          <el-form ref="baseFormRef" :model="baseForm" label-width="auto" class="pt-[5px]">
            <el-row>
              <el-col :span="8">
                <el-form-item label="LCM条码" class="mb-[5px] flex" prop="ContainerName">
                  <el-input v-model="baseForm.ContainerName" style="width: 200px" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="生产计划号" class="mb-[5px] flex" prop="MfgOrderName">
                  <el-input v-model="baseForm.MfgOrderName" style="width: 200px" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item class="mb-[5px]" label="产品编码" prop="ProductName">
                  <el-input v-model="baseForm.ProductName" style="width: 200px" disabled /> </el-form-item></el-col>
              <el-col :span="11">
                <el-form-item class="mb-[5px]" label="产品描述">
                  <el-input v-model="baseForm.ProductDesc" style="width: 300px" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item class="mb-[5px]" label="工序编码" prop="SpecName">
                  <el-input v-model="baseForm.SpecName" style="width: 200px" disabled /> </el-form-item></el-col>
              <el-col :span="11">
                <el-form-item class="mb-[5px]" label="检出工序" prop="SpecDesc">
                  <el-input v-model="baseForm.SpecDesc" style="width: 200px" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            不良列表
          </div>
          <el-table :data="badData" :style="{ width: '100%' }" size="small" :height="200" stripe border fit>
            <el-table-column label="序号" type="index" width="50" align="center" />
            <el-table-column prop="DefectCode" label="不良代码" />
            <el-table-column prop="DefectDesc" label="不良原因" />
            <el-table-column prop="ref_name" label="不良点位" />

            <el-table-column label="序号" width="50" align="center">
              <template template #default="scope">
                {{ badData.length + scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="DefectCode1" label="不良代码" />
            <el-table-column prop="DefectDesc1" label="不良原因" />
            <el-table-column prop="ref_name1" label="不良点位" />
          </el-table>
          <!-- <tableTemp :showIndex="true" :tableData="badData" :tableHeight="200" :columnData="badColumn" size="small">
          </tableTemp> -->
        </div>
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            快修跳站
          </div>
          <el-form ref="repairFormRef" :model="repairForm" :inline="true" class="pt-2">
            <div class="flex items-start">
              <el-form-item label="返修操作" prop="RepairAction">
                <el-select v-model="repairForm.RepairAction" placeholder="请选择" style="width: 200px">
                  <el-option v-for="item in actionList" :key="item.isRepairActionName" :label="item.Description"
                    :value="item.isRepairActionName" />
                </el-select>
              </el-form-item>
              <el-form-item label="跳站工序" prop="WorkFlowStep">
                <el-select v-model="repairForm.WorkFlowStep" placeholder="请选择" style="width: 200px">
                  <el-option v-for="item in specList" :key="item.WorkflowStepName" :label="item.Description"
                    :value="item.WorkflowStepName" />
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="repairCancel">取消</el-button>
          <el-button type="primary" @click="repairSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useAppStoreWithOut } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { cloneDeep } from "lodash-es";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  watch,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import { useRouter } from "vue-router";
import { useProjectStoreWithOut } from "@/stores/modules/projectData";
import {
  DefectiveDisposalList,
  DefectiveQuickTest,
  QueryDefectRecordDetail,
  QueryWorkflowList,
  DefectiveDismantle,
  QueryRepairAction
} from "@/api/scrApi";
import {
  shortcuts,
  setTodayDate,
  setLastDate,
  disabledDate,
} from "@/utils/dataMenu";

const appStore = useAppStoreWithOut();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const searchDate = ref<any[]>([]);

const badVisible = ref(false);

const router = useRouter();
const projectStore: any = useProjectStoreWithOut();

const form = ref({
  ContainerName: "",
  StartTime: "",
  EndTime: "",
  WorkStation: opui.station,
  MfgOrderName: "",
  productmodel: "",
  productName: "",
});

const tableData = ref([]);
const selectTable = ref([]);

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

const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});
const baseForm = ref({
  ContainerName: "",
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  SpecName: "",
  SpecDesc: "",
});
const badData = ref([]);
const repairForm = ref({
  IsDefectHistoryId: "",
  ContainerName: "",
  WorkStation: opui.station,
  RepairAction: "",
  RepairRemark: "",
  CreatedBy: userStore.getUserInfo,
  WorkFlowStep: "",
  WorkFlow: "",
  Result: "",
});
interface Spec {
  WorkflowName: string;
  WorkflowStepName: string;
  Description: string;
}
const specList = ref<Spec[]>([]);
const baseFormRef = ref();
const repairFormRef = ref();
interface ActionList {
  Description: string;
  isRepairActionName: string;
}
const actionList = ref<ActionList[]>([]);

watch(
  () => searchDate.value,
  (newVal: any, oldVal: any) => {
    if (newVal === null) {
      form.value.StartTime = "";
      form.value.EndTime = "";
      // getForm.value.currentPage = 1;
      //   getDetailForm.value.currentPage = 1;
      getData();
      return;
    }
    if (newVal !== oldVal) {
      form.value.StartTime = newVal[0];
      form.value.EndTime = newVal[1]+" "+"23:59:59"
      // getForm.value.currentPage = 1;
      // detailData.value = [];
      //   getDetailForm.value.currentPage = 1;
      getData();
    }
  }
);

onBeforeMount(() => {
  getScreenHeight();
  let end: string = setTodayDate();
  let start: string = setLastDate();
 end=end+" "+"23:59:59"
  searchDate.value = [start, end];
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  // console.log(appStore.getOpuiData.stationDec);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
  DefectiveDisposalList(form.value).then((res: any) => {
    if (res.success) {
      tableData.value = res.content;
    }
  });
};
//获取返修操作
const getActionList = (data: any) => {
  QueryRepairAction(data).then((res: any) => {
    actionList.value = res.content;
  });
};

//批量拆卸
const disassembly = () => {
  // if (selectTable.value.length === 0) {
  //   return;
  // }
  // projectStore.setFectivekList(selectTable.value);
  // router.push({ name: "BICV-SCN-0005" });
  let data: any[] = []
  selectTable.value.forEach((item: any) => {
    data.push(item.ContainerName)
  })
  
  
  DefectiveDismantle({
    ContainerName:data
  }).then((res: any) => {
    ElNotification({
      title: "提示信息",
      message: res.msg,
      type: res.success ? "success" : "error",
    });
    if (res.success) {
      badVisible.value = false;
      getData()
    }
  })
};

//快修
const quickRepair = (row: any) => {
  QueryDefectRecordDetail({ ContainerName: row.ContainerName }).then(
    (res: any) => {
      if (res.success) {
        baseForm.value.ContainerName = res.content.ContainerName;
        baseForm.value.ProductDesc = res.content.ProductDesc;
        baseForm.value.MfgOrderName = res.content.MfgOrderName;
        baseForm.value.ProductName = res.content.ProductName;
        baseForm.value.SpecDesc = res.content.SpecDesc;
        baseForm.value.SpecName = res.content.SpecName;
        badData.value = res.content.defectCodeDetail;
        repairForm.value.WorkFlow = res.content.WorkflowName;
        repairForm.value.IsDefectHistoryId = res.content.isDefectHistoryId;
        repairForm.value.ContainerName = res.content.ContainerName;
        repairForm.value.Result = res.content2;
        getWorkflowList(res.content.WorkflowName);
        getActionList(res.content.OperationName);
        badVisible.value = true;
      } else {
        ElNotification({
          title: "提示信息",
          message: res.msg,
          type: "error",
        });
      }
    }
  );
};
const getWorkflowList = (data: any) => {
  QueryWorkflowList({ WorkflowName: data }).then((res: any) => {
    specList.value = res.content;
  });
};
const repairCancel = () => {
  badData.value = [];
  baseFormRef.value.resetFields();
  repairFormRef.value.resetFields();
  repairForm.value.IsDefectHistoryId = "";
  repairForm.value.ContainerName = "";
  repairForm.value.RepairRemark = "";
  badVisible.value = false;
};
const repairSubmit = () => {
  let data = {
    ContainerName: repairForm.value.ContainerName,
    // SpecName: baseForm.value.SpecName,
    RepairAction:repairForm.value.RepairAction,
    WorkStation: opui.station,
    EmployeeName: userStore.getUserInfo,
    MfgOrderName: baseForm.value.MfgOrderName,
    WorkFlow: repairForm.value.WorkFlow,
    WorkFlowStep: repairForm.value.WorkFlowStep,
  };
  DefectiveQuickTest(data).then((res: any) => {
    ElNotification({
      title: "提示信息",
      message: res.msg,
      type: res.success ? "success" : "error",
    });
    if (res.success) {
      badVisible.value = false;
      getData()
    }
  })
};

const columnData = reactive([
  {
    text: true,
    prop: "ContainerName",
    label: "MES屏条码",
    width: "",
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
    prop: "ProductName",
    label: "产品编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "DefectTime",
    label: "不良录入时间",
    width: "",
    min: true,
    align: "1",
  },

  {
    isOperation: true,
    label: "操作",
    width: "120",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "快修",
        icon: "Position",
        buttonClick: repairSubmit,
      },
    ],
  },
]);

const handleSelectionChange = (val: any) => {
  let data = cloneDeep(val);
  selectTable.value = data;
  console.log(selectTable.value);
};

const handleEdit = () => { };
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
    tableHeight.value = window.innerHeight - 215;
  });
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

const getTextWidth = (str: string) => {
  let width = 0;
  const html = document.createElement("span");
  html.innerText = str;
  html.className = "getTextWidth";
  document.body?.appendChild(html);

  // 使用类型断言将 Element 转换为 HTMLElement
  const spanElement = document.querySelector(".getTextWidth") as HTMLElement;
  if (spanElement) {
    width = spanElement.offsetWidth;
    spanElement.remove();
  }
  // console.log(width);
  return width;
};

const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
};
</script>

<style lang="scss" scoped>
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

.tabs-css .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
  // color: #fff;
  background-color: #fff;
}

.switchok .el-switch__label.is-active {
  color: #13ce66;
}

.switchng .el-switch__label.is-active {
  color: #ff4949;
}
</style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
