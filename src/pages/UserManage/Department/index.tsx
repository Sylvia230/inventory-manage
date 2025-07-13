import React, {useEffect, useState} from 'react'
import {Table, Space, Button, Input, Tag, Modal, Form, message, Select} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined } from '@ant-design/icons'
import styles from './index.module.css'
import {DeptData,getDeptList,saveDept,deleteDept,getStaffList } from '@/services/dept'


const DepartmentManage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [loadingStaff, setLoadingStaff] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<DeptData | null>(null)
  const [form] = Form.useForm()

  const [staffList, setStaffList] = useState<Array<{value: string, name: string}>>([])
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')
  const [dataSource, setDataSource] = useState<DeptData[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  useEffect(() => {
    fetchDeptList();
    getStaff();
  }, [pagination.current, pagination.pageSize])

  // 获取部门列表
  const fetchDeptList = async (params?: any, paginationParams?: any) => {
    try {
      setLoading(true);
      const currentPagination = paginationParams || pagination;
      const searchParams = {
        ...params,
        pageNo: currentPagination.current,
        pageSize: currentPagination.pageSize,
      };
      const response:any = await getDeptList(searchParams);
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

  const handleAdd = () => {
    setModalType('add')
    setCurrentRecord(null)
    setEditModalVisible(true)
    form.resetFields()
  }

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination)
  }

  const columns: ColumnsType<DeptData> = [
    {
      title: '部门名称',
      dataIndex: 'deptName',
      key: 'deptName',
      width: 120,
    },
    {
      title: '部门负责人',
      dataIndex: 'leaderName',
      key: 'leaderName',
      width: 150,
    },
    {
      title: '负责人电话',
      dataIndex: 'leaderPhone',
      key: 'leaderPhone',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
          <Tag color={status === 1 ? 'green' : 'red'}>
            {status === 1 ? '启用' : '弃用'}
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

  const handleEdit = (record: DeptData) => {
    setCurrentRecord(record)
    setModalType('edit')
    form.setFieldsValue(record)
    setEditModalVisible(true)
  }

  const handleDelete = (record: DeptData) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除部门 ${record.deptName} 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true)
          await deleteDept(record.id)
          message.success('删除成功')
          fetchDeptList()
        } catch (error) {
          console.error('删除失败:', error)
        } finally {
          setLoading(false)
        }
      }
    })
  }

  const handleEditSubmit = async () => {
    try {
      let values = await form.validateFields()
      if (modalType === 'add') {

      } else {
        values = { ...currentRecord, ...values }
      }
      await saveDept(values)
      console.log('修改数据:', values)
      message.success('保存成功')
      setEditModalVisible(false)
      form.resetFields()
      fetchDeptList()
    } catch (error) {
      console.error('表单验证失败:', error)
      message.error('保存失败')
    }
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    fetchDeptList({ deptName: value })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Input
          placeholder="搜索名称"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Space>
          <Button type="primary" onClick={handleAdd}>新增部门</Button>
        </Space>
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

      {/* 编辑弹窗 */}
      <Modal
          title={modalType === 'add' ? '新增部门' : '编辑部门'}
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="deptName"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item
              name="leaderId"
              label="部门负责人"
              rules={[{ required: true, message: '请选择部门负责人' }]}
          >
            <Select
                loading={loadingStaff}
                placeholder="请选择部门负责人"
                options={staffList.map((item:any) => ({
                  label:item.personName,
                  value:item.id
                }))}
            />
          </Form.Item>
          <Form.Item
              name="status"
              label="状态"
              initialValue={1}
              rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select
                options={[
                  { label: '启用', value: 1 },
                  { label: '弃用', value: 0 }
                ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DepartmentManage 