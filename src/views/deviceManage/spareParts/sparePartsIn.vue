<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between items-center">
        <div class="flex">
          <!-- <el-input
            v-model="inputValue"
            style="width: 240px"
            placeholder="请输入"
            clearable
          ></el-input> -->
          <el-form ref="formRef" class="form" :inline="true" label-width="">
            <el-form-item label="时间" class="mb-2">
              <el-date-picker
               size="small"
              :shortcuts="shortcuts"
                v-model="dateValue"
                type="daterange"
                range-separator="-"
                value-format="YYYY-MM-DD"
                @change="dateChange"
              />
            </el-form-item>
            <el-form-item label="入库类型" class="mb-2">
              <el-select
               size="small"
                v-model="searchForm.Type"
                filterable
                style="width: 150px"
                clearable
                placeholder=""
              >
                <el-option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :label="item"
                  :value="`${index}`"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="入库单号" class="mb-2">
              <el-input
               size="small"
                v-model="searchForm.InstockNo"
                style="width: 240px"
                placeholder=""
                clearable
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
                            <el-button type="primary" icon="Search" @click="serachData"></el-button> </template></el-input> -->
        </div>
        <el-button class="mb-2"
          type="primary"
          @click="clearForm(), (addVisible = true), GetList()" size="small"
          >新建入库单</el-button
        >
      </div>
      <!-- <table-tem
        size="small"
        :show-index="true"
        :tableData="tableData"
        :tableHeight="tableHeight"
        :columnData="columnData"
        :pageObj="pageObj"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-tem> -->
      <el-table
        border
        size="small"
        :data="
          tableData.slice(
            (pageObj.currentPage - 1) * pageObj.pageSize,
            pageObj.currentPage * pageObj.pageSize
          )
        "
        :height="tableHeight"
        center
        stripe
      >
        <el-table-column
          prop="TypeName"
          align="center"
          label="入库类型"
          :min-width="flexColumnWidth('入库类型', 'TypeName')"
        >
        </el-table-column>
        <el-table-column
          prop="InstockNo"
          align="center"
          label="入库单号"
          :min-width="flexColumnWidth('入库单号', 'InstockNo')"
        >
          <template #default="scope">
            <div @click="findDetail(scope.row)" text class="underline font-bold text-[#006487]" >
              {{ scope.row.InstockNo }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="PurchaseNo"
          align="center"
          label="采购单号"
          :min-width="flexColumnWidth('采购单号', 'PurchaseNo')"
        >
        </el-table-column>
        <el-table-column
          prop="OutstockNo"
          align="center"
          label="出库单号"
          :min-width="flexColumnWidth('出库单号', 'OutstockNo')"
        >
        </el-table-column>
        <!-- <el-table-column prop="LendID" align="center" label="借出编号"> </el-table-column> -->
        <el-table-column
          prop="ReturnBy"
          align="center"
          label="归还人"
          :min-width="flexColumnWidth('归还人', 'ReturnBy')"
        >
        </el-table-column>
        <el-table-column prop="ReturnDate" align="left" label="状态">
          <template #default="scope">
            <div v-if="scope.row.Status === 0">
              <el-tag type="info">待入库</el-tag>
            </div>
            <div v-if="scope.row.Status === 1">
              <el-tag type="primary">入库中</el-tag>
            </div>
            <div v-if="scope.row.Status === 2">
              <el-tag type="success">已完成</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="CreatedBy"
          align="center"
          label="创建人"
          :min-width="flexColumnWidth('创建人', 'CreatedBy')"
        >
        </el-table-column>
        <el-table-column
          prop="CreatedOn"
          align="center"
          label="创建时间"
          :min-width="flexColumnWidth('创建时间', 'CreatedOn')"
        >
        </el-table-column>
        <el-table-column
          prop="Remark"
          align="center"
          label="备注"
          :min-width="flexColumnWidth('备注', 'Remark')"
        >
        </el-table-column>
        <el-table-column
          prop="ReturnDate"
          fixed="right"
          align="center"
          label="操作"
          width="200"
        >
          <template #default="scope">
            <div class="w-full">
              <el-tooltip content="编辑" placement="top">
                <el-button
                  type="primary"
                  icon="EditPen"
                  size="small"
                  @click="editSubmit(scope.row)"
                  :disabled="scope.row.Status !== 0"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  type="danger"
                  icon="Delete"
                  size="small"
                  @click="deleteSubmit(scope.row)"
                  :disabled="scope.row.Status !== 0"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="开始入库" placement="top">
                <el-button
                  type="warning"
                  icon="VideoPlay"
                  color="#409EFF"
                  style="color: #fff"
                  size="small"
                  @click="showInForm(scope.row)"
                  :disabled="scope.row.Status !== 0"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="完成入库" placement="top">
                <el-button
                  type="success"
                  icon="CircleCheck"
                  size="small"
                  @click="inPartSubmit(scope.row)"
                  :disabled="scope.row.Status !== 1"
                ></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-2">
        <el-pagination
         
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageObj.currentPage"
          :page-size="pageObj.pageSize"
          :page-sizes="[10, 30, 50, 100, 150]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
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
        ref="editFormRef"
        :model="EditForm"
        label-position="left"
        label-width="auto"
        :inline="true"
      >
        <el-form-item label="入库单号">
          <el-input
            v-model="EditForm.InstockNo"
            style="width: 250px"
            disabled
          />
        </el-form-item>
        <!-- <el-form-item label="采购单号">
          <el-input
            v-model="EditForm.PurchaseNo"
            style="width: 250px"
            :disabled="EditForm.Type !== '0'"
          />
        </el-form-item> -->
        <el-form-item label="出库单号">
          <el-input
            v-model="EditForm.OutstockNo"
            style="width: 250px"
            :disabled="EditForm.Type !== '1' && EditForm.Type !== '2'"
          />
        </el-form-item>
        <el-form-item label="归还人">
          <el-input
            v-model="EditForm.ReturnBy"
            style="width: 250px"
            :disabled="EditForm.Type !== '1'"
          />
        </el-form-item>
        <el-form-item label="预计归还日期">
          <el-date-picker
            v-model="EditForm.ReturnOn"
            type="datetime"
            style="width: 250px"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled="EditForm.Type !== '1'"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="EditForm.Remark" style="width: 250px" />
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
      title="新建入库单"
      width="50%"
    >
      <el-form
        ref="formRef"
        :model="form"
        label-position="left"
        label-width="auto"
        :inline="true"
      >
        <el-form-item label="类别">
          <el-select
            v-model="form.Type"
            filterable
            style="width: 250px"
            @change="typeChange()"
          >
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="采购单号">
          <el-input
            v-model="form.PurchaseNo"
            style="width: 250px"
            :disabled="form.Type !== 0"
          />
        </el-form-item>
        <!-- <el-form-item label="入库单号">
          <el-input
            v-model="form.InstockNo"
            style="width: 250px"
            :disabled="form.Type !== 2"
          />
        </el-form-item> -->
        <el-form-item label="出库单号">
          <el-input
            v-model="form.OutstockNo"
            style="width: 250px"
            :disabled="form.Type !== 1 && form.Type !== 2"
          />
        </el-form-item>
        <el-form-item label="归还人">
          <el-input
            v-model="form.ReturnBy"
            style="width: 250px"
            :disabled="form.Type !== 1"
          />
        </el-form-item>
        <el-form-item label="预计归还日期">
          <el-date-picker
            v-model="form.ReturnOn"
            type="datetime"
            style="width: 250px"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled="form.Type !== 1"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.Remark" style="width: 250px" />
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
    <el-dialog
      align-center
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="InVisible"
      @close="inFormClose"
      title="开始入库"
      width="50%"
    >
      <el-form
        ref="inFormRef"
        :model="inForm"
        label-position="left"
        label-width="100"
        :inline="true"
      >
        <el-form-item label="备件名称" prop="PartID">
          <el-select
            v-model="inForm.PartID"
            filterable
            placeholder=""
            style="width: 250px"
          >
            <el-option
              v-for="item in PartList"
              :key="item.PartID"
              :label="item.PartName"
              :value="item.PartID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入库数量" prop="Qty">
          <el-input-number v-model="inForm.Qty" :min="1" style="width: 250px" />
        </el-form-item>
        <el-form-item label="批次号" prop="PartNumber">
          <el-input
            v-model="inForm.PartNumber"
            style="width: 250px"
            :disabled="inFormType !== '0'"
          />
        </el-form-item>
        <el-form-item label="到期日期" prop="DueDate">
          <el-date-picker
            v-model="inForm.DueDate"
            type="datetime"
            style="width: 250px"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled="inFormType !== '0'"
          />
        </el-form-item>
        <el-form-item label="资产编号" prop="AssetNumber">
          <el-input
            v-model="inForm.AssetNumber"
            style="width: 250px"
            :disabled="inFormType !== '0'"
          />
        </el-form-item>
        <el-form-item label="供应商" prop="Vendor">
          <el-input
            v-model="inForm.Vendor"
            style="width: 250px"
            :disabled="inFormType !== '0'"
          />
        </el-form-item>
        <el-form-item label="制造商" prop="Manufacturer">
          <el-input
            v-model="inForm.Manufacturer"
            style="width: 250px"
            :disabled="inFormType !== '0'"
          />
        </el-form-item>
        <el-form-item label="规格" prop="Specification">
          <el-input
            v-model="inForm.Specification"
            style="width: 250px"
            :disabled="inFormType !== '0'"
          />
        </el-form-item>
        <el-form-item label="库存位置" prop="StorageLocation">
          <el-input
            v-model="inForm.StorageLocation"
            style="width: 250px"
            :disabled="inFormType !== '0'"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
          <el-button @click="inFormClose()"> 取消 </el-button>
          <el-button type="primary" @click="startPartIn"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      align-center
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="detailVisible"
      @close="inFormClose"
      title="详细信息"
      width="1200"
    >
      <el-form
        ref="inFormRef"
        :model="inForm"
        label-position="left"
        label-width="100"
        :inline="true"
      >
        <el-form-item label="入库类型" prop="PartName">
          <el-input v-model="detailForm.TypeName" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="入库单号" prop="PartDesc">
          <el-input v-model="detailForm.InstockNo" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="采购单号" prop="ClassName">
          <el-input v-model="detailForm.PurhaseNo" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="出库单号" prop="ClassDesc">
          <el-input v-model="detailForm.OutstockNo" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="归还人" prop="Qty">
          <el-input v-model="detailForm.ReturnBy" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="状态" prop="InStockStatus">
          <el-input v-model="detailForm.InStockStatus" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="创建人" prop="ReturnQty">
          <el-input v-model="detailForm.CreatedBy" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="创建时间" prop="Vendor">
          <el-input v-model="detailForm.CreatedOn" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="备注" prop="Manufacturer">
          <el-input v-model="detailForm.Remark" style="width: 250px" disabled />
        </el-form-item>
      </el-form>
      
      <table-tem
                :tableData="detailTable"
                :tableHeight="400"
                :columnData="columnData"
                :pageObj="pageObj1"
                @handleSizeChange="handleSizeChange1"
                @handleCurrentChange="handleCurrentChange1"
              ></table-tem>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="inFormClose()"> 取消 </el-button>
          <el-button type="primary" @click="startPartIn"> 确定 </el-button>
        </span>
      </template> -->
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import {
  GetPartInList,
  findChkInParameter,
  updatePartsIn,
  deletePartsInData,
  PartsInAdd,
  StartPartsIn,
  EndPartsIn,
  GetPartsList,
  findInParameter,
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
import {shortcuts,setTodayDate,setLastDate} from "@/utils/dataMenu"

const userStore = useUserStoreWithOut();

interface formTS {
  Type: number;
  InstockNo: string;
  PurchaseNo: string;
  OutstockNo: string;
  ReturnBy: string;
  ReturnOn: string;
  Remark: string;
  CreatedBy: string;
}

interface EditFormTS {
  Chkin_sht: string;
  Type: string;
  InstockNo: string;
  PurchaseNo: string;
  OutstockNo: string;
  ReturnBy: string;
  ReturnOn: string;
  Remark: string;
  UpdateBy: string;
}

interface inFormTS {
  Chkin_sht: string;
  PartID: string;
  Qty: number;
  PartNumber: string;
  DueDate: string;
  AssetNumber: string;
  Vendor: string;
  Manufacturer: string;
  Specification: string;
  StorageLocation: string;
  CreatedBy: string;
}

interface SearchFormTS {
  InstockNo: string;
  StartDate: string;
  EndDate: string;
  Type: string;
}

interface detailFormTS {
  TypeName:string;
  InstockNo:string;
  PurhaseNo:string;
  OutstockNo:string;
  ReturnBy:string;
  InStockStatus:string;
  CreatedBy:string;
  CreatedOn:string;
  Remark:string;
}

//   const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const InVisible = ref(false);
const editVisible = ref(false);
const dateValue = ref<any[]>([]);
const detailVisible = ref(false);
const detailTable = ref<any[]>([]);
const deleteChoice = ref("");
const inFormRef = ref();
const inFormType = ref("");
const tableData1 = ref<any[]>([]);
const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});
const pageObj1 = ref({
  pageSize: 30,
  currentPage: 1,
});
const typeList = ["采购入库", "归还入库", "维修入库"];
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
const PartList = ref<any[]>([]);

const form = ref<formTS>({
  Type: 0,
  InstockNo: "",
  PurchaseNo: "",
  OutstockNo: "",
  ReturnBy: "",
  ReturnOn: "",
  Remark: "",
  CreatedBy: loginName,
});

const EditForm = ref<EditFormTS>({
  Chkin_sht: "",
  Type: "0",
  InstockNo: "",
  PurchaseNo: "",
  OutstockNo: "",
  ReturnBy: "",
  ReturnOn: "",
  Remark: "",
  UpdateBy: loginName,
});

const inForm = ref<inFormTS>({
  Chkin_sht: "",
  PartID: "",
  Qty: 0,
  PartNumber: "",
  DueDate: "",
  AssetNumber: "",
  Vendor: "",
  Manufacturer: "",
  Specification: "",
  StorageLocation: "",
  CreatedBy: loginName,
});

const searchForm = ref<SearchFormTS>({
  InstockNo: "",
  StartDate: "",
  EndDate: "",
  Type: "",
});

const detailForm = ref<detailFormTS>({
  TypeName:'',
  InstockNo:'',
  PurhaseNo:'',
  OutstockNo:'',
  ReturnBy:'',
  InStockStatus:'',
  CreatedBy:'',
  CreatedOn:'',
  Remark:''
});

const editSubmit = (data: any) => {
  console.log(data.ReturnOn);
  EditForm.value.Chkin_sht = data.Chkin_sht;
  EditForm.value.Type = data.Type;
  EditForm.value.InstockNo = data.InstockNo;
  EditForm.value.PurchaseNo = data.PurchaseNo;
  EditForm.value.OutstockNo = data.OutstockNo;
  EditForm.value.Remark = data.Remark;
  EditForm.value.ReturnBy = data.ReturnBy;
  EditForm.value.ReturnOn = data.ReturnOn;
  editVisible.value = true;
};

interface toolType {
  Text: string;
  Value: string;
}

const findDetail = (data: any) => {
  findInParameter(data.Chkin_sht).then((res: any) => {
    if (res && res.content && res.content.length > 0) {
      detailVisible.value = true
      // const obj = res.content[0];
      console.log(data);
      detailTable.value = res.content;
      detailForm.value.TypeName = data.TypeName;
      detailForm.value.InstockNo = data.InstockNo;
      detailForm.value.PurhaseNo = data.PurchaseNo;
      detailForm.value.OutstockNo = data.OutstockNo;
      detailForm.value.ReturnBy = data.ReturnBy;
      detailForm.value.InStockStatus = data.InStockStatus;
      detailForm.value.CreatedBy = data.CreatedBy;
      detailForm.value.CreatedOn = data.CreatedOn;
      detailForm.value.Remark = data.Remark;
    } else if (res.content.length === 0) {
      ElNotification({
        title: "提示信息",
        message: "未查询到此项详细信息或信息为空",
        type: "warning",
      });
      detailForm.value = {
  TypeName:'',
  InstockNo:'',
  PurhaseNo:'',
  OutstockNo:'',
  ReturnBy:'',
  InStockStatus:'',
  CreatedBy:'',
  CreatedOn:'',
  Remark:''
};
    }
  });
};

const MaterialNameList = ref<toolType[]>([]);

const clearForm = () => {
  form.value = {
    Type: 0,
    InstockNo: "",
    PurchaseNo: "",
    OutstockNo: "",
    ReturnBy: "",
    ReturnOn: "",
    Remark: "",
    CreatedBy: loginName,
  };
};

const inFormClose = () => {
  inFormRef.value.resetFields();
  InVisible.value = false;
};

const clearEditForm = () => {
  EditForm.value = {
    Chkin_sht: "",
    Type: "0",
    InstockNo: "",
    PurchaseNo: "",
    OutstockNo: "",
    ReturnBy: "",
    ReturnOn: "",
    Remark: "",
    UpdateBy: loginName,
  };
};

const typeChange = () => {
  form.value = {
    Type: form.value.Type,
    InstockNo: "",
    PurchaseNo: "",
    OutstockNo: "",
    ReturnBy: "",
    ReturnOn: "",
    Remark: "",
    CreatedBy: loginName,
  };
};

const showInForm = (data: any) => {
  if (data.Status !== 0) {
    ElNotification({
      title: "提示信息",
      message: "该项开始入库已完成",
      type: "warning",
    });
    return;
  }
  GetList();
  InVisible.value = true;
  inForm.value.Chkin_sht = data.Chkin_sht;
  inFormType.value = data.Type;
  console.log(inForm.value);
};

const getData = () => {
  GetPartInList({}).then((res: any) => {
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

const startPartIn = () => {
  InVisible.value = false;
  StartPartsIn(inForm.value).then((res: any) => {
    if (res && res.success) {
      ElNotification({
        title: '提示信息',
        message: res.msg,
        type: "success",
      });
      getData();
    }
  });
};

const GetList = () => {
  GetPartsList({}).then((res: any) => {
    if (res && res.success && res.content.length !== 0) {
      PartList.value = res.content;
      // ElNotification({
      //   title: res.msg,
      //   // message: "取消操作",
      //   type: "success",
      // });
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
  GetPartInList(searchForm.value).then((res: any) => {
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

const deleteSubmit = (data: any) => {
  //   deleteVisible.value = true;
  deleteChoice.value = data.CompName;
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deletePartsInData(data.Chkin_sht, loginName).then((data: any) => {
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

const PartIDChoice = (data: any) => {
  PartList.value.forEach((element) => {
    if (data === element.PartID) {
      console.log(element);
    }
  });
};

const inPartSubmit = (data: any) => {
  //   deleteVisible.value = true;
  ElMessageBox.confirm("确定入库", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      EndPartsIn(data.Chkin_sht, loginName).then((data: any) => {
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

const addData = () => {
  PartsInAdd(form.value).then((res: any) => {
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

const editData = () => {
  updatePartsIn(EditForm.value).then((res: any) => {
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
    prop: "PartDesc",
    label: "备件描述",
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
    prop: "InstockNo",
    label: "入库单号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "PartNumber",
    label: "批次号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Qty",
    label: "库存数量",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "DueDate",
    label: "到期日期",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "AssetNumber",
    label: "资产编号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Vendor",
    label: "供应商",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Manufacturer",
    label: "制造商",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Specification",
    label: "规格型号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "StorageLocation",
    label: "库存位置",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CreatedBy",
    label: "入库人",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CreatedOn",
    label: "入库时间",
    width: "",
    min: true,
    align: "center",
  },
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

const handleSizeChange1 = (val: any) => {
  pageObj1.value.currentPage = 1;
  pageObj1.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
  pageObj1.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 194;
  });
};

//el-table自动计算宽度
const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  return getMaxLength(arr) + 25 + "px";
};

const getMaxLength = (arr: any) => {
  return arr.reduce((acc: any, item: any) => {
    if (item) {
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
