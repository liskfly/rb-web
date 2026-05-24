<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0px 8px' }">
      <div ref="headerRef flex flex-col">
        <el-form ref="formRef" class="form" :inline="true" size="small">
          <!-- <div>
              </div> -->
          <el-form-item label="记录时间" class="mb-[5px]">
            <el-date-picker
              :shortcuts="shortcuts"
              v-model="searchDate"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              size="small"
              style="width: 200px"
            />
          </el-form-item>
          <!-- <el-form-item label="编程器序列号" class="mb-[5px]">
              <el-input v-model="searchForm.productName" clearable style="width: 150px" class="input-with-select">
              </el-input>
            </el-form-item> -->
          <el-form-item label="计划号" class="mb-[5px]">
            <el-input
              v-model="searchForm.PlanNo"
              clearable
              style="width: 150px"
              class="input-with-select"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="mb-[5px]">
            <el-button type="primary" @click="getTableData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_container">
        <!-- <table-tem size="small" :show-select="true" :tableData="tableData" :tableHeight="tableHeight"
            :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange" @rowClick="rowClick" 
            @handleSelectionChange="handleSelectionChange"></table-tem>       -->
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
          highlight-current-row
          @row-click="rowClick"
        >
          <el-table-column type="index" width="50" />
          <el-table-column
            prop="mfgOrderName"
            label="计划号"
            :min-width="flexColumnWidth('计划号', 'mfgOrderName')"
          >
          </el-table-column>
          <el-table-column
            prop="productname"
            align="center"
            label="物料编码"
            :min-width="flexColumnWidth('物料编码', 'productname')"
          >
          </el-table-column>
          <el-table-column
            prop="Description"
        
            label="物料名称"
            :min-width="flexColumnWidth('物料名称', 'Description')"
          >
          </el-table-column>
          <el-table-column
            prop="CreatedOn"
            align="center"
            label="记录时间"
            :min-width="flexColumnWidth('记录时间', 'CreatedOn')"
          >
          </el-table-column>
        </el-table>
        <div class="mt-2">
          <el-pagination
            size=""
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
        <!-- <el-divider /> -->
      </div>
      <div class="w-full mb-2 mt-2 flex justify-between">
        <div class="w-[48%]">
          <table-tem
            size="small"
            :show-index="true"
            :tableData="tableData1"
            :tableHeight="tableHeight"
            :columnData="columnData"
            :pageObj="pageObj1"
            @row-click="leftClick"
          ></table-tem>
        </div>
        <div class="w-[48%]">
          <table-tem
            size="small"
            :tableData="tableData2"
            :tableHeight="tableHeight"
            :columnData="columnData1"
            :pageObj="pageObj2"
          ></table-tem>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { shortcuts, setTodayDate, setLastDate } from "@/utils/dataMenu";
import { OrganData } from "@/utils/dataMenu";
import {
  ElMessageBox,
  ElMessage,
  ElLoading,
  ElNotification,
} from "element-plus";
import { cloneDeep } from "lodash-es";
import tableTem from "@/components/tableTem/index.vue";
import { useUserStoreWithOut } from "@/stores/modules/user";
import {
  getBurningData,
  GetBurnProgDataSiteInfo,
  GetIOTBurnProgDataSlotInfo,
} from "@/api/reportsBoardsApi";
import {
  ref,
  reactive,
  watch,
  nextTick,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
interface searchFormTS {
  CreatedOnStart: string;
  CreatedOnEnd: string;
  DataGuid: string;
  PlanNo: string;
}

interface ShelfList {
  Shelf_id: string;
}

const searchForm = ref<searchFormTS>({
  CreatedOnStart: "",
  CreatedOnEnd: "",
  DataGuid: "",
  PlanNo: "",
});
const tableData = ref<any[]>([]);
const tableData1 = ref<any[]>([]);
const tableData2 = ref<any[]>([]);
const tableHeight = ref(0);
const userStore = useUserStoreWithOut();
const searchDate = ref<any>([]);
const feedTableData = ref<any>([]);
const choiceID1 = ref("");
const choiceID2 = ref("");

watch(
  () => searchDate.value,
  (newVal: any, oldVal) => {
    if (newVal === null) {
      searchForm.value.CreatedOnStart = "";
      searchForm.value.CreatedOnEnd = "";
      return [];
    }
    searchForm.value.CreatedOnStart = newVal[0];
    searchForm.value.CreatedOnEnd = newVal[1];
  }
);

const columnData = reactive([
  {
    text: true,
    prop: "SiteSN",
    label: "编程器序列号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Type",
    label: "编程器型号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "SlotNum",
    label: "编程器座子数",
    width: "",
    min: true,
    align: "center",
  },
]);

const columnData1 = reactive([
  {
    text: true,
    prop: "Index",
    label: "座子索引",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "SN",
    label: "座子席列号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Limited",
    label: "使用寿命",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Current",
    label: "累计使用次数",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Failcnt",
    label: "累计失败次数",
    width: "",
    min: true,
    align: "center",
  },
]);

onBeforeMount(() => {
  getScreenHeight();
  let end: string = setTodayDate();
  let start: string = setLastDate();
  searchDate.value = [start, end];
});

onMounted(() => {
  getScreenHeight();
  window.addEventListener("resize", getScreenHeight);
  // getModeList();
  // getStatusList();
  getTableData();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getTableData = () => {
  getBurningData(searchForm.value).then((res: any) => {
    feedTableData.value = [];
    tableData1.value = [];
    tableData2.value = [];
    if (!res || res.content === null) {
      tableData.value = [];
      return;
    }
    // console.log(res);
    tableData.value = res.content;
  });
};

const rowClick = (val: any) => {
  if (choiceID1.value !== val.HeadDataGuid) {
    GetBurnProgDataSiteInfo(val.HeadDataGuid).then((res: any) => {
      tableData1.value = [];
      tableData2.value = [];
      if (!res || res.content === null) {
        tableData1.value = [];
        return;
      }
      // console.log(res);
      tableData1.value = res.content;
    });
    choiceID1.value = val.DataGuid;
  }
};

const leftClick = (val: any) => {
  if (choiceID2.value !== val.DataGuid) {
    GetIOTBurnProgDataSlotInfo(val.DataGuid).then((res: any) => {
      tableData2.value = [];
      if (!res || res.content === null) {
        tableData2.value = [];
        return;
      }
      // console.log(res);
      tableData2.value = res.content.sort((a: any, b: any) => {
        return a.Index - b.Index;
      });
    });
    choiceID2.value = val.DataGuid;
  }
};

const feedOrganData = (organizations: any) => {
  const organizationMap = new Map();
  organizations.forEach((org: any) => {
    organizationMap.set(org.MaterialName, { ...org, children: [] });
  });
  organizations.forEach((org: any) => {
    if (org.originalMaterialName !== org.MaterialName) {
      const parentOrg = organizationMap.get(org.originalMaterialName);
      if (parentOrg) {
        parentOrg.children.push(organizationMap.get(org.MaterialName));
      }
    }
  });
  return Array.from(organizationMap.values()).filter(
    (org) => org.originalMaterialName == org.MaterialName
  );
};

const pageObj = ref({
  pageSize: 30,
  currentPage: 1,
});

const pageObj1 = ref({
  pageSize: 1000000,
  currentPage: 1,
  isShow: -1,
});

const pageObj2 = ref({
  pageSize: 1000000,
  currentPage: 1,
  isShow: -1,
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
    tableHeight.value = (window.innerHeight - 200) * 0.5;
  });
};
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

<style lang="scss" scoped>
.tab {
  font-size: 10px;
  color: aqua;
}
</style>
<style lang="scss">
.el-pagination {
  justify-content: center;
}

.el-tabs--border-card {
  border-top: 1px solid #006487;
}

.demo-tabs .el-tabs__header {
  --el-tabs-header-height: 30px;
  background-color: #006487 !important;
}

.demo-tabs .el-tabs__content {
  padding: 5px;
}

.demo-tabs .el-tabs__item {
}

.demo-tabs.el-tabs--border-card > .el-tabs__header .el-tabs__item {
  color: #fff;
  font-size: 0.8rem;
  // padding: 0 !important;
}

.demo-tabs .el-tabs__item.is-active {
  font-size: 0.8rem;
  // color: #fff;
  color: #006487 !important;
  // font-weight: bold;
}

.el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  font-size: 0.8rem;
  color: #006487 !important;
  background-color: rgba($color: #fff, $alpha: 0.8);
}
</style>
