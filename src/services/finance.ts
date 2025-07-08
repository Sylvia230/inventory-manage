import { yApiRequest as axios } from "./index";

export const getSettlementList = async (params: any): Promise<any> => {
    return axios.post('/settlement/pageQuery', params).then(res => res.result);
};

// 审核结算单接口
export const auditSettlementApi = async (params: any): Promise<any> => {
    return axios.post('/settlement/examine', params).then(res => res.result);
};

// 请款单接口
export const getPaymentRequestList = async (params: any): Promise<any> => {
    return axios.post('/payment/pageQuery', params).then(res => res.result);
};

// 上传凭证接口
export const uploadCertApi = async (params: any): Promise<any> => {
    return axios.post('/payment/uploadCert', params).then(res => res.result);
};

// 关闭请款单接口
export const closePaymentApi = async (params: any): Promise<any> => {
    return axios.post('/payment/reject', params).then(res => res.result);
};

// 获取请款单凭证接口
export const getVoucherImagesApi = async (paymentId: string): Promise<any> => {
    return axios.get(`/payment/voucher/${paymentId}`).then(res => res.result);
};

//结算单详情
export const getSettlementDetailApi = async (params: any): Promise<any> =>{
    return axios.get(`/settlement/examineDetail/`,params ).then(res => res.result);
}