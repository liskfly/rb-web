import request from "@/request/request";
import request1 from "@/request/isNo";
//登录
export function empolyeeLogin(data: any) {
    return request({
        url: "/api/employee/login",
        method: "post",
        data,
    });
}
//获取用户信息
export function getEmpoyeeInfo(data: any) {
    return request({
        url: "/api/employee/findByEmployeeName",
        method: "post",
        params:{
            employeeName:data
        }
    });
}
export function getInfo() {
    return request({
        url: "/api/employee/findUserInfoBytoken",
        method: "post",
    });
}

export function getMenu() {
    return request1({
        url: "/api/employee/findMenuBytoken",
        method: "post",
    });
}

export function getMenuOPUI() {
    return request({
        url: "/api/employee/findMenuListByOPUI",
        method: "post",
    });
}

export function getWorksMenuOPUI() {
    return request({
        url: "/api/employee/findWorkstationListByOPUI",
        method: "post",
    });
}

//获取全部菜单
export function getFirstMeun() {
    return request({
        url: "/api/menu/findAll",
        method: "post",
    });
}
//获取角色的菜单
export function getRoleMenuse(data: any) {
    return request({
        url: "/api/role/getRoleMenus",
        method: "post",
        params: {
            roleid: data,
        },
    });
}



//添加菜单
export function addMeun(data: any) {
    return request({
        url: "/api/menu/add",
        method: "post",
        data,
    });
}

//删除菜单
export function deleteMeun(data: any) {
    return request({
        url: "/api/menu/delete",
        method: "post",
        params: {
            id: data,
        },
    });
}

//修改菜单
export function updateMeun(data: any) {
    return request({
        url: "/api/menu/update",
        method: "post",
        data,
    });
}

//获取所有角色
export function getAllRole() {
    return request({
        url: "/api/role/findAll",
        method: "post",
    });
}

//
export function addRole(data: any) {
    return request({
        url: "/api/role/add",
        method: "post",
        data,
    });
}

export function getMeunRole(data: any) {
    return request({
        url: "/api/role/getRoleMenus",
        method: "post",
        params: {
            roleid: data,
        },
    });
}

export function updateRoleMeun(data: any) {
    return request({
        url: "/api/role/update",
        method: "post",
        data
    });
}
export function deleteRole(data: any) {
    return request({
        url: "/api/role/delete",
        method: "post",
        params: {
            roleId: data,
        },
    });
}

export function getEmployee() {
    return request({
        url: "/api/employee/findAll",
        method: "post",

    });
}
//获取用户角色
export function findEmployeeRoles(data: any) {
    return request({
        url: "/api/employeerole/findEmployeeRoles",
        method: "post",
        params: {
            empid: data,
        },
    });
}
export function addEmployeeRole(data: any) {
    return request({
        url: "/api/employeerole/add",
        method: "post",
        data,
    });
}

export function deletefirstRole(data: any) {
    return request({
        url: "/api/employeerole/deleteRole",
        method: "post",
        params: data
    });
}

export function deleteEmployee(data: any) {
    return request({
        url: "/api/employeerole/delete",
        method: "post",
        params: {
            empid: data,
        }
    });
}

//用户注册
export function addEmployee(data: any) {
    return request({
        url: "/api/employeerole/add",
        method: "post",
        data,
    });
}
export function updatePassword(data: any) {
    return request({
        url: "/api/employee/UpdateEmpPwd",
        method: "post",
        params: data
    });
}
//重置密码
export function ResetPwd(data: any) {
    return request({
        url: "/api/employee/ResetPwd",
        method: "post",
        params: data
    });
}


export function getOrganization(){
    return request({
        url: "/api/employee/findOrganization",
        method: "post",
    });
}

//获取版本信息
export function GetVersion(){
    return request({
        url: "/api/system/GetVersion",
        method: "post",
    });
}

// Opcenter 人员管理（创建/删除）
export function createOpcenterEmp(data: any) {
    return request({
        url: "/api/employee/CreateOpcenterEmp",
        method: "post",
        data,
    });
}
