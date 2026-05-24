<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div ref="headerRef">
        <el-form
          ref="formRef"
          class="form"
          :inline="true"
          size="small"
          label-width="85px"
        >
          <!-- <div>
            </div> -->
          <el-form-item label="生产计划号">
            <el-input v-model="testValue" class="input-with-select"> </el-input>
          </el-form-item>
          <el-form-item label="领料单">
            <el-input v-model="testValue" class="input-with-select"> </el-input>
          </el-form-item>
          <el-form-item label="拣货单">
            <el-input v-model="testValue" class="input-with-select"> </el-input>
          </el-form-item>
          <el-form-item label="客户编码">
            <el-input v-model="testValue" class="input-with-select"> </el-input>
          </el-form-item>
          <el-form-item label="PCB料号">
            <el-input v-model="testValue" class="input-with-select"> </el-input>
          </el-form-item>
          <el-form-item label="产品型号">
            <el-input v-model="testValue" class="input-with-select"> </el-input>
          </el-form-item>
          <el-form-item label="部门编号">
            <el-input v-model="testValue" class="input-with-select"> </el-input>
          </el-form-item>
          <el-form-item label="线体">
            <el-input v-model="testValue" class="input-with-select"> </el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="testValue"
              placeholder="Select"
              style="width: 152.4px"
            >
              <el-option
                v-for="item in ['测试']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="单据类型">
            <el-select
              v-model="testValue"
              placeholder="Select"
              style="width: 152.4px"
            >
              <el-option
                v-for="item in ['测试']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="单据交易类型">
            <el-select
              v-model="testValue"
              placeholder="Select"
              style="width: 152.4px"
            >
              <el-option
                v-for="item in ['测试']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <br />
          <el-form-item>
            <el-button type="primary" @click="">清空条件</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addNewVisible = true"
              >新建</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="table_container">
        <el-table
          :data="
            tableData.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )
          "
          border
          size="small"
          :height="tableHeight"
          row-key="step1"
          style="width: 100%"
        >
          <el-table-column prop="BarCode" label="ID" width="180">
          </el-table-column>
          <el-table-column prop="PadID" label="单据类型"> </el-table-column>
          <el-table-column prop="Result" label="生产线"> </el-table-column>
          <el-table-column prop="Result" label="生产计划号合并组"> </el-table-column>
          <el-table-column prop="Result" label="上个结存生产计划号">
          </el-table-column>
          <el-table-column prop="Result" label="产品型号"> </el-table-column>
          <el-table-column prop="Result" label="生产计划号"> </el-table-column>
          <el-table-column prop="Result" label="领料单"> </el-table-column>
          <el-table-column prop="Result" label="出库单"> </el-table-column>
          <el-table-column prop="Result" label="状态"> </el-table-column>
        </el-table>
        <div class="block" style="margin: 15px 0">
          <el-pagination
            align="center"
            background
            size="small"
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
        <el-table
          :data="tableData1"
          border
          size="small"
          :height="tableHeight1"
          row-key="step1"
          style="width: 100%"
        >
          <el-table-column prop="BarCode" label="生产计划号" width="180">
          </el-table-column>
          <el-table-column prop="PadID" label="领料单"> </el-table-column>
          <el-table-column prop="Result" label="行项号"> </el-table-column>
          <el-table-column prop="Result" label="料号"> </el-table-column>
          <el-table-column prop="Result" label="数量"> </el-table-column>
          <el-table-column prop="Result" label="单位"> </el-table-column>
          <el-table-column prop="Result" label="主替料组别"> </el-table-column>
          <el-table-column prop="Result" label="优先级"> </el-table-column>
          <el-table-column prop="Result" label="物料描述"> </el-table-column>
          <el-table-column prop="Result" label="物料规格"> </el-table-column>
          <el-table-column prop="Result" label="指定出货批次">
          </el-table-column>
          <el-table-column prop="Result" label="指定出货"> </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog
      v-model="addNewVisible"
      align-center
      title="新建 领料单"
      width="1200"
    >
      <el-form label-width="100px" size="small" :inline="true">
        <el-form-item label="组织代码" prop="">
          <el-input v-model="requisitionForm.org_id" class="input-with-select">
          </el-input>
        </el-form-item>
        <el-form-item label="出库单编码" prop="">
          <el-input
            v-model="requisitionForm.pmn_code"
            class="input-with-select"
          >
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="出库单类型" prop="">
          <el-input v-model="pmn_type" class="input-with-select"> </el-input>
        </el-form-item> -->
        <el-form-item label="成品编码" prop="">
          <el-input
            v-model="requisitionForm.prod_code"
            class="input-with-select"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="出库单类型" prop="">
          <el-select
            v-model="requisitionForm.pmn_type"
            placeholder="Select"
            style="width: 152.4px"
          >
            <el-option
              v-for="item in pmnTypeList"
              :key="item"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单据实际数量" prop="">
          <el-input
            type="number"
            v-model="requisitionForm.mn_tb_qty"
            class="input-with-select"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="单据计划数量" prop="">
          <el-input
            type="number"
            v-model="requisitionForm.mn_plan_qty"
            class="input-with-select"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="单据日期" prop="">
          <el-input
            v-model="requisitionForm.ref_mn_date"
            class="input-with-select"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="第三方单据编码" prop="">
          <el-input
            v-model="requisitionForm.ref_mn_code"
            class="input-with-select"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="虚拟库编码" prop="">
          <el-input
            v-model="requisitionForm.vm_store_code"
            class="input-with-select"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="出库类型" prop="">
          <el-select
            v-model="requisitionForm.cust_pmn_type"
            placeholder="Select"
            style="width: 152.4px"
          >
            <el-option
              v-for="item in custType"
              :key="item"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上架类型" prop="">
          <el-select
            v-model="requisitionForm.cust_shelf_status"
            placeholder="Select"
            style="width: 152.4px"
          >
            <el-option
              v-for="item in cuostStatus"
              :key="item"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="">
          <el-input v-model="requisitionForm.remark" class="input-with-select">
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="账本ID" prop="">
          <el-input v-model="testValue" class="input-with-select"> </el-input>
        </el-form-item>
        <el-form-item label="Erp ID" prop="">
          <el-input v-model="testValue" class="input-with-select"> </el-input>
        </el-form-item>
        <el-form-item label="计划时间" prop="">
          <el-input v-model="testValue" class="input-with-select"> </el-input>
        </el-form-item>
        <el-form-item label="操作时间" prop="">
          <el-input v-model="testValue" class="input-with-select"> </el-input>
        </el-form-item>
        <el-form-item label="建立时间" prop="">
          <el-input v-model="testValue" class="input-with-select"> </el-input>
        </el-form-item>
        <el-form-item label="站位信息" prop="">
          <el-input v-model="testValue" class="input-with-select"> </el-input>
        </el-form-item>
        <el-form-item label="领料人" prop="">
          <el-input v-model="testValue" class="input-with-select"> </el-input>
        </el-form-item>
        <el-form-item label="SMT加工面" prop="">
          <el-input v-model="testValue" class="input-with-select"> </el-input>
        </el-form-item>
        <el-form-item label="补料原因" prop="">
          <el-select
            v-model="testValue"
            placeholder="Select"
            style="width: 152.4px"
          >
            <el-option
              v-for="item in ['测试']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="JIT配套数量" prop="">
          <el-input v-model="testValue" class="input-with-select"> </el-input>
        </el-form-item>
        <el-form-item label="生产计划号组" prop="">
          <el-input v-model="testValue" class="input-with-select"> </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="24">
        <el-form-item class="w-full" label="备注" prop="">
          <el-input v-model="testValue" type="textarea" class="input-with-select w-full"> </el-input>
        </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item class="w-full" label="成品描述" prop="">
              <el-input
                v-model="testValue"
                type="textarea"
                class="input-with-select w-full"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <div class="flex">
        <div>
          <el-button class="w-[50px]" type="primary" @click="addWmsTable"
            >添加</el-button
          >
        </div>
        <el-table
          :data="requisitionForm.wms_mn_elec"
          border
          size="small"
          :height="'150px'"
          row-key="step1"
          style="width: calc(50% - 100px)"
        >
          <el-table-column label="电子出库表">
            <template #default="{ row, column, $index }">
              <el-input
                v-model="row.phase_code"
                placeholder="请输入"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="车间编码">
            <template #default="{ row, column, $index }">
              <el-input v-model="row.pt_code" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="产线编码">
            <template #default="{ row, column, $index }">
              <el-input v-model="row.pl_code" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div class="w-[100px]"></div>
        
        <div>
          <el-button class="w-[50px]" type="primary" @click="addStoreTable"
            >添加</el-button
          >
        </div>
        <el-table
          :data="requisitionForm.bs_mn_store"
          border
          size="small"
          :height="'150px'"
          row-key="step1"
          style="width: calc(50% - 100px)"
        >
          <el-table-column label="仓库编码">
            <template #default="{ row, column, $index }">
              <el-input v-model="row.pt_code" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template #default="{ row, column, $index }">
              <el-input v-model="row.remark" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="flex mt-3">
        <div>
          <el-button class="w-[50px]" type="primary" @click="addMtrlTable"
            >添加</el-button
          >
        </div>
        <el-table
          :data="requisitionForm.bs_mn_mtrl"
          border
          size="small"
          :height="'150px'"
          row-key="step1"
          style="width: calc(100% - 50px)"
        >
          <el-table-column label="物料编码">
            <template #default="{ row, column, $index }">
              <el-input v-model="row.mtrl_code" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="是否主料">
            <template #default="{ row, column, $index }">
              <el-input v-model="row.is_main" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="主料编码">
            <template #default="{ row, column, $index }">
              <el-input v-model="row.main_code" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="用量">
            <template #default="{ row, column, $index }">
              <el-input-number v-model="row.dosage" class="w-auto" :controls="false" placeholder="请输入"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="净需求数量">
            <template #default="{ row, column, $index }">
              <el-input-number v-model="row.nn_qty" class="w-auto" :controls="false" placeholder="请输入"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="实际需求数量">
            <template #default="{ row, column, $index }">
              <el-input-number v-model="row.tn_qty" class="w-auto" :controls="false" placeholder="请输入"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="销售订单号">
            <template #default="{ row, column, $index }">
              <el-input v-model="row.so_id" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="第三方行号">
            <template #default="{ row, column, $index }">
              <el-input v-model="row.thrid_rwn" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="批次号">
            <template #default="{ row, column, $index }">
              <el-input v-model="row.bs_mn_mtrl_ex1" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template #default="{ row, column, $index }">
              <el-input v-model="row.remark" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="BarCode" label="料号"> </el-table-column>
          <el-table-column prop="PadID" label="数量"> </el-table-column>
          <el-table-column prop="Result" label="主替料组别(主料)">
          </el-table-column>
          <el-table-column prop="Result" label="优先级"> </el-table-column>
          <el-table-column prop="Result" label="规格"> </el-table-column>
          <el-table-column prop="Result" label="备注(自定义字段)">
          </el-table-column> -->
        </el-table>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addNewVisible = false">关闭</el-button>
          <el-button type="primary" @click=""> 保存 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { getCheckResults } from "@/api/operate";
import type { InspectionResult } from "@/typing";
import { ElMessageBox, ElMessage, ElLoading } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { QuerySN, MaintenanceAdd, QueryMaintenance } from "@/api/smtApi";
import {
  ref,
  reactive,
  watch,
  nextTick,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
const tableData = ref<any>([]);
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const tableData1 = ref<any>([]);
const tableHeight1 = ref(0);
const userStore = useUserStoreWithOut();
const loginName = userStore.getUserInfo;
const addNewVisible = ref(false);
const testValue = ref("");
const headerRef = ref();

interface wmsType {
  phase_code: string;
  pt_code: string;
  pl_code: string;
}

interface bsMnStore {
  store_code: string;
  remark: string;
}

interface bsMnMtrl {
  mtrl_code: string;
  is_main: string;
  main_code: string;
  dosage: string;
  nn_qty: string;
  tn_qty: string;
  so_id: string;
  thrid_rwn: string;
  bs_mn_mtrl_ex1: string;
  remark: string;
}

interface RuleForm {
  org_id: string;
  pmn_code: string;
  prod_code: string;
  pmn_type: string;
  mn_tb_qty: string;
  mn_plan_qty: string;
  ref_mn_date: string;
  ref_mn_code: string;
  vm_store_code: string;
  cust_pmn_type: string;
  cust_shelf_status: string;
  remark: string;
  wms_mn_elec: Array<wmsType>;
  bs_mn_store: Array<bsMnStore>;
  bs_mn_mtrl: Array<bsMnMtrl>;
}

const requisitionForm = ref<RuleForm>({
  org_id: "",
  pmn_code: "",
  prod_code: "",
  pmn_type: "",
  mn_tb_qty: "",
  mn_plan_qty: "",
  ref_mn_date: "",
  ref_mn_code: "",
  vm_store_code: "",
  cust_pmn_type: "",
  cust_shelf_status: "",
  remark: "",
  wms_mn_elec: [],
  bs_mn_store: [],
  bs_mn_mtrl: [],
});

const pmnTypeList = reactive([{
  value:1,
  label:'生产出库单'
},{
  value:2,
  label:'其它出库单'
},{
  value:3,
  label:'不良品出库申请单'
},{
  value:4,
  label:'供应商退货申请单'
},{
  value:5,
  label:'报废申请单'
},{
  value:6,
  label:'自定义申请单'
},{
  value:7,
  label:'维修领料申请单'
},{
  value:8,
  label:'研发领料申请单'
},{
  value:9,
  label:'生产补料单'
},{
  value:10,
  label:'生产计划号'
},{
  value:11,
  label:'产品出货申请单'
}])

const custType = reactive([{
  value:1,
  label:'生产出库'
},{
  value:2,
  label:'委外出库'
}])

const cuostStatus = reactive([{
  value:1,
  label:'完成'
},{
  value:2,
  label:'未完成'
}])

// watch(

// );
onBeforeMount(() => {
});

onMounted(() => {
  getScreenHeight();
  window.addEventListener("resize", getScreenHeight);
  nextTick(() => {
  });
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const handleSizeChange = (val: any) => {
  currentPage.value = 1;
  pageSize.value = val;
};
const handleCurrentChange = (val: any) => {
  currentPage.value = val;
};

const pageObj1 = ref({
  pageSize: 100,
  currentPage: 1,
});

const addWmsTable = () => {
  requisitionForm.value.wms_mn_elec.push({
    phase_code: "",
    pt_code: "",
    pl_code: "",
  });
};

const addStoreTable = () => {
  requisitionForm.value.bs_mn_store.push({
    store_code: "",
    remark: "",
  });
};

const addMtrlTable = () => {
  requisitionForm.value.bs_mn_mtrl.push({
    mtrl_code: "",
    is_main: "",
    main_code: "",
    dosage: "",
    nn_qty: "",
    tn_qty: "",
    so_id: "",
    thrid_rwn: "",
    bs_mn_mtrl_ex1: "",
    remark: "",
  });
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
    tableHeight.value =
      (window.innerHeight - 190 - headerRef.value.clientHeight) * 0.6;
    tableHeight1.value =
      (window.innerHeight - 190 - headerRef.value.clientHeight) * 0.4;
  });
};
</script>

<style lang="scss" scoped></style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
