import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Space, Row, Col, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { getWaybillList, type WaybillRecord, type WaybillQueryParams } from '@/services/waybill';
import dayjs, { Dayjs } from 'dayjs';

const WaybillList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<WaybillRecord[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const navigate = useNavigate();

  // 获取运单列表
  const fetchWaybillList = async (params: WaybillQueryParams = {}) => {
    try {
      // setLoading(true);
      // // 模拟API调用
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      // // 模拟数据
      // const mockData: WaybillRecord[] = [
      //   {
      //     key: '1',
      //     waybillNo: 'WB20240301001',
      //     startLocation: '上海市浦东新区',
      //     endLocation: '北京市朝阳区',
      //     driverPhone: '13800138000',
      //     estimatedArrivalTime: '2024-03-02 18:00:00',
      //     insuranceNo: 'INS20240301001',
      //     status: 'in_transit',
      //   },
      //   {
      //     key: '2',
      //     waybillNo: 'WB20240301002',
      //     startLocation: '广州市天河区',
      //     endLocation: '深圳市南山区',
      //     driverPhone: '13900139000',
      //     estimatedArrivalTime: '2024-03-02 15:00:00',
      //     insuranceNo: 'INS20240301002',
      //     status: 'pending',
      //   },
      //   {
      //     key: '3',
      //     waybillNo: 'WB20240301003',
      //     startLocation: '杭州市西湖区',
      //     endLocation: '南京市鼓楼区',
      //     driverPhone: '13700137000',
      //     estimatedArrivalTime: '2024-03-03 12:00:00',
      //     insuranceNo: 'INS20240301003',
      //     status: 'delivered',
      //   },
      // ];
      
      // setDataSource(mockData);
      // setPagination(prev => ({ ...prev, total: mockData.length }));
      
      // 实际API调用
      const response:any = await getWaybillList(params);
      setDataSource(response || []);
      setPagination(prev => ({ 
        ...prev, 
        total: response.data?.total || 0 
      }));
    } catch (error) {
      message.error('获取运单列表失败');
      console.error('获取运单列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let params = form.getFieldsValue();
    console.log('params', params);
    fetchWaybillList({
      ...params,
      page: 1,
      pageSize: pagination.pageSize,
    });
  }, []);

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap = {
      pending: { color: 'orange', text: '待发车' },
      in_transit: { color: 'blue', text: '运输中' },
      delivered: { color: 'green', text: '已送达' },
      cancelled: { color: 'red', text: '已取消' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { color: 'default', text: '未知' };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  // 表格列定义
  const columns: ColumnsType<WaybillRecord> = [
    {
      title: '运单号',
      dataIndex: 'waybillNo',
      width: 180,
    },
    {
      title: '金融订单号',
      dataIndex: 'loanOrderNo',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'statusDesc',
      width: 120,
      // render: (status: string) => getStatusTag(status),
    },
    {
      title: '起始地',
      dataIndex: 'senderProvince',
      width: 180,
      render: (_, record:any) => {
        return `${record.senderProvince} ${record.senderCity} ${record.senderAddress}`;
      },
    },
    {
      title: '目的地',
      dataIndex: 'warehouseName',
      width: 180,
    },
    {
      title: '联系人电话',
      dataIndex: 'driverPhone',
      width: 150,
    },
    {
      title: '预计到达时间',
      dataIndex: 'reachTime',
      width: 180,
      render: (_, record:any) => {
        return record.reachTime ? dayjs(record.reachTime).format('YYYY-MM-DD HH:mm:ss') : '';
      },
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
          查看详情
        </Button>
      ),
    },
  ];

  const handleSearch = (values: any) => {
    console.log('搜索条件:', values);
    const searchParams: WaybillQueryParams = {
      ...values,
      page: 1,
      pageSize: pagination.pageSize,
    };
    fetchWaybillList(searchParams);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleReset = () => {
    form.resetFields();
    fetchWaybillList();
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleViewDetail = (record: WaybillRecord) => {
    console.log('查看运单详情:', record);
    // 跳转到详情页面
    navigate(`/waybill/detail/${record.id}`);
  };

  const handleTableChange = (pagination: any) => {
    setPagination(prev => ({ ...prev, current: pagination.current, pageSize: pagination.pageSize }));
    const values = form.getFieldsValue();
    const searchParams: WaybillQueryParams = {
      ...values,
      page: pagination.current,
      pageSize: pagination.pageSize,
    };
    fetchWaybillList(searchParams);
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        onFinish={handleSearch}
        layout="inline"
        initialValues={{
          waybillNo: '',
          loanOrderNo: '',
        }}
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
            <Form.Item
              name="loanOrderNo"
              label="订单号"
            >
              <Input placeholder="订单号" allowClear />
            </Form.Item>
          </Col>
          {/* <Col span={6}>
            <Form.Item
              name="endLocation"
              label="目的地"
            >
              <Input placeholder="请输入目的地" allowClear />
            </Form.Item>
          </Col> */}
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
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default WaybillList; 