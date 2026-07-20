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
          <el-form-item label="工单号" class="mb-2">
            <el-input
              v-model="queryForm.MfgOrder"
              placeholder="输入工单号"
              style="width: 180px"
              clearable
              @clear="getData"
              @change="getData"
            />
          </el-form-item>
          <el-form-item label="产品信息" class="mb-2">
            <el-input
              v-model="queryForm.Product"
              placeholder="输入产品名称或编码"
              style="width: 200px"
              clearable
              @clear="getData"
              @change="getData"
            />
          </el-form-item>
          <el-form-item label="工序" class="mb-2">
            <el-select
              v-model="queryForm.Spec"
              style="width: 160px"
              @change="getData"
              placeholder="全部"
              clearable
            >
              <el-option label="全部" :value="null" />
              <el-option
                v-for="item in specOptions"
                :key="item.SpecName"
                :label="item.SpecName"
                :value="item.SpecName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="不良品SN" class="mb-2">
            <el-input
              v-model="queryForm.SN"
              placeholder="输入不良品SN"
              style="width: 180px"
              clearable
              @clear="getData"
              @change="getData"
            />
          </el-form-item>
          <el-form-item label="不良代码" class="mb-2">
            <el-input
              v-model="queryForm.QCNGCode"
              placeholder="输入不良代码或名称"
              style="width: 200px"
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
              <el-option label="待处理" :value="0" />
              <el-option label="已返修" :value="1" />
              <el-option label="已报废" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button type="success" @click="handleAdd">录入</el-button>
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
          prop="ProductDesc"
          label="产品名称"
          min-width="150"
          show-overflow-tooltip
        >
          <template #default="scope">
            <span>{{ scope.row.ProductDesc || "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="Spec"
          label="工序"
          min-width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="SN"
          label="不良品SN"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="QCNGCodes"
          label="不良代码"
          min-width="120"
          show-overflow-tooltip
        >
          <template #default="scope">
            <span>{{ scope.row.QCNGCodes || "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.Status)" size="small">
              {{ scope.row.Status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="CreateUser" label="创建人" width="140" />
        <el-table-column prop="CreateTime" label="创建时间" width="170" />
        <!-- 操作列 -->
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleDetail(scope.row)"
              >查看明细</el-button
            >
            <el-button
              type="warning"
              size="small"
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
          </template>
        </el-table-column>
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

    <!-- 明细弹窗（只展示check为true的） -->
    <el-dialog
      v-model="detailDialogVisible"
      title="不良明细"
      draggable
      width="700px"
      :close-on-click-modal="false"
      align-center
    >
      <el-table :data="detailData" size="small" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column
          prop="Code"
          label="不良代码"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="Desc"
          label="不良描述"
          min-width="200"
          show-overflow-tooltip
        />
      </el-table>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 录入/编辑弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="dialogMode === 'add' ? '新增不良记录' : '编辑不良记录'"
      draggable
      width="750px"
      :close-on-click-modal="false"
      align-center
      @close="addDialogCancel"
    >
      <!-- SN扫码输入（编辑模式禁用输入） -->
      <div class="mb-5">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-base font-medium">扫描不良</span>
          <el-tag v-if="dialogMode === 'edit'" type="warning" size="small"
            >编辑模式</el-tag
          >
        </div>
        <div class="flex gap-2 items-center">
          <el-input
            v-model="scanSN"
            placeholder="请扫描或输入在制品SN"
            size="large"
            clearable
            :disabled="dialogMode === 'edit'"
            @keyup.enter="handleScanSN"
            class="scan-input flex-1"
          />
          <el-button
            type="primary"
            icon="Search"
            :disabled="dialogMode === 'edit'"
            @click="handleScanSN"
          >
            扫描
          </el-button>
        </div>
        <div v-if="dialogMode === 'edit'" class="text-sm text-gray-400 mt-1">
          <el-icon><InfoFilled /></el-icon>
          编辑模式下不允许修改SN
        </div>
      </div>

      <!-- 在制品信息 -->
      <div class="mb-5">
        <div class="section-title">
          <span class="title-text">在制品信息</span>
        </div>
        <div class="info-card">
          <el-row :gutter="16">
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">在制品SN</div>
                <div class="info-value">{{ scanInfo.SN || "-" }}</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">工序</div>
                <div class="info-value">{{ scanInfo.Spec || "-" }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">产品信息</div>
                <div class="info-value">{{ scanInfo.Product || "-" }}</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">工单号</div>
                <div class="info-value">{{ scanInfo.MfgOrder || "-" }}</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 不良原因选择 -->
      <div class="mb-3">
        <div class="section-title">
          <span class="title-text">不良原因选择（可多选）</span>
          <span v-if="selectedDefectCodes.length > 0" class="selected-count"
            >已选 {{ selectedDefectCodes.length }} 项</span
          >
          <span v-else class="selected-count" style="color: #f56c6c"
            >请至少选择一项</span
          >
        </div>
        <div
          v-if="scanInfo.QCNGCode && scanInfo.QCNGCode.length > 0"
          class="code-list-simple"
        >
          <div
            v-for="item in scanInfo.QCNGCode"
            :key="item.Code"
            class="code-row"
            @click="toggleCode(item.Code)"
          >
            <el-checkbox
              :model-value="selectedDefectCodes.includes(item.Code)"
              size="default"
            />
            <div class="code-text-wrap">
              <div class="code-main">{{ item.Desc }}</div>
              <div class="code-sub">{{ item.Code }}</div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <el-icon :size="32" color="#c0c4cc"><Document /></el-icon>
          <span>请扫码后加载不良代码列表</span>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDialogCancel" size="default">取消</el-button>
          <el-button
            type="primary"
            @click="addDialogConfirm"
            :disabled="!scanInfo.MfgOrder || selectedDefectCodes.length === 0"
            size="default"
          >
            {{ dialogMode === "add" ? "提交" : "更新" }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  View,
  Search,
  Document,
  Edit,
  InfoFilled,
} from "@element-plus/icons-vue";
import {
  QueryDefectMain,
  QueryOperationDropdown,
  QueryDefectDetails,
  ScanDefectSN,
  SubmitDefectData,
} from "@/api/productionDefect";

/** 获取状态标签类型 */
const getStatusTagType = (status: string): string => {
  const map: Record<string, string> = {
    '待处理': 'info',
    '已返修': 'warning',
    '已报废': 'danger'
  };
  return map[status] || 'info';
};

// ====== 查询 ======
const queryForm = ref({
  MfgOrder: "",
  Product: "",
  Spec: null as string | null,
  SN: "",
  QCNGCode: "",
  Status: null as number | null, // 改为 number 类型
  CreateStartTime: "",
  CreateEndTime: "",
});

const tableData = ref<any[]>([]);
const total = ref(0);
const pageObj = ref({ currentPage: 1, pageSize: 30 });
const tableHeight = ref(400);

// 规格下拉选项
const specOptions = ref<any[]>([]);

// ====== 明细弹窗 ======
const detailDialogVisible = ref(false);
const detailData = ref<any[]>([]);

// ====== 录入/编辑弹窗 ======
const addDialogVisible = ref(false);
const dialogMode = ref<"add" | "edit">("add");
const currentEditDefectNo = ref("");
const scanSN = ref("");
const scanInfo = ref({
  SN: "",
  Spec: "",
  Product: "",
  MfgOrder: "",
  QCNGCode: [] as { Code: string; Desc: string; check: string }[],
});
const selectedDefectCodes = ref<string[]>([]);

/** 点击整行切换勾选 */
const toggleCode = (code: string) => {
  const idx = selectedDefectCodes.value.indexOf(code);
  if (idx > -1) {
    selectedDefectCodes.value.splice(idx, 1);
  } else {
    selectedDefectCodes.value.push(code);
  }
};

/** 获取规格下拉数据 */
const fetchSpecOptions = async () => {
  const res: any = await QueryOperationDropdown();
  if (res && res.success && res.code === 0) {
    specOptions.value = res.content || [];
  } else {
    console.warn("获取规格下拉失败", res?.msg);
    specOptions.value = [];
  }
};

const getData = async () => {
  const params: any = {
    MfgOrder: queryForm.value.MfgOrder,
    Product: queryForm.value.Product,
    Spec: queryForm.value.Spec,
    SN: queryForm.value.SN,
    QCNGCode: queryForm.value.QCNGCode,
    pageSize: pageObj.value.pageSize,
    currentPage: pageObj.value.currentPage,
  };

  // 状态传数字
  if (queryForm.value.Status !== null && queryForm.value.Status !== undefined) {
    params.Status = queryForm.value.Status;
  }
  if (queryForm.value.CreateStartTime) {
    params.CreateStartTime = queryForm.value.CreateStartTime;
  }
  if (queryForm.value.CreateEndTime) {
    params.CreateEndTime = queryForm.value.CreateEndTime;
  }

  const res: any = await QueryDefectMain(params);
  if (res && res.success && res.code === 0) {
    tableData.value = res.content || [];
    total.value = res.total || 0;
  } else {
    ElMessage.error((res && res.msg) || "查询失败");
    tableData.value = [];
    total.value = 0;
  }
};

/** 查看明细 - 只展示 check 为 true 的 */
const handleDetail = async (row: any) => {
  if (!row.DefectNo) {
    ElMessage.warning("不良单号为空");
    return;
  }

  const res: any = await QueryDefectDetails({ DefectNo: row.DefectNo });
  if (res && res.success && res.code === 0) {
    // 只过滤 check 为 true 的数据
    const filteredData = (res.content || []).filter(
      (item: any) => item.check === true || item.check === "true",
    );
    detailData.value = filteredData;

    if (filteredData.length === 0) {
      ElMessage.info("该不良单暂无选中的不良代码");
    }
    detailDialogVisible.value = true;
  } else {
    ElMessage.error((res && res.msg) || "获取明细失败");
    detailData.value = [];
  }
};

/** 打开录入弹窗 */
const handleAdd = () => {
  dialogMode.value = "add";
  currentEditDefectNo.value = "";
  addDialogVisible.value = true;
  scanSN.value = "";
  scanInfo.value = {
    SN: "",
    Spec: "",
    Product: "",
    MfgOrder: "",
    QCNGCode: [],
  };
  selectedDefectCodes.value = [];
};

/** 打开编辑弹窗 */
const handleEdit = async (row: any) => {
  if (!row.DefectNo) {
    ElMessage.warning("不良单号为空");
    return;
  }

  dialogMode.value = "edit";
  currentEditDefectNo.value = row.DefectNo;

  const detailRes: any = await QueryDefectDetails({ DefectNo: row.DefectNo });
  if (!detailRes || !detailRes.success || detailRes.code !== 0) {
    ElMessage.error("获取不良明细失败");
    return;
  }

  const checkedCodes = (detailRes.content || [])
    .filter((item: any) => item.check === true || item.check === "true")
    .map((item: any) => item.Code);

  scanSN.value = row.SN || "";
  scanInfo.value = {
    SN: row.SN || "",
    Spec: row.Spec || "",
    Product: row.Product || "",
    MfgOrder: row.MfgOrder || "",
    QCNGCode: detailRes.content || [],
  };
  selectedDefectCodes.value = checkedCodes;

  addDialogVisible.value = true;
};

/** 扫描SN */
const handleScanSN = async () => {
  const sn = scanSN.value?.trim();
  if (!sn) {
    ElMessage.warning("请输入SN");
    return;
  }

  // 编辑模式重新扫码需要确认
  if (dialogMode.value === "edit") {
    try {
      await ElMessageBox.confirm("重新扫码将覆盖当前数据，确认继续？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      });
    } catch {
      return;
    }
  }

  const res: any = await ScanDefectSN({ SN: sn });
  if (res && res.success && res.code === 0 && res.content) {
    const data = res.content;
    scanInfo.value = {
      SN: data.SN || "",
      Spec: data.Spec || "",
      Product: data.Product || "",
      MfgOrder: data.MfgOrder || "",
      QCNGCode: data.QCNGCode || [],
    };
    // 新增模式清空已选，编辑模式保留已选（如果新扫码的代码列表中有匹配的会自动勾选）
    if (dialogMode.value === "add") {
      selectedDefectCodes.value = [];
    } else {
      // 编辑模式：保留原有选中，但过滤掉新列表中不存在的
      const newCodes = data.QCNGCode.map((item: any) => item.Code);
      selectedDefectCodes.value = selectedDefectCodes.value.filter((code) =>
        newCodes.includes(code),
      );
    }
    ElMessage.success("SN扫码成功");
  } else {
    ElMessage.error((res && res.msg) || "扫码失败");
  }
};

/** 录入弹窗取消 */
const addDialogCancel = () => {
  addDialogVisible.value = false;
  scanSN.value = "";
  scanInfo.value = {
    SN: "",
    Spec: "",
    Product: "",
    MfgOrder: "",
    QCNGCode: [],
  };
  selectedDefectCodes.value = [];
  currentEditDefectNo.value = "";
};

/** 录入弹窗确认保存 */
const addDialogConfirm = async () => {
  if (!scanInfo.value.MfgOrder) {
    ElMessage.warning("请先扫描SN");
    return;
  }

  if (selectedDefectCodes.value.length === 0) {
    ElMessage.warning("请至少选择一个不良代码");
    return;
  }

  // 获取当前用户
  const operator = localStorage.getItem("LOGINNAME") || "";
  console.log("当前操作人:", operator);

  if (!operator) {
    ElMessage.warning("请先登录");
    return;
  }

  const selectedItems = scanInfo.value.QCNGCode.filter((item) =>
    selectedDefectCodes.value.includes(item.Code),
  );

  const params = {
    DefectNo: dialogMode.value === "add" ? "" : currentEditDefectNo.value,
    MfgOrder: scanInfo.value.MfgOrder,
    Product: scanInfo.value.Product,
    Spec: scanInfo.value.Spec,
    SN: scanInfo.value.SN,
    Operator: operator,
    reBornSubmitDefectDataDetailEntities: selectedItems.map((item: any) => ({
      QCNGCode: item.Code,
      QCNGDesc: item.Desc,
    })),
  };

  console.log("提交参数：", params);

  const res: any = await SubmitDefectData(params);
  if (res && res.success && res.code === 0) {
    ElMessage.success(dialogMode.value === "add" ? "保存成功" : "更新成功");
    addDialogCancel();
    getData();
  } else {
    ElMessage.error((res && res.msg) || "操作失败");
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

onMounted(() => {
  updateTableHeight();
  window.addEventListener("resize", updateTableHeight);
  fetchSpecOptions().then(() => {
    getData();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateTableHeight);
});
</script>

<style scoped>
/* ===== 录入弹窗通用样式 ===== */
.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.title-text {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
.selected-count {
  margin-left: auto;
  font-size: 13px;
  color: #409eff;
}

/* 信息卡片 */
.info-card {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
}
.info-item {
  padding: 6px 0;
}
.info-label {
  font-size: 13px;
  color: #909399;
}
.info-value {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0 35px;
  border: 1px dashed #e4e7ed;
  border-radius: 8px;
  color: #c0c4cc;
  font-size: 14px;
  gap: 10px;
}

/* ===== 不良代码列表（上下结构） ===== */
.code-list-simple {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  max-height: 320px;
  overflow-y: auto;
}
.code-list-simple::-webkit-scrollbar {
  width: 6px;
}
.code-list-simple::-webkit-scrollbar-track {
  background: #f0f2f5;
}
.code-list-simple::-webkit-scrollbar-thumb {
  background: #d0d5df;
  border-radius: 3px;
}
.code-row {
  display: flex;
  align-items: flex-start;
  padding: 10px 14px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.code-row:last-child {
  border-bottom: none;
}
.code-row:hover {
  background-color: #f7f8fa;
}
.code-text-wrap {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.code-main {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}
.code-sub {
  font-size: 13px;
  color: #909399;
}

/* 输入框 */
.scan-input :deep(.el-input__wrapper) {
  border-radius: 4px;
}

/* 弹窗底部 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 弹窗整体优化 */
:deep(.el-dialog) {
  border-radius: 4px;
}
:deep(.el-dialog__header) {
  padding: 16px 20px;
}
:deep(.el-dialog__body) {
  padding: 16px 20px;
}
:deep(.el-dialog__footer) {
  padding: 12px 20px;
}

/* 操作列按钮间距 */
.el-table .cell .el-button + .el-button {
  margin-left: 4px;
}
</style>
