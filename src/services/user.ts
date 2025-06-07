import { yApiRequest as axios } from "./index";

export function GetLoginInfoApi(data: any) {
	return axios.get<unknown, any>('/', data).then(res => res.data);
}
