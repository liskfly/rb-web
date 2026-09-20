<template>
  <div class="inspection-report-page p-2">
    <el-card shadow="never" class="query-card">
      <template #header>
        <div class="page-heading">
          <span>检验明细报表</span>
          <span>查询条件均可为空，工单、批次、结果和检验时间可单独或组合查询</span>
        </div>
      </template>

      <el-form :model="queryForm" inline size="small" label-width="72px" @submit.prevent>
        <el-form-item label="工单">
          <el-input
            v-model="queryForm.MfgOrderName"
            clearable
            placeholder="请输入工单号"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="批次">
          <el-input
            v-model="queryForm.SN"
            clearable
            placeholder="请输入检验批次 / SN"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="结果">
          <el-select v-model="queryForm.InspectionResult" clearable placeholder="请选择结果">
            <el-option label="合格" value="合格" />
            <el-option label="不合格" value="不合格" />
          </el-select>
        </el-form-item>
        <el-form-item label="检验时间">
          <div class="date-range">
            <el-date-picker
              v-model="queryForm.OperatorTimeFrom"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="开始日期"
              clearable
            />
            <span>至</span>
            <el-date-picker
              v-model="queryForm.OperatorTimeTo"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="结束日期"
              clearable
            />
          </div>
        </el-form-item>
        <el-form-item class="query-actions">
          <el-button type="primary" :loading="loading.orders" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div
      ref="reportContentRef"
      class="report-content"
      :class="{ 'is-resizing': isPanelResizing }"
      :style="reportContentStyle"
    >
      <el-card shadow="never" class="report-panel order-panel" :body-style="panelBodyStyle">
        <template #header>
          <div class="panel-title">
            <span>工单</span>
            <el-tag size="small" type="info">{{ orderRows.length }} 张</el-tag>
          </div>
        </template>

        <div class="table-wrap">
          <el-table
            ref="orderTableRef"
            v-loading="loading.orders"
            :data="orderRows"
            border
            stripe
            size="small"
            height="100%"
            highlight-current-row
            row-key="MfgOrderName"
            @row-click="handleOrderRowClick"
          >
            <el-table-column type="index" label="序号" width="54" fixed="left" align="center" />
            <el-table-column prop="MfgOrderName" label="工单" width="155" show-overflow-tooltip />
            <el-table-column prop="VN" label="VN" width="125" show-overflow-tooltip />
            <el-table-column prop="SNFrom" label="SN起" width="155" show-overflow-tooltip />
            <el-table-column prop="SNTo" label="SN止" width="155" show-overflow-tooltip />
            <el-table-column prop="SNCount" label="SN数" width="80" align="right" />
            <el-table-column prop="Qty" label="工单总数" width="95" align="right" />
            <el-table-column prop="MfgOrderComplete" label="完成数" width="85" align="right" />
            <el-table-column prop="ProductName" label="产品编码" width="145" show-overflow-tooltip />
            <el-table-column prop="ProductDesc" label="描述" min-width="170" show-overflow-tooltip />
            <template #empty>
              <el-empty :description="orderEmptyText" :image-size="72" />
            </template>
          </el-table>
        </div>
      </el-card>

      <div
        class="panel-splitter"
        role="separator"
        aria-orientation="vertical"
        title="左右拖动调整表格宽度，双击恢复"
        @dblclick="resetPanelWidth"
        @pointerdown="startPanelResize"
        @pointermove="handlePanelResize"
        @pointerup="stopPanelResize"
        @pointercancel="stopPanelResize"
      />

      <el-card shadow="never" class="report-panel detail-panel" :body-style="panelBodyStyle">
        <template #header>
          <div class="panel-title">
            <span>检验历史</span>
            <span class="selection-text">
              {{ currentMfgOrder ? `${currentMfgOrder} · ${detailRows.length} 个 SN` : "请点击左侧工单" }}
            </span>
          </div>
        </template>

        <div class="table-wrap">
          <el-table
            v-loading="loading.details"
            :data="detailRows"
            border
            stripe
            size="small"
            height="100%"
          >
            <el-table-column type="index" label="序号" width="54" fixed="left" align="center" />
            <el-table-column prop="SN" label="批次" width="165" fixed="left" show-overflow-tooltip />
            <el-table-column label="结果" width="90" align="center">
              <template #default="scope">
                <el-tag
                  v-if="scope.row.InspectionResult"
                  size="small"
                  :type="resultTagType(scope.row.InspectionResult)"
                >
                  {{ formatInspectionValue(scope.row.InspectionResult) }}
                </el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="column in detailColumns"
              :key="column"
              :label="column"
              :width="dynamicColumnWidth(column)"
              show-overflow-tooltip
            >
              <template #default="scope">
                <el-tag
                  v-if="isPassFailValue(scope.row.values[column])"
                  size="small"
                  :type="resultTagType(scope.row.values[column])"
                >
                  {{ formatInspectionValue(scope.row.values[column]) }}
                </el-tag>
                <span v-else>{{ displayValue(scope.row.values[column]) }}</span>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty :description="detailEmptyText" :image-size="72" />
            </template>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useHorizontalPaneResize } from "@/hooks/useHorizontalPaneResize";
import {
  InspectionDetailReportQuery,
  InspectionOrderSummaryQuery,
} from "@/api/operate";

type Row = Record<string, any>;

type DetailRow = {
  SN: string;
  InspectionResult: any;
  values: Record<string, any>;
};

const {
  containerRef: reportContentRef,
  gridStyle: reportContentStyle,
  isResizing: isPanelResizing,
  resetPaneWidth: resetPanelWidth,
  resize: handlePanelResize,
  startResize: startPanelResize,
  stopResize: stopPanelResize,
} = useHorizontalPaneResize({ minLeft: 340, minRight: 520 });

const emptyQuery = () => ({
  MfgOrderName: "",
  SN: "",
  InspectionResult: "",
  OperatorTimeFrom: "",
  OperatorTimeTo: "",
});

const queryForm = reactive(emptyQuery());
const orderRows = ref<Row[]>([]);
const detailRows = ref<DetailRow[]>([]);
const detailColumns = ref<string[]>([]);
const currentMfgOrder = ref("");
const hasQueried = ref(false);
const orderTableRef = ref();
const loading = reactive({ orders: false, details: false });

const panelBodyStyle = {
  padding: "0 10px 10px",
  height: "calc(100% - 49px)",
};

let orderRequestId = 0;
let detailRequestId = 0;

const orderEmptyText = computed(() =>
  hasQueried.value ? "没有查询到符合条件的工单" : "输入条件后点击查询；不填条件可查询全部",
);

const detailEmptyText = computed(() =>
  currentMfgOrder.value ? "该工单暂无检验历史" : "请点击左侧工单查看检验历史",
);

function responseRows(response: any): Row[] {
  return Array.isArray(response?.content) ? response.content : [];
}

function buildQueryPayload() {
  const payload = {
    MfgOrderName: queryForm.MfgOrderName.trim(),
    SN: queryForm.SN.trim(),
    InspectionResult: queryForm.InspectionResult,
    OperatorTimeFrom: queryForm.OperatorTimeFrom,
    OperatorTimeTo: queryForm.OperatorTimeTo,
  };

  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== ""));
}

function resetDetail() {
  detailRequestId += 1;
  currentMfgOrder.value = "";
  detailRows.value = [];
  detailColumns.value = [];
  loading.details = false;
}

function formatInspectionValue(value: any) {
  if (value === true || String(value).trim().toLowerCase() === "true") return "合格";
  if (value === false || String(value).trim().toLowerCase() === "false") return "不合格";
  return value ?? "";
}

function isPassFailValue(value: any) {
  const formatted = formatInspectionValue(value);
  return formatted === "合格" || formatted === "不合格";
}

function resultTagType(value: any): "success" | "danger" | "info" {
  const formatted = formatInspectionValue(value);
  if (formatted === "合格") return "success";
  if (formatted === "不合格") return "danger";
  return "info";
}

function displayValue(value: any) {
  const formatted = formatInspectionValue(value);
  return formatted === "" || formatted === null || formatted === undefined ? "-" : formatted;
}

function dynamicColumnWidth(column: string) {
  return Math.max(120, Math.min(240, Array.from(column).length * 16 + 48));
}

function pivotDetails(rows: Row[]) {
  const columns: string[] = [];
  const columnSet = new Set<string>();
  const rowMap = new Map<string, DetailRow>();

  rows.forEach((item) => {
    const sn = String(item.SN ?? "");
    const itemName = String(item.ItemName ?? "").trim();

    if (itemName && !columnSet.has(itemName)) {
      columnSet.add(itemName);
      columns.push(itemName);
    }

    if (!rowMap.has(sn)) {
      rowMap.set(sn, {
        SN: sn,
        InspectionResult: item.InspectionResult ?? "",
        values: {},
      });
    }

    const pivotRow = rowMap.get(sn)!;
    if (item.InspectionResult !== null && item.InspectionResult !== undefined && item.InspectionResult !== "") {
      pivotRow.InspectionResult = item.InspectionResult;
    }
    if (itemName) {
      pivotRow.values[itemName] = item.ActualValue;
    }
  });

  return { columns, rows: Array.from(rowMap.values()) };
}

async function handleQuery() {
  if (
    queryForm.OperatorTimeFrom &&
    queryForm.OperatorTimeTo &&
    queryForm.OperatorTimeFrom > queryForm.OperatorTimeTo
  ) {
    ElMessage.warning("检验开始时间不能晚于结束时间");
    return;
  }

  const requestId = ++orderRequestId;
  hasQueried.value = true;
  orderRows.value = [];
  resetDetail();
  loading.orders = true;

  try {
    const response: any = await InspectionOrderSummaryQuery(buildQueryPayload());
    if (requestId !== orderRequestId) return;
    if (!response || response.success === false) {
      ElMessage.error(response?.msg || "工单汇总查询失败");
      return;
    }
    orderRows.value = responseRows(response);
  } finally {
    if (requestId === orderRequestId) loading.orders = false;
  }

  if (requestId !== orderRequestId || orderRows.value.length === 0) return;
  const firstRow = orderRows.value[0];
  await nextTick();
  orderTableRef.value?.setCurrentRow(firstRow);
  await loadInspectionDetails(firstRow);
}

function handleReset() {
  orderRequestId += 1;
  Object.assign(queryForm, emptyQuery());
  orderRows.value = [];
  hasQueried.value = false;
  loading.orders = false;
  resetDetail();
  orderTableRef.value?.setCurrentRow();
}

async function handleOrderRowClick(row: Row) {
  await loadInspectionDetails(row);
}

async function loadInspectionDetails(row: Row) {
  if (!row?.MfgOrderName) {
    ElMessage.warning("当前数据没有工单号，无法查询检验历史");
    return;
  }

  const requestId = ++detailRequestId;
  currentMfgOrder.value = String(row.MfgOrderName);
  detailRows.value = [];
  detailColumns.value = [];
  loading.details = true;

  try {
    const response: any = await InspectionDetailReportQuery({
      MfgOrderName: currentMfgOrder.value,
    });
    if (requestId !== detailRequestId) return;
    if (!response || response.success === false) {
      ElMessage.error(response?.msg || "检验历史查询失败");
      return;
    }

    const pivotResult = pivotDetails(responseRows(response));
    detailColumns.value = pivotResult.columns;
    detailRows.value = pivotResult.rows;
  } finally {
    if (requestId === detailRequestId) loading.details = false;
  }
}
</script>

<style scoped lang="scss">
.inspection-report-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-width: 1000px;
  min-height: 0;
  background: #f4f6f8;
}

.query-card,
.report-panel {
  border-color: #dfe5ec;
}

.query-card {
  flex: 0 0 auto;
  margin-bottom: 8px;

  :deep(.el-card__header) {
    padding: 10px 12px;
  }

  :deep(.el-card__body) {
    padding: 10px 12px 2px;
  }

  :deep(.el-form-item) {
    margin-right: 12px;
    margin-bottom: 8px;
  }

  :deep(.el-input),
  :deep(.el-select) {
    width: 190px;
  }

  .date-range {
    display: flex;
    align-items: center;
    gap: 7px;

    :deep(.el-date-editor) {
      width: 145px;
    }
  }

  .query-actions {
    margin-left: 2px;
  }
}

.page-heading,
.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  color: #263445;
  font-weight: 600;
}

.page-heading > span:last-child {
  color: #6b7785;
  font-size: 12px;
  font-weight: 400;
}

.report-content {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(380px, 2fr) 8px minmax(580px, 3fr);
  gap: 0;
  min-height: 0;
}

.panel-splitter {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: stretch;
  justify-content: center;
  cursor: col-resize;
  touch-action: none;

  &::before {
    width: 1px;
    content: "";
    background: #d6dee8;
    transition: width 0.15s ease, background-color 0.15s ease;
  }

  &:hover::before {
    width: 3px;
    background: var(--el-color-primary);
  }
}

.report-content.is-resizing {
  cursor: col-resize;
  user-select: none;

  .panel-splitter::before {
    width: 3px;
    background: var(--el-color-primary);
  }
}

.report-panel {
  min-width: 0;
  height: 100%;

  :deep(.el-card__header) {
    padding: 10px 12px;
  }

  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
}

.table-wrap {
  flex: 1;
  min-height: 0;
}

.selection-text {
  overflow: hidden;
  max-width: 72%;
  color: #6b7785;
  font-size: 12px;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-panel :deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table th.el-table__cell) {
  color: #5e6d7c;
  background: #f7fafc;
}

@media (max-width: 1200px) {
  .report-content {
    grid-template-columns: minmax(360px, 38fr) 8px minmax(520px, 62fr);
  }
}
</style>
