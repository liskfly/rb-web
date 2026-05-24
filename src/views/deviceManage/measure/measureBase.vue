<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="pb-2 flex justify-between" ref="headerRef">
        <el-button type="primary" @click="openAdd" size="small">添加</el-button>
      </div>

      <el-table :data="tableData.slice(
        (pageObj.currentPage - 1) * pageObj.pageSize,
        pageObj.currentPage * pageObj.pageSize
      )
        " border :height="tableHeight" style="width: 100%" size="small" highlight-current-row @cell-click="cellClick">
        <el-table-column type="index" align="center" fixed label="序号" :width="'50'"></el-table-column>
        <el-table-column prop="Name" label="名称" width="150" fixed />
        <el-table-column prop="Description" label="描述" width="150" />
        <el-table-column prop="Type" label="类型">
          <template #default="scope">
            <el-tag :type="scope.row.Type == '0' ? 'primary' : 'warning'" size="small" effect="dark">{{ scope.row.Type
              == 0 ? "量具" : "检具" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="Model" label="型号" width="150" />
        <el-table-column prop="Specification" label="规格" width="150" />
        <el-table-column prop="PrecisionLevel" label="精度等级" width="150" />
        <el-table-column prop="NextCalibrationDate" label="下次校准日期" width="150">
          <template #default="scope">
            <span :class="[
              computedDate(scope.row.NextCalibrationDate) ? '' : 'text-[red]',
            ]">
              {{ scope.row.NextCalibrationDate }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="Department" label="使用部门" width="150" />
        <el-table-column prop="Status" label="状态" width="100">
          <template #default="scope">
            <el-tag effect="light" v-if="scope.row.Status == 0" type="primary">正常使用</el-tag>
            <el-tag effect="light" v-if="scope.row.Status == 1" type="warning">闲置</el-tag>
            <el-tag effect="light" v-if="scope.row.Status == 2" type="danger">报废</el-tag>
            <el-tag effect="light" v-if="scope.row.Status == 3" type="info">其他</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="UpdateBy" label="更新人" width="150" />
        <el-table-column prop="UpdateOn" label="更新时间" width="150" />
        <el-table-column prop="LastCalibrationTime" label="已校准日期" width="150" />

        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button type="primary" icon="EditPen" size="small" @click.prevent="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="校验" placement="top">
              <el-button type="warning" icon="Document" size="small" :disabled="scope.row.NextCalibrationDate == null ||
                scope.row.NextCalibrationDate == '' ||
                scope.row.NextCalibrationDate == undefined
                " @click.prevent="handleAdd(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block mt-2 mb-2">
        <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageObj.currentPage" :page-size="pageObj.pageSize" :page-sizes="[15, 30, 50, 100, 150]"
          layout="total,sizes, prev, pager, next" :total="tableData.length">
        </el-pagination>
      </div>
      <el-table :data="tableData1" border :height="tableHeight1" style="width: 100%" size="small" >
        <el-table-column prop="CreatedOn" label="校准日期" width="150" />
        <el-table-column prop="CreatedBy" label="操作人" width="120" />
        <el-table-column prop="IsForce" label="强制更新" width="80" >
          <template #default="scope">
          <el-tag effect="light" v-if="scope.row.IsForce == false" type="primary">否</el-tag>
          <el-tag effect="light" v-if="scope.row.IsForce == true" type="warning">是</el-tag>
        </template>
        </el-table-column>
        <el-table-column prop="Result" label="校验结果" width="80" >
          <template #default="scope">
          <el-tag effect="plain" v-if="scope.row.Result == 'OK'" type="success">OK</el-tag>
          <el-tag effect="plain" v-if="scope.row.Result == 'NG'" type="error">NG</el-tag>
        </template>
        </el-table-column>
        <el-table-column prop="ResultData" label="校准测试结果数据" />
        <el-table-column prop="NextCalibrationDate" label="下次校准日期" width="100"/>
        <el-table-column prop="Remark" label="备注" />
        <el-table-column prop="Annex" label="附件" width="附件" />
      </el-table>
      <!-- <table-temp :show-index="true" size="small" :tableData="tableData1" :tableHeight="tableHeight1"
        :columnData="columnData1"></table-temp> -->
    </el-card>
    <el-dialog align-center :append-to-body="true" :close-on-click-modal="false" v-model="addVisible" title="添加"
      width="800px" @close="addCacle">
      <el-form ref="formRef" :model="form" label-width="auto">
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型" prop="Type">
              <el-select v-model="form.Type" placeholder="" style="width: 240px">
                <el-option label="量具" value="0" />
                <el-option label="检具" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="Name">
              <el-input v-model="form.Name" style="width: 240px" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="描述" prop="Description">
              <el-input v-model="form.Description" style="width: 240px" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号" prop="Model">
              <el-input v-model="form.Model" style="width: 240px" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规格" prop="Specification">
              <el-input v-model="form.Specification" style="width: 240px" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="精度等级" prop="PrecisionLevel">
              <el-select v-model="form.PrecisionLevel" style="width: 240px">
                <el-option v-for="i in 6" :label="i" :value="i" />
              </el-select>
              <!-- <el-input v-model="form.PrecisionLevel" style="width: 240px" placeholder="" /> -->
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="使用部门" prop="Department">
              <el-input v-model="form.Department" style="width: 240px" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次校准日期" prop="NextCalibrationDate">
              <el-date-picker v-model="form.NextCalibrationDate" value-format="YYYY-MM-DD" style="width: 240px"
                type="date" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="Status">
              <el-select v-model="form.Status" placeholder="" style="width: 240px">
                <el-option label="正常使用" value="0" />
                <el-option label="闲置" value="1" />
                <el-option label="报废" value="2" />
                <el-option label="其他" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="Remark">
              <el-input v-model="form.Remark" style="width: 240px" placeholder="" type="textarea" :rows="4" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCacle"> 取消 </el-button>
          <el-button type="primary" @click="addSumbit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog align-center :append-to-body="true" :close-on-click-modal="false" v-model="editVisible" title="修改"
      width="800px" @close="editCacle">
      <el-form ref="editFormRef" :model="editForm" label-width="auto">
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型" prop="Type">
              <el-select v-model="editForm.Type" placeholder="" style="width: 240px">
                <el-option label="量具" value="0" />
                <el-option label="检具" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="Name">
              <el-input v-model="editForm.Name" style="width: 240px" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="描述" prop="Description">
              <el-input v-model="editForm.Description" style="width: 240px" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号" prop="Model">
              <el-input v-model="editForm.Model" style="width: 240px" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规格" prop="Specification">
              <el-input v-model="editForm.Specification" style="width: 240px" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="精度等级" prop="PrecisionLevel">
              <el-select v-model="editForm.PrecisionLevel" style="width: 240px">
                <el-option v-for="i in 6" :label="i" :value="i" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="使用部门" prop="Department">
              <el-input v-model="editForm.PrecisionLevel" style="width: 240px" placeholder="" />
              <!-- <el-input v-model="editForm.Department" style="width: 240px" placeholder="" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次校准日期" prop="NextCalibrationDate">
              <el-date-picker :disabled="!editForm.IsSet" v-model="editForm.NextCalibrationDate"
                value-format="YYYY-MM-DD" style="width: 240px" type="date" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="Status">
              <el-select v-model="editForm.Status" placeholder="" style="width: 240px">
                <el-option label="正常使用" value="0" />
                <el-option label="闲置" value="1" />
                <el-option label="报废" value="2" />
                <el-option label="其他" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="Remark">
              <el-input v-model="editForm.Remark" style="width: 240px" placeholder="" type="textarea" :rows="4" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCacle"> 取消 </el-button>
          <el-button type="primary" @click="editSumbit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog align-center :append-to-body="true" :close-on-click-modal="false" v-model="setVisible" title="校验"
      width="450px" @close="setCacle">
      <el-form ref="setFormRef" :model="setForm" label-width="auto">
        <el-form-item label="校验结果" prop="Result">
          <el-select v-model="setForm.Result" placeholder="" style="width: 300px">
            <el-option label="OK" value="OK" />
            <el-option label="NG" value="NG" />
          </el-select>
          <!-- <el-input v-model="setForm.Result" style="width: 240px" placeholder="" /> -->
        </el-form-item>
        <el-form-item label="校验测试结果数据" prop="ResultData">
          <el-input v-model="setForm.ResultData" style="width: 300px"  type="textarea" placeholder="" :rows="4"/>
        </el-form-item>
        <el-form-item label="下次校准日期" prop="NextCalibrationDate">
          <el-date-picker v-model="setForm.NextCalibrationDate" value-format="YYYY-MM-DD" :disabled-date="disabledDate"
            style="width: 300px" type="date" placeholder="" />
        </el-form-item>
        <el-form-item label="备注" prop="Remark">
          <el-input v-model="setForm.Remark" style="width: 300px" placeholder="" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setCacle"> 取消 </el-button>
          <el-button type="primary" @click="setSumbit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  GetGaugeToolList,
  addGaugeTool,
  updateGaugeTool,
  GetCalibrationRecordList,
  addCalibrationRecord,
} from "@/api/operate";
import tableTem from "@/components/tableTem/index.vue";
import tableTemp from "@/components/tableTemp/index.vue";
import {
  ref,
  unref,
  nextTick,
  reactive,
  onBeforeMount,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
const userStore = useUserStoreWithOut();
const tableData = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});
const addVisible = ref(false);
const getForm = ref({

});
const form = ref({
  ID: "",
  Type: "",
  Name: "",
  Description: "",
  Model: "",
  Specification: "",
  PrecisionLevel: 1,
  NextCalibrationDate: "",
  Department: "",
  Status: "0",
  CreatedOn: "",
  CreatedBy: userStore.getUserInfo,
  UpdateOn: "",
  UpdateBy: "",
  Remark: "",
});
const editForm = ref({
  ID: "",
  Type: "",
  Name: "",
  Description: "",
  Model: "",
  Specification: "",
  PrecisionLevel: 1,
  NextCalibrationDate: "",
  Department: "",
  Status: 0,
  CreatedOn: "",
  CreatedBy: "",
  UpdateOn: "",
  UpdateBy: userStore.getUserInfo,
  Remark: "",
  IsSet: "",
});
const formRef = ref();
const editFormRef = ref();
const editVisible = ref(false);
const headerRef = ref();
const handleEdit = (row: any) => {
  // console.log(row);
  editForm.value = { ...row };
  date1.value = row.NextCalibrationDate;
  editForm.value.UpdateBy = userStore.getUserInfo;
  editForm.value.UpdateOn = "";

  editVisible.value = true;
};

const columnData = reactive([
  {
    text: true,
    prop: "Name",
    label: "名称",
    width: "150",
    min: true,
    align: "1",
    fixed: true,
  },

  {
    text: true,
    prop: "Description",
    label: "描述",
    width: "150",
    min: true,
    align: "1",
  },
  {
    text: false,
    prop: "Type",
    label: "类型",
    min: true,
    align: "center",
    width: "80px",
    tag: true,
    tagType: "number",
    tagItem: [
      { text: "量具", type: "primary", number: "0" },
      { text: "检具", type: "warning", number: "1" },
    ],
  },
  {
    text: true,
    prop: "Model",
    label: "产品型号",
    width: "150",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Specification",
    label: "详细规格",
    width: "150",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "PrecisionLevel",
    label: "精度等级",
    width: "80",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "NextCalibrationDate",
    label: "下次校准日期",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Department",
    label: "使用部门",
    width: "100",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Status",
    label: "状态",
    width: "100",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Remark",
    label: "备注",
    width: "200",
    min: true,
    align: "1",
  },

  {
    text: true,
    prop: "UpdateBy",
    label: "更新人",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "UpdateOn",
    label: "更新时间",
    width: "",
    min: true,
    align: "1",
  },

  {
    isOperation: true,
    label: "操作",
    width: "80",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "编辑",
        icon: "EditPen",
        buttonClick: handleEdit,
      },
    ],
  },
]);
const tableData1 = ref([]);
const tableHeight1 = ref(0);
const columnData1 = reactive([
  {
    text: true,
    prop: "CreatedOn",
    label: "校准日期",
    width: "150",
    // min: true,
    align: "1",
  },
  {
    text: true,
    prop: "CreatedBy",
    label: "操作人",
    width: "120",
    // min: true,
    align: "1",
  },
  {
    // text: true,
    // prop: "Result",
    // label: "校验结果",
    // width: "",
    // // min: true,
    // align: "1",
    text: false,
    prop: "Result",
    label: "Result",
    min: true,
    align: "center",
    width: "80px",
    tag: true,
    tagType: "number",
    tagItem: [
      { text: "OK", type: "success", number: "OK" },
      { text: "NG", type: "error", number: "NG" },
    ],
  },

  {
    text: true,
    prop: "ResultData",
    label: "校准测试结果数据",
    width: "",
    // min: true,
    align: "1",
  },
  {
    text: true,
    prop: "NextCalibrationDate",
    label: "下次校准日期",
    width: "100",
    // min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Remark",
    label: "备注",
    width: "",
    // min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Annex",
    label: "附件",
    width: "",
    // min: true,
    align: "1",
  },
]);
const getRecordForm = ref({
  GaugeToolID: "",
});
const setFormRef = ref();
const setVisible = ref(false);
const setForm = ref({
  ID: "",
  GaugeToolID: "",
  Result: "",
  Desc: "",
  CreatedOn: "",
  CreatedBy: userStore.getUserInfo,
  Remark: "",
  ResultData: "",
  Annex: "",
  IsForce: true,
  NextCalibrationDate: "",
  PlanCalibrationDate:""
});
const date1 = ref("");
const validateEndDate = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error(rule.message || "请选择结束日期"));
  }
  const startDate = editForm.value.NextCalibrationDate;

  //  console.log(new Date(date1.value)>new Date(startDate));

  if (startDate && new Date(date1.value) !== new Date(startDate)) {
    callback(new Error("确认进行校准日期修改"));
  } else {
    callback();
  }
};
const rules = reactive({
  NextCalibrationDate: [
    { required: true, message: "请选择结束日期", trigger: "change" },
    { validator: validateEndDate, trigger: "change" },
  ],
});

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});
const disabledDate = (time: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return time.getTime() < today.getTime();
};

const getData = () => {
  GetGaugeToolList(getForm.value).then((res: any) => {
    tableData.value = res.content;
  });
};
const getRecordData = () => {
  GetCalibrationRecordList(getRecordForm.value).then((res: any) => {
    tableData1.value = res.content;
  });
};
const openAdd = () => {
  addVisible.value = true;
};
const addCacle = () => {
  addVisible.value = false;
  formRef.value.resetFields();
};
const addSumbit = () => {
  addGaugeTool(form.value).then((res: any) => {
    if (res.success) {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
      getData();
      addVisible.value = false;
    }
  });
};
const editCacle = () => {
  date1.value = "";
  editVisible.value = false;
  editFormRef.value.resetFields();
};
const editSumbit = () => {
  updateGaugeTool(editForm.value).then((res: any) => {
    if (res.success) {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
      getData();
      editVisible.value = false;
    }
  });
};
const handleAdd = (row: any) => {
  setForm.value.PlanCalibrationDate=row.NextCalibrationDate
  GetCalibrationRecordList(getRecordForm.value).then((res: any) => {
    tableData1.value = res.content;
    if (computedDate(row.NextCalibrationDate)) {
      ElMessageBox.confirm("校准日期未到，是否进行校准？", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          setForm.value.GaugeToolID = row.ID;
          getRecordForm.value.GaugeToolID = row.ID;
          setForm.value.IsForce=true
          setVisible.value = true;
        })
        .catch(() => {
          ElNotification({
            title: "提示信息",
            message: "已取消操作",
            type: "info",
          });
        });
    } else {
      setForm.value.GaugeToolID = row.ID;
      getRecordForm.value.GaugeToolID = row.ID;
      setForm.value.IsForce=false
      setVisible.value = true;
    }
  });

  // getRecordData()
};
const setCacle = () => {
  setVisible.value = false;
  setFormRef.value.resetFields();
};
const setSumbit = () => {
  addCalibrationRecord(setForm.value).then((res: any) => {
    if (res.success) {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
      getRecordData();
      setVisible.value = false;
    }
  });
};
const cellClick = (val: any) => {
  getRecordForm.value.GaugeToolID = val.ID;
  getRecordData();
};
const computedDate = (val: any) => {
  if (val == null || val == "") {
    return true;
  } else {
    let date = new Date(val);
    let date2 = new Date();
    // console.log(date);
    return date > date2 ? true : false;
  }
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
    // tableHeight.value = window.innerHeight - 195;
    tableHeight.value = (window.innerHeight - 164 - 35) * 0.6;
    tableHeight1.value = (window.innerHeight - 164 - 35) * 0.4;
  });
};
</script>

<style scoped></style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
