
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