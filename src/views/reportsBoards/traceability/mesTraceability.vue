<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px' }">
            <div ref="headerRef">
                <el-form ref="formRef" :inline="true" size="small">
                    <el-form-item label="时间" class="mb-2">
                        <el-date-picker :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD"
                            type="daterange" range-separator="-" size="small" style="width: 200px" :disabled-date="disabledDate" :clearable="false"/>
                    </el-form-item>
                    <el-form-item label="计划单号" class="mb-2">
                        <el-input style="width: 150px" v-model="getForm.MfgOrderName" placeholder="" clearable
                            @change="changeForm"></el-input>
                    </el-form-item>
                    <el-form-item label="物料编码" class="mb-2">
                        <el-input style="width: 150px" v-model="getForm.MaterialName" placeholder="" clearable
                            @change="changeForm"></el-input>
                    </el-form-item>
                    <el-form-item label="MES条码" class="mb-2">
                        <el-input style="width: 150px" v-model="getForm.ContainerName" placeholder="" clearable
                            @change="changeForm"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="TUID号" class="mb-2">
                        <el-input style="width: 150px" v-model="getForm.pcb" placeholder="" clearable
                            @change="getData"></el-input>
                    </el-form-item> -->

                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="changeForm()">查询</el-button>
                        <!-- <el-button type="warning" @click="exportFile" :disabled="tableData.length==0">导出</el-button> -->
                    </el-form-item>
                    <!-- <el-form-item  class="mb-2">
                       
                    </el-form-item> -->
                </el-form>
            </div>
            <table-tem id="mesTable" :show-index="true" size="small" :tableData="tableData" :tableHeight="tableHeight"
                :columnData="columnData" :page-size="getForm.pageSize" :current-page="getForm.currentPage" :total="total1" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange" @rowClick="rowClick">
            </table-tem>
       
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { QueryMESContainerTracedBack } from "@/api/report";
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
import tableTem from "@/components/tableTem/noAuto.vue";
import { shortcuts, setTodayDate, setLastDate ,disabledDate} from "@/utils/dataMenu";
import {exportElTableToExcel} from "@/utils/computeXLXS"
const getForm = ref({
    MfgOrderName: "",
    ContainerName: "",
    MaterialName: "",
    StartTime: "",
    EndTime: "",
    pageSize: 100,
    currentPage: 1,
});
const searchDate = ref<any[]>([]);
const headerRef = ref();
const tableHeight = ref(0);
const detailHeight = ref(0);
const tableData = ref<any>([]);
    const total1=ref(1)
const pageObj = ref({
    pageSize: 100,
    currentPage: 1,
});
const columnData = reactive([
    {
        text: true,
        prop: "PlannedStartDate",
        label: "生产时间",
        width: "",
        min: true,
        align: "1",
    },

    {
        text: true,
        prop: "WorkCenterDesc",
        label: "车间",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "MfgLineDesc",
        label: "产线",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Description",
        label: "工位",
        width: "",
        min: true,
        align: "1",
    },

    {
        text: true,
        prop: "MfgOrderName",
        label: "计划单号",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "ProductModel",
        label: "机型",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "productName",
        label: "产品编码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "OrderStatusDesc",
        label: "工单状态",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "ContainerName",
        label: "物料条码",
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
        prop: "MaterialSole",
        label: "物料唯一码",
        width: "",
        min: true,
        align: "1",
    },
]);
const detailData = ref([]);
const detailColumn = reactive([
    {
        text: true,
        prop: "Side",
        label: "工序名称",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "ERPOrder",
        label: "生产时间",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Qty",
        label: "产线名称",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Qty",
        label: "原材料编码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Qty",
        label: "原材料批号",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Qty",
        label: "原材料唯一码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Qty",
        label: "原材料名称",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Qty",
        label: "操作人",
        width: "",
        min: true,
        align: "1",
    },
]);

watch(
    () => searchDate.value,
    (newVal: any, oldVal: any) => {
        if (newVal === null) {
            getForm.value.StartTime = "";
            getForm.value.EndTime = "";
            getForm.value.currentPage=1
            getData();
            return;
        }
        if (newVal !== oldVal) {
            getForm.value.StartTime = newVal[0];
            getForm.value.EndTime = newVal[1];
            getForm.value.currentPage=1
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
    // getData();
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});
const changeForm=()=>{
    getForm.value.currentPage=1
    getData()
}
const getData = () => { 
    QueryMESContainerTracedBack(getForm.value).then((res:any)=>{
        if(res.content.length!==0){
            total1.value=res.total
        }else{
            total1.value=0
        }
        tableData.value=res.content
    })
};
const rowClick = () => { };
const handleSizeChange = (val: any) => {
    getForm.value.currentPage = 1;
    getForm.value.pageSize = val;
    getData()
};
const handleCurrentChange = (val: any) => {
    getForm.value.currentPage = val;
    getData()
};
// const exportFile=()=>{
//     exportElTableToExcel('mesTable',`MES条码追溯${1232}`)
// }
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 195;
        detailHeight.value = (window.innerHeight - 225) * 0.4;
    });
};
</script>

<style scoped></style>
