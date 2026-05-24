<template>
  <div class="flex flex-col w-full h-full">
    <!-- <div class="h-[40px]  pl-2 pr-2 flex justify-between items-center">
      <span class="text-[1.2rem]"> {{ opui.stationDec }} </span>
    </div> -->
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[350px]">
        <div class="w-full h-full box">
          <div class="h-[35px] flex items-center justify-between text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">周转箱列表</span>
            <el-tooltip content="刷新" placement="top">
              <el-icon class="mr-3" color="#fff" :class="isLoding" size="24" @click="getCarrierList">
                <RefreshRight />
              </el-icon>
            </el-tooltip>
          </div>
          <div class="p-3" :style="{ height: boxHeight + 'px' }">
            <el-card shadow="always" class="mb-2" :body-style="{ padding: '8px' }" v-for="t in turnData"
              :key="t.CARRIERNAME">
              <el-form ref="formRef" :model="t" label-width="auto">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="周转箱类型">
                      <span :class="[
                        t.LOADTYPE == 'OK' ? 'text-[#00B400]' : 'text-[red]',
                        'font-bold text-base',
                      ]">{{ t.LOADTYPE }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="容量">
                      <span class="text-base">{{ t.CAPACITY }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="周转箱条码">
                      <span class="text-base text-[#006487] font-bold underline cursor-pointer"
                        @click="getList(t.CARRIERNAME)">{{ t.CARRIERNAME }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="装箱数量">
                      <span class="text-base">{{ t.QTY }}</span>
                    </el-form-item></el-col>
                </el-row>
              </el-form>
              <div class="flex justify-end">
                <el-button type="primary" :disabled="t.QTY == 0" @click="disFullBox(t)">不满箱装箱</el-button>
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-350px)]">
        <div class="w-full h-full flex flex-col">
          <div>
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-[120px] p-5">
              <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                @submit.native.prevent>
                <el-form-item label="扫描条码">
                  <el-input v-model.trim="form.PcbNumber" ref="inputRef" :autofocus="inputFocus" style="width: 500px"
                    placeholder="请扫描条码" @keyup.enter.native="getChange" />
                </el-form-item>
              </el-form>
              <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                {{ msgTitle === "" ? "请扫描PCB条码" : msgTitle }}
              </div>
              <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                {{ msgTitle }}
              </div>
            </div>
          </div>
          <div class="flex flex-col flex-1">
            <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
              <span class="ml-5">周转箱装载清单</span>
            </div>
            <div class="flex-1">
              <table-tem :showIndex="true" :tableData="tableData" :tableHeight="tableHeight" :columnData="columnData"
                :pageObj="pageObj" @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"></table-tem>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
 
  SubmitPcbToPacking,
  TrunkDeal,

} from "@/api/smtApi";
import { QueryCarrierList,  QueryPackListByCarrier} from "@/api/smtNolo"
import tableTem from "@/components/tableTem/index.vue";
import { useAppStoreWithOut } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
interface Turn {
  CARRIERNAME: string;
  LOADTYPE: string;
  CAPACITY: number;
  QTY: number;
}
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
const appStore = useAppStoreWithOut();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const inputRef = ref();
const form = ref({
  PcbNumber: "",
  SpecName: "SMT-BOX",
  workstationName: opui.station,
  userAccount: userStore.getUserInfo,
});
const msgTitle = ref("");
const msgType = ref(true);
const tableData = ref([]);
const tableHeight = ref(0);
const columnData = reactive([
  {
    text: true,
    prop: "CarrierName",
    label: "周转箱条码",
    width: "",
    min: true,
    fixed: true,
    align: "center",
  },
  {
    text: true,
    prop: "OrderNumber",
    label: "生产计划号",
    width: "",
    min: true,
    align: "center",
  },

  {
    text: true,
    prop: "PCBSerialNumber",
    label: "PCB条码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "PanelSerialNumber",
    label: "拼板号",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ProductName",
    label: "产品编码",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "ProductDescription",
    label: "产品描述",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "Qty",
    label: "数量",
    width: "",
    min: true,
    align: "center",
  },

  {
    text: true,
    prop: "LoadTimestamp",
    label: "装箱时间",
    width: "",
    min: true,
    align: "center",
  },
  {
    text: true,
    prop: "LoadOperatorID",
    label: "装箱人",
    width: "",
    min: true,
    align: "center",
  },
]);
const pageObj = ref({
  pageSize: 50,
  currentPage: 1,
  // isShow:-1
});
const turnData = ref<Turn[]>([]);
const boxHeight = ref(0);
const inputFocus = ref(true);
const isLoding = ref("");
const autoTimer=ref()

onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getCarrierList();
  autoTimer.value=setInterval(()=>{
    getCarrierList();
  },1000*5)
});
onBeforeUnmount(() => {
  clearInterval(autoTimer.value)
  window.addEventListener("resize", getScreenHeight);
});

const getCarrierList = () => {
  isLoding.value = "is-loading";
  // tableData.value = [];
  QueryCarrierList({ workStationName: opui.station }).then((res: any) => {
    let timer = setTimeout(() => {
      isLoding.value = "";
      clearTimeout(timer);
    }, 2000);
    if (res.content == null || res.content.length == 0) {
      turnData.value = []
    }else{
      turnData.value = res.content;
    }
    
    if (turnData.value.length !== 0) {
      getList(turnData.value[0].CARRIERNAME)
    }

  });
};

const disFullBox = (val: any) => {
  // console.log(val);
  let data = {
    WorkStationName: opui.station,
    CarrierName: val.CARRIERNAME,
    Capacity: val.CAPACITY,
    LoadType: val.LOADTYPE,
    CurrentCapacity: val.QTY,
    OperatorID: userStore.getUserInfo,
  };
  ElMessageBox.confirm("确定不满箱提交", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      TrunkDeal(data).then((res: any) => {
        // console.log(res);
        msgTitle.value = res.msg;
        msgType.value = res.success;
        getCarrierList();
      });
    })
    .catch(() => { });
};
const getList = (val: any) => {
  QueryPackListByCarrier({ carrierName: val }).then((res: any) => {
    if (res.content == null) {
      tableData.value = [];
      return;
    }
    tableData.value = res.content;
  });
};

const getChange = () => {
  inputFocus.value = false;
  SubmitPcbToPacking(form.value).then((res: any) => {
    msgTitle.value = res.msg;
    msgType.value = res.success;
    form.value.PcbNumber = "";
    if (res.success) {
      tableData.value = res.content;
      getCarrierList();
      msgTitle.value = res.msg + "周转箱列表已更新";
    } else {
      // tableData.value = [];
    }
    inputFocus.value = true;
  });
};

const handleSizeChange = (val: any) => {
  pageObj.value.currentPage = 1;
  pageObj.value.pageSize = val;
};
const handleCurrentChange = (val: any) => {
  pageObj.value.currentPage = val;
};
const getScreenHeight = () => {
  nextTick(() => {
    boxHeight.value = window.innerHeight - 155;
    tableHeight.value = window.innerHeight - 320;
  });
};
</script>

<style lang="scss" scoped>
.inbound .el-form-item__label {
  font-size: 16px;
}

.setwidth {
  flex: 0 0 350px;
}

.box {
  border-right: 2px solid #cbcbcb;
}

.list .el-table__empty-text {
  display: none;
}
</style>
