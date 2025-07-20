import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, Space, message, Tree } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { DataNode } from 'antd/es/tree'
import styles from './index.module.css'
import { RoleData, getRoleList,  saveRole, deleteRole } from '@/services/role'
import {StaffData} from "@/services/staff.ts";
import {getStaffList } from '@/services/dept'


const RoleManage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')
  const [currentRecord, setCurrentRecord] = useState<RoleData | null>(null)
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<RoleData[]>([])
  const [staffList, setStaffList] = useState<StaffData[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [loadingStaff, setLoadingStaff] = useState(false)

  useEffect(() => {
    fetchRoleList();
    getStaff();
  }, [pagination.current, pagination.pageSize])

  // 获取橘色列表
  const fetchRoleList = async (params?: any, paginationParams?: any) => {
    try {
      setLoading(true);
      const currentPagination = paginationParams || pagination;
      const searchParams = {
        ...params,
        pageNo: currentPagination.current,
        pageSize: currentPagination.pageSize,
      };
      const response:any = await getRoleList(searchParams);
      setDataSource(response.result || []);
      setPagination(prev => ({
        ...prev,
        total: response.totalCount || 0
      }));
    } catch (error) {
      console.error('获取部门列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取用户数据
  const getStaff = async (params = {"pageSize":1000}) => {
    setLoadingStaff(true);
    try {
      const res = await getStaffList(params);
      console.log(res, 'response');
      // API返回的数据结构应该是一个数组，包含 {id, name} 或 {value, label} 格式
      setStaffList(res || []);
    } catch (error) {
      console.error('获取用户数据失败:', error);
      message.error('获取用户数据失败');
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination)
  }

  const columns: ColumnsType<RoleData> = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 150,
    },
    {
      title: '已选员工',
      dataIndex: 'userInfoDTOList',
      key: 'userInfoDTOList',
      width: 200,
      render: (userList: StaffData[] | null | undefined) => (
          <span>
          {userList
        ? userList.map(staff => staff.personName).join(', ')
        : '未选择员工'}
      </span>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 180,
    },
    {
      title: '创建时间',
      dataIndex: 'createTimeStr',
      key: 'createTimeStr',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link">
            分配权限
          </Button>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const handleAdd = () => {
    setModalType('add')
    setCurrentRecord(null)
    setModalVisible(true)
    form.resetFields()
  }

  const handleEdit = (record: RoleData) => {
    setModalType('edit')
    setCurrentRecord(record)
    setModalVisible(true)
    setSelectedPermissions(record.permissions || [])
    form.setFieldsValue({
      ...record,
      staffIds: record.staffIds,
    })
  }

  const handleDelete = (record: RoleData) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除角色 ${record.name} 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true)
          await deleteRole(record.id)
          message.success('删除成功')
          fetchRoleList()
        } catch (error) {
          console.error('删除失败:', error)
        } finally {
          setLoading(false)
        }
      }
    })
  }

  const handleModalSubmit = async () => {
    try {
      let values = await form.validateFields()
      const submitData = {
        ...values,
        permissions: selectedPermissions,
      }
      
      if (modalType === 'add') {

      } else {
        values = ({ ...currentRecord, ...submitData } as RoleData)
      }
      await saveRole(values)
      message.success('保存成功')
      setModalVisible(false)
      form.resetFields()
      setSelectedPermissions([])
      fetchRoleList()
    } catch (error) {
      console.error('表单提交失败:', error)
      message.error('保存失败')
    }
  }

  const onCheck = (checkedKeys: any) => {
    setSelectedPermissions(checkedKeys)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button type="primary" onClick={handleAdd}>新增角色</Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`
        }}
        onChange={handleTableChange}
      />

      {/* 角色信息弹窗 */}
      <Modal
        title={modalType === 'add' ? '新增角色' : '编辑角色'}
        open={modalVisible}
        onOk={handleModalSubmit}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
          setSelectedPermissions([])
        }}
        destroyOnClose
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="roleName"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
              name="description"
              label="描述"
              rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input placeholder="请输入描述" />
          </Form.Item>
          <Form.Item
            name="userIds"
            label="选择员工"
            rules={[{ required: false, message: '请选择员工' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择员工"
              style={{ width: '100%' }}
              options={staffList.map(staff => ({
                label: staff.personName,
                value: staff.id,
              }))}
            />
          </Form.Item>
          {/*<Form.Item*/}
          {/*  label="菜单权限"*/}
          {/*  required*/}
          {/*  tooltip="请选择该角色可以访问的菜单和操作权限"*/}
          {/*>*/}
          {/*  <Tree*/}
          {/*    checkable*/}
          {/*    defaultExpandAll*/}
          {/*    checkedKeys={selectedPermissions}*/}
          {/*    onCheck={onCheck}*/}
          {/*    treeData={menuPermissions}*/}
          {/*    height={400}*/}
          {/*    style={{ border: '1px solid #d9d9d9', padding: '8px', borderRadius: '4px' }}*/}
          {/*  />*/}
          {/*</Form.Item>*/}
        </Form>
      </Modal>
    </div>
  )
}

export default RoleManage 