<template>
  <div class="flex flex-col w-full h-full">
    <div class="w-full flex-1 flex">
      <div class="setwidth w-[350px]">
        <div class="w-full h-full box">
          <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
            <span class="ml-5">基本信息</span>
          </div>
          <div class="p-[10px]">
            <el-form ref="formRef" :model="form" label-width="auto"  @submit.native.prevent>
              <el-form-item label="MES屏条码" prop="scrBarCode">
                <el-input v-model="form.ContainerName" placeholder=""  @keyup.enter.native="getData"/>
              </el-form-item>
              <el-form-item label="生产计划号" prop="order">
                <el-input v-model="form.MfgOrderName" placeholder="" />
              </el-form-item>

              <el-form-item label="产品机型" prop="productCode">
                <el-input v-model="form.productmodel" placeholder="" />
              </el-form-item>
              <el-form-item label="产品编码" prop="order">
                <el-input v-model="form.productName" placeholder="" />
              </el-form-item>

              <el-form-item label="时间">
                <el-date-picker :shortcuts="shortcuts" v-model="searchDate" value-format="YYYY-MM-DD" type="daterange"
                  range-separator="-" :disabled-date="disabledDate" :clearable="false" />
              </el-form-item>
            </el-form>
            <div class="flex justify-end">
              <el-button type="primary" @click="getData">查询</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-350px)]">
        <div class="w-full h-full flex flex-col">
          <div class="flex flex-col flex-1">
            <div class="h-[35px] flex items-center text-lg justify-between text-[#fff] bg-[#006487]">
              <span class="ml-5"> 扫描条码</span>
            </div>
            <div class="h-[120px] p-5">
              <el-form class="inbound" ref="formRef" :inline="true" :model="form" label-width="auto"
                @submit.native.prevent>
                <el-form-item label="扫描条码">
                  <el-input v-model="barCode" ref="inputRef" style="width: 500px" placeholder="请扫描条码"
                    @keyup.enter.native="getChange" />
                </el-form-item>
              </el-form>
              <div class="text-xl font-bold text-[#00B400]">
                <div class="text-xl font-bold text-[#00B400]" v-show="msgType === true || msgTitle === ''">
                  {{ msgTitle === "" ? "请扫描MES屏条码" : msgTitle }}
                </div>
                <div class="text-xl font-bold text-[red]" v-show="msgType === false && msgTitle !== ''">
                  {{ msgTitle }}
                </div>
              </div>
            </div>
            <div class="flex flex-col flex-1">
              <div class="h-[35px] flex items-center text-lg text-[#fff] bg-[#006487]">
                <span class="ml-5">不良品拆解</span>
              </div>
              <div class="flex-1" ref="tablebox">
                <el-table :data="tableData.slice(
                  (pageObj.currentPage - 1) * pageObj.pageSize,
                  pageObj.currentPage * pageObj.pageSize
                )
                  " :style="{ width: '100%' }" :height="tableHeight" stripe border fit>
                  <el-table-column label="序号" type="index" width="60" align="center" />
                  <el-table-column prop="ContainerName" label="MES屏条码" />
                  <el-table-column prop="MfgOrderName" label="生产计划号" />
                  <el-table-column prop="DefectTime" label="不良录入时间" />
                  <el-table-column prop="DismantlestartTime" label="拆解开始时间" />
                  <el-table-column prop="DismantleEndTime" label="拆解完成时间" />
                  <el-table-column prop="DismantleStatus" align="center" label="状态">
                    <template #default="scope">

                      <!-- <el-tag :style="{ marginRight: '6px' }" type="success">Tag 2</el-tag> -->
                      <el-tag effect="dark" v-if="scope.row.DismantleStatus == null || scope.row.DismantleStatus == ''"
                        type="info">待拆解</el-tag>
                      <el-tag effect="dark" v-if="scope.row.DismantleStatus == 'Doing'" type="warning">拆解中</el-tag>

                    </template>
                  </el-table-column>
                </el-table>

                <div class="w-full mt-3 flex justify-around">
                  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pageObj.currentPage" :page-size="pageObj.pageSize"
                    :page-sizes="[100, 300, 500, 1000]" layout="total,sizes, prev, pager, next"
                    :total="tableData.length">
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="badVisible" width="80%" :fullscreen="false" :append-to-body="true" class="saveAsDialog"
      :close-on-click-modal="false" :close-on-press-escape="false" align-center title="不良拆解" @close="repairCancel">
      <div class="flex flex-col border-solid border-1 border-[#bdbdbd]">
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            基本信息
          </div>
          <el-form ref="baseFormRef" :model="baseForm" label-width="auto" class="pt-[5px]">
            <el-row>
              <el-col :span="8">
                <el-form-item label="LCM条码" class="mb-[5px] flex" prop="ContainerName">
                  <el-input v-model="baseForm.ContainerName" style="width: 200px" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="生产计划号" class="mb-[5px] flex" prop="MfgOrderName">
                  <el-input v-model="baseForm.MfgOrderName" style="width: 200px" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品机型" class="mb-[5px] flex" prop="MfgOrderName">
                  <el-input v-model="baseForm.ProductModel" style="width: 200px" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item class="mb-[5px]" label="产品编码" prop="ProductName">
                  <el-input v-model="baseForm.ProductName" style="width: 200px" disabled /> </el-form-item></el-col>
              <el-col :span="10">
                <el-form-item class="mb-[5px]" label="产品描述">
                  <el-input v-model="baseForm.ProductDesc" style="width: 350px" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="mb-[5px]" label="维修类型">
                  <el-select v-model="RepairType" placeholder="请选择" style="width: 200px">
                    <el-option label="R" value="R" />
                    <el-option label="L" value="L" />
                    <el-option label="S" value="S" />
                    <el-option label="Z" value="Z" />

                  </el-select>
                  <!-- <el-input v-model="baseForm.ProductDesc" style="width: 300px" disabled /> -->
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col :span="8">
                <el-form-item class="mb-[5px]" label="工序编码" prop="SpecName">
                  <el-input v-model="baseForm.SpecName" style="width: 200px" disabled /> </el-form-item></el-col>
              <el-col :span="11">
                <el-form-item class="mb-[5px]" label="工序描述" prop="SpecDesc">
                  <el-input v-model="baseForm.SpecDesc" style="width: 200px" disabled />
                </el-form-item>
              </el-col>
            </el-row> -->
          </el-form>
        </div>
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            组件列表
          </div>
          <el-table :data="badData" :style="{ width: '100%' }" :height="300" stripe border fit>
            <el-table-column label="序号" type="index" width="60" align="center" />
            <el-table-column prop="ContainerName" label="MES屏条码" />
            <el-table-column prop="MfgOrderName" label="生产计划号" />
            <el-table-column prop="BindContainerName" label="供应商条码" />
            <!-- <el-table-column prop="State" label="检查结果" width="100">
              <template #default="scope">
                {{ scope.row.State == 0 ? "NG" : "OK" }}
              </template>
            </el-table-column> -->
            <el-table-column label="操作" width="300">
              <template #default="scope">
                <el-button type="warning" size="small" @click.prevent="unbinding(scope.row)" :disabled="isDisabled&&scope.$index!=0">解绑(良品)</el-button>
                <el-button type="danger" size="small" @click.prevent="scrap(scope.row,'原材不良')" :disabled="isDisabled&&scope.$index!=0">原材不良</el-button>
                <el-button type="danger" size="small" @click.prevent="scrap(scope.row,'制程报废')" :disabled="isDisabled&&scope.$index!=0">制程报废</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="repairCancel">关闭</el-button>
          <!-- <el-button @click="repairCancel">取消</el-button>-->
          <el-button type="primary" @click="repairSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useAppStoreWithOut } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  computed,
  watch,
  onBeforeMount,
  onBeforeUnmount,
} from "vue";
import { useProjectStoreWithOut } from "@/stores/modules/projectData";
import {
  DefectiveDisassemblyList,
  UpdateDisassemblyInfo,
  DefectiveComponentBindHistory,
  DefectiveScrap,
  DefectiveUnbinding,
  UnbindingConfirm
} from "@/api/scrApi";
import {
  shortcuts,
  setTodayDate,
  setLastDate,
  disabledDate,
} from "@/utils/dataMenu";
const appStore = useAppStoreWithOut();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const barCode = ref("");
const tabsValue = ref("history");
const qtyVisible = ref(false);
const badVisible = ref(false);
const inputRef = ref();
const msgType = ref(true);
const msgTitle = ref("");
const unbindType = ref("R");
const projectStore: any = useProjectStoreWithOut();
const stopsForm = ref({
  ContainerName: "", //PCB
  result: "OK", //工装治具
  WorkStationName: opui.station, //工位
  ResourceName: opui.station !== null ? opui.station : "", //设备
  EmployeeName: userStore.getUserInfo, //用户
});
const form = ref({
  ContainerName: "",
  StartTime: "",
  EndTime: "",
  WorkStation: opui.station,
  MfgOrderName: "",
  productmodel: "",
  productName: "",
});
const tableData = ref([]);

const columnData = reactive([
  {
    text: true,
    prop: "ContainerName",
    label: "MES屏条码",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "mfgorderName",
    label: "生产计划号",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "TxnDate",
    label: "不良录入时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "DismantlestartTime",
    label: "拆解开始时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "DismantleEndTime",
    label: "拆解完成时间",
    width: "",
    min: true,
    align: "1",
  },
  {
    text: true,
    prop: "DismantleStatus",
    label: "状态",
    width: "",
    min: true,
    align: "1",
  },
]);
const tableHeight = ref(0);
const pageObj = ref({
  pageSize: 100,
  currentPage: 1,
});
const baseForm = ref({
  ContainerName: "",
  MfgOrderName: "",
  ProductName: "",
  ProductDesc: "",
  ProductModel: "",
  SpecName: "",
  SpecDesc: "",
});

const qtyForm = ref({
  ContainerName: "",
  MfgOrderName: "",
  ProductName: "",
  Description: "",
});

const qtypageObj = ref({
  pageSize: 100,
  currentPage: 1,
});
const searchDate = ref<any[]>([]);
const badData = ref([]);
const baseFormRef = ref();
const RepairType = ref("R")
watch(
  () => searchDate.value,
  (newVal: any, oldVal: any) => {
    if (newVal === null) {
      form.value.StartTime = "";
      form.value.EndTime = "";
      // getForm.value.currentPage = 1;
      //   getDetailForm.value.currentPage = 1;
      getData();
      return;
    }
    if (newVal !== oldVal) {
      form.value.StartTime = newVal[0];
      form.value.EndTime = newVal[1];
      form.value.EndTime = newVal[1] + " " + "23:59:59"
      // getForm.value.currentPage = 1;
      // detailData.value = [];
      //   getDetailForm.value.currentPage = 1;
      getData();
    }
  }
);

const isDisabled=computed(()=>{
    let isEixt=badData.value.findIndex((item:any)=>item.BindContainerName!=null||item.BindContainerName!=="")
    if(isEixt!=-1){
      return true
    }else{
      return false
    }
})

onBeforeMount(() => {
  getScreenHeight();
  let end: string = setTodayDate();
  let start: string = setLastDate();
  end = end + " " + "23:59:59"
  searchDate.value = [start, end];
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  // console.log(appStore.getOpuiData.stationDec);
});
onBeforeUnmount(() => {
  window.addEventListener("resize", getScreenHeight);
});

const getData = () => {
  DefectiveDisassemblyList(form.value).then((res: any) => {
    if (res.success) {
      tableData.value = res.content;
    }
    inputRef.value.focus();
  });
};


//报废
const scrap = (row: any,type:any) => {
  ElMessageBox.confirm(`确认${type}`, "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      DefectiveScrap({
        containerName: row.ContainerName,
        SupplierContainer: row.BindContainerName==null||row.BindContainerName==""?row.ContainerName:row.BindContainerName,
        workstationName: opui.station,
        userAccount: userStore.getUserInfo,
        ScrapType:type
      }).then((res: any) => {
        ElNotification({
          title: "提示信息",
          message: res.msg,
          type: res.success ? "success" : "error",
        });
        if (res.success) {
          getBdingData()
          getData()
        }
      });
    })
    .catch(() => {
      ElNotification({
        type: "info",
        message: "取消操作",
      });
    });
};
const unbinding = (row: any) => {
  ElMessageBox.confirm("确认解绑", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      DefectiveUnbinding({
        containerName: row.ContainerName,
        SupplierContainer: row.BindContainerName,
        workstationName: opui.station,
        userAccount: userStore.getUserInfo,
      }).then((res: any) => {
        ElNotification({
          title: "提示信息",
          message: res.msg,
          type: res.success ? "success" : "error",
        });
        if (res.success) {
          getBdingData()
          getData()
        }
      });
    })
    .catch(() => {
      ElNotification({
        type: "info",
        message: "取消操作",
      });
    });
}

const getBdingData = () => {
  DefectiveComponentBindHistory(baseForm.value.ContainerName).then((res: any) => {
    if (res.success) {
      badData.value = res.content;
    }

    barCode.value = "";
  });
}
//拆解
const getChange = () => {
  DefectiveComponentBindHistory(barCode.value).then((res: any) => {

    if (res.success) {
      badData.value = res.content;
      baseForm.value.ContainerName = res.content2[0].containername;
      baseForm.value.ProductDesc = res.content2[0].Description;
      baseForm.value.MfgOrderName = res.content2[0].MfgOrderName;
      baseForm.value.ProductName = res.content2[0].ProductName;
      baseForm.value.ProductModel = res.content2[0].ProductModel;
      baseForm.value.SpecDesc = res.content2[0].SpecDesc;
      baseForm.value.SpecName = res.content2[0].SpecName;
      badVisible.value = true;
      UpdateDisassemblyInfo(barCode.value).then((res: any) => {
        if (res.success) {
          getData()
        }
      })
    } else {
      msgTitle.value = res.msg;
      msgType.value = res.success;
    }

    barCode.value = "";
  });
};
const repairCancel = () => {
  baseFormRef.value.resetFields();
  inputRef.value.focus();
  RepairType.value = "R"
  badVisible.value = false;
};
const repairSubmit = () => {
  ElMessageBox.confirm("确认完成", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
  
    .then(() => {

      UnbindingConfirm(
        {
          containerName: baseForm.value.ContainerName,
          RepairType: RepairType.value,
          // SupplierContainer: row.BindContainerName,
          workstationName: opui.station,
          userAccount: userStore.getUserInfo,
        }
      ).then((res: any) => {
        ElNotification({
          title: "提示信息",
          message: res.msg,
          type: res.success ? "success" : "error",
        });
        if (res.success) {
          RepairType.value = "R"
          getData()
          badVisible.value = false;

        }
      })

    })
    .catch(() => {
      ElNotification({
        type: "info",
        message: "取消操作",
      });
    });

};


//分页
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
const handleSizeChange1 = (val: any) => {
  qtypageObj.value.currentPage = 1;
  qtypageObj.value.pageSize = val;
};
const handleCurrentChange1 = (val: any) => {
  qtypageObj.value.currentPage = val;
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
  html.innerText = str;
  html.className = "getTextWidth";
  document.body?.appendChild(html);

  // 使用类型断言将 Element 转换为 HTMLElement
  const spanElement = document.querySelector(".getTextWidth") as HTMLElement;
  if (spanElement) {
    width = spanElement.offsetWidth;
    spanElement.remove();
  }
  // console.log(width);
  return width;
};

const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
};
</script>

<style lang="scss" scoped>
.inbound .el-form-item__label {
  font-size: 16px;
}

.setwidth {
  flex: 0 0 320px;
}

.box {
  border-right: 2px solid #cbcbcb;
}

.tabs-css .el-tabs--border-card {
  border-top: 1px solid #006487;
}

.tabs-css .el-tabs__header {
  background-color: #006487 !important;
}

.tabs-css .el-tabs__content {
  padding: 5px 0px;
}

.tabs-css .el-tabs__item {
  font-size: 1.1rem;
}

.tabs-css .el-tabs--border-card>.el-tabs__header .el-tabs__item {
  color: #fff;
  // padding: 0 !important;
}

.tabs-css .el-tabs__item.is-active {
  // color: #fff;
  color: #006487 !important;
  // font-weight: bold;
}

.tabs-css .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
  // color: #fff;
  background-color: #fff;
}

.switchok .el-switch__label.is-active {
  color: #13ce66;
}

.switchng .el-switch__label.is-active {
  color: #ff4949;
}
</style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
