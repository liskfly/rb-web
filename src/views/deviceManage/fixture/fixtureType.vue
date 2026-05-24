<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }">
      <div class="pb-2 flex justify-between">
        <el-button type="primary" @click="openAdd(), clearForm()" size="small">添加</el-button>
        <div class="flex">
          <el-input v-model.trim="searchName" style="width: 300px" clearable placeholder="请输入" size="small">
            <template #append>
              <el-button type="primary" icon="Search" size="small"></el-button> </template></el-input>
          <!-- <el-input
            v-model="searchName"
            style="width: 240px"
            placeholder="请输入"
            clearable
          ></el-input> -->
          <!-- <el-button class="ml-3" type="primary" @click="searchData"
            >查询</el-button
          > -->
        </div>
      </div>
      <table-tem size="small" :show-index="true" :tableData="tableData1" :tableHeight="tableHeight"
        :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"></table-tem>
    </el-card>
    <el-dialog align-center :append-to-body="true" :close-on-click-modal="false" v-model="editVisible" @close=""
      title="编辑" width="50%">
      <el-form ref="formRef" :model="EditForm" label-position="left" label-width="auto">
        <el-form-item label="类别">
          <el-input disabled v-model.number="EditForm.MaterialName" style="width: 240px" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="工治具型号编码" prop="WorkSection">
          <el-input disabled v-model="EditForm.CompName" style="width: 240px" :rows="2" type="textarea" />
        </el-form-item>
        <!-- <el-form-item label="材料型号">
          <el-select
            v-model="EditForm.MaterialType"
            placeholder="Select"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="item in [{ label: '钢网刮刀', value: 1 }]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="自定义总次数">
          <el-input disabled v-model.number="EditForm.TotalUses" style="width: 240px" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="停机扫描(生产片数)">
          <el-input :disabled="!editFormControl.CleanAfterUses" v-model.number="EditForm.UsesUntilRevalidation"
            style="width: 240px" placeholder="请输入"></el-input>
          <el-checkbox class="ml-3" v-model="editFormControl.CleanAfterUses" @change="
            EditForm.UsesUntilRevalidation = !editFormControl.CleanAfterUses
              ? 0
              : EditForm.UsesUntilRevalidation
            " label="启用" size="large" />
        </el-form-item>
        <el-form-item label="停机扫描(暂停时间)">
          <el-input :disabled="!editFormControl.CleanAfterPause" v-model.number="EditForm.PauseUntilRevalidate"
            style="width: 240px" placeholder="请输入"></el-input>
          <el-checkbox class="ml-3" v-model="editFormControl.CleanAfterPause" @change="
            EditForm.PauseUntilRevalidate = !editFormControl.CleanAfterPause
              ? 0
              : EditForm.PauseUntilRevalidate
            " label="启用" size="large" />
        </el-form-item>
        <el-form-item label="停机扫描(生产时间)">
          <el-input :disabled="!editFormControl.CleanAfterTime" v-model.number="EditForm.TimeUntilRevalidation"
            style="width: 240px" placeholder="请输入"></el-input>
          <el-checkbox class="ml-3" v-model="editFormControl.CleanAfterTime" @change="
            EditForm.TimeUntilRevalidation = !editFormControl.CleanAfterTime
              ? 0
              : EditForm.TimeUntilRevalidation
            " label="启用" size="large" />
        </el-form-item>
        <el-form-item label="清洗时间">
          <el-input v-model.number="EditForm.CleaningTime" style="width: 240px" class="no_number" placeholder="请输入"
            type="number"></el-input>
        </el-form-item>
        <el-form-item label="张力测试上限值">
          <el-input v-model.number="EditForm.TensionLimit" style="width: 240px" class="no_number" placeholder="请输入"
            type="number"></el-input>
        </el-form-item>
        <el-form-item label="张力测试下限值">
          <el-input v-model.number="EditForm.LowerTensionLimit" style="width: 240px" class="no_number" placeholder="请输入"
            type="number"></el-input>
        </el-form-item>
        <el-form-item label="测试点位数量">
          <el-input v-model.number="EditForm.TensionPoints" style="width: 240px" class="no_number" placeholder="请输入"
            type="number"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
          <el-button @click="editVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="editConfirm"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog align-center :append-to-body="true" :close-on-click-modal="false" v-model="addVisible" @close=""
      title="添加" width="50%">
      <el-form ref="formRef" :model="form" label-position="left" label-width="auto">
        <el-form-item label="类别">
          <el-select v-model="form.MaterialName" placeholder="请选择" style="width: 240px" filterable>
            <el-option v-for="item in MaterialNameList" :key="item.Value" :label="item.Text" :value="item.Value" />
          </el-select>
        </el-form-item>
        <el-form-item label="工治具型号编码" prop="WorkSection">
          <el-input v-model.trim="form.CompName" style="width: 240px" :rows="2" type="textarea" />
        </el-form-item>
        <!-- <el-form-item label="材料型号">
          <el-select
            v-model="EditForm.MaterialType"
            placeholder="Select"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="item in [{ label: '钢网刮刀', value: 1 }]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="自定义总次数">
          <el-input v-model.number="form.TotalUses" style="width: 240px" class="no_number" placeholder="请输入"
            type="number"></el-input>
        </el-form-item>
        <el-form-item label="停机扫描(生产片数)">
          <el-input :disabled="!formControl.CleanAfterUses" v-model.number="form.UsesUntilRevalidation"
            style="width: 240px" class="no_number" placeholder="请输入" type="number"></el-input>
          <el-checkbox class="ml-3" v-model="formControl.CleanAfterUses" @change="
            form.UsesUntilRevalidation = !formControl.CleanAfterUses
              ? 0
              : form.UsesUntilRevalidation
            " label="启用" size="large" />
        </el-form-item>
        <el-form-item label="停机扫描(暂停时间)">
          <el-input :disabled="!formControl.CleanAfterPause" v-model.number="form.PauseUntilRevalidate"
            style="width: 240px" class="no_number" placeholder="请输入" type="number"></el-input>
          <el-checkbox class="ml-3" v-model="formControl.CleanAfterPause" @change="
            form.PauseUntilRevalidate = !formControl.CleanAfterPause
              ? 0
              : form.PauseUntilRevalidate
            " label="启用" size="large" />
        </el-form-item>
        <el-form-item label="停机扫描(生产时间)">
          <el-input :disabled="!formControl.CleanAfterTime" v-model.number="form.TimeUntilRevalidation"
            style="width: 240px" class="no_number" placeholder="请输入" type="number"></el-input>
          <el-checkbox class="ml-3" v-model="formControl.CleanAfterTime" @change="
            form.TimeUntilRevalidation = !formControl.CleanAfterTime
              ? 0
              : form.TimeUntilRevalidation
            " label="启用" size="large" />
        </el-form-item>
        <el-form-item label="清洗时间">
          <el-input v-model.number="form.CleaningTime" style="width: 240px" class="no_number" placeholder="请输入"
            type="number"></el-input>
        </el-form-item>
        <el-form-item label="张力测试上限值">
          <el-input v-model.number="form.TensionLimit" style="width: 240px" class="no_number" placeholder="请输入"
            type="number"></el-input>
        </el-form-item>
        <el-form-item label="张力测试下限值">
          <el-input v-model.number="form.LowerTensionLimit" style="width: 240px" class="no_number" placeholder="请输入"
            type="number"></el-input>
        </el-form-item>
        <el-form-item label="测试点位数量">
          <el-input v-model.number="form.TensionPoints" style="width: 240px" class="no_number" placeholder="请输入"
            type="number"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
          <el-button @click="addVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="addSumbit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import { ToolsType, GetComboBoxList } from "@/api/operate";
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

//   const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const searchName = ref("");
const deleteVisible = ref(false);
const deleteChoice = ref("");
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
const tableData1 = ref([]);

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
const openAdd = () => {
  addVisible.value = true;
  GetComboBoxList("ToolsType").then((res: any) => {
    MaterialNameList.value = res.content;
    // console.log(res.content);
  });
};

const editSubmit = (data: any) => {
  EditForm.value.operationtype = data.operationtype;
  EditForm.value.CompName = data.CompName;
  EditForm.value.MaterialType = data.MaterialType;
  EditForm.value.MaterialName = data.MaterialName;
  EditForm.value.CompType = data.CompType;
  EditForm.value.TotalUses = data.TotalUses;
  EditForm.value.UsesUntilRevalidation = data.UsesUntilRevalidation;
  EditForm.value.PauseUntilRevalidate = data.PauseUntilRevalidate;
  EditForm.value.TimeUntilRevalidation = data.TimeUntilRevalidation;
  EditForm.value.CleaningTime = data.CleaningTime;
  editFormControl.value.CleanAfterUses = data.CleanAfterUses === "Y";
  editFormControl.value.CleanAfterPause = data.CleanAfterPause === "Y";
  editFormControl.value.CleanAfterTime = data.CleanAfterTime === "Y";
  editVisible.value = true;
};
interface toolType {
  Text: string;
  Value: string;
}

const MaterialNameList = ref<toolType[]>([]);

const editConfirm = () => {
  ToolsType({
    ...EditForm.value,
    CleanAfterUses: `${editFormControl.value.CleanAfterUses ? "Y" : "N"}`,
    CleanAfterPause: `${editFormControl.value.CleanAfterPause ? "Y" : "N"}`,
    CleanAfterTime: `${editFormControl.value.CleanAfterTime ? "Y" : "N"}`,
    operationtype: "UPD",
  }).then((data: any) => {
    if (!data) {
      return;
    }
    clearEditForm();
    ElNotification({
      type: "success",
      title: "提示信息",
      message: data.msg,
    });
    getData();
    editVisible.value = false;
  });
};

const deleteSubmit = (data: any) => {
  // deleteVisible.value = true;
  // deleteChoice.value = data.CompName;
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ToolsType({ CompName: data.CompName, operationtype: "DEL" }).then(
        (data: any) => {
          if (!data) {
            return;
          }
          ElNotification({
            type: "success",
            title: "提示信息",
            message: data.msg,
          });
          getData();
        }
      );
    })
    .catch(() => {
      ElNotification({
        type: "info",
        message: "取消操作",
      });
    });
};

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

const addSumbit = () => {
  ToolsType({
    ...form.value,
    CleanAfterUses: `${formControl.value.CleanAfterUses ? "Y" : "N"}`,
    CleanAfterPause: `${formControl.value.CleanAfterPause ? "Y" : "N"}`,
    CleanAfterTime: `${formControl.value.CleanAfterTime ? "Y" : "N"}`,
    operationtype: "ADD",
  }).then((data: any) => {
    if (!data) {
      return;
    }
    clearForm();
    ElMessage({
      message: data.msg,
      type: "success",
    });
    getData();
    addVisible.value = false;
  });
};

watch(
  () => searchName.value,
  (newdata) => {
    // console.log(newdata);
    if (newdata == "") {
      tableData1.value = tableData.value;
    } else {
      tableData1.value = table1(newdata);
    }
  }
);
const table1 = (newdata: any) => {
  let searchName = newdata.toLowerCase();
  return tableData.value.filter((v: any) => {
    return Object.keys(v).some((key) => {
      return String(v[key]).toLowerCase().indexOf(searchName) > -1;
    });
  });
};
// const searchData = () => {
//   if (inputValue.value === "") {
//     getData();
//     return;
//   }
//   ToolsType({ CompName: inputValue.value, operationtype: "QUE" }).then(
//     (data: any) => {
//       if (!data) {
//         return;
//       }
//       if (!data.content) {
//         tableData.value = [];
//         return;
//       }
//       const dataText = data.content;
//       tableData.value = dataText;
//     }
//   );
//   inputValue.value = "";
// };

const getData = () => {
  ToolsType({ operationtype: "QAL" }).then((data: any) => {
    if (data.content === null || data.content.length === 0) {
      tableData.value = [];
      return;
    }
    tableData.value = data.content;
    if (searchName.value.trim()) {
      tableData1.value = table1(searchName.value);
    } else {
      tableData1.value = data.content;
    }
  });
};

const columnData = reactive([
  {
    text: true,
    prop: "MaterialName",
    label: "类别",
    width: "",
    min: true,
    align: "1",
    fixed: true,
  },
  {
    text: true,
    prop: "CompName",
    label: "工治具型号编码",
    width: "200",
    min: true,
    align: "1",
    fixed: true,
  },
  // {
  //   text: false,
  //   tag: true,
  //   tagType: "number",
  //   tagItem: [{ text: "钢网刮刀", type: "primary", number: 1 },{ text: "smt", type: "primary", number: 0 },{ text: "锡膏", type: "primary", number: 2 }],
  //   // tagItem:{'已发料':'primary'},
  //   prop: "MaterialType",
  //   label: "材料型号",
  //   width: "",
  //   min: true,
  //   align: "center",
  // },
  {
    text: true,
    prop: "TotalUses",
    label: "自定义总次数",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "UsesUntilRevalidation",
    label: "停机扫描(生产片数)",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "PauseUntilRevalidate",
    label: "停机扫描(暂停时间)",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "TimeUntilRevalidation",
    label: "停机扫描(生产时间)",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CleaningTime",
    label: "清洗时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "TensionLimit",
    label: "张力测试上限值",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "LowerTensionLimit",
    label: "张力测试下限值",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "TensionPoints",
    label: "测试点位数量",
    width: "",
    min: true,
    align: "center",
  },
  {
    isOperation: true,
    label: "操作",
    width: "120",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "编辑",
        icon: "EditPen",
        buttonClick: editSubmit,
      },
      {
        type: "danger",
        label: "删除",
        icon: "Delete",
        buttonClick: deleteSubmit,
      },
    ],
  },
]);

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  getData();
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
    tableHeight.value = window.innerHeight - 195;
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
