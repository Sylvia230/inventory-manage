import React, { useState, useEffect } from 'react'
import { Table, Tag, Space, Button, Input, Modal, Form, Select, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined } from '@ant-design/icons'
import styles from './index.module.css'
import { StaffData, getStaffList, addStaff, updateStaff, deleteStaff } from '@/services/staff'

// 模拟部门和角色数据
const departments = [
  { label: '技术部', value: '技术部' },
  { label: '市场部', value: '市场部' },
  { label: '人事部', value: '人事部' },
  { label: '财务部', value: '财务部' },
]

const roles = [
  { label: '开发工程师', value: '开发工程师' },
  { label: '产品经理', value: '产品经理' },
  { label: '市场经理', value: '市场经理' },
  { label: 'HR专员', value: 'HR专员' },
  { label: '财务专员', value: '财务专员' },
]

const StaffManage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')
  const [currentRecord, setCurrentRecord] = useState<StaffData | null>(null)
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<StaffData[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
// 模拟数据
const mockData: StaffData[] = [
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
      department: '市场部',
      role: '市场经理',
      status: 'active'
    },
    {
      id: '3',
      name: '王五',
      phone: '13800138002',
      department: '人事部',
      role: 'HR专员',
      status: 'inactive'
    }
  ]
  // 获取员工列表
  const fetchStaffList = async (params = {}) => {
    try {
      setLoading(true)
    //   const { data, total } = await getStaffList({
    //     page: pagination.current,
    //     pageSize: pagination.pageSize,
    //     ...params,
    //   })
    //   setDataSource(data)
    setDataSource(mockData)
      setPagination(prev => ({
        ...prev,
        total: mockData.length,
      }))
    } catch (error) {
      console.error('获取员工列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaffList()
  }, [pagination.current, pagination.pageSize])

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    fetchStaffList({ name: value, phone: value })
  }

  const handleAdd = () => {
    setModalType('add')
    setCurrentRecord(null)
    setModalVisible(true)
    form.resetFields()
  }

  const handleEdit = (record: StaffData) => {
    setModalType('edit')
    setCurrentRecord(record)
    setModalVisible(true)
    form.setFieldsValue(record)
  }

  const handleDelete = (record: StaffData) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除员工 ${record.name} 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true)
          await deleteStaff(record.id)
          message.success('删除成功')
          fetchStaffList()
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
        await addStaff(values)
        message.success('新增成功')
      } else {
        await updateStaff({ ...currentRecord, ...values } as StaffData)
        message.success('编辑成功')
      }
      setModalVisible(false)
      form.resetFields()
      fetchStaffList()
    } catch (error) {
      console.error('表单提交失败:', error)
    }
  }

  const columns: ColumnsType<StaffData> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 150,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '在职' : '离职'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Input
          placeholder="搜索姓名/手机号"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={handleAdd}>新增员工</Button>
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

      {/* 员工信息弹窗 */}
      <Modal
        title={modalType === 'add' ? '新增员工' : '编辑员工'}
        open={modalVisible}
        onOk={handleModalSubmit}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]}
          >
            <Input placeholder="请输入手机号" maxLength={11} />
          </Form.Item>
          <Form.Item
            name="department"
            label="部门"
            rules={[{ required: true, message: '请选择部门' }]}
          >
            <Select
              placeholder="请选择部门"
              options={departments}
            />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select
              placeholder="请选择角色"
              options={roles}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            initialValue="active"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select
              options={[
                { label: '在职', value: 'active' },
                { label: '离职', value: 'inactive' }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default StaffManage 