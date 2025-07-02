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