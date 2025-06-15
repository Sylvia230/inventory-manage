import React, { useState } from 'react';
import { Table, Button, Form, Input, Select, Space, Row, Col, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

interface VehicleOutRecord {
  key: string;
  outStockNo: string;
  vin: string;
  orderNo: string;
  warehouse: string;
  status: string;
}

const VehicleOut: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 状态选项
  const statusOptions = [
    { label: '全部', value: 'all' },
    { label: '待出库', value: '待出库' },
    { label: '部分出库', value: '部分出库' },
    { label: '已出库', value: '已出库' },
  ];

  // 仓库选项
  const warehouseOptions = [
    { label: '上海中心仓库', value: '上海中心仓库' },
    { label: '北京分仓', value: '北京分仓' },
    { label: '广州分仓', value: '广州分仓' },
  ];

  // 表格列定义
  const columns: ColumnsType<VehicleOutRecord> = [
    {
      title: '出库单号',
      dataIndex: 'outStockNo',
      width: 150,
    },
    {
      title: '车架号',
      dataIndex: 'vin',
      width: 180,
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 150,
    },
    {
      title: '所在仓库',
      dataIndex: 'warehouse',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={
          status === '待出库' ? 'default' :
          status === '部分出库' ? 'processing' :
          status === '已出库' ? 'success' : 'default'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleViewDetail(record)}>
            出库
          </Button>
        </Space>
      ),
    },
  ];

  // 模拟数据
  const [dataSource] = useState<VehicleOutRecord[]>([
    {
      key: '1',
      outStockNo: 'OUT20240301001',
      vin: 'LVGBE40K8GP123456',
      orderNo: 'ORD20240301001',
      warehouse: '上海中心仓库',
      status: '待出库',
    },
    {
      key: '2',
      outStockNo: 'OUT20240301002',
      vin: 'LVGBE40K8GP123457',
      orderNo: 'ORD20240301002',
      warehouse: '北京分仓',
      status: '部分出库',
    },
    {
      key: '3',
      outStockNo: 'OUT20240301003',
      vin: 'LVGBE40K8GP123458',
      orderNo: 'ORD20240301003',
      warehouse: '广州分仓',
      status: '已出库',
    },
  ]);

  const handleSearch = (values: any) => {
    console.log('搜索条件:', values);
    // TODO: 实现搜索逻辑
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleViewDetail = (record: VehicleOutRecord) => {
    console.log('查看出库详情:', record);
    // TODO: 实现查看详情逻辑
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
              name="sourceNo"
              label="来源单号"
            >
              <Input placeholder="请输入来源单号" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="vin"
              label="车架号"
            >
              <Input placeholder="请输入车架号" allowClear />
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
              name="warehouse"
              label="停放仓库"
            >
              <Select
                placeholder="请选择仓库"
                options={warehouseOptions}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} style={{ width: '100%' }}>
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
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default VehicleOut; 