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

// 银行卡接口
export const getBankCardListApi = async (params: any): Promise<any> =>{
    return axios.post('/bankCard/pageQuery', params).then(res => res);
}

// 获取银行
export const getBankListApi = async (params: any): Promise<any> => {
    return axios.post('/bank/pageQuery', params).then(res => res.result);
};

// 获取银行支行
export const getBankBranchListApi = async (params: any): Promise<any> => {
    return axios.post('/bankBranch/pageQuery', params).then(res => res.result);
};

// 枚举接口
export function getEnumApi(data: any) {
    return axios.get<unknown, any>(`/enums/${data}`).then(res => res.result);
}


// 获取归属方列表
export function getOwnerListApi(data: any,name: String) {
    return axios.get<unknown, any>(`/bankCard/ownerList/${data}?name=`+name).then(res => res.result);
}

// 获取归属方列表
export const saveBankCardApi = async (data: any): Promise<any> => {
    return axios.post<unknown, any>(`/bankCard/saveBankCard`,data).then(res => res.result);
}