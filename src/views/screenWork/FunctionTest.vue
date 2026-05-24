<template>
  <div class="flex flex-col w-full h-full">
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[320px] ">
        <div class="w-full h-full box">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">基本信息</span>
          </div>
          <div class="p-[10px]">
            <el-form class="inbound" ref="formRef" :model="form" label-width="auto">
              <el-form-item size="large" v-for="f in formHeader" :key="f.value" :label="f.label">
                <span class="font-bold text-[18px] leading-[30px]"> {{ formText(f.value) }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-320px)]">
        <div class="w-full h-full flex flex-col">
          <div>
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-[120px] p-2">
              <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                @submit.native.prevent>
                <el-form-item label="扫描条码">
                  <el-input v-model="barCode" ref="inputRef" style="width: 500px;" placeholder="请扫描条码"
                    @change="getChange" />
                </el-form-item>
                <el-form-item :class="[stopsForm.CheckResult == 'OK' ? 'switchok' : 'switchng']">
                  <el-switch v-model="stopsForm.CheckResult" size="large"
                    style="zoom: 1.2;--el-switch-on-color:#ff4949 ; --el-switch-off-color: #13ce66" :active-value="'NG'"
                    :inactive-value="'OK'" active-text="NG" inactive-text="OK" />
                </el-form-item>
              </el-form>
              <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                {{ msgTitle === "" ? "请扫描物料批次条码" : msgTitle }}
              </div>
              <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                {{ msgTitle }}
              </div>
            </div>
          </div>
          <div class="flex flex-col flex-1">
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5">物料检验记录</span>
            </div>
            <div class="flex-1" ref="tablebox">
              <table-tem :showIndex="showIndex" :tableData="tableData" :tableHeight="tableHeight"
                :columnData="columnData" :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"></table-tem>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { MaterialFunctionCheck } from "@/api/scrApi"
import tableTem from '@/components/tableTem/index.vue'
import { useAppStoreWithOut } from '@/stores/modules/app'
import { useUserStoreWithOut } from "@/stores/modules/user";
import { checkStringType } from '@/utils/barcodeFormat'
// import formTemple from '@/components/formTem/form.vue'
import type { Formspan, FormHeader, OrderData } from "@/typing";

import { ref, reactive, onMounted, nextTick, onBeforeMount, onBeforeUnmount } from 'vue'
const appStore = useAppStoreWithOut()
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal()
// const title=appStore.getOPUIReal()
const barCode = ref('')
const inputRef = ref()
const activeName = ref('first')
const stopsForm = ref({
  ContainerName: '',//PCB
  CheckResult: 'OK',//工装治具
  workstationName: opui.station,//工位
  userAccount: userStore.getUserInfo//用户
})
const form = ref<InstanceType<typeof Formspan>>({
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  Qty: "",
  PlannedStartDate: "",
  PlannedCompletionDate: "",
})
const formHeader = reactive<InstanceType<typeof FormHeader>[]>([
  {
    label: "生产计划号",
    value: "MfgOrderName",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品机型",
    value: "BD_ProductModel",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "工单号",
    value: "ERPOrder",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "计划数量",
    value: "Qty",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品编码",
    value: "ProductName",
    disabled: true,
    type: "input",
    width: "",
  },
  {
    label: "产品描述",
    value: "ProductDesc",
    disabled: true,
    type: "textarea",
    width: 300,
  },
])
const tableData = ref([]);
const showIndex = ref(true)
const tableHeight = ref(0);
const columnData = reactive([
  {
    text: true,
    prop: "eqty",
    label: "物料批次条码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "eqName",
    label: "物料编码",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "eqName",
    label: "物料描述",
    width: "",
    align: "1",
  },

  {
    text: true,
    prop: "level",
    label: "检验结果",
    width: "100",
    align: "1",
  },
  {
    text: true,
    prop: "level",
    label: "检验人",
    width: "",
    align: "1",
  },
  {
    text: true,
    prop: "level",
    label: "检验时间",
    width: "",
    align: "1",
  }


])
const tablebox = ref()
const pageObj = ref({
  pageSize: 100,
  currentPage: 1
})
const msgTitle = ref("");
const msgType = ref(true);
onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});
const formText = (data: string) => {
  let key = data as keyof typeof form;
  return form.value[key];
};
const getChange = (val: any) => {
  let barCodeData = barCode.value;
  if (checkStringType(barCodeData) == "result") {
    if (barCodeData == "ng" || barCodeData == "NG") {
      stopsForm.value.CheckResult = "NG";
    } else {
      stopsForm.value.CheckResult = "OK";
    }
  } else {
    stopsForm.value.ContainerName=barCodeData
    MaterialFunctionCheck(stopsForm.value).then((res: any) => {
      msgTitle.value = res.msg;
      msgType.value = res.success;
      if (res.success) {
        stopsForm.value.CheckResult = "OK";
        stopsForm.value.ContainerName = "";
        form.value = { ...res.content[0] };
      } else {
        stopsForm.value.ContainerName = ""
        barCode.value = ""

      }
    })
  }
  barCode.value = ""

}
const openDialog = () => {
  console.log(barCode.value);
}


const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 320;
  });
};
</script>

<style lang="scss">
.inbound .el-form-item__label {
  font-size: 16px;

}

.setwidth {
  flex: 0 0 320px;

}

.box {
  border-right: 2px solid #cbcbcb;


}
.el-switch__label {
  font-weight: bold;
}

.switchok .el-switch__label.is-active {
  color: #13ce66;
}

.switchng .el-switch__label.is-active {
  color: #ff4949;
}
</style>