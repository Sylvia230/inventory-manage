import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, message, Select, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { GetTaskInfoApi,PreCreditApi } from '@/services/taskCenter';

const { Option } = Select;

interface PreSaleLetterItem {
  orderId: string;
  orderNo?: string;
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

// 分页参数接口
interface PaginationParams {
  current: number;
  pageSize: number;
  total: number;
}

// 查询参数接口
interface SearchParams {
  orderNumber?: string;
  dealer?: string;
  progressStatus?: string[];
  orderStatus?: string[];
  taskStatus?: string[];
}

const PreSaleLetter: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PreSaleLetterItem[]>([]);
  const [priceCheckModalVisible, setPriceCheckModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<PreSaleLetterItem | null>(null);
  const [form] = Form.useForm();
  const [priceCheckForm] = Form.useForm();
  const navigate = useNavigate();

  // 分页状态管理
  const [pagination, setPagination] = useState<PaginationParams>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 查询参数状态
  const [searchParams, setSearchParams] = useState<SearchParams>({});

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
    },
    // 添加更多模拟数据用于分页测试
    ...Array.from({ length: 20 }, (_, index) => ({
      orderId: `YH2025052309${(index + 10).toString().padStart(2, '0')}${Math.random().toString().slice(2, 8)}`,
      productName: '订单宝-银行精选',
      createTime: Date.now() - Math.random() * 86400000 * 30,
      guidePrice: Math.floor(Math.random() * 300000) + 200000,
      modelName: ['奥迪A7L 2024款', '奔驰E300L 2024款', '宝马5系 2024款'][index % 3],
      exterior: ['黑色', '白色', '银色'][index % 3],
      interior: ['黑色', '棕色', '米色'][index % 3],
      vehicleId: `V${(index + 10).toString().padStart(3, '0')}`,
      vin: `VIN${Math.random().toString().slice(2, 17).toUpperCase()}`,
      status: ['processing', 'completed'][index % 2] as 'processing' | 'completed',
      preCreditAmount: Math.floor(Math.random() * 200000) + 100000,
      actualPrice: Math.floor(Math.random() * 400000) + 200000
    }))
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

  // 获取数据的函数
  const fetchData = async (params: SearchParams, page: number = 1, pageSize: number = 10) => {
    try {
      setLoading(true);
      
      // TODO: 替换为真实的API调用
      // const response = await getPreSaleLetterList({
      //   ...params,
      //   page,
      //   pageSize,
      // });
      
      // 模拟API调用
      console.log('API调用参数:', { ...params, page, pageSize });
      const values = await form.validateFields();
      let res = await GetTaskInfoApi(
        { ...params, page, pageSize, type: 2 }
      )
      // // TODO: 调用API获取数据
      console.log('Search values:', values, res);
      setData(res || []);
      // // 模拟过滤和分页
      // let filteredData = mockData;
      
      // // 模拟搜索过滤
      // if (params.orderNumber) {
      //   filteredData = filteredData.filter(item => 
      //     item.orderId.includes(params.orderNumber!)
      //   );
      // }
      
      // if (params.progressStatus && params.progressStatus.length > 0) {
      //   filteredData = filteredData.filter(item => 
      //     params.progressStatus!.includes(item.status)
      //   );
      // }
      
      // // 模拟分页
      // const startIndex = (page - 1) * pageSize;
      // const endIndex = startIndex + pageSize;
      // const paginatedData = filteredData.slice(startIndex, endIndex);
      
      // 模拟网络延迟
      // await new Promise(resolve => setTimeout(resolve, 800));
      
      // setData(paginatedData);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize,
        total: res.length,
      }));
      
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 搜索功能
  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      console.log('搜索参数:', values);
      
      setSearchParams(values);
      await fetchData(values, 1, pagination.pageSize);
    } catch (error) {
      console.error('搜索失败:', error);
    }
  };

  // 重置功能
  const handleReset = () => {
    form.resetFields();
    setSearchParams({});
    fetchData({}, 1, pagination.pageSize);
  };

  // 分页变化处理
  const handleTableChange = (page: number, pageSize: number) => {
    fetchData(searchParams, page, pageSize);
  };

  // 页面大小变化处理
  const handlePageSizeChange = (current: number, size: number) => {
    fetchData(searchParams, current, size);
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/orderManage/detail/${orderId}`);
  };

  const handlePreCredit = async (record: any) => {
    try {
      message.loading('正在处理预授信...', 0);
      
      // 调用预授信API，传递taskId
      await PreCreditApi({
        taskId: record.taskId, // 使用record中的id或taskId字段
      });
      
      message.destroy();
      message.success('预授信处理成功');
      
      // 重新加载当前页数据
      await fetchData(searchParams, pagination.current, pagination.pageSize);
    } catch (error) {
      message.destroy();
      console.error('预授信处理失败:', error);
      message.error('预授信处理失败，请重试');
    }
  };

  const handlePriceCheck = (record: any) => {
     navigate(`/taskCenter/priceCheckDetail/${record.taskId}?type=2`);
  };

  const handlePriceCheckModalOk = async () => {
    try {
      const values = await priceCheckForm.validateFields();
      console.log('核价参数:', values);
      
      // TODO: 调用API提交核价结果
      message.success('核价处理成功');
      setPriceCheckModalVisible(false);
      priceCheckForm.resetFields();
      
      // 重新加载当前页数据
      await fetchData(searchParams, pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('核价处理失败:', error);
      message.error('核价处理失败，请重试');
    }
  };

  const handlePriceCheckModalCancel = () => {
    setPriceCheckModalVisible(false);
    priceCheckForm.resetFields();
  };

  const columns: ColumnsType<PreSaleLetterItem> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
      render: (orderNo: string, record: PreSaleLetterItem) => (
        <a onClick={() => handleViewOrder(orderNo || record.orderId)}>{orderNo || record.orderId}</a>
      ),
    },
    {
      title: '产品类型',
      dataIndex: 'bizCategorySubDesc',
      key: 'bizCategorySubDesc',
      width: 120,
    },
    {
      title: '客户名称',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: 180,
      // render: (time: number) => new Date(time).toLocaleString(),
    },
    {
      title: '合同金额',
      dataIndex: 'contractAmountStr',
      key: 'contractAmountStr',
      width: 120,
      // render: (price: number) => `¥${price.toLocaleString()}`,
    },
    {
      title: '资方名称',
      dataIndex: 'capitalName',
      key: 'capitalName',
      width: 150,
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
      width: 100,
      render: (_, record:any) => (
        <Space size="middle">
          {
            record.taskStatus === 1 && <Button
            type="primary"
            size="small"
            onClick={() => handlePreCredit(record)}
            disabled={record.status === 'processing'}
          >
            预授信
          </Button>
          }
          {
             record.taskStatus === 3 && <Button
             type="primary"
             size="small"
             onClick={() => handlePreCredit(record)}
             disabled={record.status === 'processing'}
           >
             预授信
           </Button>
          }
          
          {
            record.taskStatus === 4 &&  <Button
            type="default"
            size="small"
            onClick={() => handlePriceCheck(record)}
          >
            重新核价
          </Button>
          }
         
        </Space>
      ),
    },
  ];

  // 组件挂载时加载数据
  useEffect(() => {
    fetchData({}, 1, 10);
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
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: handleTableChange,
            onShowSizeChange: handlePageSizeChange,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
        />
      </Card>

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