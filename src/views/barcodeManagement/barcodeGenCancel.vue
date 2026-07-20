<template>
  <div class="p-2 h-full flex flex-col">
    <el-card shadow="always" :body-style="{ padding: '12px' }" class="flex-none">
      <!-- 表单 -->
      <el-form
        ref="formRef"
        size="small"
        :model="form"
        label-width="auto"
        :inline="true"
      >
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="工单编号" prop="orderNo" style="width: 100%">
              <el-select
                v-model="form.orderNo"
                placeholder="请选择工单"
                filterable
                clearable
                style="width: 100%"
                @change="handleOrderChange"
              >
                <el-option
                  v-for="item in orderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工单描述" style="width: 100%">
              <el-input v-model="form.orderDesc" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车间" style="width: 100%">
              <el-input v-model="form.workshop" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品编码" style="width: 100%">
              <el-input v-model="form.productCode" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="产品编码描述" style="width: 100%">
              <el-input v-model="form.productDesc" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工单数量" style="width: 100%">
              <el-input v-model="form.orderQty" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="已生成数量" style="width: 100%">
              <el-input v-model="form.generatedQty" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工单状态" style="width: 100%">
              <el-input v-model="form.orderStatus" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="计划开始时间" style="width: 100%">
              <el-input v-model="form.planStartTime" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="计划结束时间" style="width: 100%">
              <el-input v-model="form.planEndTime" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="mt-1">
          <el-col :span="6">
            <el-form-item label="生成数量" prop="generateQty" style="width: 100%">
              <el-input-number
                v-model="form.generateQty"
                :min="0"
                :max="999999"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="打印机" prop="printer" style="width: 100%">
              <el-select
                v-model="form.printer"
                placeholder="请选择打印机"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in printerOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="flex items-end justify-end" style="padding-bottom: 8px">
            <el-button type="primary" size="small" @click="handleGenerate">生成并打印</el-button>
            <el-button type="warning" size="small" @click="handleReprint">重印</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div ref="tablesContainerRef" class="flex mt-2 flex-1 min-h-0">
      <!-- 左侧表格 -->
      <div class="flex-1 mr-1 flex flex-col min-h-0">
        <el-card
          shadow="always"
          :body-style="{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column' }"
          class="flex-1"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-bold text-sm">工单已生产条码列表</span>
              <div class="flex gap-2">
                <el-select
                  v-model="reprintForm.mfgOrderName"
                  placeholder="重印工单"
                  filterable
                  clearable
                  size="small"
                  style="width: 160px"
                  @change="handleReprintOrderChange"
                >
                  <el-option
                    v-for="item in reprintOrderOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-input
                  v-model="reprintForm.containerName"
                  placeholder="重印条码"
                  size="small"
                  style="width: 180px"
                  clearable
                  @keyup.enter="handleSearchAndAddToLeftTable"
                  @clear="handleReprintContainerClear"
                />
              </div>
            </div>
          </template>
          <el-table
            ref="leftTableRef"
            :data="leftTableData"
            size="small"
            style="width: 100%"
            :height="tableHeight"
            border
            fit
            highlight-current-row
            @selection-change="handleLeftSelectionChange"
          >
            <el-table-column type="selection" width="45" align="center" />
            <el-table-column type="index" label="序号" width="55" align="center">
              <template #default="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="orderNo" label="工单号" min-width="140" show-overflow-tooltip />
            <el-table-column prop="barcode" label="条码号" min-width="160" show-overflow-tooltip />
            <el-table-column prop="process" label="工序" min-width="120" show-overflow-tooltip />
          </el-table>
        </el-card>
      </div>

      <!-- 右侧表格 -->
      <div class="flex-1 ml-1 flex flex-col min-h-0">
        <el-card
          shadow="always"
          :body-style="{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column' }"
          class="flex-1"
        >
          <template #header>
            <span class="font-bold text-sm">工单新生成条码列表</span>
          </template>
          <el-table
            ref="rightTableRef"
            :data="rightTableData"
            size="small"
            style="width: 100%"
            :height="tableHeight"
            border
            fit
            highlight-current-row
          >
            <el-table-column type="index" label="序号" width="55" align="center">
              <template #default="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="orderNo" label="工单" min-width="140" show-overflow-tooltip />
            <el-table-column prop="barcode" label="条码" min-width="160" show-overflow-tooltip />
          </el-table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import {
  PrinterQuery,
  MfgOrderQuery,
  MfgOrderDetailQuery,
  MfgOrderContainerListQuery,
  MfgOrderContainerStart,
  ReprintPrint,
} from "@/api/operate";

// 导入新接口
import { ReprintMfgOrderList, ReprintContainerList } from "@/api/operate";

const form = ref({
  orderNo: "", orderDesc: "", workshop: "", productCode: "", productDesc: "",
  orderQty: "", generatedQty: "", orderStatus: "", planStartTime: "", planEndTime: "",
  generateQty: 0, printer: "",
});

const orderOptions = ref<{ value: string; label: string }[]>([]);

const getOrderOptions = async () => {
  const res: any = await MfgOrderQuery({});
  if (res.success && res.code === 0) {
    orderOptions.value = (res.content || []).map((item: any) => ({
      value: item.MfgOrderName,
      label: item.MfgOrderName,
    }));
  }
};

const printerOptions = ref<{ value: string; label: string }[]>([]);

const getPrinterOptions = async () => {
  const res: any = await PrinterQuery();
  if (res.success && res.code === 0) {
    printerOptions.value = (res.content || []).map((item: any) => ({
      value: item.PrintQueueName,
      label: item.PrintQueueName,
    }));
  }
};

// 重印相关
const reprintOrderOptions = ref<{ value: string; label: string }[]>([]);
const reprintForm = ref({
  mfgOrderName: "",
  containerName: "",
});

// 获取重印工单列表
const getReprintOrderOptions = async () => {
  const res: any = await ReprintMfgOrderList();
  if (res.success && res.code === 0) {
    reprintOrderOptions.value = (res.content || []).map((item: any) => ({
      value: item.MfgOrderName,
      label: item.MfgOrderName,
    }));
  }
};

// 选择重印工单
const handleReprintOrderChange = async (val: string) => {
  if (!val) {
    return;
  }
  const res: any = await ReprintContainerList({
    MfgOrderName: val,
    ContainerName: "",
  });
  if (res.success && res.code === 0 && res.content?.length) {
    // 🔴 改为直接覆盖
    leftTableData.value = res.content.map((item: any) => ({
      orderNo: item.MfgOrderName,
      barcode: item.ContainerName,
      process: item.SpecName,
    }));
    
    ElMessage.success(`成功加载 ${leftTableData.value.length} 条条码信息`);
  } else {
    leftTableData.value = [];
  }
};

// 清空输入框
const handleReprintContainerClear = () => {
  reprintForm.value.containerName = "";
};

// 查询并添加到左侧表格
const handleSearchAndAddToLeftTable = async () => {
  if (!reprintForm.value.mfgOrderName && !reprintForm.value.containerName) {
    ElMessage.warning("请选择重印工单或输入重印条码");
    return;
  }

  const res: any = await ReprintContainerList({
    MfgOrderName: reprintForm.value.mfgOrderName,
    ContainerName: reprintForm.value.containerName,
  });

  if (res.success && res.code === 0) {
    // ✅ 直接替换，清空旧的，只显示最新的查询结果
    leftTableData.value = (res.content || []).map((item: any) => ({
      orderNo: item.MfgOrderName,
      barcode: item.ContainerName,
      process: item.SpecName,
    }));

    if (leftTableData.value.length === 0) {
      ElMessage.info("未找到相关条码信息");
    } else {
      ElMessage.success(`成功加载 ${leftTableData.value.length} 条条码信息`);
    }
    // 清空输入框
    reprintForm.value.containerName = "";
  } else {
    leftTableData.value = [];
    ElMessage.warning(res.msg || "查询失败");
  }
};

const handleOrderChange = async (val: string) => {
  if (!val) {
    form.value = { ...form.value, orderNo: "", orderDesc: "", workshop: "", productCode: "", productDesc: "", orderQty: "", generatedQty: "", orderStatus: "", planStartTime: "", planEndTime: "", generateQty: 0 };
    leftTableData.value = [];
    rightTableData.value = [];
    return;
  }
  const res: any = await MfgOrderDetailQuery({ MfgOrderName: val });
  if (res.success && res.code === 0 && res.content?.length) {
    const item = res.content[0];
    form.value = {
      ...form.value,
      orderNo: item.MfgOrderName ?? "",
      orderDesc: item.MfgOrderDesc ?? "",
      workshop: item.WorkCenterName ?? "",
      productCode: item.ProductName ?? "",
      productDesc: item.ProductDesc ?? "",
      orderQty: item.MfgOrderQty ?? "",
      generatedQty: item.GeneratedQty ?? "",
      orderStatus: item.OrderStatusName ?? "",
      planStartTime: item.PlannedStartDate ?? "",
      planEndTime: item.PlannedCompletionDate ?? "",
      generateQty: item.ProducedQty ?? 0,
    };
  }
  fetchTableData(val);
};

const leftTableRef = ref();
const rightTableRef = ref();
const leftTableData = ref<any[]>([]);
const rightTableData = ref<any[]>([]);
const selectedLeftRows = ref<any[]>([]);

const handleLeftSelectionChange = (val: any[]) => {
  selectedLeftRows.value = val;
};

const fetchTableData = async (orderNo: string) => {
  const res: any = await MfgOrderContainerListQuery({ MfgOrderName: orderNo });
  if (res.success && res.code === 0) {
    leftTableData.value = (res.content || []).map((item: any) => ({
      orderNo: item.MfgOrderName,
      barcode: item.ContainerName,
      process: item.SpecName,
    }));
  }
};

const handleGenerate = async () => {
  if (!form.value.orderNo) { ElMessage.warning("请先选择工单"); return; }
  if (!form.value.generateQty || form.value.generateQty <= 0) { ElMessage.warning("请输入生成数量"); return; }
  if (!form.value.printer) { ElMessage.warning("请选择打印机"); return; }

  const res: any = await MfgOrderContainerStart({
    MfgOrderName: form.value.orderNo,
    ProducedQty: form.value.generateQty,
    PrinterName: form.value.printer,
  });
  if (res.success && res.code === 0) {
    const barcodes: string[] = res.content || [];
    rightTableData.value = barcodes.map((barcode: string) => ({ orderNo: form.value.orderNo, barcode }));
    ElMessage.success(res.msg || "生成并打印成功");
    getOrderOptions();
    handleOrderChange(form.value.orderNo);
  } else {
    ElMessage.error(res.msg || "生成并打印失败");
  }
};

// ✅ 修改后的 handleReprint 函数
const handleReprint = async () => {
  // 卡控1：必须有勾选的条码
  if (selectedLeftRows.value.length === 0) { 
    ElMessage.warning("请先在左侧表格勾选要重印的条码"); 
    return; 
  }
  
  // 卡控2：必须选择打印机
  if (!form.value.printer) { 
    ElMessage.warning("请选择打印机"); 
    return; 
  }

  // 从勾选的条码中获取工单号（取第一个勾选的条码的工单号）
  const orderNo = selectedLeftRows.value[0]?.orderNo;
  if (!orderNo) {
    ElMessage.warning("无法获取工单号，请重新勾选");
    return;
  }

  const printRes: any = await ReprintPrint({
    PrinterName: form.value.printer,
    MfgOrderName: orderNo,
    reprintPrintContainerLists: selectedLeftRows.value.map((row: any) => ({ ContainerName: row.barcode })),
  });
  
  if (printRes.success && printRes.code === 0) {
    leftTableRef.value?.clearSelection();
    selectedLeftRows.value = [];
    ElMessage.success(printRes.msg || "重印成功");
    getOrderOptions();
    handleOrderChange(orderNo);
  } else {
    ElMessage.error(printRes.msg || "重印失败");
  }
};

// ====== 生命周期 ======
const tableHeight = ref(200);
const tablesContainerRef = ref<HTMLElement>();
let observer: ResizeObserver | null = null;

onMounted(() => {
  observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      tableHeight.value = entry.contentRect.height - 51;
    }
  });
  if (tablesContainerRef.value) {
    observer.observe(tablesContainerRef.value);
  }
  getOrderOptions();
  getPrinterOptions();
  getReprintOrderOptions();
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<style scoped>
:deep(.el-form-item) {
  margin-bottom: 8px;
}
:deep(.el-card__header) {
  padding: 8px 16px;
}
.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.gap-2 {
  gap: 8px;
}
</style>