import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Select, Space, Row, Col, DatePicker, Modal, Cascader, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getBankCardListApi } from '@/services/finance';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface BankCardRecord {
  key: string;
  accountName: string;
  cardNumber: string;
  bankName: string;
  merchantId: string;
  phone: string;
  idNumber: string;
  owner: string;
  createTime: string;
  idType?: string;
  bankBranch?: string[];
}

const BankCard: React.FC = () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<BankCardRecord | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<BankCardRecord | null>(null);
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 证件类型选项
  const idTypeOptions = [
    { label: '身份证', value: 'ID_CARD' },
    { label: '护照', value: 'PASSPORT' },
    { label: '军官证', value: 'MILITARY_ID' },
    { label: '港澳通行证', value: 'HONG_KONG_MACAO' },
    { label: '台湾通行证', value: 'TAIWAN' },
  ];

  // 银行选项（级联选择）
  const bankOptions = [
    {
      value: 'ICBC',
      label: '中国工商银行',
      children: [
        { value: 'ICBC_SH_001', label: '上海分行' },
        { value: 'ICBC_SH_002', label: '浦东支行' },
        { value: 'ICBC_SH_003', label: '徐汇支行' },
      ],
    },
    {
      value: 'ABC',
      label: '中国农业银行',
      children: [
        { value: 'ABC_SH_001', label: '上海分行' },
        { value: 'ABC_SH_002', label: '浦东支行' },
        { value: 'ABC_SH_003', label: '徐汇支行' },
      ],
    },
    {
      value: 'BOC',
      label: '中国银行',
      children: [
        { value: 'BOC_SH_001', label: '上海分行' },
        { value: 'BOC_SH_002', label: '浦东支行' },
        { value: 'BOC_SH_003', label: '徐汇支行' },
      ],
    },
    // ... 其他银行选项
  ];

  // 表格列定义
  const columns: ColumnsType<BankCardRecord> = [
    {
      title: '银行账户户名',
      dataIndex: 'accountName',
      width: 150,
    },
    {
      title: '卡号',
      dataIndex: 'bankAccount',
      width: 180,
      // render: (text: string) => {
      //   // 只显示后四位，其他用*代替
      //   const lastFour = text.slice(-4);
      //   const masked = '*'.repeat(text.length - 4);
      //   return `${masked}${lastFour}`;
      // },
    },
    {
      title: '开户行',
      dataIndex: 'bankBranchName',
      width: 150,
    },
    {
      title: '商户id',
      dataIndex: 'merchantId',
      width: 150,
    },
    {
      title: '绑定手机号',
      dataIndex: 'phone',
      width: 150,
      // render: (text: string) => {
      //   // 手机号中间四位用*代替
      //   return text.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      // },
    },
    {
      title: '证件号',
      dataIndex: 'idNumber',
      width: 180,
      // render: (text: string) => {
      //   // 身份证号中间用*代替
      //   return text.replace(/(\d{4})\d{10}(\d{4})/, '$1**********$2');
      // },
    },
    {
      title: '归属方',
      dataIndex: 'owner',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      render: (text: string) => {
        return text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '';
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 数据源
  const [dataSource, setDataSource] = useState<BankCardRecord[]>([]);

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
      
      const res = await getBankCardListApi(params);
      console.log('银行卡列表', res);
      
      if (res.result) {
        // 转换API返回的数据格式为页面需要的格式
        // const list = (res.result || []).map((item: any) => ({
        //   key: item.id,
        //   accountName: item.accountName,
        //   cardNumber: item.cardNumber,
        //   bankName: item.bankName,
        //   merchantId: item.merchantId,
        //   phone: item.phone,
        //   idNumber: item.idNumber,
        //   owner: item.owner,
        //   createTime: item.createTime,
        //   idType: item.idType,
        //   bankBranch: item.bankBranch,
        // }));
        
        setDataSource(res.result);
        setTotal(res.totalCount || 0);
      } 
    } catch (error) {
      console.error('获取银行卡列表失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values: any) => {
    console.log('搜索条件:', values);
    setCurrentPage(1);
    fetchData(values);
  };

  const handleReset = () => {
    form.resetFields();
    setCurrentPage(1);
    fetchData();
  };

  const handleViewDetail = (record: BankCardRecord) => {
    console.log('查看银行卡详情:', record);
    // TODO: 实现查看详情逻辑
  };

  const showModal = () => {
    setIsEdit(false);
    setCurrentRecord(null);
    setIsModalVisible(true);
    addForm.resetFields();
  };

  const handleEdit = (record: BankCardRecord) => {
    setIsEdit(true);
    setCurrentRecord(record);
    setIsModalVisible(true);
    // 设置表单初始值
    addForm.setFieldsValue({
      accountName: record.accountName,
      bankBranch: record.bankBranch,
      cardNumber: record.cardNumber,
      phone: record.phone,
      idType: record.idType,
      idNumber: record.idNumber,
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEdit(false);
    setCurrentRecord(null);
    addForm.resetFields();
  };

  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields();
      console.log('保存银行卡:', values);
      // TODO: 实现保存逻辑
      message.success(isEdit ? '编辑成功' : '新增成功');
      setIsModalVisible(false);
      setIsEdit(false);
      setCurrentRecord(null);
      addForm.resetFields();
      fetchData(); // 刷新列表
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleDelete = (record: BankCardRecord) => {
    setRecordToDelete(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // TODO: 实现删除逻辑
      console.log('删除银行卡:', recordToDelete);
      message.success('删除成功');
      setDeleteModalVisible(false);
      setRecordToDelete(null);
      fetchData(); // 刷新列表
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.header}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          新增银行卡
        </Button>
      </div> */}

      <Form
        form={form}
        onFinish={handleSearch}
        layout="inline"
      >
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={8}>
            <Form.Item
              name="cardNumber"
              label="银行卡账号"
            >
              <Input placeholder="请输入银行卡账号" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="accountName"
              label="户名"
            >
              <Input placeholder="请输入户名" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="bankName"
              label="银行"
            >
              <Select
                placeholder="请选择银行"
                options={bankOptions}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
        <Col span={8}>
            <Form.Item
              name="createTime"
              label="创建时间"
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={6}>
            <Space>
              <Button icon={<SearchOutlined />} type="primary" htmlType="submit" loading={loading}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                新增银行卡
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
        onChange={(pagination) => {
          setCurrentPage(pagination.current || 1);
          setPageSize(pagination.pageSize || 10);
        }}
        scroll={{ x: 1300 }}
      />

      <Modal
        title={isEdit ? '编辑银行卡' : '新增银行卡'}
        open={isModalVisible}
        onOk={handleAdd}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={addForm}
          layout="inline"
          requiredMark={false}
        >
          <Form.Item
            name="accountName"
            label="户名"
            rules={[{ required: true, message: '请输入户名' }]}
            style={{ width: '100%' }}
          >
            <Input placeholder="请输入户名" />
          </Form.Item>

          <Form.Item
            name="bankBranch"
            label="开户支行"
            rules={[{ required: true, message: '请选择开户支行' }]}
            style={{ width: '100%' }}
          >
            <Cascader
              options={bankOptions}
              placeholder="请选择开户支行"
              expandTrigger="hover"
            />
          </Form.Item>

          <Form.Item
            name="cardNumber"
            label="账户"
            rules={[
              { required: true, message: '请输入账户' },
              { pattern: /^\d{16,19}$/, message: '请输入16-19位数字' }
            ]}
            style={{ width: '100%' }}
          >
            <Input placeholder="请输入账户" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]}
            style={{ width: '100%' }}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            name="idType"
            label="证件类型"
            style={{ width: '100%' }}
          >
            <Select
              placeholder="请选择证件类型"
              options={idTypeOptions}
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="idNumber"
            label="证件编号"
            rules={[
              { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的证件编号' }
            ]}
            style={{ width: '100%' }}
          >
            <Input placeholder="请输入证件编号" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal
        title="删除确认"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除该银行卡吗？</p>
        {recordToDelete && (
          <p style={{ color: '#666', fontSize: '14px' }}>
            卡号：{recordToDelete.cardNumber.replace(/(\d{4})\d+(\d{4})/, '$1****$2')}
          </p>
        )}
      </Modal>
    </div>
  );
};

export default BankCard; 