<template>
  <div class="flex flex-col h-full">
    <!-- 标题 -->
    <div class="h-[40px] pl-2 pr-2 flex items-center bg-[#006487] text-white text-lg font-bold flex-shrink-0">
      <span>批量进站</span>
    </div>

    <div class="flex flex-col flex-1 min-h-0 p-2 gap-2">
      <!-- ====== 进站模块 ====== -->
      <div class="bg-white rounded shadow-sm flex items-center gap-3 px-3 py-2 flex-shrink-0">
        <div class="flex items-center gap-3">
          <el-radio v-model="entryMode" value="sn" @change="handleRadioChange">批量SN进站</el-radio>
          <el-input v-model="snInput" placeholder="请输入SN" size="large" clearable style="width: 180px"
            @keyup.enter="snInput && handleQuery()" />
        </div>
        <div class="flex items-center gap-3">
          <el-radio v-model="entryMode" value="order" @change="handleRadioChange">工单进站</el-radio>
          <el-select v-model="mfgOrder" placeholder="请选择工单" size="large" clearable filterable style="width: 240px"
            @change="mfgOrder && handleQuery()">
            <el-option v-for="item in mfgOrderOptions" :key="item.MfgOrderName" :label="item.MfgOrderName" :value="item.MfgOrderName" />
          </el-select>
        </div>
        <el-button type="primary" size="large" @click="handleSubmit">提交</el-button>
      </div>

      <!-- ====== 工单信息 ====== -->
      <div class="bg-white rounded shadow-sm flex flex-col flex-shrink-0">
        <div class="h-[35px] flex items-center text-white bg-[#006487] px-3 flex-shrink-0">
          <span>工单信息</span>
        </div>
        <div class="p-3">
          <el-form size="small" label-width="80px">
            <el-row :gutter="16">
              <el-col :span="6">
                <el-form-item label="工单号"><span class="font-bold">{{ info.MfgOrderName || '-' }}</span></el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="工单状态">
                  <el-tag v-if="info.OrderStatusName" type="success" size="small">{{ info.OrderStatusName }}</el-tag>
                  <span v-else class="text-gray-400">-</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="工单数量"><span class="font-bold">{{ info.PlannedQuantity ?? '-' }}</span></el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="完成数量"><span class="font-bold text-[#00B400]">{{ info.CompletedQuantity ?? '0' }}</span></el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="当前工序"><span class="font-bold">{{ info.SpecName || '-' }}</span></el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="设备名称"><span class="font-bold">{{ info.ResourceName || '-' }}</span></el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="存货代码"><span class="font-bold">{{ info.InvAddCode || '-' }}</span></el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品编码"><span class="font-bold">{{ info.ProductName || '-' }}</span></el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品型号"><span class="font-bold">{{ info.ProductFamily || '-' }}</span></el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品名称"><span class="font-bold">{{ info.ProductDesc || '-' }}</span></el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- ====== 操作区 ====== -->
      <div class="flex-1 bg-white rounded shadow-sm flex flex-col min-h-0">
        <div class="h-[35px] flex items-center text-white bg-[#006487] px-3 flex-shrink-0">
          <span>操作区</span>
        </div>
        <!-- 空状态 -->
        <div class="flex-1 p-3 flex flex-col min-h-0" v-if="batchList.length === 0">
          <div class="flex items-center justify-center h-full text-gray-400 text-lg">扫描条码后显示操作内容</div>
        </div>
        <!-- 表格容器 - 添加滚动 -->
        <div class="flex-1 p-2 min-h-0 overflow-hidden" v-else>
          <div class="h-full pb-[35px] overflow-auto">
            <el-table 
              :data="batchList" 
              size="small" 
              border 
              style="width:100%"
              max-height="100%"
              height="100%"
            >
              <el-table-column prop="ContainerName" label="SN码" width="160" fixed="left" show-overflow-tooltip />
              <el-table-column v-for="(item, idx) in dataCollectionItems" :key="idx" :label="item.DataPointName" min-width="180">
                <template #default="scope">
                  <template v-if="item.Type === 'Boolean'">
                    <el-radio-group v-model="scope.row.values[idx]" size="small" :disabled="item.Type === 'Fixed'">
                      <el-radio :value="true">True</el-radio>
                      <el-radio :value="false">False</el-radio>
                    </el-radio-group>
                  </template>
                  <template v-else>
                    <el-input v-model="scope.row.values[idx]" size="small" :placeholder="item.DataPointName" />
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="查看历史" width="90" fixed="right" align="center">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="openHistory(scope.row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史数据 Dialog -->
    <el-dialog v-model="historyDialogVisible" title="历史采集数据" draggable width="800px" :close-on-click-modal="false" align-center>
      <el-tabs v-model="historyActiveTab" type="border-card">
        <el-tab-pane v-for="(group, idx) in historySpecList" :key="idx" :label="group.SpecName || '工序' + (idx + 1)" :name="String(idx)">
          <el-table :data="group.HistoryRecords" size="small" border style="width:100%" max-height="400">
            <el-table-column type="index" label="序号" width="50" align="center" />
            <el-table-column prop="TxnDate" label="采集时间" width="170" />
            <el-table-column prop="DataName" label="数据项" min-width="150" show-overflow-tooltip />
            <el-table-column prop="DataValue" label="采集值" min-width="90" />
            <el-table-column prop="LowerLimit" label="下限" width="80" align="center">
              <template #default="s"><span>{{ s.row.LowerLimit ?? '-' }}</span></template>
            </el-table-column>
            <el-table-column prop="UpperLimit" label="上限" width="80" align="center">
              <template #default="s"><span>{{ s.row.UpperLimit ?? '-' }}</span></template>
            </el-table-column>
            <el-table-column prop="UOMName" label="单位" width="90" align="center">
              <template #default="s"><span>{{ s.row.UOMName || '-' }}</span></template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-empty v-if="historySpecList.length === 0" description="暂无历史采集数据" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { ContainersOperationMfgOrderQuery, ContainersOperationMfgOrderDetailQuery, ContainersOperationContainerDetailQuery, ContainersOperationContainerOperationExecution } from "@/api/operate";
import { useUserStoreWithOut } from '@/stores/modules/user';

const userStore = useUserStoreWithOut();
const entryMode = ref("sn");

const handleRadioChange = () => {
  if (entryMode.value === 'sn' && snInput.value) {
    handleQuery();
  } else if (entryMode.value === 'order' && mfgOrder.value) {
    handleQuery();
  }
};
const snInput = ref("");
const mfgOrder = ref("");
const mfgOrderOptions = ref<any[]>([]);

const info = ref({
  MfgOrderName: "", OrderStatusName: "", PlannedQuantity: null as number | null,
  CompletedQuantity: null as number | null, SpecName: "", ResourceName: "",
  InvAddCode: "", ProductName: "", ProductFamily: "", ProductDesc: "",
});
const dataCollectionItems = ref<any[]>([]);
const batchList = ref<any[]>([]);
const lastKeyFields = ref<any>({});

// 历史数据弹窗
const historyDialogVisible = ref(false);
const historyActiveTab = ref("0");
const historySpecList = ref<any[]>([]);

const openHistory = (row: any) => {
  historySpecList.value = row.SpecHistoryList || [];
  historyActiveTab.value = "0";
  historyDialogVisible.value = true;
};

const getKeyFields = (d: any) => ({
  MfgOrderName: d.MfgOrderName ?? "", SpecName: d.SpecName ?? "", ResourceName: d.ResourceName ?? "",
  InvAddCode: d.InvAddCode ?? "", ProductName: d.ProductName ?? "", ProductFamily: d.ProductFamily ?? "",
  ProductDesc: d.ProductDesc ?? "", ServiceName: d.ServiceName ?? "", TaskListName: d.TaskListName ?? "",
  TaskName: d.TaskName ?? "", DataCollectionDefId: d.DataCollectionDefId ?? "",
  DataCollectionDefName: d.DataCollectionDefName ?? "",
});

const keysMatch = (a: any, b: any) => {
  const fields = ['MfgOrderName', 'SpecName', 'ResourceName', 'InvAddCode', 'ProductName', 'ProductFamily', 'ProductDesc', 'ServiceName', 'TaskListName', 'TaskName', 'DataCollectionDefId', 'DataCollectionDefName'];
  return fields.every(f => a[f] === b[f]);
};

const handleQuery = async () => {
  let res: any;
  if (entryMode.value === 'sn') {
    if (!snInput.value) { ElMessage.warning('请输入SN'); return; }
    const scannedSN = snInput.value;
    res = await ContainersOperationContainerDetailQuery(scannedSN);
    snInput.value = '';
  } else {
    if (!mfgOrder.value) { ElMessage.warning('请选择工单'); return; }
    res = await ContainersOperationMfgOrderDetailQuery(mfgOrder.value);
  }
  if (res && res.success && res.code === 0 && res.content) {
    const d = res.content;
    const newKeys = getKeyFields(d);
    const newItems = d.DataCollectionItems || [];
    const newBatches = (d.BatchList || []).map((b: any) => ({
      ...b,
      values: newItems.map(() => ''),
    }));

    info.value = {
      MfgOrderName: d.MfgOrderName ?? "", OrderStatusName: d.OrderStatusName ?? "",
      PlannedQuantity: d.PlannedQuantity ?? null, CompletedQuantity: d.CompletedQuantity ?? null,
      SpecName: d.SpecName ?? "", ResourceName: d.ResourceName ?? "",
      InvAddCode: d.InvAddCode ?? "", ProductName: d.ProductName ?? "",
      ProductFamily: d.ProductFamily ?? "", ProductDesc: d.ProductDesc ?? "",
    };
    dataCollectionItems.value = newItems;

    if (entryMode.value === 'order') {
      // 工单模式：直接覆盖
      batchList.value = newBatches;
    } else {
      // SN模式：检查关键字段
      if (batchList.value.length === 0 || !keysMatch(lastKeyFields.value, newKeys)) {
        // 关键字段不同或无旧数据：替换
        batchList.value = newBatches;
      } else {
        // 关键字段相同：追加或覆盖
        newBatches.forEach((nb: any) => {
          const idx = batchList.value.findIndex((b: any) => b.ContainerName === nb.ContainerName);
          if (idx >= 0) {
            batchList.value[idx] = nb;
          } else {
            batchList.value.push(nb);
          }
        });
      }
    }
    lastKeyFields.value = newKeys;
  } else {
    ElMessage.error((res && res.msg) || '查询失败');
  }
};

const handleSubmit = async () => {
  if (batchList.value.length === 0) {
    ElMessage.warning('请先查询数据');
    return;
  }
  // 校验必填项
  for (const b of batchList.value) {
    for (let i = 0; i < dataCollectionItems.value.length; i++) {
      const item = dataCollectionItems.value[i];
      if (item.IsRequired && (!b.values[i] || String(b.values[i]).trim() === '')) {
        ElMessage.warning(`SN码 ${b.ContainerName} 的「${item.DataPointName}」为必填项`);
        return;
      }
    }
  }
  const params = {
    TaskName: lastKeyFields.value.TaskName || '',
    TaskListName: lastKeyFields.value.TaskListName || '',
    DataCollectionDefId: lastKeyFields.value.DataCollectionDefId || '',
    DataCollectionDefName: lastKeyFields.value.DataCollectionDefName || '',
    reBornContainerOperations: batchList.value.map((b: any) => ({
      ContainerName: b.ContainerName,
      operationEntityDataCollectionLists: dataCollectionItems.value.map((item: any, idx: number) => ({
        DataPointName: item.DataPointName,
        DataType: item.Type,
        DataValue: String(b.values[idx] ?? ''),
      })),
    })),
    Operator: userStore.getUserInfo,
  };
  const res: any = await ContainersOperationContainerOperationExecution(params);
  if (res && res.success && res.code === 0) {
    ElMessage.success(res.msg || '提交成功');
    info.value = { MfgOrderName: "", OrderStatusName: "", PlannedQuantity: null,
      CompletedQuantity: null, SpecName: "", ResourceName: "", InvAddCode: "",
      ProductName: "", ProductFamily: "", ProductDesc: "" };
    batchList.value = [];
    dataCollectionItems.value = [];
    lastKeyFields.value = {};
  } else {
    ElMessage.error((res && res.msg) || '执行失败');
  }
};

onMounted(async () => {
  const res: any = await ContainersOperationMfgOrderQuery();
  if (res && res.success && res.code === 0) {
    mfgOrderOptions.value = res.content || [];
  }
});
</script>