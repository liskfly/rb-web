<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }">
      <div>
        <el-form ref="formRef" class="form" :inline="true" label-width="">
          <el-form-item label="时间" class="mb-2">
              <el-date-picker
               size="small"
              :shortcuts="shortcuts"
                v-model="dateValue"
              style="width: 15vw"
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
            <el-button class="ml-3" type="primary" size="small" @click="getTaskList">查询</el-button>
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
          :min-width="flexColumnWidth('创建时间', 'InspectResult')"
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
                  :disabled="scope.row.SecondStage !== false"
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
      title="设备自检"
      width="1100"
      :align-center="true"
      @closed="clearForm"
    >
      <div class="w-full">
        <el-form ref="formRef" class="form" :inline="true" label-width="7rem">
          <el-form-item label="波峰焊" class="mb-2">
            <el-radio v-model="choiceType" :label="true" @change="clearForm">波峰焊</el-radio>
          </el-form-item>
          <el-form-item label="程序员" class="mb-2">
            <el-input
              v-model="waveForm.programmer"
              style="width: 180px"
              size="small"
              placeholder=""
              :disabled="!choiceType"
            ></el-input>
          </el-form-item>
          <div>设备关键设置确认:</div>
          <el-form-item label="助焊剂喷雾流量" class="mb-2">
            <el-input
              v-model="waveForm.sprayFlow"
              style="width: 180px"
              size="small"
              placeholder=""
              :disabled="!choiceType"
            ></el-input>
          </el-form-item>
          <el-form-item label="锡炉温度" class="mb-2">
            <el-input
              v-model="waveForm.temperature"
              style="width: 180px"
              size="small"
              placeholder=""
              :disabled="!choiceType"
            ></el-input>
          </el-form-item>
          <el-form-item label="链速" class="mb-2">
            <el-input
              v-model="waveForm.chainSpeed"
              style="width: 180px"
              size="small"
              placeholder=""
              :disabled="!choiceType"
            ></el-input>
          </el-form-item>
          <el-form-item label="预热区温度1" class="mb-2">
            <el-input
              v-model="waveForm.preheat1"
              style="width: 180px"
              size="small"
              placeholder=""
              :disabled="!choiceType"
            ></el-input>
          </el-form-item>
          <el-form-item label="预热区温度2" class="mb-2">
            <el-input
              v-model="waveForm.preheat2"
              style="width: 180px"
              size="small"
              placeholder=""
              :disabled="!choiceType"
            ></el-input>
          </el-form-item>
          <el-form-item label="预热区温度3" class="mb-2">
            <el-input
              v-model="waveForm.preheat3"
              style="width: 180px"
              size="small"
              placeholder=""
              :disabled="!choiceType"
            ></el-input>
          </el-form-item>
          <el-form-item label="预热区温度4" class="mb-2">
            <el-input
              v-model="waveForm.preheat4"
              style="width: 180px"
              size="small"
              placeholder=""
              :disabled="!choiceType"
            ></el-input>
          </el-form-item>
          <el-form-item label="技术员" class="mb-2">
            <el-input
              v-model="waveForm.technician"
              style="width: 180px"
              size="small"
              placeholder=""
              :disabled="!choiceType"
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item
            label-width="auto"
            label="对炉温进行温度测试，符合SOP要求"
            class="mb-0"
          >
            <el-checkbox
              v-model="waveForm.require"
              :disabled="!choiceType"
            ></el-checkbox>
          </el-form-item>
          <el-form-item
            label-width="auto"
            label="首件炉后焊接效果状态确认OK"
            class="mb-0"
          >
            <el-checkbox
              v-model="waveForm.confirm"
              :disabled="!choiceType"
            ></el-checkbox>
          </el-form-item>
        </el-form>
        <el-divider />
        <el-form ref="formRef" class="form" :inline="true" label-width="7rem">
          <el-form-item label="选择焊" class="mb-2">
            <el-radio v-model="choiceType" :label="false" @change="clearForm">选择焊</el-radio>
          </el-form-item>
          <el-form-item label="程序员" class="mb-2">
            <el-input
              v-model="chooseForm.programmer"
              style="width: 180px"
              size="small"
              placeholder=""
              :disabled="choiceType"
            ></el-input>
          </el-form-item>
          <br>
          <el-form-item label="助焊剂量" class="mb-2">
            <el-input
              v-model="chooseForm.dose"
              style="width: 180px"
              size="small"
              placeholder=""
              :disabled="choiceType"
            ></el-input>
          </el-form-item>
          <el-form-item label="锡炉温度" class="mb-2">
            <el-input
              v-model="chooseForm.temperature"
              style="width: 180px"
              size="small"
              placeholder=""
              :disabled="choiceType"
            ></el-input>
          </el-form-item>
          <el-form-item label="预热时间" class="mb-2">
            <el-input
              v-model="chooseForm.preheatTime"
              style="width: 180px"
              size="small"
              placeholder=""
              :disabled="choiceType"
            ></el-input>
          </el-form-item>
          <el-form-item label="预热区温度" class="mb-2">
            <el-input
              v-model="chooseForm.preheatTemperature"
              style="width: 180px"
              size="small"
              placeholder=""
              :disabled="choiceType"
            ></el-input>
          </el-form-item>
          <el-form-item label="技术员" class="mb-2">
            <el-input
              v-model="chooseForm.technician"
              style="width: 180px"
              size="small"
              placeholder=""
              :disabled="choiceType"
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item
            label-width="auto"
            label="对炉温进行温度测试，符合SOP要求"
            class="mb-0"
          >
            <el-checkbox
              v-model="chooseForm.require"
              :disabled="choiceType"
            ></el-checkbox>
          </el-form-item>
          <el-form-item
            label-width="auto"
            label="首件炉后焊接效果状态确认OK"
            class="mb-0"
          >
            <el-checkbox
              v-model="chooseForm.confirm"
              :disabled="choiceType"
            ></el-checkbox>
          </el-form-item>
        </el-form>
        <el-divider />
        <div class="w-full h-full flex justify-between items-end">
          <div class="w-[50%]">
            <!-- <el-upload
              v-model:file-list="fileList"
              class="upload-demo"
              action=""
              :limit="1"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-error="handleError"
              list-type="picture-card"
              :auto-upload="false"
            >
              <el-button type="primary">Click to upload</el-button>
            </el-upload> -->
            <!-- <el-upload
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
            </el-upload> -->
            <!-- <div v-for="(base64, index) in imageBase64List" :key="index">
              <img
                :src="base64"
                :alt="'Image ' + (index + 1)"
                style="width: 100px; height: 100px; margin: 10px"
              />
            </div> -->
          </div>
          <div>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="sumbitData"
              >提交</el-button
            >
          </div>
        </div>
      </div>
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
const radio = ref(true);
const choiceType = ref(true);
const taskNO = ref("");
const userStore = useUserStoreWithOut();
const loginName = userStore.getUserInfo;

interface formTS {
  InspectResult: string;
}

interface searchFormTS {
  StartTime: string;
  EndTime: string;
  TaskNo: string;
  OrderNumber: string;
  StageLevel: number;
}

interface waveFormTS {
  programmer: string;
  sprayFlow: string;
  temperature: string;
  chainSpeed: string;
  preheat1: string;
  preheat2: string;
  preheat3: string;
  preheat4: string;
  technician: string;
  require: boolean;
  confirm: boolean;
}

interface chooseFormTS {
  programmer: string;
  dose: string;
  temperature: string;
  preheatTime: string;
  preheatTemperature: string;
  technician: string;
  require: boolean;
  confirm: boolean;
}

const form = ref<formTS>({
  InspectResult: "",
});

const waveForm = ref<waveFormTS>({
  programmer: '',
  sprayFlow: '',
  temperature: '',
  chainSpeed: '',
  preheat1: '',
  preheat2: '',
  preheat3: '',
  preheat4: '',
  technician: '',
  require: false,
  confirm: false
});

const chooseForm = ref<chooseFormTS>({
  programmer: '',
  dose: '',
  temperature: '',
  preheatTime: '',
  preheatTemperature: '',
  technician: '',
  require: false,
  confirm: false
});

const searchForm = ref<searchFormTS>({
  StartTime: "",
  EndTime: "",
  TaskNo: "",
  OrderNumber: "",
  StageLevel: 2,
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
  let data:any = {}
  if (choiceType) {
  // data = {
  //   TaskNo: taskNO.value,
  //   InspectBy: loginName,
  //   InspectResult: form.value.InspectResult,
  //   resultList: [
  //     {
  //       InspectItem: "波峰焊",
  //       InspectValue: `${true}`,
  //     },
  //     {
  //       InspectItem: "程序员",
  //       InspectValue: waveForm.value.programmer,
  //     },
  //     {
  //       InspectItem: "助焊剂喷雾流量",
  //       InspectValue: waveForm.value.sprayFlow,
  //     },
  //     {
  //       InspectItem: "锡炉温度",
  //       InspectValue: waveForm.value.temperature,
  //     },
  //     {
  //       InspectItem: "链速",
  //       InspectValue: waveForm.value.chainSpeed,
  //     },
  //     {
  //       InspectItem: "预热区温度1",
  //       InspectValue: waveForm.value.preheat1,
  //     },
  //     {
  //       InspectItem:
  //         "预热区温度2",
  //       InspectValue: waveForm.value.preheat2,
  //     },
  //     {
  //       InspectItem:
  //         "预热区温度3",
  //       InspectValue: waveForm.value.preheat3,
  //     },
  //     {
  //       InspectItem: "预热区温度4",
  //       InspectValue: waveForm.value.preheat4,
  //     },
  //     {
  //       InspectItem: "技术员",
  //       InspectValue: waveForm.value.technician,
  //     },
  //     {
  //       InspectItem: "对炉温进行温度测试，符合SOP要求",
  //       InspectValue: waveForm.value.require,
  //     },
  //     {
  //       InspectItem: "首件炉后焊接效果状态确认OK",
  //       InspectValue: waveForm.value.confirm,
  //     },
  //   ],
  // };
  data = {
    TaskNo: taskNO.value,
    InspectBy: loginName,
    InspectResult: form.value.InspectResult,
    resultList: [
      {
        InspectItem: "solder",
        InspectValue: `${true}`,
      },
      {
        InspectItem: "programmer1",
        InspectValue: waveForm.value.programmer,
      },
      {
        InspectItem: "sprayFlow1",
        InspectValue: waveForm.value.sprayFlow,
      },
      {
        InspectItem: "temperature1",
        InspectValue: waveForm.value.temperature,
      },
      {
        InspectItem: "chainSpeed1",
        InspectValue: waveForm.value.chainSpeed,
      },
      {
        InspectItem: "preheat1",
        InspectValue: waveForm.value.preheat1,
      },
      {
        InspectItem:
          "preheat2",
        InspectValue: waveForm.value.preheat2,
      },
      {
        InspectItem:
          "preheat3",
        InspectValue: waveForm.value.preheat3,
      },
      {
        InspectItem: "preheat4",
        InspectValue: waveForm.value.preheat4,
      },
      {
        InspectItem: "technician1",
        InspectValue: waveForm.value.technician,
      },
      {
        InspectItem: "require1",
        InspectValue: waveForm.value.require,
      },
      {
        InspectItem: "confirm1",
        InspectValue: waveForm.value.confirm,
      },
    ],
  };
}else {
  // data = {
  //   TaskNo: taskNO.value,
  //   InspectBy: loginName,
  //   InspectResult: form.value.InspectResult,
  //   resultList: [
  //     {
  //       InspectItem: "选择焊",
  //       InspectValue: `${true}`,
  //     },
  //     {
  //       InspectItem: "程序员",
  //       InspectValue: chooseForm.value.programmer,
  //     },
  //     {
  //       InspectItem: "助焊剂量",
  //       InspectValue: chooseForm.value.dose,
  //     },
  //     {
  //       InspectItem: "锡炉温度",
  //       InspectValue: chooseForm.value.temperature,
  //     },
  //     {
  //       InspectItem: "预热时间",
  //       InspectValue: chooseForm.value.preheatTime,
  //     },
  //     {
  //       InspectItem: "预热区温度",
  //       InspectValue: chooseForm.value.preheatTemperature,
  //     },
  //     {
  //       InspectItem: "技术员",
  //       InspectValue: chooseForm.value.technician,
  //     },
  //     {
  //       InspectItem: "对炉温进行温度测试，符合SOP要求",
  //       InspectValue: chooseForm.value.require,
  //     },
  //     {
  //       InspectItem: "首件炉后焊接效果状态确认OK",
  //       InspectValue: chooseForm.value.confirm,
  //     },
  //   ],
  // };
 
  data = {
    TaskNo: taskNO.value,
    InspectBy: loginName,
    InspectResult: form.value.InspectResult,
    resultList: [
      {
        InspectItem: "solder",
        InspectValue: `${false}`,
      },
      {
        InspectItem: "programmer2",
        InspectValue: chooseForm.value.programmer,
      },
      {
        InspectItem: "dose2",
        InspectValue: chooseForm.value.dose,
      },
      {
        InspectItem: "temperature2",
        InspectValue: chooseForm.value.temperature,
      },
      {
        InspectItem: "preheatTime2",
        InspectValue: chooseForm.value.preheatTime,
      },
      {
        InspectItem: "preheatTemperature2",
        InspectValue: chooseForm.value.preheatTemperature,
      },
      {
        InspectItem: "technician2",
        InspectValue: chooseForm.value.technician,
      },
      {
        InspectItem: "require2",
        InspectValue: chooseForm.value.require,
      },
      {
        InspectItem: "confirm2",
        InspectValue: chooseForm.value.confirm,
      },
    ],
  }; 
}
  
  console.log(data);
  SecondStage(data).then((res: any) => {
    if (res && res.success) {
      dialogVisible.value = false;
      getTaskList()
      ElNotification({
        title: "提示",
        message: "成功提交",
        type: "success",
      });
    }
  });
};

const openDialogVisible = (item: any) => {
  dialogVisible.value = true;
  taskNO.value = item.TaskNo;
  form.value.InspectResult = item.InspectResult;
  clearForm();
};

const handleInput = () => {};

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
  chooseForm.value = {
  programmer: '',
  dose: '',
  temperature: '',
  preheatTime: '',
  preheatTemperature: '',
  technician: '',
  require: false,
  confirm: false
};
  waveForm.value ={
  programmer: '',
  sprayFlow: '',
  temperature: '',
  chainSpeed: '',
  preheat1: '',
  preheat2: '',
  preheat3: '',
  preheat4: '',
  technician: '',
  require: false,
  confirm: false
};
  // detailsTableData.value = [{}, {}, {}, {}, {}, {}];
  // fileList.value = [];
};

const imageBase64List = ref<any[]>([]);

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
  console.log(imageBase64List);
  
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
