import React, { useState } from 'react';
import { Table, Button, Form, Input, Select, Space, Row, Col, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';

interface TemplateRecord {
  key: string;
  templateNo: string;
  name: string;
  createTime: string;
  updateTime: string;
  type: string;
  fundContractName: string;
}

const Template: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<TemplateRecord | null>(null);

  // 合同类型选项
  const typeOptions = [
    { label: '购车合同', value: 'purchase' },
    { label: '租赁合同', value: 'lease' },
    { label: '服务合同', value: 'service' },
    { label: '其他', value: 'other' },
  ];

  // 表格列定义
  const columns: ColumnsType<TemplateRecord> = [
    {
      title: '编号',
      dataIndex: 'templateNo',
      key: 'templateNo',
      width: 180,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
    },
    {
      title: '合同类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (text) => {
        const option = typeOptions.find(opt => opt.value === text);
        return option ? option.label : text;
      },
    },
    {
      title: '资方合同名称',
      dataIndex: 'fundContractName',
      key: 'fundContractName',
      width: 200,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <span >
          <Button 
            size='small'
            type="link" 
            // icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size='small'
            danger
            // icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
          <Button 
           size='small'
            type="link" 
            // icon={<FileTextOutlined />}
            onClick={() => handleSetSignature(record)}
          >
            设置签章位置
          </Button>
          <Button 
            size='small'
            type="link" 
            // icon={<CheckCircleOutlined />}
            onClick={() => handleValidate(record)}
          >
            校验
          </Button>
        </span>
      ),
    },
  ];

  // 模拟数据
  const dataSource: TemplateRecord[] = [
    {
      key: '1',
      templateNo: 'MB202403150001',
      name: '标准购车合同模板',
      createTime: '2024-03-15 10:00:00',
      updateTime: '2024-03-15 10:00:00',
      type: 'purchase',
      fundContractName: '上海银行购车合同',
    },
    {
      key: '2',
      templateNo: 'MB202403150002',
      name: '标准租赁合同模板',
      createTime: '2024-03-15 11:00:00',
      updateTime: '2024-03-15 11:00:00',
      type: 'lease',
      fundContractName: '北京银行租赁合同',
    },
  ];

  // 编辑
  const handleEdit = (record: TemplateRecord) => {
    console.log('编辑模板:', record);
  };

  // 删除
  const handleDelete = (record: TemplateRecord) => {
    setCurrentRecord(record);
    setDeleteModalVisible(true);
  };

  // 确认删除
  const handleDeleteConfirm = async () => {
    try {
      // TODO: 实现删除逻辑
      console.log('删除模板:', currentRecord);
      message.success('删除成功');
      setDeleteModalVisible(false);
      setCurrentRecord(null);
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  // 设置签章位置
  const handleSetSignature = (record: TemplateRecord) => {
    console.log('设置签章位置:', record);
  };

  // 校验
  const handleValidate = (record: TemplateRecord) => {
    console.log('校验模板:', record);
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
              name="templateNo"
              label="模板编号"
            >
              <Input placeholder="请输入模板编号" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="name"
              label="合同模板名称"
            >
              <Input placeholder="请输入合同模板名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="type"
              label="合同类型"
            >
              <Select
                placeholder="请选择合同类型"
                options={typeOptions}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} style={{ width: '100%' }}>
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

      {/* 删除确认弹窗 */}
      <Modal
        title="删除确认"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setCurrentRecord(null);
        }}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除该合同模板吗？</p>
        {currentRecord && (
          <p style={{ color: '#666', fontSize: '14px' }}>
            模板编号：{currentRecord.templateNo}
          </p>
        )}
      </Modal>
    </div>
  );
};

export default Template; 