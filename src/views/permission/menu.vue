<template>
  <div class="p-2">
    <el-card shadow="always" :body-style="{ padding: '8px' }">
      <div class="mb-2">
        <el-button type="primary" @click="openAdd" size="small">添加</el-button>
      </div>
      <div class="w-full">
        <el-table
          size="small"
          :data="tableData"
          stripe
          border
          fit
          :height="tableHeight"
          row-key="ID"
          :tree-props="{ children: 'childMenu' }"
        >
          <el-table-column prop="title" label="菜单名称"> </el-table-column>
          <el-table-column prop="icon" label="图标" align="center" width="60">
            <template #default="scope">
              <el-icon :size="20" v-if="scope.row.icon">
                <component :is="scope.row.icon" />
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="path" label="PATH路径"> </el-table-column>
          <el-table-column prop="MenuName" label="组件名称"> </el-table-column>
          <el-table-column prop="component" label="组件"> </el-table-column>

          <el-table-column prop="sortId" label="排序" width="80" align="center">
            <template #default="scope">
              <span>{{ scope.row.sortId }}</span>
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            width="180"
            align="center"
          >
            <template #default="scope">
              <el-tooltip
                content="复制"
                placement="top"
                v-if="
                  scope.row.MenuName !== 'Portal' &&
                  scope.row.MenuName !== 'PDA' &&
                  scope.row.MenuName !== 'OPUI'
                "
              >
                <el-button
                  type="warning"
                  icon="CopyDocument"
                  size="small"
                  @click.prevent="handleCopy(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                content="编辑"
                placement="top"
                v-if="
                  scope.row.MenuName !== 'Portal' &&
                  scope.row.MenuName !== 'PDA' &&
                  scope.row.MenuName !== 'OPUI'
                "
              >
                <el-button
                  type="primary"
                  icon="EditPen"
                  size="small"
                  @click.prevent="handleEdit(scope.row)"
                ></el-button>
              </el-tooltip>

              <el-tooltip
                content="删除"
                placement="top"
                v-if="
                  scope.row.MenuName !== 'Portal' &&
                  scope.row.MenuName !== 'PDA' &&
                  scope.row.MenuName !== 'OPUI'
                "
              >
                <el-button
                  type="danger"
                  icon="Delete"
                  size="small"
                  @click.prevent="handleDelete(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      v-model="addVisible"
      align-center
      title="新增"
      width="40%"
      @close="addCancel"
    >
      <el-form
        ref="formRef"
        :model="form"
        label-position="left"
        label-width="auto"
      >
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="tabPosition" aria-label="label position">
            <el-radio-button value="目录">目录</el-radio-button>
            <el-radio-button value="菜单">菜单</el-radio-button>
          </el-radio-group></el-form-item
        >
        <el-form-item label="父级菜单" prop="chooseName">
          <el-select
            ref="selectUpResId"
            v-model="chooseName"
            placeholder="请选择"
            clearable
          >
            <el-option
              :value="chooseName"
              disabled
              style="overflow: auto; height: 100%"
            >
              <el-tree
                style="min-height: 150px; max-height: 300px"
                :props="defaultProps"
                :data="treeData"
                node-key="ID"
                :expand-on-click-node="false"
                :check-on-click-node="true"
                @node-click="handleNodeClick"
              >
              </el-tree
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="MenuType">
          <el-select
            v-model="form.MenuType"
            placeholder="选择类型"
            style="width: 240px"
          >
            <el-option
              v-for="item in list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title"
          ><el-input v-model="form.title" placeholder="请输入"
        /></el-form-item>
        <el-form-item label="图标" prop="icon"
          ><el-input v-model="form.icon" placeholder="请输入图标"
        /></el-form-item>
        <el-form-item label="PATH路径" prop="path"
          ><el-input v-model="form.path" placeholder="请输入PATH路径"
        /></el-form-item>
        <el-form-item label="路由名称" prop="MenuName"
          ><el-input v-model="form.MenuName" placeholder="请输入路由名称name"
        /></el-form-item>
        <el-form-item label="重定向" prop="redirect"
          ><el-input v-model="form.redirect" placeholder="请输入重定向"
        /></el-form-item>
        <el-form-item label="组件" prop="component"
          ><el-input
            :disabled="fmeun"
            v-model="form.component"
            placeholder="请输入物理路径"
        /></el-form-item>
        <el-form-item label="排序" prop="sortId"
          ><el-input-number
            :min="0"
            controls-position="right"
            v-model="form.sortId"
            placeholder="请输入"
        /></el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCancel()">取消</el-button>
          <el-button type="primary" @click="onSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      title="修改"
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="editCancel()"
      v-model="editVisible"
      width="50%"
    >
      <el-form :model="editForm" label-width="auto">
        <el-form-item label="父级菜单">
          <el-select
            ref="selectUpResId"
            v-model="editPName"
            placeholder="请选择"
            clearable
          >
            <el-option
              :value="editPName"
              disabled
              style="overflow: auto; height: 100%"
            >
              <el-tree
                style="min-height: 150px; max-height: 300px"
                :props="defaultProps"
                :data="treeData"
                node-key="ID"
                :expand-on-click-node="false"
                :check-on-click-node="true"
                @node-click="handleENodeClick"
              >
              </el-tree
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="MenuType">
          <el-select
            v-model="editForm.MenuType"
            placeholder="选择类型"
            style="width: 240px"
          >
            <el-option
              v-for="item in list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="PATH路径" prop="path">
          <el-input v-model="editForm.path" placeholder="路径"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="editForm.title" placeholder="菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="组件" prop="component">
          <el-input
            :disabled="fmeun"
            v-model="editForm.component"
            placeholder="组件"
          ></el-input>
        </el-form-item>
        <el-form-item label="组件名称" prop="MenuName">
          <el-input
            v-model="editForm.MenuName"
            placeholder="组件名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="editForm.icon" placeholder="图标"></el-input>
        </el-form-item>
        <el-form-item label="重定向" prop="redirect"
          ><el-input v-model="editForm.redirect" placeholder="请输入"
        /></el-form-item>
        <el-form-item label="排序" prop="sortId"
          ><el-input-number
            :min="0"
            controls-position="right"
            v-model="editForm.sortId"
            placeholder="请输入"
        /></el-form-item>
      </el-form>
      <template #footer>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editSubmit()">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      title="复制"
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="copyCancel()"
      v-model="copyVisible"
      width="50%"
    >
      <el-form :model="copyform" label-width="auto" ref="copyRef">
        <el-form-item label="父级菜单">
          <el-select
            ref="selectUpResId"
            v-model="copyPName"
            placeholder="请选择"
            clearable
          >
            <el-option
              :value="copyPName"
              disabled
              style="overflow: auto; height: 100%"
            >
              <el-tree
                style="min-height: 150px; max-height: 300px"
                :props="defaultProps"
                :data="treeData"
                node-key="ID"
                :expand-on-click-node="false"
                :check-on-click-node="true"
                @node-click="handleCNodeClick"
              >
              </el-tree
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="MenuType">
          <el-select
            v-model="copyform.MenuType"
            placeholder="选择类型"
            style="width: 240px"
          >
            <el-option
              v-for="item in list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="PATH路径" prop="path">
          <el-input v-model="copyform.path" placeholder="路径"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="copyform.title" placeholder="菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="组件" prop="component">
          <el-input
            :disabled="fmeun"
            v-model="copyform.component"
            placeholder="组件"
          ></el-input>
        </el-form-item>
        <el-form-item label="组件名称" prop="MenuName">
          <el-input
            v-model="copyform.MenuName"
            placeholder="组件名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="copyform.icon" placeholder="图标"></el-input>
        </el-form-item>
        <el-form-item label="重定向" prop="redirect"
          ><el-input v-model="copyform.redirect" placeholder="请输入"
        /></el-form-item>
        <el-form-item label="排序" prop="sortId"
          ><el-input-number
            :min="0"
            controls-position="right"
            v-model="copyform.sortId"
            placeholder="请输入"
        /></el-form-item>
      </el-form>
      <template #footer>
        <span slot="footer" class="dialog-footer">
          <el-button @click="copyCancel()">取消</el-button>
          <el-button type="primary" @click="copySubmit()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, ElTree } from "element-plus";
import { getToken } from "@/utils/auth";
import { useUserStoreWithOut } from "@/stores/modules/user";
import { getFirstMeun, addMeun, deleteMeun, updateMeun } from "@/api/permiss";
import {
  ref,
  unref,
  nextTick,
  reactive,
  onBeforeMount,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";

const userStore = useUserStoreWithOut();
const tableData = ref([]);
const treeData = ref([]);
const pageSize = ref(10);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const copyVisible = ref(false);
const copyRef = ref();
const tabPosition = ref("菜单");
const chooseName = ref("");
const fmeun = ref(false);
const selectUpResId = ref<any>(null);
const defaultProps = reactive({ label: "title", children: "childMenu" });
const form = ref({
  title: "",
  icon: "",
  path: "",
  MenuName: "",
  component: "",
  MenuLevel: 0,
  MenuType: "",
  MenuFID: "",
  redirect: "",
  sonNum: 0,
  sortId: 0,
  IsDelete: "",
  CreateBy: userStore.getUserInfo,
  CreateDate: "",
  UpdateBy: "",
  UpdateDate: "",
});
const copyform = ref({
  ID: "", // 改为大写 ID
  title: "",
  icon: "",
  path: "",
  MenuName: "",
  component: "",
  MenuLevel: 0,
  MenuType: "",
  MenuFID: "",
  redirect: "",
  sonNum: 0,
  sortId: 0,
  IsDelete: "",
  CreateBy: userStore.getUserInfo,
  CreateDate: "",
  UpdateBy: "",
  UpdateDate: "",
});
const editForm = reactive({
  ID: "", // 改为大写 ID
  path: "",
  title: "",
  component: "",
  MenuName: "",
  icon: "",
  MenuFID: "",
  MenuLevel: "",
  MenuType: "",
  redirect: "",
  sortId: 0,
  IsDelete: "",
  CreateBy: "",
  CreateDate: "",
  UpdateBy: userStore.getUserInfo,
  UpdateDate: "",
});
const editPName = ref("");
const copyPName = ref("");
const editid = ref();
const formRef = ref();
const arrID = ref([] as any[]);
const list = reactive([
  {
    value: "Portal",
    label: "Portal",
  },
  {
    value: "PDA",
    label: "PDA",
  },
  {
    value: "OPUI",
    label: "OPUI",
  },
]);

// ==================== 核心修复函数：将 childMenu: null 改为 [] ====================
const fixMenuData = (menus: any[]): any[] => {
  if (!menus || !Array.isArray(menus)) return [];

  return menus.map((menu) => {
    if (!menu.childMenu || menu.childMenu === null) {
      menu.childMenu = [];
    }
    if (menu.childMenu.length > 0) {
      menu.childMenu = fixMenuData(menu.childMenu);
    }
    return menu;
  });
};

const generateTreeData = (menus: any[]): any[] => {
  if (!menus || !Array.isArray(menus)) return [];
  return menus.map((menu) => ({
    ...menu,
    childMenu: menu.childMenu ? generateTreeData(menu.childMenu) : [],
  }));
};

onBeforeMount(() => {
  getScreenHeight();
});

onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
});

watch(
  () => tabPosition.value,
  (newValue) => {
    if (newValue == "目录") {
      fmeun.value = false;
      form.value.MenuLevel = 0;
    } else {
      fmeun.value = false;
      form.value.component = "";
    }
  },
);

const getData = () => {
  getFirstMeun().then((data: any) => {
    const rawData = JSON.parse(JSON.stringify(data.content));
    const fixedData = fixMenuData(rawData);
    tableData.value = fixedData;
    treeData.value = generateTreeData(fixedData);
  });
};

const openAdd = () => {
  addVisible.value = true;
  form.value = {
    title: "",
    icon: "",
    path: "",
    MenuName: "",
    component: "",
    MenuLevel: 0,
    MenuType: "",
    MenuFID: "",
    redirect: "",
    sonNum: 0,
    sortId: 0,
    IsDelete: "",
    CreateBy: userStore.getUserInfo,
    CreateDate: "",
    UpdateBy: "",
    UpdateDate: "",
  };
  chooseName.value = "";
  tabPosition.value = "菜单";
};

const addCancel = () => {
  addVisible.value = false;
  chooseName.value = "";
  formRef.value?.resetFields();
};

const handleNodeClick = (data: any) => {
  chooseName.value = data.title;
  form.value.MenuFID = data.ID; // 改为 data.ID
  form.value.MenuLevel = data.MenuLevel + 1;
  selectUpResId.value.blur();
};

const onSubmit = () => {
  addMeun(form.value).then((res) => {
    getData();
    addVisible.value = false;
    ElMessage.success("添加成功");
  });
};

const handleCopy = (row: any) => {
  // 复制时不需要 ID，让后端自动生成
  copyform.value = {
    ID: "", // 清空 ID
    title: row.title,
    icon: row.icon || "",
    path: row.path,
    MenuName: row.MenuName,
    component: row.component || "",
    MenuLevel: row.MenuLevel,
    MenuType: row.MenuType,
    MenuFID: row.MenuFID || "",
    redirect: row.redirect || "",
    sonNum: 0,
    sortId: (row.sortId || 0) + 1,
    IsDelete: false,
    CreateBy: userStore.getUserInfo,
    CreateDate: "",
    UpdateBy: "",
    UpdateDate: "",
  };
  copyPName.value = "";
  if (row.MenuFID != null) {
    findNameById(row.MenuFID, tableData.value, "copy");
  }
  copyVisible.value = true;
};

const copyCancel = () => {
  copyVisible.value = false;
  copyRef.value?.resetFields();
};

const copySubmit = () => {
  addMeun(copyform.value).then((res) => {
    getData();
    copyVisible.value = false;
    ElMessage.success("复制成功");
  });
};

const handleCNodeClick = (data: any) => {
  copyPName.value = data.title;
  copyform.value.MenuFID = data.ID; // 改为 data.ID
  copyform.value.MenuLevel = data.MenuLevel + 1;
  selectUpResId.value.blur();
};

const handleEdit = async (row: any) => {
  editForm.ID = row.ID; // 改为 row.ID
  editForm.MenuFID = row.MenuFID;
  editForm.MenuLevel = row.MenuLevel;
  editForm.MenuName = row.MenuName;
  editForm.component = row.component;
  editForm.icon = row.icon;
  editForm.path = row.path;
  editForm.title = row.title;
  editForm.redirect = row.redirect;
  editForm.sortId = row.sortId;
  editForm.MenuType = row.MenuType;
  editVisible.value = true;
  editPName.value = "";
  if (row.MenuFID != null) {
    findNameById(row.MenuFID, tableData.value, "edit");
  }
};

const handleENodeClick = (data: any) => {
  editPName.value = data.title;
  editForm.MenuFID = data.ID; // 改为 data.ID
  editForm.MenuLevel = data.MenuLevel + 1;
  selectUpResId.value.blur();
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteMeun(row.ID).then(({ data }) => {
        // 改为 row.ID
        getData();
        ElMessage.success("删除成功");
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消操作",
      });
    });
};

const editCancel = () => {
  editVisible.value = false;
};

const editSubmit = () => {
  updateMeun(editForm).then((res) => {
    editVisible.value = false;
    getData();
    ElMessage.success("修改成功");
  });
};

const findNameById = (id: any, data: any, type: string) => {
  for (const item of data) {
    if (item.ID == id) {
      // 改为 item.ID
      if (type === "edit") {
        editPName.value = item.title;
      } else if (type === "copy") {
        copyPName.value = item.title;
      }
      return true;
    }
    if (item.childMenu && item.childMenu.length > 0) {
      const result = findNameById(id, item.childMenu, type);
      if (result) return true;
    }
  }
  return false;
};

const handleSizeChange = (val: any) => {
  currentPage.value = 1;
  pageSize.value = val;
};

const handleCurrentChange = (val: any) => {
  currentPage.value = val;
};

const getScreenHeight = () => {
  nextTick(() => {
    tableHeight.value = window.innerHeight - 154;
  });
};
</script>

<style lang="scss" scoped></style>
<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
