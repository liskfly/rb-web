<template>
  <div class="flex flex-col h-full">
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
          <template v-if="serviceType === 'UserDataCollectionDef'">
            <div class="flex justify-between mb-2 flex-shrink-0">
              <div class="flex items-center gap-2">
                <el-button type="warning" size="small" @click="handleHistoryQuery">查看历史采集数据</el-button>
                <el-button v-if="hasBatchDataCollection" type="success" size="small" @click="push('/dipWork/batchDataCollection')">批量数据采集</el-button>
                <el-button type="primary" plain size="small" @click="openAttachmentUpload">
                  附件上传{{ attachmentFiles.length ? `(${attachmentFiles.length})` : '' }}
                </el-button>
              </div>
              <el-button type="primary" size="small" :loading="dataCollectionSubmitting" @click="submitDataCollection">提交采集数据</el-button>
            </div>
            <el-table :data="dataCollectionList" size="small" border style="width:100%" height="100%">
              <el-table-column type="index" label="序号" width="45" align="center" />
              <el-table-column prop="DataPointName" label="项目" min-width="110" show-overflow-tooltip />
              <el-table-column label="结果(DataValue)" min-width="240">
                <template #default="scope">
                  <div>
                    <template v-if="scope.row.Type === 'Boolean'">
                      <el-radio-group v-model="scope.row.value" @change="validateItem(scope.row)">
                        <el-radio value="true">{{ scope.row.BooleanTrue || '合格' }}</el-radio>
                        <el-radio value="false">{{ scope.row.BooleanFalse || '不合格' }}</el-radio>
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

  <!-- 历史采集数据 Dialog -->
  <el-dialog
    v-model="historyDialogVisible"
    title="历史采集数据"
    draggable
    width="800px"
    :close-on-click-modal="false"
    align-center
  >
    <el-tabs v-model="historyActiveTab" type="border-card">
      <el-tab-pane
        v-for="(group, idx) in historyData"
        :key="idx"
        :label="group.SpecName || '工序' + (idx + 1)"
        :name="String(idx)"
      >
        <el-table :data="group.Records" size="small" border style="width: 100%" max-height="400">
          <el-table-column type="index" label="序号" width="50" align="center" />
          <el-table-column prop="TxnDate" label="采集时间" width="170" />
          <el-table-column prop="DataName" label="数据项" min-width="150" show-overflow-tooltip />
          <el-table-column prop="DataValue" label="采集值" min-width="90" />
          <el-table-column prop="LowerLimit" label="下限" width="80" align="center">
            <template #default="scope">
              <span>{{ scope.row.LowerLimit ?? '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="UpperLimit" label="上限" width="80" align="center">
            <template #default="scope">
              <span>{{ scope.row.UpperLimit ?? '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="UOMName" label="单位" width="90" align="center">
            <template #default="scope">
              <span>{{ scope.row.UOMName || '-' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-empty v-if="historyData.length === 0" description="暂无历史采集数据" />
  </el-dialog>

  <!-- 当前SN工序附件上传 Dialog -->
  <el-dialog
    v-model="attachmentDialogVisible"
    title="附件上传"
    draggable
    width="620px"
    :close-on-click-modal="false"
    align-center
  >
    <div class="attachment-dialog-summary">
      <span>SN：{{ info.ContainerName || '-' }}</span>
      <span>当前工序：{{ info.SpecName || '-' }}</span>
      <span>单文件不大于 100MB，附件将在点击“提交采集数据”时一起上传</span>
    </div>
    <div class="mb-3">
      <el-button type="primary" @click="openAttachmentFilePicker">选择附件</el-button>
      <input
        ref="attachmentFileInputRef"
        class="hidden"
        type="file"
        multiple
        @change="handleAttachmentFileChange"
      />
    </div>
    <el-table v-if="attachmentFiles.length > 0" :data="attachmentFiles" size="small" border max-height="360">
      <el-table-column prop="name" label="文件名" min-width="300" show-overflow-tooltip />
      <el-table-column label="大小" width="110" align="right">
        <template #default="scope">{{ formatAttachmentSize(scope.row.size) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template #default="scope">
          <el-button type="danger" link @click="removeAttachment(scope.$index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-else description="暂未选择附件" :image-size="80" />
    <template #footer>
      <el-button type="primary" @click="attachmentDialogVisible = false">完成</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { WorkCenterQuery, MfgLineQuery, ContainerOperationQuery, ContainerOperationExecution, ComponentIssueSNQuery, ContainerDataPointHistoryQuery, ContainerOperationUploadSpecAttachment } from "@/api/operate";

const router = useRouter();
const { push } = router;
const goBatchDataCollection = () => {
  router.push('/dipWork/batchDataCollection');
};

const hasBatchDataCollection = computed(() => {
  const routes = router.getRoutes();
  return routes.some((r) => r.name === 'batchDataCollection');
});
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

type StationAttachment = {
  name: string;
  size: number;
  file: File;
};

const MAX_ATTACHMENT_SIZE = 100 * 1024 * 1024;
const attachmentDialogVisible = ref(false);
const dataCollectionSubmitting = ref(false);
const attachmentFileInputRef = ref<HTMLInputElement>();
const attachmentFiles = ref<StationAttachment[]>([]);

const resolveOperatorName = () => {
  const loginName = localStorage.getItem('LOGINNAME');
  if (loginName) return loginName.trim();

  const userInfo = userStore.getUserInfo;
  if (typeof userInfo === 'string' || typeof userInfo === 'number') {
    return String(userInfo).trim();
  }
  if (userInfo && typeof userInfo === 'object') {
    return String(
      userInfo.EmployeeName || userInfo.UserName || userInfo.userName || userInfo.Account || '',
    ).trim();
  }
  return '';
};

const clearAttachmentSelection = () => {
  attachmentFiles.value = [];
  attachmentDialogVisible.value = false;
  if (attachmentFileInputRef.value) attachmentFileInputRef.value.value = '';
};

const openAttachmentUpload = () => {
  if (!info.value.ContainerName) {
    ElMessage.warning('请先扫描条码');
    return;
  }
  if (!info.value.SpecName) {
    ElMessage.warning('当前数据缺少工序，无法上传附件');
    return;
  }
  attachmentDialogVisible.value = true;
};

const openAttachmentFilePicker = () => {
  attachmentFileInputRef.value?.click();
};

const handleAttachmentFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const selectedFiles = Array.from(input.files || []);
  input.value = '';
  if (selectedFiles.length === 0) return;

  const nextFiles = [...attachmentFiles.value];
  const existingNames = new Set(nextFiles.map(file => file.name));
  const oversizedFiles: string[] = [];
  const duplicateFiles: string[] = [];

  selectedFiles.forEach((file) => {
    if (file.size > MAX_ATTACHMENT_SIZE) {
      oversizedFiles.push(file.name);
      return;
    }
    if (existingNames.has(file.name)) {
      duplicateFiles.push(file.name);
      return;
    }
    nextFiles.push({ name: file.name, size: file.size, file });
    existingNames.add(file.name);
  });

  attachmentFiles.value = nextFiles;
  if (oversizedFiles.length > 0) {
    ElMessage.error(`以下文件超过100MB，已跳过：${oversizedFiles.join('、')}`);
  }
  if (duplicateFiles.length > 0) {
    ElMessage.warning(`以下同名附件已存在，已跳过：${duplicateFiles.join('、')}`);
  }
};

const removeAttachment = (index: number) => {
  attachmentFiles.value.splice(index, 1);
};

const formatAttachmentSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

const fileToBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    const result = String(reader.result || '');
    const separatorIndex = result.indexOf(',');
    resolve(separatorIndex >= 0 ? result.slice(separatorIndex + 1) : result);
  };
  reader.onerror = () => reject(reader.error || new Error(`附件读取失败：${file.name}`));
  reader.readAsDataURL(file);
});

const buildAttachmentUploadPayload = async () => {
  const operatorBy = resolveOperatorName();
  if (!operatorBy) {
    throw new Error('未获取到当前操作人，无法上传附件');
  }

  const files = await Promise.all(attachmentFiles.value.map(async attachment => ({
    FileName: attachment.name,
    Base64String: await fileToBase64(attachment.file),
  })));
  return {
    OperatorBy: operatorBy,
    Items: [{
      SN: info.value.ContainerName,
      Specs: [{
        SpecName: info.value.SpecName,
        Files: files,
      }],
    }],
  };
};

// ====== 历史采集数据 ======
const historyDialogVisible = ref(false);
const historyData = ref<any[]>([]);
const historyActiveTab = ref("0");

const handleHistoryQuery = async () => {
  if (!info.value.ContainerName) {
    ElMessage.warning("请先扫描条码");
    return;
  }
  const res: any = await ContainerDataPointHistoryQuery(info.value.ContainerName);
  if (res && res.success && res.code === 0) {
    historyData.value = res.content || [];
    historyActiveTab.value = "0";
    historyDialogVisible.value = true;
  } else {
    ElMessage.error((res && res.msg) || "查询历史采集数据失败");
    historyData.value = [];
  }
};

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
  clearAttachmentSelection();
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
  // 精追有内容且未全部扫码时卡控
  const unscanned = snData.value.filter((row) => !row.scannedSN);
  if (unscanned.length > 0) {
    ElMessage.warning("请先完成SN精追条码扫描");
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
    OperatorBy: userStore.getUserInfo,
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
    OperatorBy: userStore.getUserInfo,
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
  const params = {
    ContainerName: info.value.ContainerName, TaskName: info.value.TaskName || "",
    TaskListName: info.value.TaskListName, ServiceName: "MoveStd",
    DataCollectionDefId: "", DataCollectionDefName: "", ResourceName: info.value.ResourceName || "",
    operationEntityComponentIssueLists: [], operationEntityDataCollectionLists: [],
    OperatorBy: userStore.getUserInfo,
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
  item._errorType = "";
  if (item.Type === 'Boolean' || item.Type === 'Timestamp') {
    if (item.IsRequired && (item.value === "" || item.value === undefined || item.value === null)) {
      item._error = true;
      item._errorType = 'required';
      item._errorMsg = `${item.DataPointName} 为必填项`;
    }
    return;
  }
  if (item.IsRequired && (!item.value || String(item.value).trim() === '')) {
    item._error = true;
    item._errorType = 'required';
    item._errorMsg = `${item.DataPointName} 为必填项`;
    return;
  }
  if (item.value && !isNaN(Number(item.value))) {
    const num = Number(item.value);
    if (item.LowerLimit !== "" && item.LowerLimit !== null && item.LowerLimit !== undefined && num < Number(item.LowerLimit)) {
      item._error = true;
      item._errorType = 'range';
      item._errorMsg = `${item.DataPointName} 不能小于 ${item.LowerLimit}`;
      return;
    }
    if (item.UpperLimit !== "" && item.UpperLimit !== null && item.UpperLimit !== undefined && num > Number(item.UpperLimit)) {
      item._error = true;
      item._errorType = 'range';
      item._errorMsg = `${item.DataPointName} 不能大于 ${item.UpperLimit}`;
      return;
    }
  }
};

const handleScan = async () => {
  if (!barcode.value) return;
  // 每次扫码前从 OPUIData 读取最新车间产线（TagsView 弹窗可能已改）
  const opuiData = localStorage.getItem("OPUIData");
  if (opuiData) {
    try {
      const data = JSON.parse(opuiData);
      if (data.workShop) selectedWorkCenter.value = data.workShop;
      if (data.line) selectedMfgLine.value = data.line;
    } catch {}
  }
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
    clearAttachmentSelection();
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
      // 如果没有SN精追数据，自动提交
      const hasSN = (d.rebornComponentIssueLists || []).some((m: any) => m.TypeName === 'SN');
      if (!hasSN) {
        submitComponentIssue();
      }
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
  let hasRequiredError = false;
  const rangeErrors: string[] = [];
  dataCollectionList.value.forEach((item) => {
    validateItem(item);
    if (item._error) {
      if (item._errorType === 'required') {
        hasRequiredError = true;
      } else {
        rangeErrors.push(`「${item.DataPointName}」超出范围（<span style="color:#f56c6c">${item.LowerLimit || '-'} ~ ${item.UpperLimit || '-'}</span>），当前值：<span style="color:#79bbff">${item.value}</span>`);
      }
    }
  });
  if (hasRequiredError) {
    ElMessageBox.alert("请检查数据采集项中的错误提示", "提示", {
      confirmButtonText: "确定", type: "warning",
    });
    return;
  }
  if (rangeErrors.length > 0) {
    try {
      await ElMessageBox.confirm(
        `以下数据采集项数值超出范围：<br/>${rangeErrors.join('<br/>')}`,
        "提示",
        {
          confirmButtonText: "继续提交",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
        }
      );
    } catch {
      return;
    }
  }
  dataCollectionSubmitting.value = true;
  let attachmentsUploaded = false;
  try {
    if (attachmentFiles.value.length > 0) {
      const attachmentParams = await buildAttachmentUploadPayload();
      const attachmentRes: any = await ContainerOperationUploadSpecAttachment(attachmentParams);
      if (!attachmentRes || !attachmentRes.success || attachmentRes.code !== 0) {
        ElMessage.error((attachmentRes && attachmentRes.msg) || '附件上传失败，已取消本次提交');
        return;
      }
      attachmentsUploaded = true;
      clearAttachmentSelection();
    }

    const params = {
      ContainerName: info.value.ContainerName, TaskName: info.value.TaskName, TaskListName: info.value.TaskListName,
      ServiceName: serviceType.value, DataCollectionDefId: info.value.DataCollectionDefId,
      DataCollectionDefName: rightTitle.value, ResourceName: info.value.ResourceName,
      operationEntityComponentIssueLists: [],
      operationEntityDataCollectionLists: dataCollectionList.value.map((item) => ({
        DataPointName: item.DataPointName, DataType: item.Type, DataValue: item.value,
      })),
      OperatorBy: userStore.getUserInfo,
    };
    const res: any = await ContainerOperationExecution(params);
    if (res.success && res.code === 0) {
      if (attachmentsUploaded) ElMessage.success('提交成功，附件已上传');
      autoReScan();
    } else {
      const prefix = attachmentsUploaded ? '附件已上传，但' : '';
      ElMessageBox.alert(`${prefix}${res.msg || '提交失败'}`, "错误", {
        confirmButtonText: "确定", type: "error",
      });
    }
  } catch (error) {
    console.error('生产过站数据提交失败', error);
    ElMessage.error(error instanceof Error ? error.message : '提交失败，请稍后重试');
  } finally {
    dataCollectionSubmitting.value = false;
  }
};

onMounted(() => {
  getWorkCenters();
  // 读取 TagsView 设置的车间产线（OPUIData）
  const opuiData = localStorage.getItem("OPUIData");
  if (opuiData) {
    try {
      const data = JSON.parse(opuiData);
      if (data.workShop) {
        selectedWorkCenter.value = data.workShop;
        handleWorkCenterChange(data.workShop);
      }
      if (data.line) {
        selectedMfgLine.value = data.line;
      }
    } catch {}
  }
});

</script>

<style scoped>
:deep(.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

.attachment-dialog-summary {
  display: flex;
  margin-bottom: 12px;
  flex-direction: column;
  gap: 4px;
  color: #606266;
}
</style>
