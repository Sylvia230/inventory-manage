import { yApiRequest as axios } from "./index";

export const getSettlementList = async (params: any): Promise<any> => {
    return axios.post('/settlement/pageQuery', params).then(res => res.result);
};

// 审核结算单接口
export const auditSettlementApi = async (params: any): Promise<any> => {
    return axios.post('/settlement/examine', params).then(res => res.result);
};