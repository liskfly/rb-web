<template>
  <div class="flex flex-col h-full">
    <!-- ====== 头部栏：车间 + 产线下拉 + 切换系统/退出 ====== -->
    <div class="h-[40px] pl-2 pr-2 flex items-center justify-between bg-white border-b flex-shrink-0">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1">
          <span class="font-bold text-sm whitespace-nowrap">车间：</span>
          <el-select v-model="selectedWorkCenter" placeholder="请选择车间" size="small" style="width: 220px"
            @change="handleWorkCenterChange">
            <el-option v-for="item in workCenterOptions" :key="item.WorkCenterName" :label="item.Description"
              :value="item.WorkCenterName" />
          </el-select>
        </div>
        <div class="flex items-center gap-1">
          <span class="font-bold text-sm whitespace-nowrap">产线：</span>
          <el-select v-model="selectedMfgLine" placeholder="请先选择车间" size="small" style="width: 220px"
            :disabled="!selectedWorkCenter">
            <el-option v-for="item in mfgLineOptions" :key="item.MfgLineName" :label="item.Description"
              :value="item.MfgLineName" />
          </el-select>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <el-button size="small" @click="switchSystem">
          <el-icon><Connection /></el-icon> 切换系统
        </el-button>
        <el-button size="small" @click="logoutsys">
          <el-icon><Promotion /></el-icon> 退出登录
        </el-button>
      </div>
    </div>

    <!-- 标题 -->
    <div class="h-[40px] pl-2 pr-2 flex items-center bg-[#006487] text-white text-lg font-bold flex-shrink-0">
      <span>生产过站</span>
    </div>

    <div class="flex flex-1 min-h-0 p-2 gap-2">
      <!-- ====== 左半 1/2 ====== -->
      <div class="flex-1 flex flex-col min-h-0 gap-2">
        <div class="bg-white rounded shadow-sm flex items-center gap-3 px-3 py-2">
          <span class="font-bold whitespace-nowrap">进站扫码：</span>
          <el-input v-model="barcode" placeholder="请扫描条码后回车" size="large" clearable
            @keyup.enter="handleScan" />
        </div>

        <div class="bg-white rounded shadow-sm flex flex-col">
          <div class="h-[35px] flex items-center text-white bg-[#006487] px-3 flex-shrink-0">
            <span>工单信息</span>
          </div>
          <div class="p-3">
            <el-form size="small" label-width="80px">
              <el-row :gutter="16">
                <el-col :span="12">
                  <el-form-item label="工单号"><span class="font-bold">{{ info.MfgOrderName || '-' }}</span></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="产品编码"><span class="font-bold">{{ info.ProductName || '-' }}</span></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="条码编号"><span class="font-bold">{{ info.ContainerName || '-' }}</span></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="计划数量"><span class="font-bold">{{ info.PlannedQuantity ?? '-' }}</span></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="完成数量"><span class="font-bold text-[#00B400]">{{ info.CompletedQuantity ?? '0' }}</span></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工单状态">
                    <el-tag v-if="info.OrderStatusName" type="success" size="small">{{ info.OrderStatusName }}</el-tag>
                    <span v-else class="text-gray-400">-</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="当前工序"><span class="font-bold">{{ info.SpecName || '-' }}</span></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备"><span class="font-bold">{{ info.ResourceName || '-' }}</span></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="存货代码"><span class="font-bold">{{ info.InvAddCode || '-' }}</span></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="产品描述"><span class="font-bold">{{ info.ProductDesc || '-' }}</span></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="产品型号"><span class="font-bold">{{ info.ProductFamily || '-' }}</span></el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <div class="flex gap-2 flex-1 min-h-0">
          <div class="flex-1 bg-white rounded shadow-sm flex flex-col min-h-0">
            <div class="h-[32px] flex items-center text-white bg-[#006487] px-3 flex-shrink-0 text-sm">
              <span>待上料</span>
            </div>
            <div class="flex-1 p-2 overflow-auto">
              <el-table :data="pendingFeedingData" size="small" border style="width:100%" empty-text="暂无待上料数据">
                <el-table-column type="index" label="序号" width="45" align="center" />
                <el-table-column prop="MaterialName" label="物料编码" min-width="120" show-overflow-tooltip />
                <el-table-column prop="Type" label="类型" width="55" />
                <el-table-column prop="SNName" label="条码/批号" min-width="120" show-overflow-tooltip />
              </el-table>
            </div>
          </div>
          <div class="flex-1 bg-white rounded shadow-sm flex flex-col min-h-0">
            <div class="h-[32px] flex items-center text-white bg-[#006487] px-3 flex-shrink-0 text-sm">
              <span>已上料</span>
            </div>
            <div class="flex-1 p-2 overflow-auto">
              <el-table :data="loadedMaterialsData" size="small" border style="width:100%" empty-text="暂无已上料数据">
                <el-table-column type="index" label="序号" width="45" align="center" />
                <el-table-column prop="MaterialName" label="物料编码" min-width="120" show-overflow-tooltip />
                <el-table-column prop="Type" label="类型" width="55" />
                <el-table-column prop="SNName" label="条码/批号" min-width="120" show-overflow-tooltip />
              </el-table>
            </div>
          </div>
        </div>
      </div>

      <!-- ====== 右半 1/2：操作区 ====== -->
      <div class="flex-1 bg-white rounded shadow-sm flex flex-col min-h-0">
        <div class="h-[35px] flex items-center text-white bg-[#006487] px-3 flex-shrink-0">
          <span>{{ rightTitle || '操作区' }}</span>
        </div>
        <div class="flex-1 p-3 flex flex-col min-h-0">

          <!-- ===== UserDataCollectionDef ===== -->
          <template v-if="serviceType === 'UserDataCollectionDef' && dataCollectionList.length > 0">
            <div class="flex justify-end mb-2 flex-shrink-0">
              <el-button type="primary" size="small" @click="submitDataCollection">提交采集数据</el-button>
            </div>
            <el-table :data="dataCollectionList" size="small" border style="width:100%" height="100%">
              <el-table-column type="index" label="序号" width="45" align="center" />
              <el-table-column prop="DataPointName" label="项目" min-width="110" show-overflow-tooltip />
              <el-table-column label="结果(DataValue)" min-width="240">
                <template #default="scope">
                  <div>
                    <template v-if="scope.row.Type === 'Boolean'">
                      <el-radio-group v-model="scope.row.value" @change="validateItem(scope.row)">
                        <el-radio value="true">True</el-radio>
                        <el-radio value="false">False</el-radio>
                      </el-radio-group>
                    </template>
                    <template v-else-if="scope.row.Type === 'Timestamp'">
                      <el-date-picker v-model="scope.row.value" type="datetime" placeholder="选择日期时间"
                        value-format="YYYY-MM-DD HH:mm:ss" size="small" style="width:200px"
                        @change="validateItem(scope.row)" />
                    </template>
                    <template v-else>
                      <el-input v-model="scope.row.value" :placeholder="`请输入${scope.row.DataPointName}`"
                        size="small" style="width:180px" clearable
                        :class="{ 'is-error': scope.row._error }" @blur="validateItem(scope.row)" />
                    </template>
                    <div v-if="scope.row._error" class="text-red-500 text-xs mt-0.5">{{ scope.row._errorMsg }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="UomName" label="单位" width="55" align="center">
                <template #default="scope"><span>{{ scope.row.UomName || '-' }}</span></template>
              </el-table-column>
              <el-table-column label="下限" width="60" align="center">
                <template #default="scope"><span>{{ scope.row.LowerLimit || '-' }}</span></template>
              </el-table-column>
              <el-table-column label="上限" width="60" align="center">
                <template #default="scope"><span>{{ scope.row.UpperLimit || '-' }}</span></template>
              </el-table-column>
              <el-table-column label="必填" width="50" align="center">
                <template #default="scope">
                  <el-tag v-if="scope.row.IsRequired" size="small" type="danger">是</el-tag>
                  <span v-else class="text-gray-400">否</span>
                </template>
              </el-table-column>
            </el-table>
          </template>

          <!-- ===== ComponentIssue ===== -->
          <template v-else-if="serviceType === 'ComponentIssue' && treeComponentData.length > 0">
            <div class="flex flex-col h-full gap-2">
              <div class="flex justify-end flex-shrink-0">
                <el-button type="primary" size="small" :disabled="!canSubmitComponentIssue" @click="submitComponentIssue">提交扣料</el-button>
              </div>
              <div class="flex-1 flex flex-col min-h-0">
                <div class="h-[30px] flex items-center text-sm font-bold text-white bg-[#006487] px-2 flex-shrink-0">
                  <span>LOT 批追</span>
                </div>
                <el-table :data="lotData" size="small" border height="100%" style="width:100%"
                  row-key="_key" :tree-props="{ children: 'children' }" default-expand-all>
                  <el-table-column label="物料编码/条码" min-width="150" show-overflow-tooltip>
                    <template #default="scope">
                      <span v-if="scope.row.isChild" class="pl-6">{{ scope.row.SNName }}</span>
                      <span v-else>{{ scope.row.MaterialName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="QuantityRequired" label="用量" width="60" align="center">
                    <template #default="scope">
                      <span v-if="!scope.row.isChild">{{ scope.row.QuantityRequired }}</span>
                      <span v-else class="text-gray-300">-</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="条码/批号" min-width="130" show-overflow-tooltip>
                    <template #default="scope">
                      <span>{{ scope.row.isChild ? scope.row.SNName : '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="RemainingQuantity" label="剩余数量" width="80" align="center" />
                </el-table>
              </div>
              <div class="flex-1 flex flex-col min-h-0">
                <div class="h-[30px] flex items-center text-sm font-bold text-white bg-[#E6A23C] px-2 flex-shrink-0">
                  <span>SN 精追</span>
                </div>
                <el-table :data="snData" size="small" border height="100%" style="width:100%">
                  <el-table-column type="index" label="序号" width="45" align="center" />
                  <el-table-column prop="MaterialName" label="物料编码" min-width="130" show-overflow-tooltip />
                  <el-table-column prop="QuantityRequired" label="用量" width="60" align="center" />
                  <el-table-column label="条码" min-width="180">
                    <template #default="scope">
                      <div class="flex items-center gap-1">
                        <el-input v-model="scope.row.inputBarcode" placeholder="扫描条码回车" size="small" clearable
                          :disabled="!!scope.row.scannedSN"
                          @keyup.enter="handleSnBarcodeInput(scope.row)" />
                        <el-tag v-if="scope.row.scannedSN" size="small" type="success">已扫</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </template>

          <!-- ===== MoveIn ===== -->
          <div v-else-if="serviceType === 'MoveIn'" class="flex flex-col h-full gap-3">
            <div class="flex justify-end flex-shrink-0">
              <el-button type="primary" size="small" :disabled="!moveInResource" @click="submitMoveIn">进站</el-button>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-bold whitespace-nowrap">设备：</span>
              <el-select v-model="moveInResource" placeholder="请选择设备" size="large" style="width:300px">
                <el-option v-for="item in resourceOptions" :key="item.ResourceName" :label="item.ResourceName"
                  :value="item.ResourceName" />
              </el-select>
            </div>
          </div>

          <!-- ===== MoveStd ===== -->
          <div v-else-if="serviceType === 'MoveStd'" class="flex flex-col h-full gap-3 items-center justify-center">
            <el-button type="primary" size="large" @click="submitMoveStd">过站</el-button>
          </div>

          <div v-else class="flex items-center justify-center h-full text-gray-400 text-lg">扫描条码后显示操作内容</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { WorkCenterQuery, MfgLineQuery, ContainerOperationQuery, ContainerOperationExecution, ComponentIssueSNQuery } from "@/api/operate";

const { push } = useRouter();
const appStore = useAppStore();
const userStore = useUserStoreWithOut();

const selectedWorkCenter = ref("");
const selectedMfgLine = ref("");
const workCenterOptions = ref<any[]>([]);
const mfgLineOptions = ref<any[]>([]);

const getWorkCenters = async () => {
  const res: any = await WorkCenterQuery({});
  if (res.success && res.code === 0) {
    workCenterOptions.value = res.content || [];
  }
};

const handleWorkCenterChange = async (val: string) => {
  selectedMfgLine.value = "";
  mfgLineOptions.value = [];
  if (!val) return;
  const res: any = await MfgLineQuery({ WorkCenterName: val });
  if (res.success && res.code === 0) {
    mfgLineOptions.value = res.content || [];
  }
};

const barcode = ref("");

const info = ref({
  MfgOrderName: "", ProductName: "", ContainerName: "", SpecName: "",
  PlannedQuantity: null as number | null, CompletedQuantity: null as number | null, OrderStatusName: "",
  TaskName: "", TaskListName: "", DataCollectionDefId: "", ResourceName: "",
  InvAddCode: "", ProductDesc: "", ProductFamily: "",
});

const pendingFeedingData = ref<any[]>([]);
const loadedMaterialsData = ref<any[]>([]);

const rightTitle = ref("");
const serviceType = ref("");
const dataCollectionList = ref<any[]>([]);
const treeComponentData = ref<any[]>([]);
const moveInResource = ref("");
const resourceOptions = ref<any[]>([]);

const lotData = computed(() =>
  treeComponentData.value.filter((item) => item.TypeName === 'Lot')
);
const snData = computed(() =>
  treeComponentData.value.filter((item) => item.TypeName === 'SN')
);

const canSubmitComponentIssue = computed(() => {
  if (snData.value.length === 0) return true;
  return snData.value.every((row) => !!row.scannedSN);
});

const switchSystem = () => {
  localStorage.setItem("SYSTEM_TYPE", JSON.stringify(!appStore.getSystemType));
  appStore.setSystemType(!appStore.getSystemType);
  if (appStore.getSystemType && localStorage.getItem("OPUIData")) {
    const routestr = appStore.getOpuiData.path || "/";
    push(routestr);
  } else {
    push({ path: "/login", query: { redirect: "/dashboard/index" } });
  }
  location.reload();
};

const autoReScan = () => {
  const containerName = info.value.ContainerName;
  // 先清空数据但不清 barcode
  resetPageData();
  // 用刚才的条码自动重新请求
  barcode.value = containerName;
  if (barcode.value) {
    handleScan();
  }
};

const logoutsys = () => {
  userStore.logout();
};

const resetPageData = () => {
  barcode.value = "";
  info.value = {
    MfgOrderName: "", ProductName: "", ContainerName: "", SpecName: "",
    PlannedQuantity: null, CompletedQuantity: null, OrderStatusName: "",
    TaskName: "", TaskListName: "", DataCollectionDefId: "", ResourceName: "",
    InvAddCode: "", ProductDesc: "", ProductFamily: "",
  };
  pendingFeedingData.value = [];
  loadedMaterialsData.value = [];
  rightTitle.value = "";
  serviceType.value = "";
  dataCollectionList.value = [];
  treeComponentData.value = [];
  moveInResource.value = "";
  resourceOptions.value = [];
};

const handleSnBarcodeInput = async (row: any) => {
  if (!row.inputBarcode) return;
  const res: any = await ComponentIssueSNQuery({
    MfgOrderName: info.value.MfgOrderName,
    MaterialName: row.MaterialName,
    ContainerName: row.inputBarcode,
  });
  if (res.success && res.code === 0 && res.content?.length > 0) {
    const item = res.content[0];
    row.scannedSN = item.ContainerName;
    row.scannedQty = item.QTY;
  } else {
    ElMessageBox.alert(res.msg || "条码验证失败", "错误", {
      confirmButtonText: "确定", type: "error",
    });
  }
};

const submitComponentIssue = async () => {
  if (pendingFeedingData.value.length <= 0) {
    ElMessage.warning("请先完成待上料操作");
    return;
  }

  const lotItems: any[] = [];
  lotData.value.forEach((parent: any) => {
    (parent.children || []).forEach((child: any) => {
      lotItems.push({ MaterialName: parent.MaterialName, SNName: child.SNName, CurrentQuantity: child.CurrentQuantity || 1 });
    });
  });
  const snItems: any[] = [];
  snData.value.forEach((row: any) => {
    if (row.scannedSN) {
      snItems.push({ MaterialName: row.MaterialName, SNName: row.scannedSN, CurrentQuantity: row.scannedQty || 1 });
    }
  });
  if (lotItems.length === 0 && snItems.length === 0) {
    ElMessageBox.alert("没有可提交的扣料数据", "提示", {
      confirmButtonText: "确定", type: "warning",
    });
    return;
  }
  const params = {
    ContainerName: info.value.ContainerName, TaskName: info.value.TaskName || "",
    TaskListName: info.value.TaskListName, ServiceName: "ComponentIssue",
    DataCollectionDefId: "", DataCollectionDefName: "", ResourceName: info.value.ResourceName || "",
    operationEntityComponentIssueLists: [...lotItems, ...snItems],
    operationEntityDataCollectionLists: [],
  };
  const res: any = await ContainerOperationExecution(params);
  if (res.success && res.code === 0) {
    autoReScan();
  } else {
    ElMessageBox.alert(res.msg || "扣料提交失败", "错误", {
      confirmButtonText: "确定", type: "error",
    });
  }
};

const submitMoveIn = async () => {
  if (pendingFeedingData.value.length <= 0) {
    ElMessage.warning("请先完成待上料操作");
    return;
  }

  if (!moveInResource.value) {
    ElMessageBox.alert("请选择设备", "提示", {
      confirmButtonText: "确定", type: "warning",
    });
    return;
  }
  const params = {
    ContainerName: info.value.ContainerName, TaskName: info.value.TaskName || "",
    TaskListName: info.value.TaskListName, ServiceName: "MoveIn",
    DataCollectionDefId: "", DataCollectionDefName: "", ResourceName: moveInResource.value,
    operationEntityComponentIssueLists: [], operationEntityDataCollectionLists: [],
  };
  const res: any = await ContainerOperationExecution(params);
  if (res.success && res.code === 0) {
    autoReScan();
  } else {
    ElMessageBox.alert(res.msg || "进站失败", "错误", {
      confirmButtonText: "确定", type: "error",
    });
  }
};

const submitMoveStd = async () => {
  if (pendingFeedingData.value.length <= 0) {
    ElMessage.warning("请先完成待上料操作");
    return false;
  }

  const params = {
    ContainerName: info.value.ContainerName, TaskName: info.value.TaskName || "",
    TaskListName: info.value.TaskListName, ServiceName: "MoveStd",
    DataCollectionDefId: "", DataCollectionDefName: "", ResourceName: info.value.ResourceName || "",
    operationEntityComponentIssueLists: [], operationEntityDataCollectionLists: [],
  };
  const res: any = await ContainerOperationExecution(params);
  if (res.success && res.code === 0) {
    autoReScan();
  } else {
    ElMessageBox.alert(res.msg || "过站失败", "错误", {
      confirmButtonText: "确定", type: "error",
    });
  }
};

const validateItem = (item: any) => {
  item._error = false;
  item._errorMsg = "";
  if (item.Type === 'Boolean' || item.Type === 'Timestamp') {
    if (item.IsRequired && (item.value === "" || item.value === undefined || item.value === null)) {
      item._error = true;
      item._errorMsg = `${item.DataPointName} 为必填项`;
    }
    return;
  }
  if (item.IsRequired && (!item.value || String(item.value).trim() === '')) {
    item._error = true;
    item._errorMsg = `${item.DataPointName} 为必填项`;
    return;
  }
  if (item.value && !isNaN(Number(item.value))) {
    const num = Number(item.value);
    if (item.LowerLimit !== "" && item.LowerLimit !== null && item.LowerLimit !== undefined && num < Number(item.LowerLimit)) {
      item._error = true;
      item._errorMsg = `${item.DataPointName} 不能小于 ${item.LowerLimit}`;
      return;
    }
    if (item.UpperLimit !== "" && item.UpperLimit !== null && item.UpperLimit !== undefined && num > Number(item.UpperLimit)) {
      item._error = true;
      item._errorMsg = `${item.DataPointName} 不能大于 ${item.UpperLimit}`;
      return;
    }
  }
};

const handleScan = async () => {
  if (!barcode.value) return;
  if (!selectedWorkCenter.value) {
    ElMessageBox.alert("请先选择车间", "提示", {
      confirmButtonText: "确定", type: "warning",
    });
    return;
  }
  if (!selectedMfgLine.value) {
    ElMessageBox.alert("请先选择产线", "提示", {
      confirmButtonText: "确定", type: "warning",
    });
    return;
  }

  const res: any = await ContainerOperationQuery({
    ContainerName: barcode.value, WorkCenterName: selectedWorkCenter.value, MfgLineName: selectedMfgLine.value,
  });

  if (res.success && res.code === 0 && res.content) {
    const d = res.content;
    info.value = {
      MfgOrderName: d.MfgOrderName ?? "", ProductName: d.ProductName ?? "", ContainerName: d.ContainerName ?? "",
      SpecName: d.SpecName ?? "", PlannedQuantity: d.PlannedQuantity ?? null, CompletedQuantity: d.CompletedQuantity ?? null,
      OrderStatusName: d.OrderStatusName ?? "", TaskName: d.TaskName ?? "", TaskListName: d.TaskListName ?? "",
      DataCollectionDefId: d.DataCollectionDefId ?? "", ResourceName: d.ResourceName ?? "",
      InvAddCode: d.InvAddCode ?? "", ProductDesc: d.ProductDesc ?? "", ProductFamily: d.ProductFamily ?? "",
    };

    resourceOptions.value = d.rebornResourceLists || [];

    const pending: any[] = [];
    (d.rebornPendingFeedingLists || []).forEach((m: any) => {
      (m.rebornPendingFeedingContainerLists || []).forEach((c: any) => {
        pending.push({ MaterialName: m.MaterialName, Type: m.Type, SNName: c.SNName });
      });
    });
    pendingFeedingData.value = pending;

    const loaded: any[] = [];
    (d.rebornLoadedMaterialsLists || []).forEach((m: any) => {
      (m.rebornLoadedMaterialsContainerLists || []).forEach((c: any) => {
        loaded.push({ MaterialName: m.MaterialName, Type: m.Type, SNName: c.SNName });
      });
    });
    loadedMaterialsData.value = loaded;

    serviceType.value = d.ServiceName || "";
    rightTitle.value = d.DataCollectionDefName || d.ServiceName || "操作区";
    moveInResource.value = "";

    if (serviceType.value === 'UserDataCollectionDef') {
      dataCollectionList.value = (d.rebornDataCollectionLists || []).map((item: any) => ({
        ...item, value: "", _error: false, _errorMsg: "",
      }));
      treeComponentData.value = [];
    } else if (serviceType.value === 'ComponentIssue') {
      treeComponentData.value = (d.rebornComponentIssueLists || []).map((m: any, idx: number) => ({
        _key: `parent_${idx}`, MaterialName: m.MaterialName, QuantityRequired: m.QuantityRequired, TypeName: m.TypeName,
        inputBarcode: m.TypeName === 'SN' ? "" : undefined, scannedSN: null, scannedQty: null,
        children: (m.rebornComponentIssueItemLists || []).map((s: any, sIdx: number) => ({
          _key: `child_${idx}_${sIdx}`, isChild: true, SNName: s.SNName,
          CurrentQuantity: s.CurrentQuantity, RemainingQuantity: s.RemainingQuantity,
        })),
      }));
      dataCollectionList.value = [];
    } else {
      dataCollectionList.value = [];
      treeComponentData.value = [];
    }

    barcode.value = "";
  } else {
    resetPageData();
    ElMessageBox.alert(res.msg || "条码识别失败", "错误", {
      confirmButtonText: "确定", type: "error",
    });
  }
};

const submitDataCollection = async () => {
  if (pendingFeedingData.value.length <= 0) {
    ElMessage.warning("请先完成待上料操作");
    return;
  }

  let hasError = false;
  dataCollectionList.value.forEach((item) => { validateItem(item); if (item._error) hasError = true; });
  if (hasError) {
    ElMessageBox.alert("请检查数据采集项中的错误提示", "提示", {
      confirmButtonText: "确定", type: "warning",
    });
    return;
  }
  const params = {
    ContainerName: info.value.ContainerName, TaskName: info.value.TaskName, TaskListName: info.value.TaskListName,
    ServiceName: serviceType.value, DataCollectionDefId: info.value.DataCollectionDefId,
    DataCollectionDefName: rightTitle.value, ResourceName: info.value.ResourceName,
    operationEntityComponentIssueLists: [],
    operationEntityDataCollectionLists: dataCollectionList.value.map((item) => ({
      DataPointName: item.DataPointName, DataType: item.Type, DataValue: item.value,
    })),
  };
  const res: any = await ContainerOperationExecution(params);
  if (res.success && res.code === 0) {
    autoReScan();
  } else {
    ElMessageBox.alert(res.msg || "提交失败", "错误", {
      confirmButtonText: "确定", type: "error",
    });
  }
};

onMounted(() => {
  getWorkCenters();
  // 读取登录返回的车间产线
  const savedWorkCenter = localStorage.getItem("LOGIN_WORKCENTER");
  const savedMfgLine = localStorage.getItem("LOGIN_MFGLINE");
  if (savedWorkCenter) {
    selectedWorkCenter.value = savedWorkCenter;
    handleWorkCenterChange(savedWorkCenter);
  }
  if (savedMfgLine) {
    selectedMfgLine.value = savedMfgLine;
  }
});

</script>

<style scoped>
:deep(.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}
</style>
