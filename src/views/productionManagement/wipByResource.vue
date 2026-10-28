<template>
  <div class="wip-resource-page p-2">
    <el-card shadow="never" class="query-card">
      <template #header>
        <div class="page-heading">
          <span>设备在制品查询</span>
          <span>选择一个或多个设备，查询当前在制品</span>
        </div>
      </template>

      <el-form inline size="small" label-width="72px" @submit.prevent>
        <el-form-item label="设备" required>
          <el-select
            v-model="selectedResources"
            multiple
            filterable
            clearable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
            :loading="loading.resources"
            placeholder="请选择设备（支持多选）"
            class="resource-select"
            @keyup.enter="handleQuery"
          >
            <el-option
              v-for="item in resourceOptions"
              :key="item.ResourceName"
              :label="item.ResourceName"
              :value="item.ResourceName"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading.table" @click="handleQuery">
            查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card" :body-style="tableCardBodyStyle">
      <template #header>
        <div class="table-heading">
          <span>在制品明细</span>
          <el-tag size="small" type="info">{{ tableRows.length }} 条</el-tag>
        </div>
      </template>

      <div class="table-wrap">
        <el-table
          v-loading="loading.table"
          :data="tableRows"
          border
          stripe
          size="small"
          height="100%"
        >
          <el-table-column type="index" label="序号" width="55" fixed="left" align="center" />
          <el-table-column prop="SN" label="条码编号" min-width="165" fixed="left" show-overflow-tooltip />
          <el-table-column prop="ResourceName" label="设备" min-width="160" show-overflow-tooltip />
          <el-table-column prop="MfgOrderName" label="工单号" min-width="150" show-overflow-tooltip />
          <el-table-column prop="SpecName" label="工序" min-width="120" show-overflow-tooltip />
          <el-table-column prop="Qty" label="数量" width="80" align="left" />
          <el-table-column prop="Status" label="状态" width="100" align="left" />
          <el-table-column prop="ProductName" label="物料编码" min-width="145" show-overflow-tooltip />
          <el-table-column prop="ProductDesc" label="物料描述" min-width="160" show-overflow-tooltip />
          <el-table-column prop="InvAddCode" label="存货代码" min-width="145" show-overflow-tooltip />
          <el-table-column prop="VN" label="VN" min-width="145" show-overflow-tooltip />
          <template #empty>
            <el-empty :description="emptyText" :image-size="72" />
          </template>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { ReBornResourceQuery, WipByResourceQuery } from "@/api/operate";

type ResourceOption = {
  ResourceName: string;
};

type WipRow = {
  SN: string;
  ResourceName: string;
  MfgOrderName: string;
  SpecName: string;
  Qty: number | string;
  Status: string;
  ProductName: string;
  ProductDesc: string;
  InvAddCode: string;
  VN: string;
};

const selectedResources = ref<string[]>([]);
const resourceOptions = ref<ResourceOption[]>([]);
const tableRows = ref<WipRow[]>([]);
const hasQueried = ref(false);
const loading = reactive({ resources: false, table: false });

const tableCardBodyStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  padding: "10px",
  height: "calc(100% - 49px)",
};

const emptyText = computed(() =>
  hasQueried.value ? "没有查询到符合条件的在制品" : "请选择设备后点击查询",
);

const loadResourceOptions = async () => {
  loading.resources = true;
  try {
    const response: any = await ReBornResourceQuery();
    if (!response || response.success === false || response.code !== 0) {
      ElMessage.error(response?.msg || "设备列表查询失败");
      resourceOptions.value = [];
      return;
    }
    resourceOptions.value = Array.isArray(response.content) ? response.content : [];
  } catch (error) {
    console.error("设备列表查询失败", error);
    ElMessage.error("设备列表查询失败，请稍后重试");
    resourceOptions.value = [];
  } finally {
    loading.resources = false;
  }
};

const handleQuery = async () => {
  if (selectedResources.value.length === 0) {
    ElMessage.warning("请至少选择一个设备");
    return;
  }

  hasQueried.value = true;
  loading.table = true;
  tableRows.value = [];
  try {
    const response: any = await WipByResourceQuery({
      ResourceNames: [...selectedResources.value],
    });
    if (!response || response.success === false || response.code !== 0) {
      ElMessage.error(response?.msg || "在制品查询失败");
      return;
    }
    tableRows.value = Array.isArray(response.content) ? response.content : [];
  } catch (error) {
    console.error("在制品查询失败", error);
    ElMessage.error("在制品查询失败，请稍后重试");
  } finally {
    loading.table = false;
  }
};

const handleReset = () => {
  selectedResources.value = [];
  tableRows.value = [];
  hasQueried.value = false;
};

onMounted(() => {
  loadResourceOptions();
});
</script>

<style scoped lang="scss">
.wip-resource-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  min-width: 900px;
  min-height: 0;
  background: #f4f6f8;
}

.query-card,
.table-card {
  border-color: #dfe5ec;
}

.query-card {
  flex: 0 0 auto;
  margin-bottom: 8px;

  :deep(.el-card__header) {
    padding: 10px 12px;
  }

  :deep(.el-card__body) {
    padding: 10px 12px 2px;
  }

  :deep(.el-form-item) {
    margin-right: 12px;
    margin-bottom: 8px;
  }
}

.resource-select {
  width: 520px;
}

.page-heading,
.table-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  color: #263445;
  font-weight: 600;
}

.page-heading > span:last-child {
  color: #6b7785;
  font-size: 12px;
  font-weight: 400;
}

.table-card {
  flex: 1;
  min-height: 0;

  :deep(.el-card__header) {
    padding: 10px 12px;
  }

  :deep(.el-card__body) {
    min-height: 0;
  }
}

.table-wrap {
  flex: 1;
  min-height: 0;
}

:deep(.el-table th.el-table__cell) {
  color: #5e6d7c;
  background: #f7fafc;
}

@media (max-width: 1100px) {
  .resource-select {
    width: 380px;
  }
}
</style>
