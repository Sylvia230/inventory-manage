import { yApiRequest as axios } from "./index";

export function GetVehicleListApi(data: any) {
	return axios.post<unknown, any>('/car/pageQuery', data).then(res => res);
}
