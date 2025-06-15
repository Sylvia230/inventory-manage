import React, { useState } from 'react';
import { Table, Button, Form, Input, Select, Space, Row, Col, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

interface VehicleInRecord {
  key: string;
  inStockNo: string;
  warehouse: string;
  expectedTime: string;
  productType: string;
  businessNo: string;
  customer: string;
  status: string;
}

const VehicleIn: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 产品类型选项
  const productTypeOptions = [
    { label: '新车', value: '新车' },
    { label: '二手车', value: '二手车' },
    { label: '试驾车', value: '试驾车' },
  ];

  // 入库状态选项
  const statusOptions = [
    { label: '待入库', value: '待入库' },
    { label: '入库中', value: '入库中' },
    { label: '已入库', value: '已入库' },
    { label: '入库失败', value: '入库失败' },
  ];

  // 表格列定义
  const columns: ColumnsType<VehicleInRecord> = [
    {
      title: '入库单号',
      dataIndex: 'inStockNo',
      width: 150,
    },
    {
      title: '停放仓库',
      dataIndex: 'warehouse',
      width: 150,
    },
    {
      title: '预计到库时间',
      dataIndex: 'expectedTime',
      width: 150,
    },
    {
      title: '产品类型',
      dataIndex: 'productType',
      width: 120,
      render: (type: string) => (
        <Tag color={type === '新车' ? 'blue' : type === '二手车' ? 'green' : 'orange'}>
          {type}
        </Tag>
      ),
    },
    {
      title: '业务单号',
      dataIndex: 'businessNo',
      width: 150,
    },
    {
      title: '客户名称',
      dataIndex: 'customer',
      width: 120,
    },
    {
      title: '入库状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={
          status === '待入库' ? 'default' :
          status === '入库中' ? 'processing' :
          status === '已入库' ? 'success' : 'error'
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
            查看
          </Button>
        </Space>
      ),
    },
  ];

  // 模拟数据
  const [dataSource] = useState<VehicleInRecord[]>([
    {
      key: '1',
      inStockNo: 'IN20240301001',
      warehouse: '上海中心仓库',
      expectedTime: '2024-03-01 14:00',
      productType: '新车',
      businessNo: 'BUS20240301001',
      customer: '张三',
      status: '待入库',
    },
    {
      key: '2',
      inStockNo: 'IN20240301002',
      warehouse: '北京分仓',
      expectedTime: '2024-03-02 10:00',
      productType: '二手车',
      businessNo: 'BUS20240301002',
      customer: '李四',
      status: '入库中',
    },
  ]);

  const handleSearch = (values: any) => {
    console.log('搜索条件:', values);
    // TODO: 实现搜索逻辑
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleViewDetail = (record: VehicleInRecord) => {
    console.log('查看入库详情:', record);
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
          <Col span={8}>
            <Form.Item
              name="inStockNo"
              label="入库单号"
            >
              <Input placeholder="请输入入库单号" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="vin"
              label="车架号"
            >
              <Input placeholder="请输入车架号" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="productType"
              label="产品类型"
            >
              <Select
                placeholder="请选择产品类型"
                allowClear
                options={productTypeOptions}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ width: '100%' }}>
          <Col span={24}>
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

export default VehicleIn; 