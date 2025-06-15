import React, { useState } from 'react';
import { Table, Button, Form, Input, Select, Space, Row, Col, DatePicker, Tag, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined, AuditOutlined, DollarOutlined, EyeOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface SettlementRecord {
  key: string;
  settlementId: string;
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
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<SettlementRecord | null>(null);

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
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '结算单号',
      dataIndex: 'settlementId',
      key: 'settlementId',
      width: 180,
    },
    {
      title: '结算类型',
      dataIndex: 'settlementType',
      key: 'settlementType',
      width: 120,
      render: (text) => {
        const option = settlementTypeOptions.find(opt => opt.value === text);
        return option ? option.label : text;
      },
    },
    {
      title: '车架号',
      dataIndex: 'vin',
      key: 'vin',
      width: 180,
    },
    {
      title: '合作方',
      dataIndex: 'partner',
      key: 'partner',
      width: 150,
    },
    {
      title: '结算方',
      dataIndex: 'settlementParty',
      key: 'settlementParty',
      width: 150,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (text) => `¥${text.toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        const option = statusOptions.find(opt => opt.value === text);
        const colorMap: Record<string, string> = {
          pending: 'orange',
          processing: 'blue',
          approved: 'green',
          rejected: 'red',
        };
        return option ? (
          <Tag color={colorMap[text]}>{option.label}</Tag>
        ) : text;
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<AuditOutlined />}
            onClick={() => handleAudit(record)}
            disabled={record.status === 'approved' || record.status === 'rejected'}
          >
            审核
          </Button>
          <Button 
            type="link" 
            icon={<DollarOutlined />}
            onClick={() => handlePriceAdjust(record)}
            disabled={record.status === 'approved' || record.status === 'rejected'}
          >
            调价
          </Button>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  // 模拟数据
  const dataSource: SettlementRecord[] = [
    {
      key: '1',
      settlementId: 'JS202403150001',
      settlementType: 'purchase',
      vin: 'LSVAM4187C2184841',
      partner: '上海汽车贸易有限公司',
      settlementParty: '上海汽车金融有限公司',
      amount: 150000.00,
      status: 'pending',
      createTime: '2024-03-15 10:00:00',
    },
    {
      key: '2',
      settlementId: 'JS202403150002',
      settlementType: 'sale',
      vin: 'LSVAM4187C2184842',
      partner: '北京汽车贸易有限公司',
      settlementParty: '北京汽车金融有限公司',
      amount: 200000.00,
      status: 'approved',
      createTime: '2024-03-15 11:00:00',
    },
  ];

  // 审核
  const handleAudit = (record: SettlementRecord) => {
    setCurrentRecord(record);
    setAuditModalVisible(true);
  };

  // 调价
  const handlePriceAdjust = (record: SettlementRecord) => {
    setCurrentRecord(record);
    setPriceModalVisible(true);
  };

  // 查看
  const handleView = (record: SettlementRecord) => {
    console.log('查看详情:', record);
  };

  // 搜索
  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      console.log('搜索条件:', values);
      setLoading(true);
      // TODO: 实现搜索逻辑
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
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
              name="settlementId"
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
          total: dataSource.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        scroll={{ x: 1500 }}
      />

      {/* 审核弹窗 */}
      <Modal
        title="结算单审核"
        open={auditModalVisible}
        onOk={() => {
          message.success('审核成功');
          setAuditModalVisible(false);
        }}
        onCancel={() => setAuditModalVisible(false)}
        width={600}
      >
        <p>确定要审核该结算单吗？</p>
        {currentRecord && (
          <p style={{ color: '#666', fontSize: '14px' }}>
            结算单号：{currentRecord.settlementId}
          </p>
        )}
      </Modal>

      {/* 调价弹窗 */}
      <Modal
        title="结算单调价"
        open={priceModalVisible}
        onOk={() => {
          message.success('调价成功');
          setPriceModalVisible(false);
        }}
        onCancel={() => setPriceModalVisible(false)}
        width={600}
      >
        <p>确定要调整该结算单价格吗？</p>
        {currentRecord && (
          <p style={{ color: '#666', fontSize: '14px' }}>
            结算单号：{currentRecord.settlementId}
          </p>
        )}
      </Modal>
    </div>
  );
};

export default Settlement;