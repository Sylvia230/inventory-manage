import { yApiRequest as axios } from "./index";

export function GetOrderListApi(data: any) {
	return axios.post<unknown, any>('/order/pageQuery', data).then(res => res.result);
}
