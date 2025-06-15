import React, { useState } from 'react';
import { Table, Button, Form, Input, Select, Space, Card, Row, Col, Tag, Modal, Cascader, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';

interface WarehouseRecord {
  key: string;
  name: string;
  address: string;
  type: string;
  status: string;
  serviceProvider: string;
  totalSpaces: number;
  location: string;
  isBankApproved: boolean;
  currentVehicles: number;
}

const WarehouseList: React.FC = () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  // 仓库类型选项
  const warehouseTypeOptions = [
    { label: '枢纽仓', value: '枢纽仓' },
    { label: '城市仓', value: '城市仓' },
    { label: '前置仓', value: '前置仓' },
  ];

  // 仓库状态选项
  const warehouseStatusOptions = [
    { label: '正常', value: '正常' },
    { label: '休眠', value: '休眠' },
    { label: '关闭', value: '关闭' },
  ];

  // 省市区数据
  const areaOptions = [
    {
      value: 'zhejiang',
      label: '浙江省',
      children: [
        {
          value: 'hangzhou',
          label: '杭州市',
          children: [
            {
              value: 'xihu',
              label: '西湖区',
            },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      label: '江苏省',
      children: [
        {
          value: 'nanjing',
          label: '南京市',
          children: [
            {
              value: 'zhonghuamen',
              label: '中华门',
            },
          ],
        },
      ],
    },
  ];

  // 表格列定义
  const columns: ColumnsType<WarehouseRecord> = [
    {
      title: '仓库名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '仓库地址',
      dataIndex: 'address',
      width: 200,
    },
    {
      title: '仓库类型',
      dataIndex: 'type',
      width: 120,
      render: (type: string) => (
        <Tag color={type === '自营仓库' ? 'blue' : type === '合作仓库' ? 'green' : 'orange'}>
          {type}
        </Tag>
      ),
    },
    {
      title: '仓库状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === '正常' ? 'success' : status === '维护中' ? 'warning' : 'error'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '仓库服务商',
      dataIndex: 'serviceProvider',
      width: 150,
    },
    {
      title: '总车位数',
      dataIndex: 'totalSpaces',
      width: 100,
    },
    {
      title: '经纬度',
      dataIndex: 'location',
      width: 150,
    },
    {
      title: '是否银行准入',
      dataIndex: 'isBankApproved',
      width: 120,
      render: (isApproved: boolean) => (
        <Tag color={isApproved ? 'success' : 'error'}>
          {isApproved ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '在库车辆数',
      dataIndex: 'currentVehicles',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleViewDetail(record)}>
            查看
          </Button>
        </Space>
      ),
    },
  ];

  // 模拟数据
  const [dataSource] = useState<WarehouseRecord[]>([
    {
      key: '1',
      name: '上海中心仓库',
      address: '上海市浦东新区张江高科技园区',
      type: '自营仓库',
      status: '正常',
      serviceProvider: '上海仓储服务有限公司',
      totalSpaces: 500,
      location: '121.4737, 31.2304',
      isBankApproved: true,
      currentVehicles: 320,
    },
    {
      key: '2',
      name: '北京分仓',
      address: '北京市海淀区中关村科技园',
      type: '合作仓库',
      status: '维护中',
      serviceProvider: '北京物流有限公司',
      totalSpaces: 300,
      location: '116.4074, 39.9042',
      isBankApproved: false,
      currentVehicles: 150,
    },
  ]);

  const handleSearch = (values: any) => {
    console.log('搜索条件:', values);
    // TODO: 实现搜索逻辑
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleEdit = (record: WarehouseRecord) => {
    console.log('编辑仓库:', record);
    // TODO: 实现编辑逻辑
  };

  const handleViewDetail = (record: WarehouseRecord) => {
    console.log('查看仓库详情:', record);
    // TODO: 实现查看详情逻辑
  };

  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleAddCancel = () => {
    setAddModalVisible(false);
    addForm.resetFields();
  };

  const handleAddSubmit = async () => {
    try {
      const values = await addForm.validateFields();
      console.log('新增仓库:', values);
      // TODO: 调用新增接口
      message.success('新增仓库成功');
      setAddModalVisible(false);
      addForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.header}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增仓库
        </Button>
      </div> */}

      <Form
        form={form}
        onFinish={handleSearch}
        layout="inline"
      >
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={8}>
            <Form.Item
              name="name"
              label="仓库名称"
            >
              <Input placeholder="请输入仓库名称" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="type"
              label="仓库类型"
            >
              <Select
                placeholder="请选择仓库类型"
                allowClear
                options={warehouseTypeOptions}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="status"
              label="仓库状态"
            >
              <Select
                placeholder="请选择仓库状态"
                allowClear
                options={warehouseStatusOptions}
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
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增仓库
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
        scroll={{ x: 1500 }}
      />

      <Modal
        title="新增仓库"
        open={addModalVisible}
        onOk={handleAddSubmit}
        onCancel={handleAddCancel}
        width={600}
        okText="确认"
        cancelText="取消"
      >
        <Form
          form={addForm}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="仓库名称"
            rules={[{ required: true, message: '请输入仓库名称' }]}
          >
            <Input placeholder="请输入仓库名称" />
          </Form.Item>

          <Form.Item
            name="area"
            label="仓库地址"
            rules={[{ required: true, message: '请选择仓库地址' }]}
          >
            <Cascader
              options={areaOptions}
              placeholder="请选择省/市/区"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="详细地址"
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <Input.TextArea
              placeholder="请输入详细地址"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="仓库类型"
            rules={[{ required: true, message: '请选择仓库类型' }]}
          >
            <Select
              placeholder="请选择仓库类型"
              options={warehouseTypeOptions}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="仓库状态"
            rules={[{ required: true, message: '请选择仓库状态' }]}
            initialValue="正常"
          >
            <Select
              placeholder="请选择仓库状态"
              options={warehouseStatusOptions}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WarehouseList; 