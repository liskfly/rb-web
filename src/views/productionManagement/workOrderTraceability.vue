<template>
  <div class="trace-page p-2">
    <el-card shadow="never" class="query-card" :body-style="{ padding: '12px 12px 4px' }">
      <el-form :model="queryForm" inline size="small" label-width="76px" @submit.prevent>
        <el-form-item label="工单">
          <el-input
            v-model="queryForm.MfgOrderName"
            clearable
            placeholder="请输入工单号"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="SN">
          <el-input
            v-model="queryForm.SN"
            clearable
            placeholder="流转批次 / 成品条码"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="存货代码">
          <el-select-v2
            v-model="queryForm.InvAddCode"
            :options="selectOptions.invAddCodes"
            clearable
            filterable
            placeholder="请选择存货代码"
          />
        </el-form-item>
        <el-form-item label="计划时间">
          <el-date-picker
            v-model="plannedDate"
            type="daterange"
            :shortcuts="dateShortcuts"
            value-format="YYYY-MM-DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至"
            clearable
          />
        </el-form-item>

        <template v-if="showMore">
          <div class="more-conditions-overlay">
            <el-form-item label="产品">
            <el-select-v2
              v-model="queryForm.ProductName"
              :options="selectOptions.products"
              clearable
              filterable
              placeholder="请选择产品"
            />
            </el-form-item>
            <el-form-item label="产品类型">
            <el-select-v2
              v-model="queryForm.ProductTypeName"
              :options="selectOptions.productTypes"
              clearable
              filterable
              placeholder="请选择"
            />
            </el-form-item>
            <el-form-item label="产品型号">
            <el-select-v2
              v-model="queryForm.ProductFamilyName"
              :options="selectOptions.productFamilies"
              clearable
              filterable
              placeholder="请选择"
            />
            </el-form-item>
            <el-form-item label="工艺流程">
            <el-select-v2
              v-model="queryForm.WorkflowName"
              :options="selectOptions.workflows"
              clearable
              filterable
              placeholder="请选择"
            />
            </el-form-item>
            <el-form-item label="订单类型">
            <el-select-v2
              v-model="queryForm.OrderTypeName"
              :options="selectOptions.orderTypes"
              clearable
              filterable
              placeholder="请选择"
            />
            </el-form-item>
            <el-form-item label="状态">
            <el-select-v2
              v-model="queryForm.OrderStatusName"
              :options="selectOptions.orderStatuses"
              clearable
              filterable
              placeholder="请选择"
            />
            </el-form-item>
            <el-form-item label="车间">
            <el-select-v2
              v-model="queryForm.WorkCenterName"
              :options="selectOptions.workCenters"
              clearable
              filterable
              placeholder="请选择"
              @change="handleWorkCenterChange"
            />
            </el-form-item>
            <el-form-item label="产线">
            <el-select-v2
              v-model="queryForm.MfgLineName"
              :options="selectOptions.mfgLines"
              clearable
              filterable
              placeholder="请选择"
            />
            </el-form-item>
            <el-form-item label="领料单号">
              <el-input v-model="queryForm.PickingOrderNo" clearable placeholder="请输入领料单号" />
            </el-form-item>
            <el-form-item label="确收条码">
              <el-input v-model="queryForm.ConfirmBarCode" clearable placeholder="请输入确收条码" />
            </el-form-item>
            <el-form-item label="入库单号">
              <el-input v-model="queryForm.CompletionInboundNo" clearable placeholder="请输入完工入库单号" />
            </el-form-item>
          </div>
        </template>

        <el-form-item class="query-actions">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button link type="primary" @click="showMore = !showMore">
            {{ showMore ? "收起条件" : "更多条件" }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div
      ref="contentGridRef"
      class="content-grid"
      :class="{ 'is-resizing': isPanelResizing }"
      :style="contentGridStyle"
    >
      <el-card shadow="never" class="panel-card order-panel" :body-style="panelBodyStyle">
        <template #header>
          <div class="panel-title">
            <span>工单列表</span>
            <el-tag size="small" type="info">{{ orderRows.length }} 条</el-tag>
          </div>
        </template>
        <div class="order-table-wrap">
          <el-table
            v-loading="loading.orders"
            :data="pagedOrderRows"
            border
            stripe
            size="small"
            highlight-current-row
            height="100%"
            row-key="MfgOrderName"
            @row-click="handleOrderRowClick"
          >
            <el-table-column type="index" label="序号" width="54" fixed>
              <template #default="scope">
                {{ (orderPage.current - 1) * orderPage.size + scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              v-for="column in orderColumns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              show-overflow-tooltip
            >
              <template #default="scope">
                <span v-if="column.prop === 'SNRange'">{{ formatOrderSNRange(scope.row) }}</span>
                <span v-else>{{ scope.row[column.prop] }}</span>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty description="暂无工单数据" :image-size="72" />
            </template>
          </el-table>
        </div>
        <el-pagination
          v-model:current-page="orderPage.current"
          v-model:page-size="orderPage.size"
          class="order-pagination"
          background
          small
          :page-sizes="[30, 50, 100, 200]"
          layout="total, sizes, prev, pager, next"
          :total="orderRows.length"
        />
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

      <el-card shadow="never" class="panel-card detail-panel" :body-style="panelBodyStyle">
        <template #header>
          <div class="panel-title">
            <span>工单明细</span>
            <span class="selection-text">
              {{ currentMfgOrder ? `当前工单：${currentMfgOrder}` : "请先选择左侧工单" }}
            </span>
          </div>
        </template>

        <el-tabs v-model="currentTab" class="detail-tabs" @tab-change="handlePrimaryTabChange">
          <el-tab-pane label="流转批次" name="containers" />
          <el-tab-pane label="BOM" name="bom" />
          <el-tab-pane label="领料" name="picking" />
          <el-tab-pane label="确收" name="confirm" />
          <el-tab-pane label="完工入库" name="completion" />
        </el-tabs>

        <div class="primary-table-wrap" :class="{ 'with-lot-detail': showLotDetail }">
          <el-table
            v-loading="loading.primary"
            :data="primaryRows"
            border
            stripe
            size="small"
            highlight-current-row
            height="100%"
            @row-click="handlePrimaryRowClick"
          >
            <el-table-column type="index" label="序号" width="54" fixed />
            <el-table-column
              v-for="column in primaryColumns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              show-overflow-tooltip
            >
              <template #default="scope">
                <el-tag
                  v-if="column.prop === 'InProcess'"
                  size="small"
                  :type="scope.row[column.prop] ? 'success' : 'info'"
                >
                  {{ scope.row[column.prop] ? "是" : "否" }}
                </el-tag>
                <span v-else>{{ scope.row[column.prop] }}</span>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty :description="primaryEmptyText" :image-size="72" />
            </template>
          </el-table>
        </div>

        <div v-if="showLotDetail" class="lot-detail">
          <div class="lot-heading">
            <span>SN 明细</span>
            <el-tag size="small">{{ currentSN }}</el-tag>
          </div>
          <el-tabs v-model="lotTab" class="lot-tabs" @tab-change="handleLotTabChange">
            <el-tab-pane label="上下机" name="move" />
            <el-tab-pane label="检验历史" name="inspection" />
            <el-tab-pane label="物料消耗" name="consume" />
          </el-tabs>
          <div class="lot-table-wrap" :class="{ 'with-consume-detail': showConsumeDetail }">
            <el-table
              v-loading="loading.lot"
              :data="lotRows"
              border
              stripe
              size="small"
              highlight-current-row
              height="100%"
              @row-click="handleLotRowClick"
            >
              <el-table-column type="index" label="序号" width="54" fixed />
              <el-table-column
                v-for="column in lotColumns"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                :width="column.width"
                show-overflow-tooltip
              />
              <template #empty>
                <el-empty description="暂无 SN 明细" :image-size="60" />
              </template>
            </el-table>
          </div>

          <div v-if="showConsumeDetail" class="consume-detail">
            <div class="consume-heading">
              <span>消耗明细</span>
              <el-tag size="small" type="warning">TxnId：{{ currentTxnId }}</el-tag>
            </div>
            <el-table
              v-loading="loading.consumeDetail"
              :data="consumeDetailRows"
              border
              stripe
              size="small"
              height="150"
            >
              <el-table-column type="index" label="序号" width="54" fixed />
              <el-table-column
                v-for="column in consumeDetailColumns"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                :width="column.width"
                show-overflow-tooltip
              />
              <template #empty>
                <el-empty description="暂无消耗明细" :image-size="54" />
              </template>
            </el-table>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useHorizontalPaneResize } from "@/hooks/useHorizontalPaneResize";
import {
  MfgOrderBomQuery,
  MfgOrderCompletionQuery,
  MfgOrderConfirmQuery,
  MfgOrderConsumeDetailQuery,
  MfgOrderConsumeHeaderQuery,
  MfgOrderContainerQuery,
  MfgOrderInspectionQuery,
  MfgOrderMoveHistoryQuery,
  MfgOrderPickingQuery,
  MfgOrderReportQuery,
  ReBornInvAddCodeQuery,
  ReBornMfgLineQuery,
  ReBornOrderStatusQuery,
  ReBornOrderTypeQuery,
  ReBornProductFamilyQuery,
  ReBornProductQuery,
  ReBornProductTypeQuery,
  ReBornWorkCenterQuery,
  ReBornWorkflowQuery,
} from "@/api/operate";

type Row = Record<string, any>;
type Column = { prop: string; label: string; width?: number };
type SelectOption = { label: string; value: string };
type PrimaryTab = "containers" | "bom" | "picking" | "confirm" | "completion";
type LotTab = "move" | "inspection" | "consume";

const {
  containerRef: contentGridRef,
  gridStyle: contentGridStyle,
  isResizing: isPanelResizing,
  resetPaneWidth: resetPanelWidth,
  resize: handlePanelResize,
  startResize: startPanelResize,
  stopResize: stopPanelResize,
} = useHorizontalPaneResize({ minLeft: 340, minRight: 520 });

const emptyQuery = () => ({
  MfgOrderName: "",
  SN: "",
  ProductName: "",
  PlannedStartDateFrom: "",
  PlannedStartDateTo: "",
  InvAddCode: "",
  ProductTypeName: "",
  ProductFamilyName: "",
  WorkflowName: "",
  OrderTypeName: "",
  OrderStatusName: "",
  WorkCenterName: "",
  MfgLineName: "",
  PickingOrderNo: "",
  ConfirmBarCode: "",
  CompletionInboundNo: "",
});

const queryForm = reactive(emptyQuery());
const plannedDate = ref<string[]>(getRecentDateStrings(30));
const dateShortcuts = [
  { text: "最近三天", value: () => getRecentDateRange(3) },
  { text: "最近七天", value: () => getRecentDateRange(7) },
  { text: "最近半个月", value: () => getRecentDateRange(15) },
  { text: "最近一个月", value: () => getRecentDateRange(30) },
];
const showMore = ref(false);
const currentMfgOrder = ref("");
const currentSN = ref("");
const currentTxnId = ref("");
const currentTab = ref<PrimaryTab>("containers");
const lotTab = ref<LotTab>("move");

const orderRows = ref<Row[]>([]);
const primaryRows = ref<Row[]>([]);
const lotRows = ref<Row[]>([]);
const consumeDetailRows = ref<Row[]>([]);
const orderPage = reactive({ current: 1, size: 50 });

const loading = reactive({
  orders: false,
  primary: false,
  lot: false,
  consumeDetail: false,
});

const options = reactive({
  products: [] as Row[],
  invAddCodes: [] as Row[],
  productTypes: [] as Row[],
  productFamilies: [] as Row[],
  workflows: [] as Row[],
  orderTypes: [] as Row[],
  orderStatuses: [] as Row[],
  workCenters: [] as Row[],
  mfgLines: [] as Row[],
});

const selectOptions = computed(() => ({
  products: toSelectOptions(options.products, "ProductName", ["ProductDesc"]),
  invAddCodes: toSelectOptions(options.invAddCodes, "InvAddCode"),
  productTypes: toSelectOptions(options.productTypes, "ProductTypeName", ["ProductTypeDesc"]),
  productFamilies: toSelectOptions(
    options.productFamilies,
    "ProductFamilyName",
    ["ProductFamilyDesc"],
  ),
  workflows: toSelectOptions(options.workflows, "WorkflowName"),
  orderTypes: toSelectOptions(options.orderTypes, "OrderTypeName", ["OrderTypeDesc"]),
  orderStatuses: toSelectOptions(options.orderStatuses, "OrderStatusName"),
  workCenters: toSelectOptions(options.workCenters, "WorkCenterName", ["Description"]),
  mfgLines: toSelectOptions(options.mfgLines, "MfgLineName", ["Description"]),
}));

const pagedOrderRows = computed(() => {
  const start = (orderPage.current - 1) * orderPage.size;
  return orderRows.value.slice(start, start + orderPage.size);
});

const panelBodyStyle = { padding: "0 10px 10px", height: "calc(100% - 49px)" };

const orderColumns: Column[] = [
  { prop: "MfgOrderName", label: "工单号", width: 150 },
  { prop: "VN", label: "VN", width: 140 },
  { prop: "SNRange", label: "SN码范围", width: 260 },
  { prop: "OrderStatusName", label: "状态", width: 100 },
  { prop: "Qty", label: "总数量", width: 90 },
  { prop: "MfgOrderComplete", label: "完成数量", width: 90 },
  { prop: "PlannedStartDate", label: "计划开始时间", width: 160 },
  { prop: "PlannedCompletionDate", label: "计划完成时间", width: 160 },
  { prop: "MfgOrderDesc", label: "工单描述", width: 160 },
  { prop: "ProductName", label: "物料编码", width: 140 },
  { prop: "ProductDesc", label: "物料描述", width: 160 },
  { prop: "ProductTypeName", label: "产品类型", width: 110 },
  { prop: "ProductTypeDesc", label: "类型描述", width: 110 },
  { prop: "ProductFamilyName", label: "产品型号", width: 120 },
  { prop: "ProductFamilyDesc", label: "型号描述", width: 130 },
  { prop: "WorkflowName", label: "工艺流程", width: 140 },
  { prop: "UOMName", label: "单位", width: 80 },
  { prop: "OrderTypeName", label: "订单类型", width: 100 },
  { prop: "WorkCenterName", label: "车间", width: 120 },
  { prop: "MfgLineName", label: "产线", width: 120 },
];

const primaryColumnMap: Record<PrimaryTab, Column[]> = {
  containers: [
    { prop: "MfgOrderName", label: "工单号", width: 150 },
    { prop: "SN", label: "SN", width: 170 },
    { prop: "Qty", label: "数量", width: 80 },
    { prop: "Status", label: "状态", width: 100 },
    { prop: "UOMName", label: "单位", width: 80 },
    { prop: "ProductName", label: "物料编码", width: 140 },
    { prop: "ProductDesc", label: "物料描述", width: 160 },
    { prop: "VN", label: "VN", width: 120 },
    { prop: "ProductTypeName", label: "产品类型", width: 110 },
    { prop: "ProductTypeDesc", label: "类型描述", width: 110 },
    { prop: "ProductFamilyName", label: "产品型号", width: 120 },
    { prop: "ProductFamilyDesc", label: "型号描述", width: 130 },
    { prop: "SpecName", label: "当前工序", width: 120 },
    { prop: "CreateTime", label: "开批时间", width: 160 },
    { prop: "InProcess", label: "在制", width: 80 },
    { prop: "ResourceName", label: "设备", width: 120 },
  ],
  bom: [
    { prop: "MfgOrderName", label: "工单号", width: 150 },
    { prop: "ProductName", label: "物料编码", width: 140 },
    { prop: "ProductDesc", label: "物料描述", width: 160 },
    { prop: "VN", label: "VN", width: 120 },
    { prop: "ProductFamilyName", label: "产品型号", width: 120 },
    { prop: "ProductFamilyDesc", label: "型号描述", width: 130 },
    { prop: "IssueControl", label: "发料控制", width: 100 },
    { prop: "QtyRequired", label: "需求数", width: 90 },
    { prop: "ERPLineNum", label: "行号", width: 80 },
    { prop: "SupplyType", label: "供应类型", width: 110 },
    { prop: "SupplyWareHouse", label: "供应仓库", width: 120 },
    { prop: "TotalQtyRequired", label: "总需求", width: 90 },
    { prop: "SpecName", label: "工序", width: 120 },
    { prop: "UOMName", label: "单位", width: 80 },
  ],
  picking: [
    { prop: "PickingOrderNo", label: "领料单号", width: 150 },
    { prop: "MfgOrderName", label: "工单号", width: 150 },
    { prop: "ProductName", label: "物料编码", width: 140 },
    { prop: "ProductDesc", label: "物料描述", width: 160 },
    { prop: "VN", label: "VN", width: 120 },
    { prop: "ProductFamilyName", label: "产品型号", width: 120 },
    { prop: "ProductFamilyDesc", label: "型号描述", width: 130 },
    { prop: "Operator", label: "领料人", width: 100 },
    { prop: "OperationTime", label: "领料时间", width: 160 },
    { prop: "WareHouseCode", label: "仓库", width: 110 },
    { prop: "Qty", label: "数量", width: 90 },
    { prop: "Remark", label: "备注", width: 160 },
  ],
  confirm: [
    { prop: "MfgOrderName", label: "工单号", width: 150 },
    { prop: "ProductName", label: "物料编码", width: 140 },
    { prop: "ProductDesc", label: "物料描述", width: 160 },
    { prop: "VN", label: "VN", width: 120 },
    { prop: "ProductFamilyName", label: "产品型号", width: 120 },
    { prop: "ProductFamilyDesc", label: "型号描述", width: 130 },
    { prop: "Batch", label: "批次", width: 130 },
    { prop: "BarCode", label: "条码", width: 170 },
    { prop: "UomName", label: "单位", width: 80 },
    { prop: "Qty", label: "数量", width: 90 },
    { prop: "ConfirmedBy", label: "确收人", width: 100 },
    { prop: "ConfirmedTime", label: "确收时间", width: 160 },
    { prop: "PickingOrderNumber", label: "领料单号", width: 150 },
    { prop: "Status", label: "状态", width: 100 },
  ],
  completion: [
    { prop: "MfgOrder", label: "工单号", width: 150 },
    { prop: "CompletionInboundNo", label: "入库单号", width: 160 },
    { prop: "Status", label: "状态", width: 120 },
    { prop: "ProductName", label: "物料编码", width: 140 },
    { prop: "ProductDesc", label: "物料描述", width: 160 },
    { prop: "VN", label: "VN", width: 120 },
    { prop: "ProductFamilyName", label: "产品型号", width: 120 },
    { prop: "ProductFamilyDesc", label: "型号描述", width: 130 },
    { prop: "SN", label: "SN", width: 170 },
    { prop: "Qty", label: "数量", width: 90 },
    { prop: "UomName", label: "单位", width: 80 },
    { prop: "CreateTime", label: "创建时间", width: 160 },
    { prop: "CreateUser", label: "创建人", width: 100 },
    { prop: "UpdateTime", label: "更新时间", width: 160 },
    { prop: "UpdateUser", label: "更新人", width: 100 },
    { prop: "CompletionTime", label: "完工时间", width: 160 },
    { prop: "CompletionUser", label: "完工人", width: 100 },
  ],
};

const lotColumnMap: Record<LotTab, Column[]> = {
  move: [
    { prop: "SN", label: "SN", width: 170 },
    { prop: "Qty", label: "数量", width: 80 },
    { prop: "Status", label: "状态", width: 100 },
    { prop: "UOMName", label: "单位", width: 80 },
    { prop: "ProductName", label: "物料编码", width: 140 },
    { prop: "ProductDesc", label: "物料描述", width: 160 },
    { prop: "InvAddCode", label: "存货代码", width: 120 },
    { prop: "ProductTypeName", label: "产品类型", width: 110 },
    { prop: "ProductTypeDesc", label: "类型描述", width: 110 },
    { prop: "ProductFamilyName", label: "产品型号", width: 120 },
    { prop: "ProductFamilyDesc", label: "型号描述", width: 130 },
    { prop: "SpecName", label: "工序", width: 120 },
    { prop: "TxnDate", label: "时间", width: 160 },
    { prop: "ResourceName", label: "设备", width: 120 },
    { prop: "TxnServiceName", label: "事务", width: 120 },
    { prop: "MfgOrderName", label: "工单号", width: 150 },
  ],
  inspection: [
    { prop: "SN", label: "SN", width: 170 },
    { prop: "ProcessName", label: "工序", width: 120 },
    { prop: "OperatorTime", label: "操作时间", width: 160 },
    { prop: "OperatorBy", label: "操作人", width: 100 },
    { prop: "InspectionResult", label: "结果", width: 100 },
    { prop: "ItemName", label: "项目", width: 130 },
    { prop: "ItemDesc", label: "项目描述", width: 160 },
    { prop: "JudgeType", label: "判定类型", width: 100 },
    { prop: "ReferenceStandard", label: "标准", width: 140 },
    { prop: "LowerLimit", label: "下限", width: 90 },
    { prop: "UpperLimit", label: "上限", width: 90 },
    { prop: "ActualValue", label: "实测值", width: 100 },
    { prop: "Unit", label: "单位", width: 80 },
    { prop: "MfgOrderName", label: "工单号", width: 150 },
  ],
  consume: [
    { prop: "SN", label: "SN", width: 170 },
    { prop: "Qty", label: "数量", width: 80 },
    { prop: "Status", label: "状态", width: 100 },
    { prop: "UOMName", label: "单位", width: 80 },
    { prop: "ProductName", label: "物料编码", width: 140 },
    { prop: "ProductDesc", label: "物料描述", width: 160 },
    { prop: "InvAddCode", label: "存货代码", width: 120 },
    { prop: "ProductTypeName", label: "产品类型", width: 110 },
    { prop: "ProductTypeDesc", label: "类型描述", width: 110 },
    { prop: "ProductFamilyName", label: "产品型号", width: 120 },
    { prop: "ProductFamilyDesc", label: "型号描述", width: 130 },
    { prop: "TxnId", label: "TxnId", width: 120 },
    { prop: "SpecName", label: "工序", width: 120 },
    { prop: "TxnDate", label: "消耗时间", width: 160 },
    { prop: "MfgOrderName", label: "工单号", width: 150 },
  ],
};

const consumeDetailColumns: Column[] = [
  { prop: "MfgOrderName", label: "工单号", width: 150 },
  { prop: "TxnId", label: "TxnId", width: 120 },
  { prop: "TxnDate", label: "消耗时间", width: 160 },
  { prop: "SpecName", label: "工序", width: 120 },
  { prop: "SN", label: "SN", width: 170 },
  { prop: "ChildContainerName", label: "子件条码", width: 170 },
  { prop: "ChildQty", label: "子件数量", width: 100 },
  { prop: "ChildStatus", label: "子件状态", width: 100 },
  { prop: "ChildUOMName", label: "单位", width: 80 },
  { prop: "ChildProductName", label: "子件物料", width: 140 },
  { prop: "ChildProductDesc", label: "子件描述", width: 160 },
  { prop: "ChildInvAddCode", label: "存货代码", width: 120 },
  { prop: "ChildProductTypeName", label: "子件类型", width: 110 },
  { prop: "ChildProductTypeDesc", label: "类型描述", width: 110 },
  { prop: "ChildProductFamilyName", label: "子件型号", width: 120 },
  { prop: "ChildProductFamilyDesc", label: "型号描述", width: 130 },
  { prop: "QtyRequired", label: "需求数", width: 90 },
];

const primaryColumns = computed(() => {
  const columns = primaryColumnMap[currentTab.value];
  const priority = ["VN", "SN", "Status"];

  return [...columns]
    .sort((left, right) => {
      const leftIndex = priority.indexOf(left.prop);
      const rightIndex = priority.indexOf(right.prop);
      const leftOrder = leftIndex === -1 ? priority.length : leftIndex;
      const rightOrder = rightIndex === -1 ? priority.length : rightIndex;
      return leftOrder - rightOrder;
    })
    .map((column) => {
      if (column.prop === "VN") return { ...column, label: "VN" };
      if (column.prop === "SN") return { ...column, label: "SN码" };
      return column;
    });
});
const lotColumns = computed(() => lotColumnMap[lotTab.value]);
const showLotDetail = computed(() => currentTab.value === "containers" && Boolean(currentSN.value));
const showConsumeDetail = computed(
  () => showLotDetail.value && lotTab.value === "consume" && Boolean(currentTxnId.value),
);
const primaryEmptyText = computed(() =>
  currentMfgOrder.value ? "暂无明细数据" : "请先选择左侧工单",
);

function optionLabel(item: Row, valueKey: string, descriptionKeys: string[]) {
  const value = item[valueKey] ?? "";
  const description = descriptionKeys.map((key) => item[key]).find(Boolean);
  return description ? `${value} - ${description}` : String(value);
}

function getRecentDateRange(days: number): [Date, Date] {
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - days + 1);
  return [start, end];
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getRecentDateStrings(days: number) {
  return getRecentDateRange(days).map(formatLocalDate);
}

function toSelectOptions(
  rows: Row[],
  valueKey: string,
  descriptionKeys: string[] = [],
): SelectOption[] {
  const uniqueOptions = new Map<string, SelectOption>();
  rows.forEach((item) => {
    const rawValue = item[valueKey];
    if (rawValue === null || rawValue === undefined || rawValue === "") return;
    const value = String(rawValue);
    if (!uniqueOptions.has(value)) {
      uniqueOptions.set(value, {
        value,
        label: optionLabel(item, valueKey, descriptionKeys),
      });
    }
  });
  return Array.from(uniqueOptions.values());
}

function responseRows(response: any): Row[] {
  return Array.isArray(response?.content) ? response.content : [];
}

function firstNonEmptyValue(row: Row, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (value !== null && value !== undefined && value !== "") return String(value);
  }
  return "";
}

function formatOrderSNRange(row: Row) {
  const range = firstNonEmptyValue(row, ["SNRange", "SnRange"]);
  if (range) return range;

  const start = firstNonEmptyValue(row, [
    "SNFrom",
    "SnFrom",
    "SNStart",
    "StartSN",
    "MinSN",
  ]);
  const end = firstNonEmptyValue(row, ["SNTo", "SnTo", "SNEnd", "EndSN", "MaxSN"]);

  if (start && end) return start === end ? start : `${start} - ${end}`;
  return start || end || "-";
}

function buildQueryPayload() {
  queryForm.PlannedStartDateFrom = plannedDate.value?.[0] || "";
  queryForm.PlannedStartDateTo = plannedDate.value?.[1] || "";
  return Object.fromEntries(
    Object.entries(queryForm).filter(([, value]) => value !== "" && value !== null && value !== undefined),
  );
}

function resetDrillDown() {
  currentMfgOrder.value = "";
  currentSN.value = "";
  currentTxnId.value = "";
  currentTab.value = "containers";
  lotTab.value = "move";
  primaryRows.value = [];
  lotRows.value = [];
  consumeDetailRows.value = [];
}

async function handleQuery() {
  loading.orders = true;
  resetDrillDown();
  orderPage.current = 1;
  try {
    const response = await MfgOrderReportQuery(buildQueryPayload());
    orderRows.value = responseRows(response);
  } finally {
    loading.orders = false;
  }
}

async function handleReset() {
  Object.assign(queryForm, emptyQuery());
  plannedDate.value = getRecentDateStrings(30);
  await loadMfgLines();
  await handleQuery();
}

async function handleOrderRowClick(row: Row) {
  if (!row?.MfgOrderName) {
    ElMessage.warning("当前数据没有工单号，无法查询明细");
    return;
  }
  currentMfgOrder.value = row.MfgOrderName;
  currentSN.value = "";
  currentTxnId.value = "";
  lotRows.value = [];
  consumeDetailRows.value = [];
  await loadPrimaryRows();
}

async function handlePrimaryTabChange(name: string | number) {
  currentTab.value = String(name) as PrimaryTab;
  currentSN.value = "";
  currentTxnId.value = "";
  lotRows.value = [];
  consumeDetailRows.value = [];
  if (currentMfgOrder.value) await loadPrimaryRows();
}

async function loadPrimaryRows() {
  const apiMap = {
    containers: MfgOrderContainerQuery,
    bom: MfgOrderBomQuery,
    picking: MfgOrderPickingQuery,
    confirm: MfgOrderConfirmQuery,
    completion: MfgOrderCompletionQuery,
  };
  loading.primary = true;
  primaryRows.value = [];
  try {
    const response = await apiMap[currentTab.value]({
      ...buildQueryPayload(),
      MfgOrderName: currentMfgOrder.value,
    });
    primaryRows.value = responseRows(response);
  } finally {
    loading.primary = false;
  }
}

async function handlePrimaryRowClick(row: Row) {
  if (currentTab.value !== "containers") return;
  if (!row?.SN) {
    ElMessage.warning("当前流转批次没有 SN，无法继续查询");
    return;
  }
  currentSN.value = row.SN;
  currentTxnId.value = "";
  consumeDetailRows.value = [];
  await loadLotRows();
}

async function handleLotTabChange(name: string | number) {
  lotTab.value = String(name) as LotTab;
  currentTxnId.value = "";
  consumeDetailRows.value = [];
  if (currentSN.value) await loadLotRows();
}

async function loadLotRows() {
  const apiMap = {
    move: MfgOrderMoveHistoryQuery,
    inspection: MfgOrderInspectionQuery,
    consume: MfgOrderConsumeHeaderQuery,
  };
  loading.lot = true;
  lotRows.value = [];
  try {
    const response = await apiMap[lotTab.value]({
      MfgOrderName: currentMfgOrder.value,
      SN: currentSN.value,
    });
    lotRows.value = responseRows(response);
  } finally {
    loading.lot = false;
  }
}

async function handleLotRowClick(row: Row) {
  if (lotTab.value !== "consume" || !row?.TxnId) return;
  currentTxnId.value = row.TxnId;
  loading.consumeDetail = true;
  consumeDetailRows.value = [];
  try {
    const response = await MfgOrderConsumeDetailQuery({
      MfgOrderName: currentMfgOrder.value,
      SN: currentSN.value,
      TxnId: currentTxnId.value,
    });
    consumeDetailRows.value = responseRows(response);
  } finally {
    loading.consumeDetail = false;
  }
}

async function loadMfgLines() {
  queryForm.MfgLineName = "";
  const response = await ReBornMfgLineQuery(
    queryForm.WorkCenterName ? { WorkCenterName: queryForm.WorkCenterName } : {},
  );
  options.mfgLines = responseRows(response);
}

async function handleWorkCenterChange() {
  await loadMfgLines();
}

async function loadSelectOptions() {
  const results = await Promise.all([
    ReBornProductQuery(),
    ReBornInvAddCodeQuery(),
    ReBornProductTypeQuery(),
    ReBornProductFamilyQuery(),
    ReBornWorkflowQuery(),
    ReBornOrderTypeQuery(),
    ReBornOrderStatusQuery(),
    ReBornWorkCenterQuery(),
    ReBornMfgLineQuery(),
  ]);
  options.products = responseRows(results[0]);
  options.invAddCodes = responseRows(results[1]);
  options.productTypes = responseRows(results[2]);
  options.productFamilies = responseRows(results[3]);
  options.workflows = responseRows(results[4]);
  options.orderTypes = responseRows(results[5]);
  options.orderStatuses = responseRows(results[6]);
  options.workCenters = responseRows(results[7]);
  options.mfgLines = responseRows(results[8]);
}

onMounted(async () => {
  await loadSelectOptions();
  await handleQuery();
});
</script>

<style scoped lang="scss">
.trace-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-width: 980px;
  min-height: 0;
  background: #f4f6f8;
}

.query-card,
.panel-card {
  border-color: #dfe5ec;
}

.query-card {
  position: relative;
  z-index: 20;
  overflow: visible;
  margin-bottom: 8px;

  :deep(.el-card__body) {
    overflow: visible;
  }

  :deep(.el-form-item) {
    margin-right: 12px;
    margin-bottom: 8px;
  }

  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-select-v2) {
    width: 190px;
  }

  :deep(.el-date-editor) {
    width: 250px;
  }

  .query-actions {
    margin-left: 2px;
    margin-bottom: 8px;
  }
}

.more-conditions-overlay {
  position: absolute;
  top: calc(100% - 1px);
  right: -1px;
  left: -1px;
  z-index: 30;
  padding: 12px 12px 4px;
  border: 1px solid #dfe5ec;
  border-top: 1px solid #edf0f3;
  border-radius: 0 0 4px 4px;
  background: #fff;
  box-shadow: 0 10px 24px rgb(31 45 61 / 16%);
}

.content-grid {
  position: relative;
  z-index: 1;
  display: grid;
  flex: 1;
  grid-template-columns: minmax(360px, 2fr) 8px minmax(560px, 3fr);
  gap: 0;
  height: auto;
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

.content-grid.is-resizing {
  cursor: col-resize;
  user-select: none;

  .panel-splitter::before {
    width: 3px;
    background: var(--el-color-primary);
  }
}

.panel-card {
  min-width: 0;
  height: 100%;

  :deep(.el-card__header) {
    padding: 10px 12px;
  }
}

.order-table-wrap {
  height: calc(100% - 38px);
}

.order-pagination {
  height: 32px;
  margin-top: 6px;
  justify-content: center;
}

.panel-title,
.lot-heading,
.consume-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  font-weight: 600;
  color: #263445;
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

.detail-panel :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.detail-tabs {
  flex: 0 0 auto;
}

.detail-panel :deep(.el-tabs__header) {
  margin-bottom: 8px;
}

.detail-panel :deep(.el-tabs__item) {
  height: 38px;
}

.primary-table-wrap {
  flex: 1 1 auto;
  height: auto;
  min-height: 0;
}

.primary-table-wrap.with-lot-detail {
  flex: 0 0 42%;
  height: auto;
  min-height: 0;
}

.lot-detail {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  box-sizing: border-box;
  height: auto;
  min-height: 0;
  padding-top: 8px;
}

.lot-heading,
.consume-heading {
  justify-content: flex-start;
  gap: 8px;
  height: 24px;
  font-size: 13px;
}

.lot-tabs :deep(.el-tabs__header) {
  margin-bottom: 6px;
}

.lot-tabs {
  flex: 0 0 auto;
}

.lot-tabs :deep(.el-tabs__item) {
  height: 32px;
  font-size: 13px;
}

.lot-table-wrap {
  flex: 1 1 auto;
  height: auto;
  min-height: 0;
}

.lot-table-wrap.with-consume-detail {
  height: auto;
  min-height: 0;
}

.consume-detail {
  flex: 0 0 auto;
  padding-top: 8px;
}

.consume-heading {
  margin-bottom: 6px;
}

:deep(.el-table__row) {
  cursor: pointer;
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: minmax(340px, 38fr) 8px minmax(520px, 62fr);
  }

  .query-card {
    :deep(.el-input),
    :deep(.el-select),
    :deep(.el-select-v2) {
      width: 160px;
    }
  }
}
</style>
