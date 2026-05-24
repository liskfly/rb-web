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
            width="100"
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
            width="100"
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
            width="100"
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
                    :disabled="
                      scope.row.FirstStage === false ||
                      scope.row.SecondStage === false ||
                      scope.row.ThirdStage === true
                    "
                  ></el-button>

                  <!-- :disabled="scope.row.FirstStage !== false" -->
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
      title="质量自检确认"
      width="1050"
      :align-center="true"
      @closed="clearForm"
    >
      <div
        ref="scrollRef"
        class="w-full h-[500px] overflow-x-hidden overflow-y-auto no-scrollbar"
      >
        <div class="text-2xl text-[#006487]">生产自检任务</div>
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
              v-model="firstResult.leader"
              style="width: 220px"
              size="small"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="拉长" class="mb-2">
            <el-input
              v-model="firstResult.stretch"
              style="width: 220px"
              size="small"
              placeholder=""
              disabled
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
            <el-checkbox v-model="firstResult.check1" disabled></el-checkbox>
          </el-form-item>
          <el-form-item
            label="插件方向及对应插件位置是否OK,元件出脚是否标准"
            class="mb-0"
          >
            <el-checkbox v-model="firstResult.check2" disabled></el-checkbox>
          </el-form-item>
          <el-form-item label="焊点是否饱满OK" class="mb-0">
            <el-checkbox v-model="firstResult.check3" disabled></el-checkbox>
          </el-form-item>
          <el-form-item
            label="元件螺丝是否漏锁、锁到位，元件是否漏打胶，屏蔽罩是否漏装、装到位"
            class="mb-0"
          >
            <el-checkbox v-model="firstResult.check4" disabled></el-checkbox>
          </el-form-item>
          <el-form-item
            label="PCB板是否有损坏、异物、元件撞件，板边是否整洁，是否有毛刺、缺口"
            class="mb-0"
          >
            <el-checkbox v-model="firstResult.check5" disabled></el-checkbox>
          </el-form-item>
          <el-form-item label="SOP是否符合生产实际作业" class="mb-0">
            <el-checkbox v-model="firstResult.check6" disabled></el-checkbox>
          </el-form-item>
          <el-form-item label="BOM文件编号" class="mb-0" label-width="atuo">
            <el-input
              v-model="firstResult.number"
              style="width: 340px"
              size="small"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>

        <div class="w-full flex justify-between mt-2">
          <div class="invisible"></div>
          <div class="text-xl text-[#006487]">物料及所插元件位置确认明细</div>
          <div></div>
        </div>
        <table-tem
          size="small"
          :show-index="true"
          :tableData="detailsTableData"
          :tableHeight="250"
          :columnData="columnData"
          :pageObj="pageObj1"
        >
        </table-tem>

        <el-divider />

        <div class="text-2xl text-[#006487]">设备工程自检任务</div>
        <el-form
          ref="formRef"
          class="form"
          :inline="true"
          label-width="7rem"
          v-if="secondSolder"
        >
          <el-form-item label="波峰焊" class="mb-2">
            <el-radio v-model="secondSolder" :label="true" disabled
              >波峰焊</el-radio
            >
          </el-form-item>
          <el-form-item label="程序员" class="mb-2">
            <el-input
              v-model="secondResult1.programmer1"
              style="width: 180px"
              size="small"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item>
          <div>设备关键设置确认:</div>
          <el-form-item label="助焊剂喷雾流量" class="mb-2">
            <el-input
              v-model="secondResult1.sprayFlow1"
              style="width: 180px"
              size="small"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="锡炉温度" class="mb-2">
            <el-input
              v-model="secondResult1.temperature1"
              style="width: 180px"
              size="small"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="链速" class="mb-2">
            <el-input
              v-model="secondResult1.chainSpeed1"
              style="width: 180px"
              size="small"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="预热区温度1" class="mb-2">
            <el-input
              v-model="secondResult1.preheat1"
              style="width: 180px"
              size="small"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="预热区温度2" class="mb-2">
            <el-input
              v-model="secondResult1.preheat2"
              style="width: 180px"
              size="small"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="预热区温度3" class="mb-2">
            <el-input
              v-model="secondResult1.preheat3"
              style="width: 180px"
              size="small"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="预热区温度4" class="mb-2">
            <el-input
              v-model="secondResult1.preheat4"
              style="width: 180px"
              size="small"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="技术员" class="mb-2">
            <el-input
              v-model="secondResult1.technician1"
              style="width: 180px"
              size="small"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item
            label-width="auto"
            label="对炉温进行温度测试，符合SOP要求"
            class="mb-0"
          >
            <el-checkbox
              v-model="secondResult1.require1"
              disabled
            ></el-checkbox>
          </el-form-item>
          <el-form-item
            label-width="auto"
            label="首件炉后焊接效果状态确认OK"
            class="mb-0"
          >
            <el-checkbox
              v-model="secondResult1.confirm1"
              disabled
            ></el-checkbox>
          </el-form-item>
        </el-form>
        <el-divider v-if="secondSolder" />
        <el-form
          ref="formRef"
          class="form"
          :inline="true"
          label-width="7rem"
          v-if="!secondSolder"
        >
          <el-form-item label="选择焊" class="mb-2">
            <el-radio v-model="secondSolder" :label="false" disabled
              >选择焊</el-radio
            >
          </el-form-item>
          <el-form-item label="程序员" class="mb-2">
            <el-input
              v-model="secondResult2.programmer2"
              style="width: 180px"
              size="small"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item label="助焊剂量" class="mb-2">
            <el-input
              v-model="secondResult2.dose2"
              style="width: 180px"
              size="small"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="锡炉温度" class="mb-2">
            <el-input
              v-model="secondResult2.temperature2"
              style="width: 180px"
              size="small"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="预热时间" class="mb-2">
            <el-input
              v-model="secondResult2.preheatTime2"
              style="width: 180px"
              size="small"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="预热区温度" class="mb-2">
            <el-input
              v-model="secondResult2.preheatTemperature2"
              style="width: 180px"
              size="small"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="技术员" class="mb-2">
            <el-input
              v-model="secondResult2.technician2"
              style="width: 180px"
              size="small"
              placeholder=""
              disabled
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item
            label-width="auto"
            label="对炉温进行温度测试，符合SOP要求"
            class="mb-0"
          >
            <el-checkbox
              v-model="secondResult2.require2"
              disabled
            ></el-checkbox>
          </el-form-item>
          <el-form-item
            label-width="auto"
            label="首件炉后焊接效果状态确认OK"
            class="mb-0"
          >
            <el-checkbox
              v-model="secondResult2.confirm2"
              disabled
            ></el-checkbox>
          </el-form-item>
        </el-form>
        <el-divider v-if="!secondSolder" />

        <div class="text-2xl text-[#006487]">质量自检确认</div>
        <el-form ref="formRef" class="form" :inline="true" label-width="7rem">
          <el-form-item
            label-width="auto"
            label="元件未插到位，极性插错、反向，出脚不标准"
            class="mb-0"
          >
            <el-checkbox v-model="submitForm.check1"></el-checkbox>
          </el-form-item>
          <el-form-item
            label-width="auto"
            label="焊点拉尖、虚焊、桥接、焊点粗糙"
            class="mb-0"
          >
            <el-checkbox v-model="submitForm.check2"></el-checkbox>
          </el-form-item>
          <el-form-item label-width="auto" label="锡渣残留、异物" class="mb-0">
            <el-checkbox v-model="submitForm.check3"></el-checkbox>
          </el-form-item>
          <el-form-item label-width="auto" label="浮高、溢锡" class="mb-0">
            <el-checkbox v-model="submitForm.check4"></el-checkbox>
          </el-form-item>
          <el-form-item
            label-width="auto"
            label="元件螺丝漏锁，未锁到位"
            class="mb-0"
          >
            <el-checkbox v-model="submitForm.check5"></el-checkbox>
          </el-form-item>
          <el-form-item
            label-width="auto"
            label="元件漏打胶屏蔽罩漏装，未装到位"
            class="mb-0"
          >
            <el-checkbox v-model="submitForm.check6"></el-checkbox>
          </el-form-item>
          <el-form-item
            label-width="auto"
            label="PCB板损坏、异物、元件撞件，板边不整洁，有毛刺、缺口"
            class="mb-0"
          >
            <el-checkbox v-model="submitForm.check7"></el-checkbox>
          </el-form-item>
          <el-form-item label-width="auto" label="周边SMT元件少" class="mb-0">
            <el-checkbox v-model="submitForm.check8"></el-checkbox>
          </el-form-item>
          <el-form-item label-width="auto" label="其它" class="mb-0">
            <div class="w-full flex items-center">
              <el-checkbox
                v-model="submitForm.check9"
                @change="submitForm.other = ''"
              ></el-checkbox>
              <el-input
                class="ml-4"
                v-model="submitForm.other"
                style="width: 700px"
                size="small"
                placeholder="请输入"
                :disabled="!submitForm.check9"
              ></el-input>
            </div>
          </el-form-item>
        </el-form>
        <br />
        <el-form ref="formRef" class="form" :inline="true" label-width="7rem">
          <el-form-item label-width="auto" label="质量确认" class="mb-0">
            <el-input
              v-model="submitForm.qualityConfim"
              style="width: 240px"
              size="small"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label-width="auto" label="首件状态确认" class="mb-0">
            <el-radio-group v-model="submitForm.stateConfim">
              <el-radio :value="true" size="small">合格</el-radio>
              <el-radio :value="false" size="small">不合格 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <br />
        <el-form ref="formRef" class="form" :inline="true" label-width="7rem">
          <el-row>
            <el-col :span="12">
              <el-form-item label-width="auto" label="不良现象" class="mb-0">
                <el-input
                  v-model="submitForm.feckless"
                  style="width: 350px"
                  type="textarea"
                  size="small"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="auto" label="改善对策" class="mb-0">
                <el-input
                  v-model="submitForm.countermeasure"
                  style="width: 350px"
                  type="textarea"
                  size="small"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-divider />
      </div>
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
  InspecDetail,
} from "@/api/operate";
import { useUserStoreWithOut } from "@/stores/modules/user";
const tableHeight = ref(0);
const dialogImageUrl = ref("");
const disabled = ref(false);
const dialogVisible = ref(false);
const detailsTableData = ref<any[]>([]);
const tableData = ref<any[]>([{}]);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
  isShow: -1,
});
const pageObj1 = ref({
  pageSize: 1000000,
  currentPage: 1,
  isShow: -1,
});
const dateValue = ref<any[]>([]);
const fileList = ref<any[]>([]);
const taskNO = ref<any[]>([]);
const InspectResult = ref<any[]>([]);
const secondSolder = ref(true);
const userStore = useUserStoreWithOut();
const loginName = userStore.getUserInfo;
const scrollRef = ref();

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

interface checkFormTS {
  lineName: boolean;
}

interface firstResultTS {
  leader: string;
  stretch: string;
  check1: boolean;
  check2: boolean;
  check3: boolean;
  check4: boolean;
  check5: boolean;
  check6: boolean;
  number: string;
}

interface secondResult1TS {
  programmer1: string;
  sprayFlow1: string;
  temperature1: string;
  chainSpeed1: string;
  preheat1: string;
  preheat2: string;
  preheat3: string;
  preheat4: string;
  technician1: string;
  require1: boolean;
  confirm1: boolean;
}

interface secondResult2TS {
  programmer2: string;
  dose2: string;
  temperature2: string;
  preheatTime2: string;
  preheatTemperature2: string;
  technician2: string;
  require2: boolean;
  confirm2: boolean;
}

interface submitFormTS {
  qualityConfim: string;
  stateConfim: boolean;
  feckless: string;
  countermeasure: string;
  check1: boolean;
  check2: boolean;
  check3: boolean;
  check4: boolean;
  check5: boolean;
  check6: boolean;
  check7: boolean;
  check8: boolean;
  check9: boolean;
  other: string;
}

const firstResult = ref<firstResultTS>({
  leader: "",
  stretch: "",
  check1: false,
  check2: false,
  check3: false,
  check4: false,
  check5: false,
  check6: false,
  number: "",
});

const secondResult1 = ref<secondResult1TS>({
  programmer1: "",
  sprayFlow1: "",
  temperature1: "",
  chainSpeed1: "",
  preheat1: "",
  preheat2: "",
  preheat3: "",
  preheat4: "",
  technician1: "",
  require1: false,
  confirm1: false,
});

const secondResult2 = ref<secondResult2TS>({
  programmer2: "",
  dose2: "",
  temperature2: "",
  preheatTime2: "",
  preheatTemperature2: "",
  technician2: "",
  require2: false,
  confirm2: false,
});

const form = ref<formTS>({
  time: "",
  model: "",
  orderNo: "",
  DocumentNo: "",
  InspectResult: "",
  batch: "",
});

const checkForm = ref<checkFormTS>({
  lineName: false,
});

const searchForm = ref<searchFormTS>({
  StartTime: "",
  EndTime: "",
  TaskNo: "",
  OrderNumber: "",
  StageLevel: 3,
});

const submitForm = ref<submitFormTS>({
  qualityConfim: "",
  stateConfim: false,
  feckless: "",
  countermeasure: "",
  check1: false,
  check2: false,
  check3: false,
  check4: false,
  check5: false,
  check6: false,
  check7: false,
  check8: false,
  check9: false,
  other: "",
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

//提交质量自检确认
const sumbitData = () => {
  const data = {
    TaskNo: taskNO.value,
    InspectBy: loginName,
    InspectResult: InspectResult.value,
    resultList: [
      {
        InspectItem: "qualityConfim",
        InspectValue: submitForm.value.qualityConfim,
      },
      {
        InspectItem: "stateConfim",
        InspectValue: `${submitForm.value.stateConfim}`,
      },
      {
        InspectItem: "feckless",
        InspectValue: submitForm.value.feckless,
      },
      {
        InspectItem: "countermeasure",
        InspectValue: submitForm.value.countermeasure,
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
        InspectItem: "check7",
        InspectValue: `${submitForm.value.check7}`,
      },
      {
        InspectItem: "check8",
        InspectValue: `${submitForm.value.check8}`,
      },
      {
        InspectItem: "check9",
        InspectValue: `${submitForm.value.check9}`,
      },
      {
        InspectItem: "other",
        InspectValue: submitForm.value.other,
      },
    ],
  };
  ThirdStage(data).then((res: any) => {
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

const openDialogVisible = (item: any) => {
  dialogVisible.value = true;
  taskNO.value = item.TaskNo;
  InspectResult.value = item.InspectResult;
  form.value.time = item.TaskTime;
  form.value.model = item.ProductModel;
  form.value.orderNo = item.OrderNumber;
  form.value.DocumentNo = item.DocumentNo;
  form.value.batch = item.OrderQuantity;
  form.value.InspectResult = item.InspectResult;
  nextTick(() => {
    scrollRef.value.scrollTop = 0;
  });
  getAllData();
};

const getAllData = () => {
  InspecDetail(taskNO.value).then((res: any) => {
    //获取第二部分选择了波峰焊还是选择焊
    res.content.firstResultInspect.forEach((item: any) => {
      if (item.InspectItem === "solder") {
        secondSolder.value = item.InspectValue === "true" ? true : false;
      }
    });
    res.content.firstResultInspect.forEach((item: any) => {
      //第一部分
      if (item.StageLevel === 1) {
        //处理第一部分表格
        if (item.InspectItem === "table") {
          if (item.InspectValue === "") {
            return;
          }
          let arr = item.InspectValue.split("|");
          arr.forEach((element: any) => {
            detailsTableData.value.push({
              number: element.split(",")[0],
              describe: element.split(",")[1],
              locationNumber: element.split(",")[2],
              usage: element.split(",")[3],
              direction: element.split(",")[4],
            });
          });
          return;
        }
        if (
          firstResult.value[item.InspectItem as keyof firstResultTS] === "" ||
          firstResult.value[item.InspectItem as keyof firstResultTS] === false
        ) {
          if (item.InspectValue === "true") {
            (firstResult.value[
              item.InspectItem as keyof firstResultTS
            ] as boolean) = true;
            return;
          } else if (item.InspectValue === "false") {
            (firstResult.value[
              item.InspectItem as keyof firstResultTS
            ] as boolean) = false;
            return;
          }
          (firstResult.value[item.InspectItem as keyof firstResultTS] as any) =
            item.InspectValue;
          return;
        }
      }
      if (item.StageLevel === 2) {
        if (secondSolder.value) {
          if (
            secondResult1.value[item.InspectItem as keyof secondResult1TS] ===
              "" ||
            secondResult1.value[item.InspectItem as keyof secondResult1TS] ===
              false
          ) {
            if (item.InspectValue === "true") {
              (secondResult1.value[
                item.InspectItem as keyof secondResult1TS
              ] as boolean) = true;
              return;
            } else if (item.InspectValue === "false") {
              (secondResult1.value[
                item.InspectItem as keyof secondResult1TS
              ] as boolean) = false;
              return;
            }
            (secondResult1.value[
              item.InspectItem as keyof secondResult1TS
            ] as any) = item.InspectValue;
            return;
          }
        } else {
          if (
            secondResult2.value[item.InspectItem as keyof secondResult2TS] ===
              "" ||
            secondResult2.value[item.InspectItem as keyof secondResult2TS] ===
              false
          ) {
            if (item.InspectValue === "true") {
              (secondResult2.value[
                item.InspectItem as keyof secondResult2TS
              ] as boolean) = true;
              return;
            } else if (item.InspectValue === "false") {
              (secondResult2.value[
                item.InspectItem as keyof secondResult2TS
              ] as boolean) = false;
              return;
            }
            (secondResult2.value[
              item.InspectItem as keyof secondResult2TS
            ] as any) = item.InspectValue;
            return;
          }
        }
      }
    });
  });
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

const clearForm = () => {
  form.value = {
    time: "",
    model: "",
    orderNo: "",
    DocumentNo: "",
    InspectResult: "",
    batch: "",
  };
  firstResult.value = {
    leader: "",
    stretch: "",
    check1: false,
    check2: false,
    check3: false,
    check4: false,
    check5: false,
    check6: false,
    number: "",
  };
  secondResult1.value = {
    programmer1: "",
    sprayFlow1: "",
    temperature1: "",
    chainSpeed1: "",
    preheat1: "",
    preheat2: "",
    preheat3: "",
    preheat4: "",
    technician1: "",
    require1: false,
    confirm1: false,
  };
  secondResult2.value = {
    programmer2: "",
    dose2: "",
    temperature2: "",
    preheatTime2: "",
    preheatTemperature2: "",
    technician2: "",
    require2: false,
    confirm2: false,
  };
  checkForm.value = {
    lineName: false,
  };
  submitForm.value = {
    qualityConfim: "",
    stateConfim: false,
    feckless: "",
    countermeasure: "",
    check1: false,
    check2: false,
    check3: false,
    check4: false,
    check5: false,
    check6: false,
    check7: false,
    check8: false,
    check9: false,
    other: "",
  };
  detailsTableData.value = [];
  fileList.value = [];
};

const handleExceed = (files: any, fileList: any) => {
  console.log(`Limit of one file is exceeded.`);
};

const beforeUpload = (file: any) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    ElNotification({
      title: "提示",
      message: "只允许上传图片",
      type: "warning",
    });
    return false;
  }
  // 假设文件验证通过，将文件添加到fileList中（实际上不需要，因为el-upload会自动管理）
  // 但为了演示，我们在这里手动管理一下
  fileList.value = [file];
  // 返回false以阻止自动上传（因为我们可能要在其他地方处理上传逻辑）
  return false;
};

const handleSuccess = (response: any, file: any, fileList: any) => {
  console.log(`File ${file.name} uploaded successfully.`);
};

const handleError = (response: any, file: any, fileList: any) => {
  console.log(`Failed to upload file ${file.name}.`);
};

const columnData = reactive([
  {
    text: true,
    prop: "number",
    label: "料号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "describe",
    label: "物料规格描述",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "locationNumber",
    label: "插件位置号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "usage",
    label: "用量",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "direction",
    label: "方向与极性",
    width: "",
    min: true,
    align: "center",
  },
]);

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

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
