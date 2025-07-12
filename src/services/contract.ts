import { yApiRequest } from "./index";
import type { ResponseData } from './typings';

// 合同模板状态枚举
export enum ContractTemplateStatus {
  ENABLED = '1', // 启用
  DISABLED = '0', // 禁用
}

// 合同模板记录接口
export interface ContractTemplateRecord {
  id: string;
  key: string;
  templateName: string; // 模板名称
  templateType: string; // 模板类型
  templateContent: string; // 模板内容
  status: ContractTemplateStatus; // 状态
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
  createBy: string; // 创建人
  updateBy: string; // 更新人
  remark?: string; // 备注
}

// 合同模板查询参数
export interface ContractTemplateQueryParams {
  templateName?: string; // 模板名称
  templateType?: string; // 模板类型
  status?: ContractTemplateStatus; // 状态
  page?: number; // 页码
  pageSize?: number; // 每页大小
}

// 合同模板创建/更新参数
export interface ContractTemplateFormData {
  id?: string; // 更新时需要
  templateName: string; // 模板名称
  templateType: string; // 模板类型
  templateContent: string; // 模板内容
  status: ContractTemplateStatus; // 状态
  remark?: string; // 备注
}

// 分页查询合同模板
export function GetContractTemplateApi(params: ContractTemplateQueryParams): Promise<ResponseData<{
  list: ContractTemplateRecord[];
  total: number;
}>> {
  return yApiRequest.post('/contractTemplate/pageQuery', params).then(res => res.result);
}

// 获取合同模板详情
export function GetContractTemplateDetailApi(id: string): Promise<ResponseData<ContractTemplateRecord>> {
  return yApiRequest.get(`/contractTemplate/detail`, { id }).then(res => res.result);
}

// 创建合同模板
export function CreateContractTemplateApi(data: ContractTemplateFormData): Promise<ResponseData<any>> {
  return yApiRequest.post('/contractTemplate/create', data).then(res => res.result);
}

// 更新合同模板
export function UpdateContractTemplateApi(data: ContractTemplateFormData): Promise<ResponseData<any>> {
  return yApiRequest.post('/contractTemplate/update', data).then(res => res.result);
}


// 启用/禁用合同模板
export function UpdateContractTemplateStatusApi(id: string, status: ContractTemplateStatus): Promise<ResponseData<any>> {
  return yApiRequest.post('/contractTemplate/updateStatus', { id, status }).then(res => res.result);
}

// 获取合同模板类型列表
export function GetContractTemplateTypeApi(): Promise<ResponseData<Array<{
  value: string;
  label: string;
}>>> {
  return yApiRequest.get('/contractTemplate/types').then(res => res.result);
}


// 新建模板
export function SaveContractTemplateApi(data: any): Promise<ResponseData<any>> {
  return yApiRequest.post('/contractTemplate/saveContractTemplate', data).then(res => res.result);
}

// 获取已设置签章位置
export function GetContractSignPositionApi(data: any): Promise<ResponseData<any>> {
  return yApiRequest.post('/contractTemplateSigner/pageQuery', data).then(res => res.result);
}

// 保存签章人位置
export function SaveContractTemplateSignerApi(data: any): Promise<ResponseData<any>> {
  return yApiRequest.post('/contractTemplateSigner/saveContractTemplateSigner', data).then(res => res.result);
}

// 删除签章人位置
export function RemoveContractTemplateSignerApi(data: any): Promise<ResponseData<any>> {
  return yApiRequest.post('/contractTemplateSigner/removeContractTemplateSigner?id=' + data.id).then(res => res.result);
}

// 删除合同模板
export function DeleteContractTemplateApi(data: any): Promise<ResponseData<any>> {
  return yApiRequest.post('/contractTemplate/removeContractTemplate?id=' + data.id).then(res => res.result);
}