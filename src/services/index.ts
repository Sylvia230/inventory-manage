import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import qs from 'qs';
import { message } from 'antd';
import { ResponseData } from '@/services/typings';
import { BASE_URL } from '@/constants';

export interface ResponseTypeOfKDZS<T> {
    apiName?: string;
    data: T;
	result?: number;
	message?: string;
	[k: string]: any;
}

function stringify(data:any) {
	for (let i in data) {
		typeof data[i] === 'object' && (data[i] = JSON.stringify(data[i]));
	}
	return qs.stringify(data);
}

const instance = axios.create({
	// baseURL: process.env.NEXT_PUBLIC_API_URL, // 使用环境变量或默认值
	// baseURL: 'http://120.26.232.36/gdv', // 使用环境变量或默认值,
	baseURL: 'http://127.0.0.1:9001/api',
	headers: {
		"Content-Type": "application/json; charset=utf-8",
	} as AxiosRequestHeaders,
	timeout: 300000,
	withCredentials: true,
});

const CONTENTTYPE_FORM = 'application/x-www-form-urlencoded';

export interface RequestConfig extends AxiosRequestConfig{
    isShowLoading?:boolean;
    isHideError?:boolean;
}
export type RequestOption = Omit<RequestConfig, 'url'|'data'|'headers'>

interface ResponseConfig extends AxiosResponse{
    config:RequestConfig
}

// post请求头
// (instance.defaults as any).headers['Content-Type'] = CONTENTTYPE_FORM;

// **路由请求拦截**
instance.interceptors.request.use(
	(config) => {
		// 配置baseURL
		let headerIncludeForm = (config.headers?.['Content-Type'] as string)?.indexOf(CONTENTTYPE_FORM) > -1;
		if (headerIncludeForm && config.method === 'post') {
			config.data = stringify(config.data);
		}
		// 在这里可以添加token等认证信息
		const token = localStorage.getItem('token')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config;
	},
	(error) => Promise.reject(error.response)
);

// http 响应 拦截器
instance.interceptors.response.use(
	(response: any) => {
		console.log('....response', response)

		// 下载类型的接口
		if (response.headers["Content-Type"] === "multipart/form-data") {
			return response;
		}
		let code = response.data?.code;
		console.log('....code', code);
		 // 全局报错提示
		 if (code !== "00000") {
            return Promise.reject(response.data);
        }
		
		return response.data;
	},
	(error) => {
		console.log('.....error', error);
		const isRootPath = location.pathname === '/'
		// 处理 403 状态码
		if (error?.response?.status === 403) {
			if(isRootPath) {
				message.error('密码错误,请输入正确密码');
			}
			// 可以在这里添加重定向到登录页面的逻辑
			window.location.href = '#/login';
		} else if (error?.response?.status === 401) {
			message.error('未授权，请重新登录');
			// 可以在这里添加重定向到登录页面的逻辑
			window.location.href = '#/login';
		} else if (error?.response?.status === 404) {
			message.error('请求的资源不存在');
		} else if (error?.response?.status === 500) {
			message.error('服务器错误');
		} 
		// else {
		// 	message.error(error?.response?.data?.message);
		// }
		return Promise.reject(error?.response || error);
	},
);

interface ProxyHandleProps{
    get<T = any, R = ResponseTypeOfKDZS<T>>(config?: RequestConfig): Promise<R>;
	post<T = any, R = ResponseTypeOfKDZS<T>>(config?: RequestConfig): Promise<R>;
}


const proxyHandle:ProxyHandleProps = {
	post: (req: RequestConfig) => {
		let { url, data, headers, ...option } = req;
		if (headers) {
			Object.assign(instance.defaults.headers, headers);
		} else {
			Object.assign(instance.defaults.headers, { 'Content-Type': CONTENTTYPE_FORM });
		}
		return instance.post(url as string, data, option);
	},
	get: (req: RequestConfig) => {
		let { url, data, headers, ...option } = req;
		if (headers) {
			Object.assign(instance.defaults.headers, headers);
		} else {
			Object.assign(instance.defaults.headers, { 'Content-Type': CONTENTTYPE_FORM });
		}

		return instance.get(url as string, { params: data, ...option });
	}
};

const kdzsAxios = proxyHandle;

export { instance };

export default kdzsAxios;

const defaultHeader = {
	'Content-Type': 'application/json',
};

export const yApiRequest = {
	async get<T = any, R extends ResponseData = ResponseData>(
		url: string,
		data?: T,
		headers?: any,
		config?: RequestConfig
	) :Promise<R> {
		return proxyHandle.get({
			url,
			data,
			headers: {
				...defaultHeader,
				...headers
			},
			...config
		});
	},
	async post<T = any, R extends ResponseData = ResponseData>(
		url: string,
		data?: T,
		headers?: any,
		responseType?: any,
		config?: RequestConfig
	) :Promise<R> {
		return proxyHandle.post({
			url,
			data,
			headers: {
				...defaultHeader,
				...headers
			},
			responseType,
			...config
		});

	},
};

// 一个不改变defaults headers的方法,默认application/x-www-form-urlencoded
const defaultHeader2 = {
	"Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
};
export const proxyHandleNotChangeHeader:ProxyHandleProps = {
	post: (req: RequestConfig) => {
		let { url, data, ...option } = req;
		return instance.post(url as string, data, option);
	},
	get: (req: RequestConfig) => {
		let { url, data, ...option } = req;
		return instance.get(url as string, { params: data, ...option });
	}
};

export const yApiRequestNotChangeHeader = {
	async get<T = any, R extends ResponseData = ResponseData>(
		url: string,
		data?: T,
		headers?: any,
		config?: RequestConfig
	) :Promise<R> {
		return proxyHandleNotChangeHeader.get({
			url,
			data,
			headers: {
				...defaultHeader2,
				...(headers || {}),
			},
			...config
		});
	},
	async post<T = any, R extends ResponseData = ResponseData>(
		url: string,
		data?: T,
		headers?: any,
		responseType?: any,
		config?: RequestConfig
	) :Promise<R> {
		return proxyHandleNotChangeHeader.post({
			url,
			data,
			headers: {
				...defaultHeader2,
				...(headers || {}),
			},
			responseType,
			...config
		});

	},
};
