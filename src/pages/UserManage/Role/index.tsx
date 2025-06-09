import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, Space, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import styles from './index.module.css'
import { getStaffList } from '@/services/staff'
import { StaffData } from '@/services/staff'
import { RoleData, getRoleList, addRole, updateRole, deleteRole } from '@/services/role'

// 模拟员工数据
const mockStaffList: StaffData[] = [
  {
    id: '1',
    name: '张三',
    phone: '13800138000',
    department: '技术部',
    role: '开发工程师',
    status: 'active'
  },
  {
    id: '2',
    name: '李四',
    phone: '13800138001',
    department: '技术部',
    role: '产品经理',
    status: 'active'
  },
  {
    id: '3',
    name: '王五',
    phone: '13800138002',
    department: '市场部',
    role: '市场经理',
    status: 'active'
  },
  {
    id: '4',
    name: '赵六',
    phone: '13800138003',
    department: '人事部',
    role: 'HR专员',
    status: 'active'
  },
  {
    id: '5',
    name: '钱七',
    phone: '13800138004',
    department: '财务部',
    role: '财务专员',
    status: 'active'
  },
  {
    id: '6',
    name: '孙八',
    phone: '13800138005',
    department: '技术部',
    role: '测试工程师',
    status: 'active'
  },
  {
    id: '7',
    name: '周九',
    phone: '13800138006',
    department: '市场部',
    role: '市场专员',
    status: 'active'
  },
  {
    id: '8',
    name: '吴十',
    phone: '13800138007',
    department: '人事部',
    role: '招聘专员',
    status: 'active'
  }
]

// 模拟角色数据
const mockRoles: RoleData[] = [
  {
    id: '1',
    name: '系统管理员',
    description: '系统最高权限管理员，可以管理所有功能',
    staffIds: ['1', '2'],
    staffList: [
      { id: '1', name: '张三', phone: '13800138000', department: '技术部', role: '开发工程师', status: 'active' },
      { id: '2', name: '李四', phone: '13800138001', department: '技术部', role: '产品经理', status: 'active' }
    ],
    createTime: '2024-01-01 12:00:00',
    updateTime: '2024-01-01 12:00:00'
  },
  {
    id: '2',
    name: '部门主管',
    description: '部门负责人，可以管理本部门员工',
    staffIds: ['3'],
    staffList: [
      { id: '3', name: '王五', phone: '13800138002', department: '市场部', role: '市场经理', status: 'active' }
    ],
    createTime: '2024-01-01 12:00:00',
    updateTime: '2024-01-01 12:00:00'
  },
  {
    id: '3',
    name: '普通员工',
    description: '普通员工，只能查看和操作自己的数据',
    staffIds: ['4', '5'],
    staffList: [
      { id: '4', name: '赵六', phone: '13800138003', department: '人事部', role: 'HR专员', status: 'active' },
      { id: '5', name: '钱七', phone: '13800138004', department: '财务部', role: '财务专员', status: 'active' }
    ],
    createTime: '2024-01-01 12:00:00',
    updateTime: '2024-01-01 12:00:00'
  }
]

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

  // 获取员工列表
  const fetchStaffList = async () => {
    try {
        // const { data } = await getStaffList({})
        // setStaffList(data)
      // 使用模拟数据
      setStaffList(mockStaffList)
    } catch (error) {
      console.error('获取员工列表失败:', error)
    }
  }

  // 获取角色列表
  const fetchRoleList = async (params = {}) => {
    try {
      setLoading(true)
    //   const { data, total } = await getRoleList({
    //     page: pagination.current,
    //     pageSize: pagination.pageSize,
    //     ...params,
    //   })
    //   setDataSource(data)
      // 使用模拟数据
      setDataSource(mockRoles)
      setPagination(prev => ({
        ...prev,
        total: mockRoles.length,
      }))
    } catch (error) {
      console.error('获取角色列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoleList()
    fetchStaffList()
  }, [pagination.current, pagination.pageSize])

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination)
  }

  const columns: ColumnsType<RoleData> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '已选员工',
      dataIndex: 'staffList',
      key: 'staffList',
      width: 200,
      render: (staffList: StaffData[]) => (
        <span>
          {staffList.map(staff => staff.name).join(', ')}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
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
      const values = await form.validateFields()
      if (modalType === 'add') {
        await addRole(values)
        message.success('新增成功')
      } else {
        await updateRole({ ...currentRecord, ...values } as RoleData)
        message.success('编辑成功')
      }
      setModalVisible(false)
      form.resetFields()
      fetchRoleList()
    } catch (error) {
      console.error('表单提交失败:', error)
    }
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
        }}
        destroyOnClose
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="staffIds"
            label="选择员工"
            rules={[{ required: true, message: '请选择员工' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择员工"
              style={{ width: '100%' }}
              options={staffList.map(staff => ({
                label: staff.name,
                value: staff.id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RoleManage 