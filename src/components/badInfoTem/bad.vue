<template>
    <div>
        <el-dialog v-model="badVisible" title="不良登记" width="60%" :append-to-body="true" :close-on-click-modal="false"
      :close-on-press-escape="false" align-center @close="badCancel">
      <div>
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            基本信息
          </div>
          <el-form ref="badFormRef" :model="badheadForm" label-width="auto">
            <el-form-item label="PCB条码" class="mb-[5px] flex">
              <el-input v-model="badForm.containerName" style="width: 160px" disabled />
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="生产计划号" class="mb-[5px] flex">
                  <el-input v-model="badheadForm.MfgOrderName" style="width: 160px" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="mb-[5px]" label="产品编码">
                  <el-input v-model="badheadForm.ProductName" style="width: 160px" disabled /> </el-form-item></el-col>
              <el-col :span="10">
                <el-form-item class="mb-[5px]" label="产品描述">
                  <el-input v-model="badheadForm.ProductDesc" style="width: 320px" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <div class="h-[30px] pl-3 flex items-center text-base text-[#fff] bg-[#006487]">
            不良原因
          </div>
          <table-temp :showIndex="true" :show-select="true" :tableData="BadtableData" :tableHeight="300"
            :columnData="badColumn"  @handleSelectionChange="handleSelectionChange"></table-temp>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="badCancel">取消</el-button>
          <el-button type="primary" @click="badSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {QueryDefectCode,DefectProductRecord} from "@/api/asyApi"
import { useAppStore } from "@/stores/modules/app";
import { useUserStoreWithOut } from "@/stores/modules/user";
import type { Formspan } from "@/typing";
import { cloneDeep } from "lodash-es";
import {toRefs,ref ,computed,reactive} from "vue"
import {  ElNotification  } from "element-plus";
import tableTemp from "@/components/tableTemp/index.vue";
const props = defineProps(['visible', 'containerName', 'badheadForm', 'form', 'formHeader', 'rules'])
const { visible,containerName, badheadForm, formHeader, rules } = toRefs(props)

interface Defect {
  isDefectLabel: string;
  isDefectType: number | string
}
interface BadForm {
  containerName: string;
  DefectDetails: Array<Defect>;
  workstationName: string;
  userAccount: string;
}
const appStore = useAppStore();
const userStore = useUserStoreWithOut();
const opui = appStore.getOPUIReal();
const badVisible = computed({
    get() {
        return visible?.value
    },
    set(val) {
        return val
    }
})
const badForm = ref<BadForm>({
  containerName: "",
  DefectDetails: [],
  workstationName: opui.station || "",
  userAccount: userStore.getUserInfo,
});
// const badheadForm = ref<InstanceType<typeof Formspan>>({
//   MfgOrderName: "",
//   ProductName: "",
//   ProductDesc: ""
// });
const badColumn = reactive([
  {
    text: true,
    prop: "isDefectReasonName",
    label: "不良代码",
    width: "100",
    align: "1",
  },
  {
    text: true,
    prop: "isDefectReasonDesc",
    label: "不良原因",
    width: "100",
    align: "1",
  },
]);
const changeList = ref([]);
const BadtableData = ref([]);
const handleSelectionChange = (data: any) => {
  let content = cloneDeep(data);
  changeList.value = content;
};
const badCancel = () => {
  badVisible.value = false;
  BadtableData.value = [];
  changeList.value = [];
  badForm.value.DefectDetails = [];
  // stopsForm.value.result = "OK";
};
const badSubmit = () => {
  changeList.value.forEach((c: any) => {
    badForm.value.DefectDetails.push({
      isDefectLabel: c.isDefectReasonName,
      isDefectType: 1
    });
  });
  // DefectProductRecord(badForm.value).then((res: any) => {
  //   msgTitle.value = "";
  //   msgType.value = true;
  //   if (res.success) {
  //     badVisible.value = false;
  //     BadtableData.value = [];
  //     changeList.value = [];
  //     badForm.value.DefectDetails = [];
  //     stopsForm.value.result = "OK";
  //     getFocus()
  //   }
  //   ElNotification({
  //     title: "提示信息",
  //     message: res.msg,
  //     type: res.success ? "success" : "error",
  //   });
  // });
};


</script>

<style scoped>

</style>