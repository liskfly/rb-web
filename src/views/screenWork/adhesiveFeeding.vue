<template>
    <div class="flex flex-col w-full h-full">
      <div
        class="h-[40px] min-h-[40px] pl-2 pr-2 flex justify-between items-center"
      >
        <span class="text-[1.2rem]">{{ title.stationDec }}</span>
        <div>
          <el-button type="primary" @click="dialogVisible = true"
            >生产计划号开工</el-button
          >
          <!-- <el-button type="primary">条码转生产计划号</el-button> -->
        </div>
      </div>
      <div class="w-full flex-1 flex">
        <div class="setwidth w-[320px]">
          <div class="w-full h-full box">
            <div
              class="h-[35px] flex items-center text-xl text-[#fff] bg-[#006487]"
            >
              <span class="ml-5">基本信息</span>
            </div>
            <div
              class="p-[10px] overflow-auto custom-scrollbar-hidden"
              :style="{ height: formHeight + 'px' }"
            >
              <el-form
                class="inbound"
                ref="formRef"
                :model="form"
                label-width="auto"
              >
                <el-form-item
                  size="default"
                  v-for="f in formHeader"
                  :key="f.value"
                  :label="f.lable"
                >
                  <span class="font-bold text-[18px] leading-[30px]">
                    {{ formText(f.value) }}</span
                  >
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="w-[calc(100%-320px)]">
          <div class="w-full h-full flex flex-col">
            <div>
              <div
                class="h-[35px] flex items-center text-xl text-[#fff] bg-[#006487]"
              >
                <span class="ml-5"> 扫描条码</span>
              </div>
              <div class="h-[120px] p-5">
                <el-form
                  class="inbound"
                  ref="formRef"
                  :model="form"
                  label-width="auto"
                  @submit.native.prevent
                >
                  <el-form-item label="扫描条码">
                    <el-input
                      v-model="barCode"
                      style="width: 500px"
                      placeholder="请扫描条码"
                      @keyup.enter="choiceOrder()"
                    />
                  </el-form-item>
                </el-form>
                <div class="text-xl font-bold text-[#00B400]">
                  请扫描包装批次条码
                </div>
              </div>
            </div>
            <div class="flex flex-col flex-1">
              <div
                class="h-[35px] flex items-center text-xl justify-between text-[#fff] bg-[#006487]"
              >
                <span class="ml-5"> PCB条码列表</span>
                <el-icon @click="refreshClick()" class="mr-4"><RefreshRight /></el-icon>
              </div>
              <div class="h-full">
                <table-tem
                  :showIndex="true"
                  :tableData="tableData"
                  :tableHeight="tableHeight"
                  :columnData="columnData"
                  :pageObj="pageObj"
                  @handleSizeChange="handleSizeChange"
                  @handleCurrentChange="handleCurrentChange"
                ></table-tem>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        v-model="dialogVisible"
        title="生产计划号开工"
        width="90%"
        align-center
      >
        <template #header>
          <div class="custom-dialog-title flex items-center justify-between">
            <div>生产计划号列表</div>
            <!-- 在标题右侧插入一个按钮 -->
            <el-input
              v-model="workOrderInput"
              style="width: 400px"
              placeholder="请输入"
            >
              <template #append>
                <el-button type="primary" icon="Search"></el-button> </template
            ></el-input>
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
        <el-table
          ref="taskTableRef"
          class="test"
          :header-cell-class-name="cellClass"
          stripe
          border
          :data="workOrderList1"
          style="width: 100%"
          :height="'50vh'"
          @select="selectClick"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-for="item in formHeader"
            :prop="item.value"
            :label="item.lable"
          />
        </el-table>
        <div class="w-full mt-3 flex justify-around">
          <el-pagination
            size="large"
            background
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="pageObj.currentPage"
            :page-size="pageObj1.pageSize"
            :page-sizes="[5, 10, 20, 50, 100]"
            layout="total,sizes, prev, pager, next, jumper"
            :total="workOrderList.length"
          >
          </el-pagination>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="sureClick">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ElMessage } from "element-plus";
  import tableTem from "@/components/tableTem/index.vue";
  // import { getLaserWorkOrder } from "@/api/smt1";
  import { getMaterialInformation, OrderSNQuery, getLaserWorkOrder } from "@/api/smtApi";
  import { useAppStore } from "@/stores/modules/app";
  import { watch } from "vue";
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
    RMANumber: string;
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
  const title = appStore.getOPUIReal();
  
  const workOrderList = ref<OrderList[]>([]);
  const workOrderList1 = ref<OrderList[]>([]);
  const workOrderInput = ref<string>("");
  const form = reactive<Form>({
    MfgOrderName: "",
    PlannedStartDate: "",
    PlannedCompletionDate: "",
    RMANumber: "",
    Qty: "",
    ProductName: "",
    BD_ProductModel: "",
    ProductDesc: "",
    OrderStatusDesc: "",
    MfgLineDesc: "",
  });
  const formHeader = reactive<FormHeader[]>([
    {
      lable: "生产计划号",
      value: "MfgOrderName",
    },
    // {
    //   lable: "产品机型",
    //   value: "BD_ProductModel",
    // },
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
      lable: "状态",
      value: "OrderStatusDesc",
    },
    {
      lable: "开始时间",
      value: "PlannedStartDate",
    },
    {
      lable: "结束时间",
      value: "PlannedCompletionDate",
    },
    {
      lable: "面号",
      value: "RMANumber",
    },
    {
      lable: "计划数量",
      value: "Qty",
    }
  ]);
  const tableData = ref([]);
  const showIndex = ref(true);
  const tableHeight = ref(0);
  const formHeight = ref(0);
  const columnData = reactive([
    {
      text: true,
      prop: "SN",
      label: "PCB条码",
      width: "",
      align: "1",
    },
    // {
    //   text: true,
    //   prop: "OrderNumber",
    //   label: "生产计划号",
    //   width: "",
    //   align: "1",
    // },
    {
      text: true,
      prop: "MaterialBatchNo",
      label: "物料包装条码",
      width: "",
      align: "1",
    },
    {
      text: true,
      prop: "ReleasedDate",
      label: "拆包时间",
      width: "",
      align: "1",
    },
    {
      text: true,
      prop: "Sequence",
      label: "包装批次",
      width: "",
      align: "1",
    },
    {
      text: true,
      prop: 'IsResponse',
      label: "状态",
      width: "",
      align: "1",
    },
    {
      text: true,
      prop: 'LastResponseDate',
      label: "完成时间",
      width: "",
      align: "1",
    }
    // {
    //   text: true,
    //   prop: "",
    //   label: "",
    //   width: "",
    //   align: "1",
    // },
  ]);
  
  const pageObj = ref({
    pageSize: 100,
    currentPage: 1,
  });
  const pageObj1 = ref({
    pageSize: 100,
    currentPage: 1,
  });
  
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
  const table1 = (newdata: any) => {
    let searchName = newdata.toLowerCase();
    return workOrderList.value.filter((v: any) => {
      return v["MfgOrderName"].indexOf(searchName) > -1;
    });
  };
  
  onBeforeMount(() => {
    getScreenHeight();
    getOrderList();
  });
  onMounted(() => {
    window.addEventListener("resize", getScreenHeight);
  });
  onBeforeUnmount(() => {
    window.addEventListener("resize", getScreenHeight);
  });
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
      tableHeight.value = window.innerHeight - 365;
      formHeight.value = window.innerHeight - 165;
    });
  };
  const getOrderList = () => {
    getLaserWorkOrder({ orderID: "" }).then((data: any) => {
      // const dataText = JSON.parse(data.data);
      // workOrderList.value = [...dataText,{},{}];
      workOrderList.value = data.data;
      workOrderList1.value = data.data;
    });
  };
  const choiceOrder = () => {
    if (form.MfgOrderName === '') {
      ElMessage({
        message: "请选择生产计划号",
        type: "warning",
      });
      barCode.value = '';
      return;
    }
    getMaterialInformation({
      OrderID: form.MfgOrderName,
      Barcode: barCode.value,
      Mcid: "LASER-01",
    }).then((data: any) => {
      barCode.value = '';
      if (!data) {
        return;
      }
      // const dataText = JSON.parse(data.content);
      tableData.value = data.content;
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
      OrderID: choiceRow.value.MfgOrderName
    }).then((data: any) => {
      // const dataText = JSON.parse(data.content);
      tableData.value = data.content;
      // console.log(dataText);
    })
    form.MfgOrderName = choiceRow.value.MfgOrderName;
    form.BD_ProductModel = choiceRow.value.BD_ProductModel;
    form.ProductName = choiceRow.value.ProductName;
    form.ProductDesc = choiceRow.value.ProductDesc;
    form.MfgLineDesc = choiceRow.value.MfgLineDesc;
    form.OrderStatusDesc = choiceRow.value.OrderStatusDesc;
    form.PlannedStartDate = choiceRow.value.PlannedStartDate;
    form.PlannedCompletionDate = choiceRow.value.PlannedCompletionDate;
    form.Qty = choiceRow.value.Qty;
    form.RMANumber = choiceRow.value.RMANumber;
    dialogVisible.value = false;
  };
  
  const refreshClick = () => {
    OrderSNQuery({
      OrderID: form.MfgOrderName
    }).then((data: any) => {
      // const dataText = JSON.parse(data.content);
      tableData.value = data.content;
      // console.log(dataText);
    })
  }
  
  
  const cellClass = (row:any) =>{
   
   if(row.columnIndex === 0){
  
     return 'addAllSelectClass'
   }
   
  
  }
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
  ::v-deep .el-table__header-wrapper{
    .el-checkbox__inner{
        display: none;
    }
    }
   
   
  //添加全选样式
  ::v-deep .el-table .addAllSelectClass .cell::before{
    content: '选择';
    text-align: center;
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
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 和 Edge */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  }
  </style>
  