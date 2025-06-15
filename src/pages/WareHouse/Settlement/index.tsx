import React, { useState } from 'react';
import { Table, Button, Form, Input, Select, Space, Row, Col, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

interface SettlementRecord {
  key: string;
  settlementNo: string;
  customer: string;
  vehicleCount: number;
  totalAmount: number;
  adjustedAmount: number;
  actualAmount: number;
  status: string;
  createTime: string;
}

const Settlement: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 状态选项
  const statusOptions = [
    { label: '全部', value: 'all' },
    { label: '待结算', value: '待结算' },
    { label: '已结算', value: '已结算' },
    { label: '已关闭', value: '已关闭' },
  ];

  // 表格列定义
  const columns: ColumnsType<SettlementRecord> = [
    {
      title: '结算单号',
      dataIndex: 'settlementNo',
      width: 150,
    },
    {
      title: '客户',
      dataIndex: 'customer',
      width: 150,
    },
    {
      title: '车辆台数',
      dataIndex: 'vehicleCount',
      width: 100,
    },
    {
      title: '应收总计',
      dataIndex: 'totalAmount',
      width: 120,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '调价',
      dataIndex: 'adjustedAmount',
      width: 120,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '实收总计',
      dataIndex: 'actualAmount',
      width: 120,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={
          status === '待结算' ? 'processing' :
          status === '已结算' ? 'success' :
          status === '已关闭' ? 'default' : 'default'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <span>         
            <Button type="link" onClick={() => handleAdjustPrice(record)}>
              调价
            </Button>
          <Button type="link" onClick={() => handleViewDetail(record)}>
            详情
          </Button>         
            <Button type="link" danger onClick={() => handleClose(record)}>
              关闭
            </Button>
        </span>
      ),
    },
  ];

  // 模拟数据
  const [dataSource] = useState<SettlementRecord[]>([
    {
      key: '1',
      settlementNo: 'SET20240301001',
      customer: '上海汽车贸易有限公司',
      vehicleCount: 5,
      totalAmount: 50000,
      adjustedAmount: 0,
      actualAmount: 50000,
      status: '待结算',
      createTime: '2024-03-01 10:00:00',
    },
    {
      key: '2',
      settlementNo: 'SET20240301002',
      customer: '北京汽车销售有限公司',
      vehicleCount: 3,
      totalAmount: 30000,
      adjustedAmount: -2000,
      actualAmount: 28000,
      status: '已结算',
      createTime: '2024-03-01 11:00:00',
    },
    {
      key: '3',
      settlementNo: 'SET20240301003',
      customer: '广州汽车贸易有限公司',
      vehicleCount: 2,
      totalAmount: 20000,
      adjustedAmount: 0,
      actualAmount: 20000,
      status: '已关闭',
      createTime: '2024-03-01 12:00:00',
    },
  ]);

  const handleSearch = (values: any) => {
    console.log('搜索条件:', values);
    // TODO: 实现搜索逻辑
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleViewDetail = (record: SettlementRecord) => {
    console.log('查看结算单详情:', record);
    // TODO: 实现查看详情逻辑
  };

  const handleAdjustPrice = (record: SettlementRecord) => {
    console.log('调价:', record);
    // TODO: 实现调价逻辑
  };

  const handleClose = (record: SettlementRecord) => {
    console.log('关闭结算单:', record);
    // TODO: 实现关闭逻辑
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        onFinish={handleSearch}
        layout="inline"
      >
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={6}>
            <Form.Item
              name="settlementNo"
              label="结算单号"
            >
              <Input placeholder="请输入结算单号" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="customer"
              label="客户"
            >
              <Input placeholder="请输入客户名称" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="status"
              label="状态"
              initialValue="all"
            >
              <Select
                placeholder="请选择状态"
                options={statusOptions}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Space>
              <Button icon={<SearchOutlined />} type="primary" htmlType="submit" loading={loading}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
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

export default Settlement; 