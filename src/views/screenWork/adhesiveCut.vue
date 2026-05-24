<template>
  <div class="flex flex-col w-full h-full">
    <!-- <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
        <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
        <div></div>
      </div> -->
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[320px]">
        <div class="w-full h-full box">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">基本信息</span>
          </div>
          <div class="p-[10px]">
            <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
              <el-form-item label="生产计划号" class="mb-[5px] flex">
                <selectTa ref="selectTable" :table="orderTable" :selectWidth="170" :columns="orderColumns"
                  :max-height="400" :tableWidth="700" :defaultSelectVal="defaultSelectVal" :keywords="{
                    label: 'MfgOrderName',
                    value: 'MfgOrderName',
                  }" @radioChange="(...args: any) => radioChange(args)">
                </selectTa>
                <el-tooltip content="刷新" placement="top">
                  <el-icon class="ml-2" color="#006487" :class="isLoding" size="24" @click="getOrderData">
                    <RefreshRight />
                  </el-icon>
                </el-tooltip>
              </el-form-item>
              <el-form-item v-for="f in formHeader" :key="f.value" :label="f.label">
                <span class="font-bold text-lg leading-[30px]" :class="f.value == 'TodayNum' ? 'text-[#00B400]' : ''">
                  {{ formText(f.value) }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-320px)]">
        <!-- <div class="w-full"> -->
        <div class="w-full h-full flex flex-col">
          <div>
            <div class="h-[35px] flex items-center justify-between text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5"> 扫描条码</span>
              <div class="flex items-center mr-3">
                <!-- <div class="flex items-center ">
                  <span>打印数量：</span>
                    <el-input-number v-model="stopsForm.BatchQty" :min="maxQty"   />
                </div> -->
                <div>
                  条码批次数量：<span class="text-lg font-bold pl-1 pr-1 bg-slate-300 text-[red]">{{ stopsForm.BatchQty
                    }}</span>
                </div>
                <el-button type="info" class="ml-2" @click="openSetNum">设定</el-button>
                <el-button type="warning" class="ml-2" @click="unFullBox"
                  :disabled="batchData.length == 0">不满箱打印</el-button>
              </div>
            </div>
            <div class="h-[230px] pt-3 pr-5 pl-5 flex justify-between">
              <div>
                <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                  @submit.native.prevent>
                  <el-form-item label="扫描条码" class="mb-1">
                    <el-input v-model.trim="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 500px"
                      placeholder="请扫描条码" @keyup.enter.native="getChange" />
                  </el-form-item>
                  <el-form-item :class="[
                    stopsForm.result == 'OK' ? 'switchok' : 'switchng',
                  ]" class="mb-1">
                    <el-switch v-model="stopsForm.result" size="large" style="
                          zoom: 1.2;
                          --el-switch-on-color: #ff4949;
                          --el-switch-off-color: #13ce66;
                        " :active-value="'NG'" :inactive-value="'OK'" active-text="NG" inactive-text="OK" />
                  </el-form-item>
                  <el-form-item label="" class="mb-1">
                    <el-table :data="batchData" size="small" border :style="{ width: '100%' }">
                      <el-table-column prop="containername" label="批次条码" width="180" />
                      <el-table-column prop="qty" label="数量" width="80" >
                        <template #default="scope">
                      <span class="text-[#f48000] font-bold text-xl">{{ scope.row.qty }}</span>
                    </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-form>
                <!-- <div class="text-xl font-bold "  :style="{ 'color': isGo ? '#00B400' : '#e6a23c' }" v-show="msgType === true || msgTitle === ''">
                    {{ msgTitle === "" ? "请扫描屏材料批次条码" : msgTitle }}
                  </div>
                  <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                    {{ msgTitle }}
                  </div> -->
                <div class="text-xl font-bold text-[#f48000]">
                  {{ barMsg }}
                </div>
                <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                  {{ msgTitle }}
                </div>
                <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                  {{ msgTitle }}
                </div>
              </div>
              <div>
                <el-table :data="barData" size="small" border :row-class-name="tableRowClassName" :height="180">
                  <el-table-column type="index" align="center" fixed label="序号" :width="'50'"></el-table-column>
                  <el-table-column prop="MaterialName" label="物料编码" width="120" />
                  <el-table-column prop="QtyRequired" label="是否关键料" width="80" align="center">
                    <template #default="scope">
                      <el-tag effect="plain" :type="scope.row.IssueControl == 1 ? 'warning' : 'primary'
                        ">{{ scope.row.IssueControl == 1 ? "是" : "否" }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="LoadQueueQty" label="上料总数" width="80" align="center">
                    <template #default="scope">
                      {{
                        scope.row.LoadQueueQty == null
                          ? 0
                          : scope.row.LoadQueueQty
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="Qty" label="剩余数量" width="80" align="center">
                    <template #default="scope">
                      <span>{{
                        scope.row.Qty == null
                          ? 0
                          : scope.row.Qty
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="MaterialBarCode" label="批次条码" width="150">
                  </el-table-column>
                  <!-- <el-table-column prop="address" label="Address" /> -->
                </el-table>
              </div>
            </div>
          </div>

          <div class="flex flex-col flex-1 tabs-css">
            <div class="h-[35px] flex items-center justify-between text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5">历史过站记录</span>
              <div class="mr-5">
                <el-checkbox-group v-model="checkedHis" class="laser-table-filter">
                  <el-checkbox v-for="c in checkedHisList" :label="`${c.label}(${changeDataLength(c.value)})`"
                    :value="c.value" @change="changeHis(c.value)">
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <el-table :data="changeData.slice(
              (pageObj.currentPage - 1) * pageObj.pageSize,
              pageObj.currentPage * pageObj.pageSize
            )
              " stripe border fit :height="tableHeight">
              <el-table-column type="index" align="center" fixed label="序号" :width="'60'">
                <template #default="scope">
                  <span>{{
                    scope.$index +
                    pageObj.pageSize * (pageObj.currentPage - 1) +
                    1
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="ContainerName" label="屏条码" width="180" />
              <el-table-column label="供应商条码" prop="BindContainerName">
                <!-- <template #default="scope">
                  <div v-if="scope.row.BindContainerName !== null">
                    SN1：{{ scope.row.BindContainerName }}
                  </div>
                  <div v-if="scope.row.BindContainerName2 !== null">
                    SN2：{{ scope.row.BindContainerName2 }}
                  </div>
                  <div v-if="scope.row.BindContainerName3 != null">
                    SN3：{{ scope.row.BindContainerName3 }}
                  </div>
                  <div v-if="scope.row.BindContainerName4 != null">
                    SN4：{{ scope.row.BindContainerName4 }}
                  </div>
                  <div v-if="scope.row.BindContainerName5 != null">
                    SN5：{{ scope.row.BindContainerName5 }}
                  </div>
                </template> -->
              </el-table-column>
              <el-table-column prop="fullname" label="扫描人" width="180" />
              <el-table-column prop="TxnDate" label="扫描时间" width="180" />
            </el-table>
            <div class="mt-2 mb-2">
              <el-pagination :size="'default'" background @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                :page-size="pageObj.pageSize" :page-sizes="[30, 50, 100, 200, 300]"
                layout="total,sizes, prev, pager, next" :total="tableData1.length">
              </el-pagination>
            </div>
            <!-- <table-tem :showIndex="true" :tableData="changeData" :tableHeight="tableHeight" :columnData="columnData1"
                :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"></table-tem> -->
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="badVisible" title="不良登记" width="60%" :append-to-body="true" :close-on-click-modal="false"
      :close-on-press-escape="false" align-center @close="badCancel">
      <div>
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            基本信息
          </div>
          <el-form ref="badFormRef" :model="badheadForm" label-width="auto">
            <el-form-item label="成品条码" class="mb-[5px] flex">
              <el-input v-model="badForm.containerName" style="width: 160px" disabled />
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="生产计划号" class="mb-[5px] flex">
                  <el-input v-model="badheadForm.MfgOrderName" style="width: 160px" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="mb-[5px]" label="产品编码">
                  <el-input v-model="badheadForm.ProductName" style="width: 160px" disabled /> </el-form-item></el-col>
              <el-col :span="10">
                <el-form-item class="mb-[5px]" label="产品描述">
                  <el-input v-model="badheadForm.ProductDesc" style="width: 320px" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            不良原因
          </div>
          <table-temp :showIndex="true" :show-select="true" :tableData="BadtableData" :tableHeight="300"
            :columnData="badColumn" @handleSelectionChange="badSelectionChange"></table-temp>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="badCancel">取消</el-button>
          <el-button type="primary" @click="badSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="showSetNum" draggable title="数量设定" width="300px" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" @close="setCancel">
      <el-form ref="formRef" :model="stopsForm" label-width="auto">
        <el-form-item label="数量" prop="BatchQty">
          <el-input-number v-model="stopsForm.BatchQty" :min="maxQty" />
          <!-- <el-input v-model="stopsForm.BatchQty"  type="number"/> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setCancel">关闭</el-button>
          <el-button type="primary" @click="setASYNum"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import tableTem from "@/components/tableTem/index.vue";

import tableTemp from "@/components/tableTemp/index.vue";
import selectTa from "@/components/selectTable/index.vue";
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { checkStringType } from "@/utils/barcodeFormat";
import type { Formspan, FormHeader, OrderData } from "@/typing";
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";

import {
  OrderQuery,
  QueryMoveHistory,
  QueryKeyMaterial,
  JudgeKeyMaterial,
  SCNFitTogetherMoveStd,
  QueryDefectCode1,
  isDefects,
  QueryBatchCodeInfo,
  DealNoBatchCode
} from "@/api/scrApi";

import {
  ref,
  reactive,
  onMounted,
  nextTick,
  computed,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import { cloneDeep } from "lodash-es";
interface StopsForm {
  BatchQty: number|string;
  workstationName: string;
  result: string;
  userAccount: string;
  txnDate: string;
  TPBatchNo: string;
  OrderName: string;
  tools: string;
  BarCode: string;
  keyMaterialList: Array<KeyMaterial1>;
}
interface KeyMaterial {
  MaterialBarCode: string;
  MaterialName: string;
  MfgOrderName: string;
  QtyRequired: number;
  IssueControl: number;
  barCount: number;
}
interface KeyMaterial1 {
  MaterialBarCode: string;
  MaterialName: string;
}

const appStore = useAppStore();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const inputRef = ref();
const inputFocus = ref(true);
const barCode = ref("");
const stopsForm = ref<StopsForm>({
  workstationName: opui.station || "",
  userAccount: userStore.getUserInfo,
  BarCode: "",
  OrderName: "",
  BatchQty: parseInt(localStorage.getItem("SETPRINT") ?? "1") || 1 ,
  TPBatchNo: "",
  keyMaterialList: [],
  tools: "",
  txnDate: "",
  result: "OK",
});

const form = ref<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  Qty: "",
  PlannedStartDate: "",
  PlannedCompletionDate: "",
  AllNum: "",
  TodayNum: "",
  ERPOrder: "",
});
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
  {
    label: "产品机型",
    value: "BD_ProductModel",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "工单号",
    value: "ERPOrder",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "计划数量",
    value: "Qty",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品编码",
    value: "ProductName",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品描述",
    value: "ProductDesc",
    disabled: true,
    type: "textarea",
    width: 300,
  },
]);
const columnData1 = reactive([
  {
    text: true,
    prop: "ContainerName",
    label: "成品SN条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "fullname",
    label: "扫描人",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "TxnDate",
    label: "扫描时间",
    width: "",
    align: "1",
  },
]);
const tableData1 = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});

const msgTitle = ref("");
const msgType = ref(true);
const hisForm = ref({
  MfgOrderName: "",
  workstationName: opui.station,
});
const orderTable = ref<InstanceType<typeof OrderData>>({
  data: [],
});
const orderColumns = ref([
  { label: "生产计划号", width: "", prop: "MfgOrderName" },
  { label: "产品编码", width: "", prop: "ProductName" },
  { label: "产线", width: "", prop: "MfgLineDesc" },
  { label: "状态", width: "", prop: "OrderStatusDesc" },
  { label: "计划开始", width: "", prop: "PlannedStartDate" },
  { label: "计划完成", width: "", prop: "PlannedCompletionDate" },
]);
const defaultSelectVal = ref<string[]>([]);
const isLoding = ref("");
const barData = ref<KeyMaterial[]>([]);
const keyForm = ref({
  BarCode: "",
  OrderName: "",
  ProductName: "",
  workstationName: opui.station,
  tools: "",
  userAccount: "",
  txnDate: "",
});
const isKeyForm = ref({
  BarCode: "",
  OrderName: "",
  ProductName: "",
  workstationName: opui.station,
  tools: "",
  userAccount: userStore.getUserInfo,
  txnDate: "",
});
const materialRef = ref();
const inputRefs = ref<any[]>([]);
const checkedHis = ref(["today"]);
const checkedHisList = ref([
  {
    value: "today",
    label: "当日过序",
  },
  {
    value: "all",
    label: "工序汇总",
  },
]);

interface Defect {
  isDefectLabel: string;
  isDefectType: number | string;
}
interface BadForm {
  containerName: string;
  DefectDetails: Array<Defect>;
  workstationName: string;
  userAccount: string;
}
const getBadForm = ref({
  containerName: "",
  workstationName: opui.station,
  orderName: "",
});
const badForm = ref<BadForm>({
  containerName: "",
  DefectDetails: [],
  workstationName: opui.station || "",
  userAccount: userStore.getUserInfo,
});
const badheadForm = ref<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
});
const badColumn = reactive([
  {
    text: true,
    prop: "isDefectReasonName",
    label: "不良代码",
    width: "100",
    align: "1",
  },
  {
    text: true,
    prop: "isDefectReasonDesc",
    label: "不良原因",
    width: "",
    min: true,
    align: "1",
  },
]);
const badVisible = ref(false);
const changeList = ref([]);
const BadtableData = ref([]);
const isGo = ref(true);
const barMsg = ref("");
const getBatchForm = ref({
  OrderName: "",
  workstationName: opui.station
})
const batchData = ref<any[]>([
  {
    containerName: "打印批次条码",
    qty: 0
  }
])
const maxQty = ref(0)
const showSetNum = ref(false)
const setTimer=ref()

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  // stopsForm.value.BatchQty=localStorage.getItem("SETPRINT")?parseInt(localStorage.getItem("SETPRINT")):1
  getOrderData();
  // getFocus();
});
onBeforeUnmount(() => {
  clearInterval(setTimer.value)
  window.addEventListener("resize", getScreenHeight);
});

//获取光标
const getFocus = () => {
  inputFocus.value = false;
  setTimeout(() => {
    inputFocus.value = true;
  }, 100);
};

const formText = (data: string) => {
  let key = data as keyof typeof form;
  return form.value[key];
};

//获取批次打印信息
const getBatchCode = () => {
  QueryBatchCodeInfo(getBatchForm.value).then((res: any) => {
    batchData.value = res.content
    if (res.content.length == 0) {
      maxQty.value = 0
      stopsForm.value.TPBatchNo=""
      // if (stopsForm.value.BatchQty == 0) {
      //   stopsForm.value.BatchQty = 1
      // }

    } else {
      stopsForm.value.TPBatchNo = res.content[0].containername
      maxQty.value = res.content[0].qty + 1
      // if( maxQty.value>stopsForm.value.BatchQty){
      // stopsForm.value.BatchQty= maxQty.value
      // }
    }
  })
}
const openSetNum = () => {
  showSetNum.value = true;
}
const setASYNum = () => {
  if (batchData.value.length > 0) {
    if (batchData.value[0].qty > stopsForm.value.BatchQty) {
      ElNotification({
        title: "提示信息",
        message: `打印数量应该大于${batchData.value[0].containername}的数量`,
        type: "error",
      });
    } else {
      localStorage.setItem("SETPRINT", JSON.stringify(stopsForm.value.BatchQty));
      inputRef.value.focus()
      showSetNum.value = false;
    }
  } else {
    localStorage.setItem("SETPRINT", JSON.stringify(stopsForm.value.BatchQty));
    inputRef.value.focus()
    showSetNum.value = false;
  }

};
const setCancel = () => {
  showSetNum.value = false;
};
const unFullBox = () => {
  DealNoBatchCode({
    BatchQty: stopsForm.value.BatchQty,
    workstationName: opui.station,
    TPBatchNo: stopsForm.value.TPBatchNo
  }).then((res: any) => {
    msgTitle.value = res.msg;
    msgType.value = res.success;
  })
}
//获取过站历史记录
const getHisData = () => {
  QueryMoveHistory(hisForm.value).then((res: any) => {
    tableData1.value = res.content;
  });
};
const changeHis = (val: any) => {
  if (checkedHis.value.length == 0) {
    checkedHis.value = [];
  } else {
    checkedHis.value = [];
    checkedHis.value[0] = val;
  }
};
const changeData = computed(() => {
  if (checkedHis.value[0] == "today") {
    return geTodayData();
  } else {
    return tableData1.value;
  }
});
const changeDataLength = (val: any) => {
  if (val == "today") {
    let dataLength = geTodayData();
    return dataLength.length;
  } else {
    return tableData1.value.length;
  }
};
const geTodayData = () => {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  function getDateFromDateTimeString(dateTimeString: any) {
    return dateTimeString.split(" ")[0];
  }
  const todayDataArray = tableData1.value.filter((item: any) => {
    return getDateFromDateTimeString(item.TxnDate) === todayString;
  });
  return todayDataArray;
};

//扫描
const getChange = () => {
  let barCodeData = barCode.value;
  if (stopsForm.value.OrderName == "") {
    msgTitle.value = "请先选择生产计划号";
    msgType.value = false;
  } else {
    if (checkStringType(barCodeData) == "result") {
      if (barCodeData == "ng" || barCodeData == "NG") {
        stopsForm.value.result = "NG";
      } else {
        stopsForm.value.result = "OK";
      }
    } else {
      if (stopsForm.value.result == "OK") {
        if (barData.value.length == 0) {
          msgTitle.value = "请进行物料上料";
          barCode.value = ""
          msgType.value = false;
          return
        }
        if (isKeyZero.value == -1 && isNoKeyZero.value == -1) {
          if (isKeyEmpty.value == -1) {
            stopsForm.value.BarCode = barCodeData;
            goStop();
          } else {
            verifyBarCode(barCodeData);
          }
        } else {
          msgType.value = false;
          if (isKeyZero.value != -1) {
            msgTitle.value = `${barData.value[isKeyEmpty.value].MaterialName
              }关键料剩余为0，请进行上料`;
          }
          else if (isNoKeyZero.value != -1) {
            msgTitle.value = `${barData.value[isNoKeyZero.value].MaterialName
              }批次物料剩余为0，请进行上料`;
          } else {
            msgTitle.value = `${barData.value[isKeyEmpty.value].MaterialName
              }关键料剩余为0和${barData.value[isNoKeyZero.value].MaterialName
              }批次物料剩余为0，请进行上料`;
          }

        }
      } else {
        badForm.value.containerName = barCodeData;
        getBadForm.value.containerName = barCodeData;
        QueryDefectCode1(getBadForm.value).then((res: any) => {
          if (!res.success) {
            msgTitle.value = res.msg;
            msgType.value = res.success;
            return;
          }
          badheadForm.value.MfgOrderName = res.content.MfgOrderName;
          badheadForm.value.ProductName = res.content.ProductName;
          badheadForm.value.ProductDesc = res.content.ProductDesc;
          badheadForm.value.Qty = res.content.Qty;
          BadtableData.value = res.content.defectCode;
          badVisible.value = true;
        });
      }
    }
    barCode.value = "";
  }
};
//过站
const goStop = () => {

  SCNFitTogetherMoveStd(stopsForm.value).then((res: any) => {
    msgTitle.value = res.msg;
    msgType.value = res.success;
    isGo.value = true;
    stopsForm.value.BarCode = "";
    stopsForm.value.result = "OK";
   
    barCode.value = "";
   
    if (res.success) {
      stopsForm.value.keyMaterialList = [];
      getKeyMaterial();
      getHisData();
      getBatchCode()
    }
    getFocus();
  });
};
const isKeyZero = computed(() => {
  return barData.value.findIndex(
    (b: any) => b.IssueControl == 1 && (b.Qty == 0 || b.Qty == null)
  );
});
//批次料为空
const isNoKeyZero = computed(() => {
  return barData.value.findIndex(
    (b: any) => b.IssueControl == 2 && (b.Qty == 0 || b.Qty == null)
  );
});
//绑定为空
const isKeyEmpty = computed(() => {
  return barData.value.findIndex(
    (b: any) => b.IssueControl == 1 && b.barCount !== b.QtyRequired
  );
});
//验证绑定
const verifyBarCode = (barCodeData: any) => {
  const keyProductName = barData.value.find(
    (b: any) => b.IssueControl == 1
  );
  let keyData = cloneDeep(keyProductName)
  let data1 = {
    BarCode: barCodeData,
    OrderName: form.value.MfgOrderName,
    workstationName: opui.station,
    ProductName: keyData.MaterialName
  };
  JudgeKeyMaterial(data1).then((res: any) => {
    msgTitle.value = res.msg;
    msgType.value = res.success;
    isGo.value = false;
    if (res.success) {
      const keyIndex = barData.value.findIndex(
        (b: any) => b.MaterialName == res.content.ProductName
      );
      if (keyIndex == -1) {
        msgTitle.value = `条码${barCodeData}不属于该生产计划关键物料，请重新扫描`;
        msgType.value = false;
        return;
      }
      if (barData.value[keyIndex].MaterialBarCode == "") {

        barData.value[keyIndex].MaterialBarCode = barCodeData;
        stopsForm.value.keyMaterialList.push({
          MaterialBarCode: res.content.MaterialCode == "" || res.content.MaterialCode == null ? barCodeData : res.content.MaterialCode,
          MaterialName: barData.value[keyIndex].MaterialName,
        });
        barData.value[keyIndex].barCount++;
      } else {
        const MaterialBarArr =
          barData.value[keyIndex].MaterialBarCode.split(",");
        const isEixtBar = MaterialBarArr.findIndex(
          (m: any) => barCodeData == m
        );
        if (isEixtBar == -1) {
          barData.value[keyIndex].MaterialBarCode =
            barData.value[keyIndex].MaterialBarCode + "," + barCodeData;
          stopsForm.value.keyMaterialList.push({
            MaterialBarCode: barCodeData,
            MaterialName: barData.value[keyIndex].MaterialName,
          });
          barData.value[keyIndex].barCount++;
        } else {
          msgTitle.value = `重复扫描`;
          msgType.value = false;
        }
      }
      if (
        barData.value[keyIndex].barCount !== barData.value[keyIndex].QtyRequired
      ) {
        msgType.value = true;
        barMsg.value = `请继续扫描${barData.value[keyIndex].IssueControl == 1 ? "关键料" : "批次料"
          }${barData.value[keyIndex].MaterialName}`;
      } else {
        if (isKeyEmpty.value !== -1) {
          msgType.value = true;
          barMsg.value = `请继续扫描${barData.value[isKeyEmpty.value].IssueControl == 1
            ? "关键料"
            : "批次料"
            }${barData.value[isKeyEmpty.value].MaterialName}`;
        } else {
          msgType.value = true;
          barMsg.value = `请扫描MES条码`;
        }
      }
    }
  });
};
const badSelectionChange = (data: any) => {
  let content = cloneDeep(data);
  changeList.value = content;
};
const badCancel = () => {
  badVisible.value = false;
  BadtableData.value = [];
  changeList.value = [];
  badForm.value.DefectDetails = [];
  stopsForm.value.result = "OK";
};
const badSubmit = () => {
  changeList.value.forEach((c: any) => {
    badForm.value.DefectDetails.push({
      isDefectLabel: c.isDefectReasonName,
      isDefectType: 1,
    });
  });
  isDefects(badForm.value).then((res: any) => {
    msgTitle.value = "";
    msgType.value = true;
    if (res.success) {
      badVisible.value = false;
      BadtableData.value = [];
      changeList.value = [];
      badForm.value.DefectDetails = [];
      stopsForm.value.result = "OK";
      inputRefs.value[0].focus();
      // getFocus();
    }
    ElNotification({
      title: "提示信息",
      message: res.msg,
      type: res.success ? "success" : "error",
    });
  });
};

const radioChange = (args: any) => {
  if (args[1] == null) {
    form.value.MfgOrderName = "";
    form.value.ProductName = "";
    form.value.ProductDesc = "";
    form.value.PlannedStartDate = "";
    form.value.BD_ProductModel = "";
    form.value.BD_SoftVersion = "";
    form.value.PlannedCompletionDate = "";
    form.value.Qty = "";
    form.value.ERPOrder = "";
    barData.value = [];
    tableData1.value = [];
  } else {
    if (args[1] !== form.value.MfgOrderName || form.value.MfgOrderName == "") {
      form.value.MfgOrderName = args[0].MfgOrderName;
      form.value.ProductName = args[0].ProductName;
      form.value.ProductDesc = args[0].ProductDesc;
      form.value.BD_ProductModel = args[0].BD_ProductModel;
      form.value.BD_SoftVersion = args[0].BD_SoftVersion;
      form.value.PlannedStartDate = args[0].PlannedStartDate;
      form.value.PlannedCompletionDate = args[0].PlannedCompletionDate;
      form.value.Qty = args[0].Qty;
      form.value.AllNum = args[0].AllNum;
      form.value.TodayNum = args[0].TodayNum;
      form.value.ERPOrder = args[0].ERPOrder;
      stopsForm.value.OrderName = args[0].MfgOrderName;
      hisForm.value.MfgOrderName = args[0].MfgOrderName;
      isKeyForm.value.OrderName = args[0].MfgOrderName;
      keyForm.value.OrderName = args[0].MfgOrderName;
      getBadForm.value.orderName = args[0].MfgOrderName
      keyForm.value.ProductName = args[0].ProductName;
      getBatchForm.value.OrderName = args[0].MfgOrderName;
      msgType.value = true;
      msgTitle.value = "";
      stopsForm.value.keyMaterialList = [];
      inputRef.value.focus()
      // getKeyMaterial()
      // getHisData();
    }
    // clearInterval(setTimer.value)
    // setTimer.value= setInterval(()=>{
    //   getBatchCode()
    // },1000)
    getKeyMaterial();
    getBatchCode()
    getHisData();


    // getHisData();
  }
};
const getKeyMaterial = () => {
  barData.value = [];
  stopsForm.value.keyMaterialList = [];
  barMsg.value = ""
  QueryKeyMaterial(keyForm.value).then((res: any) => {
    barData.value = res.content;
    barData.value.sort((a, b) => a.IssueControl - b.IssueControl);
    barData.value = barData.value.map((b: any) => {
      return {
        ...b,
        MaterialBarCode: "",
        barCount: 0,
      };
    });
    if (barData.value.length !== 0) {
      if (barData.value[0].IssueControl == 1) {
        msgType.value = true;
        barMsg.value = `请先扫描关键物料${barData.value[0].MaterialName}`;
      }
    } else {
      msgType.value = false
      msgTitle.value = "请进行物料上料"
    }
  });
};
const tableRowClassName = (val: any) => {
  // console.log(val.row);
  const isExitCode = barData.value.findIndex(
    (k: any) => k.QtyRequired == k.barCount
  );
  if (isExitCode !== -1) {
    return "active-table";
  }
  return "";
};
const getOrderData = () => {
  isLoding.value = "is-loading";
  defaultSelectVal.value = [];
  msgType.value = true;
  msgTitle.value = "";
  stopsForm.value.keyMaterialList = [];
  OrderQuery({
    lineName: opui.line,
    // OrderTypeName: "Assembly",
    // WorkStationName: opui.station,
  }).then((res: any) => {
    let data = res.content;
    let timer = setTimeout(() => {
      isLoding.value = "";
      clearTimeout(timer);
    }, 2000);
    if (data !== null && data.length !== 0) {
      orderTable.value.data = data;
      if (data.length >= 1) {
        defaultSelectVal.value[0] = data[0].MfgOrderName;

      }
    }
    inputRef.value.focus()
  });
};
//分页
const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 430;
  });
};
</script>

<style lang="scss">
.inbound .el-form-item__label {
  font-size: 16px;
}

.setwidth {
  flex: 0 0 320px;
}

.box {
  border-right: 2px solid #cbcbcb;
}

.tabs-css .el-tabs--border-card {
  border-top: 1px solid #006487;
}

.tabs-css .el-tabs__header {
  background-color: #006487 !important;
}

.tabs-css .el-tabs__content {
  padding: 5px 0px;
}

.tabs-css .el-tabs__item {
  font-size: 1.1rem;
}

.tabs-css .el-tabs--border-card>.el-tabs__header .el-tabs__item {
  color: #fff;
  // padding: 0 !important;
}

.tabs-css .el-tabs__item.is-active {
  // color: #fff;
  color: #006487 !important;
  // font-weight: bold;
}

.el-switch__label {
  font-weight: bold;
}

.switchok .el-switch__label.is-active {
  color: #13ce66;
}

.switchng .el-switch__label.is-active {
  color: #ff4949;
}

.tabs-css .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
  // color: #fff;
  // background-color: #fff;
  background-color: rgba($color: #fff, $alpha: 0.8);
}

.saveAsDialog {
  min-width: 954px;
}

// .checked{
//   height: 14px;
// }
.checked .el-checkbox {
  height: 14px;
}
</style>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .active-table {
  --el-table-tr-bg-color: var(--el-color-success-light-5);
}
</style>
<style lang="scss" scoped>
::v-deep .laser-table-filter .el-checkbox__inner {
  /* 你的样式 */
  background-color: #409eff !important;
  /* 使用 !important，但请谨慎 */
  color: white !important;
}

::v-deep .laser-table-filter .el-checkbox__label {
  /* 你的样式 */
  color: white !important;
  font-size: 1.1rem;
}

.el-pagination {
  justify-content: center;
}
</style>