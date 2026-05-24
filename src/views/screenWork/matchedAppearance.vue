
<template>
    <div class="flex flex-col w-full h-full">
      <div
        class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center"
      >
        <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
        <div></div>
      </div>
      <div class="w-full flex-1 flex">
        <div class="setwidth w-[350px]">
          <div class="w-full h-full box">
            <div
              class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
            >
              <span class="ml-5">基本信息</span>
            </div>
            <div class="p-[10px]">
              <el-form
                class="inbound"
                ref="formRef"
                :model="form"
                label-width="auto"
              >
                <el-form-item
                  v-for="f in formHeader"
                  :key="f.value"
                  :label="f.label"
                >
                  <span
                    class="font-bold text-lg leading-[30px]"
                    :class="f.value == 'passNum' ? 'text-[#00B400]' : ''"
                  >
                    {{ formText(f.value) }}</span
                  >
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="w-[calc(100%-350px)]">
          <!-- <div class="w-full"> -->
          <div class="w-full h-full flex flex-col">
            <div>
              <div
                class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
              >
                <span class="ml-5"> 扫描条码</span>
              </div>
              <div class="h-[120px] pt-3 pr-5 pl-5">
                <el-form
                  class="inbound"
                  ref="formRef"
                  :inline="true"
                  :model="form"
                  label-width="auto"
                  @submit.native.prevent
                >
                  <el-form-item label="扫描条码" class="mb-2">
                    <el-input
                      v-model.trim="barCode"
                      ref="inputRef"
                      :autofocus="inputFocus"
                      style="width: 500px"
                      placeholder="请扫描条码"
                      @keyup.enter.native="getChange"
                    />
                  </el-form-item>
                  <el-form-item
                    :class="[stopsForm.result == 'OK' ? 'switchok' : 'switchng']"
                    class="mb-2"
                  >
                    <el-switch
                      v-model="stopsForm.result"
                      size="large"
                      style="
                        zoom: 1.2;
                        --el-switch-on-color: #ff4949;
                        --el-switch-off-color: #13ce66;
                      "
                      :active-value="'NG'"
                      :inactive-value="'OK'"
                      active-text="NG"
                      inactive-text="OK"
                    />
                  </el-form-item>
                  <!-- <el-form-item label="当前扫描治具" class="mb-2">
                    <el-input v-model.trim="ToolName" disabled />
                  </el-form-item> -->
                </el-form>
                <div
                  class="text-xl font-bold text-[#00B400]"
                  v-show="msgType === true || msgTitle === ''"
                >
                  {{ msgTitle === "" ? "请扫描PCB条码" : msgTitle }}
                </div>
                <div
                  class="text-xl font-bold text-[red]"
                  v-show="msgType === false && msgTitle !== ''"
                >
                  {{ msgTitle }}
                </div>
              </div>
            </div>
  
            <div class="flex flex-col flex-1 tabs-css">
              <el-tabs v-model="tabsValue" type="border-card" class="demo-tabs">
                <el-tab-pane label="历史过站记录" name="mes" :stretch="true">
                  <table-tem
                    :showIndex="true"
                    :tableData="tableData"
                    :tableHeight="tableHeight"
                    :columnData="columnData1"
                    :pageObj="pageObj"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                  ></table-tem>
                </el-tab-pane>
                <!-- <el-tab-pane label="工装治具" name="tool" :stretch="true">
              <table-tem :showIndex="true" :tableData="tableData" :tableHeight="tableHeight" :columnData="columnData1"
                :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"></table-tem>
                </el-tab-pane> -->
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        v-model="badVisible"
        title="不良登记"
        width="60%"
        :append-to-body="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        align-center
        @close="badCancel"
      >
        <div>
          <div>
            <div
              class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]"
            >
              基本信息
            </div>
            <el-form ref="badFormRef" :model="badheadForm" label-width="auto">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="MES屏条码" class="mb-[5px] flex">
                    <el-input
                      v-model="badForm.containerName"
                      style="width: 160px"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="工单" class="mb-[5px] flex">
                    <el-input
                      v-model="badheadForm.MfgOrderName"
                      style="width: 160px"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                  <el-form-item class="mb-[5px]" label="机型">
                    <el-input
                      v-model="badheadForm.ProductName"
                      style="width: 160px"
                      disabled
                    /> </el-form-item
                >
                </el-col> -->
                <el-col :span="6">
                  <el-form-item class="mb-[5px]" label="产品编码">
                    <el-input
                      v-model="badheadForm.ProductName"
                      style="width: 160px"
                      disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item class="mb-[5px]" label="产品描述">
                    <el-input
                      v-model="badheadForm.ProductDesc"
                      style="width: 500px"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                  <el-form-item class="mb-[5px]" label="不良工位">
                    <el-input v-model="opui.station" style="width: 160px" disabled />
                  </el-form-item>
                </el-col> -->
              </el-row>
            </el-form>
          </div>
          <div>
            <div
              class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]"
            >
              不良原因
            </div>
            <!-- <table-tem
              :showIndex="true"
              :show-select="true"
              :tableData="BadtableData"
              :tableHeight="300"
              :columnData="badColumn"
              :pageObj="badpageObj"
              @handleSelectionChange="handleSelectionChange"
            ></table-tem> -->
            <el-table
              :data="BadtableData"
              size="small"
              :height="300"
              :tooltip-effect="'dark'"
              border
              fit
              highlight-current-row
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="isDefectReasonName" label="不良代码" />
              <el-table-column prop="isDefectReasonDesc" label="不良描述" />
              <el-table-column prop="Comment" label="备注">
                <template #default="scope">
                  <el-input v-model="scope.row.Comment"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
  
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="badCancel">取消</el-button>
            <el-button type="primary" @click="badSubmit"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script lang="ts" setup>
  import tableTem from "@/components/tableTem/index.vue";
  // import badInfoTem from "@/components/badInfoTem/index.vue";
  // import formTem from "@/components/formTem/index.vue";
  // import feedTemp from "@/components/feedTemp/index.vue";
  // import selectTa from "@/components/selectTable/index.vue";
  import { useAppStore } from "@/stores/modules/app";
  import { useUserStoreWithOut } from "@/stores/modules/user";
  import { checkStringType } from "@/utils/barcodeFormat";
  import type { Formspan, FormHeader, OrderData } from "@/typing";
  import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
  import {
    FitsTheLookMoveOut,
    FTLDefectProductRecord,
    MAQueryDefectCode
  } from "@/api/scrApi";
  
  import {
    ref,
    reactive,
    onMounted,
    nextTick,
    computed,
    onBeforeMount,
    onBeforeUnmount,
    watch,
  } from "vue";
  import { cloneDeep } from "lodash-es";
  interface StopsForm {
    containerName: string;
    workstationName: string;
    result: string;
    userAccount: string;
    txnDate: string;
  }
  interface Defect {
    isDefectReason: string;
    Comment:string;
    isDefectType: number | string;
  }
  interface BadForm {
    tools: string;
    containerName: string;
    DefectDetails: Array<Defect>;
    workstationName: string;
    userAccount: string;
  }
  
  const appStore = useAppStore();
  const userStore = useUserStoreWithOut();
  const opui = appStore.getOPUIReal();
  const inputRef = ref();
  const inputFocus = ref(true);
  const barCode = ref("");
  const loginName = userStore.getUserInfo;
  const tabsValue = ref("mes");
  const ToolName = ref("");
  const stopsForm = ref<StopsForm>({
    containerName: "",
    workstationName: opui.station || "",
    userAccount: userStore.getUserInfo,
    txnDate: "",
    result: "OK",
  });
  
  const badVisible = ref(false);
  const form = ref<InstanceType<typeof Formspan>>({
    MfgOrderName: "",
    ProductName: "",
    ProductDesc: "",
    Qty: "",
    PlannedStartDate: "",
    PlannedCompletionDate: "",
  });
  const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
    {
      label: "工单号",
      value: "MfgOrderName",
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
    {
      label: "计划开始",
      value: "PlannedStartDate",
      disabled: true,
      type: "input",
      width: "",
    },
    {
      label: "计划完成",
      value: "PlannedCompletionDate",
      disabled: true,
      type: "input",
      width: "",
    },
    {
      label: "工单数量",
      value: "Qty",
      disabled: true,
      type: "input",
      width: "",
    },
  ]);
  
  const columnData1 = reactive([
    {
      text: true,
      prop: "ContainerName",
      label: "MES屏条码",
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
    {
      text: true,
      prop: "userAccount",
      label: "扫描人",
      width: "",
      align: "1",
    },
  ]);
  const columnData = reactive([
    {
      text: true,
      prop: "WorkStationName",
      label: "工站",
      width: "",
      align: "1",
    },
    {
      text: true,
      prop: "ToolName",
      label: "治具",
      width: "",
      align: "1",
    },
    {
      text: true,
      prop: "BD_EmployeeName",
      label: "LCM条码",
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
    {
      text: true,
      prop: "TxnDate",
      label: "扫描时间",
      width: "",
      align: "1",
    },
  ]);
  const tableData = ref<any[]>([]);
  const tableHeight = ref(0);
  const pageObj = ref({
    pageSize: 10,
    currentPage: 1,
  });
  const badheadForm = ref<InstanceType<typeof Formspan>>({
    MfgOrderName: "",
    ProductName: "",
    ProductDesc: "",
    Qty: "",
    PlannedStartDate: "",
    PlannedCompletionDate: "",
  });
  const badForm = ref<BadForm>({
    tools: "",
    containerName: "",
    DefectDetails: [],
    workstationName: opui.station || "",
    userAccount: userStore.getUserInfo,
  });
  //不良信息table
  const BadtableData = ref([
    //   {
    //     isDefectReasonName: "s004",
    //     isDefectReasonDesc: "少件",
    //   },
  ]);
  
  const badpageObj = ref({
    pageSize: 10,
    currentPage: 1,
    isShow: -1,
  });
  const badColumn = reactive([
    {
      text: true,
      prop: "isDefectReasonName",
      label: "不良代码",
      width: "",
      min: true,
      align: "center",
    },
    {
      text: true,
      prop: "isDefectReasonDesc",
      label: "不良代码描述",
      width: "",
      min: true,
      align: "center",
    },
    {
      text: true,
      prop: "isDefectReasonDesc",
      label: "快修返回工序",
      width: "",
      min: true,
      align: "center",
    },
    {
      text: true,
      prop: "isDefectReasonDesc",
      label: "备注",
      width: "",
      min: true,
      align: "center",
    },
  ]);
  const changeList = ref([]);
  const msgTitle = ref("");
  const msgType = ref(true);
  const leftBoxH = ref(0);
  const hisForm = ref({
    MfgOrderName: "",
    workstationName: opui.station,
  });
const tablebox = ref()
onBeforeMount(() => {
    getScreenHeight();
  });
  onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    // getOrderData();
    getFocus();
  });
  onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
  });
  
  watch(
    () => stopsForm.value.result,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        msgTitle.value = "";
        msgType.value = true;
      }
    },
    { deep: true, immediate: true }
  );
  
  //获取光标
  const getFocus = () => {
    inputFocus.value = false;
    setTimeout(() => {
      inputFocus.value = true;
    }, 100);
  };
  //获取过站历史记录
  const getHisData = () => {
    // QueryMoveHistory(hisForm.value).then((res:any)=>{
    //   tableData.value=res.content
    // })
  };
  
  const formText = (data: string) => {
    let key = data as keyof typeof form;
    return form.value[key];
  };
  
  const handleSelectionChange = (data: any) => {
    let content = cloneDeep(data);
    changeList.value = content;
  };
  
  //不良登记取消
  const badCancel = () => {
    badVisible.value = false;
    BadtableData.value = [];
    changeList.value = [];
    badForm.value.DefectDetails = [];
    stopsForm.value.result = "OK";
  };
  //不良登记提交
  const badSubmit = () => {
    changeList.value.forEach((c: any) => {
      badForm.value.DefectDetails.push({
        isDefectReason: c.isDefectReasonName,
        Comment:c.Comment,
        isDefectType: 1,
      });
    });
    console.log(badForm.value);
    FTLDefectProductRecord(badForm.value).then((res: any) => {
      msgTitle.value = "";
      msgType.value = true;
      if (res.success) {
        badVisible.value = false;
        BadtableData.value = [];
        changeList.value = [];
        badForm.value.DefectDetails = [];
        stopsForm.value.result = "OK";
        getFocus();
      }
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: res.success ? "success" : "error",
      });
    });
  };
  
  //过站
  const getChange = () => {
    let barCodeData = barCode.value;
      stopsForm.value.containerName = barCodeData;
      // console.log(stopsForm.value.result);
      if (stopsForm.value.result == "OK") {
        FitsTheLookMoveOut({
          containerName: barCodeData,
          workstationName: opui.station,
          tools: ToolName.value,
          userAccount: loginName,
        }).then((res: any) => {
          msgTitle.value = res.msg;
          msgType.value = res.success;
          stopsForm.value.containerName = "";
          form.value = { ...res.content[0] };
          hisForm.value.MfgOrderName = res.content[0].MfgOrderName;
          tableData.value.unshift({
            ContainerName: barCodeData,
            TxnDate: getDate(),
            userAccount: loginName,
          });
          getHisData();
          getFocus();
          // if (res.success) {
          stopsForm.value.result = "OK";
        });
      } else {
        badForm.value.containerName = barCodeData;
        // badVisible.value = true;
        MAQueryDefectCode(stopsForm.value.containerName).then((res: any) => {
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
          badheadForm.value.PlannedCompletionDate = res.content.PlannedCompletionDate;
          BadtableData.value = res.content.defectCode;
          badVisible.value = true;
        });
      };
    barCode.value = "";
  };
  
  const getDate = () => {
    const now = new Date();
  
    const formattedDate =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(now.getDate()).padStart(2, "0")} ` +
      `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    return formattedDate;
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
      leftBoxH.value = window.innerHeight - 155;
      tableHeight.value = window.innerHeight - 375;
    });
  };
  </script>
  
  <style lang="scss">
  .inbound .el-form-item__label {
    font-size: 16px;
  }
  
  .setwidth {
    flex: 0 0 350px;
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
  
  .tabs-css .el-tabs--border-card > .el-tabs__header .el-tabs__item {
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
  
  .tabs-css
    .el-tabs--border-card
    > .el-tabs__header
    .el-tabs__item:not(.is-disabled):hover {
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
  

