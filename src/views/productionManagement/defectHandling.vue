<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <!-- Tabs 切换 -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="待处理" name="pending">
          <div class="flex items-center gap-2 py-2">
            <el-input 
              v-model="pendingQuery.SN" 
              placeholder="输入不良品SN" 
              style="width: 200px" 
              clearable 
              @clear="getData" 
              @keyup.enter="getData"
            />
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button @click="resetPendingQuery">重置</el-button>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="已处理" name="processed">
          <div class="flex items-center gap-2 py-2 flex-wrap">
            <el-input 
              v-model="processedQuery.SN" 
              placeholder="输入不良品SN" 
              style="width: 180px" 
              clearable 
              @clear="getData" 
              @keyup.enter="getData"
            />
            <el-input 
              v-model="processedQuery.MfgOrder" 
              placeholder="输入工单号" 
              style="width: 180px" 
              clearable 
              @clear="getData" 
              @keyup.enter="getData"
            />
            <el-select 
              v-model="processedQuery.StatusCode" 
              style="width: 120px" 
              @change="getData" 
              placeholder="处理结果" 
              clearable
            >
              <el-option label="全部" :value="null" />
              <el-option label="返修" :value="1" />
              <el-option label="报废" :value="2" />
            </el-select>
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button @click="resetProcessedQuery">重置</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!-- 表格 - 使用动态列 -->
      <el-table :data="tableData" size="small" style="width: 100%" :height="tableHeight" border fit highlight-current-row>
        <el-table-column type="index" align="center" label="序号" width="55">
          <template #default="scope">
            <span>{{ scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1 }}</span>
          </template>
        </el-table-column>
        
        <!-- 待处理列 -->
        <template v-if="activeTab === 'pending'">
          <el-table-column prop="MfgOrder" label="工单号" min-width="130" show-overflow-tooltip />
          <el-table-column prop="Product" label="产品信息" min-width="130" show-overflow-tooltip />
          <el-table-column prop="Spec" label="工序" min-width="100" show-overflow-tooltip />
          <el-table-column prop="SN" label="不良品SN" min-width="150" show-overflow-tooltip />
          <el-table-column prop="QCNGCodes" label="不良代码/原因" min-width="220" show-overflow-tooltip />
          <el-table-column prop="CreateUser" label="创建人" width="100" />
          <el-table-column prop="CreateTime" label="创建时间" width="170" />
          <!-- 不良处理列 -->
          <el-table-column label="不良处理" width="110" fixed="right" align="center">
            <template #default="scope">
              <el-button 
                type="success" 
                size="small" 
                @click="handleDefectProcess(scope.row)"
              >
                不良处理
              </el-button>
            </template>
          </el-table-column>
        </template>
        
        <!-- 已处理列 -->
        <template v-else>
          <el-table-column prop="MfgOrder" label="工单号" min-width="130" show-overflow-tooltip />
          <el-table-column prop="Product" label="产品信息" min-width="130" show-overflow-tooltip />
          <el-table-column prop="Spec" label="工序" min-width="100" show-overflow-tooltip />
          <el-table-column prop="SN" label="不良品SN" min-width="150" show-overflow-tooltip />
          <el-table-column prop="QCNGCodes" label="不良代码/原因" min-width="220" show-overflow-tooltip />
          <el-table-column prop="ProcessInfo" label="处理代码/原因" min-width="180" show-overflow-tooltip>
            <template #default="scope">
              <span>{{ scope.row.ProcessInfo || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="UpdateUser" label="处理人" width="100">
            <template #default="scope">
              <span>{{ scope.row.UpdateUser || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="UpdateTime" label="处理时间" width="170">
            <template #default="scope">
              <span>{{ scope.row.UpdateTime || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ProcessingResult" label="处理结果" width="100" align="center">
          </el-table-column>
          <!-- 操作列 -->
          <el-table-column label="操作" width="110" fixed="right" align="center">
            <template #default="scope">
              <el-button 
                type="primary" 
                size="small" 
                @click="handleViewDetail(scope.row)"
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>

      <div class="mt-2">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :pager-count="5" :current-page="pageObj.currentPage" :page-size="pageObj.pageSize"
          :page-sizes="[30, 50, 100, 200, 300]" layout="total,sizes, prev, pager, next" :total="total" />
      </div>
    </el-card>

    <!-- 不良处理弹窗 -->
    <el-dialog 
      v-model="defectProcessDialogVisible" 
      title="不良处理" 
      draggable 
      width="700px" 
      :close-on-click-modal="false" 
      align-center
      @close="resetForm"
    >
      <!-- 不良基础信息展示 -->
      <div class="defect-info-section">
        <div class="section-title">不良基础信息</div>
        <el-row :gutter="16" class="info-grid">
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">不良品SN：</span>
              <span class="info-value">{{ currentDefectRow?.SN || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">工单号：</span>
              <span class="info-value">{{ currentDefectRow?.MfgOrder || '-' }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="info-grid">
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">发现工序：</span>
              <span class="info-value">{{ currentDefectRow?.Spec || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">产品信息：</span>
              <span class="info-value">{{ currentDefectRow?.Product || '-' }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 不良代码列表 -->
      <div class="defect-code-section">
        <div class="section-title">不良代码列表</div>
        <el-table :data="defectCodeList" size="small" border style="width: 100%">
          <el-table-column prop="Code" label="不良代码" min-width="150" show-overflow-tooltip />
          <el-table-column prop="Desc" label="不良描述" min-width="250" show-overflow-tooltip />
        </el-table>
      </div>

      <!-- 处理表单 -->
      <div class="process-form-section">
        <div class="section-title">处理信息</div>
        
        <!-- Radio 切换 -->
        <el-form label-width="100px" size="default">
          <el-form-item label="处理方式">
            <el-radio-group v-model="processType" @change="handleProcessTypeChange">
              <el-radio :label="1">返修</el-radio>
              <el-radio :label="2">报废</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <!-- 返修表单 -->
        <template v-if="processType === 1">
          <el-form label-width="100px" size="default">
            <el-form-item label="重投工序" required>
              <el-select 
                v-model="processForm.ReworkProcess" 
                placeholder="请选择重投工序" 
                style="width: 100%"
                @focus="fetchOperationDropdown"
                @change="handleReworkProcessChange"
              >
                <el-option 
                  v-for="item in operationOptions" 
                  :key="item.SpecName" 
                  :label="item.SpecName" 
                  :value="item.SpecName" 
                />
              </el-select>
            </el-form-item>
            <el-form-item label="返修代码" required>
              <el-select 
                v-model="processForm.QCMROCode" 
                placeholder="请选择返修代码" 
                style="width: 100%"
                @focus="fetchScrapReason"
                @change="handleQCMROCodeChange"
              >
                <el-option 
                  v-for="item in scrapReasonOptions" 
                  :key="item.Code" 
                  :label="item.Desc" 
                  :value="item.Code" 
                />
              </el-select>
            </el-form-item>
            <el-form-item label="返修描述">
              <el-input 
                v-model="processForm.RepairDesc" 
                type="textarea" 
                :rows="3" 
                placeholder="请输入返修描述" 
              />
            </el-form-item>
          </el-form>
        </template>

        <!-- 报废表单 -->
        <template v-if="processType === 2">
          <el-form label-width="100px" size="default">
            <el-form-item label="报废原因" required>
              <el-input 
                v-model="processForm.ScrapReason" 
                type="textarea" 
                :rows="4" 
                placeholder="请输入报废原因" 
              />
            </el-form-item>
          </el-form>
        </template>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="defectProcessDialogVisible = false">关闭</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmitProcess">提交处理</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看详情弹窗 -->
    <el-dialog 
      v-model="viewDetailDialogVisible" 
      title="查看详情" 
      draggable 
      width="600px" 
      :close-on-click-modal="false" 
      align-center
    >
      <!-- 不良基础信息展示 -->
      <div class="defect-info-section">
        <div class="section-title">不良基础信息</div>
        <el-row :gutter="16" class="info-grid">
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">不良品SN：</span>
              <span class="info-value">{{ viewDetailRow?.SN || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">工单号：</span>
              <span class="info-value">{{ viewDetailRow?.MfgOrder || '-' }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="info-grid">
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">发现工序：</span>
              <span class="info-value">{{ viewDetailRow?.Spec || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">产品信息：</span>
              <span class="info-value">{{ viewDetailRow?.Product || '-' }}</span>
            </div>
          </el-col>
        </el-row>
        <!-- 已处理额外信息 -->
        <el-row :gutter="16" class="info-grid" v-if="activeTab === 'processed'">
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">处理代码/处理原因：</span>
              <span class="info-value">{{ viewDetailRow?.ProcessInfo || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">处理人：</span>
              <span class="info-value">{{ viewDetailRow?.UpdateUser || '-' }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="info-grid" v-if="activeTab === 'processed'">
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">处理时间：</span>
              <span class="info-value">{{ viewDetailRow?.UpdateTime || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="info-label">处理结果：</span>
              <span class="info-value">
                {{ viewDetailRow?.ProcessingResult }}
              </span>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 不良代码列表 -->
      <div class="defect-code-section">
        <div class="section-title">不良代码列表</div>
        <el-table :data="viewDetailCodeList" size="small" border style="width: 100%">
          <el-table-column prop="Code" label="不良代码" min-width="150" show-overflow-tooltip />
          <el-table-column prop="Desc" label="不良描述" min-width="250" show-overflow-tooltip />
        </el-table>
      </div>

      <template #footer>
        <el-button @click="viewDetailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import { 
  QueryDefectMain, 
  QueryOperationDropdown, 
  ScrapReasonByProcess,
  SubmitRework,
  SubmitScrap
} from "@/api/productionDefect";

// ====== Tab 状态 ======
const activeTab = ref<'pending' | 'processed'>('pending');

// ====== 待处理查询参数 ======
const pendingQuery = ref({
  SN: "",
});

// ====== 已处理查询参数 ======
const processedQuery = ref({
  SN: "",
  MfgOrder: "",
  StatusCode: null as number | null,
});

const tableData = ref<any[]>([]);
const total = ref(0);
const pageObj = ref({ currentPage: 1, pageSize: 30 });
const tableHeight = ref(400);

// ====== 不良处理弹窗 ======
const defectProcessDialogVisible = ref(false);
const currentDefectRow = ref<any>(null);
const defectCodeList = ref<any[]>([]);

// ====== 查看详情弹窗 ======
const viewDetailDialogVisible = ref(false);
const viewDetailRow = ref<any>(null);
const viewDetailCodeList = ref<any[]>([]);

// ====== 处理表单 ======
const processType = ref<1 | 2>(1);
const scrapReasonOptions = ref<any[]>([]);
const operationOptions = ref<any[]>([]);
const isLoadingScrapReason = ref(false);
const isLoadingOperation = ref(false);
const submitLoading = ref(false);

// ====== 缓存 ======
const scrapReasonCache = ref<Map<string, any[]>>(new Map());
const operationCacheLoaded = ref(false);

const processForm = ref({
  QCMROCode: "",
  RepairDesc: "",
  ReworkProcess: "",
  ScrapReason: "",
});

/** 获取数据 */
const getData = async () => {
  const params: any = {
    pageSize: pageObj.value.pageSize,
    currentPage: pageObj.value.currentPage,
  };

  if (activeTab.value === 'pending') {
    params.SN = pendingQuery.value.SN || undefined;
    params.StatusCode = 0;
  } else {
    params.SN = processedQuery.value.SN || undefined;
    params.MfgOrder = processedQuery.value.MfgOrder || undefined;
    params.StatusCode = 1;
    if (processedQuery.value.StatusCode !== null && processedQuery.value.StatusCode !== undefined) {
      params.StatusResult = processedQuery.value.StatusCode;
    }
  }

  Object.keys(params).forEach(key => {
    if (params[key] === undefined || params[key] === '') {
      delete params[key];
    }
  });

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

/** Tab 切换 */
const handleTabChange = () => {
  pageObj.value.currentPage = 1;
  getData();
};

/** 重置待处理查询 */
const resetPendingQuery = () => {
  pendingQuery.value.SN = "";
  pageObj.value.currentPage = 1;
  getData();
};

/** 重置已处理查询 */
const resetProcessedQuery = () => {
  processedQuery.value.SN = "";
  processedQuery.value.MfgOrder = "";
  processedQuery.value.StatusCode = null;
  pageObj.value.currentPage = 1;
  getData();
};

/** 获取返修代码（带缓存） */
const fetchScrapReason = async () => {
  if (!currentDefectRow.value?.Spec) {
    ElMessage.warning("未获取到工序信息");
    return;
  }

  if (!processForm.value.ReworkProcess) {
    ElMessage.warning("请先选择重投工序");
    return;
  }

  const cacheKey = `${currentDefectRow.value.Spec}_${processForm.value.ReworkProcess}`;
  
  if (scrapReasonCache.value.has(cacheKey)) {
    scrapReasonOptions.value = scrapReasonCache.value.get(cacheKey) || [];
    return;
  }

  if (isLoadingScrapReason.value) return;
  
  isLoadingScrapReason.value = true;
  try {
    const res: any = await ScrapReasonByProcess({ 
      Spec: currentDefectRow.value.Spec,
      ReworkProcess: processForm.value.ReworkProcess 
    });
    if (res && res.success && res.code === 0) {
      const data = res.content || [];
      scrapReasonCache.value.set(cacheKey, data);
      scrapReasonOptions.value = data;
    } else {
      ElMessage.error((res && res.msg) || "获取返修代码失败");
      scrapReasonOptions.value = [];
    }
  } catch (error) {
    console.error('获取返修代码失败:', error);
    scrapReasonOptions.value = [];
  } finally {
    isLoadingScrapReason.value = false;
  }
};

/** 获取工序下拉（带缓存） */
const fetchOperationDropdown = async () => {
  if (operationCacheLoaded.value) {
    return;
  }

  if (isLoadingOperation.value) return;

  isLoadingOperation.value = true;
  try {
    const res: any = await QueryOperationDropdown();
    if (res && res.success && res.code === 0) {
      operationOptions.value = res.content || [];
      operationCacheLoaded.value = true;
    } else {
      ElMessage.error((res && res.msg) || "获取工序列表失败");
      operationOptions.value = [];
    }
  } catch (error) {
    console.error('获取工序列表失败:', error);
    operationOptions.value = [];
  } finally {
    isLoadingOperation.value = false;
  }
};

/** 重投工序变更 */
const handleReworkProcessChange = () => {
  processForm.value.QCMROCode = "";
  processForm.value.RepairDesc = "";
  scrapReasonOptions.value = [];
  fetchScrapReason();
};

/** 处理方式切换 */
const handleProcessTypeChange = () => {
  if (processType.value === 1) {
    processForm.value.ReworkProcess = currentDefectRow.value?.Spec || "";
    processForm.value.QCMROCode = "";
    processForm.value.RepairDesc = "";
    scrapReasonOptions.value = [];
    fetchScrapReason();
    fetchOperationDropdown();
  } else {
    processForm.value.QCMROCode = "";
    processForm.value.RepairDesc = "";
    processForm.value.ReworkProcess = "";
    scrapReasonOptions.value = [];
  }
  processForm.value.ScrapReason = "";
};

/** 返修代码变更 */
const handleQCMROCodeChange = (val: string) => {
  const selected = scrapReasonOptions.value.find(item => item.Code === val);
  if (selected) {
    processForm.value.RepairDesc = selected.Desc || "";
  }
};

/** 解析不良代码列表 */
const parseDefectCodes = (codes: string) => {
  const codeList = (codes || '').split(',').filter((item: string) => item.trim());
  return codeList.map((item: string) => {
    const parts = item.split('-');
    return {
      Code: parts[0] || item,
      Desc: parts[1] || item
    };
  });
};

/** 不良处理 - 点击弹出详情 */
const handleDefectProcess = async (row: any) => {
  currentDefectRow.value = row;
  defectCodeList.value = parseDefectCodes(row.QCNGCodes);
  
  processType.value = 1;
  processForm.value = {
    QCMROCode: "",
    RepairDesc: "",
    ReworkProcess: row.Spec || "",
    ScrapReason: "",
  };
  
  scrapReasonOptions.value = [];
  
  await fetchOperationDropdown();
  await fetchScrapReason();
  
  defectProcessDialogVisible.value = true;
};

/** 查看详情 */
const handleViewDetail = (row: any) => {
  viewDetailRow.value = row;
  viewDetailCodeList.value = parseDefectCodes(row.QCNGCodes);
  viewDetailDialogVisible.value = true;
};

/** 重置表单 */
const resetForm = () => {
  processType.value = 1;
  processForm.value = {
    QCMROCode: "",
    RepairDesc: "",
    ReworkProcess: "",
    ScrapReason: "",
  };
  scrapReasonOptions.value = [];
  submitLoading.value = false;
};

/** 提交处理 */
const handleSubmitProcess = async () => {
  const operator = localStorage.getItem('LOGINNAME') || '';
  
  if (processType.value === 1) {
    if (!processForm.value.ReworkProcess) {
      ElMessage.warning("请选择重投工序");
      return;
    }
    if (!processForm.value.QCMROCode) {
      ElMessage.warning("请选择返修代码");
      return;
    }
    
    submitLoading.value = true;
    try {
      const params = {
        DefectNo: currentDefectRow.value?.DefectNo || '',
        QCMROCode: processForm.value.QCMROCode,
        RepairDesc: processForm.value.RepairDesc || '',
        ReworkProcess: processForm.value.ReworkProcess,
        Operator: operator,
      };
      
      const res: any = await SubmitRework(params);
      if (res && res.success && res.code === 0) {
        ElMessage.success(res.msg || "返修提交成功");
        defectProcessDialogVisible.value = false;
        await getData();
      } else {
        ElMessage.error(res?.msg || "返修提交失败");
      }
    } catch (error) {
      console.error('返修提交失败:', error);
      ElMessage.error("返修提交失败，请稍后重试");
    } finally {
      submitLoading.value = false;
    }
  } else {
    if (!processForm.value.ScrapReason) {
      ElMessage.warning("请输入报废原因");
      return;
    }
    
    submitLoading.value = true;
    try {
      const params = {
        DefectNo: currentDefectRow.value?.DefectNo || '',
        ScrapReason: processForm.value.ScrapReason,
        Operator: operator,
      };
      
      const res: any = await SubmitScrap(params);
      if (res && res.success && res.code === 0) {
        ElMessage.success(res.msg || "报废提交成功");
        defectProcessDialogVisible.value = false;
        await getData();
      } else {
        ElMessage.error(res?.msg || "报废提交失败");
      }
    } catch (error) {
      console.error('报废提交失败:', error);
      ElMessage.error("报废提交失败，请稍后重试");
    } finally {
      submitLoading.value = false;
    }
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
  getData();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateTableHeight);
});
</script>

<style scoped>
.defect-info-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
  margin-bottom: 12px;
}

.info-grid {
  background: #f5f7fa;
  padding: 8px 0;
  border-radius: 4px;
  margin-bottom: 8px;
}

.info-grid:last-child {
  margin-bottom: 0;
}

.info-item {
  padding: 6px 12px;
  font-size: 14px;
}

.info-label {
  color: #909399;
  font-weight: 500;
}

.info-value {
  color: #303133;
  font-weight: 500;
}

.defect-code-section {
  margin-bottom: 20px;
}

.process-form-section {
  margin-top: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>