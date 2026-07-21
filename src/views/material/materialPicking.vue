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
              v-model="queryForm.Product"
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
          prop="MfgOrderName"
          label="工单号"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="ProductFamilyDesc"
          label="产品系列"
          min-width="130"
          show-overflow-tooltip
        />
        <el-table-column
          prop="ProductDesc"
          label="产品名称"
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
          prop="ProductName"
          label="产品料号"
          min-width="140"
          show-overflow-tooltip
        />
        <el-table-column
          prop="ProductTypeName"
          label="产品类型"
          min-width="100"
          show-overflow-tooltip
        />
        <el-table-column prop="Qty" label="数量" width="80" align="center" />
        <el-table-column prop="UOMName" label="单位" width="70" align="center" />
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
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click.stop="handleMaterialDetail(scope.row)"
              >工单领料</el-button
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

    <!-- 物料明细 Dialog -->
    <el-dialog
      v-model="detailDialogVisible"
      title="工单领料"
      draggable
      width="90%"
      :close-on-click-modal="false"
      align-center
      @close="detailDialogCancel"
    >
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm font-bold">仓库：</span>
        <el-select
          v-model="selectedWarehouse"
          size="small"
          style="width: 220px"
          filterable
          placeholder="请选择仓库"
        >
          <el-option
            v-for="item in warehouseOptions"
            :key="item.Code"
            :label="item.Name"
            :value="item.Code"
          />
        </el-select>
        <el-button type="primary" size="small" :disabled="!selectedWarehouse" @click="handleStockQuery">库存查询</el-button>
        <el-button type="success" size="small" :disabled="selectedRows.length === 0" @click="handleSubmit">提交申请</el-button>
      </div>
      <el-table
        :data="detailTableData"
        size="small"
        border
        style="width: 100%"
        max-height="500"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" :selectable="checkSelectable" />
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column
          prop="ProductName"
          label="产品料号"
          min-width="140"
          show-overflow-tooltip
        />
        <el-table-column
          prop="Description"
          label="物料名称"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column prop="UOMName" label="单位" width="70" align="center" />
        <el-table-column
          prop="BOMQtyRequired"
          label="BOM用量"
          width="90"
          align="center"
        />
        <el-table-column
          prop="PickedQty"
          label="已领数量"
          width="90"
          align="center"
        />
        <el-table-column
          prop="AvailableStock"
          label="可用库存"
          width="90"
          align="center"
        />
        <el-table-column label="本次申领数量" width="130" align="center">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.RequestQuantity"
              :min="1"
              :max="getMaxRequestQty(scope.row) || 1"
              :disabled="getMaxRequestQty(scope.row) <= 0"
              :controls="false"
              size="small"
              style="width: 100%"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="WarehouseCode"
          label="仓库"
          min-width="130"
          show-overflow-tooltip
        >
          <template #default="scope">
            <span>{{ getWarehouseName(scope.row.WarehouseCode) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="Remarks"
          label="备注"
          min-width="150"
          show-overflow-tooltip
        />
        <template #empty><el-empty description="暂无物料明细数据" /></template>
      </el-table>
      <template #footer>
        <el-button @click="detailDialogCancel">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useUserStoreWithOut } from '@/stores/modules/user'
import { ElMessage, ElMessageBox } from "element-plus";
import {
  WorkOrderOperationQuery,
  WorkOrderOperationWorkCenterQuery,
  WorkOrderOperationMfgLineQuery,
  WorkOrderOperationProductFamilyQuery,
  WorkOrderOperationProductTypeQuery,
  WorkOrderOperationMfgOrderQuery,
  WorkOrderMaterialDetailQuery,
  WareHouseQuery,
  GetErpStock,
  SubmitPickupOrder,
} from "@/api/operate";

const userStore = useUserStoreWithOut();

// ====== 查询表单 ======
const queryForm = ref({
  MfgOrder: "",
  MfgLine: "",
  WorkCenter: "",
  ProductType: "",
  ProductFamily: "",
  Product: "",
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
  // 车间
  const workCenterRes: any = await WorkOrderOperationWorkCenterQuery();
  if (workCenterRes && workCenterRes.success && workCenterRes.code === 0) {
    workCenterOptions.value = workCenterRes.content || [];
  }

  // 产线
  const mfgLineRes: any = await WorkOrderOperationMfgLineQuery();
  if (mfgLineRes && mfgLineRes.success && mfgLineRes.code === 0) {
    mfgLineOptions.value = mfgLineRes.content || [];
  }

  // 产品类型
  const productTypeRes: any = await WorkOrderOperationProductTypeQuery();
  if (productTypeRes && productTypeRes.success && productTypeRes.code === 0) {
    productTypeOptions.value = productTypeRes.content || [];
  }

  // 工单
  const mfgOrderRes: any = await WorkOrderOperationMfgOrderQuery();
  if (mfgOrderRes && mfgOrderRes.success && mfgOrderRes.code === 0) {
    mfgOrderOptions.value = mfgOrderRes.content || [];
  }

  // 产品系列
  const productFamilyRes: any = await WorkOrderOperationProductFamilyQuery();
  if (productFamilyRes && productFamilyRes.success && productFamilyRes.code === 0) {
    productFamilyOptions.value = productFamilyRes.content || [];
  }
};

// ====== 主查询 ======
const getData = async () => {
  const params: any = {
    MfgOrder: queryForm.value.MfgOrder,
    MfgLine: queryForm.value.MfgLine,
    WorkCenter: queryForm.value.WorkCenter,
    ProductType: queryForm.value.ProductType,
    ProductFamily: queryForm.value.ProductFamily,
    Product: queryForm.value.Product,
    Page: pageObj.value.currentPage,
    PageSize: pageObj.value.pageSize,
  };

  const res: any = await WorkOrderOperationQuery(params);
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

// ====== 物料明细弹窗 ======
const detailDialogVisible = ref(false);
const detailTableData = ref<any[]>([]);
const warehouseOptions = ref<any[]>([]);
const selectedWarehouse = ref("");
const selectedRows = ref<any[]>([]);

const getMaxRequestQty = (row: any) => {
  const remainBOM = (row.BOMQtyRequired || 0) - (row.PickedQty || 0);
  return Math.min(row.AvailableStock || 0, remainBOM);
};

const checkSelectable = (row: any) => {
  return getMaxRequestQty(row) > 0;
};

const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows;
};

const handleStockQuery = async () => {
  if (!selectedWarehouse.value || detailTableData.value.length === 0) return;

  const workOrderErp = detailTableData.value.map((item: any) => ({
    ...item,
    WarehouseCode: selectedWarehouse.value,
  }));

  const res: any = await GetErpStock(workOrderErp);
  if (res && res.success && res.code === 0 && res.content) {
    detailTableData.value = (res.content || []).map((item: any) => ({
      ...item,
    }));
    selectedRows.value = [];
  } else {
    ElMessage.error((res && res.msg) || "获取ERP库存失败");
  }
};

const handleSubmit = async () => {
  const rows = selectedRows.value;
  if (!rows.length) return;

  // 校验：本次申领数量 + 已领数量 > BOM用量
  const exceeded = rows.filter(
    (r: any) => (r.RequestQuantity || 0) + (r.PickedQty || 0) > (r.BOMQtyRequired || 0)
  );

  if (exceeded.length > 0) {
    try {
      await ElMessageBox.confirm(
        "部分物料的本次申领数量+已领数量已超过BOM用量，是否继续提交？",
        "提示",
        { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
      );
    } catch {
      return;
    }
  }

  const res: any = await SubmitPickupOrder(rows.map((r: any) => ({ ...r, Operator: userStore.getUserInfo })));
  if (res && res.success && res.code === 0) {
    ElMessage.success(res.msg || "提交成功");
    detailDialogCancel();
  } else {
    ElMessage.error((res && res.msg) || "提交失败");
  }
};

const getWarehouseName = (code: string) => {
  if (!code) return "-";
  const item = warehouseOptions.value.find((w: any) => w.Code === code);
  return item ? item.Name : code;
};

const loadWarehouseOptions = async () => {
  const res: any = await WareHouseQuery({});
  if (res && res.success && res.code === 0) {
    warehouseOptions.value = res.content || [];
  }
};

const handleMaterialDetail = async (row: any) => {
  if (!row?.MfgOrderName) {
    ElMessage.warning("工单号不存在");
    return;
  }

  const res: any = await WorkOrderMaterialDetailQuery({
    MfgOrder: row.MfgOrderName,
  });

  if (res && res.success && res.code === 0) {
    detailTableData.value = (res.content || []).map((item: any) => ({
      ...item,
    }));
    detailDialogVisible.value = true;
  } else {
    ElMessage.error((res && res.msg) || "获取物料明细失败");
    detailTableData.value = [];
  }
};

const detailDialogCancel = () => {
  detailDialogVisible.value = false;
  detailTableData.value = [];
  selectedWarehouse.value = "";
  selectedRows.value = [];
};

onMounted(() => {
  updateTableHeight();
  window.addEventListener("resize", updateTableHeight);
  loadDropdownOptions();
  loadWarehouseOptions();
  getData();
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateTableHeight);
});
</script>
