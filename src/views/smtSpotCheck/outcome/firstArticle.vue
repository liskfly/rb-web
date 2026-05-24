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
          <el-form ref="formRef" class="form" :inline="true" label-width="" size="small">
            <el-form-item label="工单" class="mb-2">
              <el-input
                size="small"
                v-model="searchForm.OrderID"
                style="width: 180px"
                placeholder=""
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="日期" class="mb-2">
              <el-date-picker
                v-model="date"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                format="YYYY-MM-DD"
                :clearable="false"
                value-format="YYYY-MM-DD"
                end-placeholder="结束时间"
              />
            </el-form-item>
            <el-form-item label="产线" class="mb-2">
          <el-select
            v-model="searchForm.TestLine"
            placeholder=""
            style="width: 150px"
            clearable
          >
            <el-option
              v-for="item in ['L1','L2','L3']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
            </el-form-item>
            <el-form-item label="" class="mb-2">
              <el-button
                class="ml-3"
                type="primary"
                @click="searchData"
                size="small"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
          <!-- <el-input v-model="inputValue" placeholder="请输入">
                        <template #append>
                            <el-button type="primary" icon="Search" @click="serachData"></el-button> </template></el-input> -->
        </div>
        <!-- <el-button
          class="mb-2"
          type="primary"
          @click="clearForm(), (addVisible = true)"
          size="small"
          >新增故障代码</el-button
        > -->
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
          prop="OrderID"
          align="center"
          label="工单号"
          :min-width="flexColumnWidth('工单号', 'OrderID')"
        >
          <template #default="scope">
            <div class="underline font-bold text-[#006487]" @click="openRecord(scope.row.DataGuid)">{{ scope.row.OrderID }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="DateManufacture"
          align="center"
          label="生产日期"
          :min-width="flexColumnWidth('生产日期', 'DateManufacture')"
        >
        </el-table-column>
        <el-table-column
          prop="ProgramName"
          align="center"
          label="机种名称"
          :min-width="flexColumnWidth('机种名称', 'ProgramName')"
        >
        </el-table-column>
        <el-table-column
          prop="TestLine"
          align="center"
          label="生产线别"
          :min-width="flexColumnWidth('生产线别', 'TestLine')"
        >
        </el-table-column>
        <el-table-column
          prop="DontFace"
          align="center"
          label="A/B面"
          :min-width="flexColumnWidth('A/B面', 'DontFace')"
        >
        </el-table-column>
        <el-table-column
          prop="ClassPlease"
          align="center"
          label="班别"
          :min-width="flexColumnWidth('班别', 'ClassPlease')"
        >
        </el-table-column>
        <el-table-column
          prop="TestTypes"
          align="center"
          label="检测类型"
          :min-width="flexColumnWidth('检测类型', 'TestTypes')"
        >
        </el-table-column>
        <el-table-column
          prop="Inspector"
          align="center"
          label="检测员"
          :min-width="flexColumnWidth('检测员', 'Inspector')"
        >
        </el-table-column>
        <el-table-column
          prop="TestResult"
          align="center"
          label="结论"
          :min-width="flexColumnWidth('结论', 'TestResult')"
        >
        </el-table-column>
        <!-- <el-table-column
          prop="ReturnDate"
          fixed="right"
          align="center"
          label="操作"
          width="100"
        >
          <template #default="scope">
            <div class="w-full">
              <el-tooltip content="编辑" placement="top">
                <el-button
                  type="primary"
                  icon="EditPen"
                  size="small"
                  @click="editSubmit(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  type="danger"
                  icon="Delete"
                  size="small"
                  @click="deleteSubmit(scope.row)"
                ></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column> -->
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
      v-model="addVisible"
      @close=""
      title="首件检测报告"
      width="70%"
    >
      <el-form
        ref="formRef"
        :model="form"
        label-position="left"
        label-width="auto"
        :inline="true"
      >
        <el-form-item label="结论">
          <el-input v-model="recordForm.TestResult" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="测试类型">
          <el-input v-model="recordForm.TestTypes" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="BOM版本">
          <el-input v-model="recordForm.BomVsion" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="公司">
          <el-input v-model="recordForm.Supplier" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="班别">
          <el-input v-model="recordForm.ClassPlease" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="检查总数">
          <el-input v-model="recordForm.TestTotal" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="机种名称">
          <el-input v-model="recordForm.ProgramName" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="A/B面">
          <el-input v-model="recordForm.DontFace" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="通过数">
          <el-input v-model="recordForm.NumberPasses" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="通过数" class="opacity-0">
          <el-input v-model="recordForm.NumberPasses" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="序列号">
          <el-input v-model="recordForm.SerialNumber" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="未通过">
          <el-input v-model="recordForm.TestFail" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="工单号" class="opacity-0">
          <el-input v-model="recordForm.TestTypes" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="工单号">
          <el-input v-model="recordForm.TestTypes" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="未检测">
          <el-input v-model="recordForm.NotDetected" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="生产线别" class="opacity-0">
          <el-input v-model="recordForm.TestLine" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="生产线别">
          <el-input v-model="recordForm.TestLine" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="通过率">
          <el-input v-model="recordForm.PassingRate" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="生产日期" class="opacity-0">
          <el-input v-model="recordForm.DateManufacture" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="生产日期">
          <el-input v-model="recordForm.DateManufacture" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="检测员">
          <el-input v-model="recordForm.Inspector" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="生产周期">
          <el-input v-model="recordForm.ProductionCycle" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="打印时间">
          <el-input v-model="recordForm.PrintTime" style="width: 220px" disabled />
        </el-form-item>
        <el-form-item label="批次数量">
          <el-input v-model="recordForm.BatchQuantity" style="width: 220px" disabled />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button type="info" @click="addSon"> 增加子项</el-button> -->
          <el-button @click="addVisible = false"> 关闭 </el-button>
          <el-button type="primary"> <a
                  target="_blank"
                  :href="`${recordForm.PdfUrl}`
                  ">查看详情图</a> </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification, ElMessageBox } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import {
  QueryIOT_FirstArticleData,
  QueryIOT_FirstArticleData_Head
} from "@/api/sparePartsApi";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { GetComboBoxList } from "@/api/operate";
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

const userStore = useUserStoreWithOut();

interface formTS {
  ErrorTypeCode: string;
  ErrorTypeName: string;
  ErrorCode: string;
  ErrorName: string;
  ErrorDesc: string;
  RepairMethod: string;
  ErrorNote: string;
  CreatedBy: string;
}

interface EditFormTS {
  ErrorTypeCode: string;
  ErrorTypeName: string;
  ErrorCode: string;
  ErrorName: string;
  ErrorDesc: string;
  RepairMethod: string;
  ErrorNote: string;
  CreatedBy: string;
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
  TestLine: string;
  OrderID: string;
  DateStart: string;
  DateEnd: string;
}

interface detailFormTS {
  TypeName: string;
  InstockNo: string;
  PurhaseNo: string;
  OutstockNo: string;
  ReturnBy: string;
  InStockStatus: string;
  CreatedBy: string;
  CreatedOn: string;
  Remark: string;
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
const faultCodeType = ref();
const faultNameType = ref();
const date = ref([]);
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

watch(date, (newVal, oldVal) => {
  searchForm.value.DateEnd = newVal[1];
  searchForm.value.DateStart = newVal[0];
});

const tableData = ref([]);
const PartList = ref<any[]>([]);

const form = ref<formTS>({
  ErrorTypeCode: "",
  ErrorTypeName: "",
  ErrorCode: "",
  ErrorName: "",
  ErrorDesc: "",
  RepairMethod: "",
  ErrorNote: "",
  CreatedBy: "",
});

const recordForm = ref({
    "DataGuid": 0,
    "TestResult": "",
    "TestTypes": "",
    "BomVsion": "",
    "Supplier": "",
    "ClassPlease": "",
    "TestTotal": "",
    "Mcid": null,
    "DontFace": "",
    "NumberPasses": 0,
    "ScanTime": "00:01:1",
    "SerialNumber": "",
    "TestFail": 0,
    "ProcessTime": "0",
    "OrderID": "0",
    "NotDetected": 0,
    "TestTime": "",
    "TestLine": "",
    "PassingRate": "",
    "TestDuration": "",
    "DateManufacture": "",
    "Inspector": "",
    "ProductionCycle": "",
    "PrintTime": "",
    "BatchQuantity": 0,
    "Barcode": "",
    "ProgramName": "",
    "WorkstationName": "",
    "IP": "",
    "PdfUrl": null
});

const EditForm = ref<EditFormTS>({
  ErrorTypeCode: "",
  ErrorTypeName: "",
  ErrorCode: "",
  ErrorName: "",
  ErrorDesc: "",
  RepairMethod: "",
  ErrorNote: "",
  CreatedBy: "",
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
  TestLine: "",
  OrderID: "",
  DateStart: "",
  DateEnd: "",
});

const detailForm = ref<detailFormTS>({
  TypeName: "",
  InstockNo: "",
  PurhaseNo: "",
  OutstockNo: "",
  ReturnBy: "",
  InStockStatus: "",
  CreatedBy: "",
  CreatedOn: "",
  Remark: "",
});

const openRecord = (str:any) => {
  QueryIOT_FirstArticleData_Head(str).then((res:any) => {
    addVisible.value = true
    recordForm.value = res.content[0]
  })
}

interface toolType {
  Text: string;
  Value: string;
}

const MaterialNameList = ref<toolType[]>([]);

const clearForm = () => {
  form.value = {
    ErrorTypeCode: "",
    ErrorTypeName: "",
    ErrorCode: "",
    ErrorName: "",
    ErrorDesc: "",
    RepairMethod: "",
    ErrorNote: "",
    CreatedBy: loginName,
  };
};

const inFormClose = () => {
  inFormRef.value.resetFields();
  InVisible.value = false;
};

const clearEditForm = () => {
  EditForm.value = {
    ErrorTypeCode: "",
    ErrorTypeName: "",
    ErrorCode: "",
    ErrorName: "",
    ErrorDesc: "",
    RepairMethod: "",
    ErrorNote: "",
    CreatedBy: "",
  };
};

const typeChange = () => {
  form.value = {
    ErrorTypeCode: "",
    ErrorTypeName: "",
    ErrorCode: "",
    ErrorName: "",
    ErrorDesc: "",
    RepairMethod: "",
    ErrorNote: "",
    CreatedBy: loginName,
  };
};

const getData = () => {
  QueryIOT_FirstArticleData({}).then((res: any) => {
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

//根据名称获取配置值
const getTypeList = () => {
  GetComboBoxList("ResourceErrorType").then((res: any) => {
    faultCodeType.value = res.content;
    // faultNameType.value = res.content;
  });
};

// const dateChange = (data: any) => {
//   if (data !== null && data !== "") {
//     searchForm.value.StartDate = data[0];
//     searchForm.value.EndDate = data[1];
//   } else {
//     searchForm.value.StartDate = "";
//     searchForm.value.EndDate = "";
//   }
// };

const searchData = () => {
  QueryIOT_FirstArticleData(searchForm.value).then((res: any) => {
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
  deleteChoice.value = data.ErrorCodeGuid;
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      faultDelete({ ErrorCodeGuid: data.ErrorCodeGuid }).then((res: any) => {
        if (!res) {
          return;
        }
        ElNotification({
          type: "success",
          message: res.msg,
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
  faultAdd(form.value).then((res: any) => {
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
  faultUpdate(EditForm.value).then((res: any) => {
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

const getTypeStr = (code: any) => {
  let str = "";
  faultCodeType.value.forEach((element) => {
    if (element.Value === code) {
      str = element.Text;
    }
  });
  return str;
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
  getTypeList();
  // let end: string = setTodayDate();
  // let start: string = setLastDate();
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
