import request from "@/request/productionRequest";
/**
 * 不良品管理（Defect）
 */

/** 工序下拉框查询 */
export function QueryOperationDropdown() {
    return request({
        url: "/api/Defect/QueryOperationDropdown",
        method: "post"
    })
}

/** 不良主查询 */
export function QueryDefectMain(data: any) {
    return request({
        url: "/api/Defect/QueryDefectMain",
        method: "post",
        data
    })
}

/** 不良明细查询 */
export function QueryDefectDetails(data: any) {
    return request({
        url: "/api/Defect/QueryDefectDetails",
        method: "post",
        params: data
    })
}

/** 扫码不良SN */
export function ScanDefectSN(data: any) {
    return request({
        url: "/api/Defect/ScanDefectSN",
        method: "post",
        params: data
    })
}

/** 不良数据提交 */
export function SubmitDefectData(data: any) {
    return request({
        url: "/api/Defect/SubmitDefectData",
        method: "post",
        data
    })
}

/** 根据工序查找返修代码 */
export function ScrapReasonByProcess(data: any) {
    return request({
        url: "/api/Defect/ScrapReasonByProcess",
        method: "post",
        params:data
    })
}

/** 不良品返修提交 */
export function SubmitRework(data: any) {
    return request({
        url: "/api/Defect/SubmitRework",
        method: "post",
        data
    })
}

/** 不良品报废提交 */
export function SubmitScrap(data: any) {
    return request({
        url: "/api/Defect/SubmitScrap",
        method: "post",
        data
    })
}