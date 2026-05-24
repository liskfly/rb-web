<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="flex justify-between">
        <!-- <el-button
            type="primary"
            @click="clearForm(), (addVisible = true)"
            >添加</el-button
          > -->
        <div class="flex">
          <el-form ref="formRef" class="form" :inline="true" label-width="">
            <el-form-item label="时间" class="mb-2">
              <el-date-picker
                :shortcuts="shortcuts"
                v-model="dateValue"
                type="daterange"
                range-separator="-"
                 size="small"
                value-format="YYYY-MM-DD"
                @change="dateChange"
              />
            </el-form-item>
            <el-form-item label="备件名称" class="mb-2">
              <el-input
                v-model="searchForm.PartName"
                style="width: 240px" size="small"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="" class="mb-2">
              <el-button class="ml-3" type="primary" @click="serachData" size="small"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
          <!-- <el-input
            v-model="inputValue"
            style="width: 240px"
            placeholder="请输入"
            clearable
          ></el-input>
          <el-button class="ml-3" type="primary" @click=""
            >查询</el-button
          > -->
          <!-- <el-input v-model="inputValue" placeholder="请输入">
                        <template #append>
                            <el-button type="primary" icon="Search" @click="serachData"></el-button> </template></el-input> -->
        </div>
      </div>
      <!-- <table-tem
        size="small"
        :show-index="true"
        :tableData="tableData1"
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
          tableData1.slice(
            (pageObj.currentPage - 1) * pageObj.pageSize,
            pageObj.currentPage * pageObj.pageSize
          )
        "
        :height="tableHeight"
        center
        stripe
      >
        <el-table-column
          prop="PartName"
          align="center"
          label="备件名称"
          :min-width="flexColumnWidth('备件名称', 'PartName')"
        >
        </el-table-column>
        <el-table-column
          prop="Qty"
          align="center"
          label="当前数量"
          :min-width="flexColumnWidth('当前数量', 'Qty')"
        >
        </el-table-column>
        <el-table-column
          prop="OutQty"
          align="center"
          label="出库数量"
          :min-width="flexColumnWidth('出库数量', 'OutQty')"
        >
        </el-table-column>
        <el-table-column
          prop="ScrapQty"
          align="center"
          label="报废数量"
          :min-width="flexColumnWidth('报废数量', 'ScrapQty')"
        >
        </el-table-column>
        <el-table-column
          prop="PurchaseNo"
          align="center"
          label="采购单号"
          :min-width="flexColumnWidth('采购单号', 'PurchaseNo')"
        >
        </el-table-column>
        <el-table-column prop="number" align="left" label="状态">
          <template #default="scope">
            <div v-if="scope.row.Status === 0">
              <el-tag type="primary">在库</el-tag>
            </div>
            <div v-if="scope.row.Status === 1">
              <el-tag type="success">入库中</el-tag>
            </div>
            <div v-if="scope.row.Status === 99">
              <el-tag type="warning">报废</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="DueDate"
          align="center"
          label="到期日期"
          :min-width="flexColumnWidth('到期日期', 'DueDate')"
        >
        </el-table-column>
        <el-table-column
          prop="Vendor"
          align="center"
          label="供应商"
          :min-width="flexColumnWidth('供应商', 'Vendor')"
        >
        </el-table-column>
        <el-table-column
          prop="Manufacturer"
          align="center"
          label="制造商"
          :min-width="flexColumnWidth('制造商', 'Manufacturer')"
        >
        </el-table-column>
        <el-table-column
          prop="Specification"
          align="center"
          label="规格型号"
          :min-width="flexColumnWidth('规格型号', 'Specification')"
        >
        </el-table-column>
        <el-table-column
          prop="StorageLocation"
          align="center"
          label="存储位置"
          :min-width="flexColumnWidth('存储位置', 'StorageLocation')"
        >
        </el-table-column>
        <el-table-column
          prop="CreatedOn"
          align="center"
          label="创建日期"
          :min-width="flexColumnWidth('创建日期', 'CreatedOn')"
        >
        </el-table-column>
        <el-table-column
          prop="CreatedBy"
          align="center"
          label="创建人"
          :min-width="flexColumnWidth('创建人', 'CreatedBy')"
        >
        </el-table-column>
        <el-table-column
          prop="ReturnDate"
          fixed="right"
          align="center"
          label="操作"
          width="80"
        >
          <template #default="scope">
            <div class="w-full">
              <el-tooltip content="报废" placement="top">
                <el-button
                  type="warning"
                  icon="Failed"
                  size="small"
                  @click="ScrapSubmit"
                  :disabled="scope.row.Status === 99"
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
      title="报废"
      width="550px"
    >
      <el-form
        ref="formRef"
        :model="ScrapForm"
        label-position="left"
        label-width="80"
        :inline="true"
      >
        <el-form-item label="报废原因">
          <el-input v-model="ScrapForm.ScrapReason" style="width: 400px" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="ScrapForm.Remark" style="width: 400px" />
        </el-form-item>
        <el-form-item label="报废数量">
          <el-input-number
            v-model="ScrapForm.Qty"
            :min="1"
            :max="maxCount"
            style="width: 400px"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
          <el-button @click="editVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="ScrapData"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      align-center
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="addVisible"
      @close=""
      title="添加"
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
            v-model="form.ClassID"
            filterable
            placeholder=""
            style="width: 250px"
          >
            <el-option
              v-for="item in ClassList"
              :key="item.ClassID"
              :label="item.ClassName"
              :value="item.ClassID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input v-model="form.PartName" style="width: 250px" />
        </el-form-item>
        <el-form-item label="备件描述">
          <el-input v-model="form.Description" style="width: 250px" />
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="form.Specification" style="width: 250px" />
        </el-form-item>
        <el-form-item label="设备">
          <el-input v-model="form.Equipment" style="width: 250px" />
        </el-form-item>
        <el-form-item label="供应商代码">
          <el-input v-model="form.VendorCode" style="width: 250px" />
        </el-form-item>
        <el-form-item label="安全库存">
          <el-input-number
            v-model="form.SafetyStock"
            :min="1"
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item label="最小库存">
          <el-input-number
            v-model="form.MinStock"
            :min="1"
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item label="最大库存">
          <el-input-number
            v-model="form.MaxStock"
            :min="1"
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item label="当前数量">
          <el-input-number
            v-model="form.CurrentQty"
            :min="1"
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item label="周期">
          <el-input v-model="form.Cycle" style="width: 250px" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.Unit" style="width: 250px" />
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
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import {
  GetPartsStockList,
  findStockidParameter,
  updatePartsStockData,
  deletePartsStock,
  addPartsStock,
  addPartsScrapData,
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
import { shortcuts, setTodayDate, setLastDate } from "@/utils/dataMenu";

const userStore = useUserStoreWithOut();

interface formTS {
  ClassID: string;
  PartName: string;
  Description: string;
  Specification: string;
  Equipment: string;
  VendorCode: string;
  Cycle: string;
  SafetyStock: number;
  MinStock: number;
  MaxStock: number;
  CurrentQty: number;
  Unit: string;
  CreatedBy: string;
}

interface ScrapFormTS {
  StockID: string;
  PartID: string;
  Qty: number;
  Remark: string;
  ScrapReason: string;
  CreatedBy: string;
}

interface SearchFormTS {
  PartName: string;
  StartDate: string;
  EndDate: string;
}

//   const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const dateValue = ref<any[]>([]);
const deleteVisible = ref(false);
const deleteChoice = ref("");
const tableData1 = ref<any[]>([]);
const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});
const maxCount = ref(1);
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
const ClassList = ref<any[]>([]);

const form = ref<formTS>({
  ClassID: "",
  PartName: "",
  Description: "",
  Specification: "",
  Equipment: "",
  VendorCode: "",
  Cycle: "",
  SafetyStock: 1,
  MinStock: 1,
  MaxStock: 1,
  CurrentQty: 1,
  Unit: "",
  CreatedBy: loginName,
});

const ScrapForm = ref<ScrapFormTS>({
  StockID: "",
  PartID: "",
  Qty: 0,
  Remark: "",
  ScrapReason: "",
  CreatedBy: loginName,
});

const searchForm = ref<SearchFormTS>({
  PartName: "",
  StartDate: "",
  EndDate: "",
});

const ScrapSubmit = (data: any) => {
  ScrapForm.value.StockID = data.StockID;
  ScrapForm.value.PartID = data.PartID;
  maxCount.value = data.Qty;
  // ScrapForm.value.Qty = data.Qty;
  editVisible.value = true;
};

interface toolType {
  Text: string;
  Value: string;
}

const MaterialNameList = ref<toolType[]>([]);

const clearForm = () => {
  form.value = {
    ClassID: "",
    PartName: "",
    Description: "",
    Specification: "",
    Equipment: "",
    VendorCode: "",
    Cycle: "",
    SafetyStock: 1,
    MinStock: 1,
    MaxStock: 1,
    CurrentQty: 1,
    Unit: "",
    CreatedBy: loginName,
  };

  formControl.value = {
    CleanAfterUses: false,
    CleanAfterPause: false,
    CleanAfterTime: false,
  };
};

const clearScrapForm = () => {
  ScrapForm.value = {
    StockID: "",
    PartID: "",
    Qty: 0,
    Remark: "",
    ScrapReason: "",
    CreatedBy: loginName,
  };
};

watch(
  () => searchForm.value.PartName,
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

const getData = () => {
  GetPartsStockList({}).then((res: any) => {
    if (res && res.success && res.content.length !== 0) {
      tableData.value = res.content;
      //   ElNotification({
      //     title: res.msg,
      //     // message: "取消操作",
      //     type: "success",
      //   });
      if (searchForm.value.PartName) {
        tableData1.value = table1(searchForm.value.PartName);
      } else {
        tableData1.value = res.content;
      }
    }
  });
};
const dateChange = (data: any) => {
  if (data !== null && data !== "") {
    searchForm.value.StartDate = data[0];
    searchForm.value.EndDate = data[1];
  } else {
    searchForm.value.StartDate = "";
    searchForm.value.EndDate = "";
  }
};

const serachData = () => {
  GetPartsStockList(searchForm.value).then((res: any) => {
    if (res && res.success) {
      tableData.value = res.content;
      if (searchForm.value.PartName) {
        tableData1.value = table1(searchForm.value.PartName);
      } else {
        tableData1.value = res.content;
      }
    }
  });
};

const scrappedSubmit = (data: any) => {
  //   deleteVisible.value = true;
  deleteChoice.value = data.CompName;
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // addPartsScrapData(data.PartID, loginName).then((data: any) => {
      //   if (!data) {
      //     return;
      //   }
      //   ElNotification({
      //     type: "success",
      //     message: data.msg,
      //   });
      //   getData();
      // });
    })
    .catch(() => {
      ElNotification({
        type: "info",
        message: "取消操作",
      });
    });
};

const addData = () => {
  addPartsStock(form.value).then((res: any) => {
    if (res && res.success) {
      addVisible.value = false;
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
    }
    getData();
  });
};

const editData = () => {
  updatePartsStockData(ScrapForm.value).then((res: any) => {
    if (res && res.success) {
      editVisible.value = false;
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
    }
    getData();
  });
};

const ScrapData = () => {
  addPartsScrapData(ScrapForm.value).then((res: any) => {
    if (res && res.success) {
      editVisible.value = false;
      ElNotification({
        title: "提示信息",
        message: res.msg,
        type: "success",
      });
    }
    getData();
  });
};
const columnData = reactive([
  //   {
  //     text: true,
  //     prop: "PartID",
  //     label: "备品编号",
  //     width: "",
  //     min: true,
  //     align: "1",
  //   },
  //   {
  //     text: true,
  //     prop: "ClassID",
  //     label: "类别编号",
  //     width: "",
  //     min: true,
  //     align: "1",
  //   },
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
    prop: "Qty",
    label: "数量",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "PurchaseNo",
    label: "采购单",
    width: "",
    min: true,
    align: "center",
  },
  // {
  //   text: true,
  //   prop: "Description",
  //   label: "描述",
  //   width: "",
  //   min: true,
  //   align: "center",
  // },
  {
    text: false,
    tag: true,
    tagType: "number",
    tagItem: [
      { text: "在库", type: "primary", number: 0 },
      { text: "已出库", type: "primary", number: 1 },
      { text: "报废", type: "danger", number: 99 },
    ],
    prop: "Status",
    label: "状态",
    width: "80",
    min: true,
    align: "1",
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
    label: "存储位置",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CreatedOn",
    label: "创建日期",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "CreatedBy",
    label: "创建人",
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
      // {
      //   type: "primary",
      //   label: "编辑",
      //   icon: "EditPen",
      //   buttonClick: ScrapSubmit,
      // },
      {
        type: "warning",
        label: "报废",
        icon: "Failed",
        buttonClick: ScrapSubmit,
      },
      //   {
      //     type: "warning",
      //     label: "报废",
      //     icon: "Failed",
      //     buttonClick: null,
      //   },
    ],
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
  serachData();
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
