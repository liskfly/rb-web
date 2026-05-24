<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0px 8px' }">
      <div class="flex items-center justify-between">
        <el-form ref="formRef" :model="form" :inline="true">
          <el-form-item label="车间" prop="WorkCenterName" class="mb-2">
            <el-select
              v-model="form.WorkCenterName"
              clearable
              placeholder=""
              style="width: 180px"
              size="small"
              @change="meunItem"
            >
              <el-option
                v-for="item in option1"
                :key="item.Name"
                :label="item.Desc"
                :value="item.Name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="产线" prop="MfgLineName" class="mb-2">
            <el-select
              v-model="form.MfgLineName"
              clearable
              placeholder=""
              style="width: 180px"
              size="small"
            >
              <el-option
                v-for="item in option2"
                :key="item.Name"
                :label="item.Desc"
                :value="item.Name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型" prop="EquipmentTypeName" class="mb-2">
            <el-select
              v-model="form.EquipmentTypeName"
              clearable
              placeholder=""
              style="width: 180px"
              size="small"
            >
              <el-option
                v-for="item in option3"
                :key="item.EquipmentTypeName"
                :label="item.EquipmentTypeDesc"
                :value="item.EquipmentTypeName"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="submit" size="small">
              查询
            </el-button></el-form-item
          >
          <el-form-item class="mb-2">
            <el-button @click="rest" size="small">
              重置
            </el-button></el-form-item
          >
        </el-form>
        <div>
          <el-button type="primary" @click="addVisible = true" size="small">
            添加设备
          </el-button>
        </div>
      </div>
      <table-tem
        :show-index="true"
        size="small"
        :tableData="tableData"
        :tableHeight="tableHeight"
        :columnData="columnData"
        :pageObj="pageObj"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-tem>
    </el-card>
    <el-dialog
      v-model="editVisible"
      width="85%"
      title="履历明细"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      align-center
    >
      <el-tabs type="border-card" class="tabs-css" v-model="tabValue">
        <el-tab-pane label="设备点检记录" name="inspection"
          >设备点检记录开发维护中~</el-tab-pane
        >
        <el-tab-pane label="设备保养记录" name="maintain"
          >设备保养记录开发维护中~</el-tab-pane
        >
        <el-tab-pane label="设备维修记录" name="repair"
          >设备维修记录开发维护中~</el-tab-pane
        >
      </el-tabs>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click.stop="editVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="editVisible"
      width="85%"
      title="履历明细"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      align-center
    >
      <el-tabs type="border-card" class="tabs-css" v-model="tabValue">
        <el-tab-pane label="设备点检记录" name="inspection"
          >设备点检记录开发维护中~</el-tab-pane
        >
        <el-tab-pane label="设备保养记录" name="maintain"
          >设备保养记录开发维护中~</el-tab-pane
        >
        <el-tab-pane label="设备维修记录" name="repair"
          >设备维修记录开发维护中~</el-tab-pane
        >
      </el-tabs>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click.stop="editVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      align-center
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="addVisible"
      @close="addRef.resetFields()"
      title="添加"
      width="60%"
    >
      <el-form
        ref="addRef"
        :model="addForm"
        :inline="true"
        label-position="left"
        label-width="auto"
      >
        <el-form-item label="设备名称" prop="EquipmentName">
          <el-input v-model.trim="addForm.EquipmentName" style="width: 240px" />
        </el-form-item>
        <el-form-item label="序列号" prop="BD_Sequence">
          <el-input v-model.trim="addForm.BD_Sequence" style="width: 240px" />
        </el-form-item>
        <el-form-item label="设备类型名称" prop="EquipmentTypeName">
          <el-select v-model="addForm.EquipmentTypeName" placeholder="" style="width: 240px" filterable>
            <el-option v-for="item in typeList" :key="item.EquipmentTypeName" :label="item.EquipmentTypeDesc" :value="item.EquipmentTypeName" />
          </el-select>
        </el-form-item>
        <el-form-item label="线体名称" prop="MfgLineName">
          <el-select v-model="addForm.MfgLineName" placeholder="" style="width: 240px" filterable>
            <el-option v-for="item in lineList" :key="item.MfgLineName" :label="item.Description" :value="item.MfgLineName" />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商型号" prop="VendorAndModel">
          <el-input
            v-model.trim="addForm.VendorAndModel"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="供应商序列号" prop="VendorSerialNumber">
          <el-input
            v-model.trim="addForm.VendorSerialNumber"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="入厂时间" prop="InFactoryDate">
          <el-date-picker
            style="width: 240px"
            v-model="addForm.InFactoryDate"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="规格" prop="Specification">
          <el-input v-model.trim="addForm.Specification" style="width: 240px" />
        </el-form-item>
        <el-form-item label="存储位置" prop="StorageLocation">
          <el-input
            v-model.trim="addForm.StorageLocation"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="设备特征" prop="EquipmentNature">
          <el-input
            v-model.trim="addForm.EquipmentNature"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="设备描述" prop="EquipmentDesc">
          <el-input
            v-model.number="addForm.EquipmentDesc"
            style="width: 240px"
            :rows="2"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
          <el-button @click="addVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="addEquipment"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      align-center
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="editVisible1"
      @close="editRef.resetFields()"
      title="编辑"
      width="60%"
    >
      <el-form
        ref="editRef"
        :model="editForm"
        :inline="true"
        label-position="left"
        label-width="auto"
      >
        <el-form-item label="设备名称" prop="EquipmentName">
          <el-input disabled v-model.trim="editForm.EquipmentName" style="width: 240px" />
        </el-form-item>
        <el-form-item label="设备名称" prop="EquipmentName">
          <el-input v-model.trim="editForm.EquipmentName" style="width: 240px" />
        </el-form-item>
        <el-form-item label="设备类型名称" prop="EquipmentTypeName">
          <el-select v-model="editForm.EquipmentTypeName" placeholder="" style="width: 240px" filterable>
            <el-option v-for="item in typeList" :key="item.EquipmentTypeName" :label="item.EquipmentTypeDesc" :value="item.EquipmentTypeName" />
          </el-select>
        </el-form-item>
        <el-form-item label="线体名称" prop="MfgLineName">
          <el-select v-model="editForm.MfgLineName" placeholder="" style="width: 240px" filterable>
            <el-option v-for="item in lineList" :key="item.MfgLineName" :label="item.Description" :value="item.MfgLineName" />
          </el-select>
        </el-form-item>
        <el-form-item label="序列号" prop="BD_Sequence">
          <el-input v-model.trim="editForm.BD_Sequence" style="width: 240px" />
        </el-form-item>
        <el-form-item label="供应商型号" prop="VendorAndModel">
          <el-input
            v-model.trim="editForm.VendorAndModel"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="供应商序列号" prop="VendorSerialNumber">
          <el-input
            v-model.trim="editForm.VendorSerialNumber"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="入厂时间" prop="InFactoryDate">
          <el-date-picker
            style="width: 240px"
            v-model="editForm.InFactoryDate"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="规格" prop="Specification">
          <el-input v-model.trim="editForm.Specification" style="width: 240px" />
        </el-form-item>
        <el-form-item label="存储位置" prop="StorageLocation">
          <el-input
            v-model.trim="editForm.StorageLocation"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="设备特征" prop="EquipmentNature">
          <el-input
            v-model.trim="editForm.EquipmentNature"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="设备描述" prop="EquipmentDesc">
          <el-input
            v-model.number="editForm.EquipmentDesc"
            style="width: 240px"
            :rows="2"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
          <el-button @click="addVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="editEquipment"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { OrganData } from "@/utils/dataMenu";
import tableTem from "@/components/tableTem/index.vue";
import formTem from "@/components/formTem/index.vue";
import { cloneDeep } from "lodash-es";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
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
import {
  GetFactoryModelList,
  GetEquipmentTypeList,
  GetEquipmentList,
  CreateEquipment,
  GetLedgerEquipmentTypeList,
  findMfgLine
} from "@/api/operate";
interface Option {
  Desc: string;
  FID: string;
  ID: string;
  Level: string;
  Name: string;
  sortId: string;
}
interface Option3 {
  EquipmentTypeDesc: string;
  EquipmentTypeName: string;
}
const tableData = ref([]);
const tableHeight = ref(0);

const editVisible = ref(false);

const form = ref({
  EquipmentName: "",
  EquipmentDesc: "",
  EquipmentTypeName: "",
  EquipmentTypeDesc: "",
  MfgLineName: "",
  MfgLineDesc: "",
  WorkCenterName: "",
  WorkCenterDesc: "",
  WorkStationName: "",
  WorkStationDesc: "",
  VendorAndModel: "",
  VendorSerialNumber: "",
});

const addForm = ref({
  EquipmentName: "",
  EquipmentDesc: "",
  EquipmentTypeName: "",
  MfgLineName: "",
  BD_Sequence: "",
  VendorAndModel: "",
  VendorSerialNumber: "",
  InFactoryDate: "",
  ManufacturerLocation: "",
  Specification: "",
  StorageLocation: "",
  EquipmentNature: "",
});

const editForm = ref<any>({
  EquipmentName: "",
  EquipmentDesc: "",
  EquipmentTypeName: "",
  MfgLineName: "",
  BD_Sequence: "",
  VendorAndModel: "",
  VendorSerialNumber: "",
  InFactoryDate: "",
  ManufacturerLocation: "",
  Specification: "",
  StorageLocation: "",
  EquipmentNature: "",
});

const addVisible = ref(false);
const option1 = ref<Option[]>([]);
const option2 = ref<Option[]>([]);
const option3 = ref<Option3[]>([]);
const tabValue = ref("inspection");
const formRef = ref();
const addRef = ref();
const editRef = ref();
const typeList = ref();
const lineList = ref();
const editVisible1 = ref(false);
const handleEdit = (data: any) => {
  // console.log(data);
  editVisible.value = true;
};
const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});

const formHeader = ref([
  {
    label: "设备型号",
    value: "account",
    type: "input",
  },
]);
const rules = reactive({
  account: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
});

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
  getModeList();
  getTypeList();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
  GetEquipmentList(form.value).then((res: any) => {
    if (res.content == null) {
      tableData.value = [];
    } else {
      tableData.value = res.content;
    }
  });
};

const getModeList = () => {
  GetFactoryModelList().then((res: any) => {
    option1.value = OrganData(res.content);
  });
};
const getTypeList = () => {
  GetEquipmentTypeList().then((res: any) => {
    option3.value = res.content;
  });
};
const meunItem = (value: any) => {
  option2.value = [];
  form.value.MfgLineName = "";
  let data = option1.value.filter((v: any) => v.Name === value);
  let data1 = cloneDeep(data);
  option2.value = data1[0].childMenu;
};
const submit = () => {
  getData();
};
const rest = () => {
  formRef.value.resetFields();
  getData();
};

const dropDown = () => {
  GetLedgerEquipmentTypeList().then((res:any) => {
    if (res.success) {
      typeList.value = res.content;
    }
  })
  findMfgLine().then((res:any) => {
    if (res.success) {
      lineList.value = res.content;
    }
  })
}

const addEquipment = () => {
  CreateEquipment(addForm.value).then((res:any) => {
    ElNotification({
      title: "提示信息",
      message: res.msg,
      type: res.success ? "success" : "error",
    });
    addVisible.value = false;
  })
};

const editEquipment = () => {
  CreateEquipment(editForm.value).then((res:any) => {
    ElNotification({
      title: "提示信息",
      message: res.msg,
      type: res.success ? "success" : "error",
    });
    addVisible.value = false;
  })
};

const openEdit = (row:any) => {
  dropDown();
  editVisible1.value = true;
  for (const key in editForm.value) {
    if (row[key]) {
      editForm.value[key] = row[key]
    }
  }
}

const rowclick = (row:any) => {
  for (const key in editForm.value) {
    if (row[key]) {
      editForm.value[key] = row[key]
    }
  }
}
const columnData = reactive([
  {
    text: true,
    prop: "WorkCenterDesc",
    label: "车间名称",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "MfgLineDesc",
    label: "产线名称",
    width: "",
    min: true,
    align: "center",
  },

  {
    text: true,
    prop: "EquipmentName",
    label: "设备编码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "EquipmentDesc",
    label: "设备名称",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "EquipmentTypeName",
    label: "设备类型编码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "EquipmentTypeDesc",
    label: "设备类型名称",
    width: "",
    min: true,
    align: "center",
  },
  {
    isOperation: true,
    label: "履历明细",
    width: "120",
    align: "center",
    fixed: "right",
    operation: [
      {
        type: "primary",
        label: "编辑",
        icon: "EditPen",
        buttonClick: openEdit,
      },
      {
        type: "primary",
        label: "履历",
        icon: "Document",
        buttonClick: handleEdit,
      },
    ],
  },
]);

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
<style lang="scss">
@import "../../style//tab.css";

.el-pagination {
  justify-content: center;
}
</style>
<!-- <style scoped lang="scss"></style> -->
