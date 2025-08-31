import { yApiRequest as axios } from "./index";

export function GetOrderListApi(data: any) {
	return axios.post<unknown, any>('/order/pageQuery', data).then(res => res.result);
}

export function GetDetailApi(data: string) {
	return axios.get<unknown, any>('/order/orderDetail?orderNo='+data).then(res => res.result);
}
