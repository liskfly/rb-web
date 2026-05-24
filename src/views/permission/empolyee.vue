<template>
  <div class="p-2 flex gap-[10px]">
    <el-card shadow="always" :body-style="{ padding: '8px' }" class="w-[250px] h-[calc(100vh-97px)]">
      <template #header>
        <div class="card-header flex justify-between items-center">
          <div class="flex gap-[5px] items-center">
            <img style="width: 24px; height: 24px" src="../../assets/svgs/or.svg" alt="" />
            <div class="h-[24px] box-border pt-[3px]">睿宝-组织</div>
          </div>

          <el-tooltip content="重置" placement="right">
            <el-icon size="24" :class="isLoding" color="#006487" @click="refreshData">
              <RefreshRight />
            </el-icon>
          </el-tooltip>
        </div>
      </template>
      <el-scrollbar class="h-[calc(100vh-160px)]">
        <el-tree style="max-width: 600px" highlight-current :data="organTree" :expand-on-click-node="false" :props="{
          children: 'children',
          label: 'OrganizationName',
        }" @node-click="handleNodeClick" />
      </el-scrollbar>
    </el-card>

    <el-card shadow="always" :body-style="{ padding: '8px 8px 0 8px' }" class="flex-1">
      <div class="mb-2 flex justify-between">
        <div>
          <el-button type="primary" @click="openAddEmployee" size="small">新增</el-button>
        </div>
        <div>
          <el-input v-model="searchName" clearable placeholder="请输入">
            <template #append>
              <el-button type="primary" icon="Search"></el-button>
            </template>
          </el-input>
        </div>
      </div>

      <el-table size="small" :data="tableData1.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        " border :height="tableHeight" stripe>
        <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
        <el-table-column label="工号" prop="employeeName" min-width="100">
        </el-table-column>
        <el-table-column label="员工姓名" prop="fullName" min-width="100">
        </el-table-column>
        <el-table-column label="职称" prop="title" :min-width="flexColumnWidth('职称', 'title')">
        </el-table-column>
        <el-table-column label="组织" prop="OrganizationName" :min-width="170">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160" align="center">
          <template #default="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button type="primary" icon="EditPen" size="small" @click="handleEdit(scope.row)" />
            </el-tooltip>
            <el-tooltip content="密码重置" placement="top">
              <el-button type="danger" icon="RefreshLeft" size="small" @click="handleRest(scope.row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" icon="Delete" size="small" @click="handleDeleteEmployee(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-2">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" :page-sizes="[30, 50, 100, 150, 200]"
          layout="total,sizes, prev, pager, next, jumper" :total="tableData1.length">
        </el-pagination>
      </div>
    </el-card>

    <!-- 新增员工对话框 -->
    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="新增员工" v-model="addEmployeeVisible" width="400px"
      @close="addEmployeeCancel()">
      <el-form :model="addEmployeeForm" ref="addEmployeeFormRef" :rules="addEmployeeRules" label-width="auto">
        <el-form-item label="账号(工号)" prop="EmployeeName">
          <el-input v-model="addEmployeeForm.EmployeeName" placeholder="请输入账号" clearable></el-input>
        </el-form-item>
        <el-form-item label="员工姓名" prop="FullName">
          <el-input v-model="addEmployeeForm.FullName" placeholder="请输入员工姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="组织" prop="OrganizationID">
          <el-tree-select
            v-model="addEmployeeForm.OrganizationID"
            :data="organTree"
            :props="{ label: 'OrganizationName', value: 'OrganizationId', children: 'children' }"
            placeholder="请选择组织"
            clearable
            check-strictly
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="是否在职" prop="IsOnline">
          <el-radio-group v-model="addEmployeeForm.IsOnline">
            <el-radio value="Y">是</el-radio>
            <el-radio value="N">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addEmployeeForm.email" placeholder="请输入邮箱" clearable></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addEmployeeCancel()">取消</el-button>
          <el-button type="primary" @click="addEmployeeSubmit()">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="用户角色" v-model="addVisible" width="400px"
      @close="addCancel()">
      <el-form :model="form" ref="formRef" label-width="auto">
        <el-form-item label="员工" prop="roleName">
          <el-input v-model="roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前角色" prop="role">
          <el-tag class="mb-2" :key="tag.RoleID" v-for="tag in hasRole" closable :disable-transitions="false"
            @close="handleClose(tag)">
            {{ tag.RoleName }}
          </el-tag>
        </el-form-item>
        <el-form-item label="角色" prop="roleIdArr">
          <el-select v-model="form.roleIdArr" multiple>
            <el-option v-for="item in noRole" :key="item.value" :label="item.lable" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCancel()">取消</el-button>
          <el-button type="primary" @click="onSubmit()">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="编辑" v-model="editVisible" width="400px"
      @close="editCancel()">
      <el-form :model="editForm" ref="editRef" label-width="auto">
        <el-form-item label="员工名" prop="FullName">
          <el-input v-model="editForm.FullName" placeholder="请输入员工名" clearable></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="EmployeeName">
          <el-input v-model="editForm.EmployeeName" placeholder="请输入账号" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="DocManagerUser">
          <el-input v-model="editForm.DocManagerUser" placeholder="请输入密码" clearable></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCancel()">取消</el-button>
          <el-button type="primary" @click="editSubmit()">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog :append-to-body="true" :close-on-click-modal="false" title="重置密码" v-model="restVisible" width="400px"
      @close="upDateCancel()">
      <el-form :model="rePwForm" ref="reFormRef" :rules="rules" label-width="auto">
        <el-form-item label="账号" prop="employeeName">
          <el-input v-model="rePwForm.employeeName" disabled></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pwd">
          <el-input v-model="rePwForm.pwd" placeholder="请输入新密码" show-password clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input v-model="rePwForm.confirmPwd" placeholder="再次输入新密码" show-password clearable></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="upDateCancel()">取消</el-button>
          <el-button type="primary" @click="upDateSubmit()">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// import { getToken } from "@/utils/auth";
import { useUserStoreWithOut } from "@/stores/modules/user";
import {
  getAllRole,
  getEmployee,
  findEmployeeRoles,
  addEmployeeRole,
  deletefirstRole,
  deleteEmployee,
  addEmployee,
  getOrganization,
  ResetPwd,
  createOpcenterEmp
} from "@/api/permiss";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import {
  ref,
  unref,
  nextTick,
  reactive,
  onBeforeMount,
  watch,
  onMounted,
  computed,
  onBeforeUnmount,
} from "vue";

interface Tag {
  RoleID: string;
  RoleName: string;
}

interface Optiotpe {
  value: string;
  lable: string;
}
interface Table {
  employeeId: string;
  employeeName: string;
  fullName: string;
  RoleName: string[];
}
interface EditForm {
  EmployeeId: string;
  EmployeeName: string;
  CanLogin: number;
  FullName: string;
  DocManagerUser: string;
  IsDelete: string;
  CreateBy: string;
  CreateDate: string;
  UpdateBy: string;
  UpdateDate: string;
}

interface OrganTree {
  Notes: string;
  OrganizationId: string;
  OrganizationName: string;
  OrganizationNumber: string;
  ParentOrganizationId: string;
  children: OrganTree[];
}

// 新增员工表单接口
interface AddEmployeeForm {
  EmployeeName: string;
  FullName: string;
  IsOnline: string;
  OrganizationID: string;
  email: string;
}

// 删除员工参数接口
interface DeleteEmployeeParams {
  EmployeeName: string;
  IsOnline: string;
}

const userStore = useUserStoreWithOut();
const tableData = ref<Table[]>([]);
const pageSize = ref(50);
const currentPage = ref(1);
const tableHeight = ref(0);
const addVisible = ref(false);
const editVisible = ref(false);
const addEmployeeVisible = ref(false); // 新增员工对话框
const addEmployeeFormRef = ref();
const addEmployeeForm = ref<AddEmployeeForm>({
  EmployeeName: "",
  FullName: "",
  IsOnline: "Y",
  OrganizationID: "",
  email: "",
});

// 新增员工表单验证规则
const addEmployeeRules = {
  EmployeeName: [{ required: true, message: "请输入账号(工号)", trigger: "blur" }],
  FullName: [{ required: true, message: "请输入员工姓名", trigger: "blur" }],
  OrganizationID: [{ required: true, message: "请选择组织", trigger: "change" }],
  IsOnline: [{ required: true, message: "请选择是否在职", trigger: "change" }],
};

const formRef = ref();
const form = ref({
  employeeName: "",
  id: 0,
  roleId: "",
  roleIdArr: [],
  IsDelete: "",
  CreateBy: userStore.getUserInfo,
  CreateDate: "",
  UpdateBy: "",
  UpdateDate: "",
});
const hasRole = ref<Tag[]>([]);
const roleName = ref("");
const optionArr = ref<Optiotpe[]>([]);
const editForm = reactive<EditForm>({
  EmployeeId: "",
  EmployeeName: "",
  CanLogin: 1,
  FullName: "",
  DocManagerUser: "",
  IsDelete: "",
  CreateBy: "",
  CreateDate: "",
  UpdateBy: userStore.getUserInfo || "",
  UpdateDate: "",
});
const editRef = ref();
const searchName = ref("");
const tableData1 = ref<Table[]>([]);
const organTree = ref<OrganTree[]>([]);
const isLoding = ref("");
const restVisible = ref(false);
const reFormRef = ref();
const rePwForm = ref({
  employeeName: "",
  pwd: "",
  confirmPwd: "",
});
const equalToPassword = (rule: any, value: any, callback: any) => {
  if (rePwForm.value.pwd !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};
const rules = reactive<any>({
  pwd: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPwd: [
    { required: true, trigger: "blur", message: "请再次输入您的密码" },
    { required: true, validator: equalToPassword, trigger: "blur" },
  ],
});
onBeforeMount(() => {
  getScreenHeight();
});
onMounted(() => {
  window.addEventListener("resize", getScreenHeight);
  getData();
  getOrgan();
  getRoleMeun();
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", getScreenHeight);
});

watch(
  () => searchName.value,
  (newdata) => {
    if (newdata == "") {
      tableData1.value = tableData.value;
    } else {
      tableData1.value = table1(newdata);
    }
  }
);
const table1 = (newdata: any) => {
  let searchName = newdata.toLowerCase();
  return tableData.value.filter((v: any) => {
    return Object.keys(v).some((key) => {
      return String(v[key]).toLowerCase().indexOf(searchName) > -1;
    });
  });
};

const noRole = computed(() => {
  const data = optionArr.value.filter(
    (item: any) => !hasRole.value.some((ele) => ele.RoleID == item.value)
  );
  return data;
});

const getData = () => {
  getEmployee().then((data: any) => {
    dataPrecc(data.content);
  });
};

const getOrgan = () => {
  getOrganization().then((data: any) => {
    if (data.code == 100200) {
      organTree.value = OrganData(data.content);
    }
  });
};

const OrganData = (organizations: any) => {
  const organizationMap = new Map();
  organizations.forEach((org: any) => {
    organizationMap.set(org.OrganizationId, { ...org, children: [] });
  });
  organizations.forEach((org: any) => {
    if (org.ParentOrganizationId !== null) {
      const parentOrg = organizationMap.get(org.ParentOrganizationId);
      if (parentOrg) {
        parentOrg.children.push(organizationMap.get(org.OrganizationId));
      }
    }
  });
  return Array.from(organizationMap.values()).filter(
    (org) => org.ParentOrganizationId === null
  );
};

const handleNodeClick = (data: any) => {
  tableData1.value = table1(data.OrganizationId);
};
const refreshData = () => {
  isLoding.value = "is-loading";
  currentPage.value = 1;
  searchName.value = "";
  getData();
  let timer = setTimeout(() => {
    isLoding.value = "";
    clearTimeout(timer);
  }, 2000);
};

const getRoleMeun = () => {
  getAllRole().then((data: any) => {
    optionArr.value = data.content.map((item: any) => {
      return {
        value: item.ID, // 修复：item.id → item.ID（大写）
        lable: item.RoleName,
      };
    });
  });
};

// ==================== 新增员工功能 ====================
const openAddEmployee = () => {
  // 重置表单
  addEmployeeForm.value = {
    EmployeeName: "",
    FullName: "",
    IsOnline: "Y",
    OrganizationID: "",
    email: "",
  };
  addEmployeeVisible.value = true;
};

const addEmployeeCancel = () => {
  addEmployeeVisible.value = false;
  addEmployeeFormRef.value?.resetFields();
};

const addEmployeeSubmit = () => {
  addEmployeeFormRef.value.validate((valid: any) => {
    if (valid) {
      // 调用 createOpcenterEmp 接口新增员工
      createOpcenterEmp(addEmployeeForm.value).then((res: any) => {
        if (res.code == 100200 || res.success) {
          ElNotification({
            title: "提示",
            message: "新增员工成功",
            type: "success",
          });
          addEmployeeVisible.value = false;
          getData(); // 刷新列表
        } else {
          ElNotification({
            title: "提示",
            message: res.msg || "新增员工失败",
            type: "error",
          });
        }
      }).catch((err: any) => {
        ElNotification({
          title: "提示",
          message: "新增员工失败",
          type: "error",
        });
      });
    } else {
      return false;
    }
  });
};

// ==================== 删除员工功能 ====================
const handleDeleteEmployee = (row: any) => {
  ElMessageBox.confirm(`确定要删除员工"${row.fullName}"吗？`, "确认删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      const deleteParams: DeleteEmployeeParams = {
        EmployeeName: row.employeeName,
        IsOnline: "N",
      };
      createOpcenterEmp(deleteParams).then((res: any) => {
        if (res.code == 100200 || res.success) {
          ElNotification({
            title: "提示",
            message: "删除成功",
            type: "success",
          });
          getData(); // 刷新列表
        } else {
          ElNotification({
            title: "提示",
            message: res.msg || "删除失败",
            type: "error",
          });
        }
      }).catch((err: any) => {
        ElNotification({
          title: "提示",
          message: "删除失败",
          type: "error",
        });
      });
    })
    .catch(() => {
      ElNotification({
        title: "提示",
        message: "取消操作",
        type: "info",
      });
    });
};

const editCancel = () => {
  editVisible.value = false;
  editRef.value.resetFields();
};
const editSubmit = () => {
  addEmployee(editForm).then((data: any) => {
    if (data.code == 100200) {
      getData();
      editVisible.value = false;
      ElNotification({
        title: "提示",
        message: "添加成功",
        type: "success",
      });
    }
  });
};

const getHasRole = () => {
  findEmployeeRoles(form.value.employeeName).then((data: any) => {
    if (data.code == 100200) {
      if (data.content == null) {
        hasRole.value = [];
        return;
      }
      hasRole.value = data.content;
    } else {
      ElNotification({
        title: "提示",
        message: data.msg,
        type: "error",
      });
    }
  });
};
const openAdd = () => {
  editVisible.value = true;
};
const dataPrecc = (data: any) => {
  let beforeData = data;
  let tempArr = [];
  let afterData = [];
  for (let i = 0; i < beforeData.length; i++) {
    if (tempArr.indexOf(beforeData[i].EmployeeId) === -1) {
      afterData.push({
        employeeId: beforeData[i].EmployeeId,
        employeeName: beforeData[i].EmployeeName,
        fullName: beforeData[i].FullName,
        title: beforeData[i].title,
        OrganizationName: beforeData[i].OrganizationName,
        OrganizationID: beforeData[i].OrganizationID,
        RoleName:
          beforeData[i].RoleName == null ? [] : [beforeData[i].RoleName],
      });
      tempArr.push(beforeData[i].EmployeeId);
    } else {
      for (let j = 0; j < afterData.length; j++) {
        if (
          afterData[j].employeeId == beforeData[i].EmployeeId &&
          beforeData[i].RoleName !== null
        ) {
          afterData[j].RoleName.push(beforeData[i].RoleName);
          break;
        }
      }
    }
  }
  afterData.sort((a, b) => {
    return a.employeeName - b.employeeName;
  });
  tableData.value = afterData;
  tableData1.value = tableData.value;
};

const handleEdit = (row: any) => {
  roleName.value = row.fullName;
  form.value.employeeName = row.employeeName;
  findEmployeeRoles(row.employeeName).then((data: any) => {
    if (data.content == null || data.content == undefined) {
      hasRole.value = [];
    } else {
      hasRole.value = data.content;
    }
    addVisible.value = true;
  });
};
const addCancel = () => {
  addVisible.value = false;
};
const onSubmit = () => {
  form.value.roleId = form.value.roleIdArr.join(",")
  if (
    form.value.roleId == "" ||
    form.value.roleId == undefined ||
    form.value.roleId == null
  ) {
    addVisible.value = false;
    formRef.value.resetFields();
  } else {
    addEmployeeRole(form.value).then((res: any) => {
      if (res.success) {
        ElNotification({
          title: "提示",
          message: res.msg,
          type: "success",
        });
      }
      addVisible.value = false;
      formRef.value.resetFields();
    });
  }
};

const handleClose = (tag: any) => {
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deletefirstRole({
        EmpId: form.value.employeeName,
        RoleId: tag.RoleID,
      }).then((data: any) => {
        if ((data.code = 100200)) {
          getHasRole();
          ElNotification({
            title: "提示",
            message: "删除成功",
            type: "success",
          });
        } else {
          ElNotification({
            title: "提示",
            message: "删除失败",
            type: "error",
          });
        }
      });
    })
    .catch(() => {
      ElNotification({
        title: "提示",
        message: "取消操作",
        type: "info",
      });
    });
};

const handleRest = (row: any) => {
  rePwForm.value.employeeName = row.employeeName;
  restVisible.value = true;
};
const upDateCancel = () => {
  restVisible.value = false;
  reFormRef.value.resetFields();
};
const upDateSubmit = () => {
  reFormRef.value.validate((valid: any) => {
    if (valid) {
      let data = {
        employeeName: rePwForm.value.employeeName,
        pwd: rePwForm.value.pwd,
      };
      ResetPwd(data).then((res: any) => {
        if (res.code == 100200) {
          ElNotification({
            title: "重置成功",
            type: "success",
          });
        } else {
          ElNotification({
            title: "重置失败",
            message: res.msg,
            type: "error",
          });
        }
        restVisible.value = false;
      });
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};
const handleDelete = (row: any) => {
  ElMessageBox.confirm("确定删除", "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteEmployee(row.employeeId).then((data: any) => {
        if (data.code == 100200) {
          getData();
          ElNotification({
            title: "删除成功",
            type: "success",
          });
        } else {
          ElNotification({
            title: "删除失败",
            type: "error",
          });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消操作",
      });
    });
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
    tableHeight.value = window.innerHeight - 196;
  });
};
const getMaxLength = (arr: any) => {
  return arr.reduce((acc: any, item: any) => {
    if (item) {
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
  html.style.cssText = `padding: 0; margin: 0; border: 0; line-height: 1; font-size: ${12}px; font-family: Arial, sans-serif;`;
  html.innerText = str;
  document.body?.appendChild(html);
  const spanElement = html;
  if (spanElement) {
    width = spanElement.offsetWidth;
    spanElement.remove();
  }
  return width;
};

const flexColumnWidth = (label: any, prop: any) => {
  const arr = tableData?.value.map((x: { [x: string]: any }) => x[prop]);
  arr.push(label);
  return getMaxLength(arr) + 25 + "px";
};
</script>
<style scoped>
.el-pagination {
  justify-content: center;
}

.el-tag+.el-tag {
  margin-left: 10px;
}

.el-card ::v-deep .el-card__header {
  padding: calc(20px - 5px) 20px;
}
</style>
