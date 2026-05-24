<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0px 8px' }">
      <div class="pb-2 flex justify-between">
        <el-button type="primary" @click="openAdd" size="small">添加</el-button>
        <div class="flex">
          <el-input v-model.trim="searchName" style="width: 300px" clearable placeholder="请输入" size="small">
            <template #append>
              <el-button type="primary" icon="Search" size="small"></el-button> </template></el-input>
        </div>
      </div>
      <el-table :data="tableData1.slice(
        (pageObj.currentPage - 1) * pageObj.pageSize,
        pageObj.currentPage * pageObj.pageSize
      )
        " stripe border fit :height="tableHeight" size="small" :tooltip-effect="'dark'">
        <el-table-column type="index" align="center" fixed label="序号" width="50">
          <template #default="scope">
            <span>{{
              scope.$index + pageObj.pageSize * (pageObj.currentPage - 1) + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="CompID" label="工治具编码"  fixed :min-width="flexColumnWidth('工治具编码', 'CompID')" />
        <el-table-column prop="MaterialName" label="工治具类别" 
          :min-width="flexColumnWidth('工治具类别', 'MaterialName')" />
        <el-table-column prop="CompName" label="工治具型号"  :min-width="flexColumnWidth('工治具型号', 'CompName')" />
        <el-table-column prop="TotalUses" label="默认使用次数" align="center"  :min-width="flexColumnWidth('默认使用次数', 'TotalUses')"/>
        <el-table-column prop="Uses" label="已使用次数" align="center" width="80" />
        <el-table-column prop="Status" label="状态" align="center" width="80">
          <template #default="scope">
            <el-tag type="primary" effect="light" v-if="scope.row.Status==1">
              已上线
            </el-tag>
            <el-tag type="warning"  effect="light" v-if="scope.row.Status==11">
              在库
            </el-tag>
            <el-tag type="success" effect="light" v-if="scope.row.Status==0">
              可使用
            </el-tag>
            <el-tag type="info" effect="light" v-if="scope.row.Status==4">
              报废
            </el-tag>
            <el-tag color="#ffffff" effect="light" v-if="scope.row.Status!==0&&scope.row.Status!==1&&scope.row.Status!==11&&scope.row.Status!==4">
              已使用
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="Location" label="库位" align="center" width="60" />
        <el-table-column prop="ExpirationDate" label="到期日期" />
        <el-table-column label="操作" align="center" width="180" fixed="right">
          <template #default="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button type="primary" icon="EditPen" size="small" @click.prevent="editSubmit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" icon="Delete" size="small" @click.prevent="deleteSubmit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="报废" placement="top">
              <el-button type="warning" icon="Failed" size="small" @click.prevent="scrapSubmit(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-2 mb-2">
        <el-pagination :size="'default'" background @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
          :page-size="pageObj.pageSize" :page-sizes="[30, 50, 100, 200, 300]" layout="total,sizes, prev, pager, next"
          :total="tableData.length">
        </el-pagination>
      </div>
      <!-- <table-tem :show-index="true" size="small" :tableData="tableData1" :tableHeight="tableHeight"
        :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange">
      </table-tem> -->
    </el-card>
    <el-dialog align-center :append-to-body="true" :close-on-click-modal="false" v-model="editVisible" @close=""
      title="编辑" width="50%">
      <el-form ref="editFormRef" :model="EditForm" label-position="left" label-width="auto" :inline="true">
        <el-form-item label="工治具型号" prop="compname">
          <el-input disabled v-model.trim="EditForm.compname" style="width: 240px"></el-input>
          <!-- <el-select
            v-model="EditForm.compname"
            placeholder=""
            style="width: 240px"
          >
            <el-option
              v-for="item in compnameList"
              :key="item.CompName"
              :label="item.CompName"
              :value="item.CompName"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item label="工治具编码" prop="compid">
          <el-input disabled v-model.trim="EditForm.compid" style="width: 240px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="库位" prop="location">
          <el-input
            v-model="EditForm.location"
            style="width: 240px"
            placeholder=""
          ></el-input>
        </el-form-item> -->
        <el-form-item label="供应商" prop="Supplier">
          <el-input v-model="EditForm.Supplier" style="width: 240px" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="批次号" prop="LotNumber">
          <el-input v-model="EditForm.LotNumber" style="width: 240px" placeholder=""></el-input>
        </el-form-item>
        <!-- <el-form-item label="到期日期" prop="ExpirationDate">
          <el-date-picker
            style="width: 240px"
            v-model="EditForm.ExpirationDate"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder=""
          />
        </el-form-item> -->
        <el-form-item label="供应商料号" prop="ManufacturerPartNumber">
          <el-input v-model="EditForm.ManufacturerPartNumber" style="width: 240px" :rows="1" type="textarea"
            class="custom-textarea" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="EditForm.remark" style="width: 240px" :rows="2" type="textarea" class="custom-textarea" />
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
    <el-dialog align-center :append-to-body="true" :close-on-click-modal="false" v-model="addVisible" title="添加"
      width="50%" @close="closeSumbit">
      <el-form ref="formRef" :model="form" label-position="left" label-width="auto" :inline="true">
        <el-form-item label="工治具型号" prop="compname">
          <el-select v-model="form.compname" filterable style="width: 240px">
            <el-option v-for="item in compnameList" :key="item.CompName" :label="item.CompName"
              :value="item.CompName" />
          </el-select>
        </el-form-item>
        <el-form-item label="工治具编号" prop="compid">
          <el-input v-model.trim="form.compid" style="width: 240px" placeholder=""></el-input>
        </el-form-item>
        <!-- <el-form-item label="库位" prop="location">
          <el-input
            v-model="form.location"
            style="width: 240px"
            placeholder=""
          ></el-input>
        </el-form-item> -->
        <el-form-item label="供应商" prop="Supplier">
          <el-input v-model="form.Supplier" style="width: 240px" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="批次号" prop="LotNumber">
          <el-input v-model="form.LotNumber" style="width: 240px" placeholder=""></el-input>
        </el-form-item>
        <!-- <el-form-item label="到期日期" prop="ExpirationDate">
          <el-date-picker
            style="width: 240px"
            v-model="form.ExpirationDate"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder=""
          />
        </el-form-item> -->
        <el-form-item label="供应商料号" prop="ManufacturerPartNumber">
          <el-input v-model="form.ManufacturerPartNumber" style="width: 240px" :rows="1" type="textarea"
            class="custom-textarea" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" style="width: 240px" :rows="2" type="textarea" class="custom-textarea" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeSumbit"> 取消 </el-button>
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
import tableTem from "@/components/tableTem/index.vue";
import { ToolsDetail, ToolsType } from "@/api/operate";
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
} from "vue";
const userStore = useUserStoreWithOut();
const loginName = userStore.getUserInfo;

interface formTS {
  compid: string;
  compname: string;
  location: string;
  ManufacturerPartNumber: string;
  Manufacturer: string;
  Supplier: string;
  LotNumber: string;
  remark: string;
  user: string;
  // ExpirationDate: string;
}

interface EditFormTS {
  compid: string;
  compname: string;
  location: string;
  ManufacturerPartNumber: string;
  Manufacturer: string;
  Supplier: string;
  LotNumber: string;
  remark: string;
  user: string;
  // ExpirationDate: string;
}

//   const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const inputValue = ref();
const deleteVisible = ref(false);
const deleteChoice = ref("");
const compnameList = ref<any>([]);
const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});

const tableData = ref([]);

const form = ref<formTS>({
  compid: "",
  compname: "",
  location: "",
  ManufacturerPartNumber: "",
  Manufacturer: "",
  Supplier: "",
  LotNumber: "",
  remark: "",
  user: loginName,
  // ExpirationDate: null,
});

const EditForm = ref<EditFormTS>({
  compid: "",
  compname: "",
  location: "",
  ManufacturerPartNumber: "",
  Manufacturer: "",
  Supplier: "",
  LotNumber: "",
  remark: "",
  user: loginName,
  // ExpirationDate: "",
});
const formRef = ref();
const searchName = ref("");
const tableData1 = ref([]);

const clearForm = () => {
  form.value = {
    compid: "",
    compname: "",
    location: "",
    ManufacturerPartNumber: "",
    Manufacturer: "",
    Supplier: "",
    LotNumber: "",
    remark: "",
    user: loginName,
    // ExpirationDate: "",
  };
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

const clearEditForm = () => {
  EditForm.value = {
    compid: "",
    compname: "",
    location: "",
    ManufacturerPartNumber: "",
    Manufacturer: "",
    Supplier: "",
    LotNumber: "",
    remark: "",
    user: loginName,
    // ExpirationDate: "",
  };
};
const openAdd = () => {
  getCompnameList();
  addVisible.value = true;
};

const closeSumbit = () => {
  addVisible.value = false;
  formRef.value.resetFields();
};
const addSumbit = () => {
  ToolsDetail({
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
};

const editSubmit = (data: any) => {
  EditForm.value.compid = data.CompID;
  EditForm.value.compname = data.CompName;
  EditForm.value.location = data.Location;
  EditForm.value.ManufacturerPartNumber = data.ManufacturerPartNumber;
  EditForm.value.Supplier = data.Supplier;
  EditForm.value.LotNumber = data.LotNumber;
  EditForm.value.remark = data.Remark;
  editVisible.value = true;
};

const editConfirm = () => {
  ToolsDetail({
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
};

const deleteSubmit = (data: any) => {
  // deleteVisible.value = true;
  deleteChoice.value = data.CompID;
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ToolsDetail({ CompID: deleteChoice.value, operationtype: "DEL" }).then(
        (data: any) => {
          if (!data) {
            return;
          }
          ElNotification({
            title: "提示信息",
            message: data.msg,
            type: "success",
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
      //   ElNotification({
      //     title: "取消操作",
      //     // message: "取消操作",
      //     type: "info",
      //   });
    });
};

const scrapSubmit = (data: any) => {
  deleteChoice.value = data.CompID;
  ElMessageBox.confirm("确定报废", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ToolsDetail({ CompID: deleteChoice.value, operationtype: "SCP" }).then(
        (data: any) => {
          if (!data) {
            return;
          }
          ElNotification({
            title: "提示信息",
            message: data.msg,
            type: "success",
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
      //   ElNotification({
      //     title: "取消操作",
      //     // message: "取消操作",
      //     type: "info",
      //   });
    });
};

const deleteConfirm = () => {
  ToolsDetail({ CompID: deleteChoice.value, operationtype: "DEL" }).then(
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
    prop: "CompID",
    label: "工治具编码",
    width: "250",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MaterialName",
    label: "工治具类别",
    width: "",
    min: true,
    align: "center",
  },

  {
    text: true,
    prop: "CompName",
    label: "工治具型号",
    width: "200",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "TotalUses",
    label: "默认使用次数",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Uses",
    label: "已使用次数",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: false,
    tag: true,
    tagType: "number",
    tagItem: [
      { text: "已上线", type: "primary", number: 1 },
      { text: "已出库", type: "warning", number: 11 },
      { text: "可使用", type: "success", number: 0 },
      // { text: "其他", type: "", number: 2 },
    ],
    prop: "CleanStatus",
    label: "状态",
    width: "100px",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Location",
    label: "库位",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ExpirationDate",
    label: "到期日期",
    width: "",
    min: true,
    align: "center",
  },

  {
    isOperation: true,
    label: "操作",
    width: "180",
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
      {
        type: "warning",
        label: "报废",
        icon: "Failed",
        buttonClick: scrapSubmit,
      },
    ],
  },
]);

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
  getCompnameList();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
  ToolsDetail({ operationtype: "QAL" }).then((data: any) => {
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

const getCompnameList = () => {
  ToolsType({ operationtype: "QAL" }).then((data: any) => {
    const dataText = data.content;
    compnameList.value = dataText;
  });
};
const getMaxLength = (arr: any) => {
  return arr.reduce((acc: any, item: any) => {
    if (item) {
      // console.log(acc,item);
      const calcLen = getTextWidth(item);

      if (acc < calcLen) {
        acc = calcLen;
      }
    }
    return acc;
  }, 0);
};
const getTextWidth = (str: string) => {
  let width = 0;
  const html = document.createElement("span");
  html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${13}px; font-family: Arial, sans-serif;`;
  html.innerText = str; // 去除字符串前后的空白字符
  document.body?.appendChild(html);

  const spanElement = html; // 无需再次查询，直接使用创建的元素
  if (spanElement) {
    width = spanElement.offsetWidth;
    spanElement.remove();
  }
  // console.log(width);
  return width;
};

const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
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

/* 隐藏滚动条，但保持可滚动功能 */
.custom-textarea ::-webkit-scrollbar {
  display: none;
}
</style>
