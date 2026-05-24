<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0px 8px' }">
      <el-form ref="formRef" class="form" :inline="true" :model="getForm">
        <el-form-item label="时间" prop="timePeriod" class="mb-2">
          <el-date-picker :shortcuts="shortcuts" v-model="getForm.timePeriod" value-format="YYYY-MM-DD" type="daterange"
            range-separator="-" style="width: 240px" :clearable="true" />
        </el-form-item>
        <el-form-item label="生产计划号" class="mb-2">
          <el-input v-model="getForm.OrderNumber" placeholder="请输入生产计划号" @change="getData" clearable @clear="getData" />
        </el-form-item>
        <el-form-item label="面号" class="mb-2">
          <el-select v-model="getForm.Side" clearable style="width: 150px" @change="getData">
            <el-option v-for="item in sideList" :key="item" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item class="mb-2">
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table border size="small" :data="tableData.slice(
        (pageObj.currentPage - 1) * pageObj.pageSize,
        pageObj.currentPage * pageObj.pageSize
      )
        " :height="tableHeight" stripe>
        <el-table-column type="index" align="center" fixed label="序号" />
        <el-table-column prop="OrderNumber" align="center" fixed label="生产计划号" flexible>
        </el-table-column>
        <el-table-column prop="Side" align="center" label="面号" fixed flexible>
        </el-table-column>
        <el-table-column prop="PlanedStartTime" align="center" label="计划开始时间"
          :min-width="flexColumnWidth('计划开始时间', 'PlanedStartTime')">
        </el-table-column>
        <el-table-column prop="PlanedEndTime" align="center" label="计划完成时间"
          :min-width="flexColumnWidth('计划完成时间', 'PlanedEndTime')">
        </el-table-column>
        <el-table-column prop="LineNumber" align="center" label="产线" :min-width="flexColumnWidth('产线', 'LineNumber')">
        </el-table-column>
        <el-table-column prop="ProductNumber" align="center" label="产品编码"
          :min-width="flexColumnWidth('产品编码', 'ProductNumber')">
        </el-table-column>
        <el-table-column prop="OrderPlanedQty" align="center" label="计划数量"
          :min-width="flexColumnWidth('计划数量', 'OrderPlanedQty')">
        </el-table-column>
        <el-table-column prop="ReturnDate" align="center" label="状态" width="100">
          <template #default="scope">
            <div v-if="scope.row.Status === 0">
              <el-tag type="primary">待备料</el-tag>
            </div>
            <div v-if="scope.row.Status === 1">
              <el-tag type="warning">备料中</el-tag>
            </div>
            <div v-if="scope.row.Status === 2">
              <el-tag type="success">备料完成</el-tag>
            </div>
            <div v-if="scope.row.Status === -1">
              <el-tag type="info">已撤消</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="StartTime" align="center" label="备料开始时间"
          :min-width="flexColumnWidth('备料开始时间', 'StartTime')">
        </el-table-column>
        <el-table-column prop="EndTime" align="center" label="备料完成时间" :min-width="flexColumnWidth('备料完成时间', 'EndTime')">
        </el-table-column>
        <el-table-column prop="PreparationBy" align="center" label="备料人"
          :min-width="flexColumnWidth('备料人', 'PreparationBy')">
        </el-table-column>
        <el-table-column prop="shelf_ids" align="center" label="亮灯货架" :min-width="flexColumnWidth('亮灯货架', 'shelf_ids')">
        </el-table-column>
        <el-table-column prop="Remark" align="center" label="备注" :min-width="flexColumnWidth('备注', 'Remark')">
        </el-table-column>
        <el-table-column prop="ReturnDate" fixed="right" align="center" label="操作" width="200">
          <template #default="scope">
            <div class="w-full">
              <el-tooltip content="编辑" placement="top">
                <el-button type="primary" icon="EditPen" size="small" @click="editSubmit(scope.row)"
                  :disabled="scope.row.Status == 0"></el-button>
              </el-tooltip>
              <el-tooltip content="开始备料" placement="top">
                <el-button type="info" icon="VideoPlay" size="small" @click="startSubmit(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="亮灯" placement="top">
                <el-button type="warning" icon="Sunrise" size="small" @click="onLightSubmit(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="完成备料" placement="top">
                <el-button type="success" icon="CircleCheck" size="small" @click="endSubmit(scope.row)"></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty />
          </div>
        </template>
      </el-table>
      <div class="mt-2 mb-2">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageObj.currentPage" :page-size="pageObj.pageSize" :page-sizes="[10, 30, 50, 100, 150]"
          layout="total,sizes, prev, pager, next" :total="tableData.length">
        </el-pagination>
      </div>
      <!-- <table-tem size="small" :show-index="true" :tableData="tableData" :tableHeight="tableHeight"
        :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"></table-tem> -->
    </el-card>
    <el-dialog v-model="editVisible" draggable title="修改备料" width="400px" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="editCancel">
      <el-form ref="editFormRef" :model="editForm" label-width="auto">
        <el-form-item label="生产计划号" prop="OrderNumber">
          <el-input v-model="editForm.OrderNumber" disabled />
        </el-form-item>

        <el-form-item label="面号" prop="Side">
          <el-input v-model="editForm.Side" disabled />
        </el-form-item>
        <el-form-item label="产线" prop="LineNumber">
          <el-input v-model="editForm.LineNumber" disabled />
        </el-form-item>
        <el-form-item label="亮灯货架" prop="shelf_ids_list">
          <el-select v-model="editForm.shelf_ids_list" multiple collapse-tags collapse-tags-tooltip
            :max-collapse-tags="3" placeholder="选择货架">
            <el-option v-for="item in shelfList" :key="item.Shelf_id" :label="item.Shelf_id" :value="item.Shelf_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="Remark">
          <el-input v-model="editForm.Remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCancel">取消</el-button>
          <el-button type="primary" @click="editConfirm"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="startVisible" draggable title="开始备料" width="400px" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="startCancel">
      <el-form ref="startFormRef" :model="startForm" label-width="auto">
        <el-form-item label="产线" prop="LineNumber">
          <el-input v-model="startForm.LineNumber" disabled />
        </el-form-item>
        <el-form-item label="面号" prop="Side">
          <el-input v-model="startForm.Side" disabled />
        </el-form-item>
        <el-form-item label="货架" prop="shelf_ids_list">
          <el-select v-model="startForm.shelf_ids_list" multiple collapse-tags collapse-tags-tooltip
            :max-collapse-tags="3" placeholder="选择货架">
            <el-option v-for="item in shelfList" :key="item.Shelf_id" :label="item.Shelf_id" :value="item.Shelf_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="Remark">
          <el-input v-model="startForm.Remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="startCancel">取消</el-button>
          <el-button type="primary" @click="startConfirm"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  watch,
  nextTick,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
} from "vue";
import tableTem from "@/components/tableTem/index.vue";
import {shortcuts} from "@/utils/dataMenu"
import { GetSMTPreparationOrderList } from "@/api/smtApi";
import { useUserStoreWithOut } from "@/stores/modules/user";
const userStore = useUserStoreWithOut();
interface GetForm {
  OrderNumber: string;
  Side: string;
  StartDate: string;
  EndDate: string;
  timePeriod: string[];
}
interface ShelfList {
  Shelf_id: string;
}
const getForm = ref<GetForm>({
  OrderNumber: "",
  Side: "",
  StartDate: "",
  EndDate: "",
  timePeriod: [],
});

const sideList = ref([
  {
    value: "TOP",
    label: "TOP",
  },
  {
    value: "BOT",
    label: "BOT",
  },
]);
const tableData = ref([]);
const pageObj = ref({
  pageSize: 50,
  currentPage: 1,
});
const tableHeight = ref(0);
const editVisible = ref(false);
const editForm = ref({
  OrderNumber: "", //生产计划号
  Side: "", //AB面
  LineNumber: "", //线体
  LineNameDesc: "",
  shelf_ids: "", //货位
  shelf_ids_list: [],
  Remark: "", //备注
  CreatedBy: userStore.getUserInfo,
  UpdatedBy: userStore.getUserInfo,
});
const shelfList = ref<ShelfList[]>([]);
const lineNameList = ref<any>([]);
const editFormRef = ref()
const startVisible = ref(false)
const startForm = ref({
  shelf_ids: '',
  CreatedBy: '',
  Side: '',
  shelf_ids_list: '',
  Remark: '',
  LineNumber: '',
})
const startFormRef = ref()
//编辑
const editSubmit = (data: any) => {
  // console.log(data);
  editForm.value = { ...data }
  editVisible.value = true;
};
const editCancel = () => {
  editFormRef.value.resetFields()
  editVisible.value = false
};
const editConfirm = () => { };

//开始备料
const startSubmit = (data: any) => {
  startForm.value = { ...data }
  startVisible.value = true;
};
const startCancel = () => {
  startFormRef.value.resetFields()
  startVisible.value = false
}
const startConfirm = () => {

}
//完成备料
const endSubmit = (data: any) => { };
//亮灯
const onLightSubmit = (data: any) => { };
const columnData = reactive([
  {
    text: true,
    prop: "OrderNumber",
    label: "生产计划号",
    width: "",
    min: true,
    align: "center",
    fixed: true,
  },
  {
    text: true,
    prop: "Side",
    label: "面号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "PlanedStartTime",
    label: "计划开始时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "PlanedEndTime",
    label: "计划完成时间",
    width: "",
    min: true,
    align: "center",
  },

  {
    text: true,
    prop: "LineNumber",
    label: "产线",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ProductNumber",
    label: "产品编码",
    width: "",
    min: true,
    align: "center",
  },

  {
    text: true,
    prop: "OrderPlanedQty",
    label: "计划数量",
    width: "",
    min: true,
    align: "center",
  },

  {
    // text: true,
    // prop: "Status",
    // label: "状态",
    // width: "",
    // min: true,
    // align: "center",
    prop: "Status",
    label: "状态",
    width: "85",
    min: true,
    align: "center",
    tag: true,
    tagType: "number",
    tagItem: [
      { text: "待备料", type: "primary", number: 0 },
      { text: "备料中", type: "warning", number: 1 },
      { text: "备料完成", type: "success", number: 2 },
      { text: "已撤消", type: "info", number: -1 },
    ],
  },
  {
    text: true,
    prop: "StartTime",
    label: "备料开始时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "EndTime",
    label: "备料完成时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "PreparationBy",
    label: "备料人",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "shelf_ids",
    label: "亮灯货架",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Remark",
    label: "备注",
    width: "",
    min: true,
    align: "center",
  },

  {
    isOperation: true,
    label: "操作",
    width: "200",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "编辑",
        prop: 'Status',
        disabled: 0,
        icon: "EditPen",
        buttonClick: editSubmit,
      },
      {
        type: "info",

        label: "开始备料",
        icon: "VideoPlay",
        buttonClick: startSubmit,
      },

      {
        type: "warning",
        label: "亮灯",
        icon: "Sunrise",
        buttonClick: onLightSubmit,
      },
      {
        type: "success",
        label: "完成备料",
        icon: "CircleCheck",
        buttonClick: endSubmit,
      },
    ],
  },
]);
watch(
  () => getForm.value.timePeriod,
  (newVal: any) => {
    if (newVal === null) {
      getForm.value.StartDate = "";
      getForm.value.EndDate = "";
      getData();
      return [];
    }
    getForm.value.StartDate = newVal[0];
    getForm.value.EndDate = newVal[1];
  },
  { deep: true }
);

onBeforeMount(() => {
  getScreenHeight();
  let date1: string = setDefaultDate();
  let date2: string = setDefaultDate1();
  getForm.value.timePeriod = [date1, date2];
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
  GetSMTPreparationOrderList(getForm.value).then((res: any) => {
    tableData.value = res.content;
  });
};
const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 195;
  });
};
const setDefaultDate = () => {
  // 获取当前日期
  const now = new Date();
  // 格式化日期为YYYY-MM-DD
  const formattedDate = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return formattedDate;
};
const setDefaultDate1 = () => {
  // 获取当前日期
  const now = new Date();
  // 格式化日期为YYYY-MM-DD
  const formattedDate = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate() + 1).padStart(2, "0")}`;
  return formattedDate;
};
const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  return getMaxLength(arr) + 25 + "px";
};

const getMaxLength = (arr: any) => {
  return arr.reduce((acc: any, item: any) => {
    if (item) {
      const calcLen = getTextWidth(item);

      if (acc < calcLen) {
        acc = calcLen;
      }
    }
    return acc;
  }, 0);
};
const getTextWidth = (str: string) => {
  let width = 0;
  const html = document.createElement("span");
  html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${13}px; font-family: Arial, sans-serif;`;
  html.innerText = str; // 去除字符串前后的空白字符
  document.body?.appendChild(html);

  const spanElement = html; // 无需再次查询，直接使用创建的元素
  if (spanElement) {
    width = spanElement.offsetWidth;
    spanElement.remove();
  }
  // console.log(width);
  return width;
};
</script>

<style scoped lang="scss"></style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
