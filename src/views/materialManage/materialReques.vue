<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div ref="headerRef">
        <el-form
          ref="formRef"
          class="form"
          :inline="true"
          size="small"
          label-width="auto"
        >
          <el-form-item label="申请日期" class="mb-2">
            <el-date-picker
              :shortcuts="shortcuts"
              v-model="date"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="到"
              size="small"
              style="width: 250px"
              @change="dateChange"
            />
          </el-form-item>
          <el-form-item label="生产计划号" class="mb-2">
            <el-input
              v-model="historyForm.MfgOrderName"
              placeholder=""
            ></el-input>
          </el-form-item>
          <el-form-item label="申请类型" class="mb-2">
            <el-select
              v-model="historyForm.RequestType"
              placeholder=""
              style="width: 150px"
              clearable
            >
              <el-option
                v-for="item in iApplyTypeList"
                :key="item.Value"
                :label="item.Text"
                :value="item.Value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="" class="mb-2">
            <el-button type="primary" @click="getHistory()">查询</el-button>
          </el-form-item>
          <el-form-item label="" class="mb-2">
            <el-button
              type="warning"
              @click="(dialogVisible = true), findOrderData()"
              >申请</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="table_container">
        <table-tem
          :show-index="true"
          size="small"
          :tableData="historyTable"
          :tableHeight="hisHeight"
          :columnData="columnData"
          :pageObj="pageObjHis"
          @handleSizeChange="handleSizeChangeHis"
          @handleCurrentChange="handleCurrentChangeHis"
          @rowClick="rowClick"
        >
        </table-tem>
      </div>
      <div class="w-full">
        <table-tem
          size="small"
          :show-index="true"
          :tableData="detailedTable"
          :tableHeight="detailedHeight"
          :columnData="detailedData"
          :pageObj="detailedPageObj"
        >
        </table-tem>
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      width="85%"
      title="物料申请"
      align-center
      @close="close()"
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
            <!-- <div>
              </div> -->
            <el-form-item label="生产计划号">
              <!-- <el-select
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
              </el-select> -->
              <!-- <el-select-v2 v-model="form.MfgOrderName" :options="orderList" filterable
              :props="orderProps" style="width: 180px"  @change="orderChange"/> -->
              <el-input
                v-model="form.MfgOrderName"
                class="input-with-select"
                @keyup.enter.native="orderChange(form.MfgOrderName)"
                style="width: 152px"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="产品机型">
              <el-input
                v-model="form.BD_ProductModel"
                style="width: 152px"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="产品编码">
              <el-input
                v-model="form.ProductName"
                style="width: 152px"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="计划数量">
              <el-input
                v-model="form.Qty"
                style="width: 152px"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="产线">
              <el-input
                v-model="form.MfgLineDesc"
                style="width: 152px"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="计划开始时间">
              <el-input
                v-model="form.PlannedCompletionDate"
                style="width: 152px"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="工单">
              <el-input
                v-model="form.ERPOrder"
                style="width: 152px"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="申请类型">
              <el-select v-model="applyType" style="width: 152px">
                <el-option
                  v-for="item in applyTypeList"
                  :key="item.Value"
                  :label="item.Text"
                  :value="item.Value"
                />
              </el-select>
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
          <div class="flex justify-end">
            <!-- <el-input v-model.trim="searchText" size="small" style="width: 250px;" >
              <template #append>
                <el-button icon="Search" />
              </template>
</el-input> -->
            <el-form
              @submit.native.prevent
              ref="formRef"
              class="form flex items-start"
              :inline="true"
              size="small"
              label-width="85px"
            >
              <el-form-item
                label="查询编码"
                class="mb-0"
                style="margin-right: 0"
              >
                <el-input
                  v-model.trim="searchText"
                  size="small"
                  style="width: 250px"
                  @keyup.enter.native="filterFeedTableData"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <!-- <el-table
            :data="filterTableData"
            size="small"
            stripe
            border
            fit
            :tooltip-effect="'dark'"
            :height="400"
            ref="tableRef"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
              :selectable="selectable"
            />
            <el-table-column
              type="index"
              label="序号"
              width="50"
              align="center"
              fixed
            />
            <el-table-column
              prop="MaterialName"
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
              width="100"
              :min-width="100"
              align="center"
            >
              <template #default="scope">
                <span v-if="scope.row.isMater === 1">是</span>
                <span v-if="scope.row.isMater === 0"
                  >否{{ `(${scope.row.originalMaterialName})` }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="SpecName"
              label="工序编码"
              align="center"
              :min-width="flexColumnWidth('使用工序', 'SpecDesc')"
            >
            </el-table-column>
            <el-table-column
              prop="SpecDesc"
              label="工序名称"
              align="center"
              :min-width="flexColumnWidth('使用工序', 'SpecDesc')"
            >
            </el-table-column>
            <el-table-column
              prop="UOMName"
              align="center"
              label="单位"
              flexible
            >
            </el-table-column>
            <el-table-column
              prop="QtyRequired"
              align="center"
              label="单件用量"
              :min-width="flexColumnWidth('单件用量', 'QtyRequired')"
            >
            </el-table-column>
            <el-table-column
              prop="TotalQtyRequired"
              align="center"
              label="需求量"
              :min-width="flexColumnWidth('需求量', 'TotalQtyRequired')"
            >
            </el-table-column>
            <el-table-column prop="RequestQty" align="center" label="请求数量">
              <template #default="scope">
                <el-input
                  v-model="scope.row.RequestQty"
                  @input="handleInput(scope.row)"
                >
                </el-input>
              </template>
            </el-table-column>
          </el-table> -->
          <vxe-table
            border
            height="400"
            size="small"
            ref="tableApplyRef"
            :data="filterTableData"
            :checkbox-config="checkboxConfig"
            :scroll-y="{ enabled: true, gt: 0 }"
          >
            <vxe-column type="checkbox" title="" width="40"></vxe-column>
            <vxe-column type="seq" width="60"></vxe-column>
            <vxe-column field="MaterialName" title="物料编码"> </vxe-column>
            <vxe-column field="MaterialDesc" title="物料描述"  show-header-overflow show-overflow="title" show-footer-overflow> </vxe-column>
            <vxe-column field="isMater" title="主料" align="center">
              <template #default="{ row, column, rowIndex, columnIndex }">
                <span v-if="row.isMater === 1">是</span>
                <span v-if="row.isMater === 0"
                  >否{{ `(${row.originalMaterialName})` }}</span
                >
              </template>
            </vxe-column>
            <vxe-column field="SpecName" title="工序编码" align="center">
            </vxe-column>
            <vxe-column field="SpecDesc" title="工序名称" align="center">
            </vxe-column>
            <vxe-column field="UOMName" title="单位" align="center">
            </vxe-column>
            <vxe-column field="QtyRequired" title="单件用量" align="center">
            </vxe-column>
            <vxe-column field="TotalQtyRequired" title="需求量" align="center">
            </vxe-column>
            <vxe-column
              align="center"
              field="RequestQty"
              title="请求数量"
              min-width="60"
            >
              <template #default="{ row, column, rowIndex, columnIndex }">
                <el-input v-model="row.RequestQty" @input="handleInput(row)">
                </el-input>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="" @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="applyFor">申请</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElNotification } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import { useUserStoreWithOut } from "@/stores/modules/user";
import {
  findOrder,
  QueryOrderMaterialRequired,
  SubmitMaterialRequest,
  QueryMaterialRequest,
  QueryMaterialRequestDetail,
  GetComboBoxList,
} from "@/api/operate";
import { cloneDeep } from "lodash-es";
import {
  ref,
  reactive,
  watch,
  computed,
  nextTick,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import { shortcuts } from "@/utils/dataMenu";
import type { VxeTablePropTypes } from "vxe-table";
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
const choiceId = ref("");
const dialogVisible = ref(false);
const historyTable = ref<any>([]);
const date = ref<any[]>([]);
const detailedTable = ref<any[]>([]);
const detailedHeight = ref(0);
const applyType = ref("5");
const applyTypeList = ref<any[]>();
const iApplyTypeList = ref<any[]>();
const tableApplyRef = ref();
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
  ERPOrder: string;
  RequestTypeName: string;
}

interface historyFormTS {
  RequestType: string;
  MfgOrderName: string;
  requestStartDate: string;
  requestEndDate: string;
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
  ERPOrder: "",
  RequestTypeName: "",
});

const historyForm = ref<historyFormTS>({
  RequestType: "",
  MfgOrderName: "",
  requestStartDate: "",
  requestEndDate: "",
});
const tableRef = ref();
const orderProps = ref({
  label: "MfgOrderName",
  value: "MfgOrderName",
});
const searchText = ref("");
const filterTableData = ref([]);
// const filterTableData=computed(()=>{
//   if(searchText.value==""){
//     return feedTableData.value
//   }
//   return feedTableData.value.filter((f:any)=>(f.MaterialName.toLowerCase()).includes(searchText.value.toLowerCase()))
// })
// watch(

// );
onBeforeMount(() => {});

onMounted(() => {
  const today = new Date();
  const dateBefore = new Date(today);
  dateBefore.setDate(today.getDate() - 6); // 减去天数
  // 转换为YYYY-MM-DD格式
  const formattedDate = `${dateBefore.getFullYear()}-${(
    "0" +
    (dateBefore.getMonth() + 1)
  ).slice(-2)}-${("0" + dateBefore.getDate()).slice(-2)}`;
  const formattedTodayDate = `${today.getFullYear()}-${(
    "0" +
    (today.getMonth() + 1)
  ).slice(-2)}-${("0" + today.getDate()).slice(-2)}`;
  // console.log(formattedDate, formattedTodayDate);
  historyForm.value.requestStartDate = formattedDate;
  historyForm.value.requestEndDate = formattedTodayDate;
  date.value = [formattedDate, formattedTodayDate];
  getHistory();
  getTypeList();
  getScreenHeight();
  findOrderData();
  window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});
//查询生产计划号信息
const findOrderData = () => {
  findOrder(findOrderForm).then((res: any) => {
    if (!res || res.content === null || res.content.length === 0) {
      orderList.value = [];
      return;
    }
    orderList.value = res.content;
  });
};
//选中生产计划号
const orderChange = (data: any) => {
  if (!orderList.value.some((obj) => obj.MfgOrderName === data)) {
    ElNotification({
      title: "提示信息",
      message: "未找到此生产计划号",
      type: "warning",
    });
    return;
  }
  orderList.value.forEach((item: any) => {
    if (item.MfgOrderName === form.value.MfgOrderName) {
      form.value.MfgOrderName = item.MfgOrderName;
      form.value.PlannedStartDate = item.PlannedStartDate;
      form.value.PlannedCompletionDate = item.PlannedCompletionDate;
      form.value.Qty = item.Qty;
      form.value.ProductName = item.ProductName;
      form.value.BD_ProjectNo = item.BD_ProjectNo;
      form.value.BD_ProductModel = item.BD_ProductModel;
      form.value.ProductDesc = item.ProductDesc;
      form.value.UOMName = item.UOMName;
      form.value.OrderStatusName = item.OrderStatusName;
      form.value.OrderStatusDesc = item.OrderStatusDesc;
      form.value.MfgLineName = item.MfgLineName;
      form.value.MfgLineDesc = item.MfgLineDesc;
      form.value.WorkCenterName = item.WorkCenterName;
      form.value.ERPOrder = item.ERPOrder;
      form.value.RequestTypeName = item.RequestTypeName;
      getFeedTableData(data);
    }
  });
};
//获取历史物料申请记录
const getHistory = () => {
  QueryMaterialRequest(historyForm.value).then((res: any) => {
    if (!res || res.content === null || res.content.length === 0) {
      historyTable.value = [];
      return;
    }
    historyTable.value = res.content;
  });
};
//根据生产计划号获取物料信息
const getFeedTableData = (order: any) => {
  QueryOrderMaterialRequired({
    MfgOrder: order,
  }).then((res: any) => {
    // console.log(OrganData(res.content));
    if (res.success) {
      if (!res || res.content === null || res.content.length === 0) {
        feedTableData.value = [];
        return;
      }
      let data = cloneDeep(feedOrganData(res.content));
      // console.log(data);

      feedTableData.value = cloneDeep(res.content);
      filterTableData.value = cloneDeep(res.content);
      // OrganData(res.content)
    }
  });
};
//处理父子结构
const feedOrganData = (organizations: any) => {
  const organizationMap = new Map();
  organizations.forEach((org: any) => {
    organizationMap.set(org.MaterialName, { ...org, children: [] });
  });
  organizations.forEach((org: any) => {
    if (org.originalMaterialName !== org.MaterialName) {
      const parentOrg = organizationMap.get(org.originalMaterialName);
      if (parentOrg) {
        parentOrg.children.push(organizationMap.get(org.MaterialName));
      }
    }
  });
  return Array.from(organizationMap.values()).filter(
    (org) => org.originalMaterialName !== org.MaterialName
  );
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

//根据名称获取配置值
const getTypeList = () => {
  GetComboBoxList("RequestType").then((res: any) => {
    iApplyTypeList.value = res.content;
    applyTypeList.value = [res.content[1], res.content[2]];
  });
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
        ERPRouteName: item.BD_ERPSpecName,
        QtyRequired: item.QtyRequired,
      };
    });
  console.log(choiceList.value, data);
};
//申请物料
const applyFor = () => {
  choiceList.value = tableApplyRef.value.getCheckboxRecords()
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
        ERPRouteName: item.BD_ERPSpecName,
        QtyRequired: item.QtyRequired,
      };
    });
  if (choiceList.value.length === 0) {
    ElNotification({
      title: "请选择申请行",
      // message: "取消操作",
      type: "warning",
    });
    return;
  }
  if (form.value.MfgOrderName === "") {
    return;
  }
  choiceList.value.forEach((element) => {
    if (Number(element.RequestQty) > Number(element.TotalQtyRequired)) {
      return;
    }
  });
  SubmitMaterialRequest({
    RequestType: applyType.value,
    MfgOrderName: form.value.MfgOrderName,
    MaterialList: choiceList.value,
    ProductName: form.value.ProductName,
    ProductDesc: form.value.ProductDesc,
    MfgOrderQty: form.value.Qty,
    MfgLineName: form.value.MfgLineName,
    userAccount: loginName,
    ERPOrder: form.value.ERPOrder,
  }).then((res: any) => {
    if (res.success) {
      ElNotification({
        title: res.msg,
        // message: "取消操作",
        type: "success",
      });
      // findOrderData();
      // getFeedTableData(form.value.MfgOrderName);
      close();
      getHistory();
      dialogVisible.value = false;
    }
  });
};

//搜索编码
const filterFeedTableData = () => {
  if (searchText.value == "") {
    filterTableData.value = feedTableData.value;
    return;
  }
  filterTableData.value = feedTableData.value.filter((f: any) =>
    f.MaterialName.toLowerCase().includes(searchText.value.toLowerCase())
  );
};

const dateChange = () => {
  if (date.value !== null && date.value.length !== 0) {
    historyForm.value.requestStartDate = date.value[0];
    historyForm.value.requestEndDate = date.value[1];
  } else {
    historyForm.value.requestStartDate = "";
    historyForm.value.requestEndDate = "";
  }
};

const selectable = (row: any) => {
  if (!row.RequestQty) {
    return false;
  } else {
    return true;
  }
};

const rowClick = (val: any) => {
  if (choiceId.value !== val.isMaterialRequestTxnHistoryId) {
    QueryMaterialRequestDetail(val.isMaterialRequestTxnHistoryId).then(
      (res: any) => {
        if (!res || res.content === null || res.content.length === 0) {
          detailedTable.value = [];
          return;
        }
        detailedTable.value = res.content;
      }
    );
    choiceId.value = val.isMaterialRequestTxnHistoryId;
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
  if (data.RequestQty == "") {
    tableRef.value.clearSelection();
  }
};

const close = () => {
  feedTableData.value = [];
  filterTableData.value = [];
  form.value = {
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
    ERPOrder: "",
    RequestTypeName: "",
  };
};

const checkboxConfig = reactive<VxeTablePropTypes.CheckboxConfig<any>>({
  labelField: "name",
  visibleMethod({ row }) {
    if (!row.RequestQty) {
      return false;
    } else {
      return true;
    }
  },
});

const handleSizeChange = (val: any) => {
  currentPage.value = 1;
  pageSize.value = val;
};
const handleCurrentChange = (val: any) => {
  currentPage.value = val;
};

const pageObjHis = ref({
  pageSize: 100,
  currentPage: 1,
});

const columnData = reactive([
  {
    text: true,
    prop: "BD_RequestNo",
    label: "单号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "RequestTypeName",
    label: "申请类型",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "MfgOrderName",
    label: "生产计划号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "BD_ProductModel",
    label: "产品机型",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ProductName",
    label: "产品编码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ProductDesc",
    label: "产品描述",
    width: "350",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "计划数量",
    width: "",
    min: true,
    align: "left",
  },
  {
    text: true,
    prop: "PlannedStartDate",
    label: "计划开始时间",
    width: "",
    min: true,
    align: "center",
  },

  {
    text: true,
    prop: "RequestDate",
    label: "申请时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "BD_EmployeeName",
    label: "申请人",
    width: "",
    min: true,
    align: "center",
  },
]);

const detailedData = reactive([
  {
    text: true,
    prop: "ProductName",
    label: "物料编码",
    width: "",
    min: true,
    align: "left",
  },
  {
    text: true,
    prop: "Description",
    label: "物料描述",
    width: "",
    min: true,
    align: "left",
  },
  {
    text: true,
    prop: "UOMName",
    label: "单位",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "QtyRequested",
    label: "数量",
    width: "",
    min: true,
    align: "center",
  },
]);

const handleSizeChangeHis = (val: any) => {
  pageObjHis.value.currentPage = 1;
  pageObjHis.value.pageSize = val;
};

const handleCurrentChangeHis = (val: any) => {
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
