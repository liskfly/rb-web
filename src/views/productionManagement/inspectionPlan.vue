<template>
  <div class="p-2 flex flex-col h-full gap-2">
    <!-- ====== 上半：检验方案 ====== -->
    <div class="flex-1 min-h-0 flex flex-col">
      <el-card class="half-card" shadow="always" :body-style="{ padding: '8px' }">
        <div class="flex justify-between items-start flex-none">
          <div></div>
          <el-form
            ref="queryFormRef"
            size="small"
            :model="queryForm"
            label-width="auto"
            :inline="true"
            @submit.prevent
          >
            <el-form-item label="方案名称" class="mb-2">
              <el-input
                v-model="queryForm.PlanName"
                placeholder="输入检验方案名称"
                style="width: 180px"
                clearable
                @clear="getData"
                @keyup.enter.prevent="getData"
              />
            </el-form-item>
            <el-form-item label="检验类型" class="mb-2">
              <el-select
                v-model="queryForm.CategoryId"
                placeholder="全部"
                clearable
                style="width: 140px"
                @change="getData"
              >
                <el-option
                  v-for="item in categoryDownOptions"
                  :key="item.Id"
                  :label="item.CategoryName"
                  :value="item.Id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="产品型号" class="mb-2">
              <el-select-v2
                v-model="queryForm.ProductFamily"
                :options="queryProductFamilyOptions"
                placeholder="全部"
                clearable
                filterable
                style="width: 260px"
                @change="getData"
              >
                <template #default="{ item }">
                  <span>{{ item.raw?.Info || "-" }}</span>
                </template>
              </el-select-v2>
            </el-form-item>
            <el-form-item label="产品编号" class="mb-2">
              <el-select-v2
                v-model="queryForm.ProductName"
                :options="queryProductOptions"
                placeholder="全部"
                clearable
                filterable
                style="width: 260px"
                @change="getData"
              >
                <template #default="{ item }">
                  <span>{{ item.raw?.Info || "-" }}</span>
                </template>
              </el-select-v2>
            </el-form-item>
            <el-form-item label="状态" class="mb-2">
              <el-select
                v-model="queryForm.Status"
                placeholder="全部"
                clearable
                style="width: 110px"
                @change="getData"
              >
                <el-option label="启用" :value="0" />
                <el-option label="禁用" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item class="mb-2">
              <el-button type="primary" @click="getData">查询</el-button>
              <el-button type="success" @click="handleAdd">新增</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div ref="upperWrapRef" class="flex-1 min-h-0">
        <el-table
          :data="tableData"
          size="small"
          style="width: 100%"
          :height="upperTableHeight"
          border
          fit
          highlight-current-row
          @row-click="handleRowClick"
        >
          <el-table-column type="index" align="center" label="序号" width="55">
            <template #default="scope">
              <span>{{
                scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="PlanName"
            label="检验方案名称"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="CategoryName"
            label="检验类型"
            min-width="110"
            show-overflow-tooltip
          />
          <el-table-column
            prop="ProductModel"
            label="产品型号"
            min-width="140"
            show-overflow-tooltip
          />
          <el-table-column
            prop="ProductFamilyDescription"
            label="产品型号描述"
            min-width="160"
            show-overflow-tooltip
          >
            <template #default="scope">
              <span>{{ scope.row.ProductFamilyDescription || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="ProductName"
            label="产品编号"
            min-width="140"
            show-overflow-tooltip
          >
            <template #default="scope">
              <span>{{ scope.row.ProductName || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="InvAddCode"
            label="存货代码"
            min-width="140"
            show-overflow-tooltip
          >
            <template #default="scope">
              <span>{{ scope.row.InvAddCode || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="StatusText" label="状态" width="90" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.Status === 0 ? 'success' : 'danger'" size="small">
                {{ scope.row.StatusText }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="CreateBy" label="创建人" width="110" />
          <el-table-column prop="CreateTime" label="创建时间" width="170" />
          <el-table-column prop="UpdateBy" label="更新人" width="110">
            <template #default="scope">
              <span>{{ scope.row.UpdateBy || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="UpdateTime" label="更新时间" width="170">
            <template #default="scope">
              <span>{{ scope.row.UpdateTime || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right" align="center">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click.stop="handleEdit(scope.row)"
                >修改</el-button
              >
              <el-button
                type="warning"
                size="small"
                @click.stop="handleCopy(scope.row)"
                >复制</el-button
              >
            </template>
          </el-table-column>
          <template #empty><el-empty /></template>
        </el-table>
        </div>

        <div class="mt-2 flex-none">
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
    </div>

    <!-- ====== 下半：方案明细 ====== -->
    <div class="flex-1 min-h-0 flex flex-col">
      <el-card class="half-card" shadow="always" :body-style="{ padding: '8px' }">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-bold text-sm">
              方案明细
              <span v-if="currentPlan" class="text-gray-400 ml-2 font-normal">{{ currentPlan.PlanName }}</span>
            </span>
            <div class="flex gap-2">
              <el-button type="success" size="small" :disabled="!currentPlan" @click="handleDetailAdd">新增明细</el-button>
            </div>
          </div>
        </template>
        <div ref="lowerWrapRef" class="flex-1 min-h-0">
        <el-table
          :data="detailData"
          size="small"
          style="width: 100%"
          :height="lowerTableHeight"
          border
          fit
        >
          <el-table-column prop="SortOrder" label="排序" width="70" align="center" />
          <el-table-column prop="ProcessName" label="工序" min-width="120" show-overflow-tooltip />
          <el-table-column prop="ItemName" label="检验项目名称" min-width="150" show-overflow-tooltip />
          <el-table-column prop="JudgeType" label="判定类型" min-width="110" show-overflow-tooltip />
          <el-table-column prop="LowerLimit" label="下限" width="80" align="center">
            <template #default="scope">
              <span>{{ scope.row.LowerLimit ?? "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="UpperLimit" label="上限" width="80" align="center">
            <template #default="scope">
              <span>{{ scope.row.UpperLimit ?? "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="ReferenceStandard" label="参考标准" min-width="120" show-overflow-tooltip />
          <el-table-column prop="DecimalPlaces" label="小数位数" width="85" align="center">
            <template #default="scope">
              <span>{{ scope.row.DecimalPlaces ?? "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Unit" label="单位" width="80" align="center">
            <template #default="scope">
              <span>{{ scope.row.Unit || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Description" label="描述" min-width="140" show-overflow-tooltip />
          <el-table-column label="操作" width="150" fixed="right" align="center">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleDetailEdit(scope.row, scope.$index)">修改</el-button>
              <el-button type="danger" size="small" @click="removeDetailRow(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="请点击上方方案行查看明细" />
          </template>
        </el-table>
        </div>
      </el-card>
    </div>

    <!-- 明细新增/修改弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="detailDialogMode === 'add' ? '新增明细' : '修改明细'"
      draggable
      width="600px"
      :close-on-click-modal="false"
      align-center
      @close="detailDialogCancel"
    >
      <el-form
        ref="detailFormRef"
        :model="detailForm"
        :rules="detailRules"
        label-position="top"
        size="default"
        @submit.prevent
      >
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="排序序号" prop="SortOrder">
              <el-input-number v-model="detailForm.SortOrder" :min="1" :controls="false" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序" prop="ProcessName">
              <el-select v-model="detailForm.ProcessName" placeholder="选择工序" filterable style="width: 100%">
                <el-option v-for="s in specDownOptions" :key="s.SpecName" :label="s.SpecName" :value="s.SpecName" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="检验项目名称" prop="ItemId">
              <el-select v-model="detailForm.ItemId" placeholder="选择检验项目" filterable style="width: 100%"
                @change="onDetailItemChange">
                <el-option v-for="s in itemDownOptions" :key="s.Id" :label="s.ItemName" :value="s.Id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="判定类型" prop="JudgeType">
              <el-select v-model="detailForm.JudgeType" placeholder="选择判定类型" style="width: 100%">
                <el-option v-for="s in judgeTypeDownOptions" :key="s.JudgeType" :label="s.JudgeType" :value="s.JudgeType" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="下限">
              <el-input-number v-model="detailForm.LowerLimit" :controls="false" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上限">
              <el-input-number v-model="detailForm.UpperLimit" :controls="false" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="参考标准">
              <el-input v-model="detailForm.ReferenceStandard" placeholder="参考标准" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小数位数">
              <el-input-number v-model="detailForm.DecimalPlaces" :min="0" :max="9" :controls="false" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="单位">
              <el-input v-model="detailForm.Unit" placeholder="单位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="检验描述">
          <el-input v-model="detailForm.Description" type="textarea" :rows="2" placeholder="检验描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="detailDialogCancel">取消</el-button>
        <el-button type="primary" @click="detailDialogConfirm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 新增/修改弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="dialogMode === 'add' ? '新增检验方案' : '修改检验方案'"
      draggable
      width="700px"
      :close-on-click-modal="false"
      align-center
      @close="addDialogCancel"
    >
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        :rules="dialogRules"
        label-position="top"
        size="default"
        @submit.prevent
      >
        <el-form-item label="检验方案名称" prop="PlanName">
          <el-input v-model="dialogForm.PlanName" placeholder="请输入检验方案名称" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="检验类型" prop="CategoryId">
              <el-select v-model="dialogForm.CategoryId" placeholder="请选择检验类型" style="width: 100%">
                <el-option
                  v-for="item in categoryDownOptions"
                  :key="item.Id"
                  :label="item.CategoryName"
                  :value="item.Id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品型号" prop="ProductModel">
              <el-select-v2
                v-model="dialogForm.ProductModel"
                :options="dialogProductFamilyOptions"
                placeholder="请选择产品型号"
                filterable
                clearable
                style="width: 100%"
                @change="onProductModelChange"
              >
                <template #default="{ item }">
                  <span>{{ item.raw?.Info || "-" }}</span>
                </template>
              </el-select-v2>
            </el-form-item>
            <!-- 选中后展示 Name 和 Desc -->
            <div v-if="dialogForm.ProductModel" style="display: flex; gap: 12px; margin-top: 6px; padding: 6px 12px; background: #f5f7fa; border-radius: 4px; font-size: 13px;">
              <span><span style="color: #909399;">型号：</span><span style="font-weight: 500;">{{ dialogForm.ProductModel }}</span></span>
              <span style="color: #dcdfe6;">|</span>
              <span><span style="color: #909399;">描述：</span>{{ dialogForm.ProductFamilyDescription || "-" }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="产品编号" prop="ProductName">
              <el-select-v2
                v-model="dialogForm.ProductName"
                :options="dialogProductOptions"
                placeholder="请选择产品编号"
                filterable
                clearable
                style="width: 100%"
                @change="onProductChange"
              >
                <template #default="{ item }">
                  <span>{{ item.raw?.Info || "-" }}</span>
                </template>
              </el-select-v2>
            </el-form-item>
            <!-- 选中后展示 Name 和 Desc -->
            <div v-if="dialogForm.ProductName" style="display: flex; gap: 12px; margin-top: 6px; padding: 6px 12px; background: #f5f7fa; border-radius: 4px; font-size: 13px;">
              <span><span style="color: #909399;">编号：</span><span style="font-weight: 500;">{{ dialogForm.ProductName }}</span></span>
              <span style="color: #dcdfe6;">|</span>
              <span><span style="color: #909399;">描述：</span>{{ dialogForm.InvAddCode || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="Status">
              <el-select v-model="dialogForm.Status" placeholder="请选择状态" style="width: 100%">
                <el-option label="启用" :value="0" />
                <el-option label="禁用" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="addDialogCancel">取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="addDialogConfirm"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  QueryInspectionCategoryDownList,
  QueryProductFamilyDownList,
  QueryProductDownList,
  QueryInspectionPlanList,
  InsertInspectionPlan,
  UpdateInspectionPlan,
  GetInspectionPlanById,
  QuerySpecNameDownList,
  QueryJudgeTypeDownList,
  QueryInspectionItemDownList,
} from "@/api/operate";
import { useUserStoreWithOut } from "@/stores/modules/user";

const userStore = useUserStoreWithOut();

// ====== 查询 ======
const queryForm = ref({
  PlanName: "",
  CategoryId: null as number | null,
  ProductFamily: "",
  ProductName: "",
  Status: null as number | null,
});
const tableData = ref<any[]>([]);
const total = ref(0);
const pageObj = ref({ currentPage: 1, pageSize: 30 });
const upperTableHeight = ref(300);
const lowerTableHeight = ref(200);
const upperWrapRef = ref<HTMLElement>();
const lowerWrapRef = ref<HTMLElement>();
let resizeObserver: ResizeObserver | null = null;

// ====== 下拉选项 ======
const categoryDownOptions = ref<any[]>([]);
const rawProductFamilyData = ref<any[]>([]);
const rawProductData = ref<any[]>([]);
const specDownOptions = ref<any[]>([]);
const judgeTypeDownOptions = ref<any[]>([]);
const itemDownOptions = ref<any[]>([]);

// 查询区：产品型号下拉（只展示 Info）
const queryProductFamilyOptions = computed(() => {
  return rawProductFamilyData.value
    .filter((i: any) => i.Name)
    .map((i: any) => ({
      label: i.Info || "-",
      value: i.Name,
      raw: i,
    }));
});

// 查询区：产品编号下拉（只展示 Info）
const queryProductOptions = computed(() => {
  return rawProductData.value
    .filter((i: any) => i.Name)
    .map((i: any) => ({
      label: i.Info || "-",
      value: i.Name,
      raw: i,
    }));
});

// 弹窗区：产品型号下拉（只展示 Info）
const dialogProductFamilyOptions = computed(() => {
  return rawProductFamilyData.value
    .filter((i: any) => i.Name)
    .map((i: any) => ({
      label: i.Info || "-",
      value: i.Name,
      raw: i,
    }));
});

// 弹窗区：产品编号下拉（只展示 Info）
const dialogProductOptions = computed(() => {
  return rawProductData.value
    .filter((i: any) => i.Name)
    .map((i: any) => ({
      label: i.Info || "-",
      value: i.Name,
      raw: i,
    }));
});

const getDropdownOptions = async () => {
  const categoryRes: any = await QueryInspectionCategoryDownList();
  if (categoryRes && categoryRes.success && categoryRes.code === 0) {
    categoryDownOptions.value = categoryRes.content || [];
  }
  const familyRes: any = await QueryProductFamilyDownList();
  if (familyRes && familyRes.success && familyRes.code === 0) {
    rawProductFamilyData.value = familyRes.content || [];
  }
  const productRes: any = await QueryProductDownList();
  if (productRes && productRes.success && productRes.code === 0) {
    rawProductData.value = productRes.content || [];
  }
  const specRes: any = await QuerySpecNameDownList();
  if (specRes && specRes.success && specRes.code === 0) {
    specDownOptions.value = specRes.content || [];
  }
  const judgeRes: any = await QueryJudgeTypeDownList();
  if (judgeRes && judgeRes.success && judgeRes.code === 0) {
    judgeTypeDownOptions.value = judgeRes.content || [];
  }
  const itemRes: any = await QueryInspectionItemDownList();
  if (itemRes && itemRes.success && itemRes.code === 0) {
    itemDownOptions.value = itemRes.content || [];
  }
};

const getData = async () => {
  const params: any = {
    PlanName: queryForm.value.PlanName,
    ProductFamily: queryForm.value.ProductFamily,
    ProductName: queryForm.value.ProductName,
    pageSize: pageObj.value.pageSize,
    currentPage: pageObj.value.currentPage,
  };
  if (queryForm.value.CategoryId !== null && queryForm.value.CategoryId !== undefined) {
    params.CategoryId = queryForm.value.CategoryId;
  }
  if (queryForm.value.Status !== null && queryForm.value.Status !== undefined) {
    params.Status = queryForm.value.Status;
  }

  const res: any = await QueryInspectionPlanList(params);
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
  if (upperWrapRef.value) {
    upperTableHeight.value = upperWrapRef.value.clientHeight;
  }
  if (lowerWrapRef.value) {
    lowerTableHeight.value = lowerWrapRef.value.clientHeight;
  }
};

// ====== 方案明细 ======
const currentPlan = ref<any>(null);
const detailData = ref<any[]>([]);

const handleRowClick = async (row: any) => {
  const res: any = await GetInspectionPlanById(row.Id);
  if (res && res.success && res.code === 0 && res.content) {
    const plan = res.content.Plan || {};
    currentPlan.value = {
      ...plan,
      ProductFamilyDescription: plan.ProductFamilyDescription ?? row.ProductFamilyDescription ?? "",
      InvAddCode: plan.InvAddCode ?? row.InvAddCode ?? "",
    };
    detailData.value = (res.content.Details || []).map((d: any) => ({ ...d }));
  } else {
    ElMessage.error((res && res.msg) || "获取方案明细失败");
  }
};

// ====== 复制方案 ======
const copyLoading = ref(false);

const handleCopy = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要复制方案 "${row.PlanName}" 吗？复制后将创建一份新的检验方案。`,
      "复制确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }
    );

    copyLoading.value = true;
    
    // 1. 获取完整方案详情（包含明细）
    const detailRes: any = await GetInspectionPlanById(row.Id);
    if (!detailRes || !detailRes.success || detailRes.code !== 0 || !detailRes.content) {
      ElMessage.error("获取方案详情失败");
      return;
    }

    const plan = detailRes.content.Plan || {};
    const details = detailRes.content.Details || [];

    // 2. 构建新增参数（复制数据，Id 置空）
    const params = {
      PlanName: `${plan.PlanName}_副本`,
      CategoryId: plan.CategoryId,
      ProductModel: plan.ProductModel || "",
      ProductFamilyDescription: plan.ProductFamilyDescription || "",
      ProductName: plan.ProductName || "",
      InvAddCode: plan.InvAddCode || "",
      Status: plan.Status ?? 0,
      Operator: userStore.getUserInfo,
      Details: details.map((d: any) => ({
        SortOrder: d.SortOrder,
        ProcessName: d.ProcessName,
        ItemId: d.ItemId,
        JudgeType: d.JudgeType,
        LowerLimit: d.LowerLimit,
        UpperLimit: d.UpperLimit,
        ReferenceStandard: d.ReferenceStandard,
        DecimalPlaces: d.DecimalPlaces,
        Unit: d.Unit,
        Description: d.Description,
      })),
    };

    // 3. 调用新增接口
    const res: any = await InsertInspectionPlan(params);
    if (res && res.success && res.code === 0) {
      ElMessage.success(res.msg || "复制成功");
      // 刷新列表
      await getData();
    } else {
      ElMessage.error((res && res.msg) || "复制失败");
    }
  } catch (error: any) {
    if (error !== "cancel" && error !== false) {
      ElMessage.error(error?.msg || "复制失败");
    }
  } finally {
    copyLoading.value = false;
  }
};

// ====== 明细新增/修改弹窗 ======
const detailDialogVisible = ref(false);
const detailDialogMode = ref<"add" | "edit">("add");
const detailFormRef = ref();
const editDetailIndex = ref(-1);
const detailForm = ref({
  SortOrder: 1,
  ProcessName: "",
  ItemId: null as number | null,
  ItemName: "",
  JudgeType: "",
  LowerLimit: null as number | null,
  UpperLimit: null as number | null,
  ReferenceStandard: "",
  DecimalPlaces: 0,
  Unit: "",
  Description: "",
});

const detailRules = {
  SortOrder: [
    { required: true, message: "请输入排序序号", trigger: "blur" },
  ],
  ProcessName: [
    { required: true, message: "请选择工序", trigger: "change" },
  ],
  ItemId: [
    { required: true, message: "请选择检验项目", trigger: "change" },
  ],
  JudgeType: [
    { required: true, message: "请选择判定类型", trigger: "change" },
  ],
};

// 选中检验项目后自动带出单位和描述
const onDetailItemChange = (itemId: number) => {
  const item = itemDownOptions.value.find((i: any) => i.Id === itemId);
  if (item) {
    detailForm.value.ItemName = item.ItemName;
    detailForm.value.Unit = item.Unit;
    detailForm.value.Description = item.Description;
  }
};

const handleDetailAdd = () => {
  detailDialogMode.value = "add";
  editDetailIndex.value = -1;
  detailForm.value = {
    SortOrder: detailData.value.length + 1,
    ProcessName: "",
    ItemId: null,
    ItemName: "",
    JudgeType: "",
    LowerLimit: null,
    UpperLimit: null,
    ReferenceStandard: "",
    DecimalPlaces: 0,
    Unit: "",
    Description: "",
  };
  detailDialogVisible.value = true;
};

const handleDetailEdit = (row: any, index: number) => {
  detailDialogMode.value = "edit";
  editDetailIndex.value = index;
  detailForm.value = {
    SortOrder: row.SortOrder,
    ProcessName: row.ProcessName,
    ItemId: row.ItemId,
    ItemName: row.ItemName || "",
    JudgeType: row.JudgeType,
    LowerLimit: row.LowerLimit,
    UpperLimit: row.UpperLimit,
    ReferenceStandard: row.ReferenceStandard,
    DecimalPlaces: row.DecimalPlaces,
    Unit: row.Unit,
    Description: row.Description,
  };
  detailDialogVisible.value = true;
};

const detailDialogCancel = () => {
  detailDialogVisible.value = false;
  detailFormRef.value?.resetFields();
};

const detailDialogConfirm = async () => {
  await detailFormRef.value?.validate();
  const row = {
    SortOrder: detailForm.value.SortOrder,
    ProcessName: detailForm.value.ProcessName,
    ItemId: detailForm.value.ItemId,
    ItemName: detailForm.value.ItemName,
    JudgeType: detailForm.value.JudgeType,
    LowerLimit: detailForm.value.LowerLimit,
    UpperLimit: detailForm.value.UpperLimit,
    ReferenceStandard: detailForm.value.ReferenceStandard,
    DecimalPlaces: detailForm.value.DecimalPlaces,
    Unit: detailForm.value.Unit,
    Description: detailForm.value.Description,
  };
  if (detailDialogMode.value === "add") {
    detailData.value.push(row);
  } else {
    detailData.value[editDetailIndex.value] = row;
  }
  detailDialogVisible.value = false;
  // 立即提交
  await saveAllDetails();
};

const removeDetailRow = async (index: number) => {
  detailData.value.splice(index, 1);
  await saveAllDetails();
};

// 明细数组转上传格式
const buildDetailsPayload = () => detailData.value.map((d: any) => ({
  SortOrder: d.SortOrder,
  ProcessName: d.ProcessName,
  ItemId: d.ItemId,
  JudgeType: d.JudgeType,
  LowerLimit: d.LowerLimit,
  UpperLimit: d.UpperLimit,
  ReferenceStandard: d.ReferenceStandard,
  DecimalPlaces: d.DecimalPlaces,
  Unit: d.Unit,
  Description: d.Description,
}));

const saveAllDetails = async () => {
  if (!currentPlan.value) {
    ElMessage.warning("请先选择方案");
    return;
  }
  const params = {
    Id: currentPlan.value.Id,
    PlanName: currentPlan.value.PlanName,
    CategoryId: currentPlan.value.CategoryId,
    ProductModel: currentPlan.value.ProductModel,
    ProductFamilyDescription: currentPlan.value.ProductFamilyDescription || "",
    ProductName: currentPlan.value.ProductName,
    InvAddCode: currentPlan.value.InvAddCode || "",
    Status: currentPlan.value.Status,
    Operator: userStore.getUserInfo,
    Details: buildDetailsPayload(),
  };
  const res: any = await UpdateInspectionPlan(params);
  if (res && res.success && res.code === 0) {
    ElMessage.success(res.msg || "保存成功");
    // 重新加载当前方案明细
    const refreshRes: any = await GetInspectionPlanById(currentPlan.value.Id);
    if (refreshRes && refreshRes.success && refreshRes.code === 0 && refreshRes.content) {
      currentPlan.value = refreshRes.content.Plan;
      detailData.value = (refreshRes.content.Details || []).map((d: any) => ({ ...d }));
    }
  } else {
    ElMessage.error((res && res.msg) || "保存失败");
  }
};

// ====== 新增/修改弹窗 ======
const addDialogVisible = ref(false);
const dialogMode = ref<"add" | "edit">("add");
const dialogFormRef = ref();
const submitLoading = ref(false);
const dialogForm = ref({
  Id: 0,
  PlanName: "",
  CategoryId: null as number | null,
  ProductModel: "",
  ProductFamilyDescription: "",
  ProductName: "",
  InvAddCode: "",
  Status: 0,
});

const dialogRules = {
  PlanName: [
    { required: true, message: "请输入检验方案名称", trigger: "blur" },
  ],
  CategoryId: [
    { required: true, message: "请选择检验类型", trigger: "change" },
  ],
  ProductModel: [
    { required: true, message: "请选择产品型号", trigger: "change" },
  ],
};

// 产品型号下拉选中后，自动带出描述
const onProductModelChange = (val: string) => {
  const selected = dialogProductFamilyOptions.value.find((i: any) => i.value === val);
  if (selected && selected.raw) {
    dialogForm.value.ProductFamilyDescription = selected.raw.Desc || "";
  } else {
    dialogForm.value.ProductFamilyDescription = "";
  }
};

// 产品编号下拉选中后，自动带出存货代码（Desc）
const onProductChange = (val: string) => {
  const selected = dialogProductOptions.value.find((i: any) => i.value === val);
  if (selected && selected.raw) {
    dialogForm.value.InvAddCode = selected.raw.Desc || "";
  } else {
    dialogForm.value.InvAddCode = "";
  }
};

const handleAdd = () => {
  dialogMode.value = "add";
  dialogForm.value = {
    Id: 0,
    PlanName: "",
    CategoryId: null,
    ProductModel: "",
    ProductFamilyDescription: "",
    ProductName: "",
    InvAddCode: "",
    Status: 0,
  };
  currentPlan.value = null;
  detailData.value = [];
  addDialogVisible.value = true;
};

const handleEdit = async (row: any) => {
  // 先加载该方案的明细到下半区
  const res: any = await GetInspectionPlanById(row.Id);
  if (res && res.success && res.code === 0 && res.content) {
    currentPlan.value = res.content.Plan;
    detailData.value = (res.content.Details || []).map((d: any) => ({ ...d }));
  }
  dialogMode.value = "edit";
  dialogForm.value = {
    Id: row.Id,
    PlanName: row.PlanName,
    CategoryId: row.CategoryId,
    ProductModel: row.ProductModel || "",
    ProductFamilyDescription: row.ProductFamilyDescription || "",
    ProductName: row.ProductName || "",
    InvAddCode: row.InvAddCode || "",
    Status: row.Status,
  };
  addDialogVisible.value = true;
};

const addDialogCancel = () => {
  addDialogVisible.value = false;
  dialogFormRef.value?.resetFields();
};

const addDialogConfirm = async () => {
  await dialogFormRef.value?.validate();
  submitLoading.value = true;
  try {
    const params = {
      PlanName: dialogForm.value.PlanName,
      CategoryId: dialogForm.value.CategoryId,
      ProductModel: dialogForm.value.ProductModel,
      ProductFamilyDescription: dialogForm.value.ProductFamilyDescription,
      ProductName: dialogForm.value.ProductName,
      InvAddCode: dialogForm.value.InvAddCode,
      Status: dialogForm.value.Status,
      Operator: userStore.getUserInfo,
      Details: dialogMode.value === "edit" ? buildDetailsPayload() : [],
    };
    let res: any;
    if (dialogMode.value === "add") {
      res = await InsertInspectionPlan(params);
    } else {
      res = await UpdateInspectionPlan({
        Id: dialogForm.value.Id,
        ...params,
      });
    }
    if (res && res.success && res.code === 0) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      addDialogCancel();
      getData();
    } else {
      ElMessage.error((res && res.msg) || "操作失败");
    }
  } catch (error: any) {
    if (error !== false) {
      ElMessage.error(error?.msg || "操作失败");
    }
  } finally {
    submitLoading.value = false;
  }
};

onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    updateTableHeight();
  });
  if (upperWrapRef.value) resizeObserver.observe(upperWrapRef.value);
  if (lowerWrapRef.value) resizeObserver.observe(lowerWrapRef.value);
  getDropdownOptions();
  getData();
});
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<style scoped>
.half-card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.half-card :deep(.el-card__body) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>