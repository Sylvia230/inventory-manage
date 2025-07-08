import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Select, Space, Row, Col, DatePicker, Tag, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined, AuditOutlined, DollarOutlined, EyeOutlined } from '@ant-design/icons';
import { getSettlementList } from '@/services/finance';
import financeStore from '@/stores/finance';

const { RangePicker } = DatePicker;

interface SettlementRecord {
  key: string;
  settlementNo: string;
  settlementType: string;
  vin: string;
  partner: string;
  settlementParty: string;
  amount: number;
  status: string;
  createTime: string;
}

const Settlement: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<SettlementRecord[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const navigate = useNavigate();

  // 结算类型选项
  const settlementTypeOptions = [
    { label: '采购结算', value: 'purchase' },
    { label: '销售结算', value: 'sale' },
    { label: '服务费结算', value: 'service' },
    { label: '其他', value: 'other' },
  ];

  // 状态选项
  const statusOptions = [
    { label: '待审核', value: 'pending' },
    { label: '审核中', value: 'processing' },
    { label: '已通过', value: 'approved' },
    { label: '已拒绝', value: 'rejected' },
  ];

  // 表格列定义
  const columns: ColumnsType<SettlementRecord> = [
    
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
    },
    {
      title: '结算单号',
      dataIndex: 'settlementNo',
      key: 'settlementNo',
      width: 180,
    },
    {
      title: '金额',
      dataIndex: 'amountStr',
      key: 'amountStr',
      width: 120,
    },
    {
      title: '资金类型',
      dataIndex: 'fundTypeDesc',
      key: 'fundTypeDesc',
      width: 120,
    },
    {
      title: '产品类型',
      dataIndex: 'productTypeDesc',
      key: 'productTypeDesc',
      width: 180,
    },
    {
      title: '客户',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: 150,
    },
    {
      title: '收款方',
      dataIndex: 'receiveBankCardInfo',
      key: 'receiveBankCardInfo',
      width: 150,
      render: (_,record:any) => {
        return <div>{record.receiveBankCardInfo.accountName}</div>;
      },
    },
    
    {
      title: '状态',
      dataIndex: 'statusDesc',
      key: 'statusDesc',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record:any) => (
        <span>
          <Button 
            type="link" 
            size='small'
            icon={<AuditOutlined />}
            onClick={() => handleAudit(record)}
            disabled={record.status == 5 || record.status === 2}
          >
            审核
          </Button>
          <Button 
            type="link" 
            size='small'
            icon={<DollarOutlined />}
            onClick={() => handlePriceAdjust(record)}
            disabled={record.status === 'approved' || record.status === 'rejected'}
          >
            调价
          </Button>
          <Button 
            type="link" 
            size='small'
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
        </span>
      ),
    },
  ];

  // 初始化数据
  useEffect(() => {
    fetchData();
  }, []);

  // 获取数据
  const fetchData = async (params?: any, paginationParams?: any) => {
    try {
      setLoading(true);
      const currentPagination = paginationParams || pagination;
      const searchParams = {
        ...params,
        page: currentPagination.current,
        pageSize: currentPagination.pageSize,
      };
      
      // 调用API获取数据
      const res = await getSettlementList(searchParams);
      console.log(res, 'res');
      if (res) {
        financeStore.setSettlementList(res);
        setDataSource(res);
        setPagination(prev => ({
          ...prev,
          total: res.total || 0,
        }));
      } else {
      
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败，请稍后重试');
     
    } finally {
      setLoading(false);
    }
  };

  // 审核
  const handleAudit = (record: any) => {
    console.log('跳转到审核页面，结算单信息:', record);
    
    // 直接跳转到审核页面，页面内部会调用接口获取详情
    navigate(`/financeManage/settlement/audit/${record.id}`);
  };

  // 调价
  const handlePriceAdjust = (record: SettlementRecord) => {
    console.log('跳转到调价页面，结算单信息:', record);
    navigate(`/financeManage/settlement/detail/${record.settlementNo}?mode=adjust`);
  };

  // 查看
  const handleView = (record: SettlementRecord) => {
    console.log('查看详情:', record);
    
    // 通过 id 匹配到 store 中的完整数据
    const fullData = financeStore.getSettlementById(record.settlementNo);
    
    if (fullData) {
      // 设置当前查看的结算单数据到 store
      financeStore.setCurrentSettlement(fullData);
      console.log('从store获取到的完整数据:', fullData);
      
      // 导航到详情页面
      navigate(`/financeManage/settlement/detail/${record.settlementNo}`);
    } else {
      console.warn('未找到对应的结算单数据:', record.settlementNo);
      message.warning('未找到结算单详情数据');
    }
  };

  // 搜索
  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      console.log('搜索条件:', values);
      
      // 重置到第一页
      const newPagination = {
        current: 1,
        pageSize: pagination.pageSize,
        total: pagination.total,
      };
      
      setPagination(newPagination);
      
      // 获取数据
      await fetchData(values, newPagination);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    const newPagination = {
      current: 1,
      pageSize: pagination.pageSize,
      total: pagination.total,
    };
    setPagination(newPagination);
    fetchData(undefined, newPagination);
  };

  // 处理分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    const newPagination = {
      current: page,
      pageSize: pageSize,
      total: pagination.total,
    };
    
    setPagination(newPagination);
    
    // 获取表单数据
    const formValues = form.getFieldsValue();
    fetchData(formValues, newPagination);
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        layout="inline"
        className={styles.searchForm}
      >
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={6}>
            <Form.Item
              name="settlementNo"
              label="结算单号"
            >
              <Input placeholder="请输入结算单号" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="settlementType"
              label="结算类型"
            >
              <Select
                placeholder="请选择结算类型"
                options={settlementTypeOptions}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="status"
              label="状态"
            >
              <Select
                placeholder="请选择状态"
                options={statusOptions}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="amount"
              label="金额"
            >
              <Input placeholder="请输入金额" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={6}>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                >
                  搜索
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          onChange: handleTableChange,
          onShowSizeChange: handleTableChange,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        scroll={{ x: 1500 }}
      />
    </div>
  );
};

export default Settlement;