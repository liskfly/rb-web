<template>
  <div class="p-[10px]">
    <el-card shadow="always" :body-style="{ padding: '10px' }">
      <div>
        <el-form ref="formRef" class="form" :inline="true" :model="getDataText">
          <el-form-item class="mb-2">
            <el-select size="small" style="width: 100px" v-model="inquire" placeholder="检查类型">
              <el-option v-for="item in inquireList" :key="item.value" :label="item.lable" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-select size="small" style="width: 100px" v-model="getDataText.inspectType" placeholder="检查类型">
              <el-option v-for="item in typeList" :key="item.value" :label="item.lable" :value="item.value"></el-option>
            </el-select></el-form-item>
          <el-form-item v-show="inquire == 'order'" class="mb-2">
            <el-input size="small" placeholder="请输入单号" clearable v-model="getDataText.inspect" class="input-with-select"
              @change="getData()">
            </el-input>
          </el-form-item>
          <el-form-item v-show="inquire != 'order'" class="mb-2">
            <el-date-picker :shortcuts="shortcuts"  v-model="value1" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="daterange"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button type="primary" @click="getData()" size="small">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table_container">
        <el-table :data="tableData.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )
          " border :height="tableHeight" row-key="step1" style="width: 100%"
          :tree-props="{ children: 'stepItemList' }">
          <el-table-column prop="InspectOrder" label="任务编号" width="180">
          </el-table-column>
          <el-table-column prop="StepName" label="检验设备"> </el-table-column>
          <el-table-column prop="Status" label="检查结果">
            <template #default="scope">
              <el-tag v-if="scope.row.Status" :type="resultTag(scope.row.Status)" effect="dark">{{
                resultText(scope.row.Status)
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="Attachment" label="记录图片">
            <template #default="scope">
              <span v-for="(item, i) in scope.row.Attachment" :key="i">
                <el-image style="max-height: 70px; max-width: 70px; padding: 5px" :src="item"
                  :preview-src-list="[item]">
                </el-image>
                <!-- <el-popover placement="left" trigger="click" width="300">
                  <img :src="item" width="100%" />
                  <img
                    slot="reference"
                    :src="item"
                    :alt="item"
                    style="max-height: 70px; max-width: 70px; padding: 5px"
                  />
                </el-popover> -->
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="Remark" label="备注"> </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 15px">
          <el-pagination align="center" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
            layout="total,sizes, prev, pager, next, jumper" :total="tableData.length">
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {shortcuts} from "@/utils/dataMenu"
import { getCheckResults } from "@/api/operate";
import type { InspectionResult } from "@/typing";
import { ref, reactive, watch, nextTick, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
const tableData = ref<any>([]);
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const getDataText = reactive({
  inspectType: "",
  inspect: "",
  dateStart: "",
  dateEnd: "",
})
const typeList = ref(
  [
    {
      lable: "首检",
      value: "FI",
    },
    {
      lable: "巡检",
      value: "RI",
    },
    {
      lable: "开班点检",
      value: "CI",
    },
    {
      lable: "设备点检",
      value: "EI",
    },
    {
      lable: "4M点检",
      value: "4I",
    }
  ]
)
const inquire = ref('order')
const inquireList = ref([
  {
    lable: "单号",
    value: "order",
  },
  {
    lable: "时间",
    value: "times",
  },
])
const value1 = ref([])

watch(() => value1.value, (data) => {
  console.log(data)
  getDataText.dateStart = data[0];
  getDataText.dateEnd = data[1];
})

watch(() => inquire.value, (newData, oldData) => {
  if (newData == "times") {
    getDataText.inspect = "*";
  } else {
    getDataText.inspect = "";
  }
  if (newData != oldData) {
    getDataText.inspectType = "";
  }
})

watch(() => getDataText.inspectType, (newData) => {
  value1.value = [];
  if (newData == "RI" && inquire.value != "times") {
    getDataText.inspect = "BICVRI_";
  }
  if (newData == "FI" && inquire.value != "times") {
    getDataText.inspect = "BICVFI";
  }
  if (newData == "EI" && inquire.value != "times") {
    getDataText.inspect = "BICVEI";
  }
  if (newData == "4I" && inquire.value != "times") {
    getDataText.inspect = "BICV4I";
  }
  if (newData == "CI" && inquire.value != "times") {
    getDataText.inspect = "BICVCI";
  }
})
onBeforeMount(() => {
  getScreenHeight()
})

onMounted(() => {
  window.addEventListener("resize", getScreenHeight);

});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
})


const getData = () => {
  getCheckResults(getDataText).then((res: any) => {
    // console.log(res.content);
    dataProcessing(res.content)
  })
}

const dataProcessing=(data:any)=>{
      let a: InstanceType<typeof InspectionResult>[]  = [];
      data.forEach((item:any) => {
        let isExist = a.findIndex(
          (ela:any) => ela.InspectOrder == item.InspectOrder
        );
        if (isExist != -1) {
          let b = a[isExist].stepItemList.findIndex((t:any) => t.StepName == item.StepName);
          if (b == -1) {
            let Attachment = [];
            if (item.Attachment1) {
              Attachment.push(item.Attachment1);
            }
            if (item.Attachment2) {
              Attachment.push(item.Attachment2);
            }
            if (item.Attachment3) {
              Attachment.push(item.Attachment3);
            }
            if (item.Attachment4) {
              Attachment.push(item.Attachment4);
            }
            a[isExist].stepItemList.push({
              StepName: item.StepName,
              Step: item.Step,
              Status: item.Status,
              Remark: item.Remark,
              Attachment: Attachment,
              InspectContent: item.InspectContent,
              step1: item.InspectOrder + "-" + item.Step,
            });
            // console.log(a[isExist].stepItemList.Attachment);
          }
        } else {
          let obj:InstanceType<typeof InspectionResult> = {
            InspectOrder: item.InspectOrder,
            step1: item.InspectOrder,
            stepItemList: [
              {
                StepName: item.StepName,
                InspectContent: item.InspectContent,
                Step: item.Step,
                Status: item.Status,
                Remark: item.Remark,
                Attachment: [],
                step1: item.InspectOrder + "-" + item.Step,
              },
            ],
          };
          if (item.Attachment1) {
            obj.stepItemList[0].Attachment.push(item.Attachment1);
          }
          if (item.Attachment2) {
            obj.stepItemList[0].Attachment.push(item.Attachment2);
          }
          if (item.Attachment3) {
            obj.stepItemList[0].Attachment.push(item.Attachment3);
          }
          if (item.Attachment4) {
            obj.stepItemList[0].Attachment.push(item.Attachment4);
          }

          a.push(obj);
        }
      });
      tableData.value = a;
      // console.log(a);
}

const resultText = (data: any) => {
  let text = "";
  switch (data) {
    case "0":
      text = "未检查";
      break;
    case "9":
      text = "正常";
      break;
    case "1":
      text = "NG";
      break;
    case "2":
      text = "报修";
      break;
    case "3":
      text = "故障";
      break;
  }
  return text;
}

const resultTag = (data: any) => {
  let text = "";
  switch (data) {
    case "0":
      text = "";
      break;
    case "9":
      text = "success";
      break;
    case "1":
      text = "danger";
      break;
    case "2":
      text = "warning";
      break;
    case "3":
      text = "info";
      break;
  }
  return text;
}

const handleSizeChange = (val: any) => {
  currentPage.value = 1;
  pageSize.value = val;
};
const handleCurrentChange = (val: any) => {
  currentPage.value = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 210;
  });
};
</script>

<style lang="scss" scoped></style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>