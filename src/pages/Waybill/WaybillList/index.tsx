import React, { useState } from 'react';
import { Table, Button, Form, Input, Space, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

interface WaybillRecord {
  key: string;
  waybillNo: string;
  startLocation: string;
  endLocation: string;
  driverPhone: string;
  estimatedArrivalTime: string;
  insuranceNo: string;
}

const WaybillList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 表格列定义
  const columns: ColumnsType<WaybillRecord> = [
    {
      title: '运单号',
      dataIndex: 'waybillNo',
      width: 150,
    },
    {
      title: '起始地',
      dataIndex: 'startLocation',
      width: 150,
    },
    {
      title: '目的地',
      dataIndex: 'endLocation',
      width: 150,
    },
    {
      title: '联系人电话',
      dataIndex: 'driverPhone',
      width: 150,
    },
    {
      title: '预计到达时间',
      dataIndex: 'estimatedArrivalTime',
      width: 180,
    },
    {
      title: '保险单号',
      dataIndex: 'insuranceNo',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          详情
        </Button>
      ),
    },
  ];

  // 模拟数据
  const [dataSource] = useState<WaybillRecord[]>([
    {
      key: '1',
      waybillNo: 'WB20240301001',
      startLocation: '上海市浦东新区',
      endLocation: '北京市朝阳区',
      driverPhone: '13800138000',
      estimatedArrivalTime: '2024-03-02 18:00:00',
      insuranceNo: 'INS20240301001',
    },
    {
      key: '2',
      waybillNo: 'WB20240301002',
      startLocation: '广州市天河区',
      endLocation: '深圳市南山区',
      driverPhone: '13900139000',
      estimatedArrivalTime: '2024-03-02 15:00:00',
      insuranceNo: 'INS20240301002',
    },
    {
      key: '3',
      waybillNo: 'WB20240301003',
      startLocation: '杭州市西湖区',
      endLocation: '南京市鼓楼区',
      driverPhone: '13700137000',
      estimatedArrivalTime: '2024-03-03 12:00:00',
      insuranceNo: 'INS20240301003',
    },
  ]);

  const handleSearch = (values: any) => {
    console.log('搜索条件:', values);
    // TODO: 实现搜索逻辑
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleViewDetail = (record: WaybillRecord) => {
    console.log('查看运单详情:', record);
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
              name="waybillNo"
              label="运单号"
            >
              <Input placeholder="请输入运单号" allowClear />
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

export default WaybillList; 