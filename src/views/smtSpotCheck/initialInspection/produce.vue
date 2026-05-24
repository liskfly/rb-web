<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }">
      <div>
        <el-form ref="formRef" class="form" :inline="true" label-width="">
          <el-form-item label="时间" class="mb-2">
            <el-date-picker
              size="small"
              :shortcuts="shortcuts"
              style="width: 15vw"
              v-model="dateValue"
              type="daterange"
              range-separator="-"
              value-format="YYYY-MM-DD"
              @change="dateChange"
              claerable
            />
          </el-form-item>
          <el-form-item label="任务单号" class="mb-2">
            <el-input
              v-model="searchForm.TaskNo"
              style="width: 10vw"
              size="small"
              placeholder="请输入"
              claerable
            ></el-input>
          </el-form-item>
          <el-form-item label="生产计划号" class="mb-2">
            <el-input
              v-model="searchForm.OrderNumber"
              style="width: 10vw"
              size="small"
              placeholder="请输入"
              claerable
            ></el-input>
          </el-form-item>
          <el-form-item label="" class="mb-2">
            <el-button
              class="ml-3"
              type="primary"
              size="small"
              @click="getTaskList"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
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
            prop="TaskNo"
            align="center"
            label="任务单号"
            :min-width="flexColumnWidth('任务单号', 'TaskNo')"
          >
          </el-table-column>
          <el-table-column
            prop="TaskTime"
            align="center"
            label="任务创建时间"
            :min-width="flexColumnWidth('任务创建时间', 'TaskTime')"
          >
          </el-table-column>
          <el-table-column
            prop="Shift"
            align="center"
            label="班次"
            :min-width="flexColumnWidth('班次', 'Shift')"
          >
          </el-table-column>
          <el-table-column
            prop="OrderNumber"
            align="center"
            label="生产计划号"
            :min-width="flexColumnWidth('生产计划号', 'OrderNumber')"
          >
          </el-table-column>
          <el-table-column
            prop="OrderQuantity"
            align="center"
            label="计划数量"
            :min-width="flexColumnWidth('计划数量', 'OrderQuantity')"
          >
          </el-table-column>
          <el-table-column
            prop="Product"
            align="center"
            label="产品"
            :min-width="flexColumnWidth('产品', 'Product')"
          >
          </el-table-column>
          <el-table-column
            prop="ProductModel"
            align="center"
            label="产品机型"
            :min-width="flexColumnWidth('产品机型', 'ProductModel')"
          >
          </el-table-column>
          <el-table-column
            prop="FirstStage"
            align="center"
            label="生产自检状态"
            :min-width="flexColumnWidth('生产自检状态', 'FirstStage')"
          >
            <template #default="scope">
              <div v-if="scope.row.FirstStage === false">
                <el-tag type="primary">未提交</el-tag>
              </div>
              <div v-if="scope.row.FirstStage === true">
                <el-tag type="success">已提交</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="ReturnDate"
            align="center"
            label="设备自检状态"
            :min-width="flexColumnWidth('设备自检状态', 'ReturnDate')"
          >
            <template #default="scope">
              <div v-if="scope.row.SecondStage === false">
                <el-tag type="primary">未提交</el-tag>
              </div>
              <div v-if="scope.row.SecondStage === true">
                <el-tag type="success">已提交</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="ReturnDate"
            align="center"
            label="质量确认状态"
            :min-width="flexColumnWidth('质量确认状态', 'ReturnDate')"
          >
            <template #default="scope">
              <div v-if="scope.row.ThirdStage === false">
                <el-tag type="primary">未提交</el-tag>
              </div>
              <div v-if="scope.row.ThirdStage === true">
                <el-tag type="success">已提交</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="InspectResult"
            align="center"
            label="检查结果"
            :min-width="flexColumnWidth('检查结果', 'InspectResult')"
          >
          </el-table-column>
          <el-table-column
            prop="DocumentNo"
            align="center"
            label="文档编号"
            :min-width="flexColumnWidth('文档编号', 'DocumentNo')"
          >
          </el-table-column>
          <el-table-column
            prop="DocumentVer"
            align="center"
            label="文档版本"
            :min-width="flexColumnWidth('文档版本', 'DocumentVer')"
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
                <el-tooltip content="编辑" placement="top">
                  <el-button
                    type="primary"
                    icon="EditPen"
                    size="small"
                    @click="openDialogVisible(scope.row)"
                    :disabled="scope.row.FirstStage"
                  ></el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="my-2 flex items-center justify-around">
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
      </div>
    </el-card>
    <el-dialog
      v-model="dialogVisible"
      title="生产自检"
      width="1050"
      :align-center="true"
      @closed="clearForm"
    >
      <div class="w-full flex">
        <div class="w-[100%]">
          <el-form ref="formRef" class="form" :inline="true" label-width="5rem">
            <el-form-item label="日期/时间" class="mb-2">
              <el-input
                v-model="form.time"
                style="width: 220px"
                size="small"
                placeholder=""
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="机种型号" class="mb-2">
              <el-input
                v-model="form.model"
                style="width: 220px"
                size="small"
                placeholder=""
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="生产计划号" class="mb-2">
              <el-input
                v-model="form.orderNo"
                style="width: 220px"
                size="small"
                placeholder=""
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="表单编号" class="mb-2">
              <el-input
                v-model="form.DocumentNo"
                style="width: 220px"
                size="small"
                placeholder=""
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="批量" class="mb-2">
              <el-input
                v-model="form.batch"
                style="width: 220px"
                size="small"
                placeholder=""
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="检查结果" class="mb-2">
              <el-input
                v-model="form.InspectResult"
                style="width: 220px"
                size="small"
                placeholder=""
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="组长" class="mb-2">
              <el-input
                v-model="submitForm.leader"
                style="width: 220px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
            <el-form-item label="拉长" class="mb-2">
              <el-input
                v-model="submitForm.stretch"
                style="width: 220px"
                size="small"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-form>
          <el-form
            ref="formRef"
            class="form"
            :inline="true"
            label-width="460px"
            label-position="left"
          >
            <el-form-item
              label="是否对物料料号、物料规格、十五丝印进行一一核对"
              class="mb-0"
            >
              <el-checkbox v-model="submitForm.check1"></el-checkbox>
            </el-form-item>
            <el-form-item
              label="插件方向及对应插件位置是否OK,元件出脚是否标准"
              class="mb-0"
            >
              <el-checkbox v-model="submitForm.check2"></el-checkbox>
            </el-form-item>
            <el-form-item label="焊点是否饱满OK" class="mb-0">
              <el-checkbox v-model="submitForm.check3"></el-checkbox>
            </el-form-item>
            <el-form-item
              label="元件螺丝是否漏锁、锁到位，元件是否漏打胶，屏蔽罩是否漏装、装到位"
              class="mb-0"
            >
              <el-checkbox v-model="submitForm.check4"></el-checkbox>
            </el-form-item>
            <el-form-item
              label="PCB板是否有损坏、异物、元件撞件，板边是否整洁，是否有毛刺、缺口"
              class="mb-0"
            >
              <el-checkbox v-model="submitForm.check5"></el-checkbox>
            </el-form-item>
            <el-form-item label="SOP是否符合生产实际作业" class="mb-0">
              <el-checkbox v-model="submitForm.check6"></el-checkbox>
            </el-form-item>
            <el-form-item label="BOM文件编号" class="mb-0" label-width="atuo">
              <el-input
                v-model="submitForm.number"
                style="width: 340px"
                size="small"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- <div class="w-[20%]">
          <div class="w-full h-full">
            <el-upload
              ref="upload"
              action=""
              :http-request="fakeUpload"
              :before-upload="beforeUpload"
              :on-change="handleChange"
              :file-list="fileList"
              :auto-upload="false"
              :limit="3"
              :on-exceed="handleExceed"
              accept="image/*"
              list-type="text"
            >
              <el-button type="primary">选择图片</el-button>
            </el-upload>
          </div>
        </div> -->
      </div>
      <div class="w-full flex justify-between mt-2">
        <div class="invisible">
          <el-button size="small">增加一条明细</el-button>
        </div>
        <div class="text-xl text-[#006487]">物料及所插元件位置确认明细</div>
        <div>
          <el-button @click="addDetail" size="small" type="primary"
            >增加一条明细</el-button
          >
        </div>
      </div>
      <el-table
        :data="detailsTableData"
        size="small"
        stripe
        border
        fit
        :tooltip-effect="'dark'"
        :height="250"
        row-key="MaterialName"
      >
        <el-table-column
          type="index"
          align="center"
          fixed
          label="序号"
          width="60"
        />
        <!-- <el-table-column
              prop="SpecName"
              label="料号"
              align="center"
              :min-width="flexColumnWidth('料号', 'SpecDesc')"
            >
            </el-table-column> -->
        <el-table-column prop="number" align="center" label="料号">
          <template #default="scope">
            <el-input
              v-model="scope.row.number"
              @input="handleInput()"
              size="small"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="describe" align="center" label="物料规格描述">
          <template #default="scope">
            <el-input
              v-model="scope.row.describe"
              @input="handleInput()"
              size="small"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="locationNumber"
          align="center"
          label="插件位置号"
        >
          <template #default="scope">
            <el-input
              v-model="scope.row.locationNumber"
              @input="handleInput()"
              size="small"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="usage" align="center" label="用量">
          <template #default="scope">
            <el-input
              v-model="scope.row.usage"
              @input="handleInput()"
              size="small"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="direction" align="center" label="方向与极性">
          <template #default="scope">
            <el-input
              v-model="scope.row.direction"
              @input="handleInput()"
              size="small"
            >
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="RequestQty"
          align="center"
          label="操作"
          :width="60"
        >
          <template #default="scope">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="删除"
              placement="right"
            >
              <el-button
                icon="DeleteFilled"
                size="small"
                type="danger"
                @click="handleDelete(scope.$index)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="sumbitData"> 提交 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  ElMessage,
  ElNotification,
  ElMessageBox,
  UploadFile,
} from "element-plus";
import { Delete, Download, Plus, ZoomIn } from "@element-plus/icons-vue";
import tableTem from "@/components/tableTem/index.vue";
import { shortcuts, setTodayDate, setLastDate } from "@/utils/dataMenu";
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
import {
  GetInspectack,
  FirstStage,
  SecondStage,
  ThirdStage,
} from "@/api/operate";
import { fa } from "element-plus/es/locale/index.mjs";
import { forEach } from "@/utils/tree";
import { useUserStoreWithOut } from "@/stores/modules/user";
const tableHeight = ref(0);
const dialogImageUrl = ref("");
const disabled = ref(false);
const dialogVisible = ref(false);
const detailsTableData = ref<any[]>([{}, {}, {}, {}, {}, {}]);
const tableData = ref<any[]>([{}]);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});
const dateValue = ref<any[]>([]);
const fileList = ref<any[]>([]);
const taskNO = ref("");
const userStore = useUserStoreWithOut();
const loginName = userStore.getUserInfo;

interface formTS {
  time: string;
  model: string;
  orderNo: string;
  DocumentNo: string;
  InspectResult: string;
  batch: string;
}

interface searchFormTS {
  StartTime: string;
  EndTime: string;
  TaskNo: string;
  OrderNumber: string;
  StageLevel: number;
}

interface submitFormTS {
  leader: string;
  stretch: string;
  number: string;
  check1: boolean;
  check2: boolean;
  check3: boolean;
  check4: boolean;
  check5: boolean;
  check6: boolean;
}

const form = ref<formTS>({
  time: "",
  model: "",
  orderNo: "",
  DocumentNo: "",
  InspectResult: "",
  batch: "",
});

const submitForm = ref<submitFormTS>({
  leader: "",
  stretch: "",
  number: "",
  check1: false,
  check2: false,
  check3: false,
  check4: false,
  check5: false,
  check6: false,
});

const searchForm = ref<searchFormTS>({
  StartTime: "",
  EndTime: "",
  TaskNo: "",
  OrderNumber: "",
  StageLevel: 1,
});

onBeforeMount(() => {
  getScreenHeight();
  let end: string = setTodayDate();
  let start: string = setLastDate();
  dateValue.value = [start, end];
  searchForm.value.StartTime = start;
  searchForm.value.EndTime = end;
});

onMounted(() => {
  getTaskList();
  window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getTaskList = () => {
  GetInspectack(searchForm.value).then((res: any) => {
    if (res && res.success) {
      tableData.value = res.content;
    }
  });
};

const sumbitData = () => {
  let tableVal = "";
  detailsTableData.value.forEach((item: any, index: any) => {
    // data.resultList.push({
    //   InspectItem: "料号,物料规格描述,插件位置号,用量,方向与极性",
    //   InspectValue: `${item.number ? item.number : ""},${
    //     item.describe ? item.describe : ""
    //   },${item.locationNumber ? item.locationNumber : ""},${
    //     item.usage ? item.usage : ""
    //   },${item.direction ? item.direction : ""}`,
    // });
    if (
      (!item.number || item.number === "") &&
      (!item.describe || item.describe === "") &&
      (!item.locationNumber || item.locationNumber === "") &&
      (!item.usage || item.usage === "") &&
      (!item.direction || item.direction === "")
    ) {
      return;
    }
    if (index === detailsTableData.value.length - 1) {
      tableVal =
        tableVal +
        `${item.number ? item.number : ""},${
          item.describe ? item.describe : ""
        },${item.locationNumber ? item.locationNumber : ""},${
          item.usage ? item.usage : ""
        },${item.direction ? item.direction : ""}`;
    } else {
      tableVal =
        tableVal +
        `${item.number ? item.number : ""},${
          item.describe ? item.describe : ""
        },${item.locationNumber ? item.locationNumber : ""},${
          item.usage ? item.usage : ""
        },${item.direction ? item.direction : ""}|`;
    }
  });
  console.log(tableVal);

  // const data = {
  //   TaskNo: taskNO.value,
  //   InspectBy: loginName,
  //   InspectResult: form.value.InspectResult,
  //   resultList: [
  //     {
  //       InspectItem: "组长",
  //       InspectValue: submitForm.value.leader,
  //     },
  //     {
  //       InspectItem: "拉长",
  //       InspectValue: submitForm.value.stretch,
  //     },
  //     {
  //       InspectItem: "是否对物料料号、物料规格、十五丝印进行一一核对",
  //       InspectValue: `${submitForm.value.check1}`,
  //     },
  //     {
  //       InspectItem: "插件方向及对应插件位置是否OK,元件出脚是否标准",
  //       InspectValue: `${submitForm.value.check2}`,
  //     },
  //     {
  //       InspectItem: "焊点是否饱满OK",
  //       InspectValue: `${submitForm.value.check3}`,
  //     },
  //     {
  //       InspectItem:
  //         "元件螺丝是否漏锁、锁到位，元件是否漏打胶，屏蔽罩是否漏装、装到位",
  //       InspectValue: `${submitForm.value.check4}`,
  //     },
  //     {
  //       InspectItem:
  //         "PCB板是否有损坏、异物、元件撞件，板边是否整洁，是否有毛刺、缺口",
  //       InspectValue: `${submitForm.value.check5}`,
  //     },
  //     {
  //       InspectItem: "SOP是否符合生产实际作业",
  //       InspectValue: `${submitForm.value.check6}`,
  //     },
  //     {
  //       InspectItem: "BOM文件编号",
  //       InspectValue: submitForm.value.number,
  //     },
  //     {
  //       InspectItem: "料号,物料规格描述,插件位置号,用量,方向与极性",
  //       InspectValue: tableVal,
  //     },
  //   ],
  // };

  const data = {
    TaskNo: taskNO.value,
    InspectBy: loginName,
    InspectResult: form.value.InspectResult,
    resultList: [
      {
        InspectItem: "leader",
        InspectValue: submitForm.value.leader,
      },
      {
        InspectItem: "stretch",
        InspectValue: submitForm.value.stretch,
      },
      {
        InspectItem: "check1",
        InspectValue: `${submitForm.value.check1}`,
      },
      {
        InspectItem: "check2",
        InspectValue: `${submitForm.value.check2}`,
      },
      {
        InspectItem: "check3",
        InspectValue: `${submitForm.value.check3}`,
      },
      {
        InspectItem: "check4",
        InspectValue: `${submitForm.value.check4}`,
      },
      {
        InspectItem: "check5",
        InspectValue: `${submitForm.value.check5}`,
      },
      {
        InspectItem: "check6",
        InspectValue: `${submitForm.value.check6}`,
      },
      {
        InspectItem: "number",
        InspectValue: submitForm.value.number,
      },
      {
        InspectItem: "table",
        InspectValue: tableVal,
      },
    ],
  };
  console.log(data);
  FirstStage(data).then((res: any) => {
    if (res && res.success) {
      dialogVisible.value = false;
      getTaskList();
      ElNotification({
        title: "提示",
        message: "成功提交",
        type: "success",
      });
    }
  });
};

const handleInput = () => {};

const openDialogVisible = (item: any) => {
  dialogVisible.value = true;
  taskNO.value = item.TaskNo;
  form.value.time = item.TaskTime;
  form.value.model = item.ProductModel;
  form.value.orderNo = item.OrderNumber;
  form.value.DocumentNo = item.DocumentNo;
  form.value.batch = item.OrderQuantity;
  form.value.InspectResult = item.InspectResult;
};

//时间变化时候触发
const dateChange = (data: any) => {
  if (data !== null && data !== "") {
    searchForm.value.StartTime = data[0];
    searchForm.value.EndTime = data[1];
  } else {
    searchForm.value.StartTime = "";
    searchForm.value.EndTime = "";
  }
};

const addDetail = () => {
  detailsTableData.value.push({});
};

const handleDelete = (index: any) => {
  detailsTableData.value.splice(index, 1);
};

const clearForm = () => {
  form.value = {
    time: "",
    model: "",
    orderNo: "",
    DocumentNo: "",
    InspectResult: "",
    batch: "",
  };
  submitForm.value = {
    leader: "",
    stretch: "",
    number: "",
    check1: false,
    check2: false,
    check3: false,
    check4: false,
    check5: false,
    check6: false,
  };
  detailsTableData.value = [{}, {}, {}, {}, {}, {}];
  fileList.value = [];
};

// const handleExceed = (files: any, fileList: any) => {
//   console.log(`Limit of one file is exceeded.`);
// };

// const beforeUpload = (file: any) => {
//   const isImage = file.type.startsWith("image/");
//   if (!isImage) {
//     ElNotification({
//       title: "提示",
//       message: "只允许上传图片",
//       type: "warning",
//     });
//     return false;
//   }
//   // 假设文件验证通过，将文件添加到fileList中（实际上不需要，因为el-upload会自动管理）
//   // 但为了演示，我们在这里手动管理一下
//   fileList.value = [file];
//   // 返回false以阻止自动上传（因为我们可能要在其他地方处理上传逻辑）
//   return false;
// };

const beforeUpload = (file: any) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    console.log("上传文件只能是图片!");
    return false;
  }
  // 不阻止上传，因为我们会在 handleChange 中处理文件
  return true;
};

const handleChange = (file: any, List: any) => {
  // 由于我们设置了 auto-upload="false"，所以文件不会自动上传
  // 我们需要在 handleChange 中处理文件转换
  // List.forEach((f: any) => {
  //   if (!List.includes(f)) {
  //     // 避免重复处理已存在的文件（理论上不应该发生，但为了安全起见）
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       imageBase64List.value.push(e.target.result);
  //     };
  //     reader.readAsDataURL(f.raw);
  //   }
  // });
  // 更新 fileList 以反映当前选择的文件（虽然在这个例子中我们没有直接使用它）
  fileList.value = [...List]; // 注意：这里的 this.fileList 是因为我们在模板中绑定了 :file-list="fileList"，但这里应该使用 ref 的值，即 fileList.value。不过由于模板中的绑定，这里其实不需要手动更新。
};

const handleExceed = (files: any, fileList: any) => {
  console.log(
    `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
      files.length + fileList.length
    } 个文件`
  );
};

const fakeUpload = (p: any) => {
  // 这是一个假的上传函数，因为我们不实际上传文件到服务器
  // 如果你需要上传 Base64 编码的图片到服务器，你可以在这里添加逻辑
  p.onSuccess();
};

const handleSuccess = (response: any, file: any, fileList: any) => {
  console.log(`File ${file.name} uploaded successfully.`);
};

const handleError = (response: any, file: any, fileList: any) => {
  console.log(`Failed to upload file ${file.name}.`);
};

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

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 195;
  });
};

const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
</script>

<style scoped></style>
