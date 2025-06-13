import { yApiRequest as axios } from "./index";
import { StaffData } from './staff'

export interface RoleData {
  id: string
  name: string
  description: string
  staffIds: string[]
  staffList: StaffData[]
  permissions?: string[]
  createTime: string
  updateTime: string
}

export interface RoleQuery {
  name?: string
  page?: number
  pageSize?: number
}

// 获取角色列表
export function getRoleList(data: any) {
	return axios.get<unknown, any>('/gdv/role/list', data).then(res => res.data);
}

// 新增角色
export async function addRole(data: any) {
  return axios.post<RoleData>('/gdv/role/add', data)
}

// 编辑角色
export async function updateRole(data: RoleData) {
  return axios.post<RoleData>('/gdv/role/update', data)
}

// 删除角色
export async function deleteRole(data:any) {
  return axios.post<void>('/gdv/role/delete', data)
} 