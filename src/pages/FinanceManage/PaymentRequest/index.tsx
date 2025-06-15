import React, { useState } from 'react';
import { Table, Button, Form, Input, Select, Space, Row, Col, DatePicker, Card, Descriptions, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined, EditOutlined, CloseOutlined, BankOutlined, DollarOutlined, SettingOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface PaymentRequestRecord {
  key: string;
  requestId: string;
  paymentType: string;
  status: string;
  relatedOrder: string;
  fundType: string;
  amount: number;
  applicant: string;
  createTime: string;
  approveTime?: string;
}

const PaymentRequest: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 出款类型选项
  const paymentTypeOptions = [
    { label: '采购付款', value: 'purchase' },
    { label: '销售退款', value: 'refund' },
    { label: '费用报销', value: 'expense' },
    { label: '其他', value: 'other' },
  ];

  // 状态选项
  const statusOptions = [
    { label: '待审核', value: 'pending' },
    { label: '审核中', value: 'processing' },
    { label: '已通过', value: 'approved' },
    { label: '已拒绝', value: 'rejected' },
  ];

  // 资金类型选项
  const fundTypeOptions = [
    { label: '现金', value: 'cash' },
    { label: '银行转账', value: 'bank' },
    { label: '支付宝', value: 'alipay' },
    { label: '微信', value: 'wechat' },
  ];

  // 表格列定义
  const columns: ColumnsType<PaymentRequestRecord> = [
    {
      title: '请款单ID',
      dataIndex: 'requestId',
      key: 'requestId',
      width: 180,
    },
    {
      title: '出款类型',
      dataIndex: 'paymentType',
      key: 'paymentType',
      width: 120,
      render: (text) => {
        const option = paymentTypeOptions.find(opt => opt.value === text);
        return option ? option.label : text;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        const option = statusOptions.find(opt => opt.value === text);
        return option ? option.label : text;
      },
    },
    {
      title: '关联单号',
      dataIndex: 'relatedOrder',
      key: 'relatedOrder',
      width: 180,
    },
    {
      title: '资金类型',
      dataIndex: 'fundType',
      key: 'fundType',
      width: 120,
      render: (text) => {
        const option = fundTypeOptions.find(opt => opt.value === text);
        return option ? option.label : text;
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (text) => `¥${text.toFixed(2)}`,
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '审核时间',
      dataIndex: 'approveTime',
      key: 'approveTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleViewDetail(record)}>
            详情
          </Button>
        </Space>
      ),
    },
  ];

  // 模拟数据
  const dataSource: PaymentRequestRecord[] = [
    {
      key: '1',
      requestId: 'PR202403150001',
      paymentType: 'purchase',
      status: 'pending',
      relatedOrder: 'PO202403150001',
      fundType: 'bank',
      amount: 10000.00,
      applicant: '张三',
      createTime: '2024-03-15 10:00:00',
    },
    {
      key: '2',
      requestId: 'PR202403150002',
      paymentType: 'refund',
      status: 'approved',
      relatedOrder: 'SO202403150001',
      fundType: 'alipay',
      amount: 5000.00,
      applicant: '李四',
      createTime: '2024-03-15 11:00:00',
      approveTime: '2024-03-15 14:00:00',
    },
  ];

  // 查看详情
  const handleViewDetail = (record: PaymentRequestRecord) => {
    console.log('查看详情:', record);
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
          <Col span={6}>
            <Form.Item
              name="requestId"
              label="请款单ID"
            >
              <Input placeholder="请输入请款单ID" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="paymentType"
              label="出款类型"
            >
              <Select
                placeholder="请选择出款类型"
                options={paymentTypeOptions}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="status"
              label="状态"
            >
              <Select
                placeholder="请选择状态"
                options={statusOptions}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="relatedOrder"
              label="关联单号"
            >
              <Input placeholder="请输入关联单号" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={6}>
            <Form.Item
              name="fundType"
              label="资金类型"
            >
              <Select
                placeholder="请选择资金类型"
                options={fundTypeOptions}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
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

      <Card className={styles.receiptCard}>
        <div className={styles.receiptHeader}>
          <Space size="large">
            <div>
              <Text type="secondary">请款单ID：</Text>
              <Text strong>5555</Text>
            </div>
            <div>
              <Text type="secondary">关联单号：</Text>
              <Text strong>YH20250613</Text>
            </div>
            <div>
              <Text type="secondary">请款单状态：</Text>
              <Tag color="red">未处理</Tag>
            </div>
          </Space>
          <Space className='ml-12'>
            {/* <Button type="primary" icon={<EditOutlined />}>编辑</Button> */}
            <Button icon={<CloseOutlined />}>关闭</Button>
            {/* <Button type="primary" icon={<BankOutlined />}>去汇金付款</Button> */}
            <Button type="primary" icon={<DollarOutlined />}>上传凭证</Button>
            {/* <Button type="primary" icon={<SettingOutlined />}>分配出款明细</Button> */}
          </Space>
        </div>

        <Row gutter={24} className={styles.receiptContent}>
          <Col span={6} style={{padding: '0px'}}>
            <Card size="small"  className={styles.infoCard}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="出款单位">上海信息技术有限公司</Descriptions.Item>
                <Descriptions.Item label="出款账户">03004999999</Descriptions.Item>
                <Descriptions.Item label="出款金额">270,000</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={6} style={{padding: '0px'}}>
            <Card size="small" title="" className={styles.infoCard}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="收款单位">
                  上海科技有限公司
                  <Tag color="red" style={{ marginLeft: 8 }}>共3条</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="收款账户">123456789123456</Descriptions.Item>
                <Descriptions.Item label="收款支行">招商银行股份有限公司杭州海创园小微企业专营支行</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={4} style={{padding: '0px'}}>
            <Card size="small"  className={styles.infoCard}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="产品类型">订单宝-银行精选-上海银行-过票</Descriptions.Item>
                <Descriptions.Item label="资金类型">出款</Descriptions.Item>
                <Descriptions.Item label="付款渠道">汇金</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={4} style={{padding: '0px'}}>
            <Card size="small" className={styles.infoCard}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="提交时间">2024-10-31 15:24:03</Descriptions.Item>
                <Descriptions.Item label="成功时间">-</Descriptions.Item>
                <Descriptions.Item label="备注">-</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={4} style={{padding: '0px'}}>
            <Card size="small" className={styles.infoCard}>
              <div className={styles.paymentDetail}>
                <Text>资方本金：</Text>
                <Text strong>270,000元</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PaymentRequest; 