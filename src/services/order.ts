import { yApiRequest as axios } from "./index";

export function GetOrderListApi(data: any) {
	return axios.get<unknown, any>('/gdv/order/pageQuery', data).then(res => res);
}
