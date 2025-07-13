// import { data } from "react-router-dom";
import { yApiRequest } from '@/services';
import type { ResponseData } from '@/services/typings';

export interface DeptData {
  id: string
  deptName: string
  leaderId: string
  leaderName: string
  leaderPhone: string
  status: number
}

export interface DeptQuery {
  deptName?: string
  page?: number
  pageSize?: number
}

export interface PageQuery {
  page?: number
  pageSize?: number
}

// 获取部门列表
export const getDeptList = async (params: DeptQuery): Promise<any> => {
  return yApiRequest.post('/userDept/pageQuery', params).then(res => res);
};

// 获取员工列表
export const getStaffList = async (params: PageQuery): Promise<any> => {
  return yApiRequest.post('/userStaff/pageQuery', params).then(res => res.result);
};

// 新增部门
export const saveDept = async (data: Partial<any>): Promise<ResponseData<any>> => {
  return yApiRequest.post('/userDept/saveUserDept', data).then(res => res);
};
//
// 编辑部门
export const updateDept = async (data: Partial<any>): Promise<ResponseData<any>> => {
  return yApiRequest.post('/userDept/saveDept', data);
};
//
// 删除员工
export const deleteDept = async (id: string): Promise<ResponseData<void>> => {
  return yApiRequest.post('/userDept/removeUserDept?id='+id);
};