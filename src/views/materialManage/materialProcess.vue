<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div>
        <el-form ref="formRef" size="small" :model="getForm" label-width="auto" :inline="true">
          <el-form-item label="组件编码" prop="ProductName" class="mb-2">
            <el-input v-model="getForm.ProductName" style="width: 160px" clearable @keyup.enter.native="getData" />
          </el-form-item>
          <el-form-item label="组件描述" prop="ProductDescription" class="mb-2">
            <el-input v-model="getForm.ProductDescription" style="width: 160px" clearable
              @keyup.enter.native="getData" />
          </el-form-item>
          <!-- <el-form-item label="组件类型" prop="ProductDescription" class="mb-2">
            <el-select v-model="getForm.QueryType" style="width: 150px" @change="getData">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item> -->
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="w-full flex">
        <div class="setwidth w-[400px]">
          <!-- <el-table-v2 :columns="columns" :data="tableData" :height="tableHeight" border fit fixed highlight-current-row
            @cell-click="cellClick" /> -->
          <el-table :data="tableData" ref="tableRef"  size="small" :height="tableHeight" :tooltip-effect="'dark'" border fit 
            highlight-current-row @cell-click="cellClick" :row-class-name="tableRowClassName">
            <el-table-column type="index" align="center" fixed label="序号" width="50" />
            <el-table-column prop="ProductName" label="组件编码" width="120" />
            <el-table-column prop="ProductDesc" label="组件描述" :show-overflow-tooltip="true" />
            <template #empty>
              <div class="flex items-center justify-center h-100%">
                <el-empty />
              </div>
            </template>
          </el-table>
        </div>
        <div class="w-[calc(100%-408px)] ml-2">
          <div class="mb-1 w-full">
            <el-radio-group v-model="radio1" @change="changeRadio">
              <el-form ref="formRef" label-position="left" label-width="auto" size="small" :inline="true">
                <el-form-item class="mb-1">
                  <el-radio-button value="1" size="small" label="主工艺流程"></el-radio-button>
                </el-form-item>

                <el-form-item label="主工艺流程名称" prop="WorkflowName" class="mb-1">
                  <el-input disabled v-model.trim="specWork.WorkflowName" style="width: 160px"></el-input>
                </el-form-item>
                <el-form-item label="主工艺流程描述" prop="WorkflowDesc" class="mb-1">
                  <el-input disabled v-model.trim="specWork.WorkflowDesc" style="width: 160px"></el-input>
                </el-form-item>
                <el-form-item class="mb-1">
                  <el-button type="primary" @click="openSpecWorK('1')"
                    :disabled="specWorkForm.ProductName == ''">修改工艺路线</el-button>
                </el-form-item>
              </el-form>
              <el-form ref="formRef" label-position="left" label-width="auto" size="small" :inline="true">
                <el-form-item class="mb-1">
                  <el-radio-button value="2" size="small" label="预加工流程"></el-radio-button>
                </el-form-item>
                <el-form-item label="预加工流程名称" prop="WorkflowName" class="mb-1">
                  <el-input disabled v-model.trim="specPreWork.WorkflowName" style="width: 160px"></el-input>
                </el-form-item>
                <el-form-item label="预加工流程描述" prop="WorkflowDesc" class="mb-1">
                  <el-input disabled v-model.trim="specPreWork.WorkflowDesc" style="width: 160px"></el-input>
                </el-form-item>
                <el-form-item class="mb-1">
                  <el-button type="warning" @click="openSpecWorK('2')"
                    :disabled="specWorkForm.ProductName == ''">修改预加工工艺路线</el-button>
                </el-form-item>
              </el-form>
            </el-radio-group>
            <el-table :data="specWorkData" size="small" :height="tableHeight1" :tooltip-effect="'dark'" stripe border
              fit>
              <el-table-column type="index" align="center" fixed label="序号" width="50" />
              <el-table-column prop="SpecName" label="工序编码" :min-width="180" width="180">
              </el-table-column>
              <el-table-column prop="SpecDesc" label="工序描述" :min-width="180" width="180">
              </el-table-column>
              <template #empty>
                <div class="flex items-center justify-center h-100%">
                  <el-empty />
                </div>
              </template>
            </el-table>
          </div>
          <div class="w-full">
            <div class="mb-1">
              <el-button type="primary" size="small" @click="openSpecIssue" :disabled="specWork.WorkflowName == '' || selectData.length == 0
                ">修改工序</el-button>
            </div>
            <el-table :data="productData" size="small" :height="tableHeight1" stripe border fit :tooltip-effect="'dark'"
              row-key="MaterialName" @selection-change="handleSelectionChange">
              <el-table-column type="selection" align="center" width="50"></el-table-column>

              <el-table-column align="center" fixed label="序号" width="50">
                <template #default="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column prop="MaterialName" label="物料编码" fixed width="120" />
              <el-table-column prop="MaterialDesc" label="物料描述" :show-overflow-tooltip="true" width="250" />
              <el-table-column prop="SpecName" label="工序编码" flexible>
              </el-table-column>
              <el-table-column prop="SpecDesc" label="工序名称" flexible>
              </el-table-column>
              <el-table-column prop="QtyRequired" label="单件用量" width="80" align="center" />
              <el-table-column prop="UOMName" label="单位" width="80" align="center" />
              <el-table-column prop="IssueControlType" label="消耗类型" width="80" align="center">
                <template #default="scope">
                  <el-tag type="primary" v-if="scope.row.IssueControl == 2">{{ scope.row.IssueControlType }}</el-tag>
                  <el-tag type="info" v-if="scope.row.IssueControl == 6">{{ scope.row.IssueControlType }}</el-tag>
                  <el-tag type="warning" v-if="scope.row.IssueControl == 1">{{ scope.row.IssueControlType }}</el-tag>
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
      </div>
    </el-card>
    <el-dialog v-model="specWorkVisible" title="选择工艺路线" draggable width="970px" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" align-center>
      <div class="flex gap-5">
        <div class="w-[470px]">
          <el-table ref="singleTableRef" :data="workFlow" size="small" :height="500" :tooltip-effect="'dark'" stripe
            border fit highlight-current-row @cell-click="cellWorkFlowClick">
            <el-table-column type="index" align="center" fixed label="序号" width="50" />
            <el-table-column prop="WorkflowName" label="工艺编码" :min-width="120" width="150">
            </el-table-column>
            <el-table-column prop="WorkflowDesc" label="工艺描述" :min-width="270" width="270">
            </el-table-column>
            <template #empty>
              <div class="flex items-center justify-center h-100%">
                <el-empty />
              </div>
            </template>
          </el-table>
        </div>
        <el-table :data="specWorkDecData" size="small" style="width: 100%" :height="500" :tooltip-effect="'dark'" stripe
          border fit>
          <el-table-column type="index" align="center" fixed label="序号" width="50" />
          <el-table-column prop="SpecName" label="工序编码" :min-width="180" width="180">
          </el-table-column>
          <el-table-column prop="SpecDesc" label="工序描述"> </el-table-column>
          <template #empty>
            <div class="flex items-center justify-center h-100%">
              <el-empty />
            </div>
          </template>
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="specWorkVisible = false">取消</el-button>
          <el-button type="primary" @click="updateSpecWork"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="specVisible" title="修改工序" draggable width="400px" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false" align-center @close="specIssueCancel">
      <el-form ref="speContFormRef" :model="speContForm" label-width="auto">
        <el-form-item label="工序" prop="SpecName">
          <el-select v-model="speContForm.SpecName" style="width: 240px">
            <el-option v-for="item in specWorkData" :key="item.SpecName" :label="item.SpecDesc"
              :value="item.SpecName" />
          </el-select>
        </el-form-item>
        <el-form-item label="消耗类型" prop="IssueControl">
          <el-select v-model="speContForm.IssueControl" style="width: 240px">
            <el-option v-for="item in issueList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="specIssueCancel">取消</el-button>
          <el-button type="primary" @click="updateSpecIssue"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  findProduct,
  findProductSpecWork,
  findWorkFlow,
  UpdateProductWorkflow,
  findProductBOMMaterialList,
  findWorkflowSpec,
  UpdateProductBOMMaterialList,
} from "@/api/operate";
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  nextTick,
  reactive,
} from "vue";
import { ElNotification } from "element-plus";

import { debounce } from 'lodash-es'

interface SpecForm {
  ProductName: string;
  ProductDescription: string;
  materialList: Array<any>;
}
const form = ref({
  MaterialCode: "",
});
const tableData = ref([]);

const specWorkData = ref<any[]>([]);
const productData = ref([]);
const tableHeight = ref(0);
const tableHeight1 = ref(0);
const tableHeight2 = ref(0);
const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});
const getForm = ref({
  ProductName: "",
  ProductDescription: "",
  QueryType: "2",
});
const specWork = ref({
  WorkflowName: "",
  WorkflowDesc: "",
});
const specPreWork = ref({
  WorkflowName: "",
  WorkflowDesc: "",
});
const radio1 = ref("1");

const specWorkVisible = ref(false);
const specWorkForm = ref({
  ProductName: "",
  WorkflowType: "",
  WorkflowName: "",
});

const workFlow = ref<any[]>([]);
const ProductName = ref("");
const specWorkDecData = ref<any[]>([]);
const singleTableRef = ref();
const specVisible = ref(false);
const speContFormRef = ref();
const specForm = ref<SpecForm>({
  ProductName: "",
  ProductDescription: "",
  materialList: [],
});
const speContForm = ref({
  SpecName: "",
  IssueControl: "6",
});
const issueList = ref([
  {
    value: "2",
    label: "批次",
  },
  {
    value: "1",
    label: "单件",
  },
  {
    value: "6",
    label: "仅显示",
  },
]);
const selectData = ref([]);
const columns = ref([
  {
    key: "ProductName",
    title: "组件编码",
    dataKey: "ProductName",
    width: 120,
  },
  {
    key: "ProductDesc",
    title: "组件描述",
    dataKey: "ProductDesc",
    // width: 150,
  },
]);
const tableRef=ref()

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  // getData();
  getWorkFlow();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
  findProduct(getForm.value).then((res: any) => {
    specWorkData.value = [];
    productData.value = [];
    specWork.value = {
      WorkflowDesc: "",
      WorkflowName: "",
    };
    specPreWork.value = {
      WorkflowDesc: "",
      WorkflowName: "",
    };
    tableData.value = res.content;
    if (tableData.value.length == 1) {
      cellClick(res.content[0])
     
      
      tableRef.value.setCurrentRow(res.content[0])
     
    }
  });
};
const inputData = debounce(() => {
  getData()
}, 1000)
const getProductList = () => {
  findProductBOMMaterialList(ProductName.value).then((res: any) => {
    productData.value = res.content;
    // console.log(res.content);
  });
};
const getWorkFlow = () => {
  findWorkFlow({
    WorkflowName: "",
    Revision: "",
    WorkflowDescription: "",
  }).then((res: any) => {
    workFlow.value = res.content;
  });
};
const getSpecWorkData = () => {
  findProductSpecWork(ProductName.value).then((res: any) => {
    if (res.content.length != 0) {
      specWork.value = {
        WorkflowDesc: res.content[0].WorkflowDesc,
        WorkflowName: res.content[0].WorkflowName,
      };
    } else {
      specWork.value = {
        WorkflowDesc: "",
        WorkflowName: "",
      };
    }
    specWorkData.value = res.content;
  });
};

const tableRowClassName = (val: any) => {
  if (val.row.WorkflowName == null) {
    return "active-table";
  }
  return "";
};
const cellClick = (val: any) => {
  specWorkData.value = []
  productData.value = []
  ProductName.value = val.ProductName;
  specForm.value.ProductName = val.ProductName;
  specWorkForm.value.ProductName = val.ProductName;
  specWork.value.WorkflowName = val.WorkflowName;
  specWork.value.WorkflowDesc = val.WorkflowDesc;
  specPreWork.value.WorkflowName = val.PreProcessWorkflowName;
  specPreWork.value.WorkflowDesc = val.PreProcessWorkflowDesc;

  // getSpecWorkData();

  getSpecData();
  getProductList();
};

const getSpecData = () => {
  if (ProductName.value !== "") {
    let data = "";
    if (radio1.value == "1") {
      data = specWork.value.WorkflowName;
    } else {
      data = specPreWork.value.WorkflowName;
    }
    if (data !== null) {
      findWorkflowSpec(data).then((res: any) => {
        specWorkData.value = res.content;
      });
    }
  } else {
  }
};
const changeRadio = () => {
  specWorkData.value = [];
  getSpecData();
};

const openSpecWorK = (type: any) => {
  specWorkDecData.value = [];
  specWorkForm.value.WorkflowType = type;
  specWorkVisible.value = true;
  // console.log( specWorkForm.value);
  let workflowName =
    type == 1 ? specWork.value.WorkflowName : specPreWork.value.WorkflowName;
  const isHight = workFlow.value.find(
    (w: any) => w.WorkflowName == workflowName
  );
  nextTick(() => {
    if (isHight !== undefined) {
      specWorkForm.value.WorkflowName = workflowName;
      singleTableRef.value.setCurrentRow(isHight);
      getWorkFlowSpec(workflowName);
    } else {
      specWorkForm.value.WorkflowName = "";
      singleTableRef.value.setCurrentRow();
    }
  });
};

const updateSpecWork = () => {
  // console.log(specWorkForm.value);

  UpdateProductWorkflow(specWorkForm.value).then((res: any) => {
    specWorkVisible.value = false;
    ElNotification({
      title: "提示信息",
      message: res.msg,
      type: res.success ? "success" : "error",
    });
    if (res.success) {
      findProduct({
        ProductName: ProductName.value,
        ProductDescription: "",
      }).then((res: any) => {
        let data = res.content[0];
        specWork.value.WorkflowName = data.WorkflowName;
        specWork.value.WorkflowDesc = data.WorkflowDesc;
        specPreWork.value.WorkflowName = data.PreProcessWorkflowName;
        specPreWork.value.WorkflowDesc = data.PreProcessWorkflowDesc;
      });
      // getSpecWorkData();
      specWorkForm.value.WorkflowName = "";
      getSpecData();
    }
  });
};
const cellWorkFlowClick = (row: any) => {
  specWorkForm.value.WorkflowName = row.WorkflowName;
  getWorkFlowSpec(row.WorkflowName);
};
const getWorkFlowSpec = (val: any) => {
  findWorkflowSpec(val).then((res: any) => {
    specWorkDecData.value = res.content;
  });
};

const openSpecIssue = () => {
  specVisible.value = true;
};

const specIssueCancel = () => {
  speContForm.value.SpecName = "";
  speContForm.value.IssueControl = "6";
  specVisible.value = false;
};

const updateSpecIssue = () => {
  let data = selectData.value.map((s: any) => {
    return {
      Index: s.RN,
      ...speContForm.value,
    };
  });
  specForm.value.materialList = data;
  // console.log( specForm.value);
  UpdateProductBOMMaterialList(specForm.value).then((res: any) => {
    if (res.success) {
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
      speContForm.value.SpecName = "";
      speContForm.value.IssueControl = "6";
      specForm.value.materialList = [];
      specVisible.value = false;
      getProductList();
    }
  });
};
const handleSelectionChange = (row: any) => {
  selectData.value = row;
};

const selectable = (row: any, selectedRows: any) => {
  console.log(selectedRows);
  return selectedRows.length < 1;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 146;
    tableHeight1.value = (window.innerHeight - 240) * 0.5;
    // tableHeight2.value =( window.innerHeight - 178)*0.5;
  });
};
const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}

.setwidth {
  flex: 0 0 400px;
}
</style>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .active-table {
  --el-table-tr-bg-color: var(--el-color-error-light-7);
}
</style>
