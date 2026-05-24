<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div class="pb-[10px]">
        <el-button type="primary" @click="openAdd">添加</el-button>
      </div>
      <el-table
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        stripe
        border
        fit
        :height="tableHeight"
        row-key="Step1"
        :tree-props="{ children: 'stepItemList' }"
      >
        <el-table-column prop="Product" label="产品编码"> </el-table-column>
        <el-table-column prop="Step" label="检验工序"> </el-table-column>
        <el-table-column prop="Name" label="检验设备"> </el-table-column>
        <el-table-column prop="SubItem" label="检验子项"> </el-table-column>
        <el-table-column prop="SubItemName" label="检验名称"> </el-table-column>
        <el-table-column prop="SubItemBasic" label="单位"> </el-table-column>
        <el-table-column prop="SubItemMethod" label="下限值"> </el-table-column>
        <el-table-column prop="SubItemAim" label="上限值"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template #default="scope">
            <el-tooltip content="编辑" placement="top" v-if="scope.row.SubItem">
              <el-button
                type="primary"
                icon="EditPen"
                size="small"
                @click.prevent="handleEdit(scope.row)"
              ></el-button>
            </el-tooltip>

            <el-tooltip content="删除" placement="top" v-if="scope.row.SubItem">
              <el-button
                type="danger"
                icon="Delete"
                size="small"
                @click.prevent="handleDelete(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-3">
        <el-pagination
        
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="addVisible"
      @close="addCancel()"
      title="添加"
      width="50%"
    >
    
      <el-form
        ref="formRef"
        :model="form"
        label-position="left"
        label-width="auto"
      > <el-form-item label="工段" prop="WorkSection">
          <el-input v-model="addFrom.WorkSection" placeholder="工段"></el-input>
        </el-form-item>
        <el-form-item label="产品编码" prop="Product">
          <el-input v-model="addFrom.Product" placeholder="产品编码"></el-input>
        </el-form-item>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="检验工序" prop="step">
              <el-input v-model="form.Step" placeholder="工序" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验设备" prop="name">
              <el-input v-model="form.Name" placeholder="检验设备"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="内容" prop="inspectContent">
          <el-input
            type="textarea"
            v-model="form.InspectContent"
            placeholder="内容"
          ></el-input>
        </el-form-item>

        <!-- <el-form ref="formRef2" :model="formItem" label-position="left" label-width="auto"> -->

        <div v-for="(item, index) in form.StepItemList" :key="index">
          <el-divider>检验子项{{ index + 1 }}</el-divider>
          <el-row :gutter="50">
            <el-col :span="12">
              <el-form-item
                label="编号"
                :prop="'stepItemList.' + index + '.subItem'"
              >
                <el-input
                  v-model.number="item.SubItem"
                  placeholder="子项编号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="名称"
                :prop="'stepItemList.' + index + '.subItemName'"
              >
                <el-input
                  v-model="item.SubItemName"
                  placeholder="子项名称"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="50">
            <el-col :span="12">
              <el-form-item
                label="检查目标"
                :prop="'stepItemList.' + index + '.subItemAim'"
              >
                <el-input
                  type="textarea"
                  v-model="item.SubItemAim"
                  placeholder="子项检查目标"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item
                label="检验方法"
                :prop="'stepItemList.' + index + '.subItemMethod'"
              >
                <el-input
                  type="textarea"
                  v-model="item.SubItemMethod"
                  placeholder="子项检验方法"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :span="12">
              <el-form-item
                label="检查标准"
                :prop="'stepItemList.' + index + '.subItemBasic'"
              >
                <el-input
                  type="textarea"
                  v-model="item.SubItemBasic"
                  placeholder="检查标准"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="12">
              <el-form-item
                label="解决办法"
                :prop="'stepItemList.' + index + '.subItemSolution'"
              >
                <el-input
                  type="textarea"
                  v-model="item.SubItemSolution"
                  placeholder="子项检查解决办法"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-button v-if="index != 0" type="danger" @click="deleteSon(index)"
            >删除子项</el-button
          >
        </div>
      </el-form>
      <!-- </el-form> -->

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCancel"> 取消 </el-button>
          <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
          <el-button type="primary" @click="addSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="editVisible"
      @close="eidtCancel()"
      title="添加"
      width="50%"
    >  
      <el-form ref="eidtRef" :model="editForm" label-width="100px">
        <el-form-item label="工段" prop="WorkSection">
          <el-input v-model="editHear.WorkSection" placeholder="工段"></el-input>
        </el-form-item>
        <el-form-item label="产品编码" prop="Product">
          <el-input v-model="editHear.Product" placeholder="产品编码"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检验工序" prop="step">
              <el-input
                v-model.number="editForm.Step"
                placeholder="检验工序"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验设备" prop="name">
              <el-input
                v-model="editForm.Name"
                placeholder="检验设备"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="内容" prop="inspectContent">
          <el-input
            type="textarea"
            v-model="editForm.InspectContent"
            placeholder="内容"
          ></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="编号">
              <el-input
                v-model.number="editForm.StepItemList[0].SubItem"
                placeholder="子项编号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称">
              <el-input
                v-model="editForm.StepItemList[0].SubItemName"
                placeholder="子项名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="检查目标">
              <el-input
                type="textarea"
                v-model="editForm.StepItemList[0].SubItemAim"
                placeholder="子项检查目标"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="检验方法">
              <el-input
                type="textarea"
                v-model="editForm.StepItemList[0].SubItemMethod"
                placeholder="子项检验方法"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查标准">
              <el-input
                type="textarea"
                v-model="editForm.StepItemList[0].SubItemBasic"
                placeholder="检查标准"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="解决办法">
              <el-input
                type="textarea"
                v-model="editForm.StepItemList[0].SubItemSolution"
                placeholder="子项检查解决办法"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
      </el-form>

      <!-- <el-form ref="eidtForm2" :model="stepItemList" label-width="100px">
       
      </el-form> -->

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="eidtCancel"> 取消 </el-button>
          <el-button type="primary" @click="editSubmit()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FistTableData, AllInspection } from "@/typing";
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import {
  InsertInspect,
  GetInspectData,
  UpdateInspectData,
  DeleteInspectData,
} from "@/api/operate";
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

const tableData = ref<InstanceType<typeof FistTableData>[]>([]);
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const formRef = ref();
const getForm = reactive({
  Product: "*",
  WorkSection: "",
  InspectType: "4I",
  StepList: [
    {
      Step: 0,
      Status: "I",
      Name: "",
      InspectContent: "",
      StepItemList: [
        {
          SubItemName: "",
          SubItem: 0,
          SubItemMethod: "",
          SubItemBasic: "",
          SubItemSolution: "",
          SubItemAim: "",
          SubItemType: "",
        },
      ],
    },
  ],
});
const form = reactive({
  Step: "",
  Status: "I",
  Name: "",
  InspectContent: "",
  StepItemList: [
    {
      SubItemName: "",
      SubItem: "",
      SubItemMethod: "",
      SubItemBasic: "",
      SubItemSolution: "",
      SubItemAim: "",
      SubItemType: "",
    },
  ],
});
const editForm = reactive({
  Step: "",
  Status: "U",
  Name: "",
  InspectContent: "",
  StepItemList: [
    {
      SubItemName: "",
      SubItem: "",
      SubItemMethod: "",
      SubItemBasic: "",
      SubItemSolution: "",
      SubItemAim: "",
      SubItemType: "",
    },
  ],
});
const editHear = reactive<InstanceType<typeof AllInspection>>({
  Product: "",
  WorkSection: "",
  InspectType: "4I",
  StepList: [],
});
const addFrom = reactive<InstanceType<typeof AllInspection>>({
  Product: "",
  WorkSection: "",
  InspectType: "4I",
  StepList: [],
});
const deleteForm = reactive<InstanceType<typeof AllInspection>>({
  product: "",
  inspectType: "4I",
  stepList: [],
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

//获取基础数据
const getData = () => {
  GetInspectData(getForm).then((res:any)=>{
    // console.log(res);
    if(res.code==100200){
      dispose(res.content)
    }
  })
 };

const openAdd = () => {
  addVisible.value = true;
};
const addSon = () => {
  form.StepItemList.push({
    SubItemName: "",
    SubItem: "",
    SubItemMethod: "",
    SubItemBasic: "",
    SubItemSolution: "",
    SubItemAim: "",
    SubItemType: "",
  });
};
const deleteSon = (index: any) => {
  form.StepItemList = form.StepItemList.filter((v: any, i) => i !== index);
};

const addCancel = () => {
  addVisible.value = false
  resetForm();
  // formRef.value.resetFields()
};
//添加确定
const addSubmit = () => {
  addFrom.StepList.push(form);
  InsertInspect(addFrom).then((res: any) => {
    // console.log(res);
    if (res.code == 100200) {
      ElNotification({
        title: "添加成功",
        // message: "取消操作",
        type: "success",
      });
      getData()
      addVisible.value = false;
      form.StepItemList =[]
    }
    resetForm();
    addFrom.stepList = [];
  });
  // console.log(form);
};

//编辑
const handleEdit = (row: any) => {
  eidtData(row);
  editVisible.value = true;
};
const eidtCancel = () => {
  editHear.stepList = [];
  editVisible.value = false;
};
const editSubmit = () => {
  editHear.StepList.push(editForm);
  // console.log(JSON.stringify(editHear));
  UpdateInspectData(editHear).then((res:any)=>{
    if (res.code == 100200) {
      ElNotification({
        title: "修改成功",
        // message: "取消操作",
        type: "success",
      });
      getData()
      editVisible.value = false;

    }
    editHear.stepList = [];
  })
};

const eidtData = (row: any) => {
  editHear.Product=row.ProductName
  editHear.WorkSection=row.WorkSection
  editForm.Status = row.Status;
  editForm.Step = row.Step;
  editForm.Name = row.StepName;
  editForm.InspectContent = row.InspectContent;
  editForm.StepItemList[0].SubItem = row.SubItem;
  editForm.StepItemList[0].SubItemAim = row.SubItemAim;
  editForm.StepItemList[0].SubItemBasic = row.SubItemBasic;
  editForm.StepItemList[0].SubItemMethod = row.SubItemMethod;
  editForm.StepItemList[0].SubItemName = row.SubItemName;
  editForm.StepItemList[0].SubItemSolution = row.SubItemSolution;
  editForm.StepItemList[0].SubItemType = row.SubItemType;
};
//删除
const handleDelete = (row: any) => {
  eidtData(row);
  editHear.StepList.push(editForm);
  // deleteForm.stepList.push(editForm);
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      DeleteInspectData(editHear).then((data: any) => {
        // console.log(res);
        if ((data.code = 100200)) {
          getData();
          ElNotification({
            title: "删除成功",
            // message: "取消操作",
            type: "success",
          });
        } else {
          ElNotification({
            title: "删除失败",
            // message: "取消操作",
            type: "error",
          });

        }
      });
    })
    .catch(() => {
      // ElMessage({
      //   type: "info",
      //   message: "取消操作",
      // });
      ElNotification({
        title: "取消操作",
        // message: "取消操作",
        type: "info",
      });
    });
};

//基础数据处理成树形结构
const dispose = (data: any) => {
  const a: InstanceType<typeof FistTableData>[] = [];
  data.InOrList.forEach((item: any) => {
    let isExist = a.findIndex((ela) => ela.Product == item.Product);
    if (isExist != -1) {
      let b = a[isExist].stepItemList.findIndex(
        (t: any) => t.Name == item.Name
      );
      if (b != -1) {
        a[isExist].stepItemList[b].stepItemList.push({
          ...item,
          step1:
            item.Product +
            "-" +
            item.Step +
            "-" +
            (a[isExist].stepItemList[b].stepItemList.length + 1),
        });
      } else {
        a[isExist].stepItemList.push({
          Name: item.Name,
          Step: item.Step,
          InspectContent: item.InspectContent,
          step1: item.Product + "-" + item.Step,
          stepItemList: [
            {
              ...item,
              step1: item.Product + "-" + item.Step + "-" + (isExist + 1),
            },
          ],
        });
      }
    } else {
      let obj: InstanceType<typeof AllInspection> = {
        Product: item.Product,
        step1: item.Product,
        stepItemList: [
          {
            Name: item.Name,
            InspectContent: item.InspectContent,
            Step: item.Step,
            step1: item.Product + "-" + item.Step,
            stepItemList: [],
          },
        ],
      };
      obj.stepItemList[0].stepItemList.push({
        ...item,
        step1:
          item.Product +
          "-" +
          item.Step +
          "-" +
          (obj.stepItemList[0].stepItemList.length + 1),
      });
      a.push(obj);
    }
  });
  tableData.value = a;
  tableData.value.sort((a, b) => {
    return a.Product - b.Product;
  });
  if (tableData.value.length % pageSize.value == 0 && currentPage.value > 1) {
    currentPage.value--;
  }
};

const handleSizeChange = (val: any) => {
  currentPage.value = 1;
  pageSize.value = val;
};
const handleCurrentChange = (val: any) => {
  currentPage.value = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 215;
  });
};
const resetForm = () => {
  form.Step = "";
  form.Status = "I";
  form.Name = "";
  form.InspectContent = "";

  form.StepItemList = form.StepItemList.filter((v: any, i) => i == 0);
  // 重置 stepItemList，这里假设我们只重置第一个对象，或者你可以遍历它们
  form.StepItemList.forEach((item) => {
    item.SubItemName = "";
    item.SubItem = "";
    item.SubItemMethod = "";
    item.SubItemBasic = "";
    item.SubItemSolution = "";
    item.SubItemAim = "";
    item.SubItemType = "";
  });
};
</script>

<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
