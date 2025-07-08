
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