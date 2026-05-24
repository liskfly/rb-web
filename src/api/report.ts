import request from "@/request/reportRequest";
//原材料
export function QueryMaterialCode(data: any) {
    return request({
        url: "/api/RawMaterialsTracedbackQuery/QueryMaterialCode",
        method: "post",
        data,
    });
}
//原材料
export function QueryContainerDetail(data: any) {
    return request({
        url: "/api/RawMaterialsTracedbackQuery/QueryContainerDetail",
        method: "post",
        data,
    });
}
//MES条码追溯
export function QueryMESContainerTracedBack(data: any) {
    return request({
      url: "/api/RawMaterialsTracedbackQuery/QueryMESContainerTracedBack",
      method: "post",
      data
    });
  }

//过序追溯
export function InsequenceRetraceFirstInfo(data: any) {
    return request({
      url: "/api/RawMaterialsTracedbackQuery/InsequenceRetraceFirstInfo",
      method: "post",
      data
    });
  }
  //过序追溯
  export function InsequenceRetraceTwoInfo(data: any) {
    return request({
      url: "/api/RawMaterialsTracedbackQuery/InsequenceRetraceTwoInfo",
      method: "post",
      data
    });
  }

//获取线体
export function QuertAllMfgLineInfo() {
  return request({
    url: "/api/RawMaterialsTracedbackQuery/QuertAllMfgLineInfo",
    method: "post",
    
  });
}
//获取工序
export function QuertAllSpecNameInfo() {
  return request({
    url: "/api/RawMaterialsTracedbackQuery/QuertAllSpecNameInfo",
    method: "post",
  });
}

//查询工单类型
export function QueryOrderType() {
  return request({
    url: "/api/PlantProgressQuery/QueryOrderType",
    method: "post"
  });
}

//工单进度查询主数据
export function PlanProgressQuery(data:any) {
  return request({
    url: "/api/PlantProgressQuery/PlanProgressQuery",
    method: "post",
    data
  });
}

//查询计划号条码数据
export function QueryOrderContainer(data: any) {
  return request({
    url: "/api/PlantProgressQuery/QueryOrderContainer",
    method: "post",
    data
  });
}

//查询计划号条码数据
export function QueryMESContainer(data: any) {
  return request({
    url: "/api/QueryMESContainer/QueryMESContainer",
    method: "post",
    params:{
      containername:data
    }
  });
}

//条码清单
export function QueryMESBarCode(data: any) {
  return request({
    url: "/api/QueryMESContainer/QueryMESBarCode",
    method: "post",
    params:{
      containername:data
    }
  });
}

//XLX文件读取
export function ParseXlsxFile(data: any) {
  return request({
    url: "/api/QueryMESContainer/ParseXlsxFile",
    method: "post",
    data
  });
}

//查询自动测试数据
export function getAutoTestData(data: any) {
  return request({
    url: "/api/AutoTestDataQuery/getAutoTestData",
    method: "post",
    data
  });
}

//查询自动测试详情数据
export function GetAutoTestDetailsData(data: any) {
  return request({
    url: "/api/AutoTestDataQuery/GetAutoTestDetailsData",
    method: "post",
    params:{
      headId:data
    }
  });
}

//成品送检历史记录
export function ProductInspectDetailsHistory(data: any) {
  return request({
    url: "/api/ProductInspectDetailsHistoryQuery/ProductInspectDetailsHistory",
    method: "post",
    data
  });
}

//成品送检历史记录
export function getBurningData(data: any) {
  return request({
    url: "/api/BurningDataQuery/getBurningData",
    method: "post",
    data
  });
}

//成品送检历史记录
export function GetBurnProgDataSiteInfo(data: any) {
  return request({
    url: "/api/BurningDataQuery/GetBurnProgDataSiteInfo",
    method: "post",
    data
  });
}

//成品送检历史记录
export function GetBurnProgDataSlotInfo(data: any) {
  return request({
    url: "/api/BurningDataQuery/GetBurnProgDataSlotInfo",
    method: "post",
    data
  });
}

//成品送检历史记录
export function OrderSNQuery(data: any) {
  return request({
    url: "/api/LaserDataQuery/OrderSNQuery",
    method: "post",
    data
  });
}

