import React, { useState } from 'react';
import { Table, Button, Form, Input, Space, Row, Col, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  EyeOutlined, 
  EditOutlined, 
  PlusOutlined 
} from '@ant-design/icons';

interface CapitalRecord {
  key: string;
  capitalId: string;
  name: string;
  type: string;
  signatory: string;
  phone: string;
  legalPerson: string;
}

const CapitalList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<CapitalRecord | null>(null);

  // 资方类型选项
  const typeOptions = [
    { label: '银行', value: 'bank' },
    { label: '金融租赁', value: 'finance' },
    { label: '融资租赁', value: 'leasing' },
    { label: '其他', value: 'other' },
  ];

  // 表格列定义
  const columns: ColumnsType<CapitalRecord> = [
    {
      title: '资方ID',
      dataIndex: 'capitalId',
      key: 'capitalId',
      width: 180,
    },
    {
      title: '资方名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '资方类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (text) => {
        const option = typeOptions.find(opt => opt.value === text);
        return option ? option.label : text;
      },
    },
    {
      title: '签章人',
      dataIndex: 'signatory',
      key: 'signatory',
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
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button 
            size="small"
            type="link" 
            onClick={() => handleEdit(record)}
          >
            修改
          </Button>
        </span>
      ),
    },
  ];

  // 模拟数据
  const dataSource: CapitalRecord[] = [
    {
      key: '1',
      capitalId: 'ZB202403150001',
      name: '上海银行',
      type: 'bank',
      signatory: '张三',
      phone: '13800138000',
      legalPerson: '李四',
    },
    {
      key: '2',
      capitalId: 'ZB202403150002',
      name: '北京金融租赁有限公司',
      type: 'finance',
      signatory: '王五',
      phone: '13900139000',
      legalPerson: '赵六',
    },
  ];

  // 查看
  const handleView = (record: CapitalRecord) => {
    console.log('查看资方:', record);
  };

  // 编辑
  const handleEdit = (record: CapitalRecord) => {
    setIsEdit(true);
    setCurrentRecord(record);
    setIsModalVisible(true);
  };

  // 新增
  const handleAdd = () => {
    setIsEdit(false);
    setCurrentRecord(null);
    setIsModalVisible(true);
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
              name="name"
              label="资方名称"
            >
              <Input placeholder="请输入资方名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="legalPerson"
              label="法人名称"
            >
              <Input placeholder="请输入法人名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
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
        title={isEdit ? '编辑资方' : '新增资方'}
        open={isModalVisible}
        onOk={() => {
          message.success(isEdit ? '修改成功' : '新增成功');
          setIsModalVisible(false);
        }}
        onCancel={() => {
          setIsModalVisible(false);
          setCurrentRecord(null);
        }}
        width={600}
      >
        <p>资方信息表单</p>
        {currentRecord && (
          <p style={{ color: '#666', fontSize: '14px' }}>
            资方ID：{currentRecord.capitalId}
          </p>
        )}
      </Modal>
    </div>
  );
};

export default CapitalList; 