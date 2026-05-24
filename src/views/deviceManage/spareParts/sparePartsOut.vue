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
              :shortcuts="shortcuts"
                v-model="dateValue"
                type="daterange"
                range-separator="到"
                 size="small"
                value-format="YYYY-MM-DD"
                @change="dateChange"
              />
            </el-form-item>
            <el-form-item label="出库类型" class="mb-2">
              <el-select
               size="small"
                v-model="searchForm.Type"
                filterable
                style="width: 150px"
                placeholder=""
                clearable
              >
                <el-option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :label="item"
                  :value="`${index}`"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="出库单号" class="mb-2">
              <el-input
               size="small"
                v-model="searchForm.OutstockNo"
                style="width: 240px"
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
        <el-button class="mb-2" type="primary" @click="clearForm(), (addVisible = true)" size="small"
          >新建出库单</el-button
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
          prop="Type"
          align="center"
          label="出库类型"
          :min-width="flexColumnWidth('出库类型', 'Type')"
        >
          <template #default="scope">
            <div v-if="scope.row.Type === '0'">
              <div>领用出库</div>
            </div>
            <div v-if="scope.row.Type === '1'">
              <div>借出出库</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="OutstockNo"
          align="center"
          label="出库单号"
          :min-width="flexColumnWidth('出库单号', 'OutstockNo')"
        >
          <template #default="scope">
            <div text class="underline font-bold text-[#006487]" @click="findDetail(scope.row)" >{{ scope.row.OutstockNo }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="Type" align="center" label="出库类型"> </el-table-column> -->
        <el-table-column
          prop="Department"
          align="center"
          label="使用部门"
          :min-width="flexColumnWidth('使用部门', 'Department')"
        >
        </el-table-column>
        <el-table-column
          prop="LendBy"
          align="center"
          label="借出人"
          :min-width="flexColumnWidth('借出人', 'LendBy')"
        >
        </el-table-column>
        <el-table-column
          prop="LendOn"
          align="center"
          label="借出时间"
          :min-width="flexColumnWidth('借出时间', 'LendOn')"
        >
        </el-table-column>
        <!-- <el-table-column prop="DueDate" align="center" label="到期日期" :min-width="flexColumnWidth('到期日期', 'DueDate')"> </el-table-column> -->
        <el-table-column
          prop="LendReason"
          align="center"
          label="借出原因"
          :min-width="flexColumnWidth('借出原因', 'LendReason')"
        >
        </el-table-column>
        <el-table-column
          prop="ReturnDate"
          align="center"
          label="预计归还日期"
          :min-width="flexColumnWidth('预计归还日期', 'ReturnDate')"
        >
        </el-table-column>
        <el-table-column prop="Status" align="left" label="状态">
          <template #default="scope">
            <div v-if="scope.row.Status === 0">
              <el-tag type="info">待出库</el-tag>
            </div>
            <div v-if="scope.row.Status === 1">
              <el-tag type="primary">出库中</el-tag>
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
            <div class="">
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
              <el-tooltip content="开始出库" placement="top">
                <el-button
                  type="warning"
                  icon="VideoPlay"
                  color="#409EFF"
                  style="color: #fff"
                  size="small"
                  @click="showInForm(scope.row)"
                  :disabled="scope.row.Status === 2"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="完成出库" placement="top">
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
          :page-sizes="[5, 10,30, 20, 50, 100]"
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
        <el-form-item label="出库单号">
          <el-input
            v-model="EditForm.OutstockNo"
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
        <el-form-item label="使用部门">
          <el-input v-model="EditForm.Department" style="width: 250px" />
        </el-form-item>
        <el-form-item label="借出人">
          <el-input
            v-model="EditForm.LendBy"
            style="width: 250px"
            :disabled="EditForm.Type !== '1'"
          />
        </el-form-item>
        <el-form-item label="借出日期">
          <el-date-picker
            v-model="EditForm.LendOn"
            type="datetime"
            style="width: 250px"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled="EditForm.Type !== '1'"
          />
        </el-form-item>
        <el-form-item label="借出原因">
          <el-input
            v-model="EditForm.LendReason"
            style="width: 250px"
            :disabled="EditForm.Type !== '1'"
          />
        </el-form-item>
        <el-form-item label="预计归还日期">
          <el-date-picker
            v-model="EditForm.ReturnDate"
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
      title="新建出库单"
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
        <el-form-item label="使用部门">
          <el-input v-model="form.Department" style="width: 250px" />
        </el-form-item>
        <el-form-item label="借出人">
          <el-input
            v-model="form.LendBy"
            style="width: 250px"
            :disabled="form.Type !== 1"
          />
        </el-form-item>
        <el-form-item label="借出原因">
          <el-input
            v-model="form.LendReason"
            style="width: 250px"
            :disabled="form.Type !== 1"
          />
        </el-form-item>
        <el-form-item label="借出日期">
          <el-date-picker
            v-model="form.LendOn"
            type="datetime"
            style="width: 250px"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled="form.Type !== 1"
          />
        </el-form-item>
        <el-form-item label="预计归还日期">
          <el-date-picker
            v-model="form.ReturnDate"
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
      title="确认出库"
      width="400px"
    >
      <!-- <el-form
        ref="inFormRef"
        :model="inForm"
        label-position="left"
        label-width="100"
        :inline="true"
      >
      <el-form-item label="库存数量" prop="StockID">
          <el-input v-model="QTY" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="出库数量" prop="Qty">
          <el-input v-model="inForm.Qty" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="备件名称" prop="StockID">
          <el-input v-model="inFormPartName" style="width: 250px" disabled />
        </el-form-item>
      </el-form> -->

      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
          <el-button @click="InVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="partOut(), (InVisible = false)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      align-center
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="LedgerVisible"
      @close="inFormClose"
      title="开始出库"
      width="80%"
    >
      <!-- <table-tem
        size="small"
        :showSelect="true"
        :show-index="true"
        :tableData="LedgerTableData"
        :tableHeight="500"
        :columnData="LedgerColumnData"
        :pageObj="LedgerPageObj"
        @handleSizeChange="LedgerSizeChange"
        @handleCurrentChange="LedgerCurrentChange"
        @handleSelectionChange="LedgerSelectionChange"
      ></table-tem> -->
      <el-table
        ref="LedgerTableRef"
        border
        size="small"
        :data="
          LedgerTableData.slice(
            (LedgerPageObj.currentPage - 1) * LedgerPageObj.pageSize,
            LedgerPageObj.currentPage * LedgerPageObj.pageSize
          )
        "
        :height="500"
        center
        stripe
        @selection-change="LedgerSelectionChange"
        @select="select"
      >
        <el-table-column type="selection" fixed width="55" align="center" />
        <el-table-column prop="OutstockNo" align="center" label="备件编号">
        </el-table-column>
        <el-table-column prop="Qty" align="center" label="库存数量">
        </el-table-column>
        <el-table-column prop="PurchaseNo" align="center" label="采购单">
        </el-table-column>
        <el-table-column prop="Description" align="center" label="描述">
        </el-table-column>
        <el-table-column prop="DueDate" align="center" label="到期日期">
        </el-table-column>
        <el-table-column prop="Vendor" align="center" label="供应商">
        </el-table-column>
        <el-table-column prop="Manufacturer" align="center" label="制造商">
        </el-table-column>
        <el-table-column prop="Specification" align="center" label="规格型号">
        </el-table-column>
        <el-table-column prop="StorageLocation" align="center" label="存储位置">
        </el-table-column>
        <el-table-column prop="qty" align="center" label="去出数量" width="240">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.qty"
              :min="1"
              :max="scope.row.Qty"
            ></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-3">
        <el-pagination
          size="large"
          background
          @size-change="LedgerSizeChange"
          @current-change="LedgerCurrentChange"
          :current-page="LedgerPageObj.currentPage"
          :page-size="LedgerPageObj.pageSize"
          :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="LedgerTableData.length"
        >
        </el-pagination>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
          <el-button @click="inFormClose()"> 取消 </el-button>
          <el-button type="primary" @click="startPartOut"> 确定 </el-button>
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
        <el-form-item label="出库类型" prop="TypeName">
          <el-input v-model="detailForm.TypeName" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="出库单号" prop="OutstockNo">
          <el-input v-model="detailForm.OutstockNo" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="使用部门" prop="Department">
          <el-input v-model="detailForm.Department" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="借出人" prop="LendBy">
          <el-input v-model="detailForm.LendBy" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="借出时间" prop="LendOn">
          <el-input v-model="detailForm.LendOn" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="借出原因" prop="LendReason">
          <el-input v-model="detailForm.LendReason" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="预计归还日期" prop="ReturnDate">
          <el-input v-model="detailForm.ReturnDate" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="状态" prop="OutStockStatus">
          <el-input v-model="detailForm.OutStockStatus" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="创建人" prop="CreatedBy">
          <el-input v-model="detailForm.CreatedBy" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="创建日期" prop="CreatedOn">
          <el-input v-model="detailForm.CreatedOn" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="备注" prop="Remark">
          <el-input v-model="detailForm.Remark" style="width: 250px" disabled />
        </el-form-item>
      </el-form>

      
      <table-tem
                :tableData="detailTable"
                :tableHeight="400"
                :columnData="columnData"
                :pageObj="detailPageObj"
                @handleSizeChange="handleSizeChange1"
                @handleCurrentChange="handleCurrentChange1"
              ></table-tem>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import {
  GetPartsOutList,
  findChkOutParameter,
  PartsOutAdd,
  deletePartsOut,
  updatePartsOut,
  StartPartsOut,
  EndPartsOut,
  GetPartsList,
  GetPartsStockList,
  findOutParameter,
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
  Department: string;
  LendOn: string;
  LendBy: string;
  LendReason: string;
  ReturnDate: string;
  Remark: string;
  CreatedBy: string;
}

interface EditFormTS {
  Chkout_sht: string;
  Type: string;
  OutstockNo: string;
  Department: string;
  LendOn: string;
  LendBy: string;
  LendReason: string;
  ReturnDate: string;
  Remark: string;
  UpdateBy: string;
}

interface inFormTS {
  Chkout_sht: string;
  StockID: string;
  PartID: string;
  Qty: number;
  CreatedBy: string;
}

interface SearchFormTS {
  OutstockNo: string;
  StartDate: string;
  EndDate: string;
  Type: string;
}

interface detailFormTS {
  TypeName:string;
  OutstockNo:string;
  Department:string;
  LendBy:string;
  LendOn:string;
  LendReason:string;
  ReturnDate:string;
  OutStockStatus:string;
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
const LedgerVisible = ref(false);
const detailVisible = ref(false);
const detailTable = ref<any[]>([]);
const inFormRef = ref();
const inFormPartName = ref("");
const LedgerTableData = ref<any[]>([]);
const choiceList = ref<any[]>([]);
const QTY = ref("");
const tableData1 = ref<any[]>([]);
const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});
const LedgerPageObj = ref({
  pageSize: 30,
  currentPage: 1,
});
const detailPageObj = ref({
  pageSize: 30,
  currentPage: 1,
});
const typeList = ["领用", "借出"];
const loginName = userStore.getUserInfo;
const LedgerTableRef = ref();

// watch(formControl, (newVal, oldVal) => {
//   UsesUntilRevalidation = ''
//     });

const tableData = ref([]);
const PartList = ref<any[]>([]);

const form = ref<formTS>({
  Type: 0,
  Department: "",
  LendOn: "",
  LendBy: "",
  LendReason: "",
  ReturnDate: "",
  Remark: "",
  CreatedBy: loginName,
});

const EditForm = ref<EditFormTS>({
  Chkout_sht: "",
  Type: "",
  OutstockNo: "",
  Department: "",
  LendOn: "",
  LendBy: "",
  LendReason: "",
  ReturnDate: "",
  Remark: "",
  UpdateBy: loginName,
});

const inForm = ref<inFormTS>({
  Chkout_sht: "",
  StockID: "",
  PartID: "",
  Qty: 1,
  CreatedBy: loginName,
});

const searchForm = ref<SearchFormTS>({
  OutstockNo: "",
  StartDate: "",
  EndDate: "",
  Type: "",
});

const detailForm = ref<detailFormTS>({
  TypeName:'',
  OutstockNo:'',
  Department:'',
  LendBy:'',
  LendOn:'',
  LendReason:'',
  ReturnDate:'',
  OutStockStatus:'',
  CreatedBy:'',
  CreatedOn:'',
  Remark:'',
});

const editSubmit = (data: any) => {
  console.log(data.ReturnOn);
  EditForm.value.Chkout_sht = data.Chkout_sht;
  EditForm.value.Type = data.Type;
  EditForm.value.OutstockNo = data.OutstockNo;
  EditForm.value.Department = data.Department;
  EditForm.value.LendBy = data.LendBy;
  EditForm.value.LendOn = data.LendOn;
  EditForm.value.LendReason = data.LendReason;
  EditForm.value.ReturnDate = data.ReturnDate;
  EditForm.value.Remark = data.Remark;
  editVisible.value = true;
};

interface toolType {
  Text: string;
  Value: string;
}

const findDetail = (data: any) => {
  findOutParameter(data.Chkout_sht).then((res: any) => {
    if (res && res.content && res.content.length > 0) {
      detailVisible.value = true;
      // const obj = res.content[0];
      detailTable.value = res.content;
      detailForm.value.TypeName = data.TypeName;
      detailForm.value.OutstockNo = data.OutstockNo;
      detailForm.value.Department = data.Department;
      detailForm.value.LendBy = data.LendBy;
      detailForm.value.LendOn = data.LendOn;
      detailForm.value.LendReason = data.LendReason;
      detailForm.value.ReturnDate = data.ReturnDate;
      detailForm.value.OutStockStatus = data.OutStockStatus;
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
  OutstockNo:'',
  Department:'',
  LendBy:'',
  LendOn:'',
  LendReason:'',
  ReturnDate:'',
  OutStockStatus:'',
  CreatedBy:'',
  CreatedOn:'',
  Remark:'',
};
    }
  });
};

const MaterialNameList = ref<toolType[]>([]);

const clearForm = () => {
  form.value = {
    Type: 0,
    Department: "",
    LendOn: "",
    LendBy: "",
    LendReason: "",
    ReturnDate: "",
    Remark: "",
    CreatedBy: loginName,
  };
};

const inFormClose = () => {
  // inFormRef.value.resetFields();
  // InVisible.value = false;
  LedgerVisible.value = false;
  inForm.value.CreatedBy = loginName;
};

const clearEditForm = () => {
  EditForm.value = {
    Chkout_sht: "",
    Type: "",
    OutstockNo: "",
    Department: "",
    LendOn: "",
    LendBy: "",
    LendReason: "",
    ReturnDate: "",
    Remark: "",
    UpdateBy: loginName,
  };
};

const typeChange = () => {
  form.value = {
    Type: form.value.Type,
    Department: "",
    LendOn: "",
    LendBy: "",
    LendReason: "",
    ReturnDate: "",
    Remark: "",
    CreatedBy: loginName,
  };
};

const showInForm = (data: any) => {
  // if (data.Status !== 0) {
  //   ElNotification({
  //     title: "该项正在出库",
  //     // message: "取消操作",
  //     type: "warning",
  //   });
  //   return;
  // }
  GetList();
  LedgerVisible.value = true;
  inForm.value.Chkout_sht = data.Chkout_sht;
  // inForm.value.Qty = 1;
  console.log(inForm.value);
};

//查询所有
const getData = () => {
  GetPartsOutList({}).then((res: any) => {
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

const startPartOut = () => {
  // InVisible.value = false;
  // StartPartsOut(inForm.value).then((res: any) => {
  //   if (res && res.success) {
  //     ElNotification({
  //       title: res.msg,
  //       // message: "取消操作",
  //       type: "success",
  //     });
  //     getData();
  //   }
  // });
  if (choiceList.value.length !== 1) {
    ElNotification({
      title: "提示信息",
      message: "只允许选中一条数据",
      type: "warning",
    });
    LedgerTableRef.value.clearSelection();
    return;
  }
  // console.log(inForm.value.Qty);

  if (!inForm.value.Qty) {
    ElNotification({
      title: "提示信息",
      message: "请输入数量",
      type: "warning",
    });
    return;
  }
  // LedgerVisible.value = false;
  InVisible.value = true;
  inForm.value.PartID = choiceList.value[0].PartID;
  inForm.value.Qty = choiceList.value[0].qty;
  inForm.value.StockID = choiceList.value[0].StockID;
  QTY.value = choiceList.value[0].Qty;
  inFormPartName.value = choiceList.value[0].PartName;
};

const partOut = () => {
  LedgerVisible.value = false;
  StartPartsOut(inForm.value).then((res: any) => {
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
  GetPartsStockList({}).then((res: any) => {
    if (res && res.success && res.content.length !== 0) {
      LedgerTableData.value = res.content.filter(
        (item: any) => item.Status === 1
      );
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
  GetPartsOutList(searchForm.value).then((res: any) => {
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
  //   deleteChoice.value = data.CompName;
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deletePartsOut(data.Chkout_sht, loginName).then((data: any) => {
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
  ElMessageBox.confirm("完成出库", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      EndPartsOut(data.Chkout_sht, loginName).then((data: any) => {
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

const LedgerSelectionChange = (data: any, p: any) => {
  choiceList.value = data;
  console.log(data);
};

const select = (selection: any, row: any) => {
  if (selection.length > 1) {
    let del_row = selection.shift();
    LedgerTableRef.value.toggleRowSelection(del_row, false); // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）；第二个参数为true时又变成了多选
  }
};

const addData = () => {
  PartsOutAdd(form.value).then((res: any) => {
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
  updatePartsOut(EditForm.value).then((res: any) => {
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
    prop: "OutstockNo",
    label: "出库单号",
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
    label: "出库人",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CreatedOn",
    label: "出库时间",
    width: "",
    min: true,
    align: "center",
  },
]);

// const LedgerColumnData = reactive([
//   {
//     text: true,
//     prop: "PartNumber",
//     label: "备件编号",
//     width: "",
//     min: true,
//     align: "center",
//   },
//   {
//     text: true,
//     prop: "Qty",
//     label: "数量",
//     width: "",
//     min: true,
//     align: "center",
//   },
//   {
//     text: true,
//     prop: "PurchaseNo",
//     label: "采购单",
//     width: "",
//     min: true,
//     align: "center",
//   },
//   {
//     text: true,
//     prop: "Description",
//     label: "描述",
//     width: "",
//     min: true,
//     align: "center",
//   },
//   // {
//   //   text: false,
//   //   tag: true,
//   //   tagType: "number",
//   //   tagItem: [
//   //     { text: "待入库", type: "primary", number: 0 },
//   //     { text: "入库中", type: "primary", number: 1 },
//   //     { text: "已完成", type: "primary", number: 2 },
//   //   ],
//   //   prop: "Status",
//   //   label: "状态",
//   //   width: "80",
//   //   min: true,
//   //   align: "center",
//   // },
//   {
//     text: true,
//     prop: "DueDate",
//     label: "到期日期",
//     width: "",
//     min: true,
//     align: "center",
//   },
//   {
//     text: true,
//     prop: "Vendor",
//     label: "供应商",
//     width: "",
//     min: true,
//     align: "center",
//   },
//   {
//     text: true,
//     prop: "Manufacturer",
//     label: "制造商",
//     width: "",
//     min: true,
//     align: "center",
//   },
//   {
//     text: true,
//     prop: "Specification",
//     label: "规格型号",
//     width: "",
//     min: true,
//     align: "center",
//   },
//   {
//     text: true,
//     prop: "StorageLocation",
//     label: "存储位置",
//     width: "",
//     min: true,
//     align: "center",
//   },
//   {
//     text: true,
//     prop: "CreatedOn",
//     label: "创建日期",
//     width: "",
//     min: true,
//     align: "center",
//   },
//   {
//     text: true,
//     prop: "CreatedBy",
//     label: "创建人",
//     width: "",
//     min: true,
//     align: "center",
//   },
// ]);

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
  detailPageObj.value.currentPage = 1;
  detailPageObj.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
  detailPageObj.value.currentPage = val;
};

const LedgerSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const LedgerCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
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

<style scoped lang="scss">
// 隐藏全选按钮
::v-deep .el-table__header-wrapper {
  .el-checkbox__inner {
    display: none;
  }
}
</style>
