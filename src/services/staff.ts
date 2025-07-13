// import { data } from "react-router-dom";
import { yApiRequest } from '@/services';
import type { ResponseData } from '@/services/typings';

export interface StaffData {
  id: string
  personName: string,
  mobilePhone: string,
  deptName: string,
  roles: string,
  status: number,
  statusDesc: string
}

export interface StaffQuery {
  name?: string
  phone?: string
  page?: number
  pageSize?: number
}

// 用户查询参数
export interface UserStaffQueryParams {
  nameOrMobilePhone?: string;
  page?: number;
  pageSize?: number;
}

// 用户查询参数
export interface UserRoleQueryParams {
  page?: number;
  pageSize?: number;
}

// 用户记录接口
export interface UserStaffRecord {
  id: string;
  personName: string;
  mobilePhone: string;
  deptName: string;
  roles: string;
  status: number;
  statusDesc: string;
}

// 部门记录接口
export interface DeptRecord {
  id: string;
  deptName: string;
  leaderId: string;
  leaderName: string;
}

// 用户详情接口
export interface UserStaffDetail {
  id:String;
  personName: string;
  mobilePhone: string;
  deptId: string;
  deptName: string;
  roleDTOS:Role[],
  roles: string;
}

export interface Role {
  id: string;
  roleName: string;
}

// 获取用户列表
export const getStaffUserList = async (params: UserStaffQueryParams): Promise<ResponseData<{
  list: UserStaffRecord[];
  total: number;
}>> => {
  return yApiRequest.post('/userStaff/pageQuery', params).then(res => res);
};

// 获取部门列表
export const getDeptList = async (): Promise<any> => {
  return yApiRequest.get('/userDept/getDeptList').then(res => res.result);
};

// 获取角色列表
export const getRoleList = async (params: UserRoleQueryParams): Promise<any> => {
  return yApiRequest.post('/userRole/pageQuery',params).then(res => res.result);
};

// 新增员工
export const addStaff = async (data: Partial<UserStaffDetail>): Promise<ResponseData<any>> => {
  return yApiRequest.post('/userStaff/saveUser', data).then(res => res);
};
//
// 编辑员工
export const updateStaff = async (data: Partial<UserStaffDetail>): Promise<ResponseData<any>> => {
  return yApiRequest.post('/userStaff/saveUser', data);
};
//
// 删除员工
export const deleteStaff = async (id: string): Promise<ResponseData<void>> => {
  return yApiRequest.post('/userStaff/removeUser?id='+id);
};

//重置密码
interface ResetPasswordParams {
  id: string;
  pwd: string;
}
//
/**
 * 重置员工密码
 * @param params 重置密码参数
 */

//重置密码
export const resetStaffPassword = async (params: ResetPasswordParams): Promise<ResponseData<void>> => {
  return yApiRequest.post('/userStaff/resetPsw',params);
}