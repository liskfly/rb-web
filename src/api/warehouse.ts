import request from "@/request/warehouseRequest";

/**
 * 工单状态变更页面
 */

/** 工单状态变更页面查询 */
export function WorkOrderOperationQuery(data: any) {
    return request({
        url: "/api/MfgOrder/WorkOrderOperationQuery",
        method: "post",
        data
    })
}

/** 车间名称查询（下拉） */
export function WorkOrderOperationWorkCenterQuery() {
    return request({
        url: "/api/MfgOrder/WorkOrderOperationWorkCenterQuery",
        method: "post",
    })
}

/** 生产线名称查询（下拉） */
export function WorkOrderOperationMfgLineQuery() {
    return request({
        url: "/api/MfgOrder/WorkOrderOperationMfgLineQuery",
        method: "post"
    })
}

/** 订单状态名称查询（下拉） */
export function WorkOrderOperationOrderStatusQuery() {
    return request({
        url: "/api/MfgOrder/WorkOrderOperationOrderStatusQuery",
        method: "post"
    })
}

/** 产品系列名称查询（下拉） */
export function WorkOrderOperationProductFamilyQuery() {
    return request({
        url: "/api/MfgOrder/WorkOrderOperationProductFamilyQuery",
        method: "post"
    })
}

/** 产品类型名称查询（下拉） */
export function WorkOrderOperationProductTypeQuery() {
    return request({
        url: "/api/MfgOrder/WorkOrderOperationProductTypeQuery",
        method: "post"
    })
}

/** 产品名称查询（下拉） */
export function WorkOrderOperationProductNameQuery() {
    return request({
        url: "/api/MfgOrder/WorkOrderOperationProductNameQuery",
        method: "post"
    })
}

/** 工单状态暂停 */
export function WorkOrderOrderStatusPauseExecute(data: any) {
    return request({
        url: "/api/MfgOrder/WorkOrderOrderStatusPauseExecute",
        method: "post",
        data
    })
}

/** 工单状态解除暂停 */
export function WorkOrderOrderStatusResumeExecute(data: any) {
    return request({
        url: "/api/MfgOrder/WorkOrderOrderStatusResumeExecute",
        method: "post",
        data
    })
}