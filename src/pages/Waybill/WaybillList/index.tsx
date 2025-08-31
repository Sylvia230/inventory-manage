import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Space, Row, Col, Tag, message, Modal, DatePicker, Dropdown } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined, CheckCircleOutlined, CarOutlined, MoreOutlined } from '@ant-design/icons';
import { 
  getWaybillList, 
  completePickupApi,
  vehicleArrivalApi,
  type WaybillRecord, 
  type WaybillQueryParams 
} from '@/services/waybill';
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

  // 模态框状态
  const [pickupModalVisible, setPickupModalVisible] = useState(false);
  const [arrivalModalVisible, setArrivalModalVisible] = useState(false);
  const [startTransportModalVisible, setStartTransportModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<WaybillRecord | null>(null);
  
  // 表单实例
  const [pickupForm] = Form.useForm();
  const [arrivalForm] = Form.useForm();
  const [startTransportForm] = Form.useForm();

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
      title: '联系人',
      dataIndex: 'pickupContactName',
      width: 150,
    },
    {
      title: '联系人电话',
      dataIndex: 'pickupContactPhone',
      width: 150,
    },
    // {
    //   title: '预计到达时间',
    //   dataIndex: 'reachTime',
    //   width: 180,
    //   render: (_, record:any) => {
    //     return record.reachTime ? dayjs(record.reachTime).format('YYYY-MM-DD HH:mm:ss') : '';
    //   },
    // },
    {
      title: '保险单号',
      dataIndex: 'insuranceNo',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => {
        // 根据状态显示不同的操作按钮
        const getActionItems = (): MenuProps['items'] => {
          const items: MenuProps['items'] = [
            // {
            //   key: 'detail',
            //   label: '查看详情',
            //   onClick: () => handleViewDetail(record),
            // },
          ];

          // 根据状态添加相应操作 - 使用实际的状态描述字段
          // const statusDesc = (record as any).statusDesc;
          
          // if (statusDesc === '待发车' || record.status === 'pending') {
            items.push({
              key: 'pickup',
              label: '完成提车',
              icon: <CheckCircleOutlined />,
              onClick: () => handleCompletePickup(record),
            });
          // }

          // if (statusDesc === '已提车' || statusDesc === '运输中' || record.status === 'in_transit') {
            items.push({
              key: 'transport',
              label: '开始运输',
              icon: <CheckCircleOutlined />,
              onClick: () => handleStartTransport(record),
            });
          // }

          // if (statusDesc === '运输中' || record.status === 'in_transit') {
            items.push({
              key: 'arrival',
              label: '车辆到达',
              icon: <CarOutlined />,
              onClick: () => handleVehicleArrival(record),
            });
          // }

          return items;
        };

        return (
          <Space>
            <Button type="link" size='small' onClick={() => handleViewDetail(record)}>
              查看详情
            </Button>
            <Dropdown
              menu={{ items: getActionItems() }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button type="link" size='small' icon={<MoreOutlined />}>
                更多操作
              </Button>
            </Dropdown>
          </Space>
        );
      },
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

  // 完成提车
  const handleCompletePickup = (record: WaybillRecord) => {
    setCurrentRecord(record);
    setPickupModalVisible(true);
  };

  // 开始运输
  const handleStartTransport = (record: WaybillRecord) => {
    setCurrentRecord(record);
    setStartTransportModalVisible(true);
  };

  // 车辆到达
  const handleVehicleArrival = (record: WaybillRecord) => {
    setCurrentRecord(record);
    setArrivalModalVisible(true);
  };

  // 提车完成提交
  const handlePickupSubmit = async () => {
    try {
      const values = await pickupForm.validateFields();
      
      message.loading('正在处理提车完成操作...', 0);
      
      await completePickupApi({
        waybillNo: currentRecord?.waybillNo,
        time: values.pickupCompletedTime.format('YYYY-MM-DD HH:mm:ss'),
      });
      
      message.destroy();
      message.success('提车完成操作成功');
      
      setPickupModalVisible(false);
      setCurrentRecord(null);
      pickupForm.resetFields();
      
      // 刷新列表
      const values2 = form.getFieldsValue();
      fetchWaybillList({
        ...values2,
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      
    } catch (error: any) {
      message.destroy();
      if (error?.errorFields) {
        message.error('请填写完整信息');
      } else {
        message.error('提车完成操作失败');
        console.error('提车完成操作失败:', error);
      }
    }
  };

  // 开始运输提交
  const handleStartTransportSubmit = async () => {
    try {
      const values = await startTransportForm.validateFields();
      
      message.loading('正在处理开始运输操作...', 0);
      
      await vehicleArrivalApi({
        waybillNo: currentRecord?.waybillNo,
        time: values.startTime.format('YYYY-MM-DD HH:mm:ss')
      });
      
      message.destroy();
      message.success('开始运输操作成功');
      
      setStartTransportModalVisible(false);
      setCurrentRecord(null);
      startTransportForm.resetFields();
      
      // 刷新列表
      const values2 = form.getFieldsValue();
      fetchWaybillList({
        ...values2,
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      
    } catch (error: any) {
      message.destroy();
      if (error?.errorFields) {
        message.error('请填写完整信息');
      } else {
        message.error('开始运输操作失败');
        console.error('开始运输操作失败:', error);
      }
    }
  };

  // 车辆到达提交
  const handleArrivalSubmit = async () => {
    try {
      const values = await arrivalForm.validateFields();
      
      message.loading('正在处理车辆到达操作...', 0);
      
      await vehicleArrivalApi({
        waybillNo: currentRecord?.waybillNo,
        time: values.arrivalTime.format('YYYY-MM-DD HH:mm:ss')
      });
      
      message.destroy();
      message.success('车辆到达操作成功');
      
      setArrivalModalVisible(false);
      setCurrentRecord(null);
      arrivalForm.resetFields();
      
      // 刷新列表
      const values2 = form.getFieldsValue();
      fetchWaybillList({
        ...values2,
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      
    } catch (error: any) {
      message.destroy();
      if (error?.errorFields) {
        message.error('请填写完整信息');
      } else {
        message.error('车辆到达操作失败');
        console.error('车辆到达操作失败:', error);
      }
    }
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

      {/* 完成提车模态框 */}
      <Modal
        title="完成提车"
        open={pickupModalVisible}
        onCancel={() => {
          setPickupModalVisible(false);
          setCurrentRecord(null);
          pickupForm.resetFields();
        }}
        onOk={handlePickupSubmit}
        okText="确认完成"
        cancelText="取消"
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <p>运单号：<strong>{currentRecord?.waybillNo}</strong></p>
        </div>
        
        <Form
          form={pickupForm}
          layout="inline"
          requiredMark={false}
          initialValues={{
            pickupCompletedTime: dayjs(),
          }}
        >
          <Form.Item
            name="pickupCompletedTime"
            label="提车完成时间"
            rules={[{ required: true, message: '请选择提车完成时间' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择提车完成时间"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 开始运输模态框 */}
      <Modal
        title="开始运输"
        open={startTransportModalVisible}
        onCancel={() => {
          setStartTransportModalVisible(false);
          setCurrentRecord(null);
          startTransportForm.resetFields();
        }}
        onOk={handleStartTransportSubmit}
        okText="确认开始"
        cancelText="取消"
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <p>运单号：<strong>{currentRecord?.waybillNo}</strong></p>
        </div>
        
        <Form
          form={startTransportForm}
          layout="inline"
          requiredMark={false}
          initialValues={{
            startTime: dayjs(),
          }}
        >
          <Form.Item
            name="startTime"
            label="开始运输时间"
            rules={[{ required: true, message: '请选择开始运输时间' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择开始运输时间"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 车辆到达模态框 */}
      <Modal
        title="车辆到达确认"
        open={arrivalModalVisible}
        onCancel={() => {
          setArrivalModalVisible(false);
          setCurrentRecord(null);
          arrivalForm.resetFields();
        }}
        onOk={handleArrivalSubmit}
        okText="确认到达"
        cancelText="取消"
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <p>运单号：<strong>{currentRecord?.waybillNo}</strong></p>
        </div>
        
        <Form
          form={arrivalForm}
          layout="inline"
          requiredMark={false}
          initialValues={{
            arrivalTime: dayjs(),
          }}
        >
          <Form.Item
            name="arrivalTime"
            label="车辆到达时间"
            rules={[{ required: true, message: '请选择车辆到达时间' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择车辆到达时间"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WaybillList; 