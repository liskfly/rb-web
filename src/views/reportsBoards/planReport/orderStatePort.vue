<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div ref="headerRef">
        <el-form ref="formRef" :inline="true" size="small">
          <el-form-item label="时间" class="mb-2">
            <el-date-picker
              :shortcuts="shortcuts"
              v-model="searchDate"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              size="small"
              style="width: 200px"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item label="计划单号" class="mb-2">
            <el-input
              style="width: 150px"
              v-model="getForm.PlanNo"
              placeholder=""
              clearable
              @change="getData"
            ></el-input>
          </el-form-item>
          <el-form-item label="计划类型" class="mb-2">
            <el-select v-model="getForm.OrderTypeName" style="width: 152px">
              <el-option
                v-for="item in OrderTypeList"
                :key="item.OrderTypeName"
                :label="item.Description"
                :value="item.OrderTypeName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="" class="mb-2">
            <el-button type="primary" @click="getData()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <noAuto
        :show-index="true"
        size="small"
        :tableData="tableData"
        :tableHeight="tableHeight"
        :columnData="columnData"
        :page-size="getForm.PageSize"
        :current-page="getForm.PageNumber"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        @rowClick="rowClick"
        :total="total1"
      >
      </noAuto>
      <noAuto
        :show-index="true"
        size="small"
        :tableData="detailData"
        :tableHeight="detailHeight"
        :columnData="detailColumn"
        :page-size="detailForm.PageSize"
        :current-page="detailForm.PageNumber"
        @handleSizeChange="handleSizeChange1"
        @handleCurrentChange="handleCurrentChange1"
        :total="total2"
      >
      </noAuto>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  watch,
  computed,
  nextTick,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import noAuto from "@/components/tableTem/noAuto.vue";
import tableTemp from "@/components/tableTemp/index.vue";
import { shortcuts, setTodayDate, setLastDate } from "@/utils/dataMenu";
import {
  ElMessageBox,
  ElMessage,
  ElLoading,
  ElNotification,
} from "element-plus";
import {
  PlanProgressQuery,
  QueryOrderType,
  QueryOrderContainer,
} from "@/api/report";
import { log } from "vxe-table";
const getForm = ref({
  PlanNo: "",
  PlanStartTime: "",
  PlanEndTime: "",
  OrderTypeName: "",
  PageNumber: 1,
  PageSize: 100,
});
const detailForm = ref({
  PlanNo: "",
  PlanStartTime: "",
  PlanEndTime: "",
  OrderTypeName: "",
  PageNumber: 1,
  PageSize: 100,
});
const searchDate = ref<any[]>([]);
const total1 = ref(0);
const total2 = ref(0);
const headerRef = ref();
const tableHeight = ref(0);
const detailHeight = ref(0);
const tableData = ref<any>([]);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});
const OrderTypeList = ref<any[]>([]);
const columnData = reactive([
  {
    text: true,
    prop: "PlannedStartDate",
    label: "生产时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "WorkCenterDesc",
    label: "车间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MfgLineDesc",
    label: "产线名称",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "MfgOrderName",
    label: "计划单号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ProductName",
    label: "产品编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ProductModel",
    label: "机型",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "OrderStatusDesc",
    label: "工单状态",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "WorkflowName",
    label: "工艺流程",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "工单数量",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "countnum",
    label: "完成数量",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "onlinenum",
    label: "在制数量",
    width: "",
    min: true,
    align: "1",
  },
]);
const detailData = ref([]);
const detailColumn = reactive([
  {
    text: true,
    prop: "containername",
    label: "条码",
    width: "",
    min: true,
    align: "1",
  },
  // {
  //   text: true,
  //   prop: "MfgOrderName",
  //   label: "生产计划号",
  //   width: "",
  //   min: true,
  //   align: "1",
  // },
  {
    text: true,
    prop: "SpecName",
    label: "工序序号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "SpecDesc",
    label: "工序名称",
    width: "",
    min: true,
    align: "1",
  },
//   {
//     text: true,
//     prop: "Qty",
//     label: "生产数量",
//     width: "",
//     min: true,
//     align: "1",
//   },
]);

watch(
  () => searchDate.value,
  (newVal: any, oldVal: any) => {
    // if (newVal === null) {
    //     getForm.value.PlanStartTime = "";
    //     getForm.value.PlanEndTime = "";
    //     getData();
    //     return;
    // }

    if (!isDateWithinLastThreeMonths(newVal[0])) {
      ElNotification({
        title: "提示信息",
        message: "日期请选择三个月内",
        type: "error",
      });
      newVal = oldVal;
      searchDate.value = oldVal;
      return;
    }
    if (newVal !== oldVal) {
      getForm.value.PlanStartTime = newVal[0];
      getForm.value.PlanEndTime = newVal[1];
      if (getForm.value.PlanNo !== "") {
        getData();
      }
    }
  }
);
onBeforeMount(() => {
  let end: string = setTodayDate();
  let start: string = setLastDate();
  searchDate.value = [start, end];
});

onMounted(() => {
  getTypeList();
  getScreenHeight();
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
  PlanProgressQuery(getForm.value).then((res: any) => {
    if (res && res.success) {
      if (res.content === null) {
        tableData.value = [];
        total1.value = 0;
        return;
      }
      tableData.value = res.content;
      total1.value = res.total;
    }
  });
};

const getTypeList = () => {
  QueryOrderType().then((res: any) => {
    if (res.success) {
      getForm.value.OrderTypeName = res.content[0].OrderTypeName;
      OrderTypeList.value = res.content;
    }
  });
};

const isDateWithinLastThreeMonths = (inputDateStr: any) => {
  // 获取今天的日期
  const today = new Date();

  // 将输入字符串转换为日期对象
  const inputDate = new Date(inputDateStr);

  // 检查输入日期是否有效
  if (isNaN(inputDate.getTime())) {
    console.error("Invalid date input");
    return false;
  }

  // 获取当前日期的年月日
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth(); // 注意：getMonth() 返回的月份是从0开始的（0-11）
  const todayDay = today.getDate();

  // 计算三个月前的日期
  // 注意：这里我们使用setMonth()方法，它会自动处理月份溢出（例如，从1月减去1个月会变成上一年的12月）
  let threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(todayMonth - 3);

  // 如果三个月前是上一年的某个月份，并且今天的日期小于该月对应日期的天数，则需要调整日期
  // 例如，如果今天是1月31日，三个月前是上一年的10月，但10月只有30天或31天（取决于是否是闰年），所以我们需要取10月的最后一天
  if (threeMonthsAgo.getMonth() + 3 !== todayMonth) {
    // 重置日期为三个月前的月份的最后一天
    threeMonthsAgo.setDate(0); // setDate(0) 会将日期设置为上一个月的最后一天
  } else {
    // 如果还在同一年，则可能需要处理日期的回退（例如，从1月31日到10月31日不存在，应该退到10月的最后一天）
    // 但由于我们已经用了setDate(0)的逻辑来处理跨月情况（尽管在这里它不会执行，因为月份相同），
    // 并且我们的比较是允许等于三个月前的日期的，所以我们不需要额外的日期回退逻辑。
    // 然而，为了保持代码的完整性，我们可以保留下面的注释或检查，尽管它在这个特定情况下是多余的。
    // const lastDayOfMonth = new Date(threeMonthsAgo.getFullYear(), threeMonthsAgo.getMonth() + 1, 0).getDate();
    // if (todayDay > lastDayOfMonth) {
    //     // 如果今天的日期大于三个月前月份的天数，则应该回退到该月的最后一天（但这里不需要，因为我们已经允许等于）
    // }
  }

  // 由于setDate(0)已经将日期设置为上一个月的最后一天，如果我们需要的是三个月前的确切日期（可能不是最后一天），
  // 我们需要再次调整日期。但在这个问题中，我们只需要确保输入日期不早于三个月前的任何一天，
  // 所以我们可以直接使用threeMonthsAgo（它现在是三个月前月份的最后一天或更早的一个有效日期）。

  // 比较输入日期和三个月前的日期
  return inputDate >= threeMonthsAgo;
};
const getDetail = () => {
  QueryOrderContainer(detailForm.value).then((res: any) => {
    if (res && res.success) {
      if (res.content === null) {
        detailData.value = [];
        total2.value = 0;
        return;
      }
      detailData.value = res.content;
      total2.value = res.total;
    }
  });
};
const rowClick = (row: any) => {
    detailForm.value.PlanNo = row.MfgOrderName;
    getDetail();
};
const handleSizeChange = (val: any) => {
  getForm.value.PageNumber = 1;
  getForm.value.PageSize = val;
  getData();
};
const handleCurrentChange = (val: any) => {
  getForm.value.PageNumber = val;
  getData();
};
const handleSizeChange1 = (val: any) => {
  detailForm.value.PageNumber = 1;
  detailForm.value.PageSize = val;
  getDetail();
};
const handleCurrentChange1 = (val: any) => {
  detailForm.value.PageNumber = val;
  getDetail();
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = (window.innerHeight - 245) * 0.5;
    detailHeight.value = (window.innerHeight - 245) * 0.5;
  });
};
</script>

<style scoped></style>
