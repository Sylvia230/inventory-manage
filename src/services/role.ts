import { yApiRequest as axios } from "./index";
import { StaffData } from './staff'

export interface RoleData {
  id: string
  roleName: string
  description: string
  staffIds: string[]
  staffList: StaffData[]
  permissions?: string[]
  createTime: string
  updateTime: string
}

export interface RoleQuery {
  roleName?: string
  page?: number
  pageSize?: number
}

// 获取角色列表
export function getRoleList(params: RoleQuery): Promise<any> {
	return axios.post('/userRole/pageQuery', params).then(res => res);
}

// 新增角色
export async function saveRole(data: any) {
  return axios.post('/userRole/saveUserRole', data)
}

// 删除角色
export async function deleteRole(id: string) {
  return axios.post<void>('/userRole/removeUserRole?id='+id)
}

// 分配角色给用户
export async function allocationUser(data: any) {
  return axios.post('/userRole/allocationUser', data)
}