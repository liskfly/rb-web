<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }">
      <div class="flex justify-between">
        <!-- <el-button type="primary" @click="clearForm(),addVisible = true"
            >添加</el-button
          > -->
        <div class="flex">
          <!-- <el-input
              v-model="inputValue"
              style="width: 240px"
              placeholder="请输入"
            ></el-input> -->
          <el-form ref="formRef" class="form" :inline="true" label-width="">
            <el-form-item label="时间" class="mb-2">
              <el-date-picker
              :shortcuts="shortcuts"
                v-model="dateValue"
                type="daterange"
                range-separator="到"
                 size="small"
                value-format="YYYY-MM-DD"
                @change="dateChange"
              />
            </el-form-item>
            <el-form-item label="备件名称" class="mb-2">
              <el-input
                v-model="searchForm.PartName"
                style="width: 240px" size="small"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="" class="mb-2">
              <el-button class="ml-3" type="primary" @click="searchData" size="small"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
          <!-- <el-input v-model="inputValue" placeholder="请输入">
                        <template #append>
                            <el-button type="primary" icon="Search" @click="getData"></el-button> </template></el-input> -->
        </div>
      </div>
      <table-tem
        size="small"
        :show-index="true"
        :tableData="tableData"
        :tableHeight="tableHeight"
        :columnData="columnData"
        :pageObj="pageObj"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-tem>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import { GetPartsScrapList } from "@/api/sparePartsApi";
import {
  ref,
  unref,
  nextTick,
  reactive,
  onBeforeMount,
  watch,
  computed,
  onMounted,
  onBeforeUnmount,
} from "vue";
import {shortcuts,setTodayDate,setLastDate} from "@/utils/dataMenu"

interface formTS {
  operationtype: string;
  CompName: string;
  MaterialType: number;
  MaterialName: string;
  CompType: number;
  TotalUses: number;
  CleanAfterUses: string;
  UsesUntilRevalidation: number;
  CleanAfterPause: string;
  PauseUntilRevalidate: number;
  CleanAfterTime: string;
  TimeUntilRevalidation: number;
  CleaningTime: number;
  TensionLimit: number;
  LowerTensionLimit: number;
  TensionPoints: number;
}

interface EditFormTS {
  operationtype: string;
  CompName: string;
  MaterialType: number;
  MaterialName: string;
  CompType: number;
  TotalUses: number;
  CleanAfterUses: string;
  UsesUntilRevalidation: number;
  CleanAfterPause: string;
  PauseUntilRevalidate: number;
  CleanAfterTime: string;
  TimeUntilRevalidation: number;
  CleaningTime: number;
  TensionLimit: number;
  LowerTensionLimit: number;
  TensionPoints: number;
}

interface SearchFormTS {
  PartName: string;
  StartDate: string;
  EndDate: string;
}

//   const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const dateValue = ref<any[]>([]);
const deleteVisible = ref(false);
const deleteChoice = ref("");
const tableData1 = ref<any[]>([]);
const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});

const formControl = ref({
  CleanAfterUses: false,
  CleanAfterPause: false,
  CleanAfterTime: false,
});

const editFormControl = ref({
  CleanAfterUses: false,
  CleanAfterPause: false,
  CleanAfterTime: false,
});

// watch(formControl, (newVal, oldVal) => {
//   UsesUntilRevalidation = ''
//     });

const tableData = ref([]);

const form = ref<formTS>({
  operationtype: "",
  CompName: "",
  MaterialType: 1,
  MaterialName: "",
  CompType: 3,
  TotalUses: 0,
  CleanAfterUses: "N",
  UsesUntilRevalidation: 0,
  CleanAfterPause: "N",
  PauseUntilRevalidate: 0,
  CleanAfterTime: "N",
  TimeUntilRevalidation: 0,
  CleaningTime: 0,
  TensionLimit: 0,
  LowerTensionLimit: 0,
  TensionPoints: 0,
});

const EditForm = ref<EditFormTS>({
  operationtype: "",
  CompName: "",
  MaterialType: 1,
  MaterialName: "",
  CompType: 3,
  TotalUses: 0,
  CleanAfterUses: "N",
  UsesUntilRevalidation: 0,
  CleanAfterPause: "N",
  PauseUntilRevalidate: 0,
  CleanAfterTime: "N",
  TimeUntilRevalidation: 0,
  CleaningTime: 0,
  TensionLimit: 0,
  LowerTensionLimit: 0,
  TensionPoints: 0,
});

const searchForm = ref<SearchFormTS>({
  PartName: "",
  StartDate: "",
  EndDate: "",
});

interface toolType {
  Text: string;
  Value: string;
}

const MaterialNameList = ref<toolType[]>([]);

const clearForm = () => {
  form.value = {
    operationtype: "",
    CompName: "",
    MaterialType: 1,
    MaterialName: "",
    CompType: 3,
    TotalUses: 0,
    CleanAfterUses: "N",
    UsesUntilRevalidation: 0,
    CleanAfterPause: "N",
    PauseUntilRevalidate: 0,
    CleanAfterTime: "N",
    TimeUntilRevalidation: 0,
    CleaningTime: 0,
    TensionLimit: 0,
    LowerTensionLimit: 0,
    TensionPoints: 0,
  };

  formControl.value = {
    CleanAfterUses: false,
    CleanAfterPause: false,
    CleanAfterTime: false,
  };
};

const clearEditForm = () => {
  EditForm.value = {
    operationtype: "",
    CompName: "",
    MaterialType: 1,
    MaterialName: "",
    CompType: 3,
    TotalUses: 0,
    CleanAfterUses: "N",
    UsesUntilRevalidation: 0,
    CleanAfterPause: "N",
    PauseUntilRevalidate: 0,
    CleanAfterTime: "N",
    TimeUntilRevalidation: 0,
    CleaningTime: 0,
    TensionLimit: 0,
    LowerTensionLimit: 0,
    TensionPoints: 0,
  };
};

const getData = () => {
  GetPartsScrapList({}).then((res: any) => {
    if (res && res.success && res.content.length !== 0) {
      tableData.value = res.content;
      //   ElNotification({
      //     title: res.msg,
      //     // message: "取消操作",
      //     type: "success",
      //   });
    }
  });
};

const dateChange = (data: any) => {
  if (data !== null && data !== '') {
    searchForm.value.StartDate = data[0];
    searchForm.value.EndDate = data[1];
  } else {
    searchForm.value.StartDate = "";
    searchForm.value.EndDate = "";
  }
};

const searchData = () => {
  GetPartsScrapList(searchForm.value).then((res: any) => {
    if (res && res.success) {
      tableData.value = res.content;
      //   ElNotification({
      //     title: res.msg,
      //     // message: "取消操作",
      //     type: "success",
      //   });
    }
  });
};

const columnData = reactive([
  {
    text: true,
    prop: "PartName",
    label: "备件名称",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ClassName",
    label: "类型名称",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ClassDesc",
    label: "类型描述",
    width: "200",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "PurchaseNo",
    label: "采购单号",
    width: "200",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Qty",
    label: "数量",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Remark",
    label: "备注",
    width: "200",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ScrapReason",
    label: "报废原因",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CreatedOn",
    label: "报废时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CreatedBy",
    label: "报废人",
    width: "",
    min: true,
    align: "center",
  },

  // {
  //   isOperation: true,
  //   label: "操作",
  //   width: "120",
  //   align: "center",
  //   fixed: "right",
  //   operation: [
  //     {
  //       type: "primary",
  //       label: "编辑",
  //       icon: "EditPen",
  //       buttonClick: ,
  //     },
  //     {
  //       type: "danger",
  //       label: "删除",
  //       icon: "Delete",
  //       buttonClick: ,
  //     },
  //   ],
  // },
]);

onBeforeMount(() => {
  getScreenHeight();
  let end: string = setTodayDate();
  let start: string = setLastDate();
  dateValue.value = [start, end];
  searchForm.value.StartDate = start;
  searchForm.value.EndDate = end;
});
onMounted(() => {
  searchData();
  window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 194;
  });
};
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}

::v-deep .no_number input::-webkit-inner-spin-button,
::v-deep .no_number input::-webkit-outer-spin-button {
  -webkit-appearance: none !important;
}

::v-deep .no_number input[type="number"] {
  appearance: textfield;
}
</style>
