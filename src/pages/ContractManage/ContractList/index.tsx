import React, { useState } from 'react';
import { Table, Button, Form, Input, Space, Row, Col, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';

interface ContractRecord {
  key: string;
  orderId: string;
  customerName: string;
  contractName: string;
  contractNo: string;
  status: string;
  type: string;
}

const ContractList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 合同状态选项
  const statusOptions = [
    { label: '待签署', value: 'pending', color: 'orange' },
    { label: '已签署', value: 'signed', color: 'green' },
    { label: '已作废', value: 'void', color: 'red' },
    { label: '已过期', value: 'expired', color: 'gray' },
  ];

  // 合同类型选项
  const typeOptions = [
    { label: '购车合同', value: 'purchase' },
    { label: '租赁合同', value: 'lease' },
    { label: '服务合同', value: 'service' },
    { label: '其他', value: 'other' },
  ];

  // 表格列定义
  const columns: ColumnsType<ContractRecord> = [
    {
      title: '订单号',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 180,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      key: 'contractName',
      width: 200,
    },
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      key: 'contractNo',
      width: 180,
    },
    {
      title: '合同状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        const option = statusOptions.find(opt => opt.value === text);
        return option ? (
          <Tag color={option.color}>{option.label}</Tag>
        ) : text;
      },
    },
    {
      title: '合同类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (text) => {
        const option = typeOptions.find(opt => opt.value === text);
        return option ? option.label : text;
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  // 模拟数据
  const dataSource: ContractRecord[] = [
    {
      key: '1',
      orderId: 'DD202403150001',
      customerName: '张三',
      contractName: '车辆购买合同',
      contractNo: 'HT202403150001',
      status: 'pending',
      type: 'purchase',
    },
    {
      key: '2',
      orderId: 'DD202403150002',
      customerName: '李四',
      contractName: '车辆租赁合同',
      contractNo: 'HT202403150002',
      status: 'signed',
      type: 'lease',
    },
  ];

  // 查看
  const handleView = (record: ContractRecord) => {
    console.log('查看合同:', record);
  };

  // 搜索
  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      console.log('搜索条件:', values);
      setLoading(true);
      // TODO: 实现搜索逻辑
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        layout="inline"
        className={styles.searchForm}
      >
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={8}>
            <Form.Item
              name="orderId"
              label="订单号"
            >
              <Input placeholder="请输入订单号" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="customerName"
              label="客户名称"
            >
              <Input placeholder="请输入客户名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                >
                  搜索
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          total: dataSource.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default ContractList; 