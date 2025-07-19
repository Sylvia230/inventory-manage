import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Select, Space, Row, Col, DatePicker, Modal, Cascader, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import debounce from 'lodash/debounce';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  getBankBranchListApi,
  getBankCardListApi,
  getBankListApi,
  getEnumApi,
  getOwnerListApi,
  saveBankCardApi
} from '@/services/finance';
import dayjs from 'dayjs';
import {addWarehouseApi} from "@/services/wareHouse.ts";

const { RangePicker } = DatePicker;

interface BankCardRecord {
  key: string;
  accountName: string;
  bankAccount: string;
  bankName: string;
  bankId: string;
  bankBranchId: string;
  ownerType: number;
  ownerId: string;
  purposeList: [];
}

interface BankRecord {
  id: string;
  bankCode: string;
  bankName: string;
}

interface OwnerRecord {
  id: string;
  ownerType: number;
  name: string;
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
  const [ownerTypeList, setOwnerTypeList] = useState<Array<{value: string, name: string}>>([]);
  const [purposeList, setPurposeList] = useState<Array<{value: string, name: string}>>([]);
  const [ownerList, setOwnerList] = useState<Array<OwnerRecord>>([]);
  const [bankList, setBankList] = useState<Array<BankRecord>>([]);
  const [bankCode, setBankCode] = useState<string>('');
  const [loadingBank, setLoadingBank] = useState(false);
  const [bankBranchList, setBankBranchList] = useState<Array<{value: string, name: string}>>([]);
  const [loadingBankBranch, setLoadingBankBranch] = useState(false);
  const [loadingOwnerList, setLoadingOwnerList] = useState(false);
  const [ownerTypeCode, setOwnerTypeCode] = useState<number>(1);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

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
      width: 120,
    },
    {
      title: '卡号',
      dataIndex: 'bankAccount',
      width: 100,
    },
    {
      title: '开户行',
      dataIndex: 'bankBranchName',
      width: 120,
    },
    {
      title: '归属方类型',
      dataIndex: 'ownerTypeDesc',
      width: 80,
    },
    {
      title: '用途',
      dataIndex: 'purposeDescList',
      width: 80,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
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
    getBankList();
    getOwnerType();
    getPurpose();
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

  // 获取归属方类型枚举
  const getOwnerType = async () => {
    try {
      const res = await getEnumApi('OwnerTypeEnum');
      console.log(res, 'response');
      // API返回的数据结构应该是一个数组，包含 {id, name} 或 {value, label} 格式
      setOwnerTypeList(res || []);
    } catch (error) {
      console.error('获取归属方类型枚举数据失败:', error);
      message.error('获取归属方类型枚举数据失败');
    }
  };

  // 获取用途列表
  const getPurpose = async () => {
    try {
      const res = await getEnumApi('BankCardPurposeEnum');
      console.log(res, 'response');
      // API返回的数据结构应该是一个数组，包含 {id, name} 或 {value, label} 格式
      setPurposeList(res || []);
    } catch (error) {
      console.error('获取归属方类型枚举数据失败:', error);
      message.error('获取归属方类型枚举数据失败');
    }
  };
  // 获取归属方列表
  const getOwnerList = async (name: String,code? :number) => {
    setLoadingOwnerList(true);
    try {
      let res = [];
      if (code) {
        res = await getOwnerListApi(code,name);
      } else {
        res = await getOwnerListApi(ownerTypeCode,name);
      }
      console.log(res, 'response');
      // API返回的数据结构应该是一个数组，包含 {id, name} 或 {value, label} 格式
      setOwnerList(res || []);
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoadingOwnerList(false);
    }
  };


  // 获取银行数据
  const getBankList = async (searchParams?: any) => {
    setLoadingBank(true);
    try {
      const params = {
        pageSize:1000,
        ...searchParams
      };
      const res = await getBankListApi(params);
      console.log(res, 'response');
      // API返回的数据结构应该是一个数组，包含 {id, name} 或 {value, label} 格式
      setBankList(res || []);
    } catch (error) {
      console.error('获取银行数据失败:', error);
      message.error('获取银行数据失败');
    } finally {
      setLoadingBank(false);
    }
  };

  // 获取支行数据
  const getBankBranchList = async (searchParams?: any) => {
    setLoadingBankBranch(true);
    try {
      const params = {
        pageSize:1000,
        ...searchParams
      };
      const res = await getBankBranchListApi(params);
      console.log(res, 'response');
      // API返回的数据结构应该是一个数组，包含 {id, name} 或 {value, label} 格式
      setBankBranchList(res || []);
    } catch (error) {
      console.error('获取银行数据失败:', error);
      message.error('获取银行数据失败');
    } finally {
      setLoadingBankBranch(false);
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

  const handleEdit = (record: BankCardRecord) => {
    setIsEdit(true);
    setCurrentRecord(record);
    setIsModalVisible(true);
    let ownerType = record.ownerType;
    getOwnerList('',ownerType);
    let bankId = record.bankId;
    let bank:any = bankList.find((item: any) => item.id === bankId);
    const bankBranchSearch = {
      bankClscode:bank.bankCode
    };
    getBankBranchList(bankBranchSearch);
    // 设置表单初始值
    addForm.setFieldsValue({
      ...record
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEdit(false);
    setCurrentRecord(null);
    addForm.resetFields();
  };

  const handleAdd = async () => {
    setIsEdit(false);
    setCurrentRecord(null);
    setIsModalVisible(true);
    addForm.resetFields();
  };

  const handleModalSubmit = async () => {
    try {
      let values = await addForm.validateFields();
      console.log('保存银行卡:', values);
      // TODO: 实现保存逻辑
      let bankId = values.bankId;
      let bank:any = bankList.find((item: any) => item.id === bankId);
      values.bankName = bank.bankName;
      let bankBranchId = values.bankBranchId;
      let bankBranch:any = bankBranchList.find((item: any) => item.id === bankBranchId);
      values.bankBranchName = bankBranch.bankName;
      let ownerId = values.ownerId;
      let owner:any = ownerList.find((item: any) => item.id === ownerId);
      values.ownerName = owner.name;
      values.accountName = owner.name;
      if (isEdit) {
        values = ({ ...currentRecord, ...values })
      }

      await saveBankCardApi(values);
      message.success('保存成功');
      setIsModalVisible(false);
      setIsEdit(false);
      setCurrentRecord(null);
      addForm.resetFields();
      fetchData(); // 刷新列表
      getBankList();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleBankSearch  = debounce((inputValue: string) =>{
    if (/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/.test(inputValue)) {
      // alert(inputValue.length)
      getBankList({bankName:inputValue});
    }
  },400)

  const handleOwnerSearch  = debounce((inputValue: string) =>{
    if (/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/.test(inputValue)) {
      // alert(inputValue.length)
      getOwnerList(inputValue);
    }
  },400)



  const handleBankBranchSearch  = debounce((inputValue: string) =>{
    if (/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/.test(inputValue)) {

      const params = {
        bankName:inputValue,
        bankClscode:bankCode
      };
      getBankBranchList(params);
    }
  },800)

  // 处理银行变化
  const handleBankChange = (bankPId: string) => {
    let newBankCode = '';
    if (bankPId) {
      let bank:any = bankList.find((item: any) => item.id === bankPId);
      newBankCode = bank.bankCode;
      setBankCode(bank.bankCode);
    }
    form.setFieldsValue({
      bankBranchId: undefined,
    });
    setBankBranchList([]);
    if (newBankCode) {
      getBankBranchList({bankClscode:newBankCode});
    }
  };


  // 处理归属方类型变化
  const handleOwnerTypeChange = (code: number) => {
    setOwnerTypeCode(code);
    if (code) {
      getOwnerList('',code)
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

      <Form
        form={form}
        onFinish={handleSearch}
        layout="inline"
      >
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={8}>
            <Form.Item
              name="bankAccount"
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
        </Row>
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={6}>
            <Space>
              <Button icon={<SearchOutlined />} type="primary" htmlType="submit" loading={loading}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
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
        onOk={handleModalSubmit}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={addForm}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
              name="ownerType"
              label="归属方类型"
              style={{ width: '100%' }}
          >
            <Select
                placeholder="请选择归属方类型"
                style={{ width: '100%' }}
                onChange={handleOwnerTypeChange}
                options={ownerTypeList.map(type => ({
                  label: type.desc,
                  value: type.code,
                }))}
            />
          </Form.Item>
          <Form.Item
              name="ownerId"
              label="归属方"
              style={{ width: '100%' }}
          >
            <Select
                showSearch
                allowClear
                loading={loadingOwnerList}
                filterOption={false}
                onSearch={handleOwnerSearch}
                placeholder="请选择归属方"
                options={ownerList.map((item:any) => ({
                  label:item.name,
                  value:item.id
                }))}
            />
          </Form.Item>

          <Form.Item
              name="bankId"
              label="开户行"
              rules={[{ required: true, message: '请选择开户行' }]}
          >
            <Select
                showSearch
                allowClear
                loading={loadingBank}
                filterOption={false}
                onSearch={handleBankSearch}
                onChange={handleBankChange}
                placeholder="请选择开户行"
                options={bankList.map((item:any) => ({
                  label:item.bankName,
                  value:item.id
                }))}
            />
          </Form.Item>
          <Form.Item
              name="bankBranchId"
              label="支行"
              rules={[{ required: true, message: '请选择开户支行' }]}
          >
            <Select
                showSearch
                allowClear
                loading={loadingBankBranch}
                filterOption={false}
                onSearch={handleBankBranchSearch}
                placeholder="请选择开户支行"
                options={bankBranchList.map((item:any) => ({
                  label:item.bankName,
                  value:item.id
                }))}
            />
          </Form.Item>
          <Form.Item
            name="bankAccount"
            label="账户"
            rules={[
              { required: true, message: '请输入账户' },
              { pattern: /^\d{7,19}$/, message: '请输入7-19位数字' }
            ]}
            style={{ width: '100%' }}
          >
            <Input placeholder="请输入账户" />
          </Form.Item>
          <Form.Item
              name="purposeList"
              label="用途"
              rules={[{ required: false, message: '请选择用途' }]}
          >
            <Select
                mode="multiple"
                placeholder="请选择用途"
                style={{ width: '100%' }}
                options={purposeList.map(purpose => ({
                  label: purpose.desc,
                  value: purpose.code,
                }))}
            />
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
            卡号：{recordToDelete.bankAccount.replace(/(\d{4})\d+(\d{4})/, '$1****$2')}
          </p>
        )}
      </Modal>
    </div>
  );
};

export default BankCard; 