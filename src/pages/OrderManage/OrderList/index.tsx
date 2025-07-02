import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Table, Space, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { orderListData } from '../index.ts';
import OrderTable from './orderTable.tsx';
import { GetOrderListApi } from '@/services/order.ts'

const { Option } = Select;

interface OrderListItem {
  applicationId: string;
  orderId: string | null;
  applyDate: number;
  taskCode: string[];
  taskCodeDesc: string[];
  orderStatusDesc: string;
  applicationStatus: number;
  applicationStatusDesc: string;
  dealName: string;
  providerName: string;
  contractAmount: number;
  contractAmountCNY: string;
  carDetail: Array<{
    modelName: string;
    uniqueNum: number;
    carUniqueList: string[];
  }>;
  totalCar: number;
}

const OrderList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
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

  const handleSearch = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      // TODO: 调用API获取数据
      let res = await GetOrderListApi({
          "pageNo": 1,
          "pageSize": 20,
      })
      console.log('Search values:', values, res);
      // 模拟数据
      setData(res.result || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div className="order-list">
      <Card>
        <Form
          form={form}
          layout="inline"
        >
          <Form.Item name="orderNumber" label="订单号" style={{marginBottom: '12px'}}>
            <Input placeholder="请输入订单号" allowClear />
          </Form.Item>
          <Form.Item name="dealer" label="经销商" style={{marginBottom: '12px'}}>
            <Input placeholder="请输入经销商" allowClear />
          </Form.Item>
          <Form.Item name="progressStatus" label="进度状态" style={{marginBottom: '12px'}}>
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
          <Form.Item name="orderStatus" label="订单状态" style={{marginBottom: '12px'}}>
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
          <Form.Item name="taskStatus" label="任务状态" style={{marginBottom: '12px'}}>
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
          <Form.Item style={{marginBottom: '12px'}}>
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
        <OrderTable orderData={data} />
      </Card>
    </div>
  );
};

export default OrderList;