<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-start">
        <div></div>
        <el-form ref="queryFormRef" size="small" :model="queryForm" label-width="auto" :inline="true">
          <el-form-item label="入库单号" class="mb-2">
            <el-input v-model="queryForm.CompletionInboundNo" style="width: 160px" clearable @clear="getData" @change="getData" />
          </el-form-item>
          <el-form-item label="工单号" class="mb-2">
            <el-input v-model="queryForm.MfgOrder" style="width: 160px" clearable @clear="getData" @change="getData" />
          </el-form-item>
          <el-form-item label="产品编码" class="mb-2">
            <el-input v-model="queryForm.Product" style="width: 160px" clearable @clear="getData" @change="getData" />
          </el-form-item>
          <el-form-item label="状态" class="mb-2">
            <el-select v-model="queryForm.Status" style="width: 120px" @change="getData" placeholder="全部" clearable>
              <el-option label="全部" :value="null" />
              <el-option label="未提交" :value="0" />
              <el-option label="已提交" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建人" class="mb-2">
            <el-input v-model="queryForm.OperationUser" style="width: 130px" clearable @clear="getData" @change="getData" />
          </el-form-item>
          <el-form-item label="创建时间" class="mb-2">
            <el-date-picker v-model="queryForm.CreateStartTime" type="datetime" placeholder="开始" value-format="YYYY-MM-DDTHH:mm:ss" style="width: 170px" />
            <span class="mx-1">~</span>
            <el-date-picker v-model="queryForm.CreateEndTime" type="datetime" placeholder="结束" value-format="YYYY-MM-DDTHH:mm:ss" style="width: 170px" />
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button type="success" size="small" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="tableData" size="small" style="width: 100%" :height="tableHeight" border fit highlight-current-row>
        <el-table-column type="index" align="center" label="序号" width="55">
          <template #default="scope">
            <span>{{ scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="CompletionInboundNo" label="入库单号" min-width="150" show-overflow-tooltip />
        <el-table-column prop="MfgOrder" label="工单号" min-width="130" show-overflow-tooltip />
        <el-table-column prop="Product" label="产品编码" min-width="130" show-overflow-tooltip />
        <el-table-column prop="InboundQty" label="入库数量" width="80" align="center" />
        <el-table-column prop="WorkCenter" label="车间" min-width="140" show-overflow-tooltip />
        <el-table-column prop="MfgLine" label="产线" min-width="140" show-overflow-tooltip />
        <el-table-column prop="Status" label="状态" width="80" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.DataStatus === 1 ? 'success' : 'warning'" size="small">{{ scope.row.Status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="CreateUser" label="创建人" width="120" />
        <el-table-column prop="CreateTime" label="创建时间" width="170" />
        <el-table-column prop="UpdateUser" label="修改人" width="120" />
        <el-table-column prop="UpdateTime" label="修改时间" width="170" />
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button type="primary" icon="EditPen" size="small" @click.stop="handleEdit(scope.row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" icon="Delete" size="small" @click.stop="handleDelete(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
        <template #empty><el-empty /></template>
      </el-table>

      <div class="mt-2">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :pager-count="5" :current-page="pageObj.currentPage" :page-size="pageObj.pageSize"
          :page-sizes="[30, 50, 100, 200, 300]" layout="total,sizes, prev, pager, next" :total="total" />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新增入库单' : '修改入库单'" draggable width="700px"
      :close-on-click-modal="false" align-center @close="dialogCancel">
      <div class="text-base font-bold mb-3">基本信息</div>
      <el-form ref="dialogFormRef" :model="dialogForm" label-width="100px" size="default">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入库单号" prop="InboundNo">
              <el-input v-model="dialogForm.InboundNo" placeholder="自动生成或手动输入" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="text-base font-bold mb-3">入库方式</div>
      <el-row :gutter="20" class="mb-4">
        <el-col :span="12">
          <el-card :class="['cursor-pointer text-center py-4', dialogForm.InboundType === 'scan' ? 'border-2 border-blue-500' : '']"
            @click="handleInboundTypeChange('scan')">
            <el-icon :size="40" color="#409eff"><Camera /></el-icon>
            <div class="mt-2 font-bold">扫码入库</div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card :class="['cursor-pointer text-center py-4', dialogForm.InboundType === 'order' ? 'border-2 border-blue-500' : '']"
            @click="handleInboundTypeChange('order')">
            <el-icon :size="40" color="#e6a23c"><Document /></el-icon>
            <div class="mt-2 font-bold">工单入库</div>
          </el-card>
        </el-col>
      </el-row>

      <template v-if="dialogForm.InboundType === 'scan'">
        <div class="text-base font-bold mb-3">扫描成品SN</div>
        <el-input v-model="dialogForm.ScanSN" placeholder="扫描或输入成品SN后回车" size="large" clearable
          @keyup.enter="handleScanSN" class="mb-4" />
      </template>
      <template v-else>
        <div class="text-base font-bold mb-3">选择工单</div>
        <el-select v-model="dialogForm.SelectedMfgOrder" placeholder="请选择工单" size="large" style="width:100%" class="mb-4"
          @change="handleMfgOrderChange">
          <el-option v-for="item in mfgOrderOptions" :key="item.MfgOrderName" :label="item.MfgOrderInfo"
            :value="item.MfgOrderName" />
        </el-select>
      </template>

      <div class="text-base font-bold mb-2">成品入库列表（{{ displayItemList.filter(item => item.DataStatus === 0).length }}个成品）</div>
      <el-table :data="displayItemList.filter(item => item.DataStatus === 0)" size="small" border style="width:100%" max-height="300">
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column prop="SN" label="SN编码" min-width="140" show-overflow-tooltip />
        <el-table-column prop="MaterialCode" label="产品编码" min-width="130" show-overflow-tooltip />
        <el-table-column prop="ProductDesc" label="产品名称" min-width="130" show-overflow-tooltip />
        <el-table-column prop="ProductFamily" label="产品型号" min-width="130" show-overflow-tooltip />
        <el-table-column prop="Qty" label="数量" width="70" align="center" />
        <el-table-column label="操作" width="60" align="center" fixed="right">
          <template #default="scope">
            <el-button type="danger" link size="small" @click="handleRemoveItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty><el-empty description="暂无成品" /></template>
      </el-table>

      <template #footer>
        <el-button @click="dialogCancel">取消</el-button>
        <el-button type="primary" @click="dialogConfirm('save')">保存</el-button>
        <el-button type="success" @click="dialogConfirm('submit')">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  QueryCompletionInboundList,
  QueryCompletionInboundDetailList,
  QueryBatchInboundByMfgOrder,
  QuerySNDetailByMfgOrder,
  ScanSN,
  SubmitCompletionInbound,
  DeleteCompletionInbound,
} from "@/api/operate";

// ====== 查询 ======
const queryForm = ref({
  CompletionInboundNo: "", MfgOrder: "", Product: "", Status: null as number | null,
  CreateStartTime: "", CreateEndTime: "", OperationUser: "",
});
const tableData = ref<any[]>([]);
const total = ref(0);
const pageObj = ref({ currentPage: 1, pageSize: 30 });
const tableHeight = ref(400);

const getData = async () => {
  const params: any = {
    CompletionInboundNo: queryForm.value.CompletionInboundNo,
    MfgOrder: queryForm.value.MfgOrder,
    Product: queryForm.value.Product,
    OperationUser: queryForm.value.OperationUser,
    Page: pageObj.value.currentPage,
    PageSize: pageObj.value.pageSize,
  };
  if (queryForm.value.Status !== null && queryForm.value.Status !== undefined) {
    params.Status = queryForm.value.Status;
  }
  if (queryForm.value.CreateStartTime) params.CreateStartTime = queryForm.value.CreateStartTime;
  if (queryForm.value.CreateEndTime) params.CreateEndTime = queryForm.value.CreateEndTime;

  const res: any = await QueryCompletionInboundList(params);
  if (res && res.success && res.code === 0) {
    tableData.value = res.content || [];
    total.value = res.total || 0;
  } else {
    ElMessage.error((res && res.msg) || "查询失败");
    tableData.value = [];
    total.value = 0;
  }
};

const handleSizeChange = (val: number) => { pageObj.value.pageSize = val; pageObj.value.currentPage = 1; getData(); };
const handleCurrentChange = (val: number) => { pageObj.value.currentPage = val; getData(); };

// ====== Dialog ======
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit">("add");
const dialogForm = ref({
  InboundNo: "",
  InboundType: "scan",
  ScanSN: "",
  SelectedMfgOrder: "",
  detailData: [] as any[],
  scanOrderData: [] as any[],
});
const mfgOrderOptions = ref<any[]>([]);

// 保存当前选中的工单信息（来自SN扫描或工单选择）
const currentOrderInfo = ref({
  MfgOrderName: "",
  WorkCenterName: "",
  MfgLineName: "",
  ProductName: "",
});

// 保存编辑模式的原始数据快照
const originalDialogData = ref({
  InboundType: "",
  SelectedMfgOrder: "",
  detailData: [] as any[],
  scanOrderData: [] as any[],
  currentOrderInfo: {
    MfgOrderName: "",
    WorkCenterName: "",
    MfgLineName: "",
    ProductName: "",
  },
});

// 保存原始数据的函数
const saveOriginalData = () => {
  originalDialogData.value = {
    InboundType: dialogForm.value.InboundType,
    SelectedMfgOrder: dialogForm.value.SelectedMfgOrder,
    detailData: JSON.parse(JSON.stringify(dialogForm.value.detailData || [])),
    scanOrderData: JSON.parse(JSON.stringify(dialogForm.value.scanOrderData || [])),
    currentOrderInfo: JSON.parse(JSON.stringify(currentOrderInfo.value)),
  };
};

// 恢复到原始数据的函数
const restoreOriginalData = () => {
  dialogForm.value.InboundType = originalDialogData.value.InboundType;
  dialogForm.value.SelectedMfgOrder = originalDialogData.value.SelectedMfgOrder;
  dialogForm.value.detailData = JSON.parse(JSON.stringify(originalDialogData.value.detailData));
  dialogForm.value.scanOrderData = JSON.parse(JSON.stringify(originalDialogData.value.scanOrderData));
  currentOrderInfo.value = JSON.parse(JSON.stringify(originalDialogData.value.currentOrderInfo));
};

// 合并数据，如果 SN 相同且 DataStatus 都是 0，则用新数据覆盖旧数据
const displayItemList = computed(() => {
  const map = new Map<string, any>();
  
  // 先放入 detailData 的数据
  (dialogForm.value.detailData || [])
    .forEach((i: any) => map.set(i.SN, { ...i }));
  
  // 再放入 scanOrderData 的数据
  (dialogForm.value.scanOrderData || [])
    .forEach((i: any) => {
      const existing = map.get(i.SN);
      // 如果已存在且两个都是 DataStatus === 0，则用新数据覆盖
      if (existing && existing.DataStatus === 0 && i.DataStatus === 0) {
        map.set(i.SN, { ...i });
      } else {
        map.set(i.SN, { ...i });
      }
    });
  
  return Array.from(map.values());
});

/** 获取工单下拉选项 */
const fetchMfgOrderOptions = async () => {
  const res: any = await QueryBatchInboundByMfgOrder();
  if (res && res.success && res.code === 0) {
    mfgOrderOptions.value = res.content || [];
  } else {
    ElMessage.warning((res && res.msg) || "获取工单列表失败");
    mfgOrderOptions.value = [];
  }
};

const handleAdd = async () => {
  dialogMode.value = "add";
  dialogForm.value = {
    InboundNo: "", InboundType: "scan", ScanSN: "", SelectedMfgOrder: "",
    detailData: [], scanOrderData: [],
  };
  // 新增时清空工单信息
  currentOrderInfo.value = {
    MfgOrderName: "",
    WorkCenterName: "",
    MfgLineName: "",
    ProductName: "",
  };
  await fetchMfgOrderOptions();
  dialogVisible.value = true;
};

const handleEdit = async (row: any) => {
  dialogMode.value = "edit";
  
  // 重置表单
  dialogForm.value = {
    InboundNo: row?.CompletionInboundNo || "", 
    InboundType: "scan", 
    ScanSN: "", 
    SelectedMfgOrder: row?.MfgOrder || "",
    detailData: [], 
    scanOrderData: [],
  };
  
  currentOrderInfo.value = {
    MfgOrderName: row?.MfgOrder || "",
    WorkCenterName: row?.WorkCenter || "",
    MfgLineName: row?.MfgLine || "",
    ProductName: row?.Product || "",
  };
  
  // 加载明细数据
  const [res1, res2] = await Promise.all([
    QueryCompletionInboundDetailList({ CompletionInboundNo: row.CompletionInboundNo }),
    QueryBatchInboundByMfgOrder(),
  ]);
  
  if (res1 && res1.success && res1.code === 0) {
    // 确保字段映射正确
    dialogForm.value.detailData = (res1.content || []).map((i: any) => ({
      ...i,
      MaterialCode: i.MaterialCode || i.ProductName || i.Product || "",
      ProductName: i.ProductName || i.Product || "",
      ProductDesc: i.ProductDesc || "",
      ProductFamily: i.ProductFamily || i.ProductFamilyName || "",
      ProductFamilyName: i.ProductFamilyName || i.ProductFamily || "",
    }));
  } else {
    ElMessage.warning((res1 && res1.msg) || "获取入库单明细失败");
  }
  
  if (res2 && res2.success && res2.code === 0) {
    mfgOrderOptions.value = res2.content || [];
  } else {
    ElMessage.warning((res2 && res2.msg) || "获取工单列表失败");
    mfgOrderOptions.value = [];
  }
  
  // 保存原始数据快照
  saveOriginalData();
  
  dialogVisible.value = true;
};

const handleInboundTypeChange = async (type: string) => {
  // 如果点击的是当前类型，不做处理
  if (dialogForm.value.InboundType === type) {
    return;
  }
  
  // 编辑模式：恢复到原始数据并切换类型（无提示）
  if (dialogMode.value === 'edit') {
    // 直接恢复到原始数据，然后改变入库方式类型
    restoreOriginalData();
    dialogForm.value.InboundType = type;
    
    ElMessage.success(`已切换到${type === 'scan' ? '扫码入库' : '工单入库'}模式，并恢复到原始数据`);
    return;
  }
  
  // 新增模式：直接清空并切换（无提示）
  // 清空所有数据
  dialogForm.value.ScanSN = "";
  dialogForm.value.SelectedMfgOrder = "";
  dialogForm.value.scanOrderData = [];
  dialogForm.value.detailData = [];
  currentOrderInfo.value = {
    MfgOrderName: "",
    WorkCenterName: "",
    MfgLineName: "",
    ProductName: "",
  };
  
  dialogForm.value.InboundType = type;
  
  // 如果切换到工单入库，加载工单列表
  if (type === 'order') {
    await fetchMfgOrderOptions();
  }
};

// 通用的添加或更新方法（去重逻辑：SN相同且都是DataStatus=0时覆盖）
const addOrUpdateItem = (newItem: any, targetArray: any[]) => {
  const existingIndex = targetArray.findIndex((i: any) => i.SN === newItem.SN);
  if (existingIndex !== -1) {
    const existingItem = targetArray[existingIndex];
    // 如果已存在的和新传入的都是 DataStatus === 0，则覆盖
    if (existingItem.DataStatus === 0 && newItem.DataStatus === 0) {
      targetArray[existingIndex] = { ...newItem };
      console.log(`SN "${newItem.SN}" 已存在且都是未提交状态，已覆盖更新`);
    } else {
      console.log(`SN "${newItem.SN}" 已存在，但状态不允许覆盖`);
    }
  } else {
    targetArray.push({ ...newItem });
  }
};

const handleScanSN = async () => {
  const sn = dialogForm.value.ScanSN?.trim();
  if (!sn) return;

  const res: any = await ScanSN({ SN: sn });
  if (res && res.success && res.code === 0 && res.content && res.content.length > 0) {
    const item = res.content[0];
    
    // 保存工单信息到全局变量
    if (item.MfgOrderName) {
      currentOrderInfo.value = {
        MfgOrderName: item.MfgOrderName,
        WorkCenterName: item.WorkCenterName || "",
        MfgLineName: item.MfgLineName || "",
        ProductName: item.ProductName || "",
      };
      console.log("从SN扫描获取到工单信息:", currentOrderInfo.value);
    }
    
    const newItem = {
      SN: item.SN,
      Qty: item.Qty || 1,
      MaterialCode: item.ProductName || "",
      ProductName: item.ProductName || "",
      ProductDesc: item.ProductDesc || "",
      ProductFamily: item.ProductFamilyName || "",
      ProductFamilyName: item.ProductFamilyName || "",
      UOMName: item.UOMName || "PCS",
      DataStatus: 0,
      MfgOrderName: item.MfgOrderName || "",
      WorkCenterName: item.WorkCenterName || "",
      MfgLineName: item.MfgLineName || "",
    };
    
    // 使用带去重逻辑的方法添加
    addOrUpdateItem(newItem, dialogForm.value.scanOrderData);
    dialogForm.value.ScanSN = "";
    
    if (item.MfgOrderName && !dialogForm.value.SelectedMfgOrder) {
      dialogForm.value.SelectedMfgOrder = item.MfgOrderName;
    }
  } else {
    ElMessage.warning((res && res.msg) || "SN扫描验证失败");
  }
};

const handleMfgOrderChange = async (val: string) => {
  if (!val) return;
  
  // 从工单列表中获取工单信息并保存
  const selectedOrder = mfgOrderOptions.value.find((o: any) => o.MfgOrderName === val);
  if (selectedOrder) {
    currentOrderInfo.value = {
      MfgOrderName: selectedOrder.MfgOrderName,
      WorkCenterName: selectedOrder.WorkCenterName || "",
      MfgLineName: selectedOrder.MfgLineName || "",
      ProductName: selectedOrder.ProductName || "",
    };
    console.log("从工单选择获取到工单信息:", currentOrderInfo.value);
  }
  
  const res: any = await QuerySNDetailByMfgOrder({ MfgOrder: val });
  if (res && res.success && res.code === 0) {
    // 直接替换 scanOrderData，而不是追加
    dialogForm.value.scanOrderData = (res.content || []).map((i: any) => ({
      SN: i.SN,
      Qty: i.Qty || 1,
      MaterialCode: i.ProductName || "",
      ProductName: i.ProductName || "",
      ProductDesc: i.ProductDesc || "",
      ProductFamily: i.ProductFamilyName || "",
      ProductFamilyName: i.ProductFamilyName || "",
      UOMName: i.UOMName || "PCS",
      DataStatus: 0,
      MfgOrderName: val,
      WorkCenterName: selectedOrder?.WorkCenterName || "",
      MfgLineName: selectedOrder?.MfgLineName || "",
    }));
    
    if (!res.content || res.content.length === 0) {
      ElMessage.info("该工单下暂无未入库的SN");
    }
  } else {
    ElMessage.warning((res && res.msg) || "查询工单SN明细失败");
    dialogForm.value.scanOrderData = [];
  }
};

// 删除 = 将 DataStatus 从 0 变成 1
const handleRemoveItem = (row: any) => {
  // 在 scanOrderData 中查找
  let target = dialogForm.value.scanOrderData.find((i: any) => i.SN === row.SN);
  if (target && target.DataStatus === 0) {
    target.DataStatus = 1;
    return;
  }
  
  // 在 detailData 中查找
  target = dialogForm.value.detailData.find((i: any) => i.SN === row.SN);
  if (target && target.DataStatus === 0) {
    target.DataStatus = 1;
  }
};

const dialogCancel = () => {
  dialogForm.value = {
    InboundNo: "", InboundType: "scan", ScanSN: "", SelectedMfgOrder: "",
    detailData: [], scanOrderData: [],
  };
  mfgOrderOptions.value = [];
  currentOrderInfo.value = {
    MfgOrderName: "",
    WorkCenterName: "",
    MfgLineName: "",
    ProductName: "",
  };
  // 清空原始数据快照
  originalDialogData.value = {
    InboundType: "",
    SelectedMfgOrder: "",
    detailData: [],
    scanOrderData: [],
    currentOrderInfo: {
      MfgOrderName: "",
      WorkCenterName: "",
      MfgLineName: "",
      ProductName: "",
    },
  };
  dialogVisible.value = false;
};

const dialogConfirm = async (action: 'save' | 'submit') => {
  const mergedItems = displayItemList.value;

  // 卡控：必须至少有一个成品
  if (mergedItems.length === 0) {
    ElMessage.warning("请至少添加一个成品后再操作");
    return;
  }
  
  const now = new Date().toISOString();
  const currentUser = localStorage.getItem('LOGINNAME') || '';

  // 直接使用保存的工单信息
  let finalMfgOrder = currentOrderInfo.value.MfgOrderName;
  let finalWorkCenter = currentOrderInfo.value.WorkCenterName;
  let finalMfgLine = currentOrderInfo.value.MfgLineName;
  let finalProduct = currentOrderInfo.value.ProductName;
  
  // 如果全局变量没有，尝试从选中的工单获取
  if (!finalMfgOrder && dialogForm.value.SelectedMfgOrder) {
    const selectedOrder = mfgOrderOptions.value.find((o: any) => o.MfgOrderName === dialogForm.value.SelectedMfgOrder);
    if (selectedOrder) {
      finalMfgOrder = selectedOrder.MfgOrderName;
      finalWorkCenter = selectedOrder.WorkCenterName;
      finalMfgLine = selectedOrder.MfgLineName;
      finalProduct = selectedOrder.ProductName;
    }
  }
  
  // 如果还是没有，尝试从 detailData 中获取第一个完整的
  if (!finalMfgOrder) {
    const completeFromDetail = dialogForm.value.detailData.find((i: any) => 
      i.MfgOrderName && i.WorkCenterName && i.MfgLineName
    );
    if (completeFromDetail) {
      finalMfgOrder = completeFromDetail.MfgOrderName;
      finalWorkCenter = completeFromDetail.WorkCenterName;
      finalMfgLine = completeFromDetail.MfgLineName;
      finalProduct = completeFromDetail.MaterialCode;
      console.log("从 detailData 获取到工单信息:", { finalMfgOrder, finalWorkCenter, finalMfgLine, finalProduct });
    }
  }
  
  // 如果还是没有，尝试从 scanOrderData 中获取第一个完整的
  if (!finalMfgOrder) {
    const completeSN = dialogForm.value.scanOrderData.find((i: any) => 
      i.MfgOrderName && i.WorkCenterName && i.MfgLineName
    );
    if (completeSN) {
      finalMfgOrder = completeSN.MfgOrderName;
      finalWorkCenter = completeSN.WorkCenterName;
      finalMfgLine = completeSN.MfgLineName;
      finalProduct = completeSN.MaterialCode;
      console.log("从 scanOrderData 获取到工单信息:", { finalMfgOrder, finalWorkCenter, finalMfgLine, finalProduct });
    }
  }

  // 验证必填字段
  if (!finalMfgOrder) {
    ElMessage.warning("无法获取工单信息，请选择工单或扫描包含工单信息的SN");
    return;
  }

  console.log("使用的工单信息:", {
    finalMfgOrder,
    finalWorkCenter,
    finalMfgLine,
    finalProduct
  });

  const params: any = {
    CompletionInboundNo: dialogForm.value.InboundNo,
    MfgOrder: finalMfgOrder,
    Product: finalProduct,
    InboundQty: String(mergedItems.length),
    WorkCenter: finalWorkCenter,
    MfgLine: finalMfgLine,
    Status: action === 'submit' ? 1 : 0,
    DataStatus: 0,
    reBornCompletionInboundDetails: mergedItems.map((i: any) => ({
      SN: i.SN,
      MaterialCode: i.MaterialCode || finalProduct,
      Qty: String(i.Qty || 1),
      UomName: i.UomName || i.UOMName || "PCS",
      DataStatus: i.DataStatus,
      MfgOrder: finalMfgOrder,
      WorkCenter: finalWorkCenter,
      MfgLine: finalMfgLine,
      ProductDesc: i.ProductDesc || "",
      ProductFamily: i.ProductFamilyName || "",
    })),
  };

  if (dialogMode.value === 'add') {
    params.CreateUser = currentUser;
    params.CreateTime = now;
    if (action === 'submit') {
      params.UpdateUser = currentUser;
      params.UpdateTime = now;
    }
  } else {
    params.UpdateUser = currentUser;
    params.UpdateTime = now;
  }

//   if (action === 'submit') {
//     params.CompletionUser = currentUser;
//     params.CompletionTime = now;
//   }

  console.log("提交参数:", params);
  
  const res: any = await SubmitCompletionInbound(params);
  if (res && res.success && res.code === 0) {
    ElMessage.success(action === 'submit' ? "提交成功" : "保存成功");
    // 提交成功后重置工单信息
    currentOrderInfo.value = {
      MfgOrderName: "",
      WorkCenterName: "",
      MfgLineName: "",
      ProductName: "",
    };
    // 清空原始数据快照
    originalDialogData.value = {
      InboundType: "",
      SelectedMfgOrder: "",
      detailData: [],
      scanOrderData: [],
      currentOrderInfo: {
        MfgOrderName: "",
        WorkCenterName: "",
        MfgLineName: "",
        ProductName: "",
      },
    };
    dialogVisible.value = false;
    getData();
  } else {
    ElMessageBox.alert((res && res.msg) || "操作失败", "错误", {
      confirmButtonText: "确定", type: "error",
    });
  }
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定删除入库单 ${row?.CompletionInboundNo}？`, "提示", {
    confirmButtonText: "确定", cancelButtonText: "取消", type: "warning",
  }).then(async () => {
    const res: any = await DeleteCompletionInbound({ CompletionInboundNo: row.CompletionInboundNo });
    if (res && res.success && res.code === 0) {
      ElMessage.success("删除成功");
      getData();
    } else {
      ElMessage.error((res && res.msg) || "删除失败");
    }
  }).catch(() => {});
};

const updateTableHeight = () => { tableHeight.value = window.innerHeight - 220; };

onMounted(() => { updateTableHeight(); window.addEventListener("resize", updateTableHeight); getData(); });
onBeforeUnmount(() => { window.removeEventListener("resize", updateTableHeight); });
</script>