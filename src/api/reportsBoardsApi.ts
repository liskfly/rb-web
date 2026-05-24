import request from "@/request/opRequest";
//查询烧录机子座使用记录
export function getBurningData(data: any){
    return request({
        url: "/api/BurningData/getBurningData",
        method: "post",
        data,
    });
}

export function GetBurnProgDataSiteInfo(HeadDataGuid: any){
    return request({
        url: "/api/BurningData/GetBurnProgDataSiteInfo",
        method: "post",
        params:{
            HeadDataGuid
        }
    });
}

export function GetIOTBurnProgDataSlotInfo(SiteDataGuid: any){
    return request({
        url: "/api/BurningData/GetIOTBurnProgDataSlotInfo",
        method: "post",
        params:{
            SiteDataGuid
        }
    });
}