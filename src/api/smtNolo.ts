import request from "@/request/noLoRequest";
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
    return request({
      url: "/api/packing/QueryPackingListByCarrierName",
      method: "post",
      params: data,
    });
  }