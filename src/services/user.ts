import { yApiRequest as axios } from "./index";

export function GetLoginInfoApi(data: any) {
	return axios.post<unknown, any>('/gdv/auth/login', data).then(res => res);
}
