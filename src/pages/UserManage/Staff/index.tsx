import React, { useState, useEffect } from 'react'
import { Table, Tag, Space, Button, Input, Modal, Form, Select, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined } from '@ant-design/icons'
import styles from './index.module.css'
import {
  StaffData,
  getStaffUserList,
  addStaff,
  updateStaff,
  deleteStaff,
  resetStaffPassword,
  getDeptList,
  getRoleList,
  Role
} from '@/services/staff'
import ResetPasswordModal from './components/ResetPasswordModal';


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
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffData | null>(null);

  //获取部门、角色
  const [depts, setDepts] = useState<Array<{value: string, name: string}>>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [roles, setRoles] = useState<Array<{value: string, name: string}>>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // 获取部门数据
  const getDepts = async () => {
    setLoadingDepts(true);
    try {
      const res = await getDeptList();
      console.log(res, 'response');
      // API返回的数据结构应该是一个数组，包含 {id, name} 或 {value, label} 格式
      setDepts(res || []);
    } catch (error) {
      console.error('获取部门数据失败:', error);
      message.error('获取部门数据失败');
    } finally {
      setLoadingDepts(false);
    }
  };

  // 获取角色数据
  const getRoles = async (params = {"pageSize":1000}) => {
    setLoadingRoles(true);
    try {
      const res = await getRoleList(params);
      console.log(res, 'response');
      // API返回的数据结构应该是一个数组，包含 {id, name} 或 {value, label} 格式
      setRoles(res || []);
    } catch (error) {
      console.error('获取角色数据失败:', error);
      message.error('获取角色数据失败');
    } finally {
      setLoadingRoles(false);
    }
  };

  // 获取员工列表
  const fetchStaffList = async (params?: any, paginationParams?: any) => {
    try {
      setLoading(true);
      const currentPagination = paginationParams || pagination;
      const searchParams = {
        ...params,
        pageNo: currentPagination.current,
        pageSize: currentPagination.pageSize,
      };
      const response:any = await getStaffUserList(searchParams);
      setDataSource(response.result || []);
      setPagination(prev => ({
        ...prev,
        total: response.totalCount || 0
      }));
    } catch (error) {
      console.error('获取员工列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaffList();
    getDepts();
    getRoles();
  }, [pagination.current, pagination.pageSize])

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    fetchStaffList({ nameOrMobilePhone: value})
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
      content: `确定要删除员工 ${record.personName} 吗？`,
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
      message.error('新增员工失败')
    }
  }

  const columns: ColumnsType<StaffData> = [
    {
      title: '姓名',
      dataIndex: 'personName',
      key: 'personName',
      width: 120,
    },
    {
      title: '手机号',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone',
      width: 150,
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      key: 'deptName',
      width: 150,
    },
    {
      title: '角色',
      dataIndex: 'roleDTOS',
      key: 'roleDTOS',
      width: 200,
      render: (roleList: Role[] | null | undefined) => (
          <span>
          {roleList
              ? roleList.map(role => role.roleName).join(', ')
              : ''}
      </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '在职' : '离职'}
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
          <Button type="link" onClick={() => showResetModal(record)}>
            重置密码
          </Button>
        </Space>
      ),
    },
  ]

   // 打开重置密码弹窗
   const showResetModal = (record: StaffData) => {
    setCurrentStaff(record);
    setResetModalVisible(true);
  };

   // 处理重置密码
   const handleResetPassword = async (values: { password: string; confirmPassword: string }) => {
    if (!currentStaff) return;
    
    try {
      setLoading(true);
      await resetStaffPassword({
        id: currentStaff.id,
        pwd: values.password,
      });
      message.success('密码重置成功');
      setResetModalVisible(false);
    } catch (error) {
      message.error('密码重置失败，请重试');
    } finally {
      setLoading(false);
    }
  };

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
            name="personName"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="mobilePhone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]}
          >
            <Input placeholder="请输入手机号" maxLength={11} />
          </Form.Item>
          <Form.Item
              name="deptId"
              label="部门"
              rules={[{ required: false, message: '请选择部门' }]}
          >
            <Select
                loading={loadingDepts}
                placeholder="请选择部门"
                options={depts.map((item:any) => ({
                  label:item.deptName,
                  value:item.id
                }))}
            />
          </Form.Item>
          <Form.Item
              name="roleIds"
              label="角色"
              rules={[{ required: false, message: '请选择角色' }]}
          >
            <Select
                loading={loadingRoles}
                mode="multiple"
                placeholder="请选择角色"
                options={roles.map((item:any) => ({
                  label:item.roleName,
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
                { label: '在职', value: 1 },
                { label: '离职', value: 0 }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
      <ResetPasswordModal
        visible={resetModalVisible}
        onCancel={() => setResetModalVisible(false)}
        onOk={handleResetPassword}
        // loading={loading}
      />
    </div>
  )
}

export default StaffManage 