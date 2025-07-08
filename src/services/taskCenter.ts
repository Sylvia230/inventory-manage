import { yApiRequest as axios } from "./index";

export function GetTaskInfoApi(data: any) {
	return axios.post<unknown, any>('/task/pageQuery', data).then(res => res.result);
}


// 获取核价车辆
export function GetPriceCheckVehicleApi(data: any) {
	return axios.get<unknown, any>('/task/waitPricingCar', data).then(res => res.result);
}


// 处理核价
export function HandlePriceCheckApi(data: any) {
	return axios.post<unknown, any>('/task/pricing', data).then(res => res.result);
}

// 预授信
export function PreCreditApi(data: any) {
	return axios.post<unknown, any>('/task/preCredit?taskId='+data.taskId).then(res => res.result);
}

// 推送到资方
export function PushToInvestorApi(taskId: any) {
	return axios.get<unknown, any>('/task/pushToCapital?taskId='+taskId).then(res => res.result);
}