import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, Table, Space, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

interface OrderListItem {
  id: string;
  orderNumber: string;
  dealer: string;
  progressStatus: string[];
  orderStatus: string[];
  taskStatus: string[];
  createTime: string;
}

const OrderList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OrderListItem[]>([]);
  const navigate = useNavigate();

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

  const columns: ColumnsType<OrderListItem> = [
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string, record: OrderListItem) => (
        <a onClick={() => handleView(record)}>{text}</a>
      ),
    },
    {
      title: '经销商',
      dataIndex: 'dealer',
      key: 'dealer',
    },
    {
      title: '进度状态',
      dataIndex: 'progressStatus',
      key: 'progressStatus',
      render: (status: string[]) => (
        <>
          {status.map((s) => (
            <Tag key={s} color="blue">
              {progressStatusOptions.find(opt => opt.value === s)?.label}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status: string[]) => (
        <>
          {status.map((s) => (
            <Tag key={s} color="green">
              {orderStatusOptions.find(opt => opt.value === s)?.label}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '任务状态',
      dataIndex: 'taskStatus',
      key: 'taskStatus',
      render: (status: string[]) => (
        <>
          {status.map((s) => (
            <Tag key={s} color="orange">
              {taskStatusOptions.find(opt => opt.value === s)?.label}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleView(record)}>查看</a>
          <a onClick={() => handleEdit(record)}>编辑</a>
        </Space>
      ),
    },
  ];

  const handleSearch = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      // TODO: 调用API获取数据
      console.log('Search values:', values);
      // 模拟数据
      setData([
        {
          id: '1',
          orderNumber: 'ORD202403150001',
          dealer: '测试经销商1',
          progressStatus: ['pending'],
          orderStatus: ['unconfirmed'],
          taskStatus: ['not_started'],
          createTime: '2024-03-15 10:00:00',
        },
        // 可以添加更多模拟数据
      ]);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleView = (record: OrderListItem) => {
    // 跳转到订单详情页面
    navigate(`/orderManage/detail/${record.id}`);
  };

  const handleEdit = (record: OrderListItem) => {
    console.log('Edit record:', record);
    // TODO: 实现编辑功能
  };

  return (
    <div className="order-list">
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
          rowKey="id"
          loading={loading}
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
};

export default OrderList;