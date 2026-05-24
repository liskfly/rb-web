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
              v-model="historyForm.QualityIsGood"
              placeholder=""
              style="width: 150px"
              clearable
            >
              <el-option
                v-for="item in returnTypeList"
                :key="item.Value"
                :label="item.Text"
                :value="item.Value"
              />
            </el-select>
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
        <!-- <table-tem
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
          </table-tem> -->
        <el-table
          :data="
            historyTable.slice(
              (pageObjHis.currentPage - 1) * pageObjHis.pageSize,
              pageObjHis.currentPage * pageObjHis.pageSize
            )
          "
          size="small"
          stripe
          border
          fit
          :tooltip-effect="'dark'"
          :height="hisHeight"
          row-key="MaterialName"
          @selection-change="handleSelectionChange"
          @rowClick="rowClick"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          />
          <el-table-column
            prop="ApplyNo"
            label="单号"
            :min-width="flexColumnWidthHis('退料单号', 'ApplyNo')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="QualityIsGood"
            label="申请类型"
            :min-width="flexColumnWidthHis('申请类型型', 'QualityIsGood')"
            align="center"
          >
            <template #default="scope">
              <div>{{ returnTypeText(scope.row.QualityIsGood) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="MfgOrderName"
            label="生产计划号"
            :min-width="flexColumnWidthHis('生产计划号', 'MfgOrderName')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="BD_ProductModel"
            label="产品机型"
            :min-width="flexColumnWidthHis('产品机型', 'BD_ProductModel')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="ChangeOrderName"
            label="目标计划号"
            :min-width="flexColumnWidthHis('目标计划号', 'ChangeOrderName')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="ProductName"
            label="产品编码"
            :min-width="flexColumnWidthHis('产品编码', 'ProductName')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="ProductDesc"
            label="产品描述"
            width="350"
            show-overflow-tooltip
            :min-width="flexColumnWidthHis('产品描述', 'ProductDesc')"
          ></el-table-column>
          <!-- <el-table-column
              prop="OrderStatusDesc"
              label="生产计划号状态"
              :min-width="flexColumnWidthHis('生产计划号状态', 'OrderStatusDesc')"
            ></el-table-column> -->
          <el-table-column
            prop="Qty"
            label="计划数量"
            :min-width="flexColumnWidthHis('计划数量', 'Qty')"
          ></el-table-column>
          <el-table-column
            prop="PlannedStartDate"
            label="计划开始时间"
            :min-width="flexColumnWidthHis('计划开始时间', 'PlannedStartDate')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="ApplyTime"
            label="申请时间"
            :min-width="flexColumnWidthHis('申请时间', 'ApplyTime')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="Applicant"
            label="申请人"
            :min-width="flexColumnWidthHis('申请人', 'Applicant')"
            align="center"
          ></el-table-column>
        </el-table>
        <div class="mt-2 mb-2">
          <el-pagination
            :size="'default'"
            background
            @size-change="handleSizeChangeHis"
            @current-change="handleCurrentChangeHis"
            :pager-count="5"
            :current-page="pageObjHis.currentPage"
            :page-size="pageObjHis.pageSize"
            :page-sizes="[30, 50, 100, 200, 300]"
            layout="total,sizes, prev, pager, next"
            :total="historyTable.length"
          >
          </el-pagination>
        </div>
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
      width="80%"
      title="退料转单"
      align-center
      @close="close"
    >
      <div class="w-full">
        <div ref="headerRef">
          <el-form
            ref="formRef"
            class="form flex items-start"
            :inline="true"
            size="small"
            label-width="85px"
          >
            <el-form-item label="当前单号">
              <el-input
                v-model.trim="form.MfgOrderName"
                class="input-with-select"
                @keyup.enter.native="orderChange(form.MfgOrderName)"
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
            <!-- <br /> -->
            <el-form-item label="产品描述">
              <el-input
                style="width: 240px"
                type="textarea"
                :rows="2"
                v-model="form.ProductDesc"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
          </el-form>
          <el-form
            ref="tranformRef"
            class="form flex items-start"
            :inline="true"
            size="small"
            label-width="85px"
          >
            <el-form-item label="转单单号">
              <el-input
                v-model.trim="transferForm.MfgOrderName"
                class="input-with-select"
                @keyup.enter.native="transferChange(transferForm.MfgOrderName)"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="产品机型">
              <el-input
                v-model="transferForm.BD_ProductModel"
                style="width: 152px"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="产品编码">
              <el-input
                v-model="transferForm.ProductName"
                style="width: 152px"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <!-- <br /> -->
            <el-form-item label="产品描述">
              <el-input
                style="width: 240px"
                type="textarea"
                :rows="2"
                v-model="transferForm.ProductDesc"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="table_container">
          <div class="flex justify-between items-end">
            <el-button type="primary" class="mr-8" @click="getFeedTableData"
              >查询转单列表</el-button
            >
            <!-- <el-input
              v-model.trim="searchText"
              size="small"
              style="width: 250px"
            >
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
          <el-table
            ref="table"
            :data="filterTableData"
            size="small"
            border
            fit
            :tooltip-effect="'dark'"
            :height="400"
            @selection-change="handleSelectionChange"
            :row-class-name="tableRowClassName"
          >
            <!-- <el-table-column
              type="selection"
              width="55"
              :selectable="selectable"
              :min-width="flexColumnWidth('选择', 'CompID')"
            /> -->
            <el-table-column
              type="index"
              label="序号"
              width="50"
              align="center"
            />
            <el-table-column
              prop="ContainerName"
              label="物料条码"
              :min-width="flexColumnWidth('物料条码', 'CompID')"
            >
            </el-table-column>
            <el-table-column
              prop="MaterialName"
              label="物料编码"
              :min-width="flexColumnWidth('物料编码', 'CompName')"
            >
            </el-table-column>

            <!-- <el-table-column
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
                </el-table-column> -->
            <el-table-column
              prop="Amount"
              label="初始数量"
              align="center"
              :min-width="flexColumnWidth('初始数量', 'Amount')"
            >
            </el-table-column>
            <el-table-column
              prop="Qty"
              label="可退数量"
              align="center"
              :min-width="flexColumnWidth('可退数量', 'Qty')"
            >
            </el-table-column>
            <!-- <el-table-column
                  prop="isLoadQueue"
                  align="center"
                  label="允许上料"
                  :min-width="flexColumnWidth('允许上料：（是否）', 'isLoadoueue')"
                >
                  <template #default="scope">
                    <span v-if="scope.row.isLoadQueue === 1">是</span>
                    <span v-if="scope.row.isLoadQueue === 0">否</span>
                  </template>
                </el-table-column> -->
            <!-- <el-table-column
              v-if="returnType === '1'"
              prop="Qty"
              align="center"
              label="请求退料数量"
              :min-width="flexColumnWidth('请求数量', 'Qty')"
            >
            </el-table-column> -->
            <!-- <el-table-column
              prop="RequestQty"
              align="center"
              label="请求退料数量"
              v-if="returnType !== '1'"
              :min-width="flexColumnWidth('请求数量', 'Qty')"
            >
              <template #default="scope">
                <el-input
                  style="width: 100%"
                  :disabled="scope.row.MaterialQueue ? true : false"
                  v-model="scope.row.RequestQty"
                  @input="handleInput(scope.row)"
                >
                </el-input>
              </template>
            </el-table-column> -->
            <el-table-column
              align="center"
              label="状态"
              :min-width="flexColumnWidth('状态状态', 'Qty')"
            >
              <template #default="scope">
                <div>
                  {{ scope.row.MaterialQueue ? "不可转产" : "可转产" }}
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="QualityIsGood" align="center" label="是否良品"
                :min-width="flexColumnWidth('是否良品是否良品', 'QualityIsGood')">
                <template #default="scope">
                  <el-select
                    v-model="scope.row.QualityIsGood"
                    placeholder="Select"
                    size="large"
                    style="width: 150px"
                  >
                    <el-option
                      v-for="item in [{label:'良品',value:1},{label:'不良品',value:2},{label:'未知',value:0},]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column> -->
          </el-table>
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
import { shortcuts } from "@/utils/dataMenu";
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
import {
  QueryMaterialReturnApply,
  QueryMaterialReturn,
  QueryMaterialReturnDetail,
  OrderGoodMaterials,
  QueryMaterialReturnApplyDetail,
  findOrder,
  GetComboBoxList,
  QueryChangeOrderMaterialRequired,
  ApplyChangeOrderMaterialRequired,
} from "@/api/operate";
import { cloneDeep } from "lodash-es";
import {
  ref,
  reactive,
  watch,
  nextTick,
  computed,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
const tableData = ref<any>([]);
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const tableData1 = ref<any>([]);
const hisHeight = ref(0);
const userStore = useUserStoreWithOut();
const loginName = userStore.getUserInfo;
const selectOrder = ref("");
const selectType = ref("");
const transSelectOrder = ref("");
const transSelectType = ref("");
const headerRef = ref();
const orderList = ref<any[]>([]);
const feedTableData = ref<any>([]);
const choiceList = ref<any[]>([]);
const dialogVisible = ref(false);
const historyTable = ref<any>([]);
const date = ref<any[]>([]);
const detailedTable = ref<any[]>([]);
const detailedHeight = ref(0);
const choiceId = ref("");
const returnType = ref("1");
const returnTypeList = ref<any[]>([]);
const iReturnTypeList = ref<any[]>([]);
const tranformRef = ref();
const table = ref();
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
  ERPOrder: string;
}

interface historyFormTS {
  MfgOrderName: string;
  requestStartDate: string;
  requestEndDate: string;
  QualityIsGood: string;
  OperationType: string;
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
  ERPOrder: "",
});

const transferForm = ref({
  MfgOrderName: "",
  BD_ProductModel: "",
  ProductName: "",
  ProductDesc: "",
});

const historyForm = ref<historyFormTS>({
  MfgOrderName: "",
  requestStartDate: "",
  requestEndDate: "",
  QualityIsGood: "",
  OperationType: "C",
});
const orderProps = ref({
  label: "MfgOrderName",
  value: "MfgOrderName",
});
const searchText = ref("");
const filterTableData = ref([]);
// const filterTableData = computed(() => {
//   if (searchText.value == "") {
//     return feedTableData.value;
//   }
//   return feedTableData.value.filter((f: any) =>
//     f.CompName.toLowerCase().includes(searchText.value.toLowerCase())
//   );
// });
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
  console.log(formattedDate, formattedTodayDate);
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
    wcDescription: "",
    ERPOrder: "",
  };
  feedTableData.value = [];
  findOrder({}).then((res: any) => {
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
  if (form.value.MfgOrderName === transferForm.value.MfgOrderName) {
    form.value.MfgOrderName = "";
    form.value.PlannedStartDate = "";
    form.value.PlannedCompletionDate = "";
    form.value.Qty = 0;
    form.value.ProductName = "";
    form.value.BD_ProjectNo = "";
    form.value.BD_ProductModel = "";
    form.value.ProductDesc = "";
    form.value.UOMName = "";
    form.value.OrderStatusName = "";
    form.value.OrderStatusDesc = "";
    form.value.MfgLineName = "";
    form.value.MfgLineDesc = "";
    form.value.WorkCenterName = "";
    form.value.wcDescription = "";
    form.value.ERPOrder = "";
    selectType.value = "";
    ElNotification({
      title: "提示信息",
      message: "不能选择同一个单号",
      type: "warning",
    });
    return;
  }
  orderList.value.forEach((item: any) => {
    if (item.MfgOrderName === data) {
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
      form.value.wcDescription = item.wcDescription;
      form.value.ERPOrder = item.ERPOrder;
      selectType.value = item.OrderTypeName;
      // getFeedTableData(data, item.OrderTypeName);
    }
  });
  selectOrder.value = data;
};

//选中转单单号
const transferChange = (data: any) => {
  if (!orderList.value.some((obj) => obj.MfgOrderName === data)) {
    ElNotification({
      title: "提示信息",
      message: "未找到此生产计划号",
      type: "warning",
    });
    return;
  }
  if (form.value.MfgOrderName === transferForm.value.MfgOrderName) {
    transferForm.value.MfgOrderName = "";
    transferForm.value.ProductName = "";
    transferForm.value.BD_ProductModel = "";
    transferForm.value.ProductDesc = "";
    transSelectType.value = "";
    ElNotification({
      title: "提示信息",
      message: "不能选择同一个单号",
      type: "warning",
    });
    return;
  }
  orderList.value.forEach((item: any) => {
    if (item.MfgOrderName === data) {
      transferForm.value.MfgOrderName = item.MfgOrderName;
      transferForm.value.ProductName = item.ProductName;
      transferForm.value.BD_ProductModel = item.BD_ProductModel;
      transferForm.value.ProductDesc = item.ProductDesc;
      transSelectType.value = item.OrderTypeName;
      // getFeedTableData(data, item.OrderTypeName);
    }
  });
  transSelectOrder.value = data;
};

//根据名称获取配置值
const getTypeList = () => {
  GetComboBoxList("ConvertType").then((res: any) => {
    iReturnTypeList.value = res.content;
    returnTypeList.value = res.content;
  });
};

//根据名称值获取名称
const returnTypeText = (data: any) => {
  let text = "";
  returnTypeList.value.forEach((item: any) => {
    if (item.Value === data) {
      text = item.Text;
    }
  });
  return text;
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

//获取历史物料退料申请记录
const getHistory = () => {
  QueryMaterialReturn(historyForm.value).then((res: any) => {
    if (!res || res.content === null || res.content.length === 0) {
      historyTable.value = [];
      return;
    }
    historyTable.value = res.content;
  });
};
//根据生产计划号获取物料信息
const getFeedTableData = () => {
  if (transSelectType.value === "" || selectType.value === "") {
    ElNotification({
      title: "提示信息",
      message: "请先选择单号",
      type: "warning",
    });
    return;
  }
  QueryChangeOrderMaterialRequired({
    FromMfgOrder: selectOrder.value,
    FromOrderType: selectType.value,
    ToMfgOrder: transSelectOrder.value,
    ToOrderType: transSelectType.value,
  }).then((res: any) => {
    // console.log(OrganData(res.content));
    if (res.success) {
      if (!res || res.content === null || res.content.length === 0) {
        feedTableData.value = [];
        return;
      }
      // let data = cloneDeep(feedOrganData(res.content));
      // console.log(data);
      feedTableData.value = res.content;
      filterTableData.value = res.content;
      // feedTableData.value = res.content.map((item:any) => {
      //   return {
      //     ...item,
      //     QualityIsGood:1
      //   }
      // });

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
    (org) => org.originalMaterialName == org.MaterialName
  );
};

//退料页面表格宽度分配
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

//退料查询页面表格宽度分配
const flexColumnWidthHis = (label: any, prop: any) => {
  const arr = historyTable?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
};

const getMaxLengthHis = (arr: any) => {
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

const getTextWidthHis = (str: string) => {
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
    .filter((item: any) => item.Qty && item.Qty != 0)
    .map((item: any) => {
      if (returnType.value === "1") {
        return {
          mfgOrder: selectOrder.value,
          changemfgOrder: transSelectOrder.value,
          ContainerName: item.ContainerName,
          MaterialName: item.MaterialName,
          Amount: item.Amount,
          Qty: item.Qty,
          MaterialQueue: item.MaterialQueue,
          EmployeeName: loginName,
        };
      } else {
        return {
          ContainerName: item.ContainerName,
          MaterialName: item.MaterialName,
          Amount: item.Amount,
          Qty: item.Qty,
          MaterialQueue: item.MaterialQueue,
          EmployeeName: loginName,
        };
      }
    });
  console.log(choiceList.value);
};
//申请退料
const applyFor = () => {
  if (choiceList.value.length === 0) {
    ElNotification({
      title: "提示信息",
      message: "请选择退料行",
      type: "warning",
    });
    return;
  }
  let pass = false;
  feedTableData.value.forEach((element: any) => {
    if (element.MaterialQueue) {
      ElNotification({
        title: "提示信息",
        message: `物料条码（${element.CompID}）已上料 不可传产`,
        type: "warning",
      });
      pass = true;
    }
  });
  if (pass) {
    return;
  }
  // if (form.value.CompId === "") {
  //   return;
  // }
  // choiceList.value.forEach((element) => {
  //   if (Number(element.RequestQty) > Number(element.TotalQtyRequired)) {
  //     return;
  //   }
  // });
  ApplyChangeOrderMaterialRequired(choiceList.value).then((res: any) => {
    if (res && res.success) {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
      // findOrderData();
      // getFeedTableData();
      getHistory();
      feedTableData.value = [];
      filterTableData.value = [];
      dialogVisible.value = false;
    }
  });
};

const close = () => {
  feedTableData.value = [];
  filterTableData.value = [];
  transferForm.value.MfgOrderName = "";
  transferForm.value.ProductName = "";
  transferForm.value.BD_ProductModel = "";
  transferForm.value.ProductDesc = "";
  transSelectType.value = "";
  searchText.value = "";
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
  console.log(row.MaterialQueue, row.MaterialQueue ? true : false);

  if (row.MaterialQueue) {
    return false;
  } else if (returnType.value === "1") {
    return true;
  } else if (row.Qty === 0 || !row.RequestQty) {
    return false;
  } else {
    return true;
  }
};

const rowClick = (val: any) => {
  if (choiceId.value !== val.MaterialReturnHistoryId) {
    QueryMaterialReturnDetail(val.MaterialReturnHistoryId).then((res: any) => {
      if (!res || res.content === null || res.content.length === 0) {
        detailedTable.value = [];
        return;
      }
      detailedTable.value = res.content;
    });
    choiceId.value = val.MaterialReturnHistoryId;
  }
};

//判断请求数量是否大于需求量
const handleInput = (data: any) => {
  if (data.RequestQty !== undefined || data.RequestQty !== "") {
    const num = data.RequestQty.replace(/^0+|[^0-9]/g, "");
    data.RequestQty = num;
    if (num > data.Qty) {
      data.RequestQty = "";
      ElNotification({
        title: "提示信息",
        message: `不得超过可退数量${data.Qty}`,
        type: "error",
      });
    }
  }
  if (data.RequestQty == "") {
    table.value.clearSelection();
  }
};

const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: any;
  rowIndex: number;
}) => {
  // 在这里判断行数据是否符合条件
  //   console.log(row.MaterialQueue ? true : false);
  if (row.MaterialQueue) {
    return "has-material-row";
  } else {
  }
  return "";
};

//改变
const typeChange = () => {
  table.value.clearSelection();
};

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
  // {
  //   text: true,
  //   prop: "BD_RequestNo",
  //   label: "申请编号",
  //   width: "",
  //   min: true,
  //   align: "center",
  // },
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
    prop: "QualityIsGood",
    label: "申请类型",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ApplyNo",
    label: "退料单号",
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
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "OrderStatusDesc",
    label: "生产计划号状态",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Qty",
    label: "计划数量",
    width: "",
    min: true,
    align: "center",
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
    prop: "ApplyTime",
    label: "申请时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Applicant",
    label: "申请人",
    width: "",
    min: true,
    align: "center",
  },

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
    prop: "ContainerName",
    label: "物料批次条码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "materialName",
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
    prop: "Qty",
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

.el-table .has-material-row {
  --el-table-tr-bg-color: rgb(255 243 243);
}

/* ::v-deep .is-disabled .el-checkbox__inner {
    background-color:rgb(216, 216, 216);
  } */
</style>
