<template>
  <div class="w-full flex box">
    <div class="setwidth box-border w-[320px]">
      <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
        <span class="ml-5">基本信息</span>
      </div>
      <el-form ref="formRef" :model="form" label-width="auto" class="p-2">
        <div v-for="f in formHeader" :key="f.prop">
          <el-form-item :label="f.label" :prop="f.prop" :class="[f.prop == 'eqInfo' ? 'mb-2' : '']">
            <span class="font-bold text-[1rem] text-wrap break-all">{{
              form[f.prop]
            }}</span>
          </el-form-item>
          <el-divider class="mb-2 mt-2" v-if="f.prop == 'eqInfo'" />
        </div>
      </el-form>
    </div>
    <div class="w-[calc(100%-320px)] min-w-[600px]">
      <div class="w-full h-full flex flex-col">
        <div>
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5"> 扫描条码</span>
          </div>
          <div class="h-[120px] p-5">
            <el-form class="inbound" :inline="true" :model="formData" label-width="auto" @submit.native.prevent>
              <el-form-item label="扫描条码">
                <el-input v-model="formData.Container" ref="feedInputRef" style="width: 500px" placeholder="请扫描条码"
                  @keyup.enter.native="getChange" />
              </el-form-item>
            </el-form>
            <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
              {{ msgTitle === "" ? "请扫描物料编码" : msgTitle }}
            </div>
            <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
              {{ msgTitle }}
            </div>
          </div>
        </div>
        <div class="flex flex-col flex-1">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">生产计划号物料需求清单</span>
          </div>
          <div class="flex-1" ref="tablebox">
            <el-table :data="tableData.slice(
              (pageObj.currentPage - 1) * pageObj.pageSize,
              pageObj.currentPage * pageObj.pageSize
            )
              " stripe border fit :tooltip-effect="'dark'" :height="300" row-key="MaterialName"
              :tree-props="{ children: 'children' }">
              <el-table-column type="index" align="center" fixed label="序号" width="60" />
              <el-table-column prop="MaterialName" label="物料编码" :min-width="180" width="180">
              </el-table-column>
              <el-table-column prop="MaterialDesc" label="物料描述" :show-overflow-tooltip="true" width="200">
              </el-table-column>
              <el-table-column prop="isMater" label="主料" width="160" :min-width="160">
                <template #default="scope">
                  <span v-if="scope.row.isMater === 1">是</span>
                  <span v-if="scope.row.isMater === 0">否{{ `(${scope.row.originalMaterialName})` }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="QtyRequired" align="center" label="单件用量"
                :min-width="flexColumnWidth('单件用量', 'QtyRequired')">
              </el-table-column>
              <el-table-column prop="TotalQtyRequired" align="center" label="需求量"
                :min-width="flexColumnWidth('需求量', 'TotalQtyRequired')">
              </el-table-column>
              <el-table-column label="上料总量" fixed="right" :min-width="flexColumnWidth('上料总量', 'LoadQueueQty')"
                align="center">
                <template #default="scope">
                  <!-- <span class="underline font-bold text-[#006487] cursor-pointer" @click="handleEdit(scope.row)">{{
                    scope.row.LoadQueueQty }}</span> -->
                  <el-button type="warning" text bg :disabled="scope.row.isLoadQueue != 1 || scope.row.LoadQueueQty == 0
                    " @click="handleEdit(scope.row)">
                    {{
                      scope.row.LoadQueueQty == 0 ? "" : scope.row.LoadQueueQty
                    }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- <div class="mt-2 mb-2">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :pager-count="5" :current-page="pageObj.currentPage" :page-size="pageObj.pageSize"
                :page-sizes="[10, 30, 50, 100, 150]" layout="total,sizes, prev, pager, next" :total="tableData.length">
              </el-pagination>
            </div> -->
            <!-- <table-tem
              :showIndex="true"
              :tableData="tableData"
              :tableHeight="300"
              :columnData="columnData"
              :pageObj="pageObj"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
            ></table-tem> -->
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="detailVisible" title="物料上料明细" width="75%" align-center @close="detailVisible = false"
      :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="box">
        <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
          <span class="ml-5">基本信息</span>
        </div>
        <el-form class="pt-2 pl-2" ref="formRef" :inline="true" :model="detailForm" label-width="auto">
          <el-form-item class="mb-2" label="生产计划号" prop="order">
            <el-input v-model="detailForm.MfgOrderName" disabled /></el-form-item>
          <el-form-item class="mb-2" label="需求量" prop="order">
            <el-input v-model="detailForm.TotalQtyRequired" disabled /></el-form-item>
          <el-form-item class="mb-2" label="上料总量" prop="order">
            <el-input v-model="detailForm.LoadQueueQty" disabled /></el-form-item>
          <el-form-item class="mb-2" label="物料编码" prop="order">
            <el-input v-model="detailForm.MaterialName" disabled /></el-form-item>
          <el-form-item class="mb-2" label="物料描述" prop="order">
            <el-input type="textarea" style="width: 457px" v-model="detailForm.MaterialDesc" disabled /></el-form-item>
        </el-form>
        <div>
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">物料批次明细</span>
          </div>
          <!-- <div class="m-2">
            <el-button type="primary" :disabled="BlankList.length == 0" @click="batchBlank">批量下料</el-button>
          </div> -->
          <table-tem :showIndex="true" ref="feedTableRef" :tableData="detailtableData" :tableHeight="300"
            :columnData="detailcolumnData" :pageObj="detailpageObj" @handleSizeChange="handleSizeChange1"
            @handleSelectionChange="handleSelectionChange" @handleCurrentChange="handleCurrentChange1"></table-tem>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  LoadMaterialQueue,
  UnLoadMaterialQueue,
  QueryMaterialQueueDetails,
} from "@/api/smtApi";
import tableTem from "@/components/tableTem/index.vue";
import { toRefs, computed, ref, reactive } from "vue";
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { cloneDeep } from "lodash-es";
import { ElNotification, ElMessageBox } from "element-plus";
const appStore = useAppStore();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const props = defineProps(["form", "formHeader", "tableData"]);
const { form, formHeader, tableData } = toRefs(props);
const formData = ref({
  // type: "",
  MfgOrder: form?.value.MfgOrderName,
  Container: "",
  MaterialName: "",
  // SpecName: specName?.value || "",
  workstationName: opui.station,
  userAccount: userStore.getUserInfo,
});
const unformData = ref({
  MfgOrder: form?.value.MfgOrderName,
  Container: "",
  MaterialName: "",
  // SpecName: specName?.value || "",
  workstationName: opui.station,
  userAccount: userStore.getUserInfo,
});
const getDetailForm = ref({
  MfgOrder: "",
  Container: "",
  MaterialName: "",
  // SpecName: specName?.value || "",
  workstationName: opui.station,
  userAccount: userStore.getUserInfo,
});

const BlankList = ref([]);
const barCode = ref("");
const msgTitle = ref("");
const msgType = ref(true);
const feedTableRef = ref();
const inputFocus = ref(true);
const feedInputRef = ref();
const detailVisible = ref(false);
const handleEdit = (row: any) => {
  detailForm.value = { ...row };
  getDetailForm.value.MfgOrder = row.MfgOrderName;
  getDetailForm.value.MaterialName = row.MaterialName;
  // console.log( getDetailForm.value)
  getData();
  detailVisible.value = true;
};
const columnData = reactive([
  {
    text: true,
    prop: "MfgOrderName",
    label: "生产计划号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "OrderQty",
    label: "计划数量",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MaterialName",
    label: "物料编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MaterialDesc",
    label: "物料描述",
    width: "200",
    // min: true,
    align: "1",
  },
  {
    text: true,
    prop: "isMater",
    label: "主料",
    // width: "200",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "QtyRequired",
    label: "单件用量",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "TotalQtyRequired",
    label: "需求量",
    width: "",
    min: true,
    align: "1",
  },
  {
    isOperation: true,
    label: "上料总量",
    width: "120",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "上料明细",
        prop: "LoadQueueQty",
        icon: "",
        // isButton:false,
        buttonClick: handleEdit,
      },
    ],
  },
]);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});
const detailForm = ref({
  MfgOrderName: "",
  TotalQtyRequired: "",
  LoadQueueQty: "",
  MaterialName: "",
  MaterialDesc: "",
});
const detailtableData = ref([]);

const emit = defineEmits(["updateList"]);
//下料
const handleDelet = (row: any) => {
  // console.log(row);
  unformData.value.Container = row.ContainerName;
  unformData.value.MaterialName = row.MaterialName;
  if (row.Qty == 0) {
    ElNotification({
      title: "已完全消耗，无法下料",
      // message: "取消操作",
      type: "error",
    });
    return;
  } else {
    ElMessageBox.confirm("是否进行下料", "确认操作", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        UnLoadMaterialQueue(unformData.value).then((res: any) => {
          // BlankList.value = [];
          updateList();
          // updateList();
          getData();
          ElNotification({
            title: res.msg,
            // message: "取消操作",
            type: "success",
          });
        });
      })
      .catch(() => {
        ElNotification({
          title: "已取消下料",
          // message: "取消操作",
          type: "warning",
        });
      });
  }
};
const detailcolumnData = ref([
  {
    text: true,
    prop: "ContainerName",
    label: "物料批次条码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "VendorLotNumber",
    label: "批次号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "LoadQueueQty",
    label: "上料量",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "issueQty",
    label: "消耗数量",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "剩余数量",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "LoadQueueBy",
    label: "操作人",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "LoadQueueTime",
    label: "上料时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    isOperation: true,
    label: "操作",
    width: "120",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "下料",
        disabled: "0",
        prop: "Qty",
        icon: "",
        // isButton:false,
        buttonClick: handleDelet,
      },
    ],
  },
]);
const detailpageObj = ref({
  pageSize: 100,
  currentPage: 1,
});
//更新需求清单
const updateList = () => {
  emit("updateList");
  // console.log(tableData?.value);
};
//上料
const getChange = () => {
  LoadMaterialQueue(formData.value).then((res: any) => {
    msgTitle.value = res.msg;
    msgType.value = res.success;
    formData.value.Container = "";
    if (res.success) {
      updateList();
    }
  });
};
//获取物料明细
const getData = () => {
  QueryMaterialQueueDetails(getDetailForm.value).then((res: any) => {
    // console.log(res.content);
    if (res.success) {
      detailForm.value.LoadQueueQty = res.content.reduce((sum: any, e: any) => sum + Number(e.LoadQueueQty || 0), 0)
      detailtableData.value = res.content;
    }
  });
};
//批量下料
const batchBlank = () => {
  let data = "";
  feedTableRef.value.toggleSelection();
  BlankList.value = [];
  // UnLoadMaterialQueue(data).then((res:any)=>{
  //   BlankList.value=[]
  // })
};
//获取光标
const getFocus = () => {
  console.log(feedInputRef.value);
  feedInputRef.value.focus();
};

const handleSelectionChange = (val: any) => {
  let data = cloneDeep(val);
  BlankList.value = data;
};
const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const handleSizeChange1 = (val: any) => {
  detailpageObj.value.currentPage = 1;
  detailpageObj.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
  detailpageObj.value.currentPage = val;
};
const getMaxLength = (arr: any) => {
  return arr.reduce((acc: any, item: any) => {
    if (item) {
      // console.log(acc,item);
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
  html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${16}px; font-family: Arial, sans-serif;`;
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

const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
};
defineExpose({
  getFocus,
});
</script>
<style lang="scss" scoped>
.box {
  border: 2px solid #cbcbcb;

  .setwidth {
    flex: 0 0 320px;
    border-right: 2px solid #cbcbcb;
  }
}
</style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
