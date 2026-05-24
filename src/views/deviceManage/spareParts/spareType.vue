<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }">
      <div class="pb-2 flex justify-between">
        <el-button type="primary" @click="clearForm(), (addVisible = true)" size="small"
          >添加</el-button
        >
        <div class="flex">
          <el-input
           size="small"
            v-model="inputValue"
            style="width: 240px"
            placeholder="请输入"
            clearable
          ></el-input>
          <el-button class="ml-3" type="primary" @click="serachData" size="small"
            >查询</el-button
          >
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
    <el-dialog
      align-center
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="editVisible"
      @close=""
      title="编辑"
      width="50%"
    >
      <el-form
        ref="formRef"
        :model="EditForm"
        label-position="left"
        label-width="auto"
      >
        <el-form-item label="类别">
          <el-input v-model="EditForm.ClassName" style="width: 400px" />
        </el-form-item>
        <el-form-item label="类别描述">
          <el-input
            v-model="EditForm.Description"
            style="width: 400px"
            type="textarea"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
          <el-button @click="editVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="editData"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      align-center
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="addVisible"
      @close=""
      title="添加"
      width="50%"
    >
      <el-form
        ref="formRef"
        :model="form"
        label-position="left"
        label-width="auto"
      >
        <el-form-item label="类别">
          <el-input v-model="form.ClassName" style="width: 400px" />
        </el-form-item>
        <el-form-item label="类别描述">
          <el-input
            v-model="form.Description"
            style="width: 400px"
            type="textarea"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
          <el-button @click="addVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="addData"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import {
  GetPartsClassList,
  addPartsClassData,
  updatePartsClassData,
  deletePartsClassData,
} from "@/api/sparePartsApi";
import { useUserStoreWithOut } from "@/stores/modules/user";
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

const userStore = useUserStoreWithOut();

interface formTS {
  ClassName: string;
  Description: string;
  CreatedBy: string;
}

interface EditFormTS {
  ClassID: string;
  ClassName: string;
  Description: string;
  UpdateBy: string;
}

//   const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const inputValue = ref("");
const deleteVisible = ref(false);
const deleteChoice = ref("");
const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});
const loginName = userStore.getUserInfo;

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
  ClassName: "",
  Description: "",
  CreatedBy: loginName,
});

const EditForm = ref<EditFormTS>({
  ClassID: "",
  ClassName: "",
  Description: "",
  UpdateBy: loginName,
});

//修改按钮
const editSubmit = (data: any) => {
  EditForm.value.ClassID = data.ClassID;
  EditForm.value.ClassName = data.ClassName;
  EditForm.value.Description = data.Description;
  EditForm.value.UpdateBy = loginName;
  editVisible.value = true;
};
interface toolType {
  Text: string;
  Value: string;
}

const MaterialNameList = ref<toolType[]>([]);

//清空添加
const clearForm = () => {
  form.value = {
    ClassName: "",
    Description: "",
    CreatedBy: loginName,
  };

  formControl.value = {
    CleanAfterUses: false,
    CleanAfterPause: false,
    CleanAfterTime: false,
  };
};

//清空修改
const clearEditForm = () => {
  EditForm.value = {
    ClassID: "",
    ClassName: "",
    Description: "",
    UpdateBy: loginName,
  };
};

//页面初始请求数据
const getData = () => {
  GetPartsClassList({}).then((res: any) => {
    if (res && res.success && res.content.length !== 0) {
      tableData.value = res.content;
      //   .filter((item:any) => !item.RowDeleted)
      //   ElNotification({
      //     title: res.msg,
      //     // message: "取消操作",
      //     type: "success",
      //   });
    }
  });
};

//搜索
const serachData = () => {
  if (inputValue.value === "") {
    getData();
  } else {
    // GetPartsClassList({ ClassName: inputValue.value }).then((res: any) => {
    //   if (res && res.success && res.content.length !== 0) {
    //     tableData.value = res.content;
    //     ElNotification({
    //       title: res.msg,
    //       // message: "取消操作",
    //       type: "success",
    //     });
    //   } else {
    //     tableData.value = res.content;
    //   }
    // });
  }
};

//删除
const deleteSubmit = (data: any) => {
  //   deleteVisible.value = true;
  deleteChoice.value = data.ClassID;
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deletePartsClassData(data.ClassID, loginName).then((data: any) => {
        if (!data) {
          return;
        }
        ElNotification({
          type: "success",
          message: data.msg,
        });
        getData();
      });
    })
    .catch(() => {
      ElNotification({
        type: "info",
        message: "取消操作",
      });
    });
};

//添加
const addData = () => {
  addPartsClassData(form.value).then((res: any) => {
    if (res && res.success) {
      addVisible.value = false;
      ElNotification({
        title: '提示信息',
        message: res.msg,
        type: "success",
      });
    }
    getData();
  });
};

//发送修改请求
const editData = () => {
  updatePartsClassData(EditForm.value).then((res: any) => {
    if (res && res.success) {
      editVisible.value = false;
      ElNotification({
        title: '提示信息',
        message: res.msg,
        type: "success",
      });
    }
    getData();
  });
};

const columnData = reactive([
  //   {
  //     text: true,
  //     prop: "ClassID",
  //     label: "类别编码",
  //     width: "",
  //     min: true,
  //     align: "1",
  //   },
  {
    text: true,
    prop: "ClassName",
    label: "类别名称",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Description",
    label: "类别描述",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CreatedOn",
    label: "创建时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CreatedBy",
    label: "创建人",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "UpdateOn",
    label: "更新时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "UpdateBy",
    label: "更新人",
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
