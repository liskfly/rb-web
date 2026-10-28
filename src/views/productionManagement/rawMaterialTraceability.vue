<template>
  <div class="raw-material-trace-page p-2">
    <el-card shadow="never" class="query-card">
      <template #header>
        <div class="page-heading">
          <span>原材料反查成品</span>
          <span>根据原材料批次或条码追溯半成品及成品</span>
        </div>
      </template>

      <el-form size="small" inline label-width="96px" @submit.prevent>
        <el-form-item label="原材料批次" required>
          <el-input
            v-model="rawMaterialBatch"
            clearable
            autofocus
            placeholder="请输入原材料批次或条码"
            class="batch-input"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleQuery">
            查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card" :body-style="tableCardBodyStyle">
      <template #header>
        <div class="table-heading">
          <span>追溯结果</span>
          <el-tag size="small" type="info">{{ tableData.length }} 条</el-tag>
        </div>
      </template>

      <div class="table-wrap">
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          stripe
          size="small"
          height="100%"
          highlight-current-row
        >
          <el-table-column type="index" label="序号" width="55" fixed="left" align="center" />
          <el-table-column
            prop="semiMfgOrderNo"
            label="工单号(G)"
            min-width="160"
            fixed="left"
            show-overflow-tooltip
          />
          <el-table-column prop="semiVn" label="VN(G)" min-width="160" show-overflow-tooltip />
          <el-table-column prop="semiSn" label="SN(G)" min-width="170" show-overflow-tooltip />
          <el-table-column prop="fgMfgOrderNo" label="工单号(T)" min-width="160" show-overflow-tooltip />
          <el-table-column prop="fgVn" label="VN(T)" min-width="160" show-overflow-tooltip />
          <el-table-column prop="fgSn" label="SN(T)" min-width="170" show-overflow-tooltip />
          <template #empty>
            <el-empty :description="emptyText" :image-size="72" />
          </template>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { RawMaterialThreeLayerTraceQuery } from "@/api/operate";

type TraceRow = {
  semiMfgOrderNo: string;
  semiVn: string;
  semiSn: string;
  fgMfgOrderNo: string;
  fgVn: string;
  fgSn: string;
};

const rawMaterialBatch = ref("");
const tableData = ref<TraceRow[]>([]);
const loading = ref(false);
const hasQueried = ref(false);

const tableCardBodyStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  height: "calc(100% - 49px)",
  padding: "10px",
};

const emptyText = computed(() =>
  hasQueried.value ? "暂无数据" : "请输入原材料批次后查询",
);

const handleQuery = async () => {
  const batch = rawMaterialBatch.value.trim();
  if (!batch) {
    ElMessage.warning("请输入原材料批次");
    return;
  }
  if (loading.value) return;

  loading.value = true;
  hasQueried.value = true;
  tableData.value = [];

  try {
    const res: any = await RawMaterialThreeLayerTraceQuery({
      RawMaterialBatch: batch,
    });
    if (!res || res.success === false) {
      ElMessage.error(res?.msg || "查询失败");
      return;
    }

    tableData.value = Array.isArray(res.content) ? res.content : [];
  } catch (error: any) {
    console.error("原材料反查成品失败", error);
    ElMessage.error(error?.msg || error?.message || "查询失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};

const handleReset = () => {
  rawMaterialBatch.value = "";
  tableData.value = [];
  hasQueried.value = false;
};
</script>

<style scoped lang="scss">
.raw-material-trace-page {
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

.batch-input {
  width: 320px;
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

:deep(.el-table__body tr:hover > td.el-table__cell) {
  background-color: #dbeafe !important;
}
</style>
