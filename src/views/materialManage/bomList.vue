<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div ref="headerRef">
        <el-form ref="formRef" class="form" :inline="true" size="small" label-width="auto">
          <el-form-item label="组件物料编码" class="mb-2">
            <el-input style="width: 200px" v-model="historyForm.ProductName" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="组件物料名称" class="mb-2">
            <el-input style="width: 200px" v-model="historyForm.ProductDescription" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="" class="mb-2">
            <el-button type="primary" @click="getHistory()">查询</el-button>
          </el-form-item>
          <!-- <el-form-item label="" class="mb-2">
              <el-button
                type="warning"
                @click="(dialogVisible = true), findOrderData()"
                >申请</el-button
              >
            </el-form-item> -->
        </el-form>
      </div>
      <div class="table_container">
        <table-tem :show-index="true" size="small" :tableData="historyTable" :tableHeight="hisHeight"
          :columnData="columnData" :pageObj="pageObjHis" :pageSizes="[300, 500, 1000]"
          @handleSizeChange="handleSizeChangeHis" @handleCurrentChange="handleCurrentChangeHis" @rowClick="rowClick">
        </table-tem>
      </div>
      <div class="w-full">
        <table-tem size="small" :show-index="true" :tableData="detailedTable" :tableHeight="detailedHeight"
          :columnData="detailedData" :pageObj="detailedPageObj">
        </table-tem>
      </div>
    </el-card>

    <!-- <el-dialog
        v-model="dialogVisible"
        width="80%"
        title="生产补料申请"
        align-center
      >
        <div class="w-full">
          <div ref="headerRef">
            <el-form
              ref="formRef"
              class="form"
              :inline="true"
              size="small"
              label-width="85px"
            >
              <el-form-item label="生产计划号">
                <el-select
                  v-model="form.MfgOrderName"
                  placeholder=""
                  style="width: 152.4px"
                  @change="orderChange"
                >
                  <el-option
                    v-for="item in orderList"
                    :key="item"
                    :label="item.MfgOrderName"
                    :value="item.MfgOrderName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="产品机型">
                <el-input
                  v-model="form.BD_ProductModel"
                  class="input-with-select"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item label="产品编码">
                <el-input
                  v-model="form.ProductName"
                  class="input-with-select"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item label="数量">
                <el-input v-model="form.Qty" class="input-with-select" disabled>
                </el-input>
              </el-form-item>
              <el-form-item label="产线">
                <el-input
                  v-model="form.MfgLineDesc"
                  class="input-with-select"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item label="计划开始时间">
                <el-input
                  v-model="form.PlannedCompletionDate"
                  class="input-with-select"
                  disabled
                >
                </el-input>
              </el-form-item>
              <el-form-item label="车间">
                <el-input
                  v-model="form.wcDescription"
                  class="input-with-select"
                  disabled
                >
                </el-input>
              </el-form-item>
              <br />
              <el-form-item label="产品描述">
                <el-input
                  style="width: 420px"
                  type="textarea"
                  v-model="form.ProductDesc"
                  class="input-with-select"
                  disabled
                >
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="table_container">
            <el-table
              :data="
                feedTableData.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                )
              "
              size="small"
              stripe
              border
              fit
              :tooltip-effect="'dark'"
              :height="400"
              row-key="MaterialName"
              :tree-props="{ children: 'children' }"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
                :selectable="selectable"
              />
              <el-table-column
                prop="MaterialName"
                fixed
                label="物料编码"
                :min-width="150"
                width="150"
              >
              </el-table-column>
              <el-table-column
                prop="MaterialDesc"
                label="物料描述"
                :show-overflow-tooltip="true"
                width="200"
              >
              </el-table-column>
  
              <el-table-column
                prop="isMater"
                label="主料"
                width="150"
                :min-width="150"
              >
                <template #default="scope">
                  <span v-if="scope.row.isMater === 1">是</span>
                  <span v-if="scope.row.isMater === 0"
                    >否{{ `(${scope.row.originalMaterialName})` }}</span
                  >
                </template>
</el-table-column>
<el-table-column prop="SpecName" label="工序编码" align="center" :min-width="flexColumnWidth('使用工序', 'SpecDesc')">
</el-table-column>
<el-table-column prop="SpecDesc" label="工序名称" align="center" :min-width="flexColumnWidth('使用工序', 'SpecDesc')">
</el-table-column>

<el-table-column prop="isLoadQueue" align="center" label="允许上料"
  :min-width="flexColumnWidth('允许上料：（是否）', 'isLoadoueue')">
  <template #default="scope">
                  <span v-if="scope.row.isLoadQueue === 1">是</span>
                  <span v-if="scope.row.isLoadQueue === 0">否</span>
                </template>
</el-table-column>
<el-table-column prop="QtyRequired" align="center" label="单件用量" :min-width="flexColumnWidth('单件用量', 'QtyRequired')">
</el-table-column>
<el-table-column prop="TotalQtyRequired" align="center" label="需求量"
  :min-width="flexColumnWidth('需求量', 'TotalQtyRequired')">
</el-table-column>
<el-table-column prop="RequestQty" align="center" label="请求数量">
  <template #default="scope">
                  <el-input
                    v-model="scope.row.RequestQty"
                    v-if="scope.row.isLoadQueue === 1"
                    @input="handleInput(scope.row)"
                  >
                  </el-input>
                </template>
</el-table-column>
</el-table>
</div>
</div>
<template #footer>
          <div class="dialog-footer">
            <el-button type="" @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="applyFor">申请</el-button>
          </div>
        </template>
</el-dialog> -->
  </div>
</template>

<script lang="ts" setup>
import { getCheckResults } from "@/api/operate";
import type { InspectionResult } from "@/typing";
import {
  ElMessageBox,
  ElMessage,
  ElLoading,
  ElNotification,
} from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { findERPBOM, findERPBOMMaterialList } from "@/api/operate";
import { cloneDeep } from "lodash-es";
import {
  ref,
  reactive,
  watch,
  nextTick,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import { shortcuts } from "@/utils/dataMenu";
const tableData = ref<any>([]);
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const tableData1 = ref<any>([]);
const hisHeight = ref(0);
const userStore = useUserStoreWithOut();
const loginName = userStore.getUserInfo;
const addNewVisible = ref(false);
const testValue = ref("");
const headerRef = ref();
const orderList = ref<any[]>([]);
const feedTableData = ref<any>([]);
const choiceList = ref<any[]>([]);
const dialogVisible = ref(false);
const historyTable = ref<any>([]);
const date = ref<any[]>([]);
const detailedTable = ref<any[]>([]);
const detailedHeight = ref(0);
const choiceID = ref("");
const detailedPageObj = ref({
  pageSize: 10000000,
  currentPage: 1,
  isShow: -1,
});

const findOrderForm = {
  workCenter: "",
  orderName: "",
  productName: "",
  lineName: "",
  Status: "",
  PlanStartTime: "",
  PlanEndTime: "",
};

interface formTS {
  MfgOrderName: string;
  PlannedStartDate: string;
  PlannedCompletionDate: string;
  Qty: number;
  ProductName: string;
  BD_ProjectNo: string | null;
  BD_ProductModel: string;
  ProductDesc: string;
  UOMName: string;
  OrderStatusName: string;
  OrderStatusDesc: string;
  MfgLineName: string;
  MfgLineDesc: string;
  WorkCenterName: string;
  wcDescription: string;
}

interface historyFormTS {
  ProductName: string;
  ProductDescription: string;
}

const form = ref<formTS>({
  MfgOrderName: "",
  PlannedStartDate: "",
  PlannedCompletionDate: "",
  Qty: 0,
  ProductName: "",
  BD_ProjectNo: null,
  BD_ProductModel: "",
  ProductDesc: "",
  UOMName: "",
  OrderStatusName: "",
  OrderStatusDesc: "",
  MfgLineName: "",
  MfgLineDesc: "",
  WorkCenterName: "",
  wcDescription: "",
});

const historyForm = ref<historyFormTS>({
  ProductName: "",
  ProductDescription: "",
});

// watch(

// );
onBeforeMount(() => { });

onMounted(() => {
  getHistory();
  getScreenHeight();
  // findOrderData();
  window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

//查询生产计划号信息
//   const findOrderData = () => {
//     findOrder(findOrderForm).then((res: any) => {
//       if (!res || res.content === null || res.content.length === 0) {
//         orderList.value = [];
//         return;
//       }
//       orderList.value = res.content;
//     });
//   };
//选中生产计划号
//   const orderChange = (data: any) => {
//     orderList.value.forEach((item: any) => {
//       if (item.MfgOrderName === data) {
//         form.value.MfgOrderName = item.MfgOrderName;
//         form.value.PlannedStartDate = item.PlannedStartDate;
//         form.value.PlannedCompletionDate = item.PlannedCompletionDate;
//         form.value.Qty = item.Qty;
//         form.value.ProductName = item.ProductName;
//         form.value.BD_ProjectNo = item.BD_ProjectNo;
//         form.value.BD_ProductModel = item.BD_ProductModel;
//         form.value.ProductDesc = item.ProductDesc;
//         form.value.UOMName = item.UOMName;
//         form.value.OrderStatusName = item.OrderStatusName;
//         form.value.OrderStatusDesc = item.OrderStatusDesc;
//         form.value.MfgLineName = item.MfgLineName;
//         form.value.MfgLineDesc = item.MfgLineDesc;
//         form.value.WorkCenterName = item.WorkCenterName;
//         form.value.wcDescription = item.wcDescription;
//         getFeedTableData(data);
//       }
//     });
//   };
//获取历史物料申请记录
const getHistory = () => {
  findERPBOM(historyForm.value).then((res: any) => {
    if (!res || res.content === null || res.content.length === 0) {
      historyTable.value = [];
      return;
    }
    historyTable.value = res.content;
  });
};

const flexColumnWidth = (label: any, prop: any) => {
  const arr = feedTableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
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
//选中物料框
const handleSelectionChange = (data: any) => {
  // choiceList.value = data.map((item: any) => {
  //   return {
  //     MaterialName: item.MaterialName,
  //     RequestQty: item.RequestQty ? item.RequestQty : "0",
  //     TotalQtyRequired: item.TotalQtyRequired,
  //     originalMaterialName: item.originalMaterialName,
  //     isMater: item.isMater
  //   };
  // });
  choiceList.value = data
    .filter((item: any) => item.RequestQty && item.RequestQty != 0)
    .map((item: any) => {
      return {
        MaterialName: item.MaterialName,
        RequestQty: item.RequestQty ? item.RequestQty : "0",
        TotalQtyRequired: item.TotalQtyRequired,
        originalMaterialName: item.originalMaterialName,
        isMater: item.isMater,
        UOMName: form.value.UOMName,
        MaterialDesc: item.MaterialDesc,
        OriginalMaterialName: item.OriginalMaterialName,
        SpecName: item.SpecName,
        ERPRouteName: item.ERPRouteName,
        QtyRequired: item.QtyRequired,
      };
    });
  console.log(choiceList.value);
};

//申请物料
//   const applyFor = () => {
//     if (choiceList.value.length === 0) {
//       ElNotification({
//         title: "请选择申请行",
//         // message: "取消操作",
//         type: "warning",
//       });
//       return;
//     }
//     if (form.value.MfgOrderName === "") {
//       return;
//     }
//     choiceList.value.forEach((element) => {
//       if (Number(element.RequestQty) > Number(element.TotalQtyRequired)) {
//         return;
//       }
//     });
//     SubmitMaterialRequest({
//       RequestType: "5",
//       MfgOrderName: form.value.MfgOrderName,
//       MaterialList: choiceList.value,
//       ProductName: form.value.ProductName,
//       ProductDesc: form.value.ProductDesc,
//       MfgOrderQty: form.value.Qty,
//       MfgLineName: form.value.MfgLineName,
//       userAccount: loginName,
//     }).then((res: any) => {
//       if (res.success) {
//         ElNotification({
//           title: res.msg,
//           // message: "取消操作",
//           type: "success",
//         });
//         // findOrderData();
//         getFeedTableData(form.value.MfgOrderName);
//       }
//     });
//   };

//   const dateChange = () => {
//     if (date.value !== null && date.value.length !== 0) {
//       historyForm.value.requestStartDate = date.value[0];
//       historyForm.value.requestEndDate = date.value[1];
//     } else {
//       historyForm.value.requestStartDate = "";
//       historyForm.value.requestEndDate = "";
//     }
//   };

const selectable = (row: any) => {
  if (row.isLoadQueue === 0 || !row.RequestQty) {
    return false;
  } else {
    return true;
  }
};

const rowClick = (val: any) => {
  if (choiceID.value !== val.ERPBOMId) {
    choiceID.value = val.ERPBOMId;
    findERPBOMMaterialList(val.ERPBOMId).then((res: any) => {
      if (!res || res.content === null || res.content.length === 0) {
        detailedTable.value = [];
        return;
      }
      detailedTable.value = res.content;
    });
  }
};

//判断请求数量是否大于需求量
const handleInput = (data: any) => {
  if (data.RequestQty !== undefined || data.RequestQty !== "") {
    const num = data.RequestQty.replace(/^0+|[^0-9]/g, "");
    data.RequestQty = num;
    if (num > data.TotalQtyRequired) {
      data.RequestQty = "";
      ElNotification({
        title: `不得超过需求量${data.TotalQtyRequired}`,
        // message: "取消操作",
        type: "error",
      });
    }
  }
};

const handleSizeChange = (val: any) => {
  currentPage.value = 1;
  pageSize.value = val;
};
const handleCurrentChange = (val: any) => {
  currentPage.value = val;
};

const pageObjHis = ref({
  pageSize: 300,
  currentPage: 1,
});

const columnData = reactive([
  {
    text: true,
    prop: "ERPBOMName",
    label: "组件物料编码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Description",
    label: "组件物料名称",
    width: "1100px",
    min: true,
    align: "left",
  },
  // {
  //   text: true,
  //   prop: "MfgOrderName",
  //   label: "生产计划号",
  //   width: "",
  //   min: true,
  //   align: "center",
  // },
  // {
  //   text: true,
  //   prop: "BD_ProductModel",
  //   label: "产品机型",
  //   width: "",
  //   min: true,
  //   align: "center",
  // },
  // {
  //   text: true,
  //   prop: "ProductName",
  //   label: "产品编码",
  //   width: "",
  //   min: true,
  //   align: "center",
  // },
  // {
  //   text: true,
  //   prop: "ProductDesc",
  //   label: "产品描述",
  //   width: "350",
  //   min: true,
  //   align: "1",
  // },
  // {
  //   text: true,
  //   prop: "Qty",
  //   label: "计划数量",
  //   width: "",
  //   min: true,
  //   align: "center",
  // },
  // {
  //   text: true,
  //   prop: "PlannedStartDate",
  //   label: "计划开始时间",
  //   width: "",
  //   min: true,
  //   align: "center",
  // },

  // {
  //   text: true,
  //   prop: "RequestDate",
  //   label: "申请时间",
  //   width: "",
  //   min: true,
  //   align: "center",
  // },
  // {
  //   text: true,
  //   prop: "BD_EmployeeName",
  //   label: "申请人",
  //   width: "",
  //   min: true,
  //   align: "center",
  // },
]);

const detailedData = reactive([
  {
    text: true,
    prop: "MaterialName",
    label: "子件物料编码",
    width: "",
    min: true,
    align: "left",
  },
  {
    text: true,
    prop: "MaterialDesc",
    label: "子件物料名称",
    width: "",
    min: true,
    align: "left",
  },
  {
    text: true,
    prop: "QtyRequired",
    label: "单位用量",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "AssemblySequence",
    label: "装配序号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "SpecName",
    label: "工序",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "EffectiveFromDate",
    label: "有效起始时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "EffectiveThruDate",
    label: "有效截止时间",
    width: "",
    min: true,
    align: "center",
  },
]);

const handleSizeChangeHis = (val: any) => {
  pageObjHis.value.currentPage = 1;
  pageObjHis.value.pageSize = val;
  console.log(val);

};

const handleCurrentChangeHis = (val: any) => {
  console.log(val);
  pageObjHis.value.currentPage = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 250 - headerRef.value.clientHeight;
    hisHeight.value =
      (window.innerHeight - 170 - headerRef.value.clientHeight) * 0.6;
    detailedHeight.value =
      (window.innerHeight - 170 - headerRef.value.clientHeight) * 0.4;
  });
};
</script>

<style lang="scss" scoped></style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
