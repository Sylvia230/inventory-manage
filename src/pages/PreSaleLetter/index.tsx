import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, message, Select, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

interface PreSaleLetterItem {
  orderId: string;
  productName: string;
  createTime: number;
  guidePrice: number;
  modelName: string;
  exterior: string;
  interior: string;
  vehicleId: string;
  vin: string;
  status: 'processing' | 'completed';
  preCreditAmount?: number;
  actualPrice?: number;
}

const PreSaleLetter: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PreSaleLetterItem[]>([]);
  const [preCreditModalVisible, setPreCreditModalVisible] = useState(false);
  const [priceCheckModalVisible, setPriceCheckModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<PreSaleLetterItem | null>(null);
  const [form] = Form.useForm();
  const [preCreditForm] = Form.useForm();
  const [priceCheckForm] = Form.useForm();
  const navigate = useNavigate();

  // 模拟数据
  const mockData: PreSaleLetterItem[] = [
    {
      orderId: 'YH202505230922293374',
      productName: '订单宝-银行精选',
      createTime: 1747991317000,
      guidePrice: 450000,
      modelName: '奥迪A7L 2024款 45 TFSI quattro 黑武士版',
      exterior: '黑色',
      interior: '黑色',
      vehicleId: 'V001',
      vin: 'J4MB7E3FXY0B1C48X',
      status: 'processing',
      preCreditAmount: 360000,
      actualPrice: 420000
    },
    {
      orderId: 'YH202505230919583236',
      productName: '订单宝-银行精选',
      createTime: 1747967828000,
      guidePrice: 380000,
      modelName: '奥迪A7L 2024款 45 TFSI 豪华型',
      exterior: '白色',
      interior: '棕色',
      vehicleId: 'V002',
      vin: 'P0W7HHW583SZPE1W4',
      status: 'processing',
      preCreditAmount: 304000,
      actualPrice: 350000
    },
    {
      orderId: 'YH202505230915123456',
      productName: '订单宝-银行精选',
      createTime: 1747967712000,
      guidePrice: 520000,
      modelName: '奔驰E300L 2024款 豪华型',
      exterior: '银色',
      interior: '米色',
      vehicleId: 'V003',
      vin: 'WDDWF4JB0FR123456',
      status: 'completed',
      preCreditAmount: 416000,
      actualPrice: 480000
    }
  ];

  // 进度状态选项
  const progressStatusOptions = [
    // { label: '待处理', value: 'pending' },
    { label: '处理中', value: 'processing' },
    { label: '已完成', value: 'completed' },
  ];

  // 订单状态选项
  const orderStatusOptions = [
    { label: '待确认', value: 'unconfirmed' },
    { label: '已确认', value: 'confirmed' },
    { label: '已取消', value: 'cancelled' },
  ];

  // 任务状态选项
  const taskStatusOptions = [
    { label: '未开始', value: 'not_started' },
    { label: '进行中', value: 'in_progress' },
    { label: '已完成', value: 'finished' },
    { label: '已暂停', value: 'paused' },
  ];

  const handleSearch = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      // TODO: 调用API获取数据
      console.log('Search values:', values);
      // 模拟数据
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/orderManage/detail/${orderId}`);
  };

  const handlePreCredit = (record: PreSaleLetterItem) => {
    setCurrentRecord(record);
    setPreCreditModalVisible(true);
    preCreditForm.setFieldsValue({
      orderId: record.orderId,
      modelName: record.modelName,
      guidePrice: record.guidePrice,
      vin: record.vin,
      preCreditAmount: record.preCreditAmount || Math.floor(record.guidePrice * 0.8),
    });
  };

  const handlePriceCheck = (record: PreSaleLetterItem) => {
     navigate(`/taskCenter/priceCheckDetail/${record.orderId}`);
  };

  const handlePreCreditModalOk = async () => {
    try {
      const values = await preCreditForm.validateFields();
      console.log('Pre-credit values:', values);
      // TODO: 调用API提交预授信结果
      message.success('预授信处理成功');
      setPreCreditModalVisible(false);
      preCreditForm.resetFields();
      
      // 更新本地数据
      setData(prevData => 
        prevData.map(item => 
          item.orderId === currentRecord?.orderId 
            ? { ...item, preCreditAmount: values.preCreditAmount, status: 'processing' }
            : item
        )
      );
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handlePreCreditModalCancel = () => {
    setPreCreditModalVisible(false);
    preCreditForm.resetFields();
  };

  const handlePriceCheckModalOk = async () => {
    try {
      const values = await priceCheckForm.validateFields();
      console.log('Price check values:', values);
      // TODO: 调用API提交核价结果
      message.success('核价处理成功');
      setPriceCheckModalVisible(false);
      priceCheckForm.resetFields();
      
      // 更新本地数据
      setData(prevData => 
        prevData.map(item => 
          item.orderId === currentRecord?.orderId 
            ? { ...item, actualPrice: values.actualPrice, status: 'completed' }
            : item
        )
      );
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handlePriceCheckModalCancel = () => {
    setPriceCheckModalVisible(false);
    priceCheckForm.resetFields();
  };

  const handleReset = () => {
    form.resetFields();
  };

  const columns: ColumnsType<PreSaleLetterItem> = [
    {
      title: '订单号',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 180,
      render: (orderId: string) => (
        <a onClick={() => handleViewOrder(orderId)}>{orderId}</a>
      ),
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (time: number) => new Date(time).toLocaleString(),
    },
    {
      title: '厂商指导价',
      dataIndex: 'guidePrice',
      key: 'guidePrice',
      width: 120,
      render: (price: number) => `¥${price.toLocaleString()}`,
    },
    {
      title: '车型',
      dataIndex: 'modelName',
      key: 'modelName',
      width: 250,
    },
    {
      title: '外观',
      dataIndex: 'exterior',
      key: 'exterior',
      width: 100,
    },
    {
      title: '内饰',
      dataIndex: 'interior',
      key: 'interior',
      width: 100,
    },
    {
      title: '车辆ID',
      dataIndex: 'vehicleId',
      key: 'vehicleId',
      width: 100,
    },
    {
      title: '车架号',
      dataIndex: 'vin',
      key: 'vin',
      width: 180,
    },
    {
      title: '预授信金额',
      dataIndex: 'preCreditAmount',
      key: 'preCreditAmount',
      width: 120,
      render: (amount?: number) => amount ? `¥${amount.toLocaleString()}` : '-',
    },
    {
      title: '实际价格',
      dataIndex: 'actualPrice',
      key: 'actualPrice',
      width: 120,
      render: (price?: number) => price ? `¥${price.toLocaleString()}` : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          processing: { color: 'processing', text: '进行中' },
          completed: { color: 'success', text: '已完成' },
        };
        const { color, text } = statusMap[status as keyof typeof statusMap];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            onClick={() => handlePreCredit(record)}
            disabled={record.status === 'processing'}
          >
            预授信
          </Button>
          <Button
            type="default"
            size="small"
            onClick={() => handlePriceCheck(record)}
          >
            重新核价
          </Button>
        </Space>
      ),
    },
  ];

  React.useEffect(() => {
    // 模拟加载数据
    setLoading(true);
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Form
          form={form}
          layout="inline"
          style={{ marginBottom: '16px' }}
        >
          <Form.Item name="orderNumber" label="订单号">
            <Input placeholder="请输入订单号" allowClear />
          </Form.Item>
          <Form.Item name="dealer" label="经销商">
            <Input placeholder="请输入经销商" allowClear />
          </Form.Item>
          <Form.Item name="progressStatus" label="进度状态">
            <Select
              mode="multiple"
              placeholder="请选择进度状态"
              style={{ width: 200 }}
              allowClear
            >
              {progressStatusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="orderStatus" label="订单状态">
            <Select
              mode="multiple"
              placeholder="请选择订单状态"
              style={{ width: 200 }}
              allowClear
            >
              {orderStatusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="taskStatus" label="任务状态">
            <Select
              mode="multiple"
              placeholder="请选择任务状态"
              style={{ width: 200 }}
              allowClear
            >
              {taskStatusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                loading={loading}
              >
                查询
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
        
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="vehicleId"
          scroll={{ x: 1800 }}
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 预授信模态框 */}
      <Modal
        title="预授信处理"
        open={preCreditModalVisible}
        onOk={handlePreCreditModalOk}
        onCancel={handlePreCreditModalCancel}
        width={600}
      >
        <Form
          form={preCreditForm}
          layout="inline"
        >
            <Col span={24}>
                <Form.Item
                    name="orderId"
                    label="订单号"
                >
                    <Input disabled />
                </Form.Item>
            </Col>
        <Col span={24}>
          <Form.Item
            name="modelName"
            label="车型"
          >
            <Input disabled />
          </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
                name="vin"
                label="车架号"
            >
                <Input disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
          <Form.Item
            name="preCreditAmount"
            label="预授信金额"
            rules={[
              { required: true, message: '请输入预授信金额' },
              { type: 'number', min: 0, message: '预授信金额必须大于0' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            //   parser={(value) => Number(value?.replace(/\¥\s?|(,*)/g, ''))}
              min={0}
              placeholder="请输入预授信金额"
            />
          </Form.Item>
          </Col>
          
          {/* <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item> */}
        </Form>
      </Modal>

      {/* 核价模态框 */}
      <Modal
        title="核价处理"
        open={priceCheckModalVisible}
        onOk={handlePriceCheckModalOk}
        onCancel={handlePriceCheckModalCancel}
        width={600}
      >
        <Form
          form={priceCheckForm}
          layout="vertical"
        >
          <Form.Item
            name="orderId"
            label="订单号"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="modelName"
            label="车型"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="guidePrice"
            label="厂商指导价"
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => Number(value?.replace(/\¥\s?|(,*)/g, ''))}
              disabled
            />
          </Form.Item>
          <Form.Item
            name="preCreditAmount"
            label="预授信金额"
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => Number(value?.replace(/\¥\s?|(,*)/g, ''))}
              disabled
            />
          </Form.Item>
          <Form.Item
            name="actualPrice"
            label="实际核价"
            rules={[
              { required: true, message: '请输入实际核价' },
              { type: 'number', min: 0, message: '实际核价必须大于0' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            //   parser={(value) => Number(value?.replace(/\¥\s?|(,*)/g, ''))}
              min={0}
              placeholder="请输入实际核价"
            />
          </Form.Item>
          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PreSaleLetter; 