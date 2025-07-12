import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Select, Space, Row, Col, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import AddVehicleInModal from './components/AddVehicleInModal';
import ViewDetailModal from './components/ViewDetailModal';
import AuditModal from './components/AuditModal';
import { getInboundListApi, getInboundDetailApi, addInboundApi } from '@/services/wareHouse';

export interface InboundListItem {
  key: string;
  inboundId: string;
  inboundNo: string;
  warehouseName: string;
  storageTime: string;
  typeDesc: string;
  orderNo: string;
  customerName: string;
  statusDesc: string;
}

const VehicleIn: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [currentDetail, setCurrentDetail] = useState<any>(null);
  const [currentAudit, setCurrentAudit] = useState<any>(null);
  const [dataSource, setDataSource] = useState<InboundListItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 产品类型选项
  const productTypeOptions = [
    { label: '贸融入库', value: '1' },
    { label: '普通入库', value: '2' },
    { label: '试驾车', value: '试驾车' },
  ];

  // 入库状态选项
  const statusOptions = [
    { label: '待入库', value: '待入库' },
    { label: '入库中', value: '入库中' },
    { label: '已入库', value: '已入库' },
    { label: '入库失败', value: '入库失败' },
  ];

  // 表格列定义
  const columns: ColumnsType<InboundListItem> = [
    {
      title: '入库单号',
      dataIndex: 'inboundNo',
      width: 180,
    },
    {
      title: '停放仓库',
      dataIndex: 'warehouseName',
      width: 150,
    },
    {
      title: '产品类型',
      dataIndex: 'typeDesc',
      width: 120,
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 150,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 120,
    },
    {
      title: '入库状态',
      dataIndex: 'statusDesc',
      width: 100,  
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 160,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleViewDetail(record)}>
            查看
          </Button>
          {record.statusDesc === '待入库' && (
            <Button type="link" onClick={() => handleAudit(record)}>
              审核
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 模拟数据
  // const [dataSource] = useState<VehicleInRecord[]>([
  //   {
  //     key: '1',
  //     inStockNo: 'IN20240301001',
  //     warehouse: '上海中心仓库',
  //     expectedTime: '2024-03-01 14:00',
  //     productType: '新车',
  //     businessNo: 'BUS20240301001',
  //     customer: '张三',
  //     status: '待入库',
  //   },
  //   {
  //     key: '2',
  //     inStockNo: 'IN20240301002',
  //     warehouse: '北京分仓',
  //     expectedTime: '2024-03-02 10:00',
  //     productType: '二手车',
  //     businessNo: 'BUS20240301002',
  //     customer: '李四',
  //     status: '入库中',
  //   },
  // ]);

  const fetchList = async (params: any) => {
    try {
      setLoading(true);
      const res:any = await getInboundListApi(params);
      const {result,totalCount} = res;
      setDataSource(result);
      setPagination(prev => ({
        ...prev,
        total: totalCount,
      }));
    } catch (error) {
      message.error('获取入库列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList({
      pageSize: pagination.pageSize,
      current: pagination.current,
    });
  }, [pagination.current, pagination.pageSize]);

  const handleSearch = async (values: any) => {
    const params: any = {
      ...values,
      pageSize: pagination.pageSize,
      current: 1,
    };
    setPagination(prev => ({ ...prev, current: 1 }));
    await fetchList(params);
  };

  const handleReset = () => {
    form.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchList({
      pageSize: pagination.pageSize,
      current: 1,
    });
  };

  const handleTableChange = (newPagination: any) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  const handleViewDetail = async (record: any) => {
    try {
      setLoading(true);
      const res = await getInboundDetailApi({inboundId: record.id});
      console.log(res, 'res');
      if (res?.result) {
        setCurrentDetail(res.result);
        setIsDetailModalOpen(true);
      } else {
        message.error('获取入库单详情失败');
      }
    } catch (error) {
      message.error('获取入库单详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicleIn = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalCancel = () => {
    setIsAddModalOpen(false);
  };

  const handleAddModalOk = async (values: any) => {
    try {
      setLoading(true);
      // TODO: 调用API保存数据
      // await addInboundApi(values);
      message.success('新增入库成功');
      setIsAddModalOpen(false);
      
      // 重新查询列表
      await fetchList({
        pageSize: pagination.pageSize,
        current: 1, // 重置到第一页
      });
      
      // 更新分页状态
      setPagination(prev => ({
        ...prev,
        current: 1,
      }));
    } catch (error) {
      message.error('新增入库失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setCurrentDetail(null);
  };

  const handleAudit = async (record: any) => {
    try {
      setLoading(true);
      // 调用获取入库单详情的API
      const res = await getInboundDetailApi({ inboundId: record.id });
      console.log('入库单详情:', res);
      
      if (res?.result) {
        setCurrentAudit(res.result);
        setIsAuditModalOpen(true);
      } else {
        message.error('获取入库单详情失败');
      }
    } catch (error) {
      console.error('获取入库单详情失败:', error);
      message.error('获取入库单详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAuditModalClose = () => {
    setIsAuditModalOpen(false);
    setCurrentAudit(null);
  };

  const handleAuditReject = async () => {
    try {
      // TODO: 调用拒绝入库的API
      // await rejectInboundApi(currentAudit.inboundId);
      message.success('已拒绝入库申请');
      setIsAuditModalOpen(false);
      setCurrentAudit(null);
      
      // 重新查询列表
      await fetchList({
        pageSize: pagination.pageSize,
        current: pagination.current,
      });
    } catch (error) {
      message.error('拒绝入库失败');
    }
  };

  const handleAuditApprove = async () => {
    try {
      // TODO: 调用同意入库的API
      // await approveInboundApi(currentAudit.inboundId);
      message.success('已同意入库申请');
      setIsAuditModalOpen(false);
      setCurrentAudit(null);
      
      // 重新查询列表
      await fetchList({
        pageSize: pagination.pageSize,
        current: pagination.current,
      });
    } catch (error) {
      message.error('同意入库失败');
    }
  };

  // 刷新审核数据
  const handleRefreshAuditData = async () => {
    try {
      // 重新查询列表
      await fetchList({
        pageSize: pagination.pageSize,
        current: pagination.current,
      });
    } catch (error) {
      console.error('刷新审核数据失败:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        onFinish={handleSearch}
        layout="inline"
      >
        <Row gutter={24} style={{ width: '100%', marginBottom: 16 }}>
          <Col span={8}>
            <Form.Item
              name="inStockNo"
              label="入库单号"
            >
              <Input placeholder="请输入入库单号" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="vin"
              label="车架号"
            >
              <Input placeholder="请输入车架号" allowClear />
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
        </Row>
        <Row style={{ width: '100%', marginBottom: 16 }}>
          <Col span={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <Button icon={<SearchOutlined />} type="primary" htmlType="submit" loading={loading}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddVehicleIn}>
              新增入库
            </Button>
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

      <AddVehicleInModal
        open={isAddModalOpen}
        onCancel={handleAddModalCancel}
        onOk={handleAddModalOk}
      />

      <ViewDetailModal
        open={isDetailModalOpen}
        onCancel={handleDetailModalClose}
        data={currentDetail}
      />

      <AuditModal
        open={isAuditModalOpen}
        onCancel={handleAuditModalClose}
        onReject={handleAuditReject}
        onApprove={handleAuditApprove}
        data={currentAudit}
        onRefresh={handleRefreshAuditData}
      />
    </div>
  );
};

export default VehicleIn; 