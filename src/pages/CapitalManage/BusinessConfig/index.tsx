import React, { useState } from 'react';
import { Table, Button, Form, Input, Space, Row, Col, Modal, message, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';

interface BusinessConfigRecord {
  key: string;
  id: string;
  legalRelationName: string;
  capital: string;
  product: string;
  phone: string;
}

const BusinessConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<BusinessConfigRecord | null>(null);
  const [modalForm] = Form.useForm();

  // 产品选项
  const productOptions = [
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

  // 表格列定义
  const columns: ColumnsType<BusinessConfigRecord> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 180,
    },
    {
      title: '法律关系名称',
      dataIndex: 'legalRelationName',
      key: 'legalRelationName',
      width: 200,
    },
    {
      title: '资方',
      dataIndex: 'capital',
      key: 'capital',
      width: 150,
    },
    {
      title: '产品名',
      dataIndex: 'product',
      key: 'product',
      width: 120,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <span>
          <Button 
            size="small"
            type="link" 
            onClick={() => handleEdit(record)}
          >
            修改
          </Button>
          <Button 
            size="small"
            type="link" 
            danger
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </span>
      ),
    },
  ];

  // 模拟数据
  const dataSource: BusinessConfigRecord[] = [
    {
      key: '1',
      id: 'YW202403150001',
      legalRelationName: '融资租赁合同',
      capital: '上海银行',
      product: '新车',
      phone: '13800138000',
    },
    {
      key: '2',
      id: 'YW202403150002',
      legalRelationName: '买卖合同',
      capital: '北京金融租赁',
      product: '二手车',
      phone: '13900139000',
    },
  ];

  // 新增
  const handleAdd = () => {
    setIsEdit(false);
    setCurrentRecord(null);
    modalForm.resetFields();
    setIsModalVisible(true);
  };

  // 编辑
  const handleEdit = (record: BusinessConfigRecord) => {
    setIsEdit(true);
    setCurrentRecord(record);
    modalForm.setFieldsValue({
      legalRelationName: record.legalRelationName,
      capital: record.capital,
      product: record.product,
      phone: record.phone,
    });
    setIsModalVisible(true);
  };

  // 删除
  const handleDelete = (record: BusinessConfigRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除法律关系"${record.legalRelationName}"吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        message.success('删除成功');
      },
    });
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
          <Col span={8}>
            <Form.Item
              name="legalRelationName"
              label="法律关系名称"
            >
              <Input placeholder="请输入法律关系名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="product"
              label="产品"
            >
              <Select
                placeholder="请选择产品"
                options={productOptions}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="capital"
              label="资方"
            >
              <Select
                placeholder="请选择资方"
                options={capitalOptions}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={24}>
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
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                >
                  新增
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
        scroll={{ x: 1200 }}
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={isEdit ? '编辑业务配置' : '新增业务配置'}
        open={isModalVisible}
        onOk={() => {
          modalForm.validateFields().then(values => {
            console.log('表单数据:', values);
            message.success(isEdit ? '修改成功' : '新增成功');
            setIsModalVisible(false);
            modalForm.resetFields();
          });
        }}
        onCancel={() => {
          setIsModalVisible(false);
          setCurrentRecord(null);
          modalForm.resetFields();
        }}
        width={600}
      >
        <Form
          form={modalForm}
          layout="vertical"
          initialValues={currentRecord || {}}
        >
          <Form.Item
            name="legalRelationName"
            label="法律关系名称"
            rules={[{ required: true, message: '请输入法律关系名称' }]}
          >
            <Input placeholder="请输入法律关系名称" />
          </Form.Item>
          <Form.Item
            name="capital"
            label="资方"
            rules={[{ required: true, message: '请选择资方' }]}
          >
            <Select
              placeholder="请选择资方"
              options={capitalOptions}
            />
          </Form.Item>
          <Form.Item
            name="product"
            label="产品"
            rules={[{ required: true, message: '请选择产品' }]}
          >
            <Select
              placeholder="请选择产品"
              options={productOptions}
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BusinessConfig; 