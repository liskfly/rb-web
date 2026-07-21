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
          <el-form-item label="发料单号" class="mb-2">
            <el-input
              v-model="queryForm.MaterialIssueNo"
              style="width: 160px"
              clearable
              @clear="getData"
              @change="getData"
            />
          </el-form-item>
          <el-form-item label="生产工单" class="mb-2">
            <el-select
              v-model="queryForm.MfgOrder"
              style="width: 200px"
              clearable
              filterable
              @change="getData"
              @clear="getData"
              placeholder="全部"
            >
              <el-option label="全部" value="" />
              <el-option
                v-for="item in mfgOrderOptions"
                :key="item.MfgOrderName"
                :label="item.MfgOrderName"
                :value="item.MfgOrderName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="产线" class="mb-2">
            <el-select
              v-model="queryForm.MfgLine"
              style="width: 180px"
              clearable
              filterable
              @change="getData"
              @clear="getData"
              placeholder="全部"
            >
              <el-option label="全部" value="" />
              <el-option
                v-for="item in mfgLineOptions"
                :key="item.MfgLineName"
                :label="item.MfgLineName"
                :value="item.MfgLineName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="车间" class="mb-2">
            <el-select
              v-model="queryForm.WorkCenter"
              style="width: 200px"
              clearable
              filterable
              @change="getData"
              @clear="getData"
              placeholder="全部"
            >
              <el-option label="全部" value="" />
              <el-option
                v-for="item in workCenterOptions"
                :key="item.WorkCenterName"
                :label="item.WorkCenterName"
                :value="item.WorkCenterName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="产品类型" class="mb-2">
            <el-select
              v-model="queryForm.ProductType"
              style="width: 140px"
              clearable
              filterable
              @change="getData"
              @clear="getData"
              placeholder="全部"
            >
              <el-option label="全部" value="" />
              <el-option
                v-for="item in productTypeOptions"
                :key="item.ProductTypeName"
                :label="item.ProductTypeName"
                :value="item.ProductTypeName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="产品系列" class="mb-2">
            <el-select
              v-model="queryForm.ProductFamily"
              style="width: 180px"
              clearable
              filterable
              @change="getData"
              @clear="getData"
              placeholder="全部"
            >
              <el-option label="全部" value="" />
              <el-option
                v-for="item in productFamilyOptions"
                :key="item.ProductFamilyName"
                :label="item.ProductFamilyName"
                :value="item.ProductFamilyName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="产品名称" class="mb-2">
            <el-input
              v-model="queryForm.ProductName"
              style="width: 160px"
              clearable
              @clear="getData"
              @change="getData"
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
          prop="PickingOrderNumber"
          label="发料单号"
          min-width="140"
          show-overflow-tooltip
        />
        <el-table-column
          prop="UserName"
          label="用户名"
          width="100"
        />
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          width="170"
        />
        <el-table-column
          prop="MfgOrderName"
          label="工单号"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="ProductFamily"
          label="产品系列"
          min-width="130"
          show-overflow-tooltip
        />
        <el-table-column
          prop="ProductName"
          label="产品料号"
          min-width="140"
          show-overflow-tooltip
        />
        <el-table-column
          prop="ProductDesc"
          label="产品描述"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="InvAddCode"
          label="存货代码"
          min-width="130"
          show-overflow-tooltip
        />
        <el-table-column
          prop="ProductTypeName"
          label="产品类型"
          min-width="100"
          show-overflow-tooltip
        />
        <el-table-column prop="Qty" label="数量" width="80" align="center" />
        <el-table-column
          prop="WorkCenterName"
          label="车间"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="MfgLineName"
          label="产线"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column label="明细" width="80" fixed="right" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click.stop="handleDetail(scope.row)"
              >明细</el-button
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

    <!-- 明细 Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      title="发料明细"
      draggable
      width="700px"
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
        @selection-change="handleDetailSelectionChange"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column
          prop="MaterialName"
          label="物料编码"
          min-width="140"
          show-overflow-tooltip
        />
        <el-table-column
          prop="Description"
          label="物料描述"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column prop="UomName" label="单位" width="70" align="center" />
        <el-table-column prop="Qty" label="数量" width="80" align="center" />
        <template #empty><el-empty description="暂无明细数据" /></template>
      </el-table>
      <template #footer>
        <el-button @click="detailDialogCancel">拒收</el-button>
        <el-button type="primary" :loading="submitLoading" :disabled="detailSelectedRows.length === 0" @click="handleAccept">接收</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useUserStoreWithOut } from '@/stores/modules/user'
import { ElMessage } from "element-plus";
import {
  MaterialIssueList,
  MaterialIssueDetail,
  SubmitMaterialIssue,
  WorkOrderOperationWorkCenterQuery,
  WorkOrderOperationMfgLineQuery,
  WorkOrderOperationProductFamilyQuery,
  WorkOrderOperationProductTypeQuery,
  WorkOrderOperationMfgOrderQuery,
} from "@/api/operate";

const userStore = useUserStoreWithOut();

// ====== 查询表单 ======
const queryForm = ref({
  MaterialIssueNo: "",
  MfgOrder: "",
  MfgLine: "",
  WorkCenter: "",
  ProductType: "",
  ProductFamily: "",
  ProductName: "",
});

// ====== 下拉框选项 ======
const workCenterOptions = ref<any[]>([]);
const mfgLineOptions = ref<any[]>([]);
const productTypeOptions = ref<any[]>([]);
const productFamilyOptions = ref<any[]>([]);
const mfgOrderOptions = ref<any[]>([]);

// ====== 表格 ======
const tableData = ref<any[]>([]);
const total = ref(0);
const pageObj = ref({ currentPage: 1, pageSize: 30 });
const tableHeight = ref(400);

// ====== 加载下拉框数据 ======
const loadDropdownOptions = async () => {
  const workCenterRes: any = await WorkOrderOperationWorkCenterQuery();
  if (workCenterRes && workCenterRes.success && workCenterRes.code === 0) {
    workCenterOptions.value = workCenterRes.content || [];
  }

  const mfgLineRes: any = await WorkOrderOperationMfgLineQuery();
  if (mfgLineRes && mfgLineRes.success && mfgLineRes.code === 0) {
    mfgLineOptions.value = mfgLineRes.content || [];
  }

  const productTypeRes: any = await WorkOrderOperationProductTypeQuery();
  if (productTypeRes && productTypeRes.success && productTypeRes.code === 0) {
    productTypeOptions.value = productTypeRes.content || [];
  }

  const mfgOrderRes: any = await WorkOrderOperationMfgOrderQuery();
  if (mfgOrderRes && mfgOrderRes.success && mfgOrderRes.code === 0) {
    mfgOrderOptions.value = mfgOrderRes.content || [];
  }

  const productFamilyRes: any = await WorkOrderOperationProductFamilyQuery();
  if (productFamilyRes && productFamilyRes.success && productFamilyRes.code === 0) {
    productFamilyOptions.value = productFamilyRes.content || [];
  }
};

// ====== 主查询 ======
const getData = async () => {
  const params: any = {
    MaterialIssueNo: queryForm.value.MaterialIssueNo,
    MfgOrder: queryForm.value.MfgOrder,
    MfgLine: queryForm.value.MfgLine,
    WorkCenter: queryForm.value.WorkCenter,
    ProductType: queryForm.value.ProductType,
    ProductFamily: queryForm.value.ProductFamily,
    ProductName: queryForm.value.ProductName,
    Page: pageObj.value.currentPage,
    PageSize: pageObj.value.pageSize,
  };

  const res: any = await MaterialIssueList(params);
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

const updateTableHeight = () => {
  tableHeight.value = window.innerHeight - 220;
};

// ====== 明细弹窗 ======
const detailDialogVisible = ref(false);
const detailTableData = ref<any[]>([]);
const currentPickingOrderNumber = ref("");
const submitLoading = ref(false);
const detailSelectedRows = ref<any[]>([]);

const handleDetailSelectionChange = (rows: any[]) => {
  detailSelectedRows.value = rows;
};

const handleDetail = async (row: any) => {
  if (!row?.PickingOrderNumber) {
    ElMessage.warning("发料单号不存在");
    return;
  }

  currentPickingOrderNumber.value = row.PickingOrderNumber;

  const res: any = await MaterialIssueDetail({
    MaterialIssueNo: row.PickingOrderNumber,
  });

  if (res && res.success && res.code === 0) {
    detailTableData.value = res.content || [];
    detailDialogVisible.value = true;
  } else {
    ElMessage.error((res && res.msg) || "获取明细失败");
    detailTableData.value = [];
  }
};

const handleAccept = async () => {
  if (detailSelectedRows.value.length === 0) return;
  submitLoading.value = true;
  try {
    const res: any = await SubmitMaterialIssue({
      MaterialIssueNo: currentPickingOrderNumber.value,
      Operator: userStore.getUserInfo,
      materialIssueEntities: detailSelectedRows.value.map((r: any) => ({
        Material: r.MaterialName,
      })),
    });
    if (res && res.success && res.code === 0) {
      ElMessage.success(res.msg || "接收成功");
      detailDialogCancel();
      getData();
    } else {
      ElMessage.error((res && res.msg) || "接收失败");
    }
  } finally {
    submitLoading.value = false;
  }
};

const detailDialogCancel = () => {
  detailDialogVisible.value = false;
  detailTableData.value = [];
  currentPickingOrderNumber.value = "";
  detailSelectedRows.value = [];
};

onMounted(() => {
  updateTableHeight();
  window.addEventListener("resize", updateTableHeight);
  loadDropdownOptions();
  getData();
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateTableHeight);
});
</script>
