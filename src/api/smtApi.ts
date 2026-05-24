import request from "@/request/smtMessage";
import requestNoMessage from "@/request/smtNoMessage";

//镭雕
export function getLaserWorkOrder(data: any) {
  return request({
    url: "/api/LaserCarving/OrderQuery",
    method: "post",
    data,
  });
}

export function OrderSNQuery(data: any) {
  return requestNoMessage({
    url: "api/LaserCarving/OrderSNQuery",
    method: "post",
    data,
  });
}

//报错不主动提示
export function getMaterialInformation(data: any) {
  return requestNoMessage({
    url: "/api/LaserCarving/CreateSNOrderNumber",
    method: "post",
    data,
  });
}

//返修
export function QuerySN(SN: any, OperationType: any) {
  return request({
    url: "/api/Maintenance/QuerySN",
    method: "post",
    params: { SN, OperationType },
  });
}
//
export function MaintenanceAdd(data: any) {
  return request({
    url: "/api/Maintenance/Add",
    method: "post",
    data,
  });
}
//
export function QueryMaintenance(InternalSN: any, Position: any) {
  return request({
    url: "/api/Maintenance/QueryMaintenance",
    method: "post",
    params: { InternalSN, Position },
  });
}
//查询周转箱列表
export function QueryCarrierList(data: any) {
  return request({
    url: "/api/packing/QueryCarrierList",
    method: "post",
    params: data,
  });
}
//获取装箱信息
export function QueryPackListByCarrier(data: any) {
  return requestNoMessage({
    url: "/api/packing/QueryPackingListByCarrierName",
    method: "post",
    params: data,
  });
}
//扫描装箱
export function SubmitPcbToPacking(data: any) {
  return requestNoMessage({
    url: "/api/packing/SubmitPcbToPacking",
    method: "post",
    data,
  });
}
//不满箱提交
export function TrunkDeal(data: any) {
  return request({
    url: "/api/packing/TrunkDeal",
    method: "post",
    data,
  });
}
//查询烧录打印数据
export function QueryBurnPrintData(data: any) {
  return request({
    url: "/api/Burn/QueryBurnPrintData",
    method: "post",
    data,
  });
}

//烧录标签打印
export function PrintBurnModel(data: any) {
  return request({
    url: "/api/Burn/PrintBurnLabel",
    method: "post",
    data,
  });
}
//烧录生产计划号
// export function OrderQuery() {
//     return request({
//         url: "/api/Burn/OrderQuery",
//         method: "post",
//         data:{
//             orderID:''
//         }
//     })
// }



//物料上料
export function LoadMaterialQueue(data: any) {
  return requestNoMessage({
    url: "/api/workstation/LoadMaterialQueue",
    method: "post",
    data,
  });
}
//物料下料
export function UnLoadMaterialQueue(data: any) {
  return request({
    url: "/api/workstation/UnLoadMaterialQueue",
    method: "post",
    data,
  });
}
//物料需求
export function QueryOrderMaterialRequired(data: any) {
  return requestNoMessage({
    url: "/api/workstation/QueryOrderMaterialRequired",
    method: "post",
    data,
  });
}
//物料明细
export function QueryMaterialQueueDetails(data: any) {
  return requestNoMessage({
    url: "/api/workstation/QueryMaterialQueueDetails",
    method: "post",
    data,
  });
}
//不良品登记
export function isDefects(data: any) {
  return request({
    url: "/api/workstation/isDefects",
    method: "post",
    data,
  });
}
//生产计划号查询
export function OrderQuery(data: any) {
  return request({
    url: "/api/workstation/OrderQuery",
    method: "post",
    data,
  });
}
//返修登记
export function QuerySMTDefectRecordDetail(data: any) {
  return request({
    url: "/api/repair/QuerySMTDefectRecordDetail",
    method: "post",
    params: {
      ContainerName: data,
    },
  });
}
//返修工序
export function QueryWorkflowList(data: any) {
  return request({
    url: "/api/repair/QueryWorkflowList",
    method: "post",
    params: {
      workflowName: data,
    },
  });
}
//提交返修登记
export function SaveRepairRecord(data: any) {
  return request({
    url: "/api/repair/SaveRepairRecord",
    method: "post",
    data,
  });
}
//查询返修修操作
export function QueryRepairAction(data: any) {
  return request({
    url: "/api/repair/QueryRepairAction",
    method: "post",
    params: {
      operationName: data,
    },
  });
}
//根据工序查询不良记录
export function QueryRepairRecord(data: any) {
  return request({
    url: "/api/repair/QueryRepairRecord",
    method: "post",
    params: {
      workStaion: data,
    },
  });
}
//获取SMT生产计划号数据
// export function GetSMTPreparationOrderList(data:any) {
//     return request({
//         url: "/api/smtpreparation/GetSMTPreparationOrderList",
//         method: "post",
//        data
//     })
// }
//获取SMT备料产线
export function GetSMTLineList() {
  return request({
    url: "/api/smtreadymaterial/GetSMTLineList",
    method: "post",
  });
}
//获取SMT生产计划号数据
export function GetSMTPreparationOrderList(data: any) {
  return request({
    url: "/api/smtreadymaterial/GetSMTPreparationOrderList",
    method: "post",
    data,
  });
}
//获取SMT生产计划号BoM数据
export function GetOrderSMTBom(data: any) {
  return request({
    url: "/api/smtreadymaterial/GetOrderSMTBom",
    method: "post",
    data,
  });
}
//查询货架
export function findShelf() {
  return request({
    url: "/api/smtreadymaterial/findShelf",
    method: "post",
  });
}
//提交备料
export function SubmitSMTPreparation(data: any) {
  return requestNoMessage({
    url: "/api/smtreadymaterial/SubmitSMTPreparation",
    method: "post",
    data,
  });
}
//首套亮灯
export function SendFirstSet(data: any) {
  return requestNoMessage({
    url: "/api/smtreadymaterial/SendFirstSet",
    method: "post",
    data,
  });
}

//取消首套亮灯
export function CancelFirstSet(data: any) {
  return requestNoMessage({
    url: "/api/smtreadymaterial/CancelFirstSet",
    method: "post",
    data,
  });
}

//贴片机亮灯
//根据工序查询不良记录
export function QueryDeviceInfo(data: any) {
  return requestNoMessage({
    url: "/api/smtOnlineRack/QueryDeviceInfo",
    method: "post",
    params: {
      LineName: data
    }
  })
}

//查询机台物料清单
export function QueryMachineMaterialList(data: any) {
  return requestNoMessage({
    url: "/api/smtOnlineRack/QueryMachineMaterialList",
    method: "post",
    params: {
      mcid: data
    }
  })
}

//查询机台物料清单
export function MaterialOrderQuery(data: any) {
  return requestNoMessage({
    url: "/api/smtOnlineRack/OrderQuery",
    method: "post",
    data
  })
}

//接料亮灯
export function SendOneLine(data: any) {
  return requestNoMessage({
    url: "/api/smtOnlineRack/SendOneLine",
    method: "post",
    data
  })
}

//取消接料亮灯
export function CancelOneLine(data: any) {
  return requestNoMessage({
    url: "/api/smtOnlineRack/CancelOneLine",
    method: "post",
    data
  })
}

//修改产线是否自动接料
export function UpdateMfgLineAutoSplicing(data: any) {
  return requestNoMessage({
    url: "/api/smtOnlineRack/UpdateMfgLineAutoSplicing",
    method: "post",
    data
  })
}

//自动接料亮灯
export function AutoOnlineRack(data: any) {
  return request({
    url: "/api/smtOnlineRack/AutoOnlineRack",
    method: "post",
    data
  })
}

//MES架料物料清单
export function QueryRackLightMaterials(data: any) {
  return requestNoMessage({
    url: "/api/smtOnlineRack/QueryRackLightMaterials",
    method: "post",
    data
  })
}

//烧录转批次
export function MESSaveBurnResult(data: any) {
  return requestNoMessage({
    url: "/api/Burn/MESSaveBurnResult",
    method: "post",
    params:data
  })
}
