import request from "@/request/opRequest";
import request1 from "@/request/plainTextApi";
export function InsertInspect(data: any) {
    return request({
        url: "/api/firstinspect/Insert_Inspect_Info",
        method: "post",
        data,
    });
}

export function GetInspectData(data: any) {
    return request({
        url: "/api/firstinspect/Query_Inspect_Info",
        method: "post",
        data,
    });
}
///api/firstinspect/Update_Inspect_Info
export function UpdateInspectData(data: any) {
    return request({
        url: "/api/firstinspect/Update_Inspect_Info",
        method: "post",
        data,
    });
}

export function DeleteInspectData(data: any) {
    return request({
        url: "/api/firstinspect/Delete_Inspect_Info",
        method: "post",
        data,
    });
}

export function getCheckResults(data: any) {
    return request({
        url: "/api/firstinspect/Quert_Inspect_History_Info",
        method: "post",
        data,
    });
}

//设备台账  获取设备类型
export function GetEquipmentTypeList() {
    return request({
        url: "/api/resource/GetEquipmentTypeList",
        method: "post",
    });
}
//获取设备台账  
export function GetEquipmentList(data: any) {
    return request({
        url: "/api/resource/GetEquipmentList",
        method: "post",
        data
    });
}
//台账获取 车间 产线
export function GetFactoryModelList() {
    return request({
        url: "/api/system/GetFactoryModelList",
        method: "post",
    });
}
//获取Combox的list


//获取物料树
export function findAllMaterialTree() {
    return request({
        url: "/api/product/findProductFamily",
        method: "post",
    })
}
//获取物料详细
export function findProductMaterial(data: any) {
    return request({
        url: "/api/product/findProduct",
        method: "post",
        data
    })
}
//修改物料属性
export function UpdateProductProperty(data: any) {
    return request({
        url: "/api/product/UpdateProductProperty",
        method: "post",
        data
    })
}
//获取物料MSD等级
export function GetMSDLevel() {
    return request({
        url: "/api/product/GetMSDLevel",
        method: "post",
    })
}
//修改物料MSD属性
export function UpdateMSDMaterialAttribute(data: any) {
    return request({
        url: "/api/product/UpdateMSDMaterialAttribute",
        method: "post",
        data
    })
}

//根据ERPBOMId查询产品BOM物料清单
export function findERPBOMMaterialList(query: any) {
    return request1({
        url: "/api/product/findERPBOMMaterialList",
        method: "post",
        data: query
    })
}
//查询产品BOM
export function findERPBOM(data: any) {
    return request({
        url: "/api/product/findERPBOM",
        method: "post",
        data
    })
}

//根据治具类型操作
export function ToolsType(data: any) {
    return request({
        url: "/api/Tools/ToolsType",
        method: "post",
        data
    })
}
//单个治具录入删除修改数据
export function ToolsDetail(data: any) {
    return request({
        url: "/api/Tools/ToolsDetail",

        method: "post",
        data
    })
}

//根据产品的治具用量操作
export function ToolsSpec(data: any) {
    return request({
        url: "/api/Tools/ToolsSpec",
        method: "post",
        data
    })
}

//治具上架下架
export function ToolsMove(data: any) {
    return request({
        url: "/api/Tools/ToolsMove",
        method: "post",
        data
    })
}

//查询产品物料信息
export function findPdMaterial() {
    return request({
        url: "/api/Tools/findProduct",
        method: "post"
    })
}

//根据产品查询产品工序
export function findProductSpec(data: any) {
    return request({
        url: "/api/Tools/findProductSpec",
        method: "post",
        params: {
            productName: data
        }
    })
}
//查询产品BOM
export function findProductBOM(data: any) {
    return request({
        url: "/api/product/findProductBOM",
        method: "post",
        data: {
            ProductName: data
        }
    })
}
//查询生产计划号状态
export function findOrderStatus() {
    return request({
        url: "/api/order/findOrderStatus",
        method: "post"
    })
}

//查询生产计划号信息
export function findOrder(data: any) {
    return request({
        url: "/api/order/OrderQuery",
        method: "post",
        data
    })
}
//修改生产计划号状态
export function UpdateOrderStatus(data: any) {
    return request({
        url: "/api/order/UpdateOrderStatus",
        method: "post",
        data
    })
}

//查询生产计划号明细
export function QueryOrderMaterialRequired(data: any) {
    return request({
        url: "/api/order/QueryOrderMaterialRequired",
        method: "post",
        data
    })
}

//查询生产计划号明细
export function QueryOrderToolsData(data: any) {
    return request({
        url: "/api/order/QueryOrderToolsData",
        method: "post",
        params: {
            orderNumber: data
        }
    })
}
//查询工治具
export function QueryToolInfo(data: any) {
    return request({
        url: "/api/Tools/QueryToolInfo",
        method: "post",
        data,
    });
}
//解除
export function ReleaseToolTask(data: any) {
    return request({
        url: "/api/order/ReleaseToolTask",
        method: "post",
        params:data
    });
}
export function QueryTools(data: any) {
    return request({
        url: "/api/Tools/QueryTools",
        method: "post",
        data,
    });
}
//工治具上移
export function SortTools(data: any) {
    return request({
        url: "/api/Tools/SortTools",
        method: "post",
        data,
    });
}
//获取工治具型号维护类型
export function GetComboBoxList(data: any) {
    return request({
        url: "/api/system/GetComboBoxList",
        method: "post",
        params: {
            UserConstantName: data
        }
    });
}

//查询生产计划号任务详情
export function findTaskToolsDetail(data: any) {
    return request({
        url: "/api/Tools/findTaskToolsDetail",
        method: "post",
        data,
    });
}

//工单物料申请
export function SubmitMaterialRequest(data: any) {
    return request({
        url: "/api/order/SubmitMaterialRequest",
        method: "post",
        data
    });
}

//查询物料申请历史记录
export function QueryMaterialRequest(data: any) {
    return request({
        url: "/api/order/QueryMaterialRequest",
        method: "post",
        data
    });
}

//查询物料申请历史记录明细
export function QueryMaterialRequestDetail(data: any) {
    return request({
        url: "/api/order/QueryMaterialRequestDetail",
        method: "post",
        params: {
            historyId: data
        }
    });
}
//查询亮灯货架
export function findShelf() {
    return request({
        url: "/api/order/findShelf",
        method: "post",
    });
}
//查询上线产线
export function QueryOrderLine(data: any) {
    return request({
        url: "/api/order/QueryOrderLine",
        method: "post",
        params: {
            orderType: data
        }
    });
}
//生产计划号上线
export function OrderOnline(data: any) {
    return request({
        url: "/api/order/OrderOnline",
        method: "post",
        data
    });
}
export function SMTOrderOnline(data: any) {
    return request({
        url: "/api/order/SMTOrderOnline",
        method: "post",
        data
    });
}
export function OrderOffline(data: any) {
    return request({
        url: "/api/order/OrderOffline",
        method: "post",
        data
    });
}
export function OrderWorkFlow(data: any) {
    return request({
        url: "/api/order/OrderWorkFlow",
        method: "post",
        data
    });
}
//ECN查询
export function GetECNorder(data: any) {
    return request({
        url: "/api/ECNOrder/GetECNorder",
        method: "post",
        data
    });
}
//ECN明细
export function GetECNOrderitem(data: any) {
    return request({
        url: "/api/ECNOrder/GetECNOrderItem",
        method: "post",
        params: {
            ECNOrderId: data
        }
    });
}
//不良代码
export function QueryDefectCode(data: any) {
    return request({
        url: "/api/Defect/QueryDefectCode",
        method: "post",
        data
    });
}
//不良明细
export function QueryDefectCodeDetail(data: any) {
    return request({
        url: "/api/Defect/QueryDefectCodeDetail",
        method: "post",
        params: {
            ContainerName: data
        }
    });
}
//查询工序
export function QuerySpec(data: any) {
    return request({
        url: "/api/Defect/QuerySpec",
        method: "post",
        params: {
            spec: data
        }
    });
}

//查询物料退料可申请生产计划号
export function QueryMaterialReturnApply(data: any) {
    return request({
        url: "/api/order/QueryMaterialReturnApply",
        method: "post",
        data
    });
}

//退料单查询
export function QueryMaterialReturn(data: any) {
    return request({
        url: "/api/order/QueryMaterialReturn",
        method: "post",
        data
    });
}

//退料单详情查询
export function QueryMaterialReturnDetail(data: any) {
    return request({
        url: "/api/order/QueryMaterialReturnDetail",
        method: "post",
        params: {
            historyId: data
        }
    });
}

//生产计划号良品退料
export function OrderGoodMaterials(data: any) {
    return request({
        url: "/api/order/OrderGoodMaterials",
        method: "post",
        data
    });
}

//查询物料退料可申请生产计划号
export function QueryMaterialReturnApplyDetail(data: any) {
    return request({
        url: "/api/order/QueryMaterialReturnApplyDetail",
        method: "post",
        data
    });
}
//查询生产计划转单物料清单
export function QueryChangeOrderMaterialRequired(data: any) {
    return request({
        url: "/api/order/QueryChangeOrderMaterialRequired",
        method: "post",
        data
    });
}
//生产计划物料转单申请
export function ApplyChangeOrderMaterialRequired(data: any) {
    return request({
        url: "/api/order/ApplyChangeOrderMaterialRequired",
        method: "post",
        data
    });
}
//量具
export function GetGaugeToolList(data: any) {
    return request({
        url: "/api/GaugeTool/GetGaugeToolList",
        method: "post",
        data
    });
}
export function addGaugeTool(data: any) {
    return request({
        url: "/api/GaugeTool/addGaugeTool",
        method: "post",
        data
    });
}
export function updateGaugeTool(data: any) {
    return request({
        url: "/api/GaugeTool/updateGaugeTool",
        method: "post",
        data
    });
}
//
export function GetCalibrationRecordList(data: any) {
    return request({
        url: "/api/CalibrationRecord/GetCalibrationRecordList",
        method: "post",
        data
    });
}
export function addCalibrationRecord(data: any) {
    return request({
        url: "/api/CalibrationRecord/addCalibrationRecord",
        method: "post",
        data
    });
}

//插件首检检查
//获取检查任务列表
export function GetInspectack(data: any) {
    return request({
        url: "/api/DIPFirstInspect/GetInspectack",
        method: "post",
        data
    })
}

//第一阶段检查
export function FirstStage(data: any) {
    return request({
        url: "/api/DIPFirstInspect/FirstStage",
        method: "post",
        data
    })
}

//第二阶段检查
export function SecondStage(data: any) {
    return request({
        url: "/api/DIPFirstInspect/SecondStage",
        method: "post",
        data
    })
}

//第三阶段检查
export function ThirdStage(data: any) {
    return request({
        url: "/api/DIPFirstInspect/ThirdStage",
        method: "post",
        data
    })

}

//第三阶段检查
export function InspecDetail(data: any) {
    return request({
        url: "/api/DIPFirstInspect/InspecDetail",
        method: "post",
        params: {
            taskno: data
        }
    })

}
//查询产品物料
export function findProduct(data: any) {
    return request({
        url: "/api/spec/findProduct",
        method: "post",
        data
    })

}
//
export function findProductSpecWork(data: any) {
    return request({
        url: "/api/spec/findProductSpec",
        method: "post",
        params: {
            productName: data
        }
    })

}
//查询工艺流程
export function findWorkFlow(data: any) {
    return request({
        url: "/api/spec/findWorkFlow",
        method: "post",
        data
    })
}
//修改物料工作流
export function UpdateProductWorkflow(data: any) {
    return request({
        url: "/api/spec/UpdateProductWorkflow",
        method: "post",
        data
    })
}
//根据产品查找工序
export function findProductBOMMaterialList(data: any) {
    return request({
        url: "/api/spec/findProductBOMMaterialList",
        method: "post",
        params: {
            productName: data
        }
    })

}

//查询工艺流程的工序
export function findWorkflowSpec(data: any) {
    return request({
        url: "/api/spec/findWorkflowSpec",
        method: "post",
        params: {
            WorkflowName: data
        }
    })

}

//修改工序
export function UpdateProductBOMMaterialList(data: any) {
    return request({
        url: "/api/spec/UpdateProductBOMMaterialList",
        method: "post",
        data
    })
}
//获取标签模板
export function GetBarCodeTemplate(data: any) {
    return request({
        url: "/api/BarCodeTemplate/GetBarCodeTemplate",
        method: "post",
        data
    })
}
//获取物料
export function GetBarCodeTemplatePartNumberContent(data: any) {
    return request({
        url: "/api/BarCodeTemplate/GetBarCodeTemplatePartNumberContent",
        method: "post",
        data
    })
}
//添加标签模板
export function InsertBarCodeTemplate(data: any) {
    return request({
        url: "/api/BarCodeTemplate/InsertBarCodeTemplate",
        method: "post",
        data
    })
}
//修改标签模板
export function UpdateBarCodeTemplate(data: any) {
    return request({
        url: "/api/BarCodeTemplate/UpdateBarCodeTemplate",
        method: "post",
        data
    })
}
//删除标签模板
export function DeleteBarCodeTemplate(data: any) {
    return request({
        url: "/api/BarCodeTemplate/DeleteBarCodeTemplate",
        method: "post",
        data
    })
}
//新增模板物料
export function InsertBarCodeRuleTempPartNumContent(data: any) {
    return request({
        url: "/api/BarCodeTemplate/InsertBarCodeRuleTempPartNumContent",
        method: "post",
        data
    })
}
//删除模板物料
export function DeleteBarCodeRuleTempPartNumContent(data: any) {
    return request({
        url: "/api/BarCodeTemplate/DeleteBarCodeRuleTempPartNumContent",
        method: "post",
        data
    })
}
//获取MES的物料信
export function QueryBarCodeRuleTemplatePartNum(data: any) {
    return request({
        url: "/api/BarCodeTemplate/QueryBarCodeRuleTemplatePartNum",
        method: "post",
        data
    })
}

//获取MES的物料信
export function QueryMESProductNameNews(data: any) {
    return request({
        url: "/api/BarCodeTemplate/QueryMESProductNameNews",
        method: "post",
        data
    })
}

//获取物料模板内容明细
export function QueryBarCodeRule_TemContentRule(data: any) {
    return request({
        url: "/api/BarCodeTemplate/QueryBarCodeRule_TemContentRule",
        method: "post",
        data
    })
}
//获取有模板的物料信息
export function QueryTeplateExistProductNameNews(data: any) {
    return request({
        url: "/api/BarCodeTemplate/QueryTeplateExistProductNameNews",
        method: "post",
        data
    })
}
//新增物料模板内容明细
export function InsertBarCodeRule_TemContentRules(data: any) {
    return request({
        url: "/api/BarCodeTemplate/InsertBarCodeRule_TemContentRule",
        method: "post",
        data
    })
}
//修改物料模板内容明细
export function UpdateBarCodeRule_TemContentRule(data: any) {
    return request({
        url: "/api/BarCodeTemplate/UpdateBarCodeRule_TemContentRule",
        method: "post",
        data
    })
}
//删除物料模板内容明细
export function DeleteCodeRuleTemplatePartNum(data: any) {
    return request({
        url: "/api/BarCodeTemplate/DeleteCodeRuleTemplatePartNum",
        method: "post",
        data
    })
}
//获取该物料绑定的模板
export function QueryProductNameTemplateName(data: any) {
    return request({
        url: "/api/BarCodeTemplate/QueryProductNameTemplateName",
        method: "post",
        data
    })
}
//获取模板内容参数
export function QueryBarCodeRuleTemplatePara(data: any) {
    return request({
        url: "/api/BarCodeTemplate/QueryBarCodeRuleTemplatePara",
        method: "post",
        data
    })
}
//添加模板内容参数
export function InsertBarCodeRuleTemplatePara(data: any) {
    return request({
        url: "/api/BarCodeTemplate/InsertBarCodeRuleTemplatePara",
        method: "post",
        data
    })
}
//删除模板内容参数
export function DeleteBarCodeRuleTemplatePara(data: any) {
    return request({
        url: "/api/BarCodeTemplate/DeleteBarCodeRuleTemplatePara",
        method: "post",
        data
    })
}
//获取取值规则
export function QueryBarCodeRuleExpressionType() {
    return request({
        url: "/api/BarCodeTemplate/QueryBarCodeRuleExpressionType",
        method: "post",
       
    })
}

//对应的规则
export function GetTempLabeReportParameter(data: any) {
    return request({
        url: "/api/BarCodeTemplate/GetTempLabeReportParameter",
        method: "post",
        data
    })
}

//补打记录
export function QueryReprintRecord(data: any) {
    return request({
        url: "/api/Reprint/QueryReprintRecord",
        method: "post",
        data
    })
}

//补打
export function Reprint(data: any) {
    return request({
        url: "/api/Reprint/Reprint",
        method: "post",
        data
    })
}
export function QuerySendMaterialCode(data: any) {
    return request({
        url: "/api/Material/QuerySendMaterialCode",
        method: "post",
        data
    })
}
export function PrintSendMaterialCode(data: any) {
    return request({
        url: "/api/Material/PrintSendMaterialCode",
        method: "post",
        data
    })
}
export function JudgeTempParaContent(data: any) {
    return request({
        url: "/api/BarCodeTemplate/JudgeTempParaContent",
        method: "post",
        data
    })
}
//产线日历
export function GetMESWorkLineNews(data: any) {
    return request({
        url: "/api/WorkLineCalendar/GetMESWorkLineNews",
        method: "post",
        data
    })
}

//添加设备基础数据信息
export function CreateEquipment(data: any) {
    return request({
        url: "/api/resource/CreateEquipment",
        method: "post",
        data
    })
}

//根据条件查询设备类型
export function GetLedgerEquipmentTypeList() {
    return request({
        url: "/api/resource/GetEquipmentTypeList",
        method: "post"
    })
}

//根据条件查询设备
export function findMfgLine() {
    return request({
        url: "/api/resource/findMfgLine",
        method: "post"
    })
}
//日历查询日程
export function GetWorkLineCalendarAndPlan(data: any) {
    return request({
        url: "/api/WorkLineCalendar/GetWorkLineCalendarAndPlan",
        method: "post",
        data
    })
}
//添加主日程
export function AddUpdateHostCalendar(data: any) {
    return request({
        url: "/api/WorkLineCalendar/AddUpdateHostCalendar",
        method: "post",
        data
    })
}


export function AddCalendarPlan(data: any) {
    return request({
        url: "/api/WorkLineCalendar/AddCalendarPlan",
        method: "post",
        data
    })
}
export function GetCalendarLevelOne(data: any) {
    return request({
        url: "/api/WorkLineCalendar/GetWorkLineCalendarSelectTypeLevelOne",
        method: "post",
        data
    })
}
export function GetCalendarLevelTwo(data: any) {
    return request({
        url: "/api/WorkLineCalendar/GetWorkLineCalendarSelectTypeLevelTwo",
        method: "post",
        data
    })
}
export function DeleteCalendarPlan(data: any) {
    return request({
        url: "/api/WorkLineCalendar/DeleteCalendarPlan",
        method: "post",
        data
    })
}
export function SelectCalendarPlan(data: any) {
    return request({
        url: "/api/WorkLineCalendar/SelectCalendarPlan",
        method: "post",
        data
    })
}

export function UpdateCalendarPlan(data: any) {
    return request({
        url: "/api/WorkLineCalendar/UpdateCalendarPlan",
        method: "post",
        data
    })
}

/** 可用打印机查询 */
export function PrinterQuery() {
    return request({
        url: "/api/mfgordercontainer/PrinterQuery",
        method: "post"
    })
}

/** 可创建条码工单查询 */
export function MfgOrderQuery(data: any) {
    return request({
        url: "/api/mfgordercontainer/MfgOrderQuery",
        method: "post",
        data
    })
}

/** 根据工单查明细 */
export function MfgOrderDetailQuery(data: any) {
    return request({
        url: "/api/mfgordercontainer/MfgOrderDetailQuery",
        method: "post",
        data
    })
}

/** 根据工单查找已生成条码列表 */
export function MfgOrderContainerListQuery(data: any) {
    return request({
        url: "/api/mfgordercontainer/MfgOrderContainerListQuery",
        method: "post",
        data
    })
}

/** 工单批次创建 */
export function MfgOrderContainerStart(data: any) {
    return request({
        url: "/api/mfgordercontainer/MfgOrderContainerStart",
        method: "post",
        data
    })
}

/** 工单批次重印 */
export function ReprintPrint(data: any) {
    return request({
        url: "/api/mfgordercontainer/ReprintPrint",
        method: "post",
        data
    })
}

/** 重印-查询所有工单编号 */
export function ReprintMfgOrderList() {
    return request({
        url: "/api/mfgordercontainer/ReprintMfgOrderList",
        method: "post",
    })
}

/** 重印-根据工单/批次查询条码信息 */
export function ReprintContainerList(data: { MfgOrderName?: string; ContainerName?: string }) {
    return request({
        url: "/api/mfgordercontainer/ReprintContainerList",
        method: "post",
        data
    })
}

/** 车间信息查询 */
export function WorkCenterQuery(data: any) {
    return request({
        url: "/api/ContainerOperation/WorkCenterQuery",
        method: "post",
        data
    })
}

/** 产线查询 */
export function MfgLineQuery(data: any) {
    return request({
        url: "/api/ContainerOperation/MfgLineQuery",
        method: "post",
        params: data
    })
}

/** 条码扫描查询 */
export function ContainerOperationQuery(data: any) {
    return request({
        url: "/api/ContainerOperation/ContainerOperationQuery",
        method: "post",
        data
    })
}

/** 条码执行 */
export function ContainerOperationExecution(data: any) {
    return request({
        url: "/api/ContainerOperation/ContainerOperationExecution",
        method: "post",
        data
    })
}

/** 物料批次扫码（SN精追） */
export function ComponentIssueSNQuery(data: any) {
    return request({
        url: "/api/ContainerOperation/ComponentIssueSNQuery",
        method: "post",
        data
    })
}

/** 容器数据采集项历史记录查询 */
export function ContainerDataPointHistoryQuery(data: any) {
    return request({
        url: "/api/ContainerOperation/ContainerDataPointHistoryQuery",
        method: "post",
        params: {
            ContainerName: data
        }
    })
}

/** 工单查询（容器操作） */
export function ContainersOperationMfgOrderQuery() {
    return request({
        url: "/api/ContainersOperation/MfgOrderQuery",
        method: "post"
    })
}


/** 完工入库主查询 */
export function QueryCompletionInboundList(data: any) {
    return request({
        url: "/api/CompletionInbound/QueryCompletionInboundList",
        method: "post",
        data
    })
}

/** 完工入库明细查询 */
export function QueryCompletionInboundDetailList(data: any) {
    return request({
        url: "/api/CompletionInbound/QueryCompletionInboundDetailList",
        method: "post",
        data
    })
}

/** 保存/提交 完工入库单据 */
export function SubmitCompletionInbound(data: any) {
    return request({
        url: "/api/CompletionInbound/SubmitCompletionInbound",
        method: "post",
        data
    })
}

/** 扫描SN */
export function ScanSN(data: any) {
    return request({
        url: "/api/CompletionInbound/ScanSN",
        method: "post",
        data
    })
}

/** 工单批量入库下拉框（不用传参） */
export function QueryBatchInboundByMfgOrder() {
    return request({
        url: "/api/CompletionInbound/QueryBatchInboundByMfgOrder",
        method: "post"
    })
}

/** 根据工单查询未入库SN明细 */
export function QuerySNDetailByMfgOrder(data: any) {
    return request({
        url: "/api/CompletionInbound/QuerySNDetailByMfgOrder",
        method: "post",
        data
    })
}

/** 删除完工入库单据 */
export function DeleteCompletionInbound(data: any) {
    return request({
        url: "/api/CompletionInbound/DeleteCompletionInbound",
        method: "post",
        data
    })
}

/** 查询仓库下拉列表 */
export function QueryWareHouse(data?: any) {
    return request({
        url: "/api/CompletionInbound/QueryWareHouse",
        method: "post",
        data
    })
}

/** 工单领料-车间名称查询 */
export function WorkOrderOperationWorkCenterQuery() {
    return request({
        url: "/api/PickMaterialsForWorkOrder/WorkOrderOperationWorkCenterQuery",
        method: "post"
    })
}

/** 工单领料-生产线名称查询 */
export function WorkOrderOperationMfgLineQuery() {
    return request({
        url: "/api/PickMaterialsForWorkOrder/WorkOrderOperationMfgLineQuery",
        method: "post"
    })
}

/** 工单领料-工单查询 */
export function WorkOrderOperationMfgOrderQuery() {
    return request({
        url: "/api/PickMaterialsForWorkOrder/WorkOrderOperationMfgOrderQuery",
        method: "post"
    })
}

/** 工单领料-产品系列名称查询 */
export function WorkOrderOperationProductFamilyQuery() {
    return request({
        url: "/api/PickMaterialsForWorkOrder/WorkOrderOperationProductFamilyQuery",
        method: "post"
    })
}

/** 工单领料-产品类型名称查询 */
export function WorkOrderOperationProductTypeQuery() {
    return request({
        url: "/api/PickMaterialsForWorkOrder/WorkOrderOperationProductTypeQuery",
        method: "post"
    })
}

/** 工单领料主页面查询 */
export function WorkOrderOperationQuery(data: any) {
    return request({
        url: "/api/PickMaterialsForWorkOrder/WorkOrderOperationQuery",
        method: "post",
        data
    })
}

/** 可用仓库查询 */
export function WareHouseQuery() {
    return request({
        url: "/api/PickMaterialsForWorkOrder/WareHouseQuery",
        method: "post"
    })
}

/** 根据工单信息查询物料明细 */
export function WorkOrderMaterialDetailQuery(params: any) {
    return request({
        url: "/api/PickMaterialsForWorkOrder/WorkOrderMaterialDetailQuery",
        method: "post",
        params
    })
}

/** 查询ERP可用库存 */
export function GetErpStock(data: any) {
    return request({
        url: "/api/PickMaterialsForWorkOrder/GetErpStock",
        method: "post",
        data
    })
}

/** 提交领料申请 */
export function SubmitPickupOrder(data: any) {
    return request({
        url: "/api/PickMaterialsForWorkOrder/SubmitPickupOrder",
        method: "post",
        data
    })
}

/** 发料单表头信息查询 */
export function MaterialIssueList(data: any) {
    return request({
        url: "/api/PickMaterialsForWorkOrder/MaterialIssueList",
        method: "post",
        data
    })
}

/** 发料单明细信息查询 */
export function MaterialIssueDetail(params: any) {
    return request({
        url: "/api/PickMaterialsForWorkOrder/MaterialIssueDetail",
        method: "post",
        params
    })
}

/** 提交发料 */
export function SubmitMaterialIssue(data: any) {
    return request({
        url: "/api/PickMaterialsForWorkOrder/SubmitMaterialIssue",
        method: "post",
        data
    })
}

/** 根据工单查询可执行批次列表及历史采集数据（容器操作） */
export function ContainersOperationMfgOrderDetailQuery(MfgOrderName: string) {
    return request({
        url: "/api/ContainersOperation/MfgOrderDetailQuery",
        method: "post",
        params: { MfgOrderName }
    })
}

/** 根据条码查询批次信息及历史采集数据（容器操作） */
export function ContainersOperationContainerDetailQuery(containerName: string) {
    return request({
        url: "/api/ContainersOperation/ContainerDetailQuery",
        method: "post",
        params: { containerName }
    })
}

/** 条码执行（容器操作） */
export function ContainersOperationContainerOperationExecution(data: any) {
    return request({
        url: "/api/ContainersOperation/ContainerOperationExecution",
        method: "post",
        data
    })
}