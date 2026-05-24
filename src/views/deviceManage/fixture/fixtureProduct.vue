<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0px 8px' }">
      <div class="pb-2 flex justify-between">
        <el-button type="primary" @click="(addVisible = true), clearForm()" size="small">添加</el-button>
        <div class="flex">
          <el-input v-model.trim="searchName" style="width: 300px" clearable placeholder="请输入" size="small">
            <template #append>
              <el-button type="primary" icon="Search" size="small"></el-button> </template></el-input>
        </div>
      </div>
      <table-tem :show-index="true" size="small" :tableData="tableData1" :tableHeight="tableHeight"
        :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange">
      </table-tem>
    </el-card>
    <el-dialog align-center :append-to-body="true" :close-on-click-modal="false" v-model="editVisible" @close=""
      title="编辑" width="55%">
      <el-form ref="EditFormRef" :model="EditForm" label-position="right" label-width="auto" :inline="true"
        :rules="rules">
        <el-form-item label="产品编码" prop="productname">
          <el-input disabled v-model="EditForm.productname" style="width: 240px" placeholder="" />
          <!-- <el-select
            v-model="EditForm.productname"
            placeholder=""
            style="width: 240px"
          >
            <el-option
              v-for="item in productnameList"
              :key="item"
              :label="item.ProductName"
              :value="item.ProductName"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item label="工序代码" prop="procedurecode">
          <el-input disabled v-model="EditForm.procedurecode" style="width: 240px" placeholder="" />
          <!-- <el-select
            v-model="EditForm.procedurecode"
            placeholder=""
            style="width: 240px"
            @change="EditCodeChoice"
          >
            <el-option
              v-for="item in procedurecodeList"
              :key="item"
              :label="item.SpecName"
              :value="item.SpecName"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item label="产品描述" prop="productdsc">
          <el-input disabled v-model="EditForm.productdsc" style="width: 240px" placeholder="" />
        </el-form-item>
        <el-form-item label="工序描述" prop="proceduredsc">
          <el-input disabled v-model="EditForm.proceduredsc" style="width: 240px" placeholder="" />
        </el-form-item>
        <el-form-item label="工治具型号" prop="compname">
          <el-select v-model="EditForm.compname" placeholder="" style="width: 240px">
            <el-option v-for="item in compnameList" :key="item.CompName" :label="item.CompName"
              :value="item.CompName" />
          </el-select>
        </el-form-item>
        <el-form-item label="面别" prop="side">
          <el-select v-model="EditForm.side" placeholder="" style="width: 240px">
            <el-option v-for="item in ['BOT', 'TOP']" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="" prop="compid">
          <el-input
            v-model="form.side"
            style="width: 240px"
            :rows="2"
            type="textarea"
          />
        </el-form-item> -->
        <el-form-item label="消耗量" prop="usage">
          <!-- <el-input
            v-model="EditForm.usage"
            style="width: 240px"
            placeholder=""
          /> -->
          <el-input-number v-model="EditForm.usage" style="width: 240px" placeholder="" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <!-- <el-input
            v-model="EditForm.status"
            style="width: 240px"
            placeholder=""
          /> -->
          <!-- <el-select
            v-model="EditForm.status"
            placeholder=""
            style="width: 240px"
          >
            <el-option
              v-for="item in statusList"
              :key="item"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->
          <div class="w-[240px]">
            <el-checkbox v-model="EditFormStatus" :label="EditForm.status === 1 ? '可用' : '不可用'" size="large"
              @change="EditForm.status = EditForm.status === 1 ? -1 : 1" />
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="EditForm.remark" style="width: 240px" placeholder="" type="textarea" :rows="3" />
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
      title="添加" width="55%">
      <el-form ref="formRef" :model="form" label-position="right" label-width="120px" :inline="true" :rules="rules">
        <el-form-item label="产品编码" prop="productname">
          <el-input v-model="form.productname" style="width: 240px" placeholder="" />
          <!-- <el-select
            v-model="form.productname"
            placeholder=""
            filterable 
            style="width: 240px"
          >
            <el-option
              v-for="item in productnameList"
              :key="item"
              :label="item.ProductName"
              :value="item.ProductName"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item label="工序代码" prop="procedurecode">
          <!-- <el-input
            v-model="form.procedurecode"
            style="width: 240px"
            placeholder=""
          /> -->
          <el-select v-model="form.procedurecode" placeholder="" filterable style="width: 240px" @change="codeChoice">
            <el-option v-for="item in procedurecodeList" :key="item" :label="item.SpecDesc" :value="item.SpecName" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品描述" prop="productdsc">
          <el-input disabled v-model="form.productdsc" style="width: 240px" placeholder="" />
        </el-form-item>
        <el-form-item label="工序描述" prop="proceduredsc">
          <el-input disabled v-model="form.proceduredsc" style="width: 240px" placeholder="" />
        </el-form-item>
        <el-form-item label="工治具型号" prop="compname">
          <el-select v-model="form.compname" placeholder="" filterable style="width: 240px">
            <el-option v-for="item in compnameList" :key="item.CompName" :label="item.CompName"
              :value="item.CompName" />
          </el-select>
        </el-form-item>
        <el-form-item label="面别" prop="side">
          <el-select v-model="form.side" placeholder="" clearable style="width: 240px">
            <el-option v-for="item in ['BOT', 'TOP']" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="消耗量" prop="usage">
          <el-input-number v-model="form.usage" style="width: 240px" placeholder="" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <!-- <el-input
            v-model="form.status"
            style="width: 240px"
            placeholder=""
          /> -->
          <div class="w-[240px]">
            <el-checkbox v-model="formStatus" :label="form.status === 1 ? '可用' : '不可用'" size="large"
              @change="form.status = form.status === 1 ? -1 : 1" />
          </div>
          <!-- <el-select
            v-model="form.status"
            placeholder=""
            style="width: 240px"
          >
            <el-option
              v-for="item in statusList"
              :key="item"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" style="width: 240px" placeholder="" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="addSumbit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- <el-dialog v-model="deleteVisible" title="Tips" width="500">
      <span>删除确认</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteVisible = false">取消</el-button>
          <el-button type="primary" @click="deleteConfirm"> 删除 </el-button>
        </div>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import {
  ToolsDetail,
  ToolsType,
  ToolsSpec,
  findPdMaterial,
  findProductSpec,
} from "@/api/operate";
import { useUserStoreWithOut } from "@/stores/modules/user";
import {
  ref,
  unref,
  nextTick,
  reactive,
  onBeforeMount,
  watch,
  onMounted,
  onBeforeUnmount,
  computed,
} from "vue";
const userStore = useUserStoreWithOut();
const loginName = userStore.getUserInfo;
const formRef = ref();
const EditFormRef = ref();

interface formTS {
  usage: number;
  status: number;
  operationtype: string;
  productname: string;
  productdsc: string;
  compname: string;
  procedurecode: string;
  proceduredsc: string;
  side: string;
  remark: string;
  user: string;
  usagespecguid: string;
}

interface EditFormTS {
  usage: number;
  status: number;
  operationtype: string;
  productname: string;
  productdsc: string;
  compname: string;
  procedurecode: string;
  proceduredsc: string;
  side: string;
  remark: string;
  user: string;
  usagespecguid: string;
}

interface RuleForm {
  compname: string;
  productname: string;
  procedurecode: string;
  side: string;
}

const rules = reactive({
  compname: [{ required: true, message: "不能为空", trigger: "blur" }],
  productname: [{ required: true, message: "不能为空", trigger: "blur" }],
  procedurecode: [{ required: true, message: "不能为空", trigger: "blur" }],
  // side: [{ required: true, message: "不能为空", trigger: "blur" }],
});

const statusList = reactive([
  { value: 1, label: "可用" },
  { value: -1, label: "不可用" },
]);
//   const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const inputValue = ref();
const deleteVisible = ref(false);
const deleteChoice = ref("");
const compnameList = ref<any>([]);
const productnameList = ref<any>([]);
const procedurecodeList = ref<any>([]);
const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});

const formStatus = computed(() => {
  return form.value.status === 1;
});

const EditFormStatus = computed(() => {
  return EditForm.value.status === 1;
});

const tableData = ref([]);
const tableData1 = ref([]);
const searchName = ref("");

const form = ref<formTS>({
  usage: 1,
  status: 1,
  operationtype: "",
  productname: "",
  productdsc: "",
  compname: "",
  procedurecode: "",
  proceduredsc: "",
  side: "",
  remark: "",
  user: loginName,
  usagespecguid: "",
});

const EditForm = ref<EditFormTS>({
  usage: 1,
  status: -1,
  operationtype: "",
  productname: "",
  productdsc: "",
  compname: "",
  procedurecode: "",
  proceduredsc: "",
  side: "",
  remark: "",
  user: loginName,
  usagespecguid: "",
});

const clearForm = () => {
  form.value = {
    usage: 1,
    status: 1,
    operationtype: "",
    productname: "",
    productdsc: "",
    compname: "",
    procedurecode: "",
    proceduredsc: "",
    side: "",
    remark: "",
    user: loginName,
    usagespecguid: "",
  };
  procedurecodeList.value = [];
};

const clearEditForm = () => {
  EditForm.value = {
    usage: 1,
    status: -1,
    operationtype: "",
    productname: "",
    productdsc: "",
    compname: "",
    procedurecode: "",
    proceduredsc: "",
    side: "",
    remark: "",
    user: loginName,
    usagespecguid: "",
  };
};

watch(
  () => searchName.value,
  (newdata) => {
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

watch(
  () => form.value.productname,
  (newVal, oldVal) => {
    form.value.proceduredsc = "";
    procedurecodeList.value = [];
    const item = productnameList.value.find(
      (item: any) => item.ProductName === newVal
    );
    // 如果找到了就赋值，否则赋值为null
    form.value.productdsc = item ? item.ProductDesc : "";
    if (item) {
      findProductSpec(newVal)
        .then((data: any) => {
          if (!data) {
            return;
          }
          if (data.content === null || data.content.length === 0) {
            ElMessage({
              message: "此产品没有工序代码",
              type: "warning",
            });
          }
          procedurecodeList.value = data.content;
        })
        .catch((res) => {
          console.log(res);
          procedurecodeList.value = [];
        });
    }
  }
);

// watch(
//   () => EditForm.value.productname,
//   (newVal, oldVal) => {
//     EditForm.value.proceduredsc = "";
//     procedurecodeList.value = [];
//     const item = productnameList.value.find(
//       (item: any) => item.ProductName === newVal
//     );
//     // 如果找到了就赋值，否则赋值为null
//     EditForm.value.productdsc = item ? item.ProductDesc : "";
//     if (item) {
//       findProductSpec(newVal)
//         .then((data: any) => {
//           if (!data) {
//             return;
//           }
//           if (data.content === null || data.content.length === 0) {
//             ElMessage({
//               message: "此产品没有工序代码",
//               type: "warning",
//             });
//           }
//           procedurecodeList.value = data.content;
//         })
//         .catch((res) => {
//           console.log(res);
//           procedurecodeList.value = [];
//         });
//     }
//   }
// );

const codeChoice = (name: any) => {
  const item = procedurecodeList.value.find(
    (item: any) => item.SpecName === name
  );
  console.log(name);

  // 如果找到了就赋值，否则赋值为null
  form.value.proceduredsc = item ? item.SpecDesc : "";
};

const EditCodeChoice = (name: any) => {
  const item = procedurecodeList.value.find(
    (item: any) => item.SpecName === name
  );
  // 如果找到了就赋值，否则赋值为null
  EditForm.value.proceduredsc = item ? item.SpecDesc : "";
};

const addSumbit = () => {
  console.log(form.value);
  formRef.value.validate((valid: any) => {
    if (valid) {
      ToolsSpec({
        ...form.value,
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
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};

const editSubmit = (data: any) => {
  console.log(data);
  EditForm.value.usage = data.Amount;
  EditForm.value.status = data.Status;
  EditForm.value.productname = data.ProductName;
  EditForm.value.productdsc = data.ProductDsc;
  EditForm.value.compname = data.ToolsMold;
  EditForm.value.procedurecode = data.ProcedureCode;
  EditForm.value.proceduredsc = data.ProcedureDsc;
  EditForm.value.side = data.Side;
  EditForm.value.remark = data.ExpirationDate;
  EditForm.value.usagespecguid = data.UsageSpecGuid;
  editVisible.value = true;
};

const editConfirm = () => {
  EditFormRef.value.validate((valid: any) => {
    if (valid) {
      ToolsSpec({
        ...EditForm.value,
        operationtype: "UPD",
      }).then((data: any) => {
        if (!data) {
          return;
        }
        clearEditForm();
        ElMessage({
          message: data.msg,
          type: "success",
        });
        getData();
        editVisible.value = false;
      });
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};

const deleteSubmit = (data: any) => {
  // deleteVisible.value = true;
  deleteChoice.value = data.UsageSpecGuid;
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ToolsSpec({
        usagespecguid: deleteChoice.value,
        operationtype: "DEL",
      }).then((data: any) => {
        if (!data) {
          return;
        }
        ElNotification({
          title: "提示信息",
          message: data.msg,
          type: "success",
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

const deleteConfirm = () => {
  ToolsSpec({ usagespecguid: deleteChoice.value, operationtype: "DEL" }).then(
    (data: any) => {
      if (!data) {
        return;
      }
      ElMessage({
        message: data.msg,
        type: "success",
      });
      getData();
    }
  );
  deleteVisible.value = false;
};

const columnData = reactive([
  {
    text: true,
    prop: "ProductName",
    label: "产品编码",
    width: "",
    min: true,
    fixed:true,
    align: "center",
  },
  {
    text: true,
    prop: "ProductDsc",
    label: "产品描述",
    width: "250",
    // min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ProcedureCode",
    label: "工序代码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ProcedureDsc",
    label: "工序描述",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Side",
    label: "面别",
    width: "50",
    // min: true,
    align: "center",
  },
  {
    text: true,
    prop: "MaterialName",
    label: "工治具类型",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ToolsMold",
    label: "工治具型号编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Amount",
    label: "消耗量",
    width: "80",
    // min: true,
    align: "center",
  },
  {
    text: false,
    tag: true,
    tagType: "number",
    tagItem: [
      { text: "可用", type: "primary", number: 1 },
      { text: "不可用", type: "danger", number: -1 },
    ],
    prop: "Status",
    label: "状态",
    width: "100",
    // min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Description",
    label: "备注",
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
  // console.log(1);

  window.addEventListener("resize", getScreenHeight);
  clearForm();
  clearEditForm();
  getData();
  getCompnameList();
  getProductnameList();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
  ToolsSpec({ operationtype: "QAL" }).then((data: any) => {
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

const getProductnameList = () => {
  findPdMaterial().then((data: any) => {
    if (data.content === null || data.content.length === 0 || !data) {
      tableData.value = [];
      return;
    }
    productnameList.value = data.content;
  });
};

const getCompnameList = () => {
  ToolsType({ operationtype: "QAL" }).then((data: any) => {
    const dataText = data.content;
    compnameList.value = dataText;
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
    tableHeight.value = window.innerHeight - 195;
  });
};
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
