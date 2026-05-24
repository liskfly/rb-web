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
            :min-width="flexColumnWidthHis('单号', 'ApplyNo')"
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
            prop="QualityReason"
            label="退料原因"
            :min-width="flexColumnWidthHis('退料原因', 'QualityReason')"
            align="center"
          >
            <template #default="scope">
              <div>{{ returnTypeReason(scope.row.QualityReason) }}</div>
            </template>
          </el-table-column>
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
      title="退料申请"
      align-center
      :close="close()"
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
              <!-- <el-select
                v-model="form.MfgOrderName"
                placeholder=""
                filterable
                style="width: 152.4px"
                @change="orderChange"
              >
                <el-option
                  v-for="item in orderList"
                  :key="item.MfgOrderName"
                  :label="item.MfgOrderName"
                  :value="item.MfgOrderName"
                />
              </el-select>  -->
              <el-input
                v-model="form.MfgOrderName"
                class="input-with-select"
                @keyup.enter.native="orderChange(form.MfgOrderName)"
              >
              </el-input>
              <!-- <el-select-v2 v-model="form.MfgOrderName" :options="orderList" filterable
                :props="orderProps" style="width: 180px"  @change="orderChange"/> -->
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
            <el-form-item label="申请类型">
              <el-select
                v-model="returnType"
                placeholder="Select"
                style="width: 152px"
                @change="typeChange"
              >
                <el-option
                  v-for="item in iReturnTypeList"
                  :key="item.Value"
                  :label="item.Text"
                  :value="item.Value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="退料原因">
              <el-select
                v-model="returnReason"
                placeholder=""
                style="width: 152px"
                :disabled="returnType === '1'"
              >
                <el-option
                  v-for="item in returnReasonList"
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
            <!-- <el-input
              v-model.trim="searchText"
              size="small"
              style="width: 250px"
              @keyup.enter.native="filterFeedTableData"
            >
              <template #append>
                <el-button @click="filterFeedTableData" icon="Search" />
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
          <!-- <el-table ref="table" :data="filterTableData" size="small" border fit :tooltip-effect="'dark'" :height="400"
            row-key="MaterialName" :tree-props="{ children: 'children' }" @selection-change="handleSelectionChange"
            :row-class-name="tableRowClassName">
            <el-table-column type="selection" width="55" :selectable="selectable"
              :min-width="flexColumnWidth('选择', 'CompID')" />
            <el-table-column type="index" label="序号" width="50" align="center" />
            <el-table-column prop="CompID" label="物料条码" :min-width="flexColumnWidth('物料条码', 'CompID')">
            </el-table-column>
            <el-table-column prop="CompName" label="物料编码" :min-width="flexColumnWidth('物料编码', 'CompName')">
            </el-table-column>
            <el-table-column prop="Amount" label="初始数量" align="center" :min-width="flexColumnWidth('初始数量', 'Amount')">
            </el-table-column>
            <el-table-column prop="Qty" label="可退数量" align="center" :min-width="flexColumnWidth('可退数量', 'Qty')">
            </el-table-column>
            <el-table-column v-if="returnType === '1'" prop="Qty" align="center" label="请求退料数量"
              :min-width="flexColumnWidth('请求数量', 'Qty')">
            </el-table-column>
            <el-table-column prop="RequestQty" align="center" label="请求退料数量" v-if="returnType !== '1'"
              :min-width="flexColumnWidth('请求数量', 'Qty')">
              <template #default="scope">
                <el-input style="width: 100%" :disabled="scope.row.MaterialQueue ? true : false"
                  v-model="scope.row.RequestQty" @input="handleInput(scope.row)">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态" :min-width="flexColumnWidth('状态状态', 'Qty')">
              <template #default="scope">
                <div>
                  {{ scope.row.MaterialQueue ? "不可退料" : "可退料" }}
                </div>
              </template>
            </el-table-column>
          </el-table> -->
          <vxe-table
            border
            height="400"
            size="small"
            ref="tableRef"
            :data="filterTableData"
            :checkbox-config="checkboxConfig"
            :scroll-y="{ enabled: true, gt: 0 }"
          >
            <vxe-column type="checkbox" title="" width="40"></vxe-column>
            <vxe-column type="seq" width="60"></vxe-column>
            <vxe-column field="CompID" title="物料批次条码"> </vxe-column>
            <vxe-column field="CompName" title="物料编码"> </vxe-column>
            <vxe-column field="Amount" title="初始数量" align="center">
            </vxe-column>
            <vxe-column field="Qty" title="可退数量" align="center">
            </vxe-column>
            <vxe-column
              v-if="returnType === '1'"
              align="center"
              field="Qty"
              title="请求数量"
            >
            </vxe-column>
            <vxe-column
              align="center"
              v-if="returnType !== '1'"
              field="RequestQty"
              title="请求退料数量"
              min-width="60"
            >
              <template #default="{ row, column, rowIndex, columnIndex }">
                <el-input v-model="row.RequestQty" @input="handleInput(row)"></el-input>
              </template>
            </vxe-column>
            <vxe-column field="MaterialQueue" title="状态" align="center">
              <template #default="{ row, column, rowIndex, columnIndex }">
                <span style="color: red" v-show="row.MaterialQueue">{{
                  "不可退料"
                }}</span>
                <span style="color: #009000" v-show="!row.MaterialQueue">{{
                  "可退料"
                }}</span>
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
import type { VxeTablePropTypes } from "vxe-table";
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
const returnReason = ref("");
const returnReasonList = ref<any[]>([]);
const iReturnTypeList = ref<any[]>([]);
const table = ref();
const tableRef = ref();
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

const historyForm = ref<historyFormTS>({
  MfgOrderName: "",
  requestStartDate: "",
  requestEndDate: "",
  QualityIsGood: "",
  OperationType: "R",
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
//搜索编码
const filterFeedTableData = () => {
  if (searchText.value == "") {
    filterTableData.value = feedTableData.value;
    return;
  }
  filterTableData.value = feedTableData.value.filter((f: any) =>{
    return f.CompName.toLowerCase().includes(searchText.value.toLowerCase())
  }
  );
};
onBeforeMount(() => {});

const checkboxConfig = reactive<VxeTablePropTypes.CheckboxConfig<any>>({
  labelField: "name",
  visibleMethod({ row }) {
    if (row.MaterialQueue) {
      return false;
    } else if (returnType.value === "1") {
      return true;
    } else if (row.Qty === 0 || !row.RequestQty) {
      return false;
    } else {
      return true;
    }
  },
});

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
  tableRef.value.clearCheckboxRow();
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
      getFeedTableData(data, item.OrderTypeName);
    }
  });
  selectOrder.value = data;
};

//根据名称获取配置值
const getTypeList = () => {
  GetComboBoxList("ReturnType").then((res: any) => {
    iReturnTypeList.value = res.content;
    returnTypeList.value = res.content;
  });
  GetComboBoxList("ReturnReason").then((res: any) => {
    returnReasonList.value = res.content;
    // returnReason.value = res.content[0].Value;
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
const getFeedTableData = (order: any, type: any) => {
  QueryMaterialReturnApplyDetail({
    MfgOrderName: order,
    OrderType: type,
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
          mfgOrder: item.OrderID,
          Qty: item.Qty,
          ContainerName: item.CompID,
          materialName: item.CompName,
          EmployeeName: loginName,
          QualityIsGood: returnType.value,
          QualityReason: returnReason.value,
          ERPOrder: form.value.ERPOrder,
          OrderType: selectType.value,
          AvailableQty: item.Qty,
          InitQty: item.Amount,
          ERPSpec:item.BD_ERPSpecName
        };
      } else {
        return {
          mfgOrder: item.OrderID,
          Qty: item.RequestQty,
          ContainerName: item.CompID,
          materialName: item.CompName,
          EmployeeName: loginName,
          QualityIsGood: returnType.value,
          QualityReason: returnReason.value,
          ERPOrder: form.value.ERPOrder,
          ERPSpec:item.BD_ERPSpecName
        };
      }
    });
  console.log(choiceList.value);
};
//申请退料
const applyFor = () => {
  choiceList.value = tableRef.value.getCheckboxRecords()
    .filter((item: any) => item.Qty && item.Qty != 0)
    .map((item: any) => {
      if (returnType.value === "1") {
        return {
          mfgOrder: item.OrderID,
          Qty: item.Qty,
          ContainerName: item.CompID,
          materialName: item.CompName,
          EmployeeName: loginName,
          QualityIsGood: returnType.value,
          QualityReason: returnReason.value,
          ERPOrder: form.value.ERPOrder,
          OrderType: selectType.value,
          AvailableQty: item.Qty,
          InitQty: item.Amount,
          ERPSpec:item.BD_ERPSpecName
        };
      } else {
        return {
          mfgOrder: item.OrderID,
          Qty: item.RequestQty,
          ContainerName: item.CompID,
          materialName: item.CompName,
          EmployeeName: loginName,
          QualityIsGood: returnType.value,
          QualityReason: returnReason.value,
          ERPOrder: form.value.ERPOrder,
          OrderType: selectType.value,
          AvailableQty: item.Qty,
          InitQty: item.Amount,
          ERPSpec:item.BD_ERPSpecName
        };
      }
    });
  if (choiceList.value.length === 0) {
    ElNotification({
      title: "提示信息",
      message: "请选择退料行",
      type: "warning",
    });
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
  // console.log(choiceList.value);
  OrderGoodMaterials(choiceList.value).then((res: any) => {
    if (res && res.success) {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
      // findOrderData();
      // getFeedTableData(selectOrder.value, selectType.value);
      feedTableData.value = [];
      filterTableData.value = [];
      getHistory();
      dialogVisible.value = false;
    }
  });
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
  // console.log(row.MaterialQueue, row.MaterialQueue ? true : false);

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

const returnTypeReason = (str:any) => {
  let reason = '';
  returnReasonList.value.forEach(element => {
    if (element.Value === str) {
      reason = element.Text
    }
  });
  return reason;
}

//判断请求数量是否大于需求量
const handleInput = (data: any) => {
  if (data.RequestQty !== undefined || data.RequestQty !== "") {
    console.log(data);
    
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
    // table.value.clearSelection();
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
  // console.log(row.MaterialQueue ? true : false);
  if (row.MaterialQueue) {
    return "has-material-row";
  } else {
  }
  return "";
};

//改变
const typeChange = () => {
  // table.value.clearSelection();
  tableRef.value.clearCheckboxRow();
  if (returnType.value === "1") {
    returnReason.value = "";
  } else {
    returnReason.value = returnReasonList.value[0].Value;
  }
};

const close = () => {
  feedTableData.value = [];
  filterTableData.value = [];
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
    label: "单号",
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
