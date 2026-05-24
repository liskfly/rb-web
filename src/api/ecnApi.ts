import request from "@/request/ecnRequest";
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
        url: "/api/ECNOrder/GetECNOrderitem",
        method: "post",
        params: {
            ECNOrderld:data
        }
    });
}
