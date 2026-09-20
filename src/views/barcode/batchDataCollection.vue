<template>
  <div class="flex flex-col h-full">
    <!-- 标题 -->
    <div class="h-[40px] pl-2 pr-2 flex items-center bg-[#006487] text-white text-lg font-bold flex-shrink-0">
      <span>批量进站</span>
    </div>

    <div class="flex flex-col flex-1 min-h-0 p-2 gap-2">
      <!-- ====== 进站模块 ====== -->
      <div class="bg-white rounded shadow-sm flex flex-wrap items-center gap-3 px-3 py-2 flex-shrink-0">
        <div class="flex items-center">
          <el-radio v-model="entryMode" value="sn" class="m-2" @change="handleRadioChange">批量SN进站</el-radio>
          <el-input v-model="snInput" placeholder="请输入SN" size="large" clearable style="width: 180px"
            @keyup.enter="snInput && handleQuery()" />
        </div>
        <div class="flex items-center gap-3">
          <el-radio v-model="entryMode" value="order" class="m-2" @change="handleRadioChange">工单进站</el-radio>
          <el-select v-model="mfgOrder" placeholder="请选择工单" size="large" clearable filterable style="width: 240px"
            @change="mfgOrder && handleQuery()">
            <el-option v-for="item in mfgOrderOptions" :key="item.MfgOrderName" :label="item.MfgOrderName" :value="item.MfgOrderName" />
          </el-select>
        </div>
        <div class="flex items-center gap-3">
          <el-radio v-model="entryMode" value="resource" class="m-2" @change="handleRadioChange">设备进站</el-radio>
          <el-select v-model="resourceName" placeholder="请选择设备" size="large" clearable filterable style="width: 240px"
            @change="resourceName && handleQuery()">
            <el-option v-for="item in resourceOptions" :key="item.ResourceName" :label="item.ResourceName" :value="item.ResourceName" />
          </el-select>
        </div>
        <div class="flex items-center gap-3">
          <el-radio v-model="entryMode" value="orderSpec" class="m-2" @change="handleRadioChange">工单工序进站</el-radio>
          <el-select
            v-model="collectionMfgOrder"
            placeholder="请选择工单"
            size="large"
            clearable
            filterable
            style="width: 220px"
            @change="handleCollectionOrderChange"
          >
            <el-option
              v-for="item in mfgOrderOptions"
              :key="item.MfgOrderName"
              :label="item.MfgOrderName"
              :value="item.MfgOrderName"
            />
          </el-select>
          <el-select
            v-model="collectionSpecName"
            placeholder="请选择工序"
            size="large"
            clearable
            filterable
            :disabled="!collectionMfgOrder"
            style="width: 180px"
            @change="handleCollectionSpecChange"
          >
            <el-option
              v-for="item in collectionSpecOptions"
              :key="`${item.WorkflowName}-${item.WorkflowRevision}-${item.Sequence}-${item.SpecName}`"
              :label="item.SpecName"
              :value="item.SpecName"
            />
          </el-select>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <el-button type="primary" size="large" @click="handleSubmit">提交</el-button>
          <el-button type="warning" size="large" :loading="batchMoveStdLoading" @click="handleBatchMoveStd">
            批量出站
          </el-button>
          <el-button size="large" @click="router.push('/dipWork/productionStation')">生产过站</el-button>
        </div>
      </div>

      <!-- ====== 工单信息 ====== -->
      <div class="bg-white rounded shadow-sm flex flex-col flex-shrink-0">
        <div class="h-[35px] flex items-center text-white bg-[#006487] px-3 flex-shrink-0">
          <span>工单信息</span>
        </div>
        <div class="p-3">
          <el-form size="small" label-width="80px">
            <el-row :gutter="16">
              <el-col :span="6">
                <el-form-item label="工单号"><span class="font-bold">{{ info.MfgOrderName || '-' }}</span></el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="工单状态">
                  <el-tag v-if="info.OrderStatusName" type="success" size="small">{{ info.OrderStatusName }}</el-tag>
                  <span v-else class="text-gray-400">-</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="工单数量"><span class="font-bold">{{ info.PlannedQuantity ?? '-' }}</span></el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="完成数量"><span class="font-bold text-[#00B400]">{{ info.CompletedQuantity ?? '0' }}</span></el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="当前工序"><span class="font-bold">{{ info.SpecName || '-' }}</span></el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="设备名称"><span class="font-bold">{{ info.ResourceName || '-' }}</span></el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="存货代码"><span class="font-bold">{{ info.InvAddCode || '-' }}</span></el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品编码"><span class="font-bold">{{ info.ProductName || '-' }}</span></el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品型号"><span class="font-bold">{{ info.ProductFamily || '-' }}</span></el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品名称"><span class="font-bold">{{ info.ProductDesc || '-' }}</span></el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- ====== 操作区 ====== -->
      <div class="flex-1 bg-white rounded shadow-sm flex flex-col min-h-0">
        <div class="h-[35px] flex items-center text-white bg-[#006487] px-3 flex-shrink-0">
          <span>操作区</span>
        </div>
        <!-- 空状态 -->
        <div class="flex-1 p-3 flex flex-col min-h-0" v-if="batchList.length === 0">
          <div class="flex items-center justify-center h-full text-gray-400 text-lg">扫描条码后显示操作内容</div>
        </div>
        <!-- 表格容器 - 添加滚动 -->
        <div class="flex-1 p-2 min-h-0 overflow-hidden" v-else>
          <div class="h-full operation-virtual-table-wrap">
            <el-auto-resizer>
              <template #default="{ height, width }">
                <el-table-v2
                  class="operation-virtual-table"
                  :columns="operationColumns"
                  :data="batchList"
                  :width="width"
                  :height="height"
                  :header-height="operationHeaderHeight"
                  :row-height="58"
                  :cache="6"
                  row-key="ContainerName"
                  fixed
                  scrollbar-always-on
                  :row-class="operationRowClass"
                >
                  <template #header-cell="{ column }">
                    <div class="virtual-header-cell">
                      <div class="virtual-header-title" :title="column.title">
                        {{ column.title }}
                      </div>
                      <div
                        class="virtual-header-reference"
                        :title="column.kind === 'data' ? (column.item.ReferenceStandard || '-') : ''"
                      >
                        <span v-if="column.kind === 'container'" class="font-bold">参考标准</span>
                        <span v-else-if="column.kind === 'data'">
                          {{ column.item.ReferenceStandard || '-' }}
                        </span>
                      </div>
                      <div v-if="hasBatchOperations" class="virtual-header-batch">
                        <span v-if="column.kind === 'container'" class="font-bold">批量操作</span>
                        <div v-else-if="column.kind === 'data' && column.item.Type === 'Boolean'" class="flex justify-center gap-1">
                          <el-button size="small" @click="batchSetBoolean(column.itemIndex, 'true')">
                            {{ column.item.BooleanTrue || '合格' }}
                          </el-button>
                          <el-button size="small" type="danger" @click="batchSetBoolean(column.itemIndex, 'false')">
                            {{ column.item.BooleanFalse || '不合格' }}
                          </el-button>
                        </div>
                        <el-input
                          v-else-if="column.kind === 'data'"
                          :model-value="getBatchInputValue(column)"
                          size="small"
                          placeholder="输入后回车"
                          @update:model-value="(value: any) => setBatchInputValue(column, value)"
                          @keyup.enter.stop="batchSetInput(column)"
                        />
                      </div>
                    </div>
                  </template>

                  <template #cell="{ rowData, column }">
                    <div v-if="column.kind === 'container'" class="virtual-sn-cell" :title="rowData.ContainerName">
                      {{ rowData.ContainerName }}
                    </div>
                    <div v-else-if="column.kind === 'history'" class="virtual-history-cell">
                      <el-button type="primary" size="small" @click="openHistory(rowData)">查看</el-button>
                    </div>
                    <template v-else-if="column.kind === 'data'">
                      <el-radio-group
                        v-if="column.item.Type === 'Boolean'"
                        :model-value="rowData.values[column.itemIndex]"
                        size="small"
                        @update:model-value="(value: any) => updateCellValue(rowData, column, value)"
                      >
                        <el-radio value="true">{{ column.item.BooleanTrue || '合格' }}</el-radio>
                        <el-radio value="false">{{ column.item.BooleanFalse || '不合格' }}</el-radio>
                      </el-radio-group>
                      <div v-else class="virtual-input-cell">
                        <el-input
                          :model-value="rowData.values[column.itemIndex]"
                          size="small"
                          :placeholder="column.item.DataPointName"
                          :class="{ 'is-error': rowData._errors?.[column.itemIndex]?.error }"
                          @update:model-value="(value: any) => updateCellValue(rowData, column, value)"
                          @blur="validateCell(rowData, column.itemIndex)"
                        />
                        <div v-if="rowData._errors?.[column.itemIndex]?.error" class="virtual-cell-error">
                          {{ rowData._errors[column.itemIndex].msg }}
                        </div>
                      </div>
                    </template>
                  </template>
                </el-table-v2>
              </template>
            </el-auto-resizer>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史数据 Dialog -->
    <el-dialog v-model="historyDialogVisible" title="历史采集数据" draggable width="800px" :close-on-click-modal="false" align-center>
      <el-tabs v-model="historyActiveTab" type="border-card">
        <el-tab-pane v-for="(group, idx) in historySpecList" :key="idx" :label="group.SpecName || '工序' + (idx + 1)" :name="String(idx)">
          <el-table :data="group.HistoryRecords" size="small" border style="width:100%" max-height="400">
            <el-table-column type="index" label="序号" width="50" align="center" />
            <el-table-column prop="TxnDate" label="采集时间" width="170" />
            <el-table-column prop="DataName" label="数据项" min-width="150" show-overflow-tooltip />
            <el-table-column prop="DataValue" label="采集值" min-width="90" />
            <el-table-column prop="LowerLimit" label="下限" width="80" align="center">
              <template #default="s"><span>{{ s.row.LowerLimit ?? '-' }}</span></template>
            </el-table-column>
            <el-table-column prop="UpperLimit" label="上限" width="80" align="center">
              <template #default="s"><span>{{ s.row.UpperLimit ?? '-' }}</span></template>
            </el-table-column>
            <el-table-column prop="UOMName" label="单位" width="90" align="center">
              <template #default="s"><span>{{ s.row.UOMName || '-' }}</span></template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-empty v-if="historySpecList.length === 0" description="暂无历史采集数据" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onDeactivated, computed, watch } from "vue";
import type { Column } from "element-plus";
import { TableV2FixedDir } from "element-plus";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  ContainersOperationMfgOrderQuery,
  ContainersOperationMfgOrderDetailQuery,
  ContainersOperationMfgOrderCollectionSpecQuery,
  ContainersOperationMfgOrderCollectionDetailQuery,
  ContainersOperationContainerDetailQuery,
  ContainersOperationResourceQuery,
  ContainersOperationResourceDetailQuery,
  ContainersOperationContainerOperationExecution,
  ContainersOperationBatchMoveStd,
} from "@/api/operate";
import { useUserStoreWithOut } from '@/stores/modules/user';
import { loadPageDraft, savePageDraft } from '@/utils/pageDraftStorage';

const router = useRouter();
const userStore = useUserStoreWithOut();
const draftUserName = resolveDraftUserName();
const draftStorageKey = draftUserName ? `batchDataCollection:v1:${draftUserName}` : '';
const entryMode = ref("sn");

const handleRadioChange = () => {
  if (entryMode.value === 'sn' && snInput.value) {
    handleQuery();
  } else if (entryMode.value === 'order' && mfgOrder.value) {
    handleQuery();
  } else if (entryMode.value === 'orderSpec' && collectionMfgOrder.value && collectionSpecName.value) {
    handleQuery();
  } else if (entryMode.value === 'resource' && resourceName.value) {
    handleQuery();
  }
};
const snInput = ref("");
const mfgOrder = ref("");
const mfgOrderOptions = ref<any[]>([]);
const collectionMfgOrder = ref("");
const collectionSpecName = ref("");
const collectionSpecOptions = ref<any[]>([]);
const resourceName = ref("");
const resourceOptions = ref<any[]>([]);

const handleCollectionOrderChange = async (value: string) => {
  entryMode.value = 'orderSpec';
  collectionSpecName.value = '';
  collectionSpecOptions.value = [];
  if (!value) return;

  const res: any = await ContainersOperationMfgOrderCollectionSpecQuery(value);
  if (res && res.success && res.code === 0) {
    collectionSpecOptions.value = [...(res.content || [])].sort(
      (a: any, b: any) => Number(a.Sequence || 0) - Number(b.Sequence || 0),
    );
  } else {
    ElMessage.error((res && res.msg) || '工序查询失败');
  }
};

const handleCollectionSpecChange = (value: string) => {
  if (!value || !collectionMfgOrder.value) return;
  entryMode.value = 'orderSpec';
  handleQuery();
};

const info = ref({
  MfgOrderName: "", OrderStatusName: "", PlannedQuantity: null as number | null,
  CompletedQuantity: null as number | null, SpecName: "", ResourceName: "",
  InvAddCode: "", ProductName: "", ProductFamily: "", ProductDesc: "",
});
const dataCollectionItems = ref<any[]>([]);
const batchList = ref<any[]>([]);
const lastKeyFields = ref<any>({});
const batchMoveStdLoading = ref(false);
const batchInputValues = ref<Record<string, string>>({});

const normalizeCellValue = (type: string, value: any) => {
  if (type === 'Integer') {
    return String(value ?? '').replace(/[^0-9-]/g, '');
  }
  if (type === 'Float') {
    return String(value ?? '').replace(/[^0-9.-]/g, '');
  }
  return value;
};

const batchSetBoolean = (idx: number, value: any) => {
  batchList.value.forEach((row: any) => {
    row.values[idx] = value;
    row._errors[idx] = { error: false, type: '', msg: '' };
  });
};

const validateCell = (row: any, idx: number) => {
  const item = dataCollectionItems.value[idx];
  const val = row.values[idx];
  row._errors[idx] = { error: false, type: '', msg: '' };
  if (item.IsRequired && (!val || String(val).trim() === '')) {
    row._errors[idx] = { error: true, type: 'required', msg: `${item.DataPointName} 为必填项` };
    return;
  }
  if (val && !isNaN(Number(val)) && (item.LowerLimit || item.UpperLimit)) {
    const num = Number(val);
    if (item.LowerLimit && num < Number(item.LowerLimit)) {
      row._errors[idx] = { error: true, type: 'range', msg: `不能小于 ${item.LowerLimit}` };
    }
    if (item.UpperLimit && num > Number(item.UpperLimit)) {
      row._errors[idx] = { error: true, type: 'range', msg: `不能大于 ${item.UpperLimit}` };
    }
  }
};

type OperationColumn = Column<any> & {
  kind: 'container' | 'data' | 'history';
  itemIndex?: number;
  item?: any;
};

const hasBatchOperations = computed(() => dataCollectionItems.value.length > 0);

const operationHeaderHeight = computed(() => hasBatchOperations.value ? 138 : 92);

const operationColumns = computed<OperationColumn[]>(() => [
  {
    key: 'ContainerName',
    dataKey: 'ContainerName',
    title: 'SN码',
    width: 160,
    fixed: TableV2FixedDir.LEFT,
    kind: 'container',
  },
  ...dataCollectionItems.value.map((item: any, itemIndex: number) => ({
    key: `collection-${itemIndex}-${item.DataPointName}`,
    dataKey: `values.${itemIndex}`,
    title: item.DataPointName,
    width: Math.max(210, Math.min(320, Array.from(String(item.DataPointName || '')).length * 14 + 48)),
    align: 'center' as const,
    kind: 'data' as const,
    itemIndex,
    item,
  })),
  {
    key: 'history',
    dataKey: 'history',
    title: '查看历史',
    width: 90,
    fixed: TableV2FixedDir.RIGHT,
    align: 'center',
    kind: 'history',
  },
]);

const operationRowClass = ({ rowIndex }: { rowIndex: number }) =>
  rowIndex % 2 === 1 ? 'operation-v2-row--striped' : '';

const getBatchInputKey = (column: OperationColumn) => String(column.key);

const getBatchInputValue = (column: OperationColumn) =>
  batchInputValues.value[getBatchInputKey(column)] ?? '';

const setBatchInputValue = (column: OperationColumn, value: any) => {
  const key = getBatchInputKey(column);
  batchInputValues.value[key] = normalizeCellValue(column.item?.Type, value);
};

const batchSetInput = (column: OperationColumn) => {
  const idx = Number(column.itemIndex);
  const value = normalizeCellValue(column.item?.Type, getBatchInputValue(column));
  batchInputValues.value[getBatchInputKey(column)] = value;
  batchList.value.forEach((row: any) => {
    row.values[idx] = value;
    validateCell(row, idx);
  });
};

const updateCellValue = (row: any, column: OperationColumn, value: any) => {
  const idx = Number(column.itemIndex);
  const type = column.item?.Type;
  const nextValue = normalizeCellValue(type, value);
  row.values[idx] = nextValue;
  if (type === 'Integer' || type === 'Float' || type === 'Boolean') {
    validateCell(row, idx);
  }
};

type BatchDataCollectionDraft = {
  version: 1;
  savedAt: number;
  entryMode: string;
  snInput: string;
  mfgOrder: string;
  collectionMfgOrder: string;
  collectionSpecName: string;
  collectionSpecOptions: any[];
  resourceName: string;
  info: Record<string, any>;
  dataCollectionItems: any[];
  batchList: any[];
  lastKeyFields: Record<string, any>;
};

let draftPersistenceReady = false;
let draftSaveTimer: ReturnType<typeof setTimeout> | undefined;
let draftWriteQueue: Promise<void> = Promise.resolve();

function resolveDraftUserName() {
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
}

function createDraftSnapshot(): BatchDataCollectionDraft {
  return JSON.parse(JSON.stringify({
    version: 1,
    savedAt: Date.now(),
    entryMode: entryMode.value,
    snInput: snInput.value,
    mfgOrder: mfgOrder.value,
    collectionMfgOrder: collectionMfgOrder.value,
    collectionSpecName: collectionSpecName.value,
    collectionSpecOptions: collectionSpecOptions.value,
    resourceName: resourceName.value,
    info: info.value,
    dataCollectionItems: dataCollectionItems.value,
    batchList: batchList.value,
    lastKeyFields: lastKeyFields.value,
  })) as BatchDataCollectionDraft;
}

function persistDraftNow() {
  if (!draftPersistenceReady || !draftStorageKey) return;
  if (draftSaveTimer !== undefined) {
    clearTimeout(draftSaveTimer);
    draftSaveTimer = undefined;
  }

  let snapshot: BatchDataCollectionDraft;
  try {
    snapshot = createDraftSnapshot();
  } catch (error) {
    console.warn('批量进站页面草稿序列化失败', error);
    return;
  }

  draftWriteQueue = draftWriteQueue
    .catch(() => undefined)
    .then(() => savePageDraft(draftStorageKey, snapshot));
}

function scheduleDraftSave() {
  if (!draftPersistenceReady || !draftStorageKey) return;
  if (draftSaveTimer !== undefined) clearTimeout(draftSaveTimer);
  draftSaveTimer = setTimeout(persistDraftNow, 400);
}

async function restoreDraft() {
  if (!draftStorageKey) return;
  const draft = await loadPageDraft<BatchDataCollectionDraft>(draftStorageKey);
  if (!draft || draft.version !== 1) return;

  const validModes = ['sn', 'order', 'resource', 'orderSpec'];
  entryMode.value = validModes.includes(draft.entryMode) ? draft.entryMode : 'sn';
  snInput.value = String(draft.snInput || '');
  mfgOrder.value = String(draft.mfgOrder || '');
  collectionMfgOrder.value = String(draft.collectionMfgOrder || '');
  collectionSpecName.value = String(draft.collectionSpecName || '');
  collectionSpecOptions.value = Array.isArray(draft.collectionSpecOptions)
    ? draft.collectionSpecOptions
    : [];
  resourceName.value = String(draft.resourceName || '');

  if (draft.info && typeof draft.info === 'object') {
    info.value = { ...info.value, ...draft.info };
  }
  dataCollectionItems.value = Array.isArray(draft.dataCollectionItems)
    ? draft.dataCollectionItems
    : [];
  batchList.value = Array.isArray(draft.batchList)
    ? draft.batchList.map((row: any) => ({
        ...row,
        values: dataCollectionItems.value.map((_: any, index: number) => row.values?.[index] ?? ''),
        _errors: dataCollectionItems.value.map((_: any, index: number) =>
          row._errors?.[index] ?? { error: false, type: '', msg: '' },
        ),
      }))
    : [];
  lastKeyFields.value = draft.lastKeyFields && typeof draft.lastKeyFields === 'object'
    ? draft.lastKeyFields
    : {};
}

watch(
  [
    entryMode,
    snInput,
    mfgOrder,
    collectionMfgOrder,
    collectionSpecName,
    collectionSpecOptions,
    resourceName,
    info,
    dataCollectionItems,
    batchList,
    lastKeyFields,
  ],
  scheduleDraftSave,
  { deep: true, flush: 'post' },
);

const handlePageHide = () => persistDraftNow();
const handleVisibilityChange = () => {
  if (document.visibilityState === 'hidden') persistDraftNow();
};

onDeactivated(persistDraftNow);

onBeforeUnmount(() => {
  window.removeEventListener('pagehide', handlePageHide);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  persistDraftNow();
});

// 历史数据弹窗
const historyDialogVisible = ref(false);
const historyActiveTab = ref("0");
const historySpecList = ref<any[]>([]);

const openHistory = (row: any) => {
  historySpecList.value = row.SpecHistoryList || [];
  historyActiveTab.value = "0";
  historyDialogVisible.value = true;
};

const getKeyFields = (d: any) => ({
  MfgOrderName: d.MfgOrderName ?? "", SpecName: d.SpecName ?? "", ResourceName: d.ResourceName ?? "",
  InvAddCode: d.InvAddCode ?? "", ProductName: d.ProductName ?? "", ProductFamily: d.ProductFamily ?? "",
  ProductDesc: d.ProductDesc ?? "", ServiceName: d.ServiceName ?? "", TaskListName: d.TaskListName ?? "",
  TaskName: d.TaskName ?? "", DataCollectionDefId: d.DataCollectionDefId ?? "",
  DataCollectionDefName: d.DataCollectionDefName ?? "",
});

const keysMatch = (a: any, b: any) => {
  const fields = ['MfgOrderName', 'SpecName', 'ResourceName', 'InvAddCode', 'ProductName', 'ProductFamily', 'ProductDesc', 'ServiceName', 'TaskListName', 'TaskName', 'DataCollectionDefId', 'DataCollectionDefName'];
  return fields.every(f => a[f] === b[f]);
};

const handleQuery = async () => {
  let res: any;
  if (entryMode.value === 'sn') {
    if (!snInput.value) { ElMessage.warning('请输入SN'); return; }
    const scannedSN = snInput.value;
    res = await ContainersOperationContainerDetailQuery(scannedSN);
    snInput.value = '';
  } else if (entryMode.value === 'order') {
    if (!mfgOrder.value) { ElMessage.warning('请选择工单'); return; }
    res = await ContainersOperationMfgOrderDetailQuery(mfgOrder.value);
  } else if (entryMode.value === 'orderSpec') {
    if (!collectionMfgOrder.value) { ElMessage.warning('请选择工单'); return; }
    if (!collectionSpecName.value) { ElMessage.warning('请选择工序'); return; }
    res = await ContainersOperationMfgOrderCollectionDetailQuery(
      collectionMfgOrder.value,
      collectionSpecName.value,
    );
  } else {
    if (!resourceName.value) { ElMessage.warning('请选择设备'); return; }
    res = await ContainersOperationResourceDetailQuery(resourceName.value);
  }
  if (res && res.success && res.code === 0 && res.content) {
    const d = res.content;
    const newKeys = getKeyFields(d);
    const newItems = d.DataCollectionItems || [];
    const newBatches = (d.BatchList || []).map((b: any) => ({
      ...b,
      values: newItems.map(() => ''),
      _errors: newItems.map(() => ({ error: false, msg: '' })),
    }));

    info.value = {
      MfgOrderName: d.MfgOrderName ?? "", OrderStatusName: d.OrderStatusName ?? "",
      PlannedQuantity: d.PlannedQuantity ?? null, CompletedQuantity: d.CompletedQuantity ?? null,
      SpecName: d.SpecName ?? "", ResourceName: d.ResourceName ?? "",
      InvAddCode: d.InvAddCode ?? "", ProductName: d.ProductName ?? "",
      ProductFamily: d.ProductFamily ?? "", ProductDesc: d.ProductDesc ?? "",
    };
    dataCollectionItems.value = newItems;

    if (entryMode.value === 'order' || entryMode.value === 'orderSpec' || entryMode.value === 'resource') {
      // 工单/指定工序/设备模式：直接覆盖
      batchList.value = newBatches;
    } else {
      // SN模式：检查关键字段
      if (batchList.value.length === 0 || !keysMatch(lastKeyFields.value, newKeys)) {
        // 关键字段不同或无旧数据：替换
        batchList.value = newBatches;
      } else {
        // 关键字段相同：追加或覆盖
        newBatches.forEach((nb: any) => {
          const idx = batchList.value.findIndex((b: any) => b.ContainerName === nb.ContainerName);
          if (idx >= 0) {
            batchList.value[idx] = nb;
          } else {
            batchList.value.push(nb);
          }
        });
      }
    }
    lastKeyFields.value = newKeys;
  } else {
    ElMessage.error((res && res.msg) || '查询失败');
  }
};

const clearOperationData = () => {
  info.value = {
    MfgOrderName: "", OrderStatusName: "", PlannedQuantity: null,
    CompletedQuantity: null, SpecName: "", ResourceName: "", InvAddCode: "",
    ProductName: "", ProductFamily: "", ProductDesc: "",
  };
  batchList.value = [];
  dataCollectionItems.value = [];
  lastKeyFields.value = {};
};

const refreshCurrentQueryAfterSuccess = async () => {
  const shouldRefresh =
    (entryMode.value === 'order' && Boolean(mfgOrder.value)) ||
    (entryMode.value === 'resource' && Boolean(resourceName.value)) ||
    (entryMode.value === 'orderSpec' && Boolean(collectionMfgOrder.value) && Boolean(collectionSpecName.value));

  clearOperationData();
  if (shouldRefresh) {
    await handleQuery();
  }
};

const handleSubmit = async () => {
  if (batchList.value.length === 0) {
    ElMessage.warning('请先查询数据');
    return;
  }
  // 校验必填项 + 范围
  let hasRequiredError = false;
  const rangeErrors: string[] = [];
  for (const b of batchList.value) {
    for (let i = 0; i < dataCollectionItems.value.length; i++) {
      validateCell(b, i);
      if (b._errors[i].error) {
        if (b._errors[i].type === 'required') {
          hasRequiredError = true;
        } else {
          const item = dataCollectionItems.value[i];
          rangeErrors.push(`SN码 ${b.ContainerName} 的「${item.DataPointName}」超出范围（<span style="color:#f56c6c">${item.LowerLimit || '-'} ~ ${item.UpperLimit || '-'}</span>），当前值：<span style="color:#79bbff">${b.values[i]}</span>`);
        }
      }
    }
  }
  if (hasRequiredError) {
    ElMessage.warning("存在必填项未填写，请检查红色提示");
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
          customClass: "range-confirm-box",
        }
      );
    } catch {
      return;
    }
  }
  const params = {
    TaskName: lastKeyFields.value.TaskName || '',
    TaskListName: lastKeyFields.value.TaskListName || '',
    DataCollectionDefId: lastKeyFields.value.DataCollectionDefId || '',
    DataCollectionDefName: lastKeyFields.value.DataCollectionDefName || '',
    ServiceName: lastKeyFields.value.ServiceName || '',
    ResourceName: lastKeyFields.value.ResourceName || '',
    reBornContainerOperations: batchList.value.map((b: any) => ({
      ContainerName: b.ContainerName,
      operationEntityDataCollectionLists: dataCollectionItems.value.map((item: any, idx: number) => ({
        DataPointName: item.DataPointName,
        DataType: item.Type,
        DataValue: String(b.values[idx] ?? ''),
      })),
    })),
    OperatorBy: userStore.getUserInfo,
  };
  const res: any = await ContainersOperationContainerOperationExecution(params);
  if (res && res.success && res.code === 0) {
    ElMessage.success(res.msg || '提交成功');
    await refreshCurrentQueryAfterSuccess();
    persistDraftNow();
  } else {
    ElMessage.error((res && res.msg) || '执行失败');
  }
};

const handleBatchMoveStd = async () => {
  if (batchList.value.length === 0) {
    ElMessage.warning('请先查询数据');
    return;
  }

  const mfgOrderName = info.value.MfgOrderName || lastKeyFields.value.MfgOrderName || '';
  const currentResourceName = info.value.ResourceName || lastKeyFields.value.ResourceName || '';
  const containerNames = Array.from(new Set(
    batchList.value
      .map((item: any) => String(item.ContainerName || '').trim())
      .filter(Boolean),
  ));

  if (!mfgOrderName) {
    ElMessage.warning('当前数据缺少工单号，无法批量出站');
    return;
  }
  if (!currentResourceName) {
    ElMessage.warning('当前数据缺少设备名称，无法批量出站');
    return;
  }
  if (containerNames.length === 0) {
    ElMessage.warning('操作区没有可出站的SN码');
    return;
  }

  batchMoveStdLoading.value = true;
  try {
    const res: any = await ContainersOperationBatchMoveStd({
      MfgOrderName: mfgOrderName,
      ResourceName: currentResourceName,
      ContainerNames: containerNames,
    });
    if (res && res.success && res.code === 0) {
      ElMessage.success(res.msg || '批量出站成功');
      await refreshCurrentQueryAfterSuccess();
      persistDraftNow();
    } else {
      ElMessage.warning((res && res.msg) || '当前批次无法出站');
    }
  } finally {
    batchMoveStdLoading.value = false;
  }
};

onMounted(async () => {
  try {
    await restoreDraft();
  } catch (error) {
    console.warn('批量进站页面草稿恢复失败', error);
  } finally {
    draftPersistenceReady = true;
  }
  window.addEventListener('pagehide', handlePageHide);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  const res: any = await ContainersOperationMfgOrderQuery();
  if (res && res.success && res.code === 0) {
    mfgOrderOptions.value = res.content || [];
  }
  const resourceRes: any = await ContainersOperationResourceQuery();
  if (resourceRes && resourceRes.success && resourceRes.code === 0) {
    resourceOptions.value = resourceRes.content || [];
  }

  if (collectionMfgOrder.value && collectionSpecOptions.value.length === 0) {
    const specRes: any = await ContainersOperationMfgOrderCollectionSpecQuery(
      collectionMfgOrder.value,
    );
    if (specRes && specRes.success && specRes.code === 0) {
      collectionSpecOptions.value = [...(specRes.content || [])].sort(
        (a: any, b: any) => Number(a.Sequence || 0) - Number(b.Sequence || 0),
      );
    }
  }
});
</script>

<style>
/* ElMessageBox 挂载在 body 下，不能用 scoped */
.range-confirm-box {
  max-width: 600px;
}

.operation-virtual-table-wrap,
.operation-virtual-table-wrap > .el-auto-resizer {
  width: 100%;
  height: 100%;
}

.operation-virtual-table {
  border: 1px solid #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
}

.operation-virtual-table .el-table-v2__header-cell {
  padding: 0;
  border-right: 1px solid #ebeef5;
}

.operation-virtual-table .el-table-v2__row-cell {
  border-right: 1px solid #ebeef5;
}

.operation-virtual-table .operation-v2-row--striped {
  background: #fafafa;
}

.virtual-header-cell {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
}

.virtual-header-title,
.virtual-header-reference,
.virtual-header-batch {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  padding: 0 8px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.virtual-header-title {
  height: 46px;
  flex: 0 0 46px;
  color: #606266;
  font-weight: 600;
}

.virtual-header-reference {
  height: 46px;
  flex: 0 0 46px;
  border-top: 1px solid #dcdfe6;
  color: #606266;
  background: #f5f7fa;
}

.virtual-header-batch {
  height: 46px;
  flex: 0 0 46px;
  border-top: 1px solid #dcdfe6;
  color: #606266;
  background: #fff;
}

.virtual-sn-cell {
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.virtual-history-cell {
  display: flex;
  width: 100%;
  justify-content: center;
}

.virtual-input-cell {
  width: 100%;
}

.virtual-cell-error {
  overflow: hidden;
  margin-top: 2px;
  color: #f56c6c;
  font-size: 11px;
  line-height: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.operation-virtual-table .el-radio {
  margin-right: 10px;
}
</style>
