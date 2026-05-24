<template>
  <div class="flex flex-col w-full h-full">
    <!-- <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
      <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
    </div> -->
    <div class="w-full flex-1 flex">
      <!-- <div class="w-[calc(100%-350px)]"> -->

      <div class="w-full h-full flex flex-col">
        <div>
          <div class="h-[35px] flex items-center justify-between text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5"> 扫描条码</span>
            <div>
              <el-button type="warning" @click="reginVisible = true">维修登记</el-button>
            </div>
          </div>
          <div class="h-[120px] p-5">
            <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
              @submit.native.prevent>
              <el-form-item label="扫描条码">
                <el-input v-model.trim="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 500px"
                  placeholder="请扫描条码" @keyup.enter.native="getChange" />
              </el-form-item>
              <!-- <el-form-item label="">
                <el-button type="primary" disabled @click="">维修</el-button>
              </el-form-item> -->
            </el-form>
            <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
              {{ msgTitle === "" ? "请扫描条码" : msgTitle }}
            </div>
            <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
              {{ msgTitle }}
            </div>
          </div>
        </div>
        <div class="flex flex-col flex-1">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">维修记录</span>
          </div>
          <div class="flex-1">
            <table-tem :showIndex="true" :tableData="tableData" :tableHeight="tableHeight" :columnData="columnData"
              :pageObj="pageObj" @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"></table-tem>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="badVisible" width="80%" :fullscreen="false" :append-to-body="true" class="saveAsDialog"
      :close-on-click-modal="false" :close-on-press-escape="false" align-center>
      <template #header="{ close, titleId, titleClass }">
        <div class="flex justify-between">
          <h4 :id="titleId" :class="titleClass">返修登记</h4>
          <div></div>
        </div>
      </template>
      <div class="flex flex-col border-solid border-1 border-[#bdbdbd]">
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            基本信息
          </div>
          <el-form ref="baseFormRef" :model="baseForm" label-width="auto" class="pt-[5px]">
            <el-row>
              <el-col :span="8">
                <el-form-item label="PCB条码" class="mb-[5px] flex" prop="ContainerName">
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
                <el-form-item class="mb-[5px]" label="工序描述" prop="SpecDesc">
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
                {{
                  scope.row.DefectCode1 == null || scope.row.DefectCode1 == ""
                    ? ""
                    : badData.length + scope.$index + 1
                }}
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
            返修
          </div>
          <el-form ref="repairFormRef" :model="repairForm" :inline="true" class="pt-2"  label-width="auto">
            <div class="flex items-start">
              <el-form-item label="返修操作" prop="RepairAction">
                <el-select v-model="repairForm.RepairAction" placeholder="请选择" style="width: 200px">
                  <el-option v-for="item in actionList" :key="item.isRepairActionName" :label="item.Description"
                    :value="item.isRepairActionName" />
                </el-select>
              </el-form-item>
              <el-form-item label="返修工序" prop="WorkFlowStep">
                <el-select v-model="repairForm.WorkFlowStep" placeholder="请选择" style="width: 200px"
                  :disabled="isAction">
                  <el-option v-for="item in specList" :key="item.WorkflowStepName" :label="item.Description"
                    :value="item.WorkflowStepName" />
                </el-select>
              </el-form-item>
              <el-form-item label="返修原因" prop="Remark">
                <el-input v-model="repairForm.RepairRemark" :rows="2" style="width: 240px" type="textarea"
                  />
              </el-form-item>
        
            </div>
            <div>
              <el-form-item label="维修材料分类" prop="Remark">
                  <el-select v-model="repairForm.RepairMaterialClass"  style="width: 200px"
                 >
                 <el-option :value="'原材'" :label="'原材'"/>
                 <el-option :value="'制程'" :label="'制程'"/>

                </el-select>
              </el-form-item>
              <el-form-item label="维修材料" prop="Remark">
                <el-input v-model="repairForm.RepairMaterial"  style="width: 200px" 
                  />
              </el-form-item>
              <el-form-item label="维修点位" prop="Remark">
                <el-input v-model="repairForm.RepairPoint"   :rows="2" style="width: 240px" type="textarea" />
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
    <el-dialog v-model="hopOffVisible" width="80%" :fullscreen="false" :append-to-body="true" class="saveAsDialog"
      :close-on-click-modal="false" :close-on-press-escape="false" align-center title="返修跳站" @close="hopOffCancel">
      <div class="flex flex-col border-solid border-1 border-[#bdbdbd]">
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            基本信息
          </div>
          <el-form ref="baseFormRef" :model="baseForm" label-width="auto" class="pt-[5px]">
            <el-row>
              <el-col :span="8">
                <el-form-item label="MES条码" class="mb-[5px] flex" prop="ContainerName">
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
                <el-form-item class="mb-[5px]" label="工序描述" prop="SpecDesc">
                  <el-input v-model="baseForm.SpecDesc" style="width: 200px" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            返修跳站
          </div>
          <el-form ref="repairFormRef" :model="repairForm" :inline="true" class="pt-2">
            <div class="flex items-start">
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
          <el-button @click="hopOffCancel">取消</el-button>
          <el-button type="primary" @click="hopOffSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="reginVisible" draggable title="维修登记" width="500px" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" align-center @open="reginOpen" @close="reginCancel">
      <el-form ref="formRef" :model="form" label-width="auto" @submit.native.prevent>
        <el-form-item label="扫描条码">
          <el-input v-model="reginCode" ref="inputReginRef" @keyup.enter.native="getReginChange" />
        </el-form-item>
      </el-form>
      <div class="text-xl font-bold text-[#00B400]" v-show="msgReginType === true || msgReginTitle === ''">
        {{ msgReginTitle === "" ? "请扫描条码" : msgReginTitle }}
      </div>
      <div class="text-xl font-bold text-[red]" v-show="msgReginType === false && msgReginTitle !== ''">
        {{ msgReginTitle }}
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reginCancel">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  QuerySMTDefectRecordDetail,
  QueryWorkflowList,
  SaveRepairRecord,
  QueryRepairRecord,
  QueryRepairAction,
  RepairRecordStart
} from "@/api/asyApi";
import tableTem from "@/components/tableTem/index.vue";
import tableTemp from "@/components/tableTemp/index.vue";
import { useAppStoreWithOut } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
interface Spec {
  WorkflowName: string;
  WorkflowStepName: string;
  Description:string
}
interface ActionList {
  Description: string;
  isRepairActionName: string;
}
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  watch,
} from "vue";
const appStore = useAppStoreWithOut();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const inputRef = ref();
const form = ref({
  PcbNumber: "",
  SpecName: "SMT-BOX",
  workstationName: opui.station,
  userAccount: userStore.getUserInfo,
});
const msgTitle = ref("");
const msgType = ref(true);
const tableData = ref([]);
const tableHeight = ref(0);
const columnData = reactive([
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
    prop: "RepairActionName",
    label: "返修操作",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "WorkFolwStep",
    label: "返修工序",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "RepairMaterial",
    label: "维修材料",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "RepairMaterialClass",
    label: "维修材料分类",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "RepairPoint",
    label: "维修点位",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "RepairRemark",
    label: "备注",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "RepairStartBy",
    label: "登记人",
    width: "150",
    // min: true,
    align: "1",
  },
  {
    text: true,
    prop: "RepairStartOn",
    label: "维修开始时间",
    width: "180",
    // min: true,
    align: "1",
  },
  {
    text: true,
    prop: "fullname",
    label: "维修人",
    width: "150",
    // min: true,
    align: "1",
  },
  {
    text: true,
    prop: "CreatedOn",
    label: "维修完成时间",
    width: "180",
    // min: true,
    align: "1",
  },
]);
const pageObj = ref({
  pageSize: 50,
  currentPage: 1,
});
const inputFocus = ref(true);
const badVisible = ref(false);
const baseForm = ref({
  ContainerName: "",
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  SpecName: "",
  SpecDesc: "",
});
const badData = ref([]);
const badColumn = ref([
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
const barCode = ref("");
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
  RepairPoint:"",
  RepairMaterial:"",
  RepairMaterialClass:""
});
const specList = ref<Spec[]>([]);
const baseFormRef = ref();
const repairFormRef = ref();
const actionList = ref<ActionList[]>([]);
const isAction = ref(true);
const hopOffVisible = ref(false);

watch(
  () => repairForm.value.RepairAction,
  (newVal) => {
    // console.log(newVal);
    if (newVal == "Scrap" || newVal == "") {
      isAction.value = true;
      repairForm.value.WorkFlowStep = "";
    } else {
      isAction.value = false;
    }
  },
  { deep: true, immediate: true }
);

const reginVisible = ref(false);
const reginCode = ref("");
const inputReginRef = ref();
const msgReginTitle = ref("");
const msgReginType = ref(true);

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getHisData();
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

const getHisData = () => {
  QueryRepairRecord(opui.station).then((res: any) => {
    tableData.value = res.content;
  });
};

const getChange = () => {
  if (!barCode.value) {
    return;
  }
  QuerySMTDefectRecordDetail(barCode.value).then((res: any) => {
    // console.log(res);
    if (!res.success) {
      msgTitle.value = res.msg;
      msgType.value = res.success;
      barCode.value = "";
      getFocus();
      return;
    }
    // msgTitle.value = res.msg;
    //   msgType.value = res.success;
    if (res.content2 == "NG") {
      badVisible.value = true;
    } else {
      hopOffVisible.value = true;
    }

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
  });
};
//获取返修工序
const getWorkflowList = (data: any) => {
  QueryWorkflowList(data).then((res: any) => {
    specList.value = res.content;
  });
};
//获取返修操作
const getActionList = (data: any) => {
  QueryRepairAction(data).then((res: any) => {
    actionList.value = res.content;
  });
};
const repairCancel = () => {
  badData.value = [];
  baseFormRef.value.resetFields();
  repairFormRef.value.resetFields();
  repairForm.value.IsDefectHistoryId = "";
  repairForm.value.ContainerName = "";
  repairForm.value.RepairRemark = "";
  barCode.value = "";
  msgTitle.value = "";
  msgType.value = true;
  badVisible.value = false;
  getFocus();
};
const repairSubmit = () => {
  SaveRepairRecord(repairForm.value).then((res: any) => {
    ElNotification({
      title: "提示信息",
      message: res.msg,
      type: res.success ? "success" : "error",
    });
    if (res.success) {
      repairCancel();
      getFocus();
      barCode.value = "";
      badVisible.value = false;
    }
    getHisData();
  });
};
const hopOffCancel = () => {
  baseFormRef.value.resetFields();
  repairFormRef.value.resetFields();
  repairForm.value.IsDefectHistoryId = "";
  repairForm.value.ContainerName = "";
  repairForm.value.RepairRemark = "";
  barCode.value = "";
  msgTitle.value = "";
  msgType.value = true;
  hopOffVisible.value = false;
};
const hopOffSubmit = () => {
  SaveRepairRecord(repairForm.value).then((res: any) => {
    if (res.success) {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });

      baseFormRef.value.resetFields();
      repairFormRef.value.resetFields();
      getFocus();
      barCode.value = "";
      hopOffVisible.value = false;
    }
    getHisData();
  });
};

const reginOpen = () => {
  nextTick(() => {
    if (inputReginRef.value) {
      inputReginRef.value.focus();
    }
  });
};
const reginCancel = () => {
  reginCode.value = "";
  reginVisible.value = false;
  msgReginType.value = true
  msgReginTitle.value=""
  inputRef.value.focus();
};

const getReginChange = () => {
  QuerySMTDefectRecordDetail(reginCode.value).then((res: any) => {
    if (res.success) {
      let data = {
        ContainerName: reginCode.value,
        WorkStation: opui.station,
        RepairStartBy: userStore.getUserInfo,
        Result: res.content2,
      };

      RepairRecordStart(data).then((res: any) => {
        msgReginType.value = res.success;
        msgReginTitle.value = res.msg;
        reginCode.value = "";
      });
    } else {
      msgReginType.value = res.success;
      msgReginTitle.value = res.msg;
      reginCode.value = "";
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
    tableHeight.value = window.innerHeight - 320;
  });
};
</script>

<style lang="scss" scoped>
.inbound .el-form-item__label {
  font-size: 16px;
}

.setwidth {
  flex: 0 0 350px;
}

.box {
  border-right: 2px solid #cbcbcb;
}

.list .el-table__empty-text {
  display: none;
}
</style>
<style lang="scss">
.saveAsDialog {
  min-width: 954px;
}
</style>
