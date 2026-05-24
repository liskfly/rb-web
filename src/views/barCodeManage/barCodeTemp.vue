<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between">
        <div>
          <el-button type="primary" size="small" @click="openAddTemp">添加</el-button>
        </div>
        <el-form ref="formRef" size="small" :model="getForm" label-width="auto" :inline="true">
          <el-form-item label="模板名称" prop="ProductName" class="mb-2">
            <el-input v-model="getForm.TemplateName" style="width: 160px" clearable @clear="getData"
              @change="getData" />
          </el-form-item>
          <el-form-item label="物料编码" prop="ProductDescription" class="mb-2">
            <el-input v-model="getForm.TemplatePartNum" style="width: 160px" clearable @clear="getData"
              @change="getData" />
          </el-form-item>
          <el-form-item label="启用" prop="ProductDescription" class="mb-2">
            <el-select v-model="getForm.TemplateEnable" style="width: 150px" @change="getData" placeholder="">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="flex">
        <div class="w-[calc(100%-408px)]">
          <el-table :data="tableData.slice(
      (pageObj.currentPage - 1) * pageObj.pageSize,
      pageObj.currentPage * pageObj.pageSize
    )
      " size="small" :style="{ width: '100%' }" :height="tableHeight"
            :tooltip-effect="'dark'" border fit highlight-current-row @cell-click="cellClick">
            <el-table-column type="index" align="center" fixed label="序号" width="50"
      >
        <template #default="scope">
          <span>{{ scope.$index+pageObj.pageSize* (pageObj.currentPage-1) +1}}</span>
        </template>
      </el-table-column>
            <el-table-column prop="Template_Name" label="模板名称" width="180" :show-overflow-tooltip="true" fixed/>
            <el-table-column prop="Template_Enable" label="是否启用" width="80" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.Template_Enable ? 'primary' : 'info'">{{ scope.row.Template_Enable ? '是' : '否'
                  }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="Template_EnableExternal" label="是否启用外部码" width="120" align="center">
              <template #default="scope">
                <el-tag effect="plain" :type="scope.row.Template_EnableExternal ? 'primary' : 'info'">{{
                  scope.row.Template_EnableExternal ? '是' : '否'
                }}</el-tag>
              </template>
            </el-table-column>

          
            <el-table-column prop="Template_UpdateBy" label="更新人" width="120" />
            <el-table-column prop="Template_UpdateOn" label="更新时间" width="180" />
            <el-table-column prop="Template_Remark" label="备注" :show-overflow-tooltip="true"  />
           
            <el-table-column label="操作" width="120" fixed="right" align="center">
              <template #default="scope">
                <el-tooltip content="编辑" placement="top">
                  <el-button type="primary" icon="EditPen" size="small" @click.stop="handleEdit(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button type="danger" icon="Delete" size="small" @click.stop="handleDelete(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <template #empty>
              <div class="flex items-center justify-center h-100%">
                <el-empty />
              </div>
            </template>
          </el-table>
          <div class="mt-2">
              <el-pagination :size="'default'" background @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
                :page-size="pageObj.pageSize" :page-sizes="[30, 50, 100, 200, 300]"
                layout="total,sizes, prev, pager, next" :total="tableData.length">
              </el-pagination>
            </div>
        </div>
        <div class="w-[400px] ml-2">
          <div class="mb-2">
            <el-button type="primary" size="small" @click="openAddMater" :disabled="TemplateName == ''">添加</el-button>
          </div>
          <el-table :data="materialData" size="small" :style="{ width: '100%' }" :height="tableHeight1"
            :tooltip-effect="'dark'" border fit>

            <el-table-column prop="ProductName" label="组件编码" width="120" />
            <el-table-column prop="Description" label="组件描述" :show-overflow-tooltip="true" />
            <el-table-column label="操作" width="80" fixed="right" align="center">
              <template #default="scope">
                <!-- <el-tooltip content="编辑" placement="top">
                  <el-button type="primary" icon="EditPen" size="small" @click.stop="handleEdit(scope.row)"></el-button>
                </el-tooltip> -->
                <el-tooltip content="删除" placement="top">
                  <el-button type="danger" icon="Delete" size="small" @click.stop="deleteMater(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <template #empty>
              <div class="flex items-center justify-center h-100%">
                <el-empty />
              </div>
            </template>
          </el-table>
        </div>
      </div>
    </el-card>
    <el-dialog v-model="addVisible" title="添加模板" draggable width="500px" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="addCancel">
      <el-form ref="addTempRef" :model="addTempForm" label-width="auto">
        <el-form-item label="模板名称" prop="TemplateName" class="flex items-center">
          <el-input v-model="addTempForm.TemplateName" style="width: 240px" />
          <el-checkbox v-model="addTempForm.TemplateEnable" label="启用" class="ml-3" />
        </el-form-item>
        <el-form-item label="模板文件" prop="TemplateName">
          <el-upload ref="upload" class="upload-demo" accept=".btw" action="" :file-list="fileList" style="width: 240px" :limit="1" 
          :on-exceed="handleExceed"   :http-request="handleFileUpload"  :on-remove="handleRemove" :auto-upload="true">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传一个文件</div>
          </el-upload>
          <el-checkbox v-model="addTempForm.TemplateEnableExternal" label="外部码" class="ml-3" />
        </el-form-item>
        <el-form-item label="备注" prop="TemplateRemark">
          <el-input v-model="addTempForm.TemplateRemark" type="textarea" style="width: 240px"
            :autoSize="{ minRows: 4, maxRows: 6 }" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCancel">取消</el-button>
          <el-button type="primary" @click="addConfirm"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="editVisible" title="修改模板" draggable width="500px" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="editCancel">
      <el-form ref="editTempRef" :model="editTempForm" label-width="auto">
        <el-form-item label="模板名称" prop="TemplateName" class="flex items-center">
          <el-input v-model="editTempForm.TemplateName" disabled style="width: 240px" />
          <el-checkbox v-model="editTempForm.TemplateEnable" label="启用" class="ml-3" />
        </el-form-item>
        <el-form-item label="模板文件" prop="Template_File">
          <!-- <el-input v-model="editTempForm.Template_File" style="width: 240px" /> -->
          <el-upload ref="upload" class="upload-demo" accept=".btw" action="" :file-list="fileList" style="width: 240px" :limit="1"
          :on-exceed="handleExceed" :http-request="handleFileUpload"  :on-remove="handleRemove" :auto-upload="true">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传一个文件</div>
        </el-upload>
          <el-checkbox v-model="editTempForm.TemplateEnableExternal" label="外部码" class="ml-3" />
        </el-form-item>
       
        <el-form-item label="备注" prop="TemplateRemark">
          <el-input v-model="editTempForm.TemplateRemark" type="textarea" style="width: 240px"
            :autoSize="{ minRows: 4, maxRows: 6 }" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCancel">取消</el-button>
          <el-button type="primary" @click="editConfirm"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="addMaterVisible" title="添加模板物料" draggable width="500px" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="addMaterCancel">
      <el-form ref="addMaterRef" :model="addMaterForm" label-width="auto">
        <!-- <el-form-item label="模板名称" prop="TemplateName" >
          <el-input v-model="addMaterForm.TemplateName" style="width: 240px" />
        </el-form-item> -->
        <el-form-item label="物料编码" prop="PartNumber">
          <el-select-v2 v-model="addMaterForm.PartNumber" :options="materData" filterable :props="props"
            style="width: 240px" />
          <!-- <el-input v-model="addMaterForm.PartNumber" style="width: 240px" /> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addMaterCancel">取消</el-button>
          <el-button type="primary" @click="addMaterConfirm"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  GetBarCodeTemplate,
  InsertBarCodeTemplate,
  UpdateBarCodeTemplate,
  DeleteBarCodeTemplate,
  QueryMESProductNameNews,
  GetBarCodeTemplatePartNumberContent,
  InsertBarCodeRuleTempPartNumContent,
  DeleteBarCodeRuleTempPartNumContent,
} from "@/api/operate";
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  nextTick,
  reactive,
} from "vue";
import { genFileId } from 'element-plus'
import { ElNotification, ElMessageBox } from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
const userStore = useUserStoreWithOut();
const getForm = ref({
  TemplateName: "",
  TemplatePartNum: "",
  TemplateEnable: "",
});
const typeList = ref([
  {
    label: "",
    value: "",
  },
  {
    label: "是",
    value: "是",
  },
  {
    label: "否",
    value: "否",
  },
]);
const tableData = ref([]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});
const materialData = ref([]);
const tableHeight1 = ref(0);
const addTempRef = ref();
const addVisible = ref(false);
const addTempForm = ref({
  TemplateName: "",
  TemplateEnableExternal: false,
  TemplateEnable: true,
  TemplateRemark: "",
  Template_File: "",
  UserNo: userStore.getUserInfo,
});
const editTempRef = ref();
const editVisible = ref(false);
const editTempForm = ref({
  TemplateName: "",
  TemplateEnableExternal: false,
  TemplateEnable: true,
  TemplateRemark: "",
  Template_File: "",
  UserNo: userStore.getUserInfo,
});
const addMaterRef = ref();
const addMaterVisible = ref(false);
const addMaterForm = ref({
  TemplateName: "",
  PartNumber: "",
  UserNo: userStore.getUserInfo,
});
const TemplateName = ref("");
const materData = ref([]);
const props = ref({
  label: "ProductName",
  value: "ProductName",
});
const fileList=ref([])
const upload=ref()

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
  getMesData()
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
  GetBarCodeTemplate(getForm.value).then((res: any) => {
    // console.log(res.content);
    tableData.value = res.content;
  });
};
const getMesData = () => {
  QueryMESProductNameNews({
    ProductName: "",
  }).then((res: any) => {
    materData.value = res.content;
  });
};
const getTemplatePart = () => {
  GetBarCodeTemplatePartNumberContent({
    TemplateName: TemplateName.value,
  }).then((res: any) => {
    materialData.value = res.content;
  });
};
const openAddTemp = () => {
  addVisible.value = true;
};
const addCancel = () => {
  fileList.value=[]
  addTempRef.value.resetFields();
  addVisible.value = false;
};

const addConfirm = () => {
  InsertBarCodeTemplate(addTempForm.value).then((res: any) => {
    if (res.success) {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
      fileList.value=[]
      addTempRef.value.resetFields();
      getData();
      addVisible.value = false;
    }
  });
};

const cellClick = (row: any) => {
  TemplateName.value = row.Template_Name;
  addMaterForm.value.TemplateName = row.Template_Name
  getTemplatePart();
};
const handleEdit = (row: any) => {

  editTempForm.value.TemplateName = row.Template_Name;
  editTempForm.value.TemplateEnable = row.Template_Enable;
  editTempForm.value.TemplateEnableExternal = row.Template_EnableExternal;
  editTempForm.value.Template_File = row.Template_File;
  editTempForm.value.TemplateRemark = row.Template_Remark;
  editVisible.value = true;
};
const editCancel = () => {
  fileList.value=[]
  editTempRef.value.resetFields();
  editVisible.value = false;
};

const editConfirm = () => {
  UpdateBarCodeTemplate(editTempForm.value).then((res: any) => {
    if (res.success) {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });

      getData();
      fileList.value=[]
      editTempRef.value.resetFields();
      editVisible.value = false;
    }
  });
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      DeleteBarCodeTemplate({
        TemplateName: row.Template_Name,
      }).then((res: any) => {
        if (res.success) {
          ElNotification({
            title: "提示信息",
            message: "删除成功",
            type: "success",
          });
          getData()
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

const openAddMater = () => {
  addMaterVisible.value = true;
};
const addMaterCancel = () => {
  addMaterRef.value.resetFields();
  addMaterVisible.value = false;
};
const addMaterConfirm = () => {
  InsertBarCodeRuleTempPartNumContent(addMaterForm.value).then((res: any) => {
    if (res.success) {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
      addMaterRef.value.resetFields();
      getTemplatePart();
      addMaterVisible.value = false;
    }
  });
};

const deleteMater = (row: any) => {
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      DeleteBarCodeRuleTempPartNumContent({
        TemplateName: TemplateName.value,
        PartNumber: row.ProductName,
      }).then((res: any) => {
        if (res.success) {
          ElNotification({
            title: "提示信息",
            message: "删除成功",
            type: "success",
          });
          getTemplatePart();
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

const handleExceed=(files:any)=>{
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
  convertFileToBase64(file)
}
const handleRemove=()=>{
  editTempForm.value.Template_File=""
  addTempForm.value.Template_File=""
}

const handleFileUpload = (data: any) => {
  // console.log(data);
  convertFileToBase64(data.file)
}
const convertFileToBase64 = (file: any) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e: any) => {
    let data = e.target.result
    let arr = data.split(",")
    if (editVisible.value) {
      editTempForm.value.Template_File = arr[1]
    }
    if (addVisible.value) {
      addTempForm.value.Template_File = arr[1]
    }

  };
}
const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 185;
    tableHeight1.value = window.innerHeight - 180;
  });
};
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}</style>
