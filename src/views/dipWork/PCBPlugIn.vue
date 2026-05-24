<template>
  <div class="flex flex-col w-full h-full">
    <!-- <div class="h-[40px] pl-2 pr-2 flex justify-between items-center">
      <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
      <div>
        <el-button type="warning" @click="opendetail">工单物料明细</el-button>
        <el-button type="primary" @click="openOver">波峰焊设置</el-button>
      </div>
    </div> -->
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[350px]">
        <div class="w-full h-full box">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">工装治具</span>
          </div>
          <div>
          <el-scrollbar :height="leftBoxH + 'px'" >
            <div class="p-3">
          <!-- <div class="p-3 overflow-y-auto" :style="{ height: leftBoxH + 'px' }" ref="listContainer"> -->
            <el-checkbox-group v-model="checked">
              <el-card shadow="always" class="mb-2" :class="{ 'active': t.ToolName === checked[0] }"
                :body-style="{ padding: '8px' }" v-for="t in toolList" :key="t.ToolName">
                <el-form ref="formRef" :model="t" label-width="auto">
                  <!-- <el-form-item class="mb-[5px]"> -->
                  <div class="flex justify-between items-center">
                    <!-- <div class="checked">
                      <el-checkbox :value="t.ToolName" @change="changeCheck(t.ToolName)" />
                    </div> -->
                    <!-- <el-tooltip effect="dark" content="上移" placement="top-start">
                      <el-button icon="Top" circle :disabled="t.sort == 1" @click="moveUp(t)" />
                    </el-tooltip> -->
                  </div>
                  <!-- </el-form-item> -->
                  <el-row :gutter="10">
                    <el-col :span="14">
                      <el-form-item label="类型" class="mb-[5px]">
                        <span>{{ t.MaterialName }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="序号" class="mb-[5px]">
                        <el-tag type="warning" class="pl-3 pr-3 text-xs" effect="dark"
                          v-if="t.ToolName == checked[0]">{{ t.sort }}</el-tag>
                        <el-tag type="primary" class="pl-3 pr-3" v-if="t.ToolName !== checked[0]">{{ t.sort }}</el-tag>
                        <!-- <span class="text-base">{{ t.sort }}</span> -->
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-form-item label="治具编码" class="mb-[5px]">
                    <span>{{ t.ToolName }}</span>
                  </el-form-item>

                  <!-- <el-row :gutter="20">
                    
                    <el-col :span="12">
                      <el-form-item label="类型编号" class="mb-[5px]">
                        <span class="text-base">{{ t.CompName }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row> -->
                </el-form>
                <div class="flex justify-end">
                  <!-- <el-tooltip
                    effect="dark"
                    content="上移"
                    placement="top-start"
                  >
                    <el-button
                      icon="Top"
                      circle
                      :disabled="t.sort == 1"
                      @click="moveUp(t)"
                    />
                  </el-tooltip> -->

                  <!-- <el-icon :size="20" @click="moveUp(t)"><Top /></el-icon> -->
                  <!-- <el-button type="primary" :disabled="t.sort==1" @click="moveUp(t)">上移</el-button> -->
                </div>
              </el-card>
            </el-checkbox-group>
          </div>
           </el-scrollbar>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-350px)]">
        <div class="w-full h-full flex flex-col">
          <div>
            <div class="h-[35px] flex justify-between items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5"> 扫描条码</span>
              <div>
                <el-button type="warning" @click="toolsVisible = true">工治具解绑</el-button>
                <el-button color="#626aef" plain @click="toolNewVisible = true">工治具更换</el-button>
              </div>
            </div>
            <div class="h-[150px] pt-3 pr-5 pl-5 flex">
              <div>
                <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                  @submit.native.prevent>
                  <el-form-item label="扫描条码">
                    <el-input v-model.trim="barCode" ref="inputRef" :autofocus="inputFocus" style="width: 500px"
                      placeholder="请扫描PCB条码或治具编码" @keyup.enter.native="getChange" />
                  </el-form-item>
                </el-form>
                <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                  {{ msgTitle === "" ? "请扫描PCB条码或治具编码" : msgTitle }}
                </div>
                <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                  {{ msgTitle }}
                </div>
              </div>
              <div>
                <el-table :data="detailsData" stripe border fit size="small" :height="140" :style="{ width: '100%' }"
                  :tooltip-effect="'dark'">
                  <el-table-column label="序号" width="50" type="index" align="center" />
                  <el-table-column prop="MaterialName" label="物料编码" width="120" />
                  <el-table-column prop="MaterialDesc" label="物料描述" width="250" :show-overflow-tooltip="true" />
                  <el-table-column prop="LoadQueueQty" label="上料总数" width="80" align="center" />
                  <el-table-column label="剩余数量" width="80" align="center">
                    <template #default="scope">
                      <span>{{
                        scope.row.Qty
                      }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- <tableTemp size="small" :showIndex="true" :tableData="detailsData" :tableHeight="140" :columnData="detailsColumn"><</tableTemp> -->
              </div>
            </div>
            <div class="p-1 pl-1">
              <el-form class="inbound" size="default" ref="formRef" :model="form" :inline="true" label-width="auto">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="生产计划号" class="mb-[5px]">
                      <div class="flex items-center">
                        <selectTa ref="selectTable" :table="orderTable" :selectWidth="150" :columns="orderColumns"
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
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="mb-[5px]" label="产品机型">
                      <span class="text-base font-bold">{{
                        form.BD_ProductModel
                      }}</span>
                      <!-- <el-input v-model="form.BD_ProductModel" style="width: 160px" disabled /> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item class="mb-[5px]" label="工单号">
                      <span class="text-base font-bold">{{
                        form.ERPOrder
                      }}</span>
                      <!-- <el-input v-model="form.ERPOrder" style="width: 160px" disabled /> -->
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item class="mb-[5px]" label="计划数量">
                      <span class="text-base font-bold">{{ form.Qty }}</span>
                      <!-- <el-input v-model="form.Qty" style="width: 160px" disabled /> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="mb-[5px]" label="产品编码">
                      <span class="text-base font-bold">{{
                        form.ProductName
                      }}</span>
                      <!-- <el-input v-model="form.ProductName" style="width: 160px" disabled /> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item class="mb-[5px]" label="产品描述">
                      <span class="text-base font-bold">{{
                        form.ProductDesc
                      }}</span>
                      <!-- <el-input v-model="form.ProductDesc" style="width: 340px" disabled /> -->
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- <el-form-item class="mb-[5px]" label="产品描述">
                          <span class="text-base">{{ form.ProductDesc }}</span>
                        </el-form-item> -->
              </el-form>
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
            <table-tem :showIndex="true" :tableData="changeData" :tableHeight="tableHeight" :columnData="columnData1"
              :pageObj="pageObj" @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"></table-tem>  
          </div>
        </div>
      </div>
    </div>

    <formTem ref="addOverRef" :width="'400px'" :visible="overAddVisible" :title="'波峰焊过序设置'" :form="overAddForm"
      :formHeader="overHeader" @formCancel="addOverCancel" @onSubmit="addOveronSubmit"></formTem>
    <el-dialog v-model="detailVisible" title="上料明细" width="70%" align-center draggable :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" @close="detailVisible = false">
      <table-tem :showIndex="true" size="small" :tableData="detailsData" :tableHeight="400" :columnData="detailsColumn"
        :pageObj="detailsPageObj" @handleSizeChange="detailsSizeChange"
        @handleCurrentChange="detailsCurrentChange"></table-tem>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailVisible = false">关闭</el-button>
        </span>
      </template> -->
    </el-dialog>
    <el-dialog v-model="toolsVisible" draggable title="工治具解绑" width="500px" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" align-center @open="toolsOpen" @close="toolsCancel">
      <el-form ref="formRef" :model="form" label-width="auto" @submit.native.prevent>
        <el-form-item label="治具编码">
          <el-input v-model="tools" ref="inputToolRef" @keyup.enter.native="getToolChange" />
        </el-form-item>
      </el-form>
      <div class="text-xl font-bold text-[#00B400]" v-show="msgToolType === true || msgToolTitle === ''">
        {{ msgToolTitle === "" ? "请扫描治具编码" : msgToolTitle }}
      </div>
      <div class="text-xl font-bold text-[red]" v-show="msgToolType === false && msgToolTitle !== ''">
        {{ msgToolTitle }}
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="toolsCancel">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="toolNewVisible" draggable title="工治具更换" width="500px" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" align-center @open="toolNewOpen"
      @close="toolNewCancel">
      <el-form ref="toolNewFormRef" :model="toolNewForm" label-width="auto" @submit.native.prevent>
        <el-form-item label="旧治具编码" prop="FromTools">
          <el-input v-model="toolNewForm.FromTools" ref="toolOldRef" @keyup.enter.native="getToolOld" />
        </el-form-item>
        <el-form-item label="新治具编码" prop="ToTools">
          <el-input v-model="toolNewForm.ToTools" ref="toolNewRef" @keyup.enter.native="getToolNew" />
        </el-form-item>
      </el-form>
      <div class="text-xl font-bold text-[#f48000]">
        {{ barMsg }}
      </div>
      <div class="text-xl font-bold text-[#00B400]" v-show="msgNewType === true || msgNewTitle === ''">
        {{ msgNewTitle }}
      </div>
      <div class="text-xl font-bold text-[red]" v-show="msgNewType === false && msgNewTitle !== ''">
        {{ msgNewTitle }}
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="toolNewCancel">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import tableTem from "@/components/tableTem/index.vue";
import formTem from "@/components/formTem/index.vue";
import selectTa from "@/components/selectTable/index.vue";
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import type { Formspan, FormHeader, OrderData } from "@/typing";
import { checkStringType } from "@/utils/barcodeFormat";
import { ElNotification } from "element-plus";
import {
  OrderQuery,
  PluginStationMoveOut,
  FindAllDevice,
  UpdateDevice,
  PIQueryMoveHistory,
  UnbindTools,
  AgainBindTools
  // QueryOrderMaterialRequired,
} from "@/api/dipApi";
import {
  QueryOrderMaterialRequired,
} from "@/api/smtApi";


import { QueryToolInfo, SortTools } from "@/api/operate";
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
interface StopsForm {
  tools: string;
  ContainerName: string;
  // OrderNumber: string;
  workstationName: string;
  userAccount: string;
  orderName: string;
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
const stopsForm = ref<StopsForm>({
  tools: "",
  ContainerName: "",
  // OrderNumber: "",
  orderName: "",
  workstationName: opui.station || "",
  userAccount: userStore.getUserInfo,
});
const tabsValue = ref("history");
const editVisible = ref(false);
const badVisible = ref(false);
const form = ref<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  Qty: "",
  PlannedStartDate: "",
  PlannedCompletionDate: "",
  ERPOrder: "",
  BD_ProductModel: "",
  // AllNum: "",
  // TodayNum: "",
});
const editForm = ref({
  order: "1213434",
  models: "3A4621-01C",
  productCode: "24010606000131",
  productDes: "0402封装贴片电容 100pF ±5% 50V MURATA GRM1555C1H101JA01D",
  // orderNum: '100',
});
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
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
    label: "计划数量",
    value: "Qty",
    disabled: true,
    type: "input",
    width: "",
  },
]);
const formHeader1 = reactive<InstanceType<typeof FormHeader>[]>([
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
]);
const columnData1 = reactive([
  {
    text: true,
    prop: "ContainerName",
    label: "PCB条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "Tool",
    label: "治具编码",
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
const badForm = ref({
  badCode: "",
  badCodeDec: "",
  backProcess: "",
  remark: "",
});
//不良信息table
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
const msgTitle = ref("");
const msgType = ref(true);
//过序设置
const overVisible = ref(false);
//过序table
// const overTableData = ref([]);
//
const addOverRef = ref();
// const editOverRef = ref();
//过序添加
const overAddVisible = ref(false);
//过序编辑
// const overEditVisible = ref(false);
//过序添加form
const overAddForm = ref({
  ID: "",
  Line: opui.line,
  WorkStation: opui.station,
  LineDec: opui.lineDec,
  WorkStationDec: opui.stationDec,
  NextWorkStation: "",
  NextDevice: "",
  InDeviceLength: 0,
  InDeviceSpeed: 0,
  OutDeviceLength: 0,
  OutDeviceSpeed: 0,
  UpdataDate: "2024-08-09T02:15:38.582Z",
  UpdateBy: userStore.getUserInfo || "",
});
//过序formHeader
const overHeader = reactive([
  {
    label: "产线",
    value: "LineDec",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "工位",
    value: "WorkStationDec",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "进炉距离(cm)",
    value: "InDeviceLength",
    disabled: false,
    type: "inputNumber",
    width: "",
  },
  {
    label: "进炉轨道速度(s/cm)",
    value: "InDeviceSpeed",
    disabled: false,
    type: "inputNumber",
    width: "",
  },
  {
    label: "炉子宽度(cm)",
    value: "OutDeviceLength",
    disabled: false,
    type: "inputNumber",
    width: "",
  },
  {
    label: "炉子轨道速度(s/cm)",
    value: "OutDeviceSpeed",
    disabled: false,
    type: "inputNumber",
    width: "",
  },
]);
const toolList = ref<ToolList[]>([]);
const getToolForm = ref({
  ToolName: "",
  OrderNumber: "",
  OperateType: "3",
  CompName: "",
  workstationName: opui.station,
  userAccount: userStore.getUserInfo,
});
const defaultSelectVal = ref<string[]>([]);
const checked = ref<string[]>([]);
const leftBoxH = ref(0);
const detailsData = ref([]);
const detailsPageObj = ref({
  pageSize: 100,
  currentPage: 1,
});

const detailsColumn = ref([
  {
    text: true,
    prop: "MaterialName",
    label: "物料编码",
    width: "",
    align: "1",
    min: true,
  },
  {
    text: true,
    prop: "MaterialDesc",
    label: "物料描述",
    width: "250",
    min: true,
    align: "1",
  },

  {
    text: true,
    prop: "LoadQueueQty",
    label: "上料数量",
    width: "",
    min: true,
    align: "1",
  },

  {
    text: true,
    prop: "level",
    label: "剩余数量",
    width: "",
    min: true,
    align: "1",
  },
  // {
  //   text: true,
  //   prop: "level",
  //   label: "最后上料时间",
  //   width: "",
  //   min: true,
  //   align: "1",
  // },
  // {
  //   text: true,
  //   prop: "level",
  //   label: "最后上料人",
  //   width: "",
  //   min: true,
  //   align: "1",
  // },
]);
const hisForm = ref({
  MfgOrderName: "",
  workstationName: opui.station,
});
const detailVisible = ref(false);
const getFeedForm = ref({
  MfgOrder: "",
  workstationName: opui.station,
  SpecName: "DIP-PlugIn",
});
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
const listContainer = ref()
// const changeCheck = (val: any) => {

//   if (checked.value.length == 0) {
//     checked.value = [];
//     stopsForm.value.tools = "";
//   } else {
//     checked.value = [];
//     checked.value[0] = val;
//     stopsForm.value.tools = val;
//   }
// };
const openOver = () => {
  overAddVisible.value = true;
  getOverData();
};
const getMaterialRequired = () => {
  QueryOrderMaterialRequired(getFeedForm.value).then((res: any) => {
    if (
      res.content.length == 0 ||
      res.content == null ||
      res.content == undefined
    ) {
      detailsData.value = [];
      return;
    }
    detailsData.value = res.content;
  });
}
const opendetail = () => {
  detailVisible.value = true;

};
//获取过序
const getOverData = () => {
  FindAllDevice({ WorkStation: opui.station }).then((res: any) => {
    if (res.success) {
      let data = res.content;
      overAddForm.value.InDeviceLength = data[0].InDeviceLength;
      overAddForm.value.InDeviceSpeed = data[0].InDeviceSpeed;
      overAddForm.value.OutDeviceLength = data[0].OutDeviceLength;
      overAddForm.value.OutDeviceSpeed = data[0].OutDeviceSpeed;
    } else {
      ElNotification({
        title: res.msg,
        type: "error",
      });
    }
  });
};

//取消添加
const addOverCancel = () => {
  overAddVisible.value = false;
  addOverRef.value.cleanForm();
};
//确定添加
const addOveronSubmit = () => {
  UpdateDevice(overAddForm.value).then((res: any) => {
    if (res.success) {
      getOverData();
      ElNotification({
        title: "更新成功",
        type: "success",
      });
      overAddVisible.value = false;
    } else {
      ElNotification({
        title: res.msg,
        type: "error",
      });
    }
  });
};
const selectTable = ref();
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
const feedVisible = ref(false);
const feedForm = ref({
  order: "208310182",
  type: "3A4621-01C",
  productCode: "240106000131",
  productDes: "0402封装贴片电容100DF+5%50V MURATAGRM1555C1H101JA01D",
  orderNum: "100",
  eqInfo: "自动烧录机",
});

const FeedHeader = reactive([
  {
    label: "生产计划号",
    prop: "order",
  },
  {
    label: "产品机型",
    prop: "type",
  },
  {
    label: "产品编码",
    prop: "productCode",
  },
  {
    label: "产品描述",
    prop: "productDes",
  },
  {
    label: "计划数量",
    prop: "orderNum",
  },
  {
    label: "机台",
    prop: "eqInfo",
  },
]);
const isLoding = ref("");
const toolsVisible = ref(false)
const tools = ref("")
const inputToolRef = ref()
const msgToolTitle = ref("");
const msgToolType = ref(true);

const toolNewVisible = ref(false)
const toolNewForm = ref({
  FromTools: "",
  ToTools: "",
  userAccount: userStore.getUserInfo
})
const toolNewFormRef = ref()
const toolOldRef = ref()
const toolNewRef = ref()
const barMsg=ref("")
const msgNewType=ref(true)
const msgNewTitle=ref("")

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getOrderData();

});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getOrderData = () => {
  isLoding.value = "is-loading";
  defaultSelectVal.value = []
  OrderQuery({
    lineName: opui.line,
    // OrderTypeName: "DIP",
    // WorkStationName: opui.station,
  }).then((res: any) => {
    let data = res.content;
    let timer = setTimeout(() => {
      isLoding.value = "";
      clearTimeout(timer);
    }, 2000);
    if (data !== null && data.length !== 0) {
      orderTable.value.data = data
      if (data.length >= 1) {
        defaultSelectVal.value[0] = data[0].MfgOrderName;
      }
    }
  });
};
//历史过站记录
const getHisData = () => {
  PIQueryMoveHistory(hisForm.value).then((res: any) => {
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

//治具上移
const moveUp = (val: any) => {
  let data = {
    ToolName: val.ToolName,
    OrderNumber: "",
    OperateType: "",
    CompName: "",
    workstationName: opui.station,
    userAccount: userStore.getUserInfo,
  };
  SortTools(data).then((res: any) => {
    getToolData();
  });
};
//获取治具
const getToolData = () => {
  QueryToolInfo(getToolForm.value).then((res: any) => {
    if (res.content == null || res.content.length == 0) {
      toolList.value = [];
      return;
    }
    toolList.value = res.content;
    // let isExitTool = toolList.value.findIndex(
    //   (t: any) => t.ToolName == stopsForm.value.tools
    // );
    // if (isExitTool == -1) {
    //   stopsForm.value.tools = res.content[0].ToolName;
    //   checked.value[0] = res.content[0].ToolName;
    // } else {
    //   if (msgType.value && res.content.length >= isExitTool + 1) {
    //     stopsForm.value.tools = res.content[isExitTool + 1].ToolName;
    //     checked.value[0] = res.content[isExitTool + 1].ToolName;
    //   } else {
    //     stopsForm.value.tools = res.content[0].ToolName;
    //     checked.value[0] = res.content[0].ToolName;
    //     return;
    //   }
    // }
  });
};
//获取光标
const getFocus = () => {
  inputFocus.value = false;
  setTimeout(() => {
    inputFocus.value = true;
  }, 100);
};

const formText = (data: string) => {
  let key = data as keyof typeof form;
  return form[key];
};
const radioChange = (args: any) => {
  if (args[1] == null) {
    form.value.MfgOrderName = "";
    form.value.ProductName = "";
    form.value.ProductDesc = "";
    form.value.PlannedStartDate = "";
    form.value.BD_ProductModel = "";
    form.value.BD_SoftVersion = "";
    form.value.ERPOrder = "";
    form.value.PlannedCompletionDate = "";
    form.value.Qty = "";
    hisForm.value.MfgOrderName = "";
    getFeedForm.value.MfgOrder = "";
    getToolForm.value.OrderNumber = "";
    tableData1.value = [];
    toolList.value = [];
    detailsData.value = []
  } else {
    // orderTable.value.data.forEach((v: any) => {
    //   if (v.MfgOrderName == args[1]) {
    if (args[1] !== form.value.MfgOrderName || form.value.MfgOrderName == "") {
      stopsForm.value.orderName = args[0].MfgOrderName
      form.value.MfgOrderName = args[0].MfgOrderName;
      form.value.ProductName = args[0].ProductName;
      form.value.ProductDesc = args[0].ProductDesc;
      form.value.BD_ProductModel = args[0].BD_ProductModel;
      form.value.BD_SoftVersion = args[0].BD_SoftVersion;
      form.value.PlannedStartDate = args[0].PlannedStartDate;
      form.value.PlannedCompletionDate = args[0].PlannedCompletionDate;
      form.value.ERPOrder = args[0].ERPOrder;
      form.value.Qty = args[0].Qty;
      form.value.AllNum = args[0].AllNum;
      form.value.TodayNum = args[0].TodayNum;
      getFeedForm.value.MfgOrder = args[0].MfgOrderName;
      hisForm.value.MfgOrderName = args[0].MfgOrderName;
      getToolForm.value.OrderNumber = args[0].MfgOrderName;
      // getHisData();
      // getToolData();
      // getMaterialRequired()
    }
    getHisData();
    getToolData();
    getMaterialRequired()
  }

};

//过站
const getChange = (val: any) => {
  if (form.value.MfgOrderName.trim() == "") {
    ElNotification({
      title: "请选择生产计划号",
      type: "error",
    });
    return;
  }
  let barCodeVal = barCode.value;
  if (toolList.value.length != 0) {
    let toolData = toolList.value.findIndex(
      (t: any) => t.ToolName == barCode.value
    );
    if (toolData != -1) {
      // moveUp(toolList.value[toolData])
      stopsForm.value.tools = toolList.value[toolData].ToolName;
      checked.value[0] = toolList.value[toolData].ToolName;
      
      const targetItem:any = toolList.value.find((item:any) => item.ToolName === barCode.value)
      toolList.value.splice(toolData, 1);
      toolList.value.unshift(targetItem);
      if (stopsForm.value.ContainerName == "") {
        msgTitle.value = "请扫描PCB条码";
        msgType.value = true;
      }
    } else {
      if (checkStringType(barCodeVal) == "PCB") {
        stopsForm.value.ContainerName = barCodeVal;
        if (stopsForm.value.tools == "") {
          msgTitle.value = `已扫描PCB条码:${stopsForm.value.ContainerName},请扫描治具编码`;
          msgType.value = true;
        }
      } else {
        msgTitle.value = `条码有误，该治具未上线或PCB条码有误`;
        msgType.value = false;
        barCode.value = "";
        getFocus();
      }
    }
    barCode.value = "";
    if (stopsForm.value.ContainerName !== "" && stopsForm.value.tools !== "") {
      PluginStationMoveOut(stopsForm.value).then((res: any) => {
        msgTitle.value = res.msg;
        msgType.value = res.success;
        stopsForm.value.ContainerName = "";
        barCode.value = "";
        getMaterialRequired()
        if (res.success) {
          stopsForm.value.tools = "";
          checked.value = [];
          getToolData();
          getHisData();

        }
        // console.log(stopsForm.value);
      });
    }
    getFocus();
  } else {
    barCode.value = "";
    msgTitle.value = "请先进行工装治具上线";
    msgType.value = false;
  }

};
const toolsOpen = () => {
  nextTick(() => {
    if (inputToolRef.value) {
      inputToolRef.value.focus()
    }
  });

}
const toolsCancel = () => {
  tools.value = ""
  toolsVisible.value = false
  msgToolTitle.value = '';
  msgToolType.value = true;
  inputRef.value.focus()
  getFocus()
}
const getToolChange = () => {

  UnbindTools(tools.value).then((res: any) => {
    msgToolTitle.value = res.msg;
    msgToolType.value = res.success;
    tools.value = ""
  })
}
const toolNewOpen = () => {
  nextTick(() => {
    if (toolOldRef.value) {
      toolOldRef.value.focus()
      barMsg.value='请先扫描旧治具编码'
    }
  });
}
const toolNewCancel = () => {
  toolNewFormRef.value.resetFields()
  toolNewVisible.value = false
   barMsg.value='请先扫描旧治具编码'
   msgNewTitle.value=""
   msgNewType.value=true
  inputRef.value.focus()
}
const getToolOld = () => {
  toolNewRef.value.focus()
  if(toolNewForm.value.FromTools!==''){
     barMsg.value='请扫描新治具编码'
  }
}
const getToolNew = () => {
    if(toolNewForm.value.FromTools!==''){
      AgainBindTools(toolNewForm.value).then((res:any)=>{
        msgNewTitle.value=res.msg
        msgNewType.value=res.success
        toolNewFormRef.value.resetFields()
        toolOldRef.value.focus()
         barMsg.value='请先扫描旧治具编码'
      })
    }
}

//分页
const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const detailsSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const detailsCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    leftBoxH.value = window.innerHeight - 120;
    tableHeight.value = window.innerHeight - 432; //428
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
  --el-tabs-header-height: 35px;
  background-color: #006487 !important;
}

.tabs-css .el-tabs__content {
  padding: 0px;
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
</style>
