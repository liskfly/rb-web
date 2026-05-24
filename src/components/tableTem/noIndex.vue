<template>
    <div>
      <el-table :data="tableData.slice(
        (pageObj.currentPage - 1) * pageObj.pageSize,
        pageObj.currentPage * pageObj.pageSize
      )
        " stripe border fit :height="tableHeight" :size="size || 'default'" :tooltip-effect="'dark'" style="width: 100%"
        @selection-change="handleSelectionChange" @row-click="rowClick" ref="multipleTableRef" highlight-current-row>
        <el-table-column type="selection" fixed width="55" align="center" v-if="showSelect" />
        <el-table-column type="index" align="center" fixed label="序号" :width="size == 'small' ? '50' : '60'"
          v-if="showIndex">
          <template #default="scope">
            <span>{{ scope.$index+pageObj.pageSize* (pageObj.currentPage-1) +1}}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(c, i) in columnData" :key="i" :prop="c.prop" :label="c.label"
         :width="c.width" :min-width="c.min ? flexColumnWidth(c.label, c.prop) : ''"
          :fixed="c.fixed" :align="c.align || 'center'">
          <template #default="scope">
            <span v-if="c.text">{{ scope.row[c.prop] }}</span>
          </template>
        </el-table-column>
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty />
          </div>
        </template>
      </el-table>
      <div class="mt-2 mb-2">
        <el-pagination :size="'default'" background @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :pager-count="5" :current-page="pageObj.currentPage"
          :page-size="pageObj.pageSize" :page-sizes="pageSizes ? pageSizes:[30, 50, 100, 200,300]" layout="total,sizes, prev, pager, next"
          :total="tableData.length">
        </el-pagination>
      </div>
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
    'pageSizes'
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
    pageSizes
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
  
  const rowClick = (e: any, column: any) => {
    rowId.value = e[rowName?.value];
    emit("rowClick", cloneDeep(e));
  };
  
  const rowClassName = (data: any) => {
    // console.log(data);
    return "";
  };
  const rowStyle = (val: any) => {
    let data = cloneDeep(val.row);
    if (rowId.value == data[rowName?.value]) {
      return {
        "background-color": "#ffcd50",
        // 'color': '#fff'
      };
    }
    return {};
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
  // const getTextWidth = (str: string) => {
  //   let width = 0;
  //   const html = document.createElement("span");
  //   html.innerText = str;
  //   html.className = "getTextWidth";
  //   document.body?.appendChild(html);
  
  //   // 使用类型断言将 Element 转换为 HTMLElement
  //   const spanElement = document.querySelector(".getTextWidth") as HTMLElement;
  //   if (spanElement) {
  //     width = spanElement.offsetWidth;
  //     spanElement.remove();
  //   }
  //   console.log(width);
  //   return width;
  // };
  // const getTextWidth = (str: string): number => {
  //     let width = 0;
  //     let canvas = document.createElement("canvas");
  //     let context = canvas.getContext("2d");
  
  //     // 检查 context 是否为 null
  //     if (!context) {
  //         throw new Error("Unable to get 2D rendering context for canvas.");
  //     }
  
  //     context.font = "14px Microsoft YaHei";
  //     width = context.measureText(str).width;
  //     // console.log(width);
  //     return width;
  // };
  
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
  