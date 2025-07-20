
import { yApiRequest as axios } from "./index";

export function GetVendorListApi(data: any) {
	return axios.post<unknown, any>('/vendor/pageQuery', data).then(res => res.result);
}

// 获取签章人
export function GetSignaturePersonListApi(data: any) {
	return axios.post<unknown, any>('/signer/pageQuery', data).then(res => res.result);
}

// 获取授信额度列表
export function GetCreditLimitListApi(data: any) {
	return axios.post<unknown, any>('/vendorCredit/pageQuery', data).then(res => res.result);
}

// 保存授信额度
export function SaveCreditLimitApi(data: any) {
	return axios.post<unknown, any>('/vendorCredit/saveVendorCredit', data).then(res => res.result);
}

// 删除授信额度
export function DeleteCreditLimitApi(data: any) {
	return axios.post<unknown, any>('/creditLimit/delete', data).then(res => res.result);
}

// 获取授信额度详情
export function GetCreditLimitDetailApi(data: any) {
	return axios.post<unknown, any>('/creditLimit/detail', data).then(res => res.result);
}

// 新增商家
export function AddVendorApi(data: any) {
	return axios.post<unknown, any>('/vendor/saveVendor', data).then(res => res.result);
}

// 修改商家
export function saveVendorApi(data: any) {
	return axios.post<unknown, any>('/vendor/saveVendor', data).then(res => res.result);
}

// 加入黑名单
export function saveBlackList(data: any) {
	return axios.post<unknown, any>('/vendorBlackList/saveVendorBlackList', data).then(res => res.result);
}

// 获取黑名单列表
export function GetBlackListApi(data: any) {
	return axios.post<unknown, any>('/vendorBlackList/pageQuery', data).then(res => res.result);
}

// 添加黑名单
export function AddBlackListApi(data: any) {
	return axios.post<unknown, any>('/vendorBlackList/saveVendorBlackList', data).then(res => res.result);
}

// 移除黑名单
export function RemoveBlackListApi(data: any) {
	return axios.post<unknown, any>('/vendorBlackList/removeVendorBlackList?id=' + data.id).then(res => res.result);
}

// 新增标签
export function AddTagApi(data: any) {
	return axios.post<unknown, any>('/bizTag/saveBizTag', data).then(res => res.result);
}

// 获取标签列表
export function GetTagListApi(data: any) {
	return axios.post<unknown, any>('/bizTag/pageQuery', data).then(res => res.result);
}

// 保存标签关系接口
export function SaveTagRelationApi(data: any) {
	return axios.post<unknown, any>('/bizTagRelation/saveBizTagRelationBatch', data).then(res => res.result);
}

// 保存标签关系接口
export function DetailAPi(id: any) {
	return axios.get<unknown, any>('/vendor/detail?id='+id).then(res => res.result);
}
