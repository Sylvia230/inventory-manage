import React, { useState } from 'react'
import { Table, Space, Button, Input, Tag, Modal, Form, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined } from '@ant-design/icons'
import styles from './index.module.css'

interface DepartmentData {
  id: string
  name: string
  phone: string
  department: string
  position: string
}

const DepartmentManage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<DepartmentData | null>(null)
  const [form] = Form.useForm()

  // 模拟数据
  const mockData: DepartmentData[] = [
    {
      id: '1',
      name: '张三',
      phone: '13800138000',
      department: '技术部',
      position: '前端开发'
    },
    {
      id: '2',
      name: '李四',
      phone: '13800138001',
      department: '技术部',
      position: '后端开发'
    },
    {
      id: '3',
      name: '王五',
      phone: '13800138002',
      department: '市场部',
      position: '市场专员'
    },
    {
      id: '4',
      name: '赵六',
      phone: '13800138003',
      department: '人事部',
      position: 'HR专员'
    }
  ]

  const columns: ColumnsType<DepartmentData> = [
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
      render: (department: string) => (
        <Tag color="blue">{department}</Tag>
      ),
    },
    {
      title: '岗位',
      dataIndex: 'position',
      key: 'position',
      width: 150,
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

  const handleEdit = (record: DepartmentData) => {
    setCurrentRecord(record)
    form.setFieldsValue(record)
    setEditModalVisible(true)
  }

  const handleDelete = (record: DepartmentData) => {
    setCurrentRecord(record)
    setDeleteModalVisible(true)
  }

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields()
      // TODO: 调用修改API
      console.log('修改数据:', values)
      message.success('修改成功')
      setEditModalVisible(false)
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      // TODO: 调用删除API
      console.log('删除数据:', currentRecord)
      message.success('删除成功')
      setDeleteModalVisible(false)
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    // TODO: 实现搜索逻辑
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Input
          placeholder="搜索姓名/手机号"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Space>
          <Button type="primary">新增部门</Button>
          <Button>新增岗位</Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={mockData}
        loading={loading}
        rowKey="id"
        pagination={{
          total: mockData.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`
        }}
      />

      {/* 编辑弹窗 */}
      <Modal
        title="编辑信息"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={currentRecord || {}}
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
            rules={[{ required: true, message: '请输入部门' }]}
          >
            <Input placeholder="请输入部门" />
          </Form.Item>
          <Form.Item
            name="position"
            label="岗位"
            rules={[{ required: true, message: '请输入岗位' }]}
          >
            <Input placeholder="请输入岗位" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal
        title="删除确认"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
      >
        <p>确定要删除 {currentRecord?.name} 的信息吗？</p>
      </Modal>
    </div>
  )
}

export default DepartmentManage 