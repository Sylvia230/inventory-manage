
import { yApiRequest as axios } from "./index";

export const getProvinceListApi = async (params: any): Promise<any> => {
    return axios.post('/province/pageQuery', params).then(res => res.result);
};

// 获取城市
export const getCityListApi = async (params: any): Promise<any> => {
    return axios.post('/city/pageQuery', params).then(res => res.result);
};

// 获取区县
export const getDistrictListApi = async (params: any): Promise<any> => {
    return axios.post('/county/pageQuery', params).then(res => res.result);
};

// 获取仓库列表
export const getWarehouseListApi = async (params: any): Promise<any> => {
    return axios.post('/wmsWarehouse/pageQuery', params).then(res => res);
};


// 新增仓库
export const addWarehouseApi = async (params: any): Promise<any> => {
    return axios.post('/wmsWarehouse/saveWmsWarehouse', params).then(res => res);
};

// 编辑仓库
export const editWarehouseApi = async (params: any): Promise<any> => {
    return axios.post('/wmsWarehouse/update', params).then(res => res);
};

// 删除仓库
export const deleteWarehouseApi = async (params: any): Promise<any> => {
    return axios.post('/wmsWarehouse/removeWmsWarehouse', params).then(res => res);
};

// 启用作废仓库
export const enableOrDisableWarehouseApi = async (params: any): Promise<any> => {
    return axios.post('/wmsWarehouse/updateStatus', params).then(res => res);
};

// 获取仓库管理员
export const getWarehouseKeeperListApi = async (params: any): Promise<any> => {
    return axios.post('/userStaff/pageQuery', params).then(res => res.result);
};

export interface InboundListParams {
  inboundNo?: string;
  vin?: string;
  productType?: string;
  pageSize: number;
  current: number;
}

export interface InboundDetailParams {
  inboundId: string;
}

export interface InboundListItem {
  key: string;
  inStockNo: string;
  warehouse: string;
  expectedTime: string;
  productType: string;
  businessNo: string;
  customer: string;
  status: string;
}

export interface InboundListResponse {
  total: number;
  list: InboundListItem[];
}

export const getInboundListApi = async (params: any): Promise<any> => {
  return await axios.post('/wmsInbound/pageQuery', params).then(res => res);
}

// 新增入库
export const addInboundApi = async (params: any): Promise<any> => {
    return axios.post('/wmsInbound/createWmsInbound', params).then(res => res);
};

// 入库详情
export const getInboundDetailApi = async (params: any): Promise<any> => {
    // console.log(params, 'getInboundDetailApi');
    return axios.get(`/wmsInbound/detail`, params).then(res => res);
};

// 入库类型
export const getInboundTypeApi = async (params: any): Promise<any> => {
    return axios.get(`/enums/InboundTypeEnum`, params).then(res => res);
};

// 获取商家接口
export const getCustomerListApi = async (params: any): Promise<any> => {
    return axios.post(`/vendor/pageQuery`, params).then(res => res);
};

//  获取外观内饰接口
export const getAppearanceAndInteriorListApi = async (params: any): Promise<any> => {
    return axios.post(`/carVehicleColor/pageQuery`, params).then(res => res);
};


// 获取GPS
export const getGpsListApi = async (params: any): Promise<any> => {
    return axios.post(`/wmsGpsDevice/pageQuery`, params).then(res => res);
};

// 入库操作
export const inboundOperationApi = async (params: any): Promise<any> => {
    return axios.post(`/wmsInbound/inbound`, params).then(res => res.result);
};