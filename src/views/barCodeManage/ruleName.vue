<template>
    <div class="p-2">
        <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }">
            <div class="pb-1 flex justify-between">
                <el-button type="primary" @click="openAdd" size="small">添加</el-button>
                <el-form ref="formRef" size="small" :model="getForm" label-width="auto" :inline="true">
                    <el-form-item label="规则编码" prop="ProductName" class="mb-1">
                        <el-input v-model="getForm.Temppara_No" style="width: 160px" clearable @clear="getData"
                            @change="getData" />
                    </el-form-item>
                    <el-form-item label="规则描述" prop="ProductDescription" class="mb-1">
                        <el-input v-model="getForm.Temppara_Name" style="width: 160px" clearable @clear="getData"
                            @change="getData" />
                    </el-form-item>
                    <el-form-item class="mb-2">
                        <el-button type="primary" @click="getData">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <table-tem :show-index="true" size="small" :tableData="tableData" :tableHeight="tableHeight"
                :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"></table-tem>
        </el-card>
        <el-dialog v-model="addVisible" title="添加规则名称" draggable width="400px" :append-to-body="true"
            :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="addCancel">
            <el-form ref="addFormRef" :model="addForm" label-width="auto">
                <el-form-item label="规则编码" prop="Temppara_No">
                    <el-input v-model="addForm.Temppara_No" style="width: 240px" />
                </el-form-item>
                <el-form-item label="规则描述" prop="Temppara_Name">
                    <el-input v-model="addForm.Temppara_Name" style="width: 240px" />
                </el-form-item>
                <el-form-item label="取值规则" prop="Temppara_Expression">
                    <el-select v-model="addForm.Temppara_Expression" placeholder="" style="width: 240px">
                        <el-option v-for="e in expressionList" :key="e.Expression_Name"
                            :label="e.Expression_Description" :value="e.Expression_Name" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addCancel">取消</el-button>
                    <el-button type="primary" @click="addConfirm"> 确定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    QueryBarCodeRuleTemplatePara,
    InsertBarCodeRuleTemplatePara,
    DeleteBarCodeRuleTemplatePara,
    QueryBarCodeRuleExpressionType,
} from "@/api/operate";
import {
    ref,
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    nextTick,
    reactive,
} from "vue";
import tableTem from "@/components/tableTem/index.vue";
import { ElNotification, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
const userStore = useUserStoreWithOut();
const getForm = ref({
    Temppara_No: "",
    Temppara_Name: ""
});
const tableData = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
    pageSize: 100,
    currentPage: 1,
});
const handleDelete = (row: any) => {
    // console.log(row);
    ElMessageBox.confirm("确定删除", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            DeleteBarCodeRuleTemplatePara({
                Temppara_No: row.Temppara_No,
                UserNo: userStore.getUserInfo,
            }).then((res: any) => {
                if (res.success) {
                    ElNotification({
                        title: "提示信息",
                        message: "删除成功",
                        type: "success",
                    });
                    getData();
                }
            });
        })
        .catch(() => {
            ElNotification({
                title: "提示",
                message: "取消操作",
                type: "info",
            });
        });
};
const columnData = ref([

    {
        text: true,
        prop: "Temppara_No",
        label: "规则编码",
        width: "",
        // min: true,
        align: "1",
    },

    {
        text: true,
        prop: "Temppara_Name",
        label: "规则描述",
        width: "",
        // min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Temppara_Expression",
        label: "取值规则",
        width: "",
        // min: true,
        align: "1",
    },
    {
        text: true,
        prop: "Expression_Description",
        label: "取值规则描述",
        width: "",
        // min: true,
        align: "1",
    },
    {
        isOperation: true,
        label: "删除",
        width: "80",
        align: "center",
        fixed: "right",
        operation: [
            {
                type: "danger",
                label: "删除",
                icon: "Delete",
                buttonClick: handleDelete,
            },
        ],
    },
]);
const addVisible = ref(false);
const addFormRef = ref();
const addForm = ref({
    Temppara_No: "",
    Temppara_Name: "",
    Temppara_Expression: "",
    UserNo: userStore.getUserInfo,
});
interface Expression {
    ID: number;
    Expression_No: number;
    Expression_Name: string;
    Expression_Description: string;
}
const expressionList = ref<Expression[]>([]);

onBeforeMount(() => {
    getScreenHeight();
});
onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
    getData();
    getExpressionList()
});
onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
    QueryBarCodeRuleTemplatePara(getForm.value).then((res: any) => {
        tableData.value = res.content;
    });
};
const getExpressionList = () => {
    QueryBarCodeRuleExpressionType().then((res: any) => {
        expressionList.value = res.content;
    });
};

const openAdd = () => {
    addVisible.value = true;
};
const addCancel = () => {
    addFormRef.value.resetFields();
    addVisible.value = false;
};
const addConfirm = () => {
    InsertBarCodeRuleTemplatePara(addForm.value).then((res: any) => {
        if (res.success) {
            ElNotification({
                title: "提示信息",
                message: res.msg,
                type: "success",
            });
            getData();
            addFormRef.value.resetFields();
            addVisible.value = false;
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
const getScreenHeight = () => {
    nextTick(() => {
        tableHeight.value = window.innerHeight - 190;
    });
};
</script>

<style scoped></style>
