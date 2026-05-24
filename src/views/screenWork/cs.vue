<template>
    <div class="flex flex-col w-full h-full">
      <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
        <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
        <el-button type="primary" @click="dialogVisible = true">不良品登记</el-button>
      </div>
      <div class="w-full flex-1 flex">
        <div class="setwidth w-[350px]">
          <div class="w-full h-full box">
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5">基本信息</span>
            </div>
            <div class="p-[10px]">
              <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
                <el-form-item v-for="f in formHeader" :key="f.value" :label="f.label">
                  <span class="font-bold text-lg leading-[30px]" :class="f.value == 'passNum' ? 'text-[#00B400]' : ''">
                    {{ formText(f.value) }}</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="w-[calc(100%-350px)]">
          <!-- <div class="w-full"> -->
          <div class="w-full h-full flex flex-col">
            <div>
              <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                <span class="ml-5"> 扫描条码</span>
              </div>
              <div class="h-[120px] pt-3 pr-5 pl-5">
                <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                  @submit.native.prevent>
                  <el-form-item label="扫描条码" class="mb-2">
                    <el-input v-model.trim="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 500px"
                      placeholder="请扫描MES屏条码或供应商条码" @keyup.enter.native="getChange" />
                  </el-form-item>
                <el-form-item :class="[stopsForm.result == 'OK' ? 'switchok' : 'switchng']" class="mb-2">
                  <el-switch v-model="stopsForm.result" size="large" style="
                      zoom: 1.2;
                      --el-switch-on-color: #ff4949;
                      --el-switch-off-color: #13ce66;
                    " :active-value="'NG'" :inactive-value="'OK'" active-text="NG" inactive-text="OK" />
                </el-form-item>
                </el-form>
                <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                  {{ msgTitle === "" ? "请扫描MES屏条码" : msgTitle }}
                </div>
                <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                  {{ msgTitle }}
                </div>
              </div>
            </div>
  
            <div class="flex flex-col flex-1 tabs-css">
              <!-- <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                <span class="ml-5">历史过站记录</span>
              </div>
              <table-tem :showIndex="true" :tableData="tableData1" :tableHeight="tableHeight" :columnData="columnData1"
                :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"></table-tem> -->
                
            <el-tabs v-model="tabsValue" type="border-card" class="demo-tabs">
              <el-tab-pane label="历史过站记录" name="history" :stretch="true">
                <table-tem
                  :showIndex="true"
                  :tableData="tableData1"
                  :tableHeight="tableHeight"
                  :columnData="columnData1"
                  :pageObj="pageObj"
                  @handleSizeChange="handleSizeChange"
                  @handleCurrentChange="handleCurrentChange"
                ></table-tem>
              </el-tab-pane>
            </el-tabs>
            </div>
          </div>
        </div>
      </div>
      <el-dialog :close-on-press-escape="false" align-center :close-on-click-modal="false" title="不良品登记"
        v-model="dialogVisible" width="80%" @close="">
        <div>
            <div class="h-[30px] flex items-center text-base text-[#fff] bg-[#006487]">
                <span class="ml-5">基本信息</span>
            </div>
            <el-form class="pt-2" ref="formRef" :inline="true" :model="form" label-width="auto">
                <el-form-item v-for="f in formHeader1" :key="f.value" :label="f.label" :prop="f.value">
                    <el-input v-if="f.type == 'input' || f.type === 'password'" v-model="registrationForm[f.value]" :type="f.type"
                        :disabled="f.disabled" :placeholder="'请输入' + f.label" :style="{ width: f.width + 'px' }" />
                    <el-input v-if="f.type == 'textarea'" v-model="form[f.value]" :type="f.type" :disabled="f.disabled"
                        :placeholder="'请输入' + f.label" :style="{ width: f.width + 'px' }" />
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-tabs v-model="tabsValue1" type="border-card" class="demo-tabs">
                <el-tab-pane label="不良信息" name="bl" :stretch="true">
                    <div class="mb-2">
                        <el-button type="primary" @click="">增加</el-button>
                        <el-button type="danger"
                            @click="">删除</el-button>
                    </div>
                    <el-table :data="[]" stripe border fit :style="{ width: '100%' }" :height="260"
                        @selection-change="">
                        <el-table-column type="selection" width="55" />
                        <el-table-column type="index" align="center" label="序号" width="60" />
                        <el-table-column prop="badCode" label="不良代码" />
                        <el-table-column prop="badCodeDec" label="不良代码描述" />
                        <el-table-column prop="backProcess" label="快修返回工序" />
                        <el-table-column prop="remark" label="备注" />
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="">取消</el-button>
                <el-button type="primary" @click="">确定</el-button>
            </span>
        </template>

    </el-dialog>
    </div>
  </template>
  
  <script lang="ts" setup>
  import tableTem from "@/components/tableTem/index.vue";
  import badInfoTem from "@/components/badInfoTem/index.vue";
  import formTem from "@/components/formTem/index.vue";
  import feedTemp from "@/components/feedTemp/index.vue";
  import selectTa from "@/components/selectTable/index.vue";
  import { useAppStore } from "@/stores/modules/app";
  import { useUserStoreWithOut } from "@/stores/modules/user";
  import { checkStringType } from "@/utils/barcodeFormat";
  import type { Formspan, FormHeader, OrderData, registrationFormTS } from "@/typing";
  import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
  import { QueryMoveHistory } from "@/api/dipApi";
  import { PressingStationMoveOut } from "@/api/asyApi";
  import {
    ref,
    reactive,
    onMounted,
    nextTick,
    computed,
    onBeforeMount,
    onBeforeUnmount,
  } from "vue";
  interface StopsForm {
    containerName: string;
    workstationName: string;
    result: string;
    userAccount: string;
    txnDate: string;
  }
  
  interface ToolList {
    WorkStationName: string;
    OrderNumber: string;
    ToolName: string;
    sort: number;
    MaterialName: string;
    CompName: string;
  }

  const appStore = useAppStore();
  const userStore = useUserStoreWithOut();
  const opui = appStore.getOPUIReal();
  const inputRef = ref();
  const inputFocus = ref(true);
  const barCode = ref("");
  const dialogVisible = ref(false);
  const materialTable = ref<any[]>([]);
  const editVisible = ref(false);
  const badVisible = ref(false);
  const tabsValue = ref("history");
  const tabsValue1 = ref('bl')
  const stopsForm = ref<StopsForm>({
    containerName: "",
    workstationName: opui.station || "",
    userAccount: userStore.getUserInfo,
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
  });

  const registrationForm = ref<InstanceType<typeof registrationFormTS>>({
    SN: "",
    MfgOrderName: "",
    ProductName: "",
    ProductDesc: "",
    Qty: "",
    PlannedStartDate: "",
    PlannedCompletionDate: "",
    station: ""
  });
  
  const badForm = ref({
    badCode: "",
    badCodeDec: "",
    backProcess: "",
    remark: "",
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
      label: "产品编码",
      value: "ProductName",
      disabled: true,
      type: "input",
      width: "",
    },
    {
      label: "产品描述",
      value: "Description",
      disabled: true,
      type: "textarea",
      width: 300,
    },
    {
      label: "计划数量",
      value: "Qty",
      disabled: true,
      type: "input",
      width: "",
    },
    {
      label: "过站数量",
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
      label: "MES凭条码",
      width: "",
      align: "1",
    },
  
    {
      text: true,
      prop: "BD_EmployeeName",
      label: "CG/TP条码",
      width: "",
      align: "1",
    },
    {
      text: true,
      prop: "TxnDate",
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
      label: "扫描人",
      width: "",
      align: "1",
    },
  ]);
  
  const formHeader1 = reactive<InstanceType<typeof FormHeader>[]>([
    {
      label: "MES凭条码",
      value: "MfgOrderName",
      disabled: true,
      type: "input",
      width: "",
    },
    {
      label: "生产计划号",
      value: "order",
      disabled: true,
      type: "input",
      width: "",
    },
    {
      label: "产品机型",
      value: "models",
      disabled: true,
      type: "input",
      width: "",
    },
    {
      label: "产品编码",
      value: "productCode",
      disabled: true,
      type: "input",
      width: "",
    },
    {
      label: "产品描述",
      value: "productDes",
      disabled: true,
      type: "textarea",
      width: 300,
    },
    {
      label: "不良工位",
      value: "station",
      disabled: true,
      type: "input",
      width: "",
    },
  ]);
  
  const list = ref([
    {
      key: "切料刀缺口",
      value: "E208711",
    },
    {
      key: "划痕",
      value: "E208715",
    },
  ]);
  
  const BadtableData = ref([
    {
      badCode: "E208711",
      badCodeDec: "切料刀缺口",
      backProcess: "总成外观",
      remark: "Test",
    },
    {
      badCode: "E208711",
      badCodeDec: "切料刀缺口",
      backProcess: "总成外观",
      remark: "测试",
    },
  ]);
  
  const materialColumnData = reactive([
    {
      text: true,
      prop: "ContainerName",
      label: "版本信息",
      width: "",
      align: "1",
    },
  
    {
      text: true,
      prop: "BD_EmployeeName",
      label: "对比结果",
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
  
  const materialPageObj = ref({
    pageSize: 1000000,
    currentPage: 1,
    isShow: -1,
  });
  
  const msgTitle = ref("");
  const msgType = ref(true);
  const hisForm = ref({
    MfgOrderName: "",
    workstationName: opui.station,
  });
  
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
  
  //打开不良登记
  const openDialog = () => {
    editVisible.value = true;
  };
  
  //关闭不良登记
  const editCancel = () => {
    // BadtableData.value = [];
    // console.log(BadtableData.value);
    editVisible.value = false;
  };
  
  //提交不良信息
  const editSubmit = () => {
    console.log(BadtableData.value);
    editVisible.value = false;
  };
  //删除不良信息
  const deleteBad = (data: any) => {
    // BadtableData.value = BadtableData.value.filter((v: any) => {
    //   return data[0].badCode != v.badCode;
    // });
  };
  
  //打开不良登记
  const openAddBad = () => {
    badVisible.value = true;
  };
  //增加不良信息
  const addBadData = (data: any) => {
    BadtableData.value.push(data);
    // console.log(data);
  };
  
  //获取过站历史记录
  const getHisData = () => {
    QueryMoveHistory(hisForm.value).then((res: any) => {
      tableData1.value = res.content;
    });
  };
  
  //过站
  const getChange = () => {
    let barCodeData = barCode.value;
    stopsForm.value.containerName = barCodeData;
    PressingStationMoveOut(stopsForm.value).then((res: any) => {
      msgTitle.value = res.msg;
      msgType.value = res.success;
      stopsForm.value.containerName = "";
      form.value = { ...res.content[0] };
  
      // hisForm.value.MfgOrderName = res.content[0].MfgOrderName;
      getFocus();
      // getHisData();
    });
    barCode.value = "";
  };
  
  //分页
  const handleSizeChange = (val: any) => {
    pageObj.value.currentPage = 1;
    pageObj.value.pageSize = val;
  };
  const handleCurrentChange = (val: any) => {
    pageObj.value.currentPage = val;
  };
  
  //分页
  const materialSizeChange = (val: any) => {
    materialPageObj.value.currentPage = 1;
    materialPageObj.value.pageSize = val;
  };
  const materialCurrentChange = (val: any) => {
    materialPageObj.value.currentPage = val;
  };
  
  const getScreenHeight = () => {
    nextTick(() => {
      tableHeight.value = window.innerHeight - 365;
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
  