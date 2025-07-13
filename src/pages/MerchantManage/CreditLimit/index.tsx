import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Space, Row, Col, Modal, message, Select, Tag, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined
} from '@ant-design/icons';
import styles from './index.module.less';
import { GetCreditLimitListApi, DeleteCreditLimitApi } from '@/services/merchant';

// 授信额度记录接口
interface CreditLimitRecord {
  id: string;
  key: string;
  merchantId: string;
  merchantName: string;
  productType: string;
  capitalId: string;
  capitalName: string;
  creditLimit: number;
  usedLimit: number;
  availableLimit: number;
  status: 'active' | 'inactive' | 'pending';
  createTime: string;
  updateTime: string;
}

const CreditLimit: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<CreditLimitRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<CreditLimitRecord | null>(null);

  // 产品类型选项
  const productTypeOptions = [
    { label: '新车', value: 'new_car' },
    { label: '二手车', value: 'used_car' },
    { label: '试驾车', value: 'test_car' },
  ];

  // 资方选项
  const capitalOptions = [
    { label: '上海银行', value: 'shanghai_bank' },
    { label: '北京金融租赁', value: 'beijing_finance' },
    { label: '广州融资租赁', value: 'guangzhou_leasing' },
  ];

  // 状态选项
  const statusOptions = [
    { label: '正常', value: 'active' },
    { label: '停用', value: 'inactive' },
    { label: '待审核', value: 'pending' },
  ];

  // 获取数据
  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = async (searchParams?: any) => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        pageSize: pageSize,
        ...searchParams
      };
      
      // 调用授信额度列表API
      const res = await GetCreditLimitListApi(params);
      console.log('授信额度列表', res);
      
      if (res?.result) {
        // 转换API返回的数据格式为页面需要的格式
        const list = (res.result || []).map((item: any) => ({
          id: item.id,
          key: item.id,
          merchantId: item.merchantId,
          merchantName: item.merchantName,
          productType: item.productType,
          capitalId: item.capitalId,
          capitalName: item.capitalName,
          creditLimit: item.creditLimit || 0,
          usedLimit: item.usedLimit || 0,
          availableLimit: item.availableLimit || 0,
          status: item.status || 'active',
          createTime: item.createTime,
          updateTime: item.updateTime,
        }));
        
        setDataSource(list);
        setTotal(res.totalCount || 0);
      } else {
        // 如果API未返回数据，使用模拟数据
        const mockData: CreditLimitRecord[] = [
          {
            id: '1',
            key: '1',
            merchantId: 'merchant_001',
            merchantName: '上海汽车销售有限公司',
            productType: 'new_car',
            capitalId: 'capital_001',
            capitalName: '上海银行',
            creditLimit: 10000000,
            usedLimit: 3500000,
            availableLimit: 6500000,
            status: 'active',
            createTime: '2024-03-15 10:00:00',
            updateTime: '2024-03-15 10:00:00',
          },
          {
            id: '2',
            key: '2',
            merchantId: 'merchant_002',
            merchantName: '北京汽车贸易集团',
            productType: 'used_car',
            capitalId: 'capital_002',
            capitalName: '北京金融租赁',
            creditLimit: 8000000,
            usedLimit: 5200000,
            availableLimit: 2800000,
            status: 'active',
            createTime: '2024-03-14 14:30:00',
            updateTime: '2024-03-14 14:30:00',
          },
          {
            id: '3',
            key: '3',
            merchantId: 'merchant_003',
            merchantName: '广州汽车服务有限公司',
            productType: 'test_car',
            capitalId: 'capital_003',
            capitalName: '广州融资租赁',
            creditLimit: 5000000,
            usedLimit: 0,
            availableLimit: 5000000,
            status: 'pending',
            createTime: '2024-03-13 09:15:00',
            updateTime: '2024-03-13 09:15:00',
          },
        ];
        
        setDataSource(mockData);
        setTotal(mockData.length);
      }
    } catch (error) {
      console.error('获取授信额度列表失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 表格列定义
  const columns: ColumnsType<CreditLimitRecord> = [
    {
      title: '商家名称',
      dataIndex: 'merchantName',
      key: 'merchantName',
      width: 200,
    },
    {
      title: '产品类型',
      dataIndex: 'productType',
      key: 'productType',
      width: 120,
      render: (text) => {
        const option = productTypeOptions.find(opt => opt.value === text);
        return option ? option.label : text;
      },
    },
    {
      title: '资方名称',
      dataIndex: 'capitalName',
      key: 'capitalName',
      width: 150,
    },
    {
      title: '授信额度',
      dataIndex: 'creditLimit',
      key: 'creditLimit',
      width: 120,
      render: (value) => `¥${(value / 10000).toFixed(2)}万`,
    },
    {
      title: '已用额度',
      dataIndex: 'usedLimit',
      key: 'usedLimit',
      width: 120,
      render: (value) => `¥${(value / 10000).toFixed(2)}万`,
    },
    {
      title: '可用额度',
      dataIndex: 'availableLimit',
      key: 'availableLimit',
      width: 120,
      render: (value) => `¥${(value / 10000).toFixed(2)}万`,
    },
    {
      title: '使用率',
      key: 'usageRate',
      width: 100,
      render: (_, record) => {
        const rate = record.creditLimit > 0 ? (record.usedLimit / record.creditLimit * 100).toFixed(1) : '0.0';
        const color = parseFloat(rate) > 80 ? 'red' : parseFloat(rate) > 60 ? 'orange' : 'green';
        return <Tag color={color}>{rate}%</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const color = status === 'active' ? 'success' : status === 'inactive' ? 'default' : 'warning';
        const text = status === 'active' ? '正常' : status === 'inactive' ? '停用' : '待审核';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button 
            size="small"
            type="link" 
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          <Button 
            size="small"
            type="link" 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small"
            danger
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetail = (record: CreditLimitRecord) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (record: CreditLimitRecord) => {
    // TODO: 实现编辑功能
    message.info('编辑功能开发中');
  };

  // 处理删除
  const handleDelete = (record: CreditLimitRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除商家"${record.merchantName}"的授信额度记录吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await DeleteCreditLimitApi({ id: record.id });
          if (res) {
            message.success('删除成功');
            fetchData();
          } else {
            message.error('删除失败');
          }
        } catch (error) {
          console.error('删除授信额度失败:', error);
          message.error('删除失败');
        }
      },
    });
  };

  // 处理搜索
  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      console.log('搜索条件:', values);
      setCurrentPage(1);
      fetchData(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理重置
  const handleReset = () => {
    form.resetFields();
    setCurrentPage(1);
    fetchData();
  };

  // 处理分页变化
  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

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
              name="merchantName"
              label="商家名称"
            >
              <Input placeholder="请输入商家名称" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="productType"
              label="产品类型"
            >
              <Select
                placeholder="请选择产品类型"
                allowClear
                options={productTypeOptions}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="capitalId"
              label="资方"
            >
              <Select
                placeholder="请选择资方"
                allowClear
                options={capitalOptions}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={8}>
            <Form.Item
              name="status"
              label="状态"
            >
              <Select
                placeholder="请选择状态"
                allowClear
                options={statusOptions}
              />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Space>
              <Button icon={<SearchOutlined />} type="primary" htmlType="submit" loading={loading}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button 
                icon={<PlusOutlined />} 
                type="primary"
                onClick={() => message.info('新增功能开发中')}
              >
                新增授信额度
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
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1500 }}
        rowKey="id"
      />

      {/* 详情弹窗 */}
      <Modal
        title="授信额度详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {currentRecord && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>商家名称：</strong>{currentRecord.merchantName}</p>
                <p><strong>产品类型：</strong>
                  {productTypeOptions.find(opt => opt.value === currentRecord.productType)?.label}
                </p>
                <p><strong>资方名称：</strong>{currentRecord.capitalName}</p>
                <p><strong>授信额度：</strong>¥{(currentRecord.creditLimit / 10000).toFixed(2)}万</p>
              </Col>
              <Col span={12}>
                <p><strong>已用额度：</strong>¥{(currentRecord.usedLimit / 10000).toFixed(2)}万</p>
                <p><strong>可用额度：</strong>¥{(currentRecord.availableLimit / 10000).toFixed(2)}万</p>
                <p><strong>使用率：</strong>
                  <Tag color={
                    (currentRecord.usedLimit / currentRecord.creditLimit * 100) > 80 ? 'red' : 
                    (currentRecord.usedLimit / currentRecord.creditLimit * 100) > 60 ? 'orange' : 'green'
                  }>
                    {(currentRecord.usedLimit / currentRecord.creditLimit * 100).toFixed(1)}%
                  </Tag>
                </p>
                <p><strong>状态：</strong>
                  <Tag color={
                    currentRecord.status === 'active' ? 'success' : 
                    currentRecord.status === 'inactive' ? 'default' : 'warning'
                  }>
                    {currentRecord.status === 'active' ? '正常' : 
                     currentRecord.status === 'inactive' ? '停用' : '待审核'}
                  </Tag>
                </p>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <p><strong>创建时间：</strong>{currentRecord.createTime}</p>
                <p><strong>更新时间：</strong>{currentRecord.updateTime}</p>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CreditLimit; 