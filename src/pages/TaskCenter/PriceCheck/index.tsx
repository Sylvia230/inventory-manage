import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, message, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { GetTaskInfoApi } from '@/services/taskCenter';
const { Option } = Select;
interface PriceCheckItem {
  orderId: string;
  productName: string;
  createTime: number;
  guidePrice: number;
  modelName: string;
  exterior: string;
  interior: string;
  vehicleId: string;
  vin: string;
  status: 'pending' | 'processing' | 'completed';
  id: string;
  taskId: string;
}

const PriceCheck: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PriceCheckItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<PriceCheckItem | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // // 模拟数据
  // const mockData: PriceCheckItem[] = [
  //   {
  //     orderId: 'YH202505230922293374',
  //     productName: '订单宝-银行精选',
  //     createTime: 1747991317000,
  //     guidePrice: 450000,
  //     modelName: '奥迪A7L 2024款 45 TFSI quattro 黑武士版',
  //     exterior: '黑色',
  //     interior: '黑色',
  //     vehicleId: 'V001',
  //     vin: 'J4MB7E3FXY0B1C48X',
  //     status: 'pending'
  //   },
  //   {
  //     orderId: 'YH202505230919583236',
  //     productName: '订单宝-银行精选',
  //     createTime: 1747967828000,
  //     guidePrice: 380000,
  //     modelName: '奥迪A7L 2024款 45 TFSI 豪华型',
  //     exterior: '白色',
  //     interior: '棕色',
  //     vehicleId: 'V002',
  //     vin: 'P0W7HHW583SZPE1W4',
  //     status: 'processing'
  //   }
  // ];


  // 进度状态选项
  const progressStatusOptions = [
    { label: '待处理', value: 'pending' },
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
      let res = await GetTaskInfoApi({
        page: 1,
        pageSize: 20,
        type:1,
        ...values
      })
      // TODO: 调用API获取数据
      console.log('Search values:', values, res);
      setData(res || []);
      // 模拟数据
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orderNo: string) => {
    navigate(`/orderManage/detail/${orderNo}`);
  };

  const columns: ColumnsType<PriceCheckItem> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
      render: (orderNo: string) => (
        <a onClick={() => handleViewOrder(orderNo)}>{orderNo}</a>
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
      // render: (time: number) => new Date(time).toLocaleString(),
    },
    {
      title: '厂商指导价',
      dataIndex: 'guidePrice',
      key: 'guidePrice',
      width: 120,
      // render: (price: number) => `¥${price.toLocaleString()}`,
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_, record:any) => {
        const statusMap = {
          pending: { color: 'warning', text: '待处理' },
          processing: { color: '1', text: '待核价' },
          completed: { color: 'success', text: '已完成' },
        };
        // const { color, text } = statusMap[status as keyof typeof statusMap];
        return <div>{record.taskStatusDesc}</div>;
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record:any) => (
        <Space size="middle">
            {
              record.taskStatus === 1 && (
              <Button
              type="primary"
              size="small"
              onClick={() => handlePriceCheck(record)}
              disabled={record.taskStatus === 'completed'}
            >
              核价处理
            </Button>
            )}
        </Space>
      ),
    },
  ];

  const handlePriceCheck = (record: PriceCheckItem) => {
    setCurrentRecord(record);
    setIsModalVisible(true);
    form.setFieldsValue({
      orderId: record.orderId,
      modelName: record.modelName,
      guidePrice: record.guidePrice,
    });
    navigate(`/taskCenter/priceCheckDetail/${record.taskId}`);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Price check values:', values);
      // TODO: 调用API提交核价结果
      message.success('核价处理成功');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  useEffect(() => {
    // 检查URL参数中是否有订单号
    const orderNumber = searchParams.get('orderNumber');
    
    if (orderNumber) {
      // 自动填充订单号到表单
      form.setFieldsValue({ orderNumber });
      console.log('从订单页面跳转，自动填充订单号:', orderNumber);
    }
    
    // 加载数据
    setLoading(true);
    setTimeout(() => {
      handleSearch();
      setLoading(false);
    }, 1000);
  }, [searchParams]);

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div className={styles.priceCheck}>
        <Card>
        <Form
          form={form}
          layout="inline"
          className='mb-12'
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
          scroll={{ x: 1500 }}
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
        </Card>
        

      {/* <Modal
        title="车辆核价"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={currentRecord || {}}
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
            name="actualPrice"
            label="实际核价"
            rules={[{ required: true, message: '请输入实际核价' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            //   parser={(value) => Number(value?.replace(/\¥\s?|(,*)/g, ''))}
              min={0}
            />
          </Form.Item>
          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal> */}
    </div>
  );
};

export default PriceCheck; 