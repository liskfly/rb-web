<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-start">
        <div></div>
        <el-form ref="queryFormRef" size="small" :model="queryForm" label-width="auto" :inline="true">
          <el-form-item label="工单编号" class="mb-2">
            <el-input v-model="queryForm.MfgOrder" placeholder="输入工单编号" style="width: 180px" clearable @clear="getData" @change="getData" />
          </el-form-item>
          <el-form-item label="产线" class="mb-2">
            <el-select v-model="queryForm.MfgLine" style="width: 200px" @change="getData" placeholder="全部" clearable filterable>
              <el-option label="全部" :value="null" />
              <el-option v-for="item in mfgLineOptions" :key="item.MfgLineName" :label="item.MfgLineName" :value="item.MfgLineName" />
            </el-select>
          </el-form-item>
          <el-form-item label="车间" class="mb-2">
            <el-select v-model="queryForm.WorkCenter" style="width: 200px" @change="getData" placeholder="全部" clearable filterable>
              <el-option label="全部" :value="null" />
              <el-option v-for="item in workCenterOptions" :key="item.WorkCenterName" :label="item.WorkCenterName" :value="item.WorkCenterName" />
            </el-select>
          </el-form-item>
          <el-form-item label="产品类型" class="mb-2">
            <el-select v-model="queryForm.ProductType" style="width: 160px" @change="getData" placeholder="全部" clearable filterable>
              <el-option label="全部" :value="null" />
              <el-option v-for="item in productTypeOptions" :key="item.ProductTypeName" :label="item.ProductTypeName" :value="item.ProductTypeName" />
            </el-select>
          </el-form-item>
          <el-form-item label="产品系列" class="mb-2">
            <el-select v-model="queryForm.ProductFamily" style="width: 180px" @change="getData" placeholder="全部" clearable filterable>
              <el-option label="全部" :value="null" />
              <el-option v-for="item in productFamilyOptions" :key="item.ProductFamilyName" :label="item.ProductFamilyName" :value="item.ProductFamilyName" />
            </el-select>
          </el-form-item>
          <el-form-item label="产品名称" class="mb-2">
            <el-select v-model="queryForm.Product" style="width: 200px" @change="getData" placeholder="全部" clearable filterable>
              <el-option label="全部" :value="null" />
              <el-option v-for="item in productNameOptions" :key="item.ProductName" :label="item.ProductName" :value="item.ProductName" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" class="mb-2">
            <el-select v-model="queryForm.OrderStatus" style="width: 140px" @change="getData" placeholder="全部" clearable>
              <el-option label="全部" :value="null" />
              <el-option v-for="item in orderStatusOptions" :key="item.OrderStatusName" :label="item.OrderStatusName" :value="item.OrderStatusName" />
            </el-select>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
            <el-button 
              type="warning" 
              :disabled="selectedRows.length === 0" 
              @click="handlePause"
            >
              暂停
            </el-button>
            <el-button 
              type="success" 
              :disabled="selectedRows.length === 0" 
              @click="handleResume"
            >
              解除暂停
            </el-button>
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" align="center" />
        <el-table-column type="index" align="center" label="序号" width="55">
          <template #default="scope">
            <span>{{ scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="MfgOrderName" label="工单编号" min-width="130" show-overflow-tooltip />
        <el-table-column prop="ProductDesc" label="产品描述" min-width="130" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.ProductDesc || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ProductName" label="产品名称" min-width="150" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.ProductName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Qty" label="数量" width="80" align="center" />
        <el-table-column prop="UOMName" label="单位" width="80" align="center">
          <template #default="scope">
            <span>{{ scope.row.UOMName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ProductTypeName" label="产品类型" min-width="100" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.ProductTypeName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ProductFamilyName" label="产品系列" min-width="120" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.ProductFamilyName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="OrderStatusName" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.OrderStatusName)" size="small">
              {{ scope.row.OrderStatusName || '-' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="WorkCenterName" label="车间" min-width="160" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.WorkCenterName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="MfgLineName" label="产线" min-width="180" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.MfgLineName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="PlannedStartDate" label="计划开始时间" width="170">
          <template #default="scope">
            <span>{{ scope.row.PlannedStartDate ? formatDate(scope.row.PlannedStartDate) : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="PlannedCompletionDate" label="计划完成时间" width="170">
          <template #default="scope">
            <span>{{ scope.row.PlannedCompletionDate ? formatDate(scope.row.PlannedCompletionDate) : '-' }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-2">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :pager-count="5" :current-page="pageObj.currentPage" :page-size="pageObj.pageSize"
          :page-sizes="[30, 50, 100, 200, 300]" layout="total,sizes, prev, pager, next" :total="total" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { 
  WorkOrderOperationQuery,
  WorkOrderOperationWorkCenterQuery,
  WorkOrderOperationMfgLineQuery,
  WorkOrderOperationOrderStatusQuery,
  WorkOrderOperationProductFamilyQuery,
  WorkOrderOperationProductTypeQuery,
  WorkOrderOperationProductNameQuery,
  WorkOrderOrderStatusPauseExecute,
  WorkOrderOrderStatusResumeExecute
} from "@/api/warehouse";

// ====== 查询表单 ======
const queryForm = ref({
  MfgOrder: "",
  MfgLine: null as string | null,
  WorkCenter: null as string | null,
  ProductType: null as string | null,
  ProductFamily: null as string | null,
  Product: null as string | null,
  OrderStatus: null as string | null,
});

// ====== 下拉选项 ======
const workCenterOptions = ref<any[]>([]);
const mfgLineOptions = ref<any[]>([]);
const orderStatusOptions = ref<any[]>([]);
const productFamilyOptions = ref<any[]>([]);
const productTypeOptions = ref<any[]>([]);
const productNameOptions = ref<any[]>([]);

// ====== 表格数据 ======
const tableData = ref<any[]>([]);
const total = ref(0);
const pageObj = ref({ currentPage: 1, pageSize: 30 });
const tableHeight = ref(400);

// ====== 选中的行 ======
const selectedRows = ref<any[]>([]);

/** 格式化日期 */
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/** 获取状态标签类型 */
const getStatusType = (status: string) => {
  switch (status) {
    case '上线':
      return 'info';
    case '已下发':
      return 'primary';
    case '下线':
      return 'warning';
    case '关单':
      return 'danger';
    case '工单暂停':
      return 'warning';
    default:
      return 'info';
  }
};

/** 表格选中变化 */
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection;
};

/** 获取下拉数据 */
const fetchDropdownData = async () => {
  try {
    const [
      workCenterRes,
      mfgLineRes,
      orderStatusRes,
      productFamilyRes,
      productTypeRes,
      productNameRes
    ] = await Promise.all([
      WorkOrderOperationWorkCenterQuery(),
      WorkOrderOperationMfgLineQuery(),
      WorkOrderOperationOrderStatusQuery(),
      WorkOrderOperationProductFamilyQuery(),
      WorkOrderOperationProductTypeQuery(),
      WorkOrderOperationProductNameQuery()
    ]);

    if (workCenterRes && workCenterRes.success && workCenterRes.code === 0) {
      workCenterOptions.value = workCenterRes.content || [];
    }
    if (mfgLineRes && mfgLineRes.success && mfgLineRes.code === 0) {
      mfgLineOptions.value = mfgLineRes.content || [];
    }
    if (orderStatusRes && orderStatusRes.success && orderStatusRes.code === 0) {
      orderStatusOptions.value = orderStatusRes.content || [];
    }
    if (productFamilyRes && productFamilyRes.success && productFamilyRes.code === 0) {
      productFamilyOptions.value = productFamilyRes.content || [];
    }
    if (productTypeRes && productTypeRes.success && productTypeRes.code === 0) {
      productTypeOptions.value = productTypeRes.content || [];
    }
    if (productNameRes && productNameRes.success && productNameRes.code === 0) {
      productNameOptions.value = productNameRes.content || [];
    }
  } catch (error) {
    console.error('获取下拉数据失败:', error);
  }
};

/** 获取数据 */
const getData = async () => {
  const params: any = {
    MfgOrder: queryForm.value.MfgOrder || undefined,
    MfgLine: queryForm.value.MfgLine || undefined,
    WorkCenter: queryForm.value.WorkCenter || undefined,
    ProductType: queryForm.value.ProductType || undefined,
    ProductFamily: queryForm.value.ProductFamily || undefined,
    Product: queryForm.value.Product || undefined,
    OrderStatus: queryForm.value.OrderStatus || undefined,
    pageSize: pageObj.value.pageSize,
    currentPage: pageObj.value.currentPage,
  };

  Object.keys(params).forEach(key => {
    if (params[key] === undefined || params[key] === null || params[key] === '') {
      delete params[key];
    }
  });

  try {
    const res: any = await WorkOrderOperationQuery(params);
    if (res && res.success && res.code === 0) {
      tableData.value = res.content || [];
      total.value = res.total || 0;
      selectedRows.value = [];
    } else {
      ElMessage.error((res && res.msg) || "查询失败");
      tableData.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error('查询失败:', error);
    ElMessage.error("查询失败，请稍后重试");
    tableData.value = [];
    total.value = 0;
  }
};

/** 重置查询 */
const resetQuery = () => {
  queryForm.value = {
    MfgOrder: "",
    MfgLine: null,
    WorkCenter: null,
    ProductType: null,
    ProductFamily: null,
    Product: null,
    OrderStatus: null,
  };
  pageObj.value.currentPage = 1;
  getData();
};

/** 暂停 */
const handlePause = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请先选择要暂停的工单");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确认暂停选中的 ${selectedRows.value.length} 个工单吗？`,
      '暂停确认',
      {
        confirmButtonText: '确认暂停',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
  } catch {
    return;
  }

  const params = selectedRows.value.map(row => ({
    MfgOrder: row.MfgOrderName
  }));

  try {
    const res: any = await WorkOrderOrderStatusPauseExecute(params);
    if (res && res.success && res.code === 0) {
      ElMessage.success(res.msg || `成功暂停 ${selectedRows.value.length} 个工单`);
      selectedRows.value = [];
      getData();
    } else {
      ElMessage.error(res?.msg || "暂停失败");
    }
  } catch (error) {
    console.error('暂停失败:', error);
    ElMessage.error("暂停失败，请稍后重试");
  }
};

/** 解除暂停 */
const handleResume = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请先选择要解除暂停的工单");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确认解除暂停选中的 ${selectedRows.value.length} 个工单吗？`,
      '解除暂停确认',
      {
        confirmButtonText: '确认解除',
        cancelButtonText: '取消',
        type: 'info',
      }
    );
  } catch {
    return;
  }

  const params = selectedRows.value.map(row => ({
    MfgOrder: row.MfgOrderName
  }));

  try {
    const res: any = await WorkOrderOrderStatusResumeExecute(params);
    if (res && res.success && res.code === 0) {
      ElMessage.success(res.msg || `成功解除 ${selectedRows.value.length} 个工单的暂停`);
      selectedRows.value = [];
      getData();
    } else {
      ElMessage.error(res?.msg || "解除暂停失败");
    }
  } catch (error) {
    console.error('解除暂停失败:', error);
    ElMessage.error("解除暂停失败，请稍后重试");
  }
};

/** 分页 */
const handleSizeChange = (val: number) => {
  pageObj.value.pageSize = val;
  pageObj.value.currentPage = 1;
  getData();
};

const handleCurrentChange = (val: number) => {
  pageObj.value.currentPage = val;
  getData();
};

/** 表格高度自适应 */
const updateTableHeight = () => {
  tableHeight.value = window.innerHeight - 220;
};

onMounted(() => {
  updateTableHeight();
  window.addEventListener("resize", updateTableHeight);
  fetchDropdownData().then(() => {
    getData();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateTableHeight);
});
</script>

<style scoped>
/* 可根据需要添加样式 */
</style>