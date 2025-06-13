import { data } from "react-router-dom";
import { yApiRequest as axios } from "./index";

export interface StaffData {
  id: string
  name: string
  phone: string
  department: string
  role: string
  status: 'active' | 'inactive'
}

export interface StaffQuery {
  name?: string
  phone?: string
  page?: number
  pageSize?: number
}

// 获取员工列表
export async function getStaffList(params: any) {
  return axios.get<{
    data: StaffData[]
    total: number
  }>('/gdv/staff/list', params)
}

// 新增员工
export async function addStaff(data: any) {
  return axios.post<StaffData>('/gdv/staff/add',data)
}

// 编辑员工
export async function updateStaff(data: StaffData) {
  return axios.post<StaffData>('/api/staff/update', data)
}

// 删除员工
export async function deleteStaff(data: any) {
  return axios.post<void>('/api/staff/delete', data)
}

interface ResetPasswordParams {
  staffId: string;
  newPassword: string;
}

/**
 * 重置员工密码
 * @param params 重置密码参数
 */
export async function resetStaffPassword(params: ResetPasswordParams) {
  return axios.post('/staff/reset-password',params );
} 