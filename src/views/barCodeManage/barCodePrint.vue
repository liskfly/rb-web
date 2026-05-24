<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }">
            <div ref="headerRef">
                <el-form ref="formRef" :inline="true" size="small">
                    <el-form-item label="时间" class="mb-2">
                        <el-date-picker :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD"
                            type="daterange" range-separator="-" size="small" style="width: 200px" :clearable="false" :disabled-date="disabledDate" />
                    </el-form-item>
                    <el-form-item label="条码类型" class="mb-2">
                        <el-select v-model="getForm.ReprintType" placeholder="" style="width: 150px" @change="changeForm" clearable>
                            <el-option v-for="p in printTypeList" :label="p.Text" :value="p.Value" :key="p.Value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="条码" class="mb-2">
                        <el-input style="width: 150px" v-model="getForm.ContainerName" placeholder="" clearable
                            @change="changeForm"></el-input>
                    </el-form-item>
                    <el-form-item label="工站" class="mb-2">
                        <el-input style="width: 150px" v-model="getForm.Workstation" placeholder="" clearable
                            @change="changeForm"></el-input>
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="changeForm">查询</el-button>
                        <el-button type="warning" :disabled="changeList.length == 0"
                            @click="openRePrint()">补打</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <table-tem :show-index="true" :show-select="true" size="small" :tableData="tableData"
                :tableHeight="tableHeight" :columnData="columnData" :page-size="getForm.PageSize"
                :current-page="getForm.PageNumber" :total="total" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange" @handleSelectionChange="handleSelectionChange">
            </table-tem>
        </el-card>
        <el-dialog v-model="rePrintVisible" title="补打原因" width="400px" align-center draggable :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" @close="closeePrint">
            <el-form-item class="mb-2" label="补打原因">
                <el-input style="width: 240px" type="textarea" v-model="rePrintReason" placeholder=""></el-input>
            </el-form-item>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeePrint">取消</el-button>
                    <el-button type="primary" @click="submitPrint"> 确定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { GetComboBoxList, QueryReprintRecord, Reprint } from "@/api/operate";
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
import { shortcuts, setTodayDate, setLastDate ,disabledDate} from "@/utils/dataMenu";
import tableTem from "@/components/tableTem/noAuto.vue";
import { cloneDeep } from "lodash-es";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { ElNotification, ElMessageBox } from "element-plus";
const userStore = useUserStoreWithOut();
const getForm = ref({
    ReprintType: "",
    Workstation: "",
    ContainerName: "",
    ReprintStartTime: "",
    ReprintEndTime: "",
    PageNumber: 1,
    PageSize: 100,
});
const searchDate = ref<any[]>([]);
const printTypeList = ref<any[]>([]);
const tableHeight = ref(0);
const tableData = ref([
]);
const total = ref(0);
const columnData = reactive([
    {
        text: true,
        prop: "ContainerName",
        label: "条码",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "ReprintType",
        label: "类型",
        width: "",
        // min: true,
        align: "center",
    },
    {
        text: true,
        prop: "WorkStation",
        label: "工位",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "ReprintCount",
        label: "补打次数",
        width: "",
        // min: true,
        align: "center",
    },
    {
        text: true,
        prop: "ReprintReason",
        label: "补打原因",
        width: "",
        min: true,
        align: "1",
    },
    {
        text: true,
        prop: "CreatedBy",
        label: "操作人",
        width: "150",
        // min: true,
        align: "1",
    },
    {
        text: true,
        prop: "CreatedOn",
        label: "打印时间",
        width: "180",
        // min: true,
        align: "1",
    },
    
]);
const changeList = ref<any[]>([]);
const rePrintVisible = ref(false);
const rePrintReason = ref("");
watch(
    () => searchDate.value,
    (newVal: any, oldVal: any) => {
        if (newVal === null) {
            getForm.value.ReprintStartTime = "";
            getForm.value.ReprintEndTime = "";
            getForm.value.PageNumber=1
            getData();
            return;
        }
        if (newVal !== oldVal) {
            getForm.value.ReprintStartTime = newVal[0];
            getForm.value.ReprintEndTime = newVal[1];
            getForm.value.PageNumber=1
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
    getPrintType();
    // getData();
    // getTableData();
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

const changeForm=()=>{
    getForm.value.PageNumber=1
    getData()
}
const getPrintType = () => {
    GetComboBoxList("ReprintType").then((res: any) => {
        printTypeList.value = res.content;
    });
};
const getData = () => {
    QueryReprintRecord(getForm.value).then((res: any) => {
        total.value = res.total;
        tableData.value = res.content;
    });
};
const handleSelectionChange = (val: any) => {
    changeList.value = cloneDeep(val);
};
const openRePrint = () => {
    rePrintVisible.value = true;
};
const closeePrint = () => {
    rePrintVisible.value = false;
    rePrintReason.value = "";
};
const submitPrint = () => {
    let data = changeList.value.map((c: any) => {
        return {
            ...c,
            ReprintCount: c.ReprintCount+1,
            ReprintReason: `${c.ReprintReason !== null ? c.ReprintReason + ";\r\n" : ""
                }补打原因${c.ReprintCount+1}：${rePrintReason.value}`,
            CreatedBy: userStore.getUserInfo,
        };
    });
    Reprint(data).then((res: any) => {
        if (res.success) {
            ElNotification({
                title: "提示信息",
                message: res.msg,
                type: "success",
            });
            getData()
            rePrintVisible.value = false;
            rePrintReason.value = "";
        }
        
    })
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

<style scoped></style>
