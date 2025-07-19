import React, { useState, useMemo, useEffect} from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Form,
  Input,
  Card,
  Row,
  Col,
  Tag,
  Select,
  Cascader,
  Spin,
  InputNumber,
  Upload, Image
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from '../index.module.less';
import debounce from 'lodash/debounce';
import AuditModal from '../components/AuditModal';
import {GetVendorListApi, AddVendorApi, saveVendorApi, saveBlackList} from '@/services/merchant';
import {EyeOutlined, UploadOutlined} from "@ant-design/icons";
import axios from 'axios';

interface Merchant {
  id: string;
  name: string;
  address: string;
  socialCreditCode: string;
  businessScope: string;
  legalName: string;
  legalCode: string;
  signerName: string;
  legalMobile: string;
  contactName: string;
  contactMobile: string;
  bizLicenseFileId:string;
  creditLimit: number;
  inBlackList: boolean;
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
  const [auditForm] = Form.useForm();
  const [bankCardForm] = Form.useForm();
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [bankCardModalVisible, setBankCardModalVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [fetching, setFetching] = useState(false);
  const [tagOptions, setTagOptions] = useState<any[]>([]);
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [rateModalVisible, setRateModalVisible] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [imageData, setImageData] = useState<string | undefined>(undefined);
  const [rateForm] = Form.useForm();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [reason, setReason] = useState(''); // 拉黑原因
  const [blackModalVisible, setBlackModalVisible] = useState(false);
  const [addForm] = Form.useForm();

  const [dataSource, setDataSource] = useState<Merchant[]>([]);

  // 产品类型选项
  const productTypeOptions = [
    { label: '新车', value: 'new_car' },
    { label: '二手车', value: 'used_car' },
    { label: '试驾车', value: 'test_car' },
  ];

  // 经营场地类型选项
  const venueTypeOptions = [
    { label: '自有场地', value: 'owned' },
    { label: '租赁场地', value: 'rented' },
    { label: '合作场地', value: 'cooperative' },
  ];

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


  const fetchData = async (page = currentPage, size = pageSize) => {
  setLoading(true);
  try {
    const params = {
      page,
      pageSize: size,
      // 可以添加其他搜索参数，例如：
      // name: form.getFieldValue('name'),
      // creditCode: form.getFieldValue('creditCode'),
    };

    const res = await GetVendorListApi(params);
    console.log('商家列表', res);
    
    // if (res && res.result) {
    //   // 转换API返回的数据格式为页面需要的格式
    //   const list = res.result.map((item: any) => ({
    //     id: item.id,
    //     name: item.name,
    //     creditCode: item.creditCode,
    //     legalPerson: item.legalPerson,
    //     legalPersonId: item.legalPersonId,
    //     legalSignature: item.legalSignature,
    //     companySignature: item.companySignature,
    //     contactPerson: item.contactPerson,
    //     businessAddress: item.businessAddress,
    //     creditLevel: item.creditLevel || 'A',
    //     creditLimit: item.creditLimit || 0,
    //     status: item.status === 1 ? '待审核' : item.status === 2 ? '正常' : '黑名单',
    //   }));

      setDataSource(res.result || []);
      setTotal(res.totalCount || 0);
    // } else {
    //   message.error(res.msg || '获取数据失败');
    // }
  } catch (error) {
    console.error('获取商家列表失败:', error);
    message.error('获取数据失败');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, []);
  const handleAddBlacklist = () => {

    // TODO: 调用加入黑名单API
    const params = {
      vendorId:selectedMerchant?.id,
      socialCreditCode:selectedMerchant?.socialCreditCode,
      address:selectedMerchant?.address,
      legalName:selectedMerchant?.legalName,
      legalCode:selectedMerchant?.legalCode,
      signerName:selectedMerchant?.signerName,
      contactMobile:selectedMerchant?.contactMobile,
      vendorName:selectedMerchant?.name,
    }
    try {
      saveBlackList(params);
      setDataSource(dataSource.map(item =>
          item.id === selectedMerchant?.id ? { ...item, status: '黑名单' } : item
      ));
      message.success('已加入黑名单');
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (record: Merchant) => {
    setSelectedMerchant(record);
    setTagModalVisible(true);
  };

  const handleCancel = () => {
    setAuditModalVisible(false);
    setSelectedMerchant(null);
    addForm.resetFields();
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

  const handleAudit = (record: Merchant) => {
    setSelectedMerchant(record);
    setAuditModalVisible(true);
    fetchImage(record.bizLicenseFileId);
    auditForm.setFieldsValue({
      ...record
    });
  };

  const fetchImage = async (fileId: String) => {
    try {
      const token = localStorage.getItem('token')
      // 通过 axios 请求图片（会走拦截器）
      const response = await axios.get(
          `gdv/file/loadFile/${fileId}`,
          {
            responseType: 'blob', // 重要：指定响应类型为二进制
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
      );

      // 创建 Blob URL
      const url = URL.createObjectURL(response.data);
      setImageData(url);
    } catch (error) {
      console.error('加载图片失败', error);
    }
  }

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

  // 修改日费率
  const handleEditDailyRate = (record: Merchant) => {
    setSelectedMerchant(record);
    rateForm.setFieldsValue({
      ...record // 假设 creditLimit 是当前日费率
    });
    setRateModalVisible(true);
  };

  const handleUpdateDailyRate = async (values: any) => {
  try {
    setLoading(true);
    
    // 调用API更新日费率
    await saveVendorApi({
      id: selectedMerchant?.id,
      feeRate: values.feeRate + ''
    });
    message.success('更新成功');
    setRateModalVisible(false);
    fetchData(); // 刷新列表
  } catch (error) {
    console.error('更新日费率失败:', error);
    message.error('更新失败');
  } finally {
    setLoading(false);
  }
};
  const columns: ColumnsType<Merchant> = [
    {
      title: '商家名称',
      width:110,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '统一社会信用代码',
      width:120,
      dataIndex: 'socialCreditCode',
      key: 'socialCreditCode',
    },
    {
      title: '服务费率（年化）',
      width:80,
      dataIndex: 'feeRate',
      key: 'feeRate',
      render: (text) => {
        // text 是当前单元格的值
        return text ? `${text}%` : '-'; // 添加 % 后缀，空值处理为 -
      }
    },
    {
      title: '法人代表',
      width:80,
      dataIndex: 'legalName',
      key: 'legalName',
    },
    {
      title: '联系人',
      width:60,
      dataIndex: 'contactName',
      key: 'contactName',
    },{
      title: '黑名单',
      width:60,
      dataIndex: 'inBlackList',
      key: 'inBlackList',
      render: (inBlackList) => {
        // text 是当前单元格的值
        return inBlackList ? `是` : '否'; // 添加 % 后缀，空值处理为 -
      }
    },
    {
      title: '状态',
      width:40,
      dataIndex: 'statusDesc',
      key: 'statusDesc',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
           <Button type="link" onClick={() => handleEditDailyRate(record)}>
            修改费率
        </Button>
        <Button type="link" onClick={() => handleAudit(record)}>
            审核
        </Button>
          {/*<Button type="link" onClick={() => handleAddTag(record)}>*/}
          {/*  新增标签*/}
          {/*</Button>*/}
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
            scroll={ { x: 1000 } }
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

      <Modal
          title="确认加入黑名单"
          visible={blackModalVisible}
          okText="确认"
          cancelText="取消"
          onOk={handleAddBlacklist} // 自定义确认处理
          onCancel={() => setBlackModalVisible(false)}
          afterClose={() => setReason('')} // 关闭后清空输入
      >
        <p>确定要将商家"{selectedMerchant?.name}"加入黑名单吗？</p>
        <Input.TextArea
            placeholder="请输入拉黑原因"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
        />
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
      <Modal
        title="修改费率"
        open={rateModalVisible}
        onOk={() => {
          rateForm.validateFields().then(values => {
            handleUpdateDailyRate(values);
          });
        }}
        onCancel={() => {
          setRateModalVisible(false);
          rateForm.resetFields();
        }}
        okText="确定"
        cancelText="取消"
      >
        <Form form={rateForm} layout="vertical">
          <Form.Item
            label="年化费率 (%)"
            name="feeRate"
            rules={[
              { required: true, message: '请输入费率' },
              { type: 'number', min: 0, max: 100, message: '请输入0~100之间的数值' }
            ]}
          >
            <InputNumber placeholder="请输入费率 (%)" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
      {/*<AuditModal */}
      {/*  open={auditModalVisible} */}
      {/*  onCancel={() => setAuditModalVisible(false)}*/}
      {/*  onOk={handleAuditSubmit}*/}
      {/*  merchantData={selectedMerchant}*/}
      {/*  ></AuditModal>*/}

      {/* 新增商家弹窗 */}
      <Modal
          title="商家审核"
          open={auditModalVisible}
          onCancel={handleCancel}
          width={600}
          footer={[
            <Button key="reject" onClick={handleCancel}>
              驳回
            </Button>,
            <Button key="approve" type="primary" loading={loading} onClick={handleAuditSubmit}>
              通过
            </Button>,
          ]}
      >
        <Form
            form={auditForm}
            layout="inline"
        >
          <Col span={24}>
            <Form.Item
                label="公司全称"
                name="name"
            >
              {selectedMerchant?.name}
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
                label="公司地址"
                name="address"
            >
              {selectedMerchant?.address}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
                label="营业执照"
                name="businessLicense"
            >
              <Image
                    src={imageData}
                  alt={`营业执照`}
                  style={{ width: '100%', height: 150, objectFit: 'cover' }}
                  preview={{
                    mask: (
                        <div style={{ color: 'white', textAlign: 'center' }}>
                          <EyeOutlined style={{ fontSize: 20 }} />
                          <div style={{ marginTop: 4 }}>预览</div>
                        </div>
                    )
                  }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
                label="法人信息"
                name="legalPerson"
            >
              {selectedMerchant?.name}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
                label="经营范围"
                name="businessScope"
            >
            </Form.Item>
          </Col>
          {/* </Row> */}

          <Form.Item
              label="备注"
              name="remark"
              rules={[{ required: true, message: '请输入备注' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入备注" style={{width: '500px'}}/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MerchantList; 