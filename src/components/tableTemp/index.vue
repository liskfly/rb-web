<template>
  <div>
    <el-table :data="tableData" stripe border fit :height="tableHeight" :size="size || 'default'" :tooltip-effect="'dark'" style="width: 100%"
      @selection-change="handleSelectionChange" @row-click="rowClick"      ref="multipleTableRef">
      <el-table-column type="selection" fixed width="55" align="center" v-if="showSelect" />
      <el-table-column type="index" align="center" fixed label="序号" :width="size == 'small' ? '50' : '60'"
        v-if="showIndex">
      </el-table-column>
      <el-table-column v-for="(c, i) in columnData" :key="i" :prop="c.prop" :label="c.label"
        :show-overflow-tooltip="true" :width="c.width" :min-width="c.min ? flexColumnWidth(c.label, c.prop) : ''"
        :fixed="c.fixed" :align="c.align || 'center'">
        <template #default="scope">
          <span v-if="c.text">{{ scope.row[c.prop] }}</span>
          <div v-if="c.tag === true">
            <el-tag v-if="c.tagType === 'string'" :type="c.tagItem[scope.row[c.prop]]" effect="plain">
              {{ scope.row[c.prop] }}
            </el-tag>
            <el-tag v-if="c.tagType === 'boolean'" :type="scope.row[c.prop] ? c.tagItem[0].type : c.tagItem[1].type"
              effect="plain">
              {{ scope.row[c.prop] ? c.tagItem[0].text : c.tagItem[1].text }}
            </el-tag>
            <div v-for="item in c.tagItem">
              <el-tag v-if="
                item.number == scope.row[c.prop] && c.tagType === 'number'
              " :type="item.type" effect="plain">
                {{ item.text }}
              </el-tag>
            </div> 
          </div>
          <el-tooltip v-if="c.isOperation" v-for="(o, oi) in c.operation" :key="oi" :content="o.label" placement="top">
            <el-button v-if="o.icon" :icon="o.icon" size="small" :color="o.color" :type="o.type" :disabled="o.disabled?scope.row[o.prop] == o.disabled:false" @click="o.buttonClick(scope.row)" />
            <!-- <span v-if="!o.icon" text class="underline font-bold text-[#006487]" @click="o.buttonClick(scope.row)">{{
              scope.row[o.prop] || o.label }}</span> -->
            <el-button v-if="!o.icon" size="small" :type="o.type" :color="o.color" @click="o.buttonClick(scope.row)"
            :disabled="o.disabled?scope.row[o.prop] == o.disabled:false">{{ o.label }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <template #empty>
        <div class="flex items-center justify-center h-100%">
          <el-empty />
        </div>
      </template>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { cloneDeep } from "lodash-es";
import { toRefs, ref } from "vue";
const props = defineProps([
  "tableData",
  "tableHeight",
  "columnData",
  "pageObj",
  "showIndex",
  "showSelect",
  "size",
  "rowName",
]);
const {
  tableData,
  tableHeight,
  columnData,
  pageObj,
  showIndex,
  showSelect,
  size,
  rowName,
} = toRefs(props);

const multipleTableRef = ref();
const rowId = ref("");

const emit = defineEmits([
  "handleSizeChange",
  "handleCurrentChange",
  "handleSelectionChange",
  "rowClick",
]);

const handleSizeChange = (e: any) => {
  emit("handleSizeChange", e);
};
const handleSelectionChange = (e: any) => {
  emit("handleSelectionChange", e);
};

const handleCurrentChange = (e: any) => {
  emit("handleCurrentChange", e);
};



const rowClick = (e: any,column:any) => {
  rowId.value = e[rowName?.value];
  emit("rowClick", cloneDeep(e));
};

const rowClassName=(data:any)=>{
  // console.log(data);
  return '';  
}
const rowStyle = (val: any) => {
  let data = cloneDeep(val.row)
  if (rowId.value == data[rowName?.value]) {
    return {
      "background-color": "#ffcd50",
      // 'color': '#fff'
    };
  }
  return {};  
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

const toggleSelection = (rows?: any) => {
  if (rows) {
    rows.forEach((row: any, index: any) => {
      multipleTableRef.value!.toggleRowSelection(row, undefined);
    });
  } else {
    multipleTableRef.value!.clearSelection();
  }
};

const getTextWidth = (str: string) => {
  let fontSizeNum = size?.value == "small" ? 13 : 16;
  let width = 0;
  const html = document.createElement("span");
  html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${fontSizeNum}px; font-family: Arial, sans-serif;`;
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

const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label); // 把每列的表头也加进去算
  // console.log(arr);
  return getMaxLength(arr) + 25 + "px";
};

defineExpose({
  toggleSelection,
});
</script>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: #ffcd50;
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
<style lang="scss" scoped></style>
