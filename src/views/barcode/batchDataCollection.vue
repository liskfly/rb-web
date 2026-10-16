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
          <el-button type="primary" size="large" :loading="submitLoading" @click="handleSubmit">提交</el-button>
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
        <div class="h-[35px] flex items-center justify-between text-white bg-[#006487] px-3 flex-shrink-0">
          <span>操作区</span>
          <div class="flex items-center gap-2">
            <el-button size="small" :disabled="batchList.length === 0" @click="exportOperationExcel">
              导出Excel
            </el-button>
            <el-button size="small" :disabled="batchList.length === 0" @click="openOperationExcelImport">
              导入Excel
            </el-button>
            <input
              ref="operationExcelInputRef"
              class="hidden"
              type="file"
              accept=".xlsx,.xls"
              @change="importOperationExcel"
            />
          </div>
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
                      <el-button type="success" plain size="small" @click="openAttachmentDialog(rowData)">
                        上传附件{{ getAttachmentCount(rowData) ? `(${getAttachmentCount(rowData)})` : '' }}
                      </el-button>
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

    <!-- 工序附件 Dialog -->
    <el-dialog
      v-model="attachmentDialogVisible"
      :title="`附件上传 - ${activeAttachmentSN || '-'}`"
      draggable
      width="620px"
      :close-on-click-modal="false"
      align-center
    >
      <div class="attachment-dialog-summary">
        <span>当前工序：{{ activeAttachmentSpecName || '-' }}</span>
        <span>单文件不大于 100MB，附件将在点击页面“提交”时统一上传</span>
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
      <el-table v-if="activeAttachmentFiles.length > 0" :data="activeAttachmentFiles" size="small" border max-height="360">
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
  ContainersOperationUploadSpecAttachment,
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
const submitLoading = ref(false);
const batchInputValues = ref<Record<string, string>>({});
const operationExcelInputRef = ref<HTMLInputElement>();
const attachmentFileInputRef = ref<HTMLInputElement>();
const attachmentDialogVisible = ref(false);
const activeAttachmentSN = ref('');
const activeAttachmentRow = ref<any>();

type PendingSpecAttachment = {
  name: string;
  size: number;
  lastModified: number;
  file: File;
};

const MAX_ATTACHMENT_SIZE = 100 * 1024 * 1024;
const specAttachmentsBySN = ref<Record<string, PendingSpecAttachment[]>>({});

const getSpecNameForRow = (row: any) => String(
  row?.SpecName || info.value.SpecName || lastKeyFields.value.SpecName || collectionSpecName.value || '',
).trim();

const activeAttachmentSpecName = computed(() => getSpecNameForRow(activeAttachmentRow.value));
const activeAttachmentFiles = computed(
  () => specAttachmentsBySN.value[activeAttachmentSN.value] || [],
);

const getAttachmentCount = (row: any) => {
  const sn = String(row?.ContainerName || '').trim();
  return specAttachmentsBySN.value[sn]?.length || 0;
};

const openAttachmentDialog = (row: any) => {
  activeAttachmentSN.value = String(row?.ContainerName || '').trim();
  activeAttachmentRow.value = row;
  attachmentDialogVisible.value = true;
};

const openAttachmentFilePicker = () => {
  attachmentFileInputRef.value?.click();
};

const handleAttachmentFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const selectedFiles = Array.from(input.files || []);
  input.value = '';
  if (selectedFiles.length === 0 || !activeAttachmentSN.value) return;

  const currentFiles = [...activeAttachmentFiles.value];
  const existingNames = new Set(currentFiles.map(file => file.name));
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
    currentFiles.push({
      name: file.name,
      size: file.size,
      lastModified: file.lastModified,
      file,
    });
    existingNames.add(file.name);
  });

  specAttachmentsBySN.value = {
    ...specAttachmentsBySN.value,
    [activeAttachmentSN.value]: currentFiles,
  };

  if (oversizedFiles.length > 0) {
    ElMessage.error(`以下文件超过100MB，已跳过：${oversizedFiles.join('、')}`);
  }
  if (duplicateFiles.length > 0) {
    ElMessage.warning(`以下同名附件已存在，已跳过：${duplicateFiles.join('、')}`);
  }
};

const removeAttachment = (index: number) => {
  const sn = activeAttachmentSN.value;
  if (!sn) return;
  const nextFiles = [...(specAttachmentsBySN.value[sn] || [])];
  nextFiles.splice(index, 1);
  const nextMap = { ...specAttachmentsBySN.value };
  if (nextFiles.length > 0) {
    nextMap[sn] = nextFiles;
  } else {
    delete nextMap[sn];
  }
  specAttachmentsBySN.value = nextMap;
};

const formatAttachmentSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

const pruneSpecAttachments = () => {
  const validSNs = new Set(
    batchList.value.map((row: any) => String(row.ContainerName || '').trim()).filter(Boolean),
  );
  specAttachmentsBySN.value = Object.fromEntries(
    Object.entries(specAttachmentsBySN.value).filter(([sn]) => validSNs.has(sn)),
  );
  if (activeAttachmentSN.value && !validSNs.has(activeAttachmentSN.value)) {
    attachmentDialogVisible.value = false;
    activeAttachmentSN.value = '';
    activeAttachmentRow.value = undefined;
  }
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

const buildSpecAttachmentPayload = async () => {
  pruneSpecAttachments();
  const items = [];

  for (const row of batchList.value) {
    const sn = String(row.ContainerName || '').trim();
    const files = specAttachmentsBySN.value[sn] || [];
    if (files.length === 0) continue;

    const specName = getSpecNameForRow(row);
    if (!specName) {
      throw new Error(`SN ${sn} 缺少当前工序，无法上传附件`);
    }

    items.push({
      SN: sn,
      Specs: [{
        SpecName: specName,
        Files: await Promise.all(files.map(async attachment => ({
          FileName: attachment.name,
          Base64String: await fileToBase64(attachment.file),
        }))),
      }],
    });
  }

  return {
    OperatorBy: draftUserName,
    Items: items,
  };
};

const operationExcelHeaders = computed(() => [
  'SN码',
  ...dataCollectionItems.value.map((item: any) => String(item.DataPointName || '').trim()),
]);

const getDuplicateCollectionNames = () => {
  const names = operationExcelHeaders.value.slice(1).filter(Boolean);
  return Array.from(new Set(names.filter((name, index) => names.indexOf(name) !== index)));
};

const formatExcelFileTime = () => {
  const now = new Date();
  const part = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}${part(now.getMonth() + 1)}${part(now.getDate())}_${part(now.getHours())}${part(now.getMinutes())}${part(now.getSeconds())}`;
};

const exportOperationExcel = async () => {
  if (batchList.value.length === 0) {
    ElMessage.warning('操作区没有可导出的数据');
    return;
  }

  const duplicateNames = getDuplicateCollectionNames();
  if (duplicateNames.length > 0) {
    ElMessage.error(`采集项名称重复，无法生成可回填模板：${duplicateNames.join('、')}`);
    return;
  }

  try {
    const XLSX = await import('xlsx');
    const rows = batchList.value.map((row: any) => [
      String(row.ContainerName || ''),
      ...dataCollectionItems.value.map((_: any, index: number) => row.values?.[index] ?? ''),
    ]);
    const worksheet = XLSX.utils.aoa_to_sheet([operationExcelHeaders.value, ...rows]);
    worksheet['!cols'] = operationExcelHeaders.value.map((header, index) => ({
      wch: index === 0 ? 24 : Math.max(16, Math.min(32, Array.from(header).length * 2 + 6)),
    }));

    for (let rowIndex = 1; rowIndex <= rows.length; rowIndex++) {
      const address = XLSX.utils.encode_cell({ r: rowIndex, c: 0 });
      if (worksheet[address]) {
        worksheet[address].t = 's';
        worksheet[address].z = '@';
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '操作区数据');
    const nameParts = [
      '批量进站操作区',
      info.value.MfgOrderName,
      info.value.SpecName,
      formatExcelFileTime(),
    ].filter(Boolean);
    const fileName = nameParts.join('_').replace(/[\\/:*?"<>|]/g, '_');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } catch (error) {
    console.error('操作区Excel导出失败', error);
    ElMessage.error('Excel导出失败，请稍后重试');
  }
};

const openOperationExcelImport = () => {
  operationExcelInputRef.value?.click();
};

const normalizeImportedValue = (item: any, rawValue: any) => {
  const text = String(rawValue ?? '').trim();
  if (!text) return { valid: true, value: '' };

  if (item.Type === 'Boolean') {
    const normalized = text.toLowerCase();
    const trueValues = new Set([
      'true', '1', '是', '合格', String(item.BooleanTrue || '').trim().toLowerCase(),
    ].filter(Boolean));
    const falseValues = new Set([
      'false', '0', '否', '不合格', String(item.BooleanFalse || '').trim().toLowerCase(),
    ].filter(Boolean));
    if (trueValues.has(normalized)) return { valid: true, value: 'true' };
    if (falseValues.has(normalized)) return { valid: true, value: 'false' };
    return { valid: false, value: text, message: '应填写 true/false、是/否或合格/不合格' };
  }

  if (item.Type === 'Integer' && !/^-?\d+$/.test(text)) {
    return { valid: false, value: text, message: '应填写整数' };
  }
  if (item.Type === 'Float' && !/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) {
    return { valid: false, value: text, message: '应填写数字' };
  }
  return { valid: true, value: normalizeCellValue(item.Type, text) };
};

const importOperationExcel = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;

  if (!/\.(xlsx|xls)$/i.test(file.name)) {
    ElMessage.error('请选择 xlsx 或 xls 文件');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('Excel文件不能超过10MB');
    return;
  }

  const duplicateNames = getDuplicateCollectionNames();
  if (duplicateNames.length > 0) {
    ElMessage.error(`当前采集项名称重复，无法按列名导入：${duplicateNames.join('、')}`);
    return;
  }

  try {
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = sheetName ? workbook.Sheets[sheetName] : undefined;
    if (!worksheet) {
      ElMessage.error('Excel中没有可读取的工作表');
      return;
    }

    const excelRows = XLSX.utils.sheet_to_json<any[]>(worksheet, {
      header: 1,
      defval: '',
      raw: true,
    });
    if (excelRows.length < 2) {
      ElMessage.error('Excel中没有可导入的数据');
      return;
    }

    const headers = excelRows[0].map((value: any) => String(value ?? '').trim());
    const duplicateHeaders = Array.from(new Set(
      headers.filter((header: string, index: number) => header && headers.indexOf(header) !== index),
    ));
    if (duplicateHeaders.length > 0) {
      ElMessage.error(`Excel表头存在重复列：${duplicateHeaders.join('、')}`);
      return;
    }

    const snColumnIndex = headers.findIndex((header: string) => header === 'SN码' || header === 'SN');
    if (snColumnIndex < 0) {
      ElMessage.error('Excel缺少“SN码”列，请使用当前页面导出的模板');
      return;
    }

    const itemColumnIndexes = dataCollectionItems.value.map((item: any) =>
      headers.indexOf(String(item.DataPointName || '').trim()),
    );
    const missingColumns = dataCollectionItems.value
      .filter((_: any, index: number) => itemColumnIndexes[index] < 0)
      .map((item: any) => item.DataPointName);
    if (missingColumns.length > 0) {
      ElMessage.error(`Excel缺少采集项列：${missingColumns.join('、')}`);
      return;
    }

    const pendingRows = new Map<string, string[]>();
    const duplicateSNs = new Set<string>();
    const typeErrors: string[] = [];

    excelRows.slice(1).forEach((excelRow: any[], index: number) => {
      const excelRowNumber = index + 2;
      const containerName = String(excelRow[snColumnIndex] ?? '').trim();
      if (!containerName) return;
      if (pendingRows.has(containerName)) duplicateSNs.add(containerName);

      const values = dataCollectionItems.value.map((item: any, itemIndex: number) => {
        const normalized = normalizeImportedValue(item, excelRow[itemColumnIndexes[itemIndex]]);
        if (!normalized.valid && typeErrors.length < 20) {
          typeErrors.push(`第${excelRowNumber}行「${item.DataPointName}」${normalized.message}`);
        }
        return normalized.value;
      });
      pendingRows.set(containerName, values);
    });

    if (duplicateSNs.size > 0) {
      ElMessage.error(`Excel存在重复SN码：${Array.from(duplicateSNs).slice(0, 10).join('、')}`);
      return;
    }
    if (typeErrors.length > 0) {
      ElMessage.error(`Excel数据格式有误：${typeErrors.join('；')}`);
      return;
    }
    if (pendingRows.size === 0) {
      ElMessage.error('Excel中没有有效的SN数据');
      return;
    }

    const currentRows = new Map(
      batchList.value.map((row: any) => [String(row.ContainerName || '').trim(), row]),
    );
    const unknownSNs: string[] = [];
    let importedCount = 0;
    let validationErrorCount = 0;
    pendingRows.forEach((values, containerName) => {
      const targetRow: any = currentRows.get(containerName);
      if (!targetRow) {
        unknownSNs.push(containerName);
        return;
      }
      values.forEach((value, itemIndex) => {
        targetRow.values[itemIndex] = value;
        validateCell(targetRow, itemIndex);
        if (targetRow._errors?.[itemIndex]?.error) validationErrorCount += 1;
      });
      importedCount += 1;
    });

    if (importedCount === 0) {
      ElMessage.error('Excel中的SN码均不在当前操作区，未导入任何数据');
      return;
    }
    if (unknownSNs.length > 0 || validationErrorCount > 0) {
      const details = [
        unknownSNs.length > 0 ? `${unknownSNs.length}个SN不在当前操作区，已跳过` : '',
        validationErrorCount > 0 ? `${validationErrorCount}个单元格未通过必填或范围校验` : '',
      ].filter(Boolean);
      ElMessage.warning(`已回填${importedCount}条；${details.join('；')}`);
    } else {
      ElMessage.success(`成功回填${importedCount}条操作区数据`);
    }
  } catch (error) {
    console.error('操作区Excel导入失败', error);
    ElMessage.error('Excel读取失败，请确认文件未损坏并使用当前页面导出的模板');
  }
};

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
  const hasLowerLimit = item.LowerLimit !== null && item.LowerLimit !== undefined && item.LowerLimit !== '';
  const hasUpperLimit = item.UpperLimit !== null && item.UpperLimit !== undefined && item.UpperLimit !== '';
  row._errors[idx] = { error: false, type: '', msg: '' };
  if (item.IsRequired && (!val || String(val).trim() === '')) {
    row._errors[idx] = { error: true, type: 'required', msg: `${item.DataPointName} 为必填项` };
    return;
  }
  if (val !== '' && val !== null && val !== undefined && !isNaN(Number(val)) && (hasLowerLimit || hasUpperLimit)) {
    const num = Number(val);
    if (hasLowerLimit && num < Number(item.LowerLimit)) {
      row._errors[idx] = { error: true, type: 'range', msg: `不能小于 ${item.LowerLimit}` };
    }
    if (hasUpperLimit && num > Number(item.UpperLimit)) {
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
    width: 180,
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
    const hasExistingContext = Object.keys(lastKeyFields.value).length > 0;
    if (hasExistingContext && !keysMatch(lastKeyFields.value, newKeys)) {
      specAttachmentsBySN.value = {};
      attachmentDialogVisible.value = false;
      activeAttachmentSN.value = '';
      activeAttachmentRow.value = undefined;
    }
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
    pruneSpecAttachments();
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
  specAttachmentsBySN.value = {};
  attachmentDialogVisible.value = false;
  activeAttachmentSN.value = '';
  activeAttachmentRow.value = undefined;
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
  submitLoading.value = true;
  let attachmentsUploaded = false;
  try {
    pruneSpecAttachments();
    const hasPendingAttachments = Object.values(specAttachmentsBySN.value)
      .some(files => files.length > 0);
    if (hasPendingAttachments && !draftUserName) {
      ElMessage.error('未获取到当前操作人，无法上传附件');
      return;
    }
    const attachmentParams = await buildSpecAttachmentPayload();
    if (attachmentParams.Items.length > 0) {
      const attachmentRes: any = await ContainersOperationUploadSpecAttachment(attachmentParams);
      if (!attachmentRes || !attachmentRes.success || attachmentRes.code !== 0) {
        ElMessage.error((attachmentRes && attachmentRes.msg) || '附件上传失败，已取消本次提交');
        return;
      }
      attachmentsUploaded = true;
      specAttachmentsBySN.value = {};
      attachmentDialogVisible.value = false;
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
      ElMessage.success(attachmentsUploaded ? '提交成功，附件已上传' : (res.msg || '提交成功'));
      await refreshCurrentQueryAfterSuccess();
      persistDraftNow();
    } else {
      const prefix = attachmentsUploaded ? '附件已上传，但' : '';
      ElMessage.error(`${prefix}${(res && res.msg) || '执行失败'}`);
    }
  } catch (error) {
    console.error('批量进站提交失败', error);
    ElMessage.error(error instanceof Error ? error.message : '提交失败，请稍后重试');
  } finally {
    submitLoading.value = false;
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
  gap: 8px;
  justify-content: center;
}

.attachment-dialog-summary {
  display: flex;
  margin-bottom: 12px;
  flex-direction: column;
  gap: 4px;
  color: #606266;
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
