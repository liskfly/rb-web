<template>
  <div class="flex flex-col w-full h-full">
    <!-- <div class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center">
      <div></div>
      <span class="text-[1.2rem]">{{ opui.stationDec }}</span>
      <div>
        <el-button type="primary" @click="dialogVisible = true, getOrderList()">计划开工</el-button>
        <el-button type="warning" @click="openFeed">物料上料</el-button>
        <el-button type="primary">条码转生产计划号</el-button>
      </div>
    </div> -->
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[320px]">
        <div class="w-full h-full box">
          <div class="h-[35px] flex items-center text-xl text-[#fff] bg-[#006487]">
            <span class="ml-5">基本信息</span>
          </div>
          <div class="p-[10px] overflow-auto custom-scrollbar-hidden" :style="{ height: formHeight + 'px' }">
            <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
              <el-form-item size="default" v-for="f in formHeader" :key="f.value" :label="f.lable">
                <span class="font-bold text-lg leading-[30px]">
                  {{ formText(f.value) }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-320px)]">
        <div class="w-full h-full">
          <div>
            <div class="h-[35px] flex items-center justify-between text-xl text-[#fff] bg-[#006487]">
              <span class="ml-5"> 扫描条码</span>
              <div class="pr-2">
                <el-button type="warning" @click="(dialogVisible = true), getOrderList()">计划开工</el-button>
              </div>
            </div>
            <div class="h-[120px] p-5">
              <el-form class="inbound" ref="formRef" :model="form" label-width="auto" @submit.native.prevent>
                <el-form-item label="扫描条码">
                  <el-input v-model="barCode" ref="barCodeRef" style="width: 500px" placeholder="请扫描条码"
                    @keyup.enter="choiceOrder()" />
                </el-form-item>
              </el-form>
              <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                {{ msgTitle === "" ? "请扫描批次条码" : msgTitle }}
              </div>
              <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                {{ msgTitle }}
              </div>
            </div>
          </div>
          <div class="flex flex-col flex-1">
            <div class="h-[35px] flex items-center text-xl justify-between text-[#fff] bg-[#006487]">
              <span class="ml-5"> PCB条码列表</span>
              <div class="h-full flex items-center">
                <el-checkbox-group v-model="checkList" class="laser-table-filter">
                  <el-checkbox :label="`未释放(${notReleased.length})`" value="未释放" />
                  <el-checkbox :label="`待镭雕(${awaitLaser.length})`" value="待镭雕" />
                  <el-checkbox :label="`已完成(${Completed.length})`" value="已完成" />
                </el-checkbox-group>
                <el-icon @click="refreshClick()" class="mx-4">
                  <RefreshRight />
                </el-icon>
              </div>
            </div>
            <div class="h-full">
              <table-tem :showIndex="true" :tableData="filteredData" :tableHeight="tableHeight" :columnData="columnData"
                :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"></table-tem>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="生产计划列表" width="90%" align-center>
      <template #header>
        <div class="custom-dialog-title flex items-center justify-between">
          <div>生产计划列表</div>
          <!-- 在标题右侧插入一个按钮 -->
          <el-input v-model="workOrderInput" style="width: 400px" placeholder="请输入">
            <template #append>
              <el-button type="primary" icon="Search"></el-button> </template></el-input>
        </div>
      </template>
      <!-- <el-table
        ref="taskTableRef"
        :data="workOrderList"
        style="width: 100%"
        :height="'50vh'"
        @row-click="rowClick"
      >
        <el-table-column
          v-for="item in formHeader"
          :prop="item.value"
          :label="item.lable"
        />
      </el-table> -->
      <el-table ref="taskTableRef" class="test" :header-cell-class-name="cellClass" stripe border :data="workOrderList1"
        style="width: 100%" :height="'50vh'" @select="selectClick" :tooltip-effect="'dark'">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="MfgOrderName" label="生产计划号" width="150" :min-width="100"></el-table-column>
        <el-table-column prop="ProductName" label="产品编码" width="150" :min-width="150"></el-table-column>
        <el-table-column prop="ProductDesc" label="产品描述" :show-overflow-tooltip="true"
          :min-width="flexColumnWidth('产品描述', 'ProductDesc')"></el-table-column>
        <el-table-column prop="MfgLineDesc" label="产线" width="150" :min-width="150"></el-table-column>
        <el-table-column prop="OrderStatusDesc" label="状态" width="100" :min-width="100"></el-table-column>
        <el-table-column prop="PlannedStartDate" label="开始时间" width="180" :min-width="180"></el-table-column>
        <el-table-column prop="PlannedCompletionDate" label="结束时间" width="180" :min-width="180"></el-table-column>
        <el-table-column prop="Side" label="面号" width="80" :min-width="80"></el-table-column>
        <el-table-column prop="Qty" label="数量" width="100" :min-width="100"></el-table-column>
        <!-- <el-table-column v-for="item in formHeader" :prop="item.value" :label="item.lable"
          :min-width="flexColumnWidth(item.lable, item.value)" /> -->
      </el-table>
      <div class="mt-3">
        <el-pagination background @size-change="handleSizeChange1" @current-change="handleCurrentChange1"
          :current-page="pageObj.currentPage" :page-size="pageObj1.pageSize" :page-sizes="[5, 10, 20, 50, 100]"
          layout="total,sizes, prev, pager, next, jumper" :total="workOrderList.length">
        </el-pagination>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureClick">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="feedVisible" title="物料上料" width="90%" align-center class="saveAsDialog" :append-to-body="true"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <feedTemp :form="feedForm" :form-header="FeedHeader" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="feedCancel">关闭</el-button>
          <!-- <el-button type="primary" @click="show = false"> Confirm </el-button> -->
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import tableTem from "@/components/tableTem/index.vue";
import feedTemp from "@/components/feedTemp/index.vue";
import { cloneDeep } from "lodash-es";
// import {  } from "@/api/smt1";
import {
  getMaterialInformation,
  OrderSNQuery,
  getLaserWorkOrder,
  OrderQuery,
} from "@/api/smtApi";
import { useAppStore } from "@/stores/modules/app";
import { watch, computed } from "vue";
interface Form {
  MfgOrderName: string;
  BD_ProductModel: string;
  ProductName: string;
  ProductDesc: string;
  MfgLineDesc: string;
  OrderStatusDesc: string;
  PlannedStartDate: string;
  PlannedCompletionDate: string;
  Qty: number | string;
  Side: string;
  ERPOrder: string;
}
interface FormHeader {
  lable: string;
  value: string;
}
interface OrderList {
  MfgOrderName: string;
  PlannedStartDate: string;
  PlannedCompletionDate: string;
  RMANumber: string;
  Qty: number | string;
  ProductName: string;
  BD_ProjectNo: any;
  BD_ProductModel: any;
  ProductDesc: any;
  UOMName: string;
  OrderStatusName: string;
  OrderStatusDesc: string;
  MfgLineName: string;
  MfgLineDesc: string;
}
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
const appStore = useAppStore();
const taskTableRef = ref(); // 表格ref
const barCode = ref("");
const activeName = ref("first");
const dialogVisible = ref(false);
const choiceRow = ref<any>();
const opui = appStore.getOPUIReal();
const checkList = ref(["待镭雕", "未释放"]);

const workOrderList = ref<OrderList[]>([]);
const workOrderList1 = ref<OrderList[]>([]);
const workOrderInput = ref<string>("");
const form = reactive<Form>({
  MfgOrderName: "",
  PlannedStartDate: "",
  PlannedCompletionDate: "",
  Side: "",
  Qty: "",
  ProductName: "",
  BD_ProductModel: "",
  ProductDesc: "",
  OrderStatusDesc: "",
  MfgLineDesc: "",
  ERPOrder: "",
});
const formHeader = reactive<FormHeader[]>([
  {
    lable: "生产计划号",
    value: "MfgOrderName",
  },
  {
    lable: "产品机型",
    value: "BD_ProductModel",
  },
  {
    lable: "工单号",
    value: "ERPOrder",
  },
  {
    lable: "产品编码",
    value: "ProductName",
  },
  {
    lable: "产品描述",
    value: "ProductDesc",
  },
  {
    lable: "产线",
    value: "MfgLineDesc",
  },

  {
    lable: "面号",
    value: "Side",
  },
  {
    lable: "计划数量",
    value: "Qty",
  },
]);
const tableData = ref<any[]>([]);
const tableHeight = ref(0);
const formHeight = ref(0);
const msgTitle = ref("");
const msgType = ref(true);
const Completed = ref<any[]>([]);
const awaitLaser = ref<any[]>([]);
const notReleased = ref<any[]>([]);
const columnData = reactive([
  {
    text: true,
    prop: "SN",
    label: "PCB条码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MaterialBatchNo",
    label: "物料包装条码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ReleasedDate",
    label: "拆包时间",
    width: "250px",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "VendorLotNumber",
    label: "包装批次",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "IsResponse",
    label: "状态",
    width: "100px",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "LastResponseDate",
    label: "完成时间",
    width: "",
    min: true,
    align: "1",
  },
]);

const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});
const pageObj1 = ref({
  pageSize: 100,
  currentPage: 1,
});

const feedVisible = ref(false);
const feedForm = ref({
  MfgOrderName: "208310182",
  type: opui.station,
  ProductName: "240106000131",
  ProductDesc: "0402封装贴片电容100DF+5%50V MURATAGRM1555C1H101JA01D",
  Qty: "100",
  eqInfo: opui.stationDec,
});

const FeedHeader = reactive([
  {
    label: "机台",
    prop: "eqInfo",
  },
  {
    label: "生产计划号",
    prop: "MfgOrderName",
  },

  {
    label: "产品机型",
    prop: "type",
  },
  {
    label: "产品编码",
    prop: "ProductName",
  },
  {
    label: "产品描述",
    prop: "ProductDesc",
  },
  {
    label: "计划数量",
    prop: "Qty",
  },
]);
const barCodeRef = ref();

watch(
  () => workOrderInput.value,
  (newdata) => {
    if (newdata == "") {
      workOrderList1.value = workOrderList.value;
    } else {
      workOrderList1.value = table1(newdata);
    }
  }
);

const filteredData = computed(() => {
  if (checkList.value.length === 0) {
    // 如果没有选中的分类，则返回全部数据
    return tableData.value;
  }
  // 如果有选中的分类，则返回匹配的数据
  return tableData.value.filter((item) =>
    checkList.value.includes(item.IsResponse)
  );
});

const table1 = (newdata: any) => {
  let searchName = newdata.toLowerCase();
  return workOrderList.value.filter((v: any) => {
    return v["MfgOrderName"].indexOf(searchName) > -1;
  });
};

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

//打开物料上料
const openFeed = () => {
  if (form.MfgOrderName === "") {
    ElMessage({
      message: "请选择生产计划号",
      type: "warning",
    });
    barCode.value = "";
    return;
  }
  let data = cloneDeep(form);

  feedForm.value = { ...data };
  feedForm.value.type = opui.station;
  feedForm.value.eqInfo = opui.stationDec;
  feedVisible.value = true;
};
//关闭物料上料
const feedCancel = () => {
  feedVisible.value = false;
};
const formText = (data: string) => {
  let key = data as keyof typeof form;
  return form[key];
};
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
    tableHeight.value = window.innerHeight - 320;
    formHeight.value = window.innerHeight - 125;
  });
};
const getOrderList = () => {
  OrderQuery({ lineName: opui.line}).then((res: any) => {
    workOrderList.value = res.content;
    workOrderList1.value = res.content;
  });
  // getLaserWorkOrder({ orderID: "" }).then((data: any) => {
  //   // const dataText = JSON.parse(data.content);
  //   // workOrderList.value = [...dataText,{},{}];
  //   workOrderList.value = data.content
  //   workOrderList1.value = data.content
  // });
};
const choiceOrder = () => {
  if (form.MfgOrderName === "") {
    ElMessage({
      message: "请选择生产计划号",
      type: "warning",
    });
    barCode.value = "";
    return;
  }
  getMaterialInformation({
    OrderNumber: form.MfgOrderName,
    MaterialBatchNo: barCode.value,
    ResourceNo: opui.station,
  }).then((data: any) => {
    barCode.value = "";
    msgTitle.value = data.msg;
    if (!data.success) {
      msgType.value = false;
      return;
    } else {
      msgType.value = true;
      // msgTitle.value = "成功";
      refreshClick();
    }
  });
};
// const rowClick = (row: any, column: any, event: Event) => {
//   form.MfgOrderName = row.MfgOrderName;
//   form.BD_ProductModel = row.BD_ProductModel;
//   form.ProductName = row.ProductName;
//   form.ProductDesc = row.ProductDesc;
//   form.MfgLineDesc = row.MfgLineDesc;
//   form.OrderStatusDesc = row.OrderStatusDesc;
//   form.PlannedStartDate = row.PlannedStartDate;
//   form.PlannedCompletionDate = row.PlannedCompletionDate;
//   form.Qty = row.Qty;
//   form.RMANumber = row.RMANumber;
//   dialogVisible.value = false;
// };

const selectClick = (selection: any, row: any) => {
  if (selection.length > 1) {
    let del_row = selection.shift();
    taskTableRef.value.toggleRowSelection(del_row, false); // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）；第二个参数为true时又变成了多选
    // console.log(selection[0]);
    choiceRow.value = selection[0];
  } else {
    // console.log(selection[0]);
    choiceRow.value = selection[0];
  }
};

const sureClick = () => {
  if (!choiceRow.value || !choiceRow.value.MfgOrderName) {
    ElMessage({
      message: "请选择生产计划号",
      type: "warning",
    });
    return;
  }
  OrderSNQuery({
    orderName: choiceRow.value.MfgOrderName,
    IsVerify: true,
  }).then((data: any) => {
    Completed.value = [];
    awaitLaser.value = [];
    notReleased.value = [];
    // const dataText = JSON.parse(data.content);
    if (data.success) {
      tableData.value = data.content;
      Completed.value = tableData.value.filter(
        (item) => item.IsResponse === "已完成"
      );
      awaitLaser.value = tableData.value.filter(
        (item) => item.IsResponse === "待镭雕"
      );
      notReleased.value = tableData.value.filter(
        (item) => item.IsResponse === "未释放"
      );
      form.MfgOrderName = choiceRow.value.MfgOrderName;
      form.BD_ProductModel = choiceRow.value.BD_ProductModel;
      form.ProductName = choiceRow.value.ProductName;
      form.ProductDesc = choiceRow.value.ProductDesc;
      form.MfgLineDesc = choiceRow.value.MfgLineDesc;
      form.OrderStatusDesc = choiceRow.value.OrderStatusDesc;
      form.Qty = choiceRow.value.Qty;
      form.Side = choiceRow.value.Side;
      form.ERPOrder = choiceRow.value.ERPOrder;
      dialogVisible.value = false;
      barCodeRef.value.focus();
    } else {
      // ElMessageBox.alert(data.msg, "提示", {
      //   confirmButtonText: "确定",
      //   callback: (action: any) => {
      //     // console.log(action);
      //     dialogVisible.value = false;
      //     barCodeRef.value.focus()
      //   },
      // });
      ElMessageBox.confirm(data.msg, "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      })
        .then(() => {
          form.MfgOrderName = choiceRow.value.MfgOrderName;
          form.BD_ProductModel = choiceRow.value.BD_ProductModel;
          form.ProductName = choiceRow.value.ProductName;
          form.ProductDesc = choiceRow.value.ProductDesc;
          form.MfgLineDesc = choiceRow.value.MfgLineDesc;
          form.OrderStatusDesc = choiceRow.value.OrderStatusDesc;
          form.Qty = choiceRow.value.Qty;
          form.Side = choiceRow.value.Side;
          form.ERPOrder = choiceRow.value.ERPOrder;
          dialogVisible.value = false;
          refreshClick()
          barCodeRef.value.focus();
        })
        .catch(() => {

        });
    }
    checkList.value = ["待镭雕", "未释放"];
    msgTitle.value = "";
    barCode.value = "";
  });
};

const refreshClick = () => {
  if (form.MfgOrderName == "") {
    return;
  }
  OrderSNQuery({
    orderName: form.MfgOrderName,
    IsVerify: false,
  }).then((data: any) => {
    if (!data.success) {
      tableData.value = [];
      return;
    }
    Completed.value = [];
    awaitLaser.value = [];
    notReleased.value = [];
    // const dataText = JSON.parse(data.content);
    // if(data.success){

    // }
    console.log(data);
    
    tableData.value = data.content;
    checkList.value = ["待镭雕", "未释放"];
    Completed.value = tableData.value.filter(
      (item) => item.IsResponse === "已完成"
    );
    awaitLaser.value = tableData.value.filter(
      (item) => item.IsResponse === "待镭雕"
    );
    notReleased.value = tableData.value.filter(
      (item) => item.IsResponse === "未释放"
    );
  });
};

const cellClass = (row: any) => {
  if (row.columnIndex === 0) {
    return "addAllSelectClass";
  }
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
  let fontSizeNum = 16;
  let width = 0;
  const html = document.createElement("span");
  html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${fontSizeNum}px; font-family: Arial, sans-serif;`;
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
  return getMaxLength(arr) + 25 + "px";
};
</script>

<style lang="scss" scoped>
.inbound .el-form-item__label {
  font-size: 16px;
}

.setwidth {
  flex: 0 0 320px;
}

.box {
  border-right: 2px solid #dadbde;
}

// :deep(.el-table th.el-table__cell .el-checkbox) {
//   display: none;
// }

//去除复选框头部
::v-deep .el-table__header-wrapper {
  .el-checkbox__inner {
    display: none;
  }
}

//添加全选样式
::v-deep .el-table .addAllSelectClass .cell::before {
  content: "选择";
  // text-align: center;
  //   margin-left: 5px;
  //   /** 文本1 */
  // font-size: 16px;
  // font-weight: 400;
  // letter-spacing: 0px;
  // line-height: 23.17px;
  // color: rgba(128, 128, 128, 1);
}

// .table_wrapper {
//     .disabledCheck .cell {
//       visibility: hidden;
//     }
//   }

/* 如果你只想隐藏特定元素的滚动条，可以这样做 */
.custom-scrollbar-hidden {
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;

  /* IE 和 Edge */
  &::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
  }
}

::v-deep .laser-table-filter .el-checkbox__inner {
  /* 你的样式 */
  background-color: #409eff !important;
  /* 使用 !important，但请谨慎 */
  color: white !important;
}

::v-deep .laser-table-filter .el-checkbox__label {
  /* 你的样式 */
  color: white !important;
  font-size: 1.1rem;
}

.saveAsDialog {
  min-width: 954px;
}
</style>

<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
