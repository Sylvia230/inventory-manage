import React, { useState } from 'react';
import { Table, Button, Space, Card, Row, Col, Form, Input, Select, Tag, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from '../index.module.less';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

interface PushRecord {
  id: string;
  customerName: string;
  applicationNo: string;
  productName: string;
  status: '待推送' | '已推送' | '推送失败';
  vehicleCount: number;
  depositStatus: '已缴纳' | '未缴纳' | '部分缴纳';
  batchNo: string;
  approver: string;
  investorName: string;
  batchAmount: number;
  createTime: string;
}

interface VehicleRecord {
  key: string;
  vin: string;
  specification: string;
  attributes: string;
  creditStatus: string;
  loanStatus: string;
}

const PushToInvestor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [pushModalVisible, setPushModalVisible] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<VehicleRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<PushRecord | null>(null);

  const [dataSource, setDataSource] = useState<PushRecord[]>([
    {
      id: '1',
      customerName: '客户A',
      applicationNo: 'APP202403200001',
      productName: '产品A',
      status: '待推送',
      vehicleCount: 5,
      depositStatus: '已缴纳',
      batchNo: 'BATCH202403200001',
      approver: '张三',
      investorName: '投资方A',
      batchAmount: 1000000,
      createTime: '2024-03-20 10:00:00',
    },
    {
      id: '2',
      customerName: '客户B',
      applicationNo: 'APP202403200002',
      productName: '产品B',
      status: '已推送',
      vehicleCount: 3,
      depositStatus: '部分缴纳',
      batchNo: 'BATCH202403200002',
      approver: '李四',
      investorName: '投资方B',
      batchAmount: 2000000,
      createTime: '2024-03-20 11:00:00',
    },
  ]);

  const handleSearch = async (values: any) => {
    try {
      setLoading(true);
      // TODO: 调用搜索API
      console.log('搜索条件：', values);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '待推送':
        return 'warning';
      case '已推送':
        return 'success';
      case '推送失败':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDepositStatusColor = (status: string) => {
    switch (status) {
      case '已缴纳':
        return 'success';
      case '未缴纳':
        return 'error';
      case '部分缴纳':
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns: ColumnsType<PushRecord> = [
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 120,
    },
    {
      title: '申请单号',
      dataIndex: 'applicationNo',
      key: 'applicationNo',
      width: 150,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: '车辆数量',
      dataIndex: 'vehicleCount',
      key: 'vehicleCount',
      width: 100,
    },
    {
      title: '保证金状态',
      dataIndex: 'depositStatus',
      key: 'depositStatus',
      width: 100,
      render: (status: string) => (
        <Tag color={getDepositStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: '批次编号',
      dataIndex: 'batchNo',
      key: 'batchNo',
      width: 150,
    },
    {
      title: '审批人',
      dataIndex: 'approver',
      key: 'approver',
      width: 100,
    },
    {
      title: '资方名称',
      dataIndex: 'investorName',
      key: 'investorName',
      width: 120,
    },
    {
      title: '批次金额',
      dataIndex: 'batchAmount',
      key: 'batchAmount',
      width: 120,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <span>
            <Button type="link" onClick={() => handlePush(record)}>
              推送
            </Button>
         
          {/* <Button type="link" onClick={() => handleViewDetail(record)}>
            查看
          </Button> */}
        </span>
      ),
    },
  ];

  const handlePush = (record: PushRecord) => {
    setCurrentRecord(record);
    setPushModalVisible(true);
    setSelectedVehicles([]);
  };

  const handleViewDetail = (record: PushRecord) => {
    // TODO: 实现查看详情逻辑
    console.log('查看详情:', record);
  };

  // 进度状态选项
  const progressStatusOptions = [
    { label: '待审核', value: '待审核' },
    { label: '审核中', value: '审核中' },
    { label: '已审核', value: '已审核' },
    { label: '已驳回', value: '已驳回' },
  ];

  // 订单状态选项
  const orderStatusOptions = [
    { label: '待支付', value: '待支付' },
    { label: '已支付', value: '已支付' },
    { label: '已取消', value: '已取消' },
    { label: '已完成', value: '已完成' },
  ];

  // 任务状态选项
  const taskStatusOptions = [
    { label: '待推送', value: '待推送' },
    { label: '已推送', value: '已推送' },
    { label: '推送失败', value: '推送失败' },
  ];

  // 车辆表格列定义
  const vehicleColumns: ColumnsType<VehicleRecord> = [
    {
      title: '车架号',
      dataIndex: 'vin',
      width: 180,
    },
    {
      title: '车规',
      dataIndex: 'specification',
      width: 120,
    },
    {
      title: '车辆属性',
      dataIndex: 'attributes',
      width: 120,
    },
    {
      title: '预授信状态',
      dataIndex: 'creditStatus',
      width: 120,
      render: (status: string) => (
        <span style={{ color: status === '已授信' ? '#52c41a' : '#ff4d4f' }}>
          {status}
        </span>
      ),
    },
    {
      title: '贷款申请状态',
      dataIndex: 'loanStatus',
      width: 120,
      render: (status: string) => (
        <span style={{ color: status === '已通过' ? '#52c41a' : '#ff4d4f' }}>
          {status}
        </span>
      ),
    },
  ];

  // 模拟车辆数据
  const vehicleData: VehicleRecord[] = [
    {
      key: '1',
      vin: 'LVGBE40K8GP123456',
      specification: '标准版',
      attributes: '新车',
      creditStatus: '已授信',
      loanStatus: '已通过',
    },
    {
      key: '2',
      vin: 'LVGBE40K8GP123457',
      specification: '豪华版',
      attributes: '二手车',
      creditStatus: '未授信',
      loanStatus: '审核中',
    },
    // ... 可以添加更多模拟数据
  ];

  const handlePushConfirm = () => {
    if (selectedVehicles.length === 0) {
      message.warning('请选择至少一辆车');
      return;
    }
    // TODO: 调用推送接口
    message.success('推送成功');
    setPushModalVisible(false);
  };

  const handlePushCancel = () => {
    setPushModalVisible(false);
    setSelectedVehicles([]);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: VehicleRecord[]) => {
      setSelectedVehicles(selectedRows);
    },
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
                name="orderNo"
                label="订单号"
              >
                <Input placeholder="请输入订单号" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dealer"
                label="经销商"
              >
                <Input placeholder="请输入经销商" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="progressStatus"
                label="进度状态"
              >
                <Select
                  mode="multiple"
                  placeholder="请选择进度状态"
                  allowClear
                  options={progressStatusOptions}
                  maxTagCount="responsive"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24} style={{ width: '100%' }}>
            <Col span={8}>
              <Form.Item
                name="orderStatus"
                label="订单状态"
              >
                <Select
                  mode="multiple"
                  placeholder="请选择订单状态"
                  allowClear
                  options={orderStatusOptions}
                  maxTagCount="responsive"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="taskStatus"
                label="任务状态"
              >
                <Select
                  mode="multiple"
                  placeholder="请选择任务状态"
                  allowClear
                  options={taskStatusOptions}
                  maxTagCount="responsive"
                />
              </Form.Item>
            </Col>
            <Col span={8} >
              <Space>
               <Button  icon={<SearchOutlined />} type="primary" htmlType="submit" loading={loading}>
                  查询
                </Button>
                <Button  icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
              
              </Space>
            </Col>
          </Row>
        </Form>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1500 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <Modal
        title="选择推送车辆"
        open={pushModalVisible}
        onOk={handlePushConfirm}
        onCancel={handlePushCancel}
        width={1000}
        okText="确认推送"
        cancelText="取消"
      >
        <Table
          columns={vehicleColumns}
          dataSource={vehicleData}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          pagination={false}
          scroll={{ y: 400 }}
        />
      </Modal>
    </div>
  );
};

export default PushToInvestor; 