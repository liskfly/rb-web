<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-start">
        <div></div>
        <el-form
          ref="queryFormRef"
          size="small"
          :model="queryForm"
          label-width="auto"
          :inline="true"
        >
          <el-form-item label="入库单号" class="mb-2">
            <el-input
              v-model="queryForm.CompletionInboundNo"
              style="width: 160px"
              clearable
              @clear="getData"
              @change="getData"
            />
          </el-form-item>
          <el-form-item label="工单号" class="mb-2">
            <el-input
              v-model="queryForm.MfgOrder"
              style="width: 160px"
              clearable
              @clear="getData"
              @change="getData"
            />
          </el-form-item>
          <el-form-item label="产品编码" class="mb-2">
            <el-input
              v-model="queryForm.Product"
              style="width: 160px"
              clearable
              @clear="getData"
              @change="getData"
            />
          </el-form-item>
          <el-form-item label="状态" class="mb-2">
            <el-select
              v-model="queryForm.Status"
              style="width: 120px"
              @change="getData"
              placeholder="全部"
              clearable
            >
              <el-option label="全部" :value="null" />
              <el-option label="未提交" :value="0" />
              <el-option label="已提交" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建人" class="mb-2">
            <el-input
              v-model="queryForm.OperationUser"
              style="width: 130px"
              clearable
              @clear="getData"
              @change="getData"
            />
          </el-form-item>
          <el-form-item label="创建时间" class="mb-2">
            <el-date-picker
              v-model="queryForm.CreateStartTime"
              type="datetime"
              placeholder="开始"
              value-format="YYYY-MM-DDTHH:mm:ss"
              style="width: 170px"
            />
            <span class="mx-1">~</span>
            <el-date-picker
              v-model="queryForm.CreateEndTime"
              type="datetime"
              placeholder="结束"
              value-format="YYYY-MM-DDTHH:mm:ss"
              style="width: 170px"
            />
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        :data="tableData"
        size="small"
        style="width: 100%"
        :height="tableHeight"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="index" align="center" label="序号" width="55">
          <template #default="scope">
            <span>{{
              scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="CompletionInboundNo"
          label="入库单号"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="MfgOrder"
          label="工单号"
          min-width="130"
          show-overflow-tooltip
        />
        <el-table-column
          prop="Product"
          label="产品编码"
          min-width="130"
          show-overflow-tooltip
        />
        <el-table-column
          prop="InboundQty"
          label="入库数量"
          width="80"
          align="center"
        />
        <el-table-column
          prop="WorkCenter"
          label="车间"
          min-width="140"
          show-overflow-tooltip
        />
        <el-table-column
          prop="MfgLine"
          label="产线"
          min-width="140"
          show-overflow-tooltip
        />
        <el-table-column prop="Status" label="状态" width="80" align="center">
          <template #default="scope">
            <el-tag
              :type="scope.row.DataStatus === 1 ? 'success' : 'warning'"
              size="small"
              >{{ scope.row.Status }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="CreateUser" label="创建人" width="100" />
        <el-table-column prop="CreateTime" label="创建时间" width="170" />
        <el-table-column prop="CompletionUser" label="入库人" width="100" />
        <el-table-column prop="CompletionTime" label="入库时间" width="170" />
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click.stop="handleViewDetail(scope.row)"
              >查看明细</el-button
            >
            <el-button
              type="success"
              size="small"
              @click.stop="handleAudit(scope.row)"
              >FQC审核</el-button
            >
          </template>
        </el-table-column>
        <template #empty><el-empty /></template>
      </el-table>

      <div class="mt-2">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager-count="5"
          :current-page="pageObj.currentPage"
          :page-size="pageObj.pageSize"
          :page-sizes="[30, 50, 100, 200, 300]"
          layout="total,sizes, prev, pager, next"
          :total="total"
        />
      </div>
    </el-card>

    <!-- 查看明细 Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      title="入库单明细"
      draggable
      width="800px"
      :close-on-click-modal="false"
      align-center
      @close="detailDialogCancel"
    >
      <el-table
        :data="detailTableData"
        size="small"
        border
        style="width: 100%"
        max-height="400"
      >
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column
          prop="SN"
          label="SN编码"
          min-width="160"
          show-overflow-tooltip
        />
        <el-table-column
          prop="MaterialCode"
          label="物料编码"
          min-width="130"
          show-overflow-tooltip
        />
        <el-table-column
          prop="ProductFamily"
          label="产品系列"
          min-width="130"
          show-overflow-tooltip
        />
        <el-table-column
          prop="ProductDesc"
          label="产品描述"
          min-width="130"
          show-overflow-tooltip
        />
        <el-table-column prop="Qty" label="数量" width="70" align="center" />
        <template #empty><el-empty description="暂无明细数据" /></template>
      </el-table>
      <template #footer>
        <el-button @click="detailDialogCancel">关闭</el-button>
      </template>
    </el-dialog>

    <!-- FQC审核 Dialog -->
    <el-dialog
      v-model="auditDialogVisible"
      draggable
      width="500px"
      :close-on-click-modal="false"
      align-center
      @close="auditDialogCancel"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <span>FQC审核</span>
          <el-button
            type="primary"
            link
            :loading="inspectionDetailLoading"
            @click="handleViewInspectionDetail"
          >
            查看检验明细
          </el-button>
        </div>
      </template>
      <el-form
        ref="auditFormRef"
        :model="auditForm"
        :rules="auditRules"
        label-width="100px"
        size="default"
      >
        <el-form-item label="入库单号">
          <el-input v-model="auditForm.CompletionInboundNo" disabled />
        </el-form-item>
        <el-form-item label="审核结果" prop="auditResult">
          <el-select
            v-model="auditForm.auditResult"
            placeholder="请选择审核结果"
            style="width: 100%"
          >
            <el-option label="通过" value="通过" />
            <el-option label="不通过" value="不通过" />
          </el-select>
        </el-form-item>
        <el-form-item label="入库仓库" prop="wareHouse">
          <el-select
            v-model="auditForm.wareHouse"
            placeholder="请选择入库仓库"
            style="width: 100%"
          >
            <el-option
              v-for="item in wareHouseOptions"
              :key="item.WareHouse"
              :label="item.Description"
              :value="item.WareHouse"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核备注" prop="reviewNotes">
          <el-input
            v-model="auditForm.reviewNotes"
            type="textarea"
            :rows="3"
            placeholder="请输入审核备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="auditDialogCancel">取消</el-button>
        <el-button
          type="primary"
          :loading="auditLoading"
          @click="handleAuditSubmit"
          >入库</el-button
        >
      </template>
    </el-dialog>

    <!-- FQC检验明细 Dialog -->
    <el-dialog
      v-model="inspectionDetailVisible"
      title="检验明细"
      draggable
      append-to-body
      width="92%"
      top="5vh"
      :close-on-click-modal="false"
      @close="inspectionDetailDialogCancel"
    >
      <div v-loading="inspectionDetailLoading" class="min-h-[260px]">
        <el-descriptions :column="3" border size="small" class="mb-3">
          <el-descriptions-item label="入库单号">
            {{ inspectionDetailData.CompletionInboundNo || auditForm.CompletionInboundNo || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="SN数量">
            {{ inspectionDetailData.SNList.length }}
          </el-descriptions-item>
          <el-descriptions-item label="工序数量">
            {{ inspectionDetailData.ProcessList.length }}
          </el-descriptions-item>
        </el-descriptions>

        <el-tabs v-model="inspectionDetailActiveTab" type="border-card">
          <el-tab-pane
            :label="`SN清单 (${inspectionDetailData.SNList.length})`"
            name="sn-list"
          >
            <el-table
              :data="inspectionDetailData.SNList"
              border
              stripe
              size="small"
              height="480"
            >
              <el-table-column type="index" label="序号" width="55" align="center" />
              <el-table-column prop="SN" label="SN码" min-width="165" show-overflow-tooltip />
              <el-table-column prop="MaterialCode" label="物料编码" min-width="140" show-overflow-tooltip />
              <el-table-column prop="ProductFamily" label="产品系列" min-width="120" show-overflow-tooltip />
              <el-table-column prop="ProductDesc" label="产品描述" min-width="140" show-overflow-tooltip />
              <el-table-column prop="Qty" label="数量" width="80" align="right" />
              <el-table-column prop="UomName" label="单位" width="90" align="center" />
              <template #empty><el-empty description="暂无SN数据" /></template>
            </el-table>
          </el-tab-pane>

          <el-tab-pane
            v-for="(process, processIndex) in inspectionDetailData.ProcessList"
            :key="`${process.ProcessName}-${processIndex}`"
            :label="`${process.ProcessName || '未命名工序'} (${process.Inspections.length})`"
            :name="`process-${processIndex}`"
          >
            <el-table
              :data="process.Inspections"
              border
              stripe
              size="small"
              height="480"
              row-key="SN"
            >
              <el-table-column type="expand" width="48">
                <template #default="scope">
                  <div class="px-4 py-2">
                    <el-table :data="scope.row.Items || []" border size="small">
                      <el-table-column type="index" label="序号" width="55" align="center" />
                      <el-table-column prop="ItemName" label="检验项目" min-width="210" show-overflow-tooltip />
                      <el-table-column prop="Description" label="描述" min-width="130" show-overflow-tooltip />
                      <el-table-column prop="JudgeType" label="判定类型" width="100" />
                      <el-table-column prop="ReferenceStandard" label="参考标准" min-width="170" show-overflow-tooltip />
                      <el-table-column label="下限" width="90" align="right">
                        <template #default="itemScope">
                          {{ displayInspectionValue(itemScope.row.LowerLimit) }}
                        </template>
                      </el-table-column>
                      <el-table-column label="上限" width="90" align="right">
                        <template #default="itemScope">
                          {{ displayInspectionValue(itemScope.row.UpperLimit) }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="ActualValue" label="实测值" min-width="110" show-overflow-tooltip />
                      <el-table-column prop="Unit" label="单位" width="90" />
                      <template #empty><el-empty description="暂无检验项目" :image-size="60" /></template>
                    </el-table>
                  </div>
                </template>
              </el-table-column>
              <el-table-column type="index" label="序号" width="55" align="center" />
              <el-table-column prop="SN" label="SN码" min-width="165" show-overflow-tooltip />
              <el-table-column label="检验结果" width="100" align="center">
                <template #default="scope">
                  <el-tag :type="inspectionResultTagType(scope.row.InspectionResult)" size="small">
                    {{ scope.row.InspectionResult || "-" }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="检验时间" min-width="180">
                <template #default="scope">
                  {{ formatInspectionTime(scope.row.OperatorTime) }}
                </template>
              </el-table-column>
              <el-table-column prop="OperatorBy" label="检验人" min-width="110" />
              <el-table-column label="检验项数" width="90" align="right">
                <template #default="scope">{{ scope.row.Items?.length || 0 }}</template>
              </el-table-column>
              <template #empty><el-empty description="该工序暂无检验数据" /></template>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>

      <template #footer>
        <el-button @click="inspectionDetailDialogCancel">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import {
  QueryCompletionInboundList,
  QueryCompletionInboundDetailList,
  QueryFqcAuditInspection,
  QueryWareHouse,
  SubmitCompletionInbound,
} from "@/api/operate";

// ====== 查询 ======
const queryForm = ref({
  CompletionInboundNo: "",
  MfgOrder: "",
  Product: "",
  Status: null as number | null,
  CreateStartTime: "",
  CreateEndTime: "",
  OperationUser: "",
});
const tableData = ref<any[]>([]);
const total = ref(0);
const pageObj = ref({ currentPage: 1, pageSize: 30 });
const tableHeight = ref(400);

const getData = async () => {
  const params: any = {
    CompletionInboundNo: queryForm.value.CompletionInboundNo,
    MfgOrder: queryForm.value.MfgOrder,
    Product: queryForm.value.Product,
    OperationUser: queryForm.value.OperationUser,
    Page: pageObj.value.currentPage,
    PageSize: pageObj.value.pageSize,
  };
  if (queryForm.value.Status !== null && queryForm.value.Status !== undefined) {
    params.Status = queryForm.value.Status;
  }
  if (queryForm.value.CreateStartTime)
    params.CreateStartTime = queryForm.value.CreateStartTime;
  if (queryForm.value.CreateEndTime)
    params.CreateEndTime = queryForm.value.CreateEndTime;

  const res: any = await QueryCompletionInboundList(params);
  if (res && res.success && res.code === 0) {
    tableData.value = res.content || [];
    total.value = res.total || 0;
  } else {
    ElMessage.error((res && res.msg) || "查询失败");
    tableData.value = [];
    total.value = 0;
  }
};

const handleSizeChange = (val: number) => {
  pageObj.value.pageSize = val;
  pageObj.value.currentPage = 1;
  getData();
};
const handleCurrentChange = (val: number) => {
  pageObj.value.currentPage = val;
  getData();
};

// ====== 查看明细 ======
const detailDialogVisible = ref(false);
const detailTableData = ref<any[]>([]);
const currentDetailInboundNo = ref("");

const handleViewDetail = async (row: any) => {
  if (!row?.CompletionInboundNo) {
    ElMessage.warning("入库单号不存在");
    return;
  }

  currentDetailInboundNo.value = row.CompletionInboundNo;

  const res: any = await QueryCompletionInboundDetailList({
    CompletionInboundNo: row.CompletionInboundNo,
  });

  if (res && res.success && res.code === 0) {
    // 只显示 DataStatus === 0 的数据
    const filteredData = (res.content || []).filter(
      (i: any) => i.DataStatus === 0,
    );
    detailTableData.value = filteredData.map((i: any) => ({
      ...i,
      MaterialCode: i.MaterialCode || i.ProductName || i.Product || "",
      ProductName: i.ProductName || i.Product || "",
      ProductDesc: i.ProductDesc || "",
      ProductFamily: i.ProductFamily || i.ProductFamilyName || "",
      ProductFamilyName: i.ProductFamilyName || i.ProductFamily || "",
    }));
    detailDialogVisible.value = true;
  } else {
    ElMessage.warning((res && res.msg) || "获取明细数据失败");
    detailTableData.value = [];
  }
};

const detailDialogCancel = () => {
  detailDialogVisible.value = false;
  detailTableData.value = [];
  currentDetailInboundNo.value = "";
};

// ====== FQC审核 ======
const auditDialogVisible = ref(false);
const auditFormRef = ref();
const auditLoading = ref(false);
const auditForm = ref({
  CompletionInboundNo: "",
  auditResult: "",
  wareHouse: "",
  reviewNotes: "",
});
const currentAuditRow = ref<any>(null);
const wareHouseOptions = ref<any[]>([]);
const auditDetailData = ref<any[]>([]); // 存储查询到的明细数据
const inspectionDetailVisible = ref(false);
const inspectionDetailLoading = ref(false);
const inspectionDetailActiveTab = ref("sn-list");
const inspectionDetailData = ref<{
  CompletionInboundNo: string;
  SNList: any[];
  ProcessList: any[];
}>({
  CompletionInboundNo: "",
  SNList: [],
  ProcessList: [],
});
let inspectionDetailRequestId = 0;

// 表单校验规则
const auditRules = {
  auditResult: [
    { required: true, message: "请选择审核结果", trigger: "change" },
  ],
  wareHouse: [{ required: true, message: "请选择入库仓库", trigger: "change" }],
};

// 获取仓库列表
const getWareHouseOptions = async () => {
  const res: any = await QueryWareHouse();
  if (res && res.success && res.code === 0) {
    wareHouseOptions.value = res.content || [];
  } else {
    ElMessage.warning((res && res.msg) || "获取仓库列表失败");
    wareHouseOptions.value = [];
  }
};

const handleAudit = async (row: any) => {
  console.log(row);

  if (!row?.CompletionInboundNo) {
    ElMessage.warning("入库单号不存在");
    return;
  }

  // 检查状态，如果已审核则不能再次审核
  if (row.DataStatus === 1) {
    ElMessage.warning("该入库单已审核，不能重复审核");
    return;
  }

  currentAuditRow.value = row;
  auditForm.value = {
    CompletionInboundNo: row.CompletionInboundNo,
    auditResult: "",
    wareHouse: "",
    reviewNotes: "",
  };

  // 查询明细数据
  const res: any = await QueryCompletionInboundDetailList({
    CompletionInboundNo: row.CompletionInboundNo,
  });

  if (res && res.success && res.code === 0) {
    // 只保留 DataStatus === 0 的数据
    auditDetailData.value = (res.content || []).filter(
      (i: any) => i.DataStatus === 0,
    );
    console.log("获取到明细数据:", auditDetailData.value);
  } else {
    ElMessage.warning((res && res.msg) || "获取明细数据失败");
    auditDetailData.value = [];
  }

  auditDialogVisible.value = true;
};

const displayInspectionValue = (value: any) =>
  value === null || value === undefined || value === "" ? "-" : value;

const formatInspectionTime = (value: any) => {
  if (!value) return "-";
  return String(value).replace("T", " ");
};

const inspectionResultTagType = (value: any): "success" | "danger" | "info" => {
  const result = String(value || "").trim();
  if (result === "合格" || result === "通过") return "success";
  if (result === "不合格" || result === "不通过") return "danger";
  return "info";
};

const handleViewInspectionDetail = async () => {
  const completionInboundNo = auditForm.value.CompletionInboundNo;
  if (!completionInboundNo) {
    ElMessage.warning("入库单号不存在");
    return;
  }
  if (inspectionDetailLoading.value) return;

  const requestId = ++inspectionDetailRequestId;
  inspectionDetailActiveTab.value = "sn-list";
  inspectionDetailData.value = {
    CompletionInboundNo: completionInboundNo,
    SNList: [],
    ProcessList: [],
  };
  inspectionDetailVisible.value = true;
  inspectionDetailLoading.value = true;

  try {
    const res: any = await QueryFqcAuditInspection({ CompletionInboundNo: completionInboundNo });
    if (requestId !== inspectionDetailRequestId) return;

    if (!res || res.success === false || res.code !== 0) {
      ElMessage.warning(res?.msg || "获取检验明细失败");
      return;
    }

    const content = res.content || {};
    inspectionDetailData.value = {
      CompletionInboundNo: content.CompletionInboundNo || completionInboundNo,
      SNList: Array.isArray(content.SNList) ? content.SNList : [],
      ProcessList: Array.isArray(content.ProcessList)
        ? content.ProcessList.map((process: any) => ({
            ...process,
            Inspections: Array.isArray(process.Inspections)
              ? process.Inspections.map((inspection: any) => ({
                  ...inspection,
                  Items: Array.isArray(inspection.Items) ? inspection.Items : [],
                }))
              : [],
          }))
        : [],
    };
  } catch (error: any) {
    if (requestId === inspectionDetailRequestId) {
      ElMessage.error(error?.msg || "获取检验明细失败");
    }
  } finally {
    if (requestId === inspectionDetailRequestId) inspectionDetailLoading.value = false;
  }
};

const inspectionDetailDialogCancel = () => {
  inspectionDetailRequestId += 1;
  inspectionDetailVisible.value = false;
  inspectionDetailLoading.value = false;
  inspectionDetailActiveTab.value = "sn-list";
  inspectionDetailData.value = {
    CompletionInboundNo: "",
    SNList: [],
    ProcessList: [],
  };
};

const auditDialogCancel = () => {
  inspectionDetailDialogCancel();
  auditDialogVisible.value = false;
  auditForm.value = {
    CompletionInboundNo: "",
    auditResult: "",
    wareHouse: "",
    reviewNotes: "",
  };
  currentAuditRow.value = null;
  auditDetailData.value = [];
  auditFormRef.value?.resetFields();
};

const handleAuditSubmit = async () => {
  // 表单校验
  await auditFormRef.value?.validate();

  if (!currentAuditRow.value) {
    ElMessage.warning("审核数据异常，请重新打开");
    return;
  }

  const row = currentAuditRow.value;
  const now = new Date().toISOString();
  const currentUser = localStorage.getItem("LOGINNAME") || "";

  auditLoading.value = true;

  try {
    // 从明细数据中获取 ProductFamily
    const firstDetail =
      auditDetailData.value.length > 0 ? auditDetailData.value[0] : null;

    const params = {
      CompletionInboundNo: row.CompletionInboundNo,
      MfgOrder: row.MfgOrder,
      Product: row.Product,
      ProductFamily: row.ProductFamily || firstDetail?.ProductFamily || "",
      InboundQty: row.InboundQty,
      WorkCenter: row.WorkCenter,
      MfgLine: row.MfgLine,
      AuditResults: auditForm.value.auditResult,
      ReviewNotes: auditForm.value.reviewNotes,
      WareHouse: auditForm.value.wareHouse,
      Status: 2,
      CompletionTime: now,
      CompletionUser: currentUser,
      DataStatus: 0,
      reBornCompletionInboundDetails: auditDetailData.value.map((i: any) => ({
        SN: i.SN,
        ProductFamily: i.ProductFamily || "",
        MaterialCode: i.MaterialCode || "",
        ProductDesc: i.ProductDesc || "",
        Qty: i.Qty || "1",
        UomName: i.UomName || "PCS",
        DataStatus: 0,
      })),
    };

    console.log("审核提交参数:", params);

    const res: any = await SubmitCompletionInbound(params);

    if (res && res.success && res.code === 0) {
      ElMessage.success(res.msg || "审核入库成功");
      auditDialogCancel();
      getData(); // 刷新列表
    } else {
      ElMessage.error(res.msg || "审核入库失败");
    }
  } catch (error: any) {
    if (error !== false) {
      ElMessage.error(error?.msg || "审核入库失败");
    }
  } finally {
    auditLoading.value = false;
  }
};

const updateTableHeight = () => {
  tableHeight.value = window.innerHeight - 220;
};

onMounted(() => {
  updateTableHeight();
  window.addEventListener("resize", updateTableHeight);
  getData();
  getWareHouseOptions(); // 加载仓库列表
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateTableHeight);
});
</script>
