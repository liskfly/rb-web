<template>
    <div class="flex flex-col w-full h-full">
        <div class="h-[40px] pl-2 pr-2 flex justify-between items-center">
            <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
            <div>
                <el-button type="primary" @click="openDialog">工装治具</el-button>
                <!-- <el-button type="primary" @click="openDialog">不良品登记</el-button> -->
            </div>
        </div>
        <div class="w-full flex-1 flex">
            <div class="setwidth w-[350px]">
                <div class="w-full h-full box">
                    <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                        <span class="ml-5">基本信息</span>
                    </div>
                    <div class="p-[10px]">
                        <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
                            <el-form-item v-for="f in formHeader" :key="f.value" :label="f.label" :prop="f.value">
                                <span class="font-bold text-lg leading-[30px]"
                                    :class="f.value == 'TodayNum' ? 'text-[#00B400]' : ''">
                                    {{ formText(f.value) }}</span>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <div class="w-[calc(100%-350px)]">
                <div class="w-full h-full flex flex-col">
                    <div>
                        <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                            <span class="ml-5"> 扫描条码</span>
                        </div>
                        <div class="h-[120px] p-5">
                            <el-form class="inbound" :inline="true" :model="form" label-width="auto"
                                @submit.native.prevent>
                                <el-form-item label="扫描条码">
                                    <el-input v-model="stopsForm.containerName" :autofocus="inputFocus" clearable
                                        ref="inputRef" style="width: 500px" placeholder="请扫描条码"
                                        @keyup.enter.native="getChange" />
                                </el-form-item>
                                <el-form-item>
                                    <!-- <div class="">
                                        ok
                                    </div> -->
                                </el-form-item>
                            </el-form>
                            <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                                {{ msgTitle === "" ? "请扫描PCB条码" : msgTitle }}
                            </div>
                            <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                                {{ msgTitle }}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col flex-1 tabs-css">
                        <div class="h-[35px] flex items-center justify-between text-lg text-[#fff] bg-[#006487]">
                            <span class="ml-5">历史过站记录</span>
                            <div class="mr-5">
                                <el-checkbox-group v-model="checkedHis" class="laser-table-filter">
                                    <el-checkbox v-for="c in checkedHisList"
                                        :label="`${c.label}(${changeDataLength(c.value)})`" :value="c.value"
                                        @change="changeHis(c.value)">
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                        <table-tem :showIndex="true" :tableData="changeData" :tableHeight="tableHeight"
                            :columnData="hisColumn" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                            @handleCurrentChange="handleCurrentChange"></table-tem>

                        <!-- <el-tabs v-model="tabsValue" type="border-card" class="demo-tabs">
                            <el-tab-pane label="历史过站记录" name="history" :stretch="true">
                                <table-tem :showIndex="true" :tableData="tableData1" :tableHeight="tableHeight"
                                    :columnData="hisColumn" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                                    @handleCurrentChange="handleCurrentChange"></table-tem>
                            </el-tab-pane>
                            <el-tab-pane label="工装治具" name="fixtures">
                                <table-tem :showIndex="true" :tableData="fixtureData" :tableHeight="tableHeight"
                                    :columnData="fixtureColumn" :pageObj="fixturePageObj"
                                    @handleSizeChange="handleSizeChange1"
                                    @handleCurrentChange="handleCurrentChange1"></table-tem>
                            </el-tab-pane>
                        </el-tabs> -->
                    </div>
                </div>
            </div>
        </div>
        <el-dialog v-model="editVisible" title="工装治具" width="60%" :append-to-body="true" :close-on-click-modal="false"
            :close-on-press-escape="false" align-center>
            <table-tem :showIndex="true" :tableData="fixtureData" :tableHeight="tableHeight" :columnData="fixtureColumn"
                :pageObj="fixturePageObj"></table-tem>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">关闭</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- <badInfoTem :visible="editVisible" :list="list" :formHeader="badFormHeader" :form="editForm" :badForm="badForm"
            :tableData="BadtableData" @cancel="editCancel" @submit="editSubmit" @deleteBad="deleteBad"
            @addBadData="addBadData" @openAddBad="openAddBad" /> -->
    </div>
</template>

<script lang="ts" setup>
import tableTem from "@/components/tableTem/index.vue";

import badInfoTem from "@/components/badInfoTem/index.vue";
import selectTa from "@/components/selectTable/index.vue";
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import type { Formspan, FormHeader, OrderData } from "@/typing";
import {
    ref,
    reactive,
    onMounted,
    nextTick,
    onBeforeMount,
    onBeforeUnmount,
    computed,
} from "vue";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { PCBASplitMoveStd, OrderQuery, QueryMoveHistory } from "@/api/dipApi";
import { QueryTools } from "@/api/operate";

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
const barCode = ref("");
const tabsValue = ref("history");
const editVisible = ref(false);
const badVisible = ref(false);
const inputRef = ref();
const msgTitle = ref("");
const msgType = ref(true);
const dialogVisible = ref(false);
const workOrderList = ref([
    {
        workOrder: "12345677",
    },
]);

const workOrder = ref("");
const orderTableData = ref([]);
const pageObj1 = ref({
    pageSize: 50,
    currentPage: 1,
});

//过站扫描
const stopsForm = ref({
    containerName: "",
    resource: "",
    userAccount: userStore.getUserInfo,
    txnDate: "",
    workstationName: opui.station,
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

const hisColumn = reactive([
    {
        text: true,
        prop: "ContainerName",
        label: "PCB条码",
        width: "",
        align: "1",
    },
    // {
    //     text: true,
    //     prop: "BD_Tools",
    //     label: "治具编码",
    //     width: "",
    //     align: "1",
    // },
    {
        text: true,
        prop: "BD_EmployeeName",
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
const tableData = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
    pageSize: 100,
    currentPage: 1,
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

const fixtureColumn = reactive([
    {
        text: true,
        prop: "ToolName",
        label: "治具编码",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "类型",
        width: "",
        align: "1",
    },
    {
        text: true,
        prop: "CompName",
        label: "类型编号",
        width: "",
        align: "1",
    },
]);
const fixtureData = ref([]);

const fixturePageObj = ref({
    pageSize: 100,
    currentPage: 1,
});
const hisForm = ref({
    MfgOrderName: "",
    workstationName: opui.station,
});
const getToolForm = ref({
    ToolName: "",
    OrderNumber: "",
    OperateType: "3",
    CompName: "",
    workstationName: opui.station,
    userAccount: userStore.getUserInfo,
});
const toolList = ref<ToolList[]>([]);
const isLoding = ref("");
const defaultSelectVal = ref<string[]>([]);
const inputFocus = ref(true);
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
    // inputRef.value.focus();
    // getOrderData();
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

//历史过站记录
const getHisData = () => {
    QueryMoveHistory(hisForm.value).then((res: any) => {
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
        return geTodayData()
    } else {
        return tableData.value;
    }
});
const changeDataLength = (val: any) => {
    if (val == "today") {
        let dataLength = geTodayData()
        return dataLength.length
    } else {
        return tableData.value.length
    }
}
const geTodayData = () => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];
    function getDateFromDateTimeString(dateTimeString: any) {
        return dateTimeString.split(" ")[0];
    }
    const todayDataArray = tableData.value.filter((item: any) => {
        return getDateFromDateTimeString(item.TxnDate) === todayString;
    });
    return todayDataArray
};

const getOrderData = () => {
    // OrderQuery({ lineName: opui.line, OrderTypeName: 'DIP' }).then((res: any) => {
    //     orderTable.value.data[0] = res.content
    // });
    // isLoding.value = "is-loading";
    OrderQuery({ lineName: opui.line}).then((res: any) => {
        let data = res.content;
        orderTable.value.data[0] = data[0] || [];
        let timer = setTimeout(() => {
            isLoding.value = "";
            clearTimeout(timer);
        }, 2000);
        if (data.length == 1) {
            let a = data[0].MfgOrderName;
            defaultSelectVal.value[0] = a;
        }
    });
};
const getToolData = () => {
    QueryTools(getToolForm.value).then((res: any) => {
        if (res.content == null || res.content.length == 0) {
            toolList.value = [];
            return;
        }
        toolList.value = res.content;
    });
};

const formText = (data: string) => {
    let key = data as keyof typeof form;
    return form.value[key];
};
const getChange = () => {
    PCBASplitMoveStd(stopsForm.value).then((res: any) => {
        if (res.success) {
            msgTitle.value = res.msg;
            msgType.value = res.success;
            stopsForm.value.containerName = "";
            form.value = { ...res.content[0] };
            hisForm.value.MfgOrderName = res.content[0].MfgOrderName;
            // getToolForm.value.OrderNumber = res.content[0].MfgOrderName;
            getHisData();

            // inputRef.value.focus();
            getFocus();
        } else {
            inputRef.value.select();
            msgTitle.value = res.msg;
            msgType.value = res.success;
        }
    });
};
const selectTable = ref();

// const radioChange = (args: any) => {
//     if (args[1] == null) {
//         form.MfgOrderName = "";
//         form.ProductName = "";
//         form.ProductDesc = "";
//         form.PlannedStartDate = "";
//         form.BD_ProductModel = "";
//         form.BD_SoftVersion = "";
//         form.PlannedCompletionDate = "";
//         form.Qty = "";
//     } else {
//         // orderTable.value.data.forEach((v: any) => {
//         //   if (v.MfgOrderName == args[1]) {
//         form.MfgOrderName = args[0].MfgOrderName;
//         form.ProductName = args[0].ProductName;
//         form.ProductDesc = args[0].ProductDesc;
//         form.BD_ProductModel = args[0].BD_ProductModel;
//         form.BD_SoftVersion = args[0].BD_SoftVersion;
//         form.PlannedStartDate = args[0].PlannedStartDate;
//         form.PlannedCompletionDate = args[0].PlannedCompletionDate;
//         form.Qty = args[0].Qty;
//         hisForm.value.MfgOrderName = args[0].MfgOrderName;

//         if (getToolForm.value.OrderNumber == args[0].MfgOrderName) {
//             return;
//         } else {
//             getToolForm.value.OrderNumber = args[0].MfgOrderName;
//             getHisData();
//             getToolData();
//         }
//     }
// };
const clear = () => {
    console.log("selectTable.value", selectTable.value);
    selectTable.value.clear();
};

//打开不良登记
const openDialog = () => {
    toolList.value = [];

    // if (
    //     form.value.MfgOrderName == "" ||
    //     form.value.MfgOrderName == undefined ||
    //     form.value.MfgOrderName == null
    // ) {
    //     ElNotification({
    //         title:'提示',
    //         message:"缺少生产计划号信息",
    //         type:'error'
    //     })
    // }else{
    getToolData();
    editVisible.value = true;
    // }
};

//分页
const handleSizeChange = (val: any) => {
    pageObj.value.currentPage = 1;
    pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
    pageObj.value.currentPage = val;
};
const handleSizeChange1 = (val: any) => {
    fixturePageObj.value.currentPage = 1;
    fixturePageObj.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
    fixturePageObj.value.currentPage = val;
};

const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 358;
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

.el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
    font-size: 1.1rem;
    color: #006487 !important;
    background-color: rgba(255, 255, 255, 0.8);
}

.el-table th.el-table__cell .el-checkbox {
    display: none;
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
