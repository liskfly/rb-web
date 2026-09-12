<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-start">
        <el-button type="success" size="small" @click="handleAdd">新增</el-button>
        <el-form
          ref="queryFormRef"
          size="small"
          :model="queryForm"
          label-width="auto"
          :inline="true"
          @submit.prevent
        >
          <el-form-item label="检验类型名称" class="mb-2">
            <el-input
              v-model="queryForm.CategoryName"
              placeholder="输入检验类型名称"
              style="width: 200px"
              clearable
              @clear="getData"
              @keyup.enter.prevent="getData"
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
          prop="CategoryName"
          label="检验类型名称"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column prop="Status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.Status === '启用' ? 'success' : 'danger'" size="small">
              {{ scope.row.Status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="CreateBy" label="创建人" width="120" />
        <el-table-column prop="CreateTime" label="创建时间" width="170" />
        <el-table-column prop="UpdateBy" label="更新人" width="120">
          <template #default="scope">
            <span>{{ scope.row.UpdateBy || "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="UpdateTime" label="更新时间" width="170">
          <template #default="scope">
            <span>{{ scope.row.UpdateTime || "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" fixed="right" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              >修改</el-button
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

    <!-- 新增/修改弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="dialogMode === 'add' ? '新增检验类型' : '修改检验类型'"
      draggable
      width="500px"
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
        <el-form-item label="检验类型名称" prop="CategoryName">
          <el-input v-model="dialogForm.CategoryName" placeholder="请输入检验类型名称" />
        </el-form-item>
        <el-form-item label="状态" prop="Status">
          <el-radio-group v-model="dialogForm.Status">
            <el-radio :value="0">启用</el-radio>
            <el-radio :value="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
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
import { ref, onMounted, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import {
  QueryInspectionCategoryList,
  InsertInspectionCategory,
  UpdateInspectionCategory,
} from "@/api/operate";
import { useUserStoreWithOut } from "@/stores/modules/user";

const userStore = useUserStoreWithOut();

// ====== 查询 ======
const queryForm = ref({
  CategoryName: "",
});
const tableData = ref<any[]>([]);
const total = ref(0);
const pageObj = ref({ currentPage: 1, pageSize: 30 });
const tableHeight = ref(400);

const getData = async () => {
  const params: any = {
    CategoryName: queryForm.value.CategoryName,
    pageSize: pageObj.value.pageSize,
    currentPage: pageObj.value.currentPage,
  };

  const res: any = await QueryInspectionCategoryList(params);
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
  tableHeight.value = window.innerHeight - 190;
};

// ====== 新增/修改弹窗 ======
const addDialogVisible = ref(false);
const dialogMode = ref<"add" | "edit">("add");
const dialogFormRef = ref();
const submitLoading = ref(false);
const dialogForm = ref({
  Id: 0,
  CategoryName: "",
  Status: 0,
});

const dialogRules = {
  CategoryName: [
    { required: true, message: "请输入检验类型名称", trigger: "blur" },
  ],
};

const handleAdd = () => {
  dialogMode.value = "add";
  dialogForm.value = { Id: 0, CategoryName: "", Status: 0 };
  addDialogVisible.value = true;
};

const handleEdit = (row: any) => {
  dialogMode.value = "edit";
  dialogForm.value = {
    Id: row.Id,
    CategoryName: row.CategoryName,
    Status: row.Status === "启用" ? 0 : 1,
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
      CategoryName: dialogForm.value.CategoryName,
      Status: dialogForm.value.Status,
      Operator: userStore.getUserInfo,
    };
    let res: any;
    if (dialogMode.value === "add") {
      res = await InsertInspectionCategory(params);
    } else {
      res = await UpdateInspectionCategory({
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
  updateTableHeight();
  window.addEventListener("resize", updateTableHeight);
  getData();
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateTableHeight);
});
</script>
