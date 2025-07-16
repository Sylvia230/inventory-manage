import React, { useState, useMemo, useEffect} from 'react';
import { Table, Button, Space, Modal, message, Form, Input, Card, Row, Col, Tag, Select, Cascader, Spin, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from '../index.module.less';
import debounce from 'lodash/debounce';
import AuditModal from '../components/AuditModal';
import { GetVendorListApi, AddVendorApi, AddBlackListApi, AddTagApi, GetTagListApi, SaveTagRelationApi } from '@/services/merchant';
import { GetEnumApi } from '@/services/user';

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
  const [rateForm] = Form.useForm();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [productOptions, setProductOptions] = useState<any[]>([]);
  const [productSmallOptions, setProductSmallOptions] = useState<any[]>([]);
  const [filteredProductSmallOptions, setFilteredProductSmallOptions] = useState<any[]>([]);
  const [venueTypeOptions, setVenueTypeOptions] = useState<any[]>([]);

  const [dataSource, setDataSource] = useState<Merchant[]>([]);

   // 添加黑名单相关状态
   const [addBlacklistVisible, setAddBlacklistVisible] = useState(false);
   const [addBlacklistForm] = Form.useForm();
   const [vendorOptions, setVendorOptions] = useState<any[]>([]);
   const [vendorLoading, setVendorLoading] = useState(false);
   const [currentRecord, setCurrentRecord] = useState<any>(null);

  // 产品类型选项
  const productTypeOptions = [
    { label: '新车', value: 'new_car' },
    { label: '二手车', value: 'used_car' },
    { label: '试驾车', value: 'test_car' },
  ];

  // // 经营场地类型选项
  // const venueTypeOptions = [
  //   { label: '自有场地', value: 'owned' },
  //   { label: '租赁场地', value: 'rented' },
  //   { label: '合作场地', value: 'cooperative' },
  // ];

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

      setDataSource(res.result || []);
      setTotal(res.totalCount || 0);
  } catch (error) {
    console.error('获取商家列表失败:', error);
    message.error('获取数据失败');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData(1, 10);
  getProductList();
  getProductSmallList();
  getVenueList();
}, []);

// 获取经验场地
const getVenueList = async () => {
  const res = await GetEnumApi('RunningTypeEnum');
  let venueOptionsList:any[] = []
  res?.forEach((item: any) => {
    venueOptionsList.push({
      label: item.desc,
      value: item.code, 
    })
  })
  setVenueTypeOptions(venueOptionsList);
}

// 获取产品大类
const getProductList = async () => {
  const res = await GetEnumApi('BizCategoryEnum');
  let productOptionsList:any[] = []
    res?.forEach((item: any) => {
      productOptionsList.push({
        label: item.desc,
        value: item.code,
      })
    })
    setProductOptions(productOptionsList);
}

// 获取产品小类
const getProductSmallList = async () => {
  const res = await GetEnumApi('BizCategorySubEnum');
  let productSmallOptionsList:any[] = []
  res?.forEach((item: any) => {
    productSmallOptionsList.push({
      label: item.desc,
      value: item.code,
    })
  })
  setProductSmallOptions(productSmallOptionsList);
}

// 处理产品大类变化
const handleProductCategoryChange = (value: any) => {
  console.log('产品大类变化:', value);
  
  // 根据产品大类筛选产品小类
  let filteredOptions: any[] = [];
  
  if (value == 2) {
    // 如果产品大类code等于2，筛选小类中code等于2和4的
    filteredOptions = productSmallOptions.filter(item => 
      item.value == '2' || item.value == '4'
    );
  } else if (value == 1) {
    // 如果产品大类code等于1，筛选小类中code等于1和3的
    filteredOptions = productSmallOptions.filter(item => 
      item.value == '1' || item.value == '3'
    );
  } else {
    // 其他情况显示所有小类
    filteredOptions = productSmallOptions;
  }
  
  setFilteredProductSmallOptions(filteredOptions);
  
  // 清空产品小类的选择
  bankCardForm.setFieldsValue({ productSmall: undefined });
};


  // 打开添加黑名单弹窗
  const handleAddBlacklist = (record: Merchant) => {
    console.log('record', record);
    setCurrentRecord(record);
    setAddBlacklistVisible(true);
    addBlacklistForm.resetFields();
  };

  // 提交添加黑名单
  const handleAddBlacklistSubmit = async (values: any) => {
    try {
      setLoading(true);
      const params = {
        vendorId: currentRecord.id,
        reason: values.reason,
        status: 1,
        vendorName: currentRecord.name,
      };
      
      const res = await AddBlackListApi(params);
      if (res) {
        message.success('添加黑名单成功');
        setAddBlacklistVisible(false);
        addBlacklistForm.resetFields();
        // 刷新列表
        fetchData(1, 10);
      } else {
        message.error('添加黑名单失败');
      }
    } catch (error) {
      console.error('添加黑名单失败:', error);
      message.error('添加黑名单失败');
    } finally {
      setLoading(false);
    }
  };

  // 取消添加黑名单
  const handleAddBlacklistCancel = () => {
    setAddBlacklistVisible(false);
    addBlacklistForm.resetFields();
  };
  const handleAddToBlacklist = (record: Merchant) => {
    Modal.confirm({
      title: '确认加入黑名单',
      content: `确定要将商家"${record.name}"加入黑名单吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const params = {
            vendorId: record.id,
            reason: '添加到黑名单',
            status: 1,
          };
          await AddBlackListApi(params);
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
      
      if (!selectedTags || selectedTags.length === 0) {
        message.warning('请选择或输入标签');
        return;
      }

      // 检查选中的标签是否为新标签（没有ID的标签）
      const selectedTag = tagOptions.find(tag => tag.value === selectedTags[0]);
      const isNewTag = selectedTag && !selectedTag.value.toString().includes('-') && selectedTag.isNew;

      if (isNewTag) {
        // 如果是新标签，先创建标签
        const createTagRes = await AddTagApi({
          tagName: selectedTag.label,
          tagType: 1,
        });
        const createTagRes2 = await SaveTagRelationApi(
          [
            { tagName: selectedTag.label,
              tagId: createTagRes,
              tagType: 1,
              bizId: selectedMerchant?.id || '',
              
            }
          ]
        );
        console.log(createTagRes, '创建标签')
        console.log(createTagRes, '创建标签')

      } else {
        const createTagRes = await SaveTagRelationApi({
          tagName: selectedTag.label,
          tagId: selectedTag.id || '',
          tagType: 1,
          bizId: selectedMerchant?.id || '',
        });
      }

      
      message.success('标签添加成功');
      fetchData(1, 10);
      setTagModalVisible(false);
      setSelectedTags([]);
      setTagOptions([]);
    } catch (error) {
      console.error('添加标签失败:', error);
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
      fetchData(1, 10);
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

  // 处理新增商家
  const handleAddMerchant = () => {
    setAddModalVisible(true);
    addForm.resetFields();
  };

  // 处理新增商家提交
  const handleAddMerchantSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      const params = {
        customerName: values.customerName,
        mainBusiness: values.mainBusiness,
        venueType: values.venueType,
        totalCapital: values.totalCapital,
        totalDebt: values.totalDebt,
        revenue: values.revenue,
        employeeCount: values.employeeCount,
        mainTradingPartner: values.mainTradingPartner,
        productType: values.productType,
      };

      const res = await AddVendorApi(params);
      
      if (res) {
        message.success('新增商家成功');
        setAddModalVisible(false);
        addForm.resetFields();
        fetchData(); // 刷新列表
      } else {
        message.error('新增失败');
      }
    } catch (error) {
      console.error('新增商家失败:', error);
      message.error('新增失败');
    } finally {
      setLoading(false);
    }
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

  // 修改日费率
  const handleEditDailyRate = (record: Merchant) => {
    setSelectedMerchant(record);
    rateForm.setFieldsValue({
      dailyRate: record.creditLimit // 假设 creditLimit 是当前日费率
    });
    setRateModalVisible(true);
  };

  const handleUpdateDailyRate = async (values: any) => {
  try {
    setLoading(true);
    
    // 调用API更新日费率
    // const res = await UpdateDailyRateApi({
    //   id: selectedMerchant?.id,
    //   dailyRate: values.dailyRate
    // });

    // 模拟成功响应
    const res = { code: 200, msg: '更新成功' };
    
    if (res.code === 200) {
      message.success('日费率更新成功');
      setRateModalVisible(false);
      fetchData(); // 刷新列表
    } else {
      message.error(res.msg || '更新失败');
    }
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
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '统一社会信用代码',
      width:160,
      dataIndex: 'socialCreditCode',
      key: 'socialCreditCode',
    },
    {
      title: '法人姓名',
      dataIndex: 'legalName',
      key: 'legalName',
    },
    {
      title: '法人手机号',
      width:160,
      dataIndex: 'legalMobile',
      key: 'legalMobile',
    },
    {
      title: '签章人',
      dataIndex: 'signerName',
      key: 'signerName',
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName',
    },
    {
      title: '联系人电话',
      dataIndex: 'contactMobile',
      key: 'contactMobile',
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
      title: '服务费日费率',
      dataIndex: 'creditLimit',
      key: 'creditLimit',
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
           <Button type="link" onClick={() => handleEditDailyRate(record)}>
            修改日费率
        </Button>
        <Button type="link" onClick={() => handleAudit(record)}>
            审核
        </Button>
          <Button type="link" onClick={() => handleAddTag(record)}>
            新增标签
          </Button>
          {record.status !== '黑名单' && (
            <Button type="link" onClick={() => handleAddBlacklist(record)}>
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
      // 调用真实的API接口
      const response = await GetTagListApi({
        page: 1,
        pageSize: 100,
        tagName: searchText || undefined
      });
      console.log(response, '标签数据')
      if (response && response.result) {
        // 转换API返回的数据格式
        const tagData = response.result.map((item: any) => ({
          value: item.id,
          label: item.tagName,
          color: item.color || 'blue'
        }));
        
        // 如果有搜索文本且不在现有标签中，添加新标签选项
        if (searchText && !tagData.some((tag: any) => tag.label.toLowerCase() === searchText.toLowerCase())) {
          tagData.unshift({
            value: searchText,
            label: searchText,
            color: 'green',
            isNew: true
          });
        }
        
        setTagOptions(tagData);
      } else {
        // 如果API没有返回数据，但有搜索文本，添加新标签选项
        if (searchText) {
          setTagOptions([{
            value: searchText,
            label: searchText,
            color: 'green',
            isNew: true
          }]);
        } else {
          setTagOptions([]);
        }
      }
    } catch (error) {
      console.error('获取标签列表失败:', error);
      message.error('获取标签列表失败');
      
      // 如果API调用失败，但有搜索文本，添加新标签选项
      if (searchText) {
        setTagOptions([{
          value: searchText,
          label: searchText,
          color: 'green',
          isNew: true
        }]);
      } else {
        setTagOptions([]);
      }
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
                <Button type="primary" onClick={handleAddMerchant}>
                  新增商家
                </Button>
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
              style={{ width: '280px' }}
              placeholder="请选择或搜索标签"
              value={selectedTags.length > 0 ? selectedTags[0] : undefined}
              onChange={(value) => setSelectedTags(value ? [value] : [])}
              onSearch={debouncedFetchTagOptions}
              notFoundContent={fetching ? <Spin size="small" /> : null}
              options={tagOptions}
              optionLabelProp="label"
              optionFilterProp="label"
              showSearch
              allowClear
              filterOption={false}
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
      <Modal
        title="修改日费率"
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
            label="日费率 (%)"
            name="dailyRate"
            rules={[
              { required: true, message: '请输入日费率' },
              { type: 'number', min: 0, max: 100, message: '请输入0~100之间的数值' }
            ]}
          >
            <InputNumber placeholder="请输入日费率 (%)" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
      <AuditModal 
        open={auditModalVisible} 
        onCancel={() => setAuditModalVisible(false)}
        onOk={handleAuditSubmit}
        ></AuditModal>

      {/* 新增商家弹窗 */}
      <Modal
        title="新增商家"
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          addForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={addForm}
          onFinish={handleAddMerchantSubmit}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="客户名"
                rules={[{ required: true, message: '请填写公司名称' }]}
              >
                <Input placeholder="请填写公司名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mainBusiness"
                label="主营业务"
                rules={[{ required: true, message: '请填写主营业务' }]}
              >
                <Input placeholder="请填写主营业务" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="venueType"
                label="经营场地类型"
                rules={[{ required: true, message: '请选择经营场地类型' }]}
              >
                <Select
                  placeholder="请选择经营场地类型"
                  options={venueTypeOptions.map((item: any) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bizCategory"
                label="产品大类"
                rules={[{ required: true, message: '请选择产品大类' }]}
              >
                <Select
                  placeholder="请选择产品大类"
                  options={productOptions}
                  onChange={handleProductCategoryChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bizCategorySub"
                label="产品小类"
                rules={[{ required: true, message: '请选择产品小类' }]}
              >
                <Select
                  placeholder="请先选择产品大类"
                  options={filteredProductSmallOptions}
                  disabled={filteredProductSmallOptions.length === 0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="totalAssets"
                label="资金总额（万）"
                rules={[{ required: true, message: '请输入资金总额' }]}
              >
                <InputNumber
                  placeholder="请输入资金总额"
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="totalLiabilities"
                label="负债总额（万）"
                rules={[{ required: true, message: '请输入负债总额' }]}
              >
                <InputNumber
                  placeholder="请输入负债总额"
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="operatingIncome"
                label="营业收入（万）"
                rules={[{ required: true, message: '请输入营业收入' }]}
              >
                <InputNumber
                  placeholder="请输入营业收入"
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="employeeNum"
                label="员工人数（人）"
                rules={[{ required: true, message: '请输入员工人数' }]}
              >
                <InputNumber
                  placeholder="请输入员工人数"
                  style={{ width: '100%' }}
                  min={1}
                  precision={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mainTradeCompany"
                label="主要交易对手名称"
                rules={[{ required: true, message: '请填写公司名称' }]}
              >
                <Input placeholder="请填写公司名称" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setAddModalVisible(false);
                addForm.resetFields();
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


      {/* 添加黑名单弹窗 */}
      <Modal
        title="添加黑名单"
        open={addBlacklistVisible}
        onOk={() => addBlacklistForm.submit()}
        onCancel={handleAddBlacklistCancel}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={addBlacklistForm}
          layout="inline"
          onFinish={handleAddBlacklistSubmit}
        >
          <Form.Item
            name="reason"
            label="添加黑名单原因"
            rules={[{ required: true, message: '请输入添加黑名单原因' }]}
            style={{ width: '100%' }}
          >
            <Input.TextArea
              placeholder="请输入添加黑名单的原因"
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MerchantList; 
