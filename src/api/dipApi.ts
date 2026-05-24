import request from "@/request/dipRequest";

//获取插件生产计划号信息
export function QueryWorkOrderInfo() {
  return request({
    url: "/api/plugin/QueryWorkOrderInfo",
    method: "post",
  });
}
// //生产计划号查询
export function OrderQuery(data: any) {
  return request({
    url: "/api/workstation/OrderQuery",
    method: "post",
    data,
  });
}
//历史过站记录
export function QueryMoveHistory(data: any) {
  return request({
    url: "/api/workstation/QueryMoveHistory",
    method: "post",
    data,
  });
}

//获取设备
export function FindAllDevice(data: any) {
  return request({
    url: "/api/plugin/FindAllDevice",
    method: "post",
    data,
  });
}

//修改设备
export function UpdateDevice(data: any) {
  return request({
    url: "/api/plugin/UpdateDevice",
    method: "post",
    data,
  });
}
//插件过站
export function PluginStationMoveOut(data: any) {
  return request({
    url: "/api/plugin/PluginStationMoveOut",
    method: "post",
    data,
  });
}

export function PCBASplitMoveStd(data: any) {
  return request({
    url: "/api/pcbasplit/PCBASplitMoveStd",
    method: "post",
    data,
  });
}
export function PIQueryMoveHistory(data: any) {
  return request({
    url: "/api/plugin/PIQueryMoveHistory",
    method: "post",
    data,
  });
}

//人工目检过站,点胶，
// export function MoveStd(data: any) {
//     return request({
//         url: "/api/workstation/MoveStd",
//         method: "post",
//         data,
//     });
// }
//在线点胶过站
export function ODStationMoveOut(data: any) {
  return request({
    url: "/api/onlinedispensing/ODStationMoveOut",
    method: "post",
    data,
  });
}
//选择焊过站
export function CWgStationMoveOut(data: any) {
  return request({
    url: "/api/choosewelding/CWgStationMoveOut",
    method: "post",
    data,
  });
}
//目检过站
export function InspectionStationMoveOut(data: any) {
  return request({
    url: "/api/inspection/InspectionStationMoveOut",
    method: "post",
    data,
  });
}
//解绑
export function UnbindTools(data: any) {
  return request({
    url: "/api/plugin/UnbindTools",
    method: "post",
    params:{
      tool:data
    }
  });
}
//更换
export function AgainBindTools(data: any) {
  return request({
    url: "/api/plugin/AgainBindTools",
    method: "post",
   data
  });
}

//目检提交不良登记信息
export function DefectProductRecord(data: any) {
  return request({
    url: "/api/inspection/DefectProductRecord",
    method: "post",
    data,
  });
}
//目检通过PCB条码查询不良原因
export function QueryDefectCodeInspection(data: any) {
  return request({
    url: "/api/inspection/QueryDefectCode",
    method: "post",
 data
  });
}
//人工目检过站
export function VIStationMoveOut(data: any) {
  return request({
    url: "/api/visualinspection/VIStationMoveOut",
    method: "post",
    data,
  });
}
//人工目检提交不良登记信息
export function VIDefectProductRecord(data: any) {
  return request({
    url: "/api/visualinspection/VIDefectProductRecord",
    method: "post",
    data,
  });
}
//人工目检通过PCB条码查询不良原因
export function QueryDefectCode(data: any) {
  return request({
    url: "/api/visualinspection/QueryDefectCode",
    method: "post",
  data
  });
}
//获取上料明细
export function QueryOrderMaterialRequired(data: any) {
  return request({
    url: "/api/workstation/QueryOrderMaterialRequired",
    method: "post",
    data,
  });
}

//选择焊
export function CWStationMoveOut(data: any) {
  return request({
    url: "/api/choosewelding/CWStationMoveOut",
    method: "post",
    data,
  });
}
//返修登记
export function QuerySMTDefectRecordDetail(data: any) {
  return request({
    url: "/api/repair/QuerySMTDefectRecordDetail",
    method: "post",
    params:{
        ContainerName:data
    }
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

export function QuerySpecBystation(data: any) {
  return request({
    url: `/api/workstation/QuerySpecBystation`,
    method: "post",
    params: {
      workStation: data,
    },
  });
}
export function RepairRecordStart(data: any) {
  return request({
    url: "/api/repair/RepairRecordStart",
    method: "post",
    data,
  });
}