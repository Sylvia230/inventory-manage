import { yApiRequest as axios } from "./index";

export function GetLoginInfoApi(data: any) {
	return axios.post<unknown, any>('/auth/login', data).then(res => res.result);
}

// 枚举接口
export function GetEnumApi(data: any) {
	return axios.get<unknown, any>(`/enums/${data}`).then(res => res.result);
}


// 获取Url
export function GetUrlApi() {
	return axios.get<unknown, any>(`/`).then(res => res.result);
}