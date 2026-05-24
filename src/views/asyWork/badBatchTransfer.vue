<template>
  <div class="">
    <div class="w-full flex-1 flex">
      <div class="w-full h-full flex flex-col">
        <div>
          <div
            class="h-[35px] flex items-center justify-between text-lg text-[#fff] bg-[#006487]"
          >
            <span class="ml-5"> 扫描条码</span>
            <div>
              <el-button type="warning" @click="openDia">送检</el-button>
            </div>
          </div>
          <div class="h-[120px] p-5">
            <el-form
              class="inbound"
              ref="formRef"
              :inline="true"
              :model="form"
              label-width="auto"
              @submit.native.prevent
            >
              <el-form-item label="扫描条码">
                <el-input
                  v-model.trim="ContainerName"
                  ref="inputRef"
                  style="width: 500px"
                  placeholder="请扫描条码"
                  @keyup.enter.native="inputGetData"
                />
              </el-form-item>
            </el-form>
            <div
              class="text-xl font-bold text-[#00B400]"
              v-show="msgType === true || msgTitle === ''"
            >
              {{ msgTitle === "" ? "请扫描条码" : msgTitle }}
            </div>
            <div
              class="text-xl font-bold text-[red]"
              v-show="msgType === false && msgTitle !== ''"
            >
              {{ msgTitle }}
            </div>
          </div>
        </div>
        <div class="flex flex-col flex-1">
          <div
            class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]"
          >
            <span class="ml-5">维修记录</span>
          </div>
          <div class="flex-1">
            <el-table
              size="default"
              :data="tableData"
              ref="multipleTable"
              border
              :height="tableHeight"
              :row-key="rowKey"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="45"
                label="选择"
                align="center"
              />
              <el-table-column
                type="index"
                label="序号"
                width="60"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="MfgOrderName"
                label="工单号"
                align="center"
                :min-width="flexColumnWidth('工单号', 'MfgOrderName')"
              >
              </el-table-column>
              <el-table-column
                prop="ContainerName"
                label="成品条码"
                align="center"
                :min-width="flexColumnWidth('成品条码', 'ContainerName')"
              >
              </el-table-column>
              <el-table-column
                prop="QAOrder"
                label="送检单"
                align="center"
                :min-width="flexColumnWidth('送检单', 'QAOrder')"
              >
              </el-table-column>
              <el-table-column
                prop="ProductName"
                label="产品编码"
                align="center"
                :min-width="flexColumnWidth('产品编码', 'ProductName')"
              >
              </el-table-column>
              <el-table-column
                prop="ProductDescription"
                label="产品描述"
                align="center"
                :min-width="flexColumnWidth('产品描述', 'ProductDescription')"
              >
              </el-table-column>
              <el-table-column
                prop="Specdesc"
                label="工序描述"
                align="center"
                :min-width="flexColumnWidth('工序描述', 'Specdesc')"
              >
              </el-table-column>
              <el-table-column
                prop="QATime"
                label="检验时间"
                align="center"
                :min-width="flexColumnWidth('检验时间', 'QATime')"
              >
              </el-table-column>
              <el-table-column
                prop="QAResult"
                label="抽检结果"
                align="center"
                :min-width="flexColumnWidth('抽检结果', 'QAResult')"
              >
                <template #default="scope">
                  <div v-if="scope.row.QAResult === 'Y'">合格</div>
                  <div v-if="scope.row.QAResult === 'N'">不合格</div>
                  <div v-if="scope.row.QAResult === ''"></div>
                </template>
              </el-table-column>
              <el-table-column
                prop="InSpecResult"
                label="检验单结果"
                align="center"
                :min-width="flexColumnWidth('检验单结果', 'InSpecResult')"
              >
                <template #default="scope">
                  <div v-if="scope.row.InSpecResult === 'Y'">合格</div>
                  <div v-if="scope.row.InSpecResult === 'N'">不合格</div>
                </template>
              </el-table-column>
            </el-table>
            <div class="block" style="margin-top: 15px">
              <el-pagination
                align="center"
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchForm.CurrentPage"
                :page-size="searchForm.PageSize"
                :page-sizes="[5, 10, 20, 50, 100]"
                layout="total,sizes, prev, pager, next, jumper"
                :total="total"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      width="70%"
      title="单号详情"
      align-center
      @close="filterTableData = []"
    >
      <div class="w-full">
        <div class="table_container">
          <el-form
            ref="formRef"
            class="form"
            :inline="true"
            label-width="85px"
          >
            <el-form-item label="工单号">
              <el-input
                v-model="form.MfgOrderName"
                style="width: 152px"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="产品编码">
              <el-input
                v-model="form.ProductName"
                style="width: 152px"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="工序编码">
              <el-input
                v-model="form.SpecName"
                style="width: 152px"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item> -->
            <!-- <el-form-item label="工序描述">
              <el-input
                v-model="form.SpecDesc"
                style="width: 152px"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item> -->
            <el-form-item label="产品描述">
              <el-input
                style="width: 420px"
                v-model="form.Description"
                class="input-with-select"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item label="申请类型">
              <el-select
                v-model="WorkFlowStep"
                placeholder="Select"
                style="width: 152px"
              >
                <el-option
                  v-for="item in workList"
                  :key="item.WorkflowStepName"
                  :label="item.Description"
                  :value="item.WorkflowStepName"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="" @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { shortcuts } from "@/utils/dataMenu";
import {
  ElMessageBox,
  ElMessage,
  ElLoading,
  ElNotification,
} from "element-plus";
import { useUserStoreWithOut } from "@/stores/modules/user";
import {
  SavePackagingBoxNumber,
  ScanPackagingBoxNumberInfo,
  ScanContainerDetails,
  bbfQueryWorkflowList,
} from "@/api/asyApi";
import { useAppStore } from "@/stores/modules/app";
import { ProductInspectDetailsHistory } from "@/api/report";
import type { InspectionResult } from "@/typing";
import {
  ref,
  reactive,
  watch,
  nextTick,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
const total = ref(0);
const appStore = useAppStore();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const loginName = userStore.getUserInfo;
const tableData = ref<any>([]);
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const order = ref("");
const choiceList = ref<any[]>([]);
const filterTableData = ref<any[]>([]);
const boxTableData = ref<any[]>([]);
const interval = ref<any>(null);
const multipleTable = ref();
const date = ref();
const IsPrint = ref(false);
const activeName = ref("shelveMaterial");
const ContainerName = ref("");
const workList = ref<any[]>([]);
const WorkFlowStep = ref("");
const msgTitle = ref("");
const msgType = ref(true);
const getDataText = reactive({
  inspectType: "",
  inspect: "",
  dateStart: "",
  dateEnd: "",
});
const selectForm = ref({
  MfgOrderName: "",
  ProductModel: "",
  ProductName: "",
  ProductDesc: "",
  QTY: null,
});
const orderNumber = ref("order");
const orderList = ref([
  {
    lable: "单号",
    value: "order",
  },
  {
    lable: "时间",
    value: "times",
  },
]);
const form = ref({
  containername: "",
  MfgOrderName: "",
  ProductName: "",
  Description: "",
  SpecName: "",
  SpecDesc: "",
  WorkflowName: "",
});
const value1 = ref([]);
const dialogVisible = ref(false);
const searchForm = ref({
  MfgOrderName: "",
  StartTime: "",
  EndTime: "",
  PageSize: 10,
  CurrentPage: 1,
});

watch(
  () => value1.value,
  (data) => {
    console.log(data);
    getDataText.dateStart = data[0];
    getDataText.dateEnd = data[1];
  }
);

// watch(() => inquire.value, (newData, oldData) => {
//   if (newData == "times") {
//     getDataText.inspect = "*";
//   } else {
//     getDataText.inspect = "";
//   }
//   if (newData != oldData) {
//     getDataText.inspectType = "";
//   }
// })
onBeforeMount(() => {
  getScreenHeight();
});

onMounted(() => {
  // interval.value = setInterval(() => {
  //   getData(order.value);
  // }, 2000);
  window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
  // clearInterval(interval.value);
  window.addEventListener("resize", getScreenHeight);
});

const handleSelectionChange = (data: any) => {
  choiceList.value = data;
};

const dateChange = () => {
  if (date.value !== null && date.value.length !== 0) {
    searchForm.value.StartTime = date.value[0];
    searchForm.value.EndTime = date.value[1];
  } else {
    searchForm.value.StartTime = "";
    searchForm.value.EndTime = "";
  }
};

const inputGetData = () => {
  ScanPackagingBoxNumberInfo(ContainerName.value).then((res: any) => {
    // if (res.success) {
    tableData.value = res.content;
    // }
    ContainerName.value = '';
    msgTitle.value = res.msg;
    msgType.value = res.success;
  });
};

const submit = () => {
  SavePackagingBoxNumber({
    CreatedBy: loginName,
    WorkFlowStep: WorkFlowStep.value,
    scanPackagingBoxNumberitems: choiceList.value,
    WorkstationName:opui.station
  }).then((res: any) => {
    dialogVisible.value = false;
    msgTitle.value = res.msg;
    msgType.value = res.success;
  });
};

const openDia = async () => {
  if (choiceList.value.length === 0) {
    return;
  }
  let request1: any = false;
  let request2 = false;
  await ScanContainerDetails(choiceList.value[0].ContainerName).then(
    (res: any) => {
      if (res && res.success) {
        form.value = res.content[0];
        request1 = true;
      } else {
        msgTitle.value = res.msg;
        msgType.value = res.success;
      }
    }
  );
  await bbfQueryWorkflowList(choiceList.value[0].WorkflowName).then(
    (res: any) => {
      if (res && res.success && res.content.length !== 0) {
        request2 = true;
        workList.value = res.content;
        WorkFlowStep.value = res.content[0].WorkflowStepName
          ? res.content[0].WorkflowStepName
          : "";
      } else {
        msgTitle.value = res.msg;
        msgType.value = res.success;
      }
    }
  );
  if (request1 && request2) {
    dialogVisible.value = true;
  }
};

const rowKey = (row: any) => {
  return row.PackagingBoxNumber;
};

const selectable = (row: any) => {
  // if (row.QAResult === "N" || row.QAResult === null) {
  //   return false;
  // }
  // if (row.StorageSta === "StorageHalfway" || row.StorageSta === "Storage") {
  //   return false;
  // }
  return true;
};

const getMaxLength = (arr: any) => {
  return arr.reduce((acc: any, item: any) => {
    if (item) {
      // console.log(acc,item);
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
  html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${16}px; font-family: Arial, sans-serif;`;
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

const inStore = () => {
  // if (choiceList.value.length === 0) {
  //     ElNotification({
  //       title: "提示信息",
  //       message: '请选择',
  //       type: "warning",
  //     });
  //     return;
  // }
  let arr: any = [];
  choiceList.value.forEach((element) => {
    if (
      arr.some((obj: any) => obj.InspectionOrder === element.InspectionOrder)
    ) {
    } else {
      arr.push(element);
    }
  });
};

const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
};

const handleSizeChange = (val: any) => {
  searchForm.value.CurrentPage = 1;
  searchForm.value.PageSize = val;
};
const handleCurrentChange = (val: any) => {
  searchForm.value.CurrentPage = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 320;
  });
};
</script>

<style lang="scss" scoped></style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
