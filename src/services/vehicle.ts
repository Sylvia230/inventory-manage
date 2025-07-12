import { yApiRequest as axios } from "./index";

export function GetVehicleListApi(data: any) {
	return axios.post<unknown, any>('/car/pageQuery', data).then(res => res);
}


// 获取车规列表
export function GetVehicleSpecListApi(data: any) {
	return axios.post<unknown, any>('/spec/pageQuery', data).then(res => res);
}

// 获取品牌列表
export function GetVehicleBrandListApi(data: any) {
	return axios.post<unknown, any>('/carBrand/pageQuery', data).then(res => res);
}

// 获取车系
export function GetVehicleSeriesListApi(data: any) {
	return axios.post<unknown, any>('/carSeries/pageQuery', data).then(res => res);
}

// 获取车型
export function GetVehicleModelListApi(data: any) {
	return axios.post<unknown, any>('/carVehicle/pageQuery', data).then(res => res);
}