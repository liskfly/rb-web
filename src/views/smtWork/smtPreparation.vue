<template>
    <div class="flex flex-col w-full h-full">
        <!-- <div class="h-[40px] pl-2 pr-2 flex justify-between items-center">
            <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
            <div></div>
        </div> -->
        <div class="w-full flex-1 flex">
            <div class="setwidth w-[300px]">
                <div class="w-full h-full border-r border-solid border-[#cbcbcb]">
                    <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                        <span class="ml-5">基本信息</span>
                    </div>
                    <div class="p-2">
                        <el-form ref="formRef" class="myselect" :model="form" :rules="formRule" label-width="auto">
                            <el-form-item label="产线" prop="LineNumber">
                                <el-select v-model="form.LineNumber" @change="changeLine">
                                    <el-option v-for="l in lineList" :label="l.LineDesc" :value="l.LineNumber"
                                        :key="l.LineNumber" />
                                </el-select>
                            </el-form-item>
                            <div class="flex flex-col gap-2">
                                <div class="flex items-center gap-4 p-1 border border-solid border-[#c6c271]">
                                    <img alt="" style="width: 40px; height: 40px" src="@/assets/img/dbl.png"
                                        class="ml-10" />
                                    <span class="underline cursor-pointer" @click="openOrderDialog(0)">待备料（{{
                                        toBePrepared.length }}）</span>
                                </div>
                                <div class="flex items-center gap-4 p-1 border border-solid border-[#f0b06f]">
                                    <img alt="" style="width: 40px; height: 40px" src="@/assets/img/ing.png"
                                        class="ml-10" />
                                    <span class="underline cursor-pointer" @click="openOrderDialog(1)">备料中（{{
                                        preparation.length }}）</span>
                                </div>
                                <div class="flex items-center gap-4 p-1 border border-solid border-[#09bb07]">
                                    <img alt="" style="width: 40px; height: 40px" src="@/assets/img/success.png"
                                        class="ml-10" />
                                    <span class="underline cursor-pointer" @click="openOrderDialog(2)">备料完成（{{
                                        preComplete.length }}）</span>
                                </div>
                            </div>
                        </el-form>
                        <div class="flex justify-center pt-2">
                            <!-- <el-button type="primary"> 备料历史查询</el-button> -->
                            <!-- <el-button type="primary"> 接料亮灯(人工/自动)</el-button> -->
                        </div>
                    </div>
                    <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                        <span class="ml-5">消息提示</span>
                    </div>
                    <div class="p-2">
                        <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                            {{ msgTitle === "" ? "" : msgTitle }}
                        </div>
                        <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                            {{ msgTitle }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-[calc(100%-300px)]">
                <!-- <div class="w-full"> -->
                <div class="w-full h-full flex flex-col">
                    <div>
                        <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                            <span class="ml-5"> 生产计划备料操作</span>
                        </div>
                        <div class="h-[130px] pt-3 pr-2 pl-2 overflow-auto">
                            <el-form ref="operateFormRef" :model="operateForm" :inline="true" label-width="auto">
                                <el-form-item label="生产计划号" class="mb-2" prop="OrderNumber">
                                    <el-input v-model="operateForm.OrderNumber" style="width: 200px"
                                        @keyup.enter.native="getChange" />
                                </el-form-item>
                                <el-form-item label="面号" class="mb-2" prop="Side">
                                    <el-select v-model="operateForm.Side" placeholder="" style="width: 150px"
                                        @change="getChange" disabled>
                                        <el-option v-for="item in sideList" :key="item" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                    <!-- <el-input v-model="operateForm.Side" style="width: 150px" /> -->
                                </el-form-item>
                                <el-form-item label="计划数量" class="mb-2" prop="OrderPlanedQty">
                                    <el-input v-model="operateForm.OrderPlanedQty" style="width: 200px" disabled />
                                </el-form-item>
                                <el-form-item label="备料状态" class="mb-2" prop="LineNumber">
                                    <el-input v-model="operateForm.StatusDec" style="width: 180px" disabled />
                                </el-form-item>
                                <el-form-item label="产品编码" class="mb-2" prop="ProductNumber">
                                    <el-input v-model="operateForm.ProductNumber" style="width: 200px" disabled />
                                </el-form-item>
                                <el-form-item label="产品描述" class="mb-2" prop="ProductDesc">
                                    <el-input v-model="operateForm.ProductDesc" style="width: 465px" disabled />
                                </el-form-item>
                                <el-form-item label="货架号" class="mb-2" prop="StatusDec">
                                    <el-input v-model="firstForm.shelf_ids" style="width: 180px" disabled />
                                </el-form-item>
                                <el-form-item label="状态" class="mb-2" v-if="false" prop="Status">
                                    <el-input v-model="operateForm.Status" style="width: 0" disabled />
                                </el-form-item>
                            </el-form>
                            <div>
                                <el-button type="primary" @click="restForm">重置</el-button>
                                <el-button type="info" v-if="operateForm.Status == '0'"
                                    @click="openStart">开始备料</el-button>
                                <el-button type="success" v-if="operateForm.Status == '1'"
                                    @click="completeSubmit">完成备料</el-button>
                                <el-button type="warning" v-if="operateForm.Status == '1'"
                                    @click="openFirst">首套亮灯</el-button>
                                <el-button v-if="operateForm.Status == '1'" @click="materialView">货架物料查看</el-button>
                                <!-- <el-button type="warning">首套亮灯</el-button> -->
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col flex-1 tabs-css">
                        <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                            <span class="ml-5">站位物料明细</span>
                        </div>
                        <!-- <table-tem :showIndex="true" :tableData="tableData" :tableHeight="tableHeight"
                            :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                            @handleCurrentChange="handleCurrentChange"></table-tem> -->
                        <table-temp :showIndex="true" :tableData="tableData" :tableHeight="tableHeight"
                            :columnData="columnData"></table-temp>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog v-model="orderVisiable" draggable title="选择备料生产计划" width="75%" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="orderCancel">
            <el-table :data="orderData" size="small" :height="'400'" border fit :tooltip-effect="'dark'"
                highlight-current-row @cell-click="cellClick" @cell-dblclick="celldblclick">
                <el-table-column type="index" align="center" fixed label="序号" width="50" />
                <el-table-column prop="OrderNumber" label="生产计划号" fixed width="150" />
                <el-table-column prop="Side" label="面号" fixed width="60" />
                <el-table-column prop="LineNumber" label="产线" min-width="150" />
                <el-table-column prop="ProductNumber" label="产品编码" min-width="120" />
                <el-table-column prop="ProductDesc" :show-overflow-tooltip="true" label="产品描述" width="180" />
                <el-table-column prop="OrderPlanedQty" label="计划数量" align="center" width="80" />
                <el-table-column prop="PlanedStartTime" label="计划开始时间" width="140" />
                <el-table-column prop="PlanedEndTime" label="计划完成时间" width="140" />
            </el-table>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="orderCancel">取消</el-button>
                    <el-button type="primary" @click="orderConfirm">确定</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="startVisible" draggable title="开始备料" width="400px" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="startCancel">
            <el-form ref="startFormRef" :model="startForm" :rules="formRule" label-width="auto">
                <el-form-item label="生产计划号" prop="OrderNumber" v-if="false">
                    <el-input v-model="startForm.OrderNumber" disabled />
                </el-form-item>
                <el-form-item label="产线" prop="LineNumber" v-if="false">
                    <el-input v-model="startForm.LineNumber" disabled />
                </el-form-item>
                <el-form-item label="面号" prop="Side" v-if="false">
                    <el-input v-model="startForm.Side" disabled />
                </el-form-item>
                <el-form-item label="备料人" prop="userAccount">
                    <el-input v-model="startForm.userAccount" disabled />
                </el-form-item>
                <el-form-item label="货架" prop="shelf_ids_list">
                    <el-select v-model="startForm.shelf_ids_list" multiple collapse-tags collapse-tags-tooltip
                        :max-collapse-tags="3" placeholder="">
                        <el-option v-for="item in shelfList" :key="item.Shelf_id" :label="item.Shelf_id"
                            :value="item.Shelf_id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="Remark">
                    <el-input v-model="startForm.Remark" />
                </el-form-item>
                <el-form-item label="货架" prop="shelf_ids" v-if="false">
                    <el-input v-model="startForm.shelf_ids" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="startCancel">取消</el-button>
                    <el-button type="primary" @click="startConfirm"> 确定 </el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="firstVisible" draggable title="首套亮灯" width="400px" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="firstCancel">
            <el-form ref="firstFormRef" :model="firstForm" label-width="auto">
                <div class="flex justify-around border-2 border-dashed border-red-600 mb-3">
                    <el-radio-group v-model="operateType">
                        <el-radio :value="0" size="large">首套亮灯</el-radio>
                        <el-radio :value="1" size="large">取消首套亮灯</el-radio>
                    </el-radio-group>
                </div>

                <el-form-item label="灯色" prop="issue_color">
                    <!-- <el-input v-model="firstForm.issue_color" /> -->
                    <el-radio-group v-model="firstForm.issue_color" :disabled="operateType == 1">
                        <el-radio :value="1">蓝</el-radio>
                        <el-radio :value="2">绿</el-radio>
                        <el-radio :value="4">青</el-radio>
                        <el-radio :value="5">黄</el-radio>
                        <el-radio :value="6">紫</el-radio>
                        <el-radio :value="7">白</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="生产计划号" prop="OrderNumber">
                    <el-input v-model="firstForm.OrderNumber" disabled />
                </el-form-item>
                <el-form-item label="产线" prop="LineNumber" v-if="false">
                    <el-input v-model="startForm.LineNumber" disabled />
                </el-form-item>
                <el-form-item label="面号" prop="Side">
                    <el-input v-model="firstForm.Side" disabled />
                </el-form-item>

                <el-form-item label="货架" prop="shelf_ids_list">
                    <el-input v-model="firstForm.shelf_ids" disabled />
                    <!-- <el-select v-model="firstForm.shelf_ids" multiple collapse-tags collapse-tags-tooltip
            :max-collapse-tags="7" placeholder="">
            <el-option v-for="item in shelfList" :key="item.Shelf_id" :label="item.Shelf_id" :value="item.Shelf_id" />
          </el-select> -->
                </el-form-item>
                <el-form-item label="台车" prop="Station">
                    <el-select v-model="firstForm.Station" placeholder="" clearable>
                        <el-option v-for="item in StationList" :key="item.Station" :label="item.Station"
                            :value="item.Station" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="firstCancel">取消</el-button>
                    <el-button type="primary" @click="firstSubmit"> 确定 </el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog align-center :append-to-body="true" :close-on-click-modal="false" v-model="viewVisible" @close=""
        :title="'生产计划号：'+operateForm.OrderNumber" width="80%">
      <el-tabs v-model="activeName" type="border-card" class="demo-tabs"  >
        <el-tab-pane label="货架物料明细" name="shelveMaterial" >
            <table-tem ref="lightTable" size="small" :showIndex="true" :tableData="viewTableData" :tableHeight="420"
                :columnData="viewColumnData" :pageObj="viewPageObj" @handleSizeChange="viewSizeChange"
                @handleCurrentChange="viewCurrentChange"></table-tem>
      </el-tab-pane>
    </el-tabs>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ElMessageBox, ElNotification } from "element-plus";
import {
    GetSMTLineList,
    GetSMTPreparationOrderList,
    GetOrderSMTBom,
    findShelf,
    SubmitSMTPreparation,
    SendFirstSet,
    CancelFirstSet,
    QueryRackLightMaterials,
} from "@/api/smtApi";
import {
    ref,
    onMounted,
    nextTick,
    computed,
    watch,
    reactive,
    onBeforeMount,
    onBeforeUnmount,
} from "vue";
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import tableTem from "@/components/tableTem/index.vue";
import tableTemp from "@/components/tableTemp/index.vue";
const appStore = useAppStore();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const form = ref({
    LineNumber: "",
});
const lineList = ref<any[]>([]);
const operateForm = ref({
    OrderNumber: "",
    Side: "",
    LineNumber: "",
    OrderPlanedQty: "",
    ProductNumber: "",
    ProductDesc: "",
    Status: "",
    StatusDec: "",
});
const activeName=ref('shelveMaterial')
const sideList = ref([
    {
        value: "TOP",
        label: "TOP",
    },
    {
        value: "BOT",
        label: "BOT",
    },
]);
const tableData = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
    pageSize: 100,
    currentPage: 1,
});
const viewPageObj = ref({
    pageSize: 300,
    currentPage: 1,
});
const viewTableData = ref([]);

const columnData = reactive([
    {
        text: true,
        prop: "Station",
        label: "台车",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Slot",
        label: "站位",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "SubSlot",
        label: "子站位",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialNumber",
        label: "物料编码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialDescription",
        label: "物料描述",
        width: "250",
        // min: true,
        align: "1",
    },
    {
        text: true,
        prop: "IsAlternative",
        label: "是否替换物料",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "OriginalMaterialNumber",
        label: "原始物料编码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialRequested",
        label: "需求总量",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialUnit",
        label: "单位",
        width: "",
        min: true,
        align: "1",
    },
]);

const viewColumnData = reactive([
    {
        text: true,
        prop: "ReelId",
        label: "物料批次条码",
        width: "",
        min: true,
        align: "center",
    },
    {
        text: true,
        prop: "Amount",
        label: "数量",
        width: "",
        min: true,
        align: "center",
    },
    {
        text: true,
        prop: "Unit",
        label: "单位",
        width: "",
        min: true,
        align: "center",
    },
    {
        text: true,
        prop: "part_number",
        label: "物料编码",
        width: "",
        min: true,
        align: "center",
    },
    {
        text: true,
        prop: "MaterialDesc",
        label: "物料描述",
        width: "350",
        // min: true,
        align: "left",
    },
    {
        text: true,
        prop: "shelf_id",
        label: "货架号",
        width: "",
        min: true,
        align: "center",
    },
    {
        text: true,
        prop: "BinCode",
        label: "储位编号",
        width: "",
        min: true,
        align: "center",
    },
]);
const orderVisiable = ref(false);
const orderData = ref([]);
const toBePrepared = ref([]);
const preparation = ref([]);
const preComplete = ref([]);
const chooseOrder = ref({
    OrderNumber: "",
    Side: "",
    LineNumber: "",
    OrderPlanedQty: "",
    ProductNumber: "",
    ProductDesc: "",
    Status: "",
    StatusDec: "",
});
const status = ref();
const operateFormRef = ref();

const startForm = ref({
    OrderNumber: "",
    Side: "",
    LineNumber: "",
    shelf_ids: "",
    shelf_ids_list: [],
    PreparationBy: userStore.getUserInfo,
    Remark: "",
    optionType: "",
    workstationName: opui.station,
    userAccount: userStore.getUserInfo,
});
const startVisible = ref(false);
const viewVisible = ref(false);
const startFormRef = ref();
const shelfList = ref<any[]>([]);
const msgTitle = ref("");
const msgType = ref(true);
const firstVisible = ref(false);
const firstForm = ref({
    issue_color: 0,
    OrderNumber: "",
    Side: "",
    Station: "",
    shelf_ids: "",
    // shelf_ids_list:[],
    OperatorName: userStore.getUserInfo,
});
const operateType = ref(0);
const StationList = ref<any[]>([]);
const formRef = ref();
const firstFormRef = ref();

//规则

const formRule = reactive({
    LineNumber: [
        {
            required: true,
            message: "请选择产线",
            trigger: "change",
        },
    ],
    shelf_ids_list: [
        {
            required: true,
            message: "请选择货架",
            trigger: "change",
        },
    ],
});
const operateRule = reactive({
    OrderNumber: [
        {
            required: true,
            message: "生产计划号不能为空",
            trigger: "blur",
        },
    ],
});

watch(
    () => operateForm.value.Status,
    (newVal) => {
        // console.log(newVal);
        if (operateForm.value.OrderNumber) {
            GetOrderSMTBom(operateForm.value).then((res: any) => {
                if (res.content.length == 0) {
                    tableData.value = [];
                } else {
                    tableData.value = res.content;
                }
            });
        }
    },
    {
        immediate: true,
        deep: true,
    }
);
watch(
    () => operateType.value,
    (newVal, oldVal) => {
        if (newVal == 1 && oldVal != newVal) {
            firstForm.value.issue_color = 0;
        } else {
            firstForm.value.issue_color = 1;
        }
    },
    {
        immediate: true,
        deep: true,
    }
);

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    GetSMTLineList().then((res: any) => {
        lineList.value = res.content;
    });
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

const getOrderData = () => {
    GetSMTPreparationOrderList(form.value).then((res: any) => {
        toBePrepared.value = res.content.filter((r: any) => r.Status === 0);
        preparation.value = res.content.filter((r: any) => r.Status === 1);
        preComplete.value = res.content.filter((r: any) => r.Status === 2);
        // console.log(res.content);
    });
};
// const getOrderSMTBom=()=>{
//           GetOrderSMTBom(operateForm.value).then((res: any) => {
//             if()
//         tableData.value = res.content;
//       });
// }
const changeLine = (val: any) => {
    // console.log(val);
    if (val) {
        // operateForm.value.LineNumber = val;
        getOrderData();
        // GetSMTPreparationOrderList(form.value).then((res: any) => {
        //     toBePrepared.value = res.content.filter((r: any) => r.Status === 0);
        //     preparation.value = res.content.filter((r: any) => r.Status === 1);
        //     preComplete.value = res.content.filter((r: any) => r.Status === 2);
        // });
    } else {
        toBePrepared.value = [];
        preparation.value = [];
        preComplete.value = [];
    }
};
const openOrderDialog = (val: any) => {
    if (val == 0) {
        orderData.value = toBePrepared.value;
        orderVisiable.value = toBePrepared.value.length !== 0;
    } else if (val == 1) {
        orderData.value = preparation.value;
        orderVisiable.value = preparation.value.length !== 0;
    } else if (val == 2) {
        orderData.value = preComplete.value;
        orderVisiable.value = preComplete.value.length !== 0;
    }
    // if (
    //     toBePrepared.value.length !== 0 ||
    //     preparation.value.length !== 0 ||
    //     preComplete.value.length !== 0
    // ) {

    //     orderVisiable.value = true;
    // }
};
const cellClick = (row: any) => {
    //   console.log(row);
    let StatusDec = "";
    if (row.Status == 0) {
        StatusDec = "待备料";
    }
    if (row.Status == 1) {
        StatusDec = "备料中";
      
        // firstForm.value.shelf_ids_list.push (row.shelf_ids)
    }
    if (row.Status == 2) {
        StatusDec = "备料完成";
    }
    firstForm.value.shelf_ids = row.shelf_ids;
    chooseOrder.value = { ...row, StatusDec };
    //   operateForm.value=
};
const celldblclick = (row: any) => {
    //   console.log(row);
    let StatusDec = "";
    if (row.Status == 0) {
        StatusDec = "待备料";
    }
    if (row.Status == 1) {
        StatusDec = "备料中";
      
    }
    if (row.Status == 2) {
        StatusDec = "备料完成";
    }
    firstForm.value.shelf_ids = row.shelf_ids;
    operateForm.value = { ...row, StatusDec };
    startForm.value.LineNumber = row.LineNumber;
    startForm.value.OrderNumber = row.OrderNumber;
    startForm.value.Side = row.Side;
    firstForm.value.OrderNumber = row.OrderNumber;
    firstForm.value.Side = row.Side;
    status.value = row.Status;
    orderVisiable.value = false;
    msgTitle.value = ``;
    msgType.value = true;
    // operateFormRef.value.clearValidate()
};
const orderCancel = () => {
    orderVisiable.value = false;
};
const orderConfirm = () => {
    operateForm.value = { ...chooseOrder.value };
    startForm.value.LineNumber = chooseOrder.value.LineNumber;
    startForm.value.OrderNumber = chooseOrder.value.OrderNumber;
    startForm.value.Side = chooseOrder.value.Side;
    firstForm.value.OrderNumber = chooseOrder.value.OrderNumber;
    firstForm.value.Side = chooseOrder.value.Side;
    status.value = chooseOrder.value.Status;
    orderVisiable.value = false;
    msgTitle.value = ``;
    msgType.value = true;
    // operateFormRef.value.clearValidate()
};
const getChange = () => {
    if (
        operateForm.value.OrderNumber == "" ||
        operateForm.value.OrderNumber == undefined
    ) {
        msgTitle.value = `生产计划号不能为空`;
        msgType.value = false;
        tableData.value = [];
        operateForm.value.Status = "";
        operateFormRef.value.resetFields();
    } else {
        msgTitle.value = ``;
        msgType.value = true;
        GetSMTPreparationOrderList({
            OrderNumber: operateForm.value.OrderNumber,
            // Side: operateForm.value.Side,
            LineNumber: form.value.LineNumber,
        }).then((res: any) => {
            if (res.content.length == 0) {
                msgTitle.value = `未找到${operateForm.value.OrderNumber}生产计划号信息`;
                msgType.value = false;
                tableData.value = [];
            }
            operateForm.value = { ...res.content[0] };
            let StatusDec = "";
            if (res.content[0].Status == 0) {
                StatusDec = "待备料";
            }
            if (res.content[0].Status == 1) {
                StatusDec = "备料中";
                firstForm.value.shelf_ids = res.content[0].shelf_ids;
            }
            if (res.content[0].Status == 2) {
                StatusDec = "备料完成";
            }
            // console.log(res.content[0].Statu);
            startForm.value.LineNumber = res.content[0].LineNumber;
            startForm.value.OrderNumber = res.content[0].OrderNumber;
            startForm.value.Side = res.content[0].Side;
            firstForm.value.OrderNumber = res.content[0].OrderNumber;
            firstForm.value.Side = res.content[0].Side;
            operateForm.value.StatusDec = StatusDec;
        });
    }
};
const restForm = () => {
    status.value = -1;
    operateFormRef.value.resetFields();

    msgTitle.value = "";
    msgType.value = true;
    operateForm.value.Status = "";
    tableData.value = [];
    //   startFormRef.value.resetFields();
    // console.log(  operateForm.value);
};

const openStart = () => {
    startVisible.value = true;
    findShelf().then((res: any) => {
        shelfList.value = res.content;
    });
};
const startCancel = () => {
    startFormRef.value.resetFields();
    startVisible.value = false;
};
const startConfirm = () => {
    startForm.value.shelf_ids = startForm.value.shelf_ids_list.toString();
    startForm.value.optionType = "start";
    startFormRef.value.validate((valid: any) => {
        if (valid) {
            msgTitle.value = ``;
            msgType.value = true;
            SubmitSMTPreparation(startForm.value).then((res: any) => {
                // console.log(res);
                msgTitle.value = res.msg;
                msgType.value = res.success;
                startVisible.value = false;
                if (res.success) {
                    getChange();
                    getOrderData();
                }
            });
        } else {
            console.log("error submit!");
        }
    });
};
const completeSubmit = () => {
    ElMessageBox.confirm("确定备料完成", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            startForm.value.optionType = "end";
            msgTitle.value = ``;
            msgType.value = true;
            SubmitSMTPreparation(startForm.value).then((res: any) => {
                // console.log(res);
                msgTitle.value = res.msg;
                msgType.value = res.success;
                if (res.success) {
                    getChange();
                    getOrderData();
                }
            });
        })
        .catch(() => { });
};
const openFirst = () => {
    const seenStations = new Set();
    StationList.value = tableData.value.filter((item: any) => {
        if (!seenStations.has(item.Station)) {
            seenStations.add(item.Station);
            return true;
        }
        return false;
    });
    findShelf().then((res: any) => {
        shelfList.value = res.content;
    });
    firstVisible.value = true;
};

const materialView = () => {
    QueryRackLightMaterials({
        OrderNumber: operateForm.value.OrderNumber,
        shelf_ids: firstForm.value.shelf_ids,
    }).then((res: any) => {
        if (res && res.success) {
            viewVisible.value = true;
            viewTableData.value = res.content;
        }
    });
};

const firstCancel = () => {
    firstVisible.value = false;
    firstForm.value.Station = "";
    firstForm.value.issue_color = 1;
};
const firstSubmit = () => {
   
    firstFormRef.value.validate((valid: any) => {
        if (valid) {
            msgTitle.value = ``;
            msgType.value = true;
            if (operateType.value == 1) {
                CancelFirstSet(firstForm.value).then((res: any) => {
                    msgTitle.value = res.msg;
                    msgType.value = res.success;
                    if (res.success) {
                        getChange();
                        getOrderData();
                    }
                });
            } else {
                SendFirstSet(firstForm.value).then((res: any) => {
                    msgTitle.value = res.msg;
                    msgType.value = res.success;
                    if (res.success) {
                        getChange();
                        getOrderData();
                    }
                });
            }
            firstVisible.value = false;
            firstForm.value.Station = "";
            firstForm.value.issue_color = 1;
        } else {
            console.log("error submit!");
        }
    });
};

const handleSizeChange = (val: any) => {
    pageObj.value.currentPage = 1;
    pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.value.currentPage = val;
};

const viewSizeChange = (val: any) => {
    viewPageObj.value.currentPage = 1;
    viewPageObj.value.pageSize = val;
};
const viewCurrentChange = (val: any) => {
    viewPageObj.value.currentPage = val;
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 285; //360
    });
};
</script>

<style lang="scss">
.setwidth {
    flex: 0 0 300px;
}

// .myselect .el-input__inner{
//     font-size: 30px;
// }
.myselect .el-select__selection {
    font-size: 18px;
    font-weight: bold;
}
.el-tabs--border-card {
  border-top: 1px solid #006487;
}

.demo-tabs .el-tabs__header {
  --el-tabs-header-height: 30px;
  background-color: #006487 !important;
}

.demo-tabs .el-tabs__content {
  padding: 5px;
}



.demo-tabs.el-tabs--border-card>.el-tabs__header .el-tabs__item {
  color: #fff;
  font-size: 0.8rem;
  // padding: 0 !important;
}

.demo-tabs .el-tabs__item.is-active {
  font-size: 0.8rem;
  // color: #fff;
  color: #006487 !important;
  // font-weight: bold;
}

.el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
  font-size: 0.8rem;
  color: #006487 !important;
  background-color: rgba($color: #fff, $alpha: 0.8);
}
</style>
