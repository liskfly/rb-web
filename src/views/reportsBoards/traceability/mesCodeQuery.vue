<template>
  <div class="p-2 flex gap-[10px]">
    <el-card
      shadow="always"
      :body-style="{ padding: '8px' }"
      class="w-[700px] h-[calc(100vh-97px)]"
    >
      <div ref="headerRef">
        <el-form
          :inline="true"
          size="small"
          @submit.native.prevent
        >
          <el-form-item label="MES条码" class="mb-2">
            <el-input
              style="width: 150px"
              v-model="containername"
              placeholder=""
              clearable
              @keyup.enter.native="getData()"
            ></el-input>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData()">查询</el-button>
            <el-button class="relative" type="warning"
              >导入
              <input
                ref="fileInput"
                class="absolute top-0 left-0 w-[47.6px] h-[24px] opacity-0"
                type="file"
                @change="fileUpload"
              />
            </el-button>
          </el-form-item>
        </el-form>
        <!-- <table-tem
          :show-index="true"
          size="small"
          :tableData="tableData"
          :tableHeight="tableHeight"
          :columnData="columnData"
          :page-size="getForm.pageSize"
          :current-page="getForm.currentPage"
          :total="total1"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          @rowClick="rowClick"
        >
        </table-tem> -->
        <el-table
          :data="
            tableData.slice(
              (getForm.currentPage - 1) * getForm.pageSize,
              getForm.currentPage * getForm.pageSize
            )
          "
          size="small"
          stripe
          border
          fit
          :tooltip-effect="'dark'"
          :height="tableHeight"
          @rowClick="rowClick"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          />
          <el-table-column
            prop="containername"
            label="条码信息"
            :min-width="flexColumnWidth('条码信息', 'containername')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="containerLevelName"
            label="条码类型"
            :min-width="flexColumnWidth('条码类型', 'containerLevelName')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="PlannedStartDate"
            label="创建时间"
            :min-width="flexColumnWidth('创建时间', 'PlannedStartDate')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="Status"
            label="条码状态"
            :min-width="flexColumnWidth('条码状态', 'Status')"
            align="center"
          >
            <template #default="scope">
              <div>{{ returnType(scope.row.Status) }}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-2 mb-2 flex justify-around">
          <el-pagination
            :size="'default'"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pager-count="5"
            :current-page="getForm.currentPage"
            :page-size="getForm.pageSize"
            :page-sizes="[30, 50, 100, 200, 300]"
            layout="total,sizes, prev, pager, next"
            :total="tableData.length"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>

    <el-card
      shadow="always"
      :body-style="{ padding: '8px 8px 0 8px' }"
      class="flex-1"
    >
      <div>
        <el-form ref="formRef" :model="form" :inline="true" label-width="100px">
          <el-form-item label="创建时间:" class="mb-2" prop="CreateTime">
            <div class="w-[200px]">
              {{ form.CreateTime }}
            </div>
          </el-form-item>
          <el-form-item label="条码类型:" class="mb-2" prop="ContainerType">
            <div class="w-[200px]">
              {{ form.ContainerType }}
            </div>
          </el-form-item>
          <el-form-item label="条码:" class="mb-2" prop="ContainerName">
            <div class="w-[200px]">
              {{ form.ContainerName }}
            </div>
          </el-form-item>
          <el-form-item label="物料编码:" class="mb-2" prop="MaterialName">
            <div class="w-[200px]">
              {{ form.MaterialName }}
            </div>
          </el-form-item>
          <el-form-item label="供应商信息:" class="mb-2" prop="VendorName">
            <div class="w-[200px]">
              {{ form.VendorName }}
            </div>
          </el-form-item>
          <el-form-item label="工单号:" class="mb-2" prop="MfgOrderName">
            <div class="w-[200px]">
              {{ form.MfgOrderName }}
            </div>
          </el-form-item>
          <el-form-item label="产品编码:" class="mb-2" prop="ProductName">
            <div class="w-[200px]">
              {{ form.ProductName }}
            </div>
          </el-form-item>
          <el-form-item label="机型:" class="mb-2" prop="ProductModel">
            <div class="w-[200px]">
              {{ form.ProductModel }}
            </div>
          </el-form-item>
          <el-form-item label="装箱条码:" class="mb-2" prop="PackingBarcode">
            <div class="w-[200px]">
              {{ form.PackingBarcode }}
            </div>
          </el-form-item>
          <el-form-item label="条码状态:" class="mb-2" prop="Status">
            <div class="w-[200px]">
              {{ returnType(form.Status) }}
            </div>
          </el-form-item>
          <el-form-item label="是否烧录:" class="mb-2" prop="IsBurn">
            <div class="w-[200px]">
              {{ form.IsBurn ? "是" : "否" }}
            </div>
          </el-form-item>
          <!-- <el-form-item label="是否升级" class="mb-2">
            <el-input
              style="width: 150px"
              v-model="getForm.ContainerName"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item> -->
          <el-form-item label="是否测试:" class="mb-2" prop="IsBurnTEST">
            <div class="w-[200px]">
              {{ form.IsBurnTEST ? "是" : "否" }}
            </div>
          </el-form-item>
          <!-- <el-form-item label="是否维修" class="mb-2">
            <el-input
              style="width: 150px"
              v-model="getForm.ContainerName"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item> -->
          <el-form-item label="是否老化:" class="mb-2" prop="IsAging">
            <div class="w-[200px]">
              {{ form.IsAging ? "是" : "否" }}
            </div>
          </el-form-item>
          <el-form-item label="老化结果:" class="mb-2" prop="AgingResult">
            <div class="w-[200px]">
              {{ form.AgingResult }}
            </div>
          </el-form-item>
          <el-form-item label="是否返修:" class="mb-2" prop="IsRepair">
            <div class="w-[200px]">
              {{ form.IsRepair ? "是" : "否" }}
            </div>
          </el-form-item>
          <el-form-item label="返修结果:" class="mb-2" prop="AgingResult">
            <div class="w-[200px]">
              {{ form.RepairResult }}
            </div>
          </el-form-item>
          <el-form-item label="产品描述:" class="mb-2" prop="Description">
            <div class="w-[300px]">
              {{ form.Description }}
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// import { QueryMESContainer } from "@/api/report";
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
import tableTem from "@/components/tableTem/noAuto.vue";
import {
  QueryMESContainer,
  QueryMESBarCode,
  ParseXlsxFile,
} from "@/api/report";
import { ElNotification } from "element-plus";
import { shortcuts, setTodayDate, setLastDate } from "@/utils/dataMenu";
const containername = ref("");
const getForm = ref({
  MfgOrderName: "",
  ContainerName: "",
  MaterialName: "",
  StartTime: "",
  EndTime: "",
  pageSize: 100,
  currentPage: 1,
});
const form = ref({
  CreateTime: "",
  ContainerType: "",
  ContainerName: "",
  Status: 0,
  MaterialName: "",
  MfgOrderName: "",
  ProductModel: "",
  Description: "",
  IsBurn: false,
  IsBurnTEST: false,
  IsAging: false,
  AgingResult: "",
  IsRepair: false,
  RepairResult: "",
  PackingBarcode: "",
  VendorName: "",
  ProductName: "",
});
const searchDate = ref<any[]>([]);
const formRef = ref();
const headerRef = ref();
const tableHeight = ref(0);
const detailHeight = ref(0);
const tableData = ref<any>([]);
const total1 = ref(1);
const fileInput = ref();
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});
const columnData = reactive([
  {
    text: true,
    prop: "containername",
    label: "条码信息",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "containerLevelName",
    label: "条码类型",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "PlannedStartDate",
    label: "创建时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Status",
    label: "条码状态",
    width: "",
    min: true,
    align: "1",
  },
]);
const detailData = ref([]);
const detailColumn = reactive([
  {
    text: true,
    prop: "Side",
    label: "工序名称",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "ERPOrder",
    label: "生产时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "产线名称",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "原材料编码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "原材料批号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "原材料唯一码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "原材料名称",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "Qty",
    label: "操作人",
    width: "",
    min: true,
    align: "1",
  },
]);

watch(
  () => searchDate.value,
  (newVal: any, oldVal: any) => {
    if (newVal === null) {
      getForm.value.StartTime = "";
      getForm.value.EndTime = "";
      getForm.value.currentPage = 1;
      getData();
      return;
    }
    if (newVal !== oldVal) {
      getForm.value.StartTime = newVal[0];
      getForm.value.EndTime = newVal[1];
      getForm.value.currentPage = 1;
      // getData();
    }
  }
);
onBeforeMount(() => {
  getScreenHeight();
  let end: string = setTodayDate();
  let start: string = setLastDate();
  searchDate.value = [start, end];
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  // getData();
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});
const changeForm = () => {
  getForm.value.currentPage = 1;
  // getData();
};

const returnType = (number: any) => {
  if (number === 1) {
    return "可使用";
  } else if (number === 2) {
    return "已关闭";
  } else if (number === 3) {
    return "已消耗";
  } else if (number === 4) {
    return "已发货";
  }
  return "";
};

const getData = () => {
  QueryMESBarCode(containername.value).then((res: any) => {
    if (res && res.success) {
      if (res.content === null) {
        tableData.value = [];
        return;
      }
      formRef.value.resetFields();
      tableData.value = res.content;
    }
  });
};
const rowClick = (row: any) => {
  QueryMESContainer(row.containername).then((res: any) => {
    if (res && res.success && res.content !== null) {
      form.value = res.content;
    }
  });
};

const fileUpload = (event: any) => {
  let file = event.target.files[0];
  if (file.name.split(".").pop().toLowerCase() === "xlsx") {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      //  this.base64String = e.target.result; // 将Base64编码的字符串赋值给data属性
      ParseXlsxFile({
        BaseString: e.target.result,
        FileName: file.name,
      }).then((res: any) => {
        if (res && res.success) {
          if (res.content === null) {
            tableData.value = [];
            return;
          }
          tableData.value = res.content;
          formRef.value.resetFields();
        }
        ElNotification({
          title: "提示信息",
          message: res.msg,
          type: res.success ? 'success':'warning',
        });
        tableData.value = res.content;
      });
    };

    reader.onerror = (e: any) => {
      console.error("File could not be read! Code " + e.target.error.code);
    };

    reader.readAsDataURL(file); // 读取文件并转换为Data URL（Base64编码）
  }
  fileInput.value.value = "";
};
const handleSizeChange = (val: any) => {
  getForm.value.currentPage = 1;
  getForm.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  getForm.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 195;
    detailHeight.value = (window.innerHeight - 225) * 0.4;
  });
};

//退料页面表格宽度分配
const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
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

<style scoped></style>
