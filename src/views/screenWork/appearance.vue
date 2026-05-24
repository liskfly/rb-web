<template>
  <div class="flex flex-col w-full h-full">
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[320px]">
        <div class="w-full h-full box">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">基本信息</span>
          </div>
          <div class="p-[10px]">
            <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
              <!-- <el-form-item label="生产计划号" class="mb-[5px] flex">
                <selectTa ref="selectTable" :table="orderTable" :selectWidth="170" :columns="orderColumns"
                  :max-height="400" :tableWidth="750" :defaultSelectVal="defaultSelectVal" :keywords="{
                    label: 'MfgOrderName',
                    value: 'MfgOrderName',
                  }" @radioChange="(...args: any) => radioChange(args)">
                </selectTa>
                <el-tooltip content="刷新" placement="top">
                  <el-icon class="ml-2" color="#006487" :class="isLoding" size="24" @click="getOrderData">
                    <RefreshRight />
                  </el-icon>
                </el-tooltip>
              </el-form-item> -->
              <el-form-item v-for="f in formHeader" :key="f.value" :label="f.label">
                <span class="font-bold text-lg leading-[30px]" :class="f.value == 'TodayNum' ? 'text-[#00B400]' : ''">
                  {{ formText(f.value) }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-320px)]">
        <div class="w-full h-full flex flex-col">
          <div>
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-[200px] pt-3 pr-5 pl-5 flex justify-between">
              <div>
                <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                  @submit.native.prevent>
                  <el-form-item label="扫描条码" class="mb-1">
                    <el-input v-model="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 500px"
                      placeholder="请扫描条码" @keyup.enter.native="getChange" />
                  </el-form-item>
                  <el-form-item class="mb-1" :class="[
                    stopsForm.CheckResult == 'OK' ? 'switchok' : 'switchng',
                  ]">
                    <el-switch v-model="stopsForm.CheckResult" size="large" style="
                        zoom: 1.2;
                        --el-switch-on-color: #ff4949;
                        --el-switch-off-color: #13ce66;
                      " :active-value="'NG'" :inactive-value="'OK'" active-text="NG" inactive-text="OK" />
                  </el-form-item>
                  <el-form-item class="mb-1">
                    <el-button type="primary" @click="restData">重置</el-button>
                  </el-form-item>
                </el-form>

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
                <el-table :data="barData" size="small" border :height="180">
                  <el-table-column type="index" align="center" fixed label="序号" :width="'50'"></el-table-column>
                  <el-table-column prop="ContainerName" label="物料批次" width="120" />
                  <el-table-column prop="MaterialName" label="物料编码" width="120" />
                  <el-table-column prop="Qty" label="总数" width="80" align="center">
                    <template #default="scope">
                      <span class="text-[#f48000] font-bold text-xl">{{ scope.row.Qty }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="UseQty" label="使用数量" width="80" align="center">
                    <template #default="scope">
                      <span class="text-[#00B400] font-bold text-xl">{{ scope.row.UseQty }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <div class="flex flex-col flex-1">
            <div class="h-[35px] flex items-center justify-between text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5">检验记录</span>
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
              " stripe border fit :height="tableHeight" :tooltip-effect="'dark'">
              <el-table-column type="index" align="center" fixed label="序号" :width="'60'">
                <template #default="scope">
                  <span>{{
                    scope.$index +
                    pageObj.pageSize * (pageObj.currentPage - 1) +
                    1
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="ContainerName" label="物料批次条码" width="180">
                <template #default="scope">
                  {{
                    scope.row.ContainerNameLot == null || scope.row.ContainerNameLot == "" ? scope.row.ContainerName :
                      scope.row.ContainerNameLot
                  }}
                </template>
              </el-table-column>
              <el-table-column prop="ContainerName" label="供应商条码" width="180">
                <template #default="scope">
                  {{ scope.row.ContainerNameLot == null || scope.row.ContainerNameLot == "" ? "" :
                    scope.row.ContainerName }}
                </template>
              </el-table-column>
              <el-table-column prop="MaterialName" label="物料编码" width="180" />
              <el-table-column prop="MaterialDesc" label="物料描述" :show-overflow-tooltip="true" />
              <el-table-column prop="fullname" label="检验人" width="180" />
              <el-table-column prop="TxnDate" label="检验时间" width="180" />

            </el-table>
            <div class="mt-2 mb-2">
              <el-pagination :size="'default'" background @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                :page-size="pageObj.pageSize" :page-sizes="[30, 50, 100, 200, 300]"
                layout="total,sizes, prev, pager, next" :total="changeData.length">
              </el-pagination>
            </div>
            <!-- <table-tem :showIndex="showIndex" :tableData="changeData" :tableHeight="tableHeight"
                :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
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
            <el-form-item label="物料条码条码" class="mb-[5px] flex">
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

        <el-button @click="badCancel">取消</el-button>
        <el-button type="primary" @click="badSubmit"> 确定 </el-button>

      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  OrderQuery,
  MaterialVisualCheck,
  QueryMoveTestRecord,
  isDefects,
  QueryDefectCode1,
  QueryVendorInfo,
} from "@/api/scrApi";
import tableTem from "@/components/tableTem/index.vue";
import selectTa from "@/components/selectTable/index.vue";

import { useAppStoreWithOut } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { checkStringType } from "@/utils/barcodeFormat";
// import formTemple from '@/components/formTem/form.vue'
import type { Formspan, FormHeader, OrderData } from "@/typing";
import { ElNotification } from "element-plus";
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
const appStore = useAppStoreWithOut();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
// const title=appStore.getOPUIReal()
const barCode = ref("");
const inputRef = ref();
const inputFocus = ref(true)
const activeName = ref("first");
const stopsForm = ref({
  ContainerName: "", //PCB
  CheckResult: "OK", //工装治具
  PlanNo: "",
  VendorContainer: "",
  workstationName: opui.station, //工位
  userAccount: userStore.getUserInfo, //用户
});
const form = ref<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  Qty: "",
  PlannedStartDate: "",
  PlannedCompletionDate: "",
  ERPOrder: "",
});
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
  {
    label: "生产计划号",
    value: "MfgOrderName",
    disabled: true,
    type: "input",
    width: "",
  },
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
const tableData = ref([]);
const showIndex = ref(true);
const tableHeight = ref(0);
const columnData = reactive([
  {
    text: true,
    prop: "ContainerName",
    label: "物料批次条码",
    width: "180",
    align: "1",
  },
  {
    text: true,
    prop: "MaterialName",
    label: "物料编码",
    width: "180",
    align: "1",
  },
  {
    text: true,
    prop: "MaterialDesc",
    label: "物料描述",
    width: "",
    align: "1",
  },

  {
    text: true,
    prop: "InspectResult",
    label: "检验结果",
    width: "100",
    align: "1",
  },
  {
    text: true,
    prop: "fullname",
    label: "检验人",
    width: "180",
    align: "1",
  },
  {
    text: true,
    prop: "TxnDate",
    label: "检验时间",
    width: "180",
    align: "1",
  },
]);
const tablebox = ref();
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});
const msgTitle = ref("");
const msgType = ref(true);
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
const hisForm = ref({
  MfgOrderName: "",
  workstationName: opui.station,
});
const getBadForm = ref({
  containerName: "",
  workstationName: opui.station,
  orderName: "",
});
interface BarData {
  MaterialBarCode: string;
  MaterialName: string;
  MfgOrderName: string;
  QtyRequired: number;
  IssueControl: number;
  barCount: number;
}
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
const barData = ref<BarData[]>([]);
const barMsg = ref("请扫描屏条码/物料批次条码");
const materBarCode = ref("");
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
onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  // getOrderData();
  // getHisData()
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});
const formText = (data: string) => {
  let key = data as keyof typeof form;
  return form.value[key];
};

const getChange = (val: any) => {
  let barCodeData = barCode.value;
  if (checkStringType(barCodeData) == "result") {
    if (barCodeData == "ng" || barCodeData == "NG") {
      stopsForm.value.CheckResult = "NG";
    } else {
      stopsForm.value.CheckResult = "OK";
    }
  } else {
    if (stopsForm.value.CheckResult == "OK") {
      if (stopsForm.value.ContainerName == "" && checkStringType(barCodeData) == "SCR") {
        stopsForm.value.ContainerName = barCodeData;
        MaterialVisualCheck(stopsForm.value).then((res: any) => {
          msgTitle.value = res.msg;
          msgType.value = res.success;
          if (res.success) {
            stopsForm.value.CheckResult = "OK";
            stopsForm.value.ContainerName = "";
            form.value = { ...res.content[0] };
            hisForm.value.MfgOrderName = res.content[0].MfgOrderName
            getHisData();
          } else {
          //  /
            stopsForm.value.ContainerName = "";
            barCode.value = "";
          }
        });
      }
      if (checkStringType(barCodeData) == "MATER" || checkStringType(barCodeData) == "BDY") {
        stopsForm.value.ContainerName = barCodeData;
        materBarCode.value = barCodeData;
        getMaterData();
      } else {
        if (
          stopsForm.value.ContainerName != "" &&
         ( checkStringType(stopsForm.value.ContainerName) == "MATER"|| checkStringType(stopsForm.value.ContainerName) == "BDY")
        ) {
          console.log(barCodeData);
          if (checkStringType(barCodeData) == "SCR") {
            console.log(barCodeData);

            msgTitle.value = `${barCodeData}不是供应商条码，请扫描供应商条码或重置`;
            msgType.value = false;
          } else {
            stopsForm.value.VendorContainer = barCodeData;
            MaterialVisualCheck(stopsForm.value).then((res: any) => {
              msgTitle.value = res.msg;
              msgType.value = res.success;
              if (res.success) {
                // console.log(res.content);

                stopsForm.value.CheckResult = "OK";
                stopsForm.value.VendorContainer = "";
                form.value = { ...res.content[0] }
                hisForm.value.MfgOrderName = res.content[0].MfgOrderName
                getMaterData();
                getHisData();
              } else {
                stopsForm.value.VendorContainer = "";
                barCode.value = "";
              }
            });
          }

        }
      }
      if(stopsForm.value.ContainerName == "" &&checkStringType(barCodeData) != "SCR"&&checkStringType(barCodeData) != "MATER" && checkStringType(barCodeData) != "BDY"){
        stopsForm.value.ContainerName = barCodeData;
        MaterialVisualCheck(stopsForm.value).then((res: any) => {
          msgTitle.value = res.msg;
          msgType.value = res.success;
          if (res.success) {
            stopsForm.value.CheckResult = "OK";
            stopsForm.value.ContainerName = "";
            form.value = { ...res.content[0] };
            hisForm.value.MfgOrderName = res.content[0].MfgOrderName
            getHisData();
          } else {
            stopsForm.value.ContainerName = "";
            barCode.value = "";
          }
        });
      }
    } else {
      // console.log(barCodeData);

      badForm.value.containerName = barCodeData;
      // badVisible.value = true;
      let data1 = {
        containerName: barCodeData,
        orderName: form.value.MfgOrderName,
        workstationName: opui.station,
        userAccount: userStore.getUserInfo,
      };
      QueryDefectCode1(data1).then((res: any) => {
        //   console.log(res);
        if (!res.success) {
          msgTitle.value = res.msg;
          msgType.value = res.success;
          return;
        }
        badheadForm.value.MfgOrderName = res.content.MfgOrderName;
        badheadForm.value.ProductName = res.content.ProductName;
        badheadForm.value.ProductDesc = res.content.ProductDesc;
        badheadForm.value.Qty = res.content.Qty;
        badheadForm.value.PlannedstartDate = res.content.PlannedstartDate;
        badheadForm.value.PlannedCompletionDate =
          res.content.PlannedCompletionDate;
        BadtableData.value = res.content.defectCode;
        badVisible.value = true;
      });
    }
  }
  barCode.value = "";
};
const getMaterData = () => {
  QueryVendorInfo({
    ContainerName: materBarCode.value,
    workstationName: opui.station
  }).then((res: any) => {
    msgTitle.value = res.msg;
    msgType.value = res.success;
    barData.value = [res.content];
   
    if (res.success) {
      barMsg.value = "请扫描供应商批次条码"
     
    } else {
      msgTitle.value = res.msg;
      msgType.value = res.success;
    }
    if (res.content.UseQty == res.content.Qty) {
      msgTitle.value = `${materBarCode.value}条码数量已使用完`;
      msgType.value = false;
      barMsg.value = "请扫描屏条码/物料批次条码"
      barData.value = [];
      materBarCode.value = ""
     
      stopsForm.value.ContainerName = "";
      stopsForm.value.VendorContainer = "";
    }else{
      msgTitle.value = ``;
      msgType.value = true;
    }
    
  });
};
const getHisData = () => {
  QueryMoveTestRecord(hisForm.value).then((res: any) => {
    tableData.value = res.content;
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
    return tableData.value;
  }
});
const changeDataLength = (val: any) => {
  if (val == "today") {
    let dataLength = geTodayData();
    return dataLength.length;
  } else {
    return tableData.value.length;
  }
};
const geTodayData = () => {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  function getDateFromDateTimeString(dateTimeString: any) {
    return dateTimeString.split(" ")[0];
  }
  const todayDataArray = tableData.value.filter((item: any) => {
    return getDateFromDateTimeString(item.TxnDate) === todayString;
  });
  return todayDataArray;
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
  stopsForm.value.CheckResult = "OK";
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
      stopsForm.value.CheckResult = "OK";
      // inputRefs.value[0].focus();
      // getFocus();
    }
    ElNotification({
      title: "提示信息",
      message: res.msg,
      type: res.success ? "success" : "error",
    });
  });
};
const restData = () => {
  barData.value = []
  stopsForm.value.ContainerName = ""
  stopsForm.value.VendorContainer = ""
  hisForm.value.MfgOrderName = ""
  msgTitle.value = "重置成功";
  msgType.value = true;
  tableData.value = []
  form.value = {
    MfgOrderName: "",
    ProductName: "",
    ProductDesc: "",
    Qty: "",
    PlannedStartDate: "",
    PlannedCompletionDate: "",
    ERPOrder: "",
  }
  inputRef.value.focus();
}
const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 400;
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

.el-switch__label {
  font-weight: bold;
}

.switchok .el-switch__label.is-active {
  color: #13ce66;
}

.switchng .el-switch__label.is-active {
  color: #ff4949;
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
