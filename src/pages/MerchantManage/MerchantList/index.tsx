import React, { useState, useMemo} from 'react';
import { Table, Button, Space, Modal, message, Form, Input, Card, Row, Col, Tag, Select, Cascader, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from '../index.module.less';
import debounce from 'lodash/debounce';
import AuditModal from '../components/AuditModal';

interface Merchant {
  id: string;
  name: string;
  creditCode: string;
  legalPerson: string;
  legalPersonId: string;
  legalSignature: string;
  companySignature: string;
  contactPerson: string;
  businessAddress: string;
  creditLevel: 'A' | 'B' | 'C' | 'D';
  creditLimit: number;
  status: '待审核' | '正常' | '黑名单';
}

interface BankCard {
  accountName: string;
  bankBranch?: string;
  accountNumber: string;
  phone: string;
  idType?: string;
  idNumber?: string;
}

const MerchantList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [bankCardForm] = Form.useForm();
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [bankCardModalVisible, setBankCardModalVisible] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [fetching, setFetching] = useState(false);
  const [tagOptions, setTagOptions] = useState<any[]>([]);
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);

  const [dataSource, setDataSource] = useState<Merchant[]>([
    {
      id: '1',
      name: '测试企业1',
      creditCode: '91110105MA12345678',
      legalPerson: '张三',
      legalPersonId: '110101199001011234',
      legalSignature: '张三',
      companySignature: '李四',
      contactPerson: '王五',
      businessAddress: '北京市朝阳区xxx街道',
      creditLevel: 'A',
      creditLimit: 1000000,
      status: '正常',
    },
  ]);

  // 模拟银行支行数据
  const bankBranches = [
    {
      value: 'beijing',
      label: '北京',
      children: [
        {
          value: 'chaoyang',
          label: '朝阳区',
          children: [
            {
              value: 'branch1',
              label: '朝阳支行',
            },
          ],
        },
      ],
    },
  ];

  const handleAddToBlacklist = (record: Merchant) => {
    Modal.confirm({
      title: '确认加入黑名单',
      content: `确定要将商家"${record.name}"加入黑名单吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          // TODO: 调用加入黑名单API
          setDataSource(dataSource.map(item => 
            item.id === record.id ? { ...item, status: '黑名单' } : item
          ));
          message.success('已加入黑名单');
        } catch (error) {
          message.error('操作失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleAddTag = (record: Merchant) => {
    setSelectedMerchant(record);
    setTagModalVisible(true);
  };

  const handleAddBankCard = (record: Merchant) => {
    setSelectedMerchant(record);
    setBankCardModalVisible(true);
  };

  const handleTagSubmit = async (values: any) => {
    try {
      setLoading(true);
      // TODO: 调用添加标签API
      message.success('标签添加成功');
      setTagModalVisible(false);
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleBankCardSubmit = async (values: BankCard) => {
    try {
      setLoading(true);
      // TODO: 调用添加银行卡API
      message.success('银行卡添加成功');
      setBankCardModalVisible(false);
      bankCardForm.resetFields();
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (values: any) => {
    try {
      setLoading(true);
      // TODO: 调用搜索API
      console.log('搜索条件：', values);
    } catch (error) {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '待审核':
        return 'warning';
      case '正常':
        return 'success';
      case '黑名单':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCreditLevelColor = (level: string) => {
    switch (level) {
      case 'A':
        return 'success';
      case 'B':
        return 'processing';
      case 'C':
        return 'warning';
      case 'D':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleAudit = (record: Merchant) => {
    setSelectedMerchant(record);
    setAuditModalVisible(true);
  };

  const handleAuditSubmit = async (values: any) => {
    try {
      setAuditLoading(true);
      // TODO: 调用审核API
      // await auditMerchant(selectedMerchant?.id, values);
      message.success('审核成功');
      setAuditModalVisible(false);
    } catch (error) {
      message.error('审核失败');
    } finally {
      setAuditLoading(false);
    }
  };

  const columns: ColumnsType<Merchant> = [
    {
      title: '商家名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '统一社会信用代码',
      width:160,
      dataIndex: 'creditCode',
      key: 'creditCode',
    },
    {
      title: '法人代表',
      dataIndex: 'legalPerson',
      key: 'legalPerson',
    },
    {
      title: '法人代表身份证',
      width:160,
      dataIndex: 'legalPersonId',
      key: 'legalPersonId',
    },
    {
      title: '法人签章人',
      dataIndex: 'legalSignature',
      key: 'legalSignature',
    },
    {
      title: '企业签章人',
      dataIndex: 'companySignature',
      key: 'companySignature',
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: '经营场所',
      dataIndex: 'businessAddress',
      key: 'businessAddress',
    },
    {
      title: '商家信用等级',
      dataIndex: 'creditLevel',
      key: 'creditLevel',
      render: (level: string) => (
        <Tag color={getCreditLevelColor(level)}>{level}</Tag>
      ),
    },
    {
      title: '授信额度',
      dataIndex: 'creditLimit',
      key: 'creditLimit',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: '200',
      render: (_, record) => (
        <div>
        <Button type="link" onClick={() => handleAudit(record)}>
            审核
        </Button>
          <Button type="link" onClick={() => handleAddTag(record)}>
            新增标签
          </Button>
          {record.status !== '黑名单' && (
            <Button type="link" onClick={() => handleAddToBlacklist(record)}>
              添加黑名单
            </Button>
          )}
          <Button type="link" onClick={() => handleAddBankCard(record)}>
            添加银行卡
          </Button>
        </div>
      ),
    },
  ];

   // 远程搜索标签
 const fetchTagOptions = async (searchText: string) => {
    setFetching(true);
    try {
      // TODO: 替换为实际的API调用
      // const response = await request.get('/api/tags/search', {
      //   params: { keyword: searchText }
      // });
      // setTagOptions(response.data);
      
      // 模拟数据
      const mockData: any[] = [
        { value: 'urgent', label: '加急', color: 'red' },
        { value: 'vip', label: 'VIP客户', color: 'gold' },
        { value: 'new', label: '新客户', color: 'green' },
        { value: 'special', label: '特殊处理', color: 'purple' },
      ].filter(item => 
        item.label.toLowerCase().includes(searchText.toLowerCase())
      );
      
      setTagOptions(mockData);
    } catch (error) {
      message.error('获取标签列表失败');
    } finally {
      setFetching(false);
    }
  };
// 使用防抖处理搜索
const debouncedFetchTagOptions = useMemo(
    () => debounce(fetchTagOptions, 500),
    []
);


  return (
    <div>
      <Card className="mb-16">
        <Form
          form={form}
          onFinish={handleSearch}
          layout="inline"
        >
          <Row gutter={24} style={{ width: '100%' }}>
            <Col span={7}>
              <Form.Item
                name="name"
                label="商家名称"
              >
                <Input placeholder="请输入商家名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={10} style={{ textAlign: 'left' }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  查询
                </Button>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Col>
            {/* <Col span={10}>
              <Form.Item
                name="creditCode"
                label="统一社会信用代码"
              >
                <Input placeholder="请输入统一社会信用代码" allowClear />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name="legalPerson"
                label="法人代表"
              >
                <Input placeholder="请输入法人代表" allowClear />
              </Form.Item>
            </Col> */}
          </Row>
          {/* <Row style={{ width: '100%' }} className='mt-12'>
            <Col span={24} style={{ textAlign: 'left' }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  查询
                </Button>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Col>
          </Row> */}
        </Form>
      </Card>
    <div className={styles.container}>
        <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="id"
            loading={loading}
            scroll={ { x: 1500 } }
            pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            }}
        />
    </div>
     
    <Modal
        title="添加标签"
        open={tagModalVisible}
        onOk={handleTagSubmit}
        onCancel={() => {
            setTagModalVisible(false);
          form.resetFields();
        }}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="inline"
        >
          <Form.Item
            label="标签"
            required
            tooltip="请至少选择一个标签"
          >
            <Select
              // mode="multiple"
              style={{ width: '280px' }}
              placeholder="请选择或搜索标签"
              value={selectedTags}
              onChange={setSelectedTags}
              onSearch={debouncedFetchTagOptions}
              notFoundContent={fetching ? <Spin size="small" /> : null}
              options={tagOptions}
              optionLabelProp="label"
              optionFilterProp="label"
              showSearch
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加银行卡弹窗 */}
      <Modal
        title="添加银行卡"
        open={bankCardModalVisible}
        onCancel={() => {
          setBankCardModalVisible(false);
          bankCardForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={bankCardForm}
          onFinish={handleBankCardSubmit}
          layout="vertical"
        >
          <Form.Item
            name="accountName"
            label="户名"
            rules={[{ required: true, message: '请输入户名' }]}
          >
            <Input placeholder="请输入户名" />
          </Form.Item>
          <Form.Item
            name="bankBranch"
            label="开户支行"
          >
            <Cascader
              options={bankBranches}
              placeholder="请选择开户支行"
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="accountNumber"
            label="账户"
            rules={[{ required: true, message: '请输入账户' }]}
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
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="idType"
            label="证件类型"
          >
            <Select
              placeholder="请选择证件类型"
              allowClear
              options={[
                { value: '身份证', label: '身份证' },
                { value: '护照', label: '护照' },
                { value: '其他', label: '其他' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="idNumber"
            label="证件编号"
          >
            <Input placeholder="请输入证件编号" />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setBankCardModalVisible(false);
                bankCardForm.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <AuditModal 
        open={auditModalVisible} 
        onCancel={() => setAuditModalVisible(false)}
        onOk={handleAuditSubmit}
        ></AuditModal>
    </div>
  );
};

export default MerchantList; 