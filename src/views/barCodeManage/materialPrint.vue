<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }">
            <div ref="headerRef">
                <el-form ref="formRef" :inline="true" size="small">
                    <el-form-item label="时间" class="mb-2">
                        <el-date-picker :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD"
                            type="daterange" range-separator="-" size="small" style="width: 200px" :clearable="false"
                            :disabled-date="disabledDate" />
                    </el-form-item>
                    <el-form-item label="物料条码" class="mb-2">
                        <el-input style="width: 150px" v-model="getForm.ContainerName" placeholder="" clearable
                            @change="changeForm"></el-input>
                    </el-form-item>
                    <el-form-item label="计划单号" class="mb-2">
                        <el-input style="width: 150px" v-model="getForm.MfgOrderName" placeholder="" clearable
                            @change="changeForm"></el-input>
                    </el-form-item>

                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="changeForm">查询</el-button>
                        <el-button type="warning" :disabled="changeList.length == 0 || changeList.length > 10"
                            @click="submitPrint()">补打</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table :data="tableData" size="small" stripe border fit ref="tableRef"  :height="tableHeight" :tooltip-effect="'dark'"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" fixed width="55" align="center" />
                <el-table-column type="index" align="center" fixed label="序号" :width="'50'">
                    <template #default="scope">
                        <span>{{ scope.$index + getForm.PageSize * (getForm.PageNumber - 1) + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="containerName" label="物料条码" />
                <el-table-column prop="ConsumingOrder" label="计划单号" />
                <el-table-column prop="MaterialName" label="物料编码" />
                <el-table-column prop="MaterialDesc" label="物料描述" width="350" :show-overflow-tooltip="true" />
                <el-table-column prop="VendorName" label="供应商名称" />
                <el-table-column prop="VendorLotNumber" label="批次号" />
                <el-table-column prop="ReceivedDate" label="时间" />
            </el-table>
            <div class="mt-2 mb-2">
                <el-pagination :size="'default'" background @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" :pager-count="5" :current-page="getForm.PageNumber"
                    :page-size="getForm.PageSize" :page-sizes="[30, 50, 100, 200, 300]"
                    layout="total,sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>
            <!-- <table-tem :show-index="true" ref="tableRef" :show-select="true" size="small" :tableData="tableData"
                :tableHeight="tableHeight" :columnData="columnData" :page-size="getForm.PageSize"
                :current-page="getForm.PageNumber" :total="total" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange" @handleSelectionChange="handleSelectionChange">
            </table-tem> -->
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { QuerySendMaterialCode, PrintSendMaterialCode } from "@/api/operate";
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
import {
    shortcuts,
    setTodayDate,
    setLastDate,
    disabledDate,
} from "@/utils/dataMenu";
import tableTem from "@/components/tableTem/noAuto.vue";
import { cloneDeep } from "lodash-es";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { ElNotification, ElMessageBox } from "element-plus";
import type { forEach } from "lodash-es";
const userStore = useUserStoreWithOut();
const getForm = ref({
    MfgOrderName: "",
    ContainerName: "",
    SendStartDate: "",
    SendEndDate: "",
    PageNumber: 1,
    PageSize: 100,
});
const searchDate = ref<any[]>([]);
const printTypeList = ref<any[]>([]);
const tableHeight = ref(0);
const tableData = ref([]);
const total = ref(0);
const tableRef = ref();
const columnData = reactive([
    {
        text: true,
        prop: "containerName",
        label: "物料条码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "ConsumingOrder",
        label: "计划单号",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialName",
        label: "物料编码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MaterialDesc",
        label: "物料描述",
        width: "300",
        // min: true,
        align: "1",
    },
    {
        text: true,
        prop: "VendorName",
        label: "供应商名称",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "VendorLotNumber",
        label: "批次号",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "ReceivedDate",
        label: "打印时间",
        width: "180",
        // min: true,
        align: "1",
    },
]);
const changeList = ref<any[]>([]);
watch(
    () => searchDate.value,
    (newVal: any, oldVal: any) => {
        if (newVal === null) {
            getForm.value.SendStartDate = "";
            getForm.value.SendEndDate = "";
            getForm.value.PageNumber = 1;
            getData();
            return;
        }
        if (newVal !== oldVal) {
            getForm.value.SendStartDate = newVal[0];
            getForm.value.SendEndDate = newVal[1];
            getForm.value.PageNumber = 1;
            getData();
        }
    }
);
onBeforeMount(() => {
    getScreenHeight();
    let end: string = setTodayDate();
    let start: string = setLastDate();
    searchDate.value = [start, end];
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    // getPrintType();
    // getData();
    // getTableData();
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

const changeForm = () => {
    getForm.value.PageNumber = 1;
    getData();
};
// const getPrintType = () => {
//     GetComboBoxList("ReprintType").then((res: any) => {
//         printTypeList.value = res.content;
//     });
// };
const getData = () => {
    QuerySendMaterialCode(getForm.value).then((res: any) => {
        total.value = res.total;
        tableData.value = res.content;
    });
};
const handleSelectionChange = (val: any) => {
    changeList.value = cloneDeep(val);
    
};
// const handleSelectionAllChange=()=>{
//     tableData.value.forEach((t:any,i:any)=>{
//         if(i>=10){
//             tableRef.value.toggleRowSelection(t,false)
           
//         }
//     })
// }

const submitPrint = () => {
    let data = changeList.value.map((c: any) => {
        return {
            LPN: c.containerName,
            Itemcode: c.MaterialName,
            SupplierName: c.VendorName,
            SupplierCode: c.VendorLotNumber,
            ProductionDate: c.ReceivedDate,
            BatchNumber: c.ConsumingOrder,
            WorkStation: "BICV-ASY-0001",
            userAccount: userStore.getUserInfo,
        };
    });
    PrintSendMaterialCode(data).then((res: any) => {
        if (res.success) {
            ElNotification({
                title: "提示信息",
                message: res.msg,
                type: "success",
            });
            getData();
        }
    });
    // console.log(data);
};

const handleSizeChange = (val: any) => {
    getForm.value.PageNumber = 1;
    getForm.value.PageSize = val;
    getData();
};
const handleCurrentChange = (val: any) => {
    getForm.value.PageNumber = val;
    getData();
};
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 185;
    });
};
</script>

<style scoped>
.el-pagination {
    justify-content: center;
}
</style>
