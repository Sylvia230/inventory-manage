import React, { useState } from 'react';
import { Table, Button, Space, Card, Row, Col, Form, Input, Select, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from '../index.module.less';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { GetTaskInfoApi, PushToInvestorApi } from '@/services/taskCenter';

interface PushRecord {
  id: string;
  customerName: string;
  applicationNo: string;
  productName: string;
  status: '待推送' | '已推送';
  vehicleCount: number;
  depositStatus: '已缴纳' | '未缴纳' | '部分缴纳';
  batchNo: string;
  approver: string;
  investorName: string;
  batchAmount: number;
  createTime: string;
}



const PushToInvestor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();


  const [dataSource, setDataSource] = useState<PushRecord[]>([]);

  const handleSearch = async (values: any) => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      let res = await GetTaskInfoApi({
        page: 1,
        pageSize: 20,
        type:3,
        ...values
      })
      // TODO: 调用API获取数据
      console.log('Search values:', values, res);
      setDataSource(res || []);
      // 模拟数据
    } catch (error) {
      console.error('Search error:', error);
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
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: 120,
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 150,
    },
    {
      title: '产品类型',
      dataIndex: 'bizCategorySubDesc',
      key: 'bizCategorySubDesc',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'taskStatusDesc',
      key: 'taskStatusDesc',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    // {
    //   title: '车辆数量',
    //   dataIndex: 'vehicleCount',
    //   key: 'vehicleCount',
    //   width: 100,
    // },
    // {
    //   title: '保证金状态',
    //   dataIndex: 'depositStatus',
    //   key: 'depositStatus',
    //   width: 100,
    //   render: (status: string) => (
    //     <Tag color={getDepositStatusColor(status)}>{status}</Tag>
    //   ),
    // },
    // {
    //   title: '批次编号',
    //   dataIndex: 'batchNo',
    //   key: 'batchNo',
    //   width: 150,
    // },
    // {
    //   title: '审批人',
    //   dataIndex: 'approver',
    //   key: 'approver',
    //   width: 100,
    // },
    {
      title: '资方名称',
      dataIndex: 'capitalName',
      key: 'capitalName',
      width: 120,
    },
    {
      title: '合同金额',
      dataIndex: 'contractAmountStr',
      key: 'contractAmountStr',
      width: 120,
      // render: (price: number) => `¥${price.toLocaleString()}`,
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createTime',
    //   key: 'createTime',
    //   width: 160,
    // },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <span>
            <Button 
              type="link" 
              onClick={() => handlePush(record)}
              disabled={record.status === '已推送'}
            >
              推送
            </Button>
        </span>
      ),
    },
  ];

  const handlePush = async (record: any) => {
    // 检查记录是否已推送
    if (record.status === '已推送') {
      message.warning('该记录已经推送，无需重复推送');
      return;
    }
    
    try {
      message.loading('正在推送...', 0);
      
      // 直接调用推送接口
      await PushToInvestorApi(record.taskId);
      
      message.destroy();
      message.success('推送成功');
      
      // 更新表格数据中的状态
      setDataSource(prevData => 
        prevData.map(item => 
          item.id === record.id 
            ? { ...item, status: '已推送' as const }
            : item
        )
      );
      
    } catch (error) {
      console.error('推送失败:', error);
      message.destroy();
      message.error('推送失败，请重试');
    }
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
  ];





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


    </div>
  );
};

export default PushToInvestor; 