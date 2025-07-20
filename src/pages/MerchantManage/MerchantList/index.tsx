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
  Upload, Image,Descriptions, Tabs, Empty
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from '../index.module.less';
import debounce from 'lodash/debounce';
import AuditModal from '../components/AuditModal';
import {EyeOutlined, UploadOutlined} from "@ant-design/icons";
import axios from 'axios';
import { GetVendorListApi, AddBlackListApi, AddTagApi, GetTagListApi, SaveTagRelationApi,saveVendorApi,DetailAPi } from '@/services/merchant';

import {
  getBankBranchListApi,
  getBankListApi,
  saveBankCardApi
} from '@/services/finance';
import { GetEnumApi } from '@/services/user';
import {UploadFile} from "antd/es/upload/interface";

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

interface BankRecord {
  id: string;
  bankCode: string;
  bankName: string;
}


interface VendorRecord{
  //基本信息
  id: string;
  name: string;
  address: string;
  mainBusiness: string;
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
  statusDesc: string;

  //额度信息
  creditInfo?:{
    vendorId: string;
    bizCategory: number;
    bizCategoryDesc: string;
    bizCategorySub: number;
    bizCategorySubDesc: string;
    creditAmount: number;
    creditAmountStr: string
    usedCreditAmount: number;
    usedCreditAmountStr: string
    remainingCreditAmount: number;
    remainingCreditAmountStr: string
  }[];
  //银行卡信息
  bankCardInfo?:{
    accountName: String;
    bankAccount: String;
    bankName: String;
    bankBranchName: String;
  }[];
  //图片信息
  imgInfo?: string[];
  //文件信息
  fileInfo?:{
    path: string;
    fileName: string;
  }[];
  //框架协议
}

// 添加车辆详情弹窗组件
interface VendorDetailModalProps {
  visible: boolean;
  onCancel: () => void;
  data: VendorRecord | null;
  loading?: boolean;
}

const MerchantList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [auditForm] = Form.useForm();
  const [bankCardForm] = Form.useForm();
  const [tagModalVisible, setTagModalVisible] = useState(false);
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

   //银行卡相关
  const [addBankCardVisible, setAddBankCardVisible] = useState(false);
  const [bankList, setBankList] = useState<Array<BankRecord>>([]);
  const [bankCode, setBankCode] = useState<string>('');
  const [loadingBank, setLoadingBank] = useState(false);
  const [bankBranchList, setBankBranchList] = useState<Array<{value: string, name: string}>>([]);
  const [loadingBankBranch, setLoadingBankBranch] = useState(false);

  //详情
  const [vendorDetailVisible, setVendorDetailVisible] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [vendorDetail, setVendorDetail] = useState<VendorRecord | null>(null);

  const [fileList, setFileList] = React.useState<UploadFile[]>([]);

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


  const getDetail =  async (id:String) => {
    setLoadingDetail(true);
    try {
      const res = await DetailAPi(id);
      console.log(res, 'response');
      setVendorDetail(res);
    }  catch (error) {
      console.error('获取商家详情数据失败:', error);
      message.error('获取商家详情数据失败');
    } finally {
      setLoadingDetail(false);
    }
  }

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

  const handleCancel = () => {
    setAuditModalVisible(false);
    setSelectedMerchant(null);
    addForm.resetFields();
  };


  const handleAddBankCard = (record: Merchant) => {
    setSelectedMerchant(record);
    setAddBankCardVisible(true);
    getBankList();
    bankCardForm.setFieldsValue(record);

  };

  const handleVendorDetail = (record: Merchant) => {
    setVendorDetailVisible(true);
    getDetail(record.id);
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
          {!record.inBlackList && (
            <Button type="link" onClick={() => handleAddBlacklist(record)}>
              添加黑名单
            </Button>
          )}
          <Button type="link" onClick={() => handleAddBankCard(record)}>
            添加银行卡
          </Button>
          <Button type="link" onClick={() => handleVendorDetail(record)}>
            查看详情
          </Button>
        </div>
      ),
    },
  ];

  const handleBankCardCancel = async () => {
    setAddBankCardVisible(false);
    setSelectedMerchant(null);
    bankCardForm.resetFields();
  }

  const addBankCardSubmit = async () => {
    try {
      let values = await bankCardForm.validateFields();
      console.log('保存银行卡:', values);
      // TODO: 实现保存逻辑
      let bankId = values.bankId;
      let bank:any = bankList.find((item: any) => item.id === bankId);
      values.bankName = bank.bankName;
      let bankBranchId = values.bankBranchId;
      let bankBranch:any = bankBranchList.find((item: any) => item.id === bankBranchId);
      values.bankBranchName = bankBranch.bankName;
      let ownerId = selectedMerchant?.id;
      values.ownerName = selectedMerchant?.name;
      values.accountName = selectedMerchant?.name;
      values.ownerId =ownerId;
      values.purposeList = [1];
      values.ownerType = 1;

      await saveBankCardApi(values);
      message.success('保存成功');
      setAddBankCardVisible(false);
      setSelectedMerchant(null);
      bankCardForm.resetFields();
      fetchData(); // 刷新列表
      getBankList();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

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

  const handleBankSearch  = debounce((inputValue: string) =>{
    if (/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/.test(inputValue)) {
      // alert(inputValue.length)
      getBankList({bankName:inputValue});
    }
  },400)

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

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: UploadFile) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };


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

      <Modal
          title='新增银行卡'
          open={addBankCardVisible}
          onOk={addBankCardSubmit}
          onCancel={handleBankCardCancel}
          width={600}
      >
        <Form
            form={bankCardForm}
            layout="vertical"
            requiredMark={false}
        >

          <Form.Item
              name="name"
              label="户名"
              style={{ width: '100%' }}
          >
            <Input placeholder="请输入账户" />
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
            layout="vertical"
        >
          <Col span={24}>
            <Form.Item
                name="name"
                label="客户名"
                rules={[{ required: true, message: '请填写公司名称' }]}
            >
              <Input placeholder="请填写公司名称" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
                name="address"
                label="经营场地"
                rules={[{ required: true, message: '请填写经营场地' }]}
            >
              <Input placeholder="请填写经营场地" />
            </Form.Item>
          </Col>


          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="totalAssets"
                label="注册资本（万）"
                rules={[{ required: true, message: '请输入注册资本' }]}
              >
                <InputNumber
                  placeholder="请输入注册资本"
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="legalName"
                label="法人代表"
                rules={[{ required: true, message: '请输入法人代表' }]}
              >
                <Input
                  placeholder="请输入法人代表"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
              label="主营业务"
              name="mainBusiness"
              rules={[{ required: true, message: '请输入主营业务' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入主营业务" style={{width: '600px'}}/>
          </Form.Item>

          <Form.Item
              label="营业执照"
              name="businessLicense"
              rules={[{ required: true}]}
          >
            <Upload
                {...uploadProps}
                listType="picture"
                maxCount={1}
                accept="image/*"
            >
              <Button icon={<UploadOutlined />}>上传营业执照</Button>

            </Upload>
          </Form.Item>

          <Form.Item
              label="备注"
              name="remark"
              rules={[{ required: true, message: '请输入备注' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入备注" style={{width: '600px'}}/>
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

      <VendorDetailModal
          visible={vendorDetailVisible}
          onCancel={() => setVendorDetailVisible(false)}
          data={vendorDetail}
          loading={loadingDetail}
      />
    </div>
  );
};

const VendorDetailModal: React.FC<VendorDetailModalProps> = ({ visible, onCancel, data, loading }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  if (!data) return null;

  // 处理图片预览
  const handleImagePreview = (url: string, title: string = '照片预览') => {
    setPreviewImage(url);
    setPreviewTitle(title);
    setPreviewVisible(true);
  };

  // 照片Tab内容
  const renderImages = () => (
      <div className={styles.photoGrid}>
        {data.imgInfo?.map((url, index) => (
            <div key={index} className={styles.photoItem}>
              <div className={styles.photoLabel}>图片 {index + 1}</div>
              <div className={styles.photoWrapper} onClick={() => handleImagePreview(url, `图片 ${index + 1}`)}>
                <img src={url} alt={`图片 ${index + 1}`} />
                <div className={styles.photoOverlay}>
                  <EyeOutlined />
                </div>
              </div>
            </div>
        )) || (
            <Empty description="暂无图片材料" />
        )}
      </div>
  );

  const tabItems = [
    {
      key: 'image',
      label: (
          <span>
          <h3>图片材料</h3>
            {data.imgInfo?.length ? (
                <Tag color="red" style={{ marginLeft: 8 }}>
                  {data.imgInfo.length}
                </Tag>
            ) : null}
        </span>
      ),
      children: renderImages(),
    },
  ];

  const columnsBankCard: ColumnsType<any> = [
    {
      title: '户名',
      dataIndex: 'accountName',
      width: 160,
    },
    {
      title: '账号',
      dataIndex: 'bankAccount',
      width: 140,
    },
    {
      title: '银行',
      dataIndex: 'bankName',
      width: 150,
    },
    {
      title: '支行',
      dataIndex: 'bankBranchName',
      width: 150,
    },
  ];

  const columnsCredit: ColumnsType<any> = [
    {
      title: '户名',
      dataIndex: 'accountName',
      width: 180,
    },
    {
      title: '账号',
      dataIndex: 'bankAccount',
      width: 200,
    },
    {
      title: '银行',
      dataIndex: 'bankName',
      width: 120,
    },
    {
      title: '支行',
      dataIndex: 'bankBranchName',
      width: 120,
    },
  ];

  return (
      <Modal
          title="商家详情"
          open={visible}
          onCancel={onCancel}
          width={1000}
          confirmLoading={loading}
          footer={[
            <Button key="close" onClick={onCancel}>
              关闭
            </Button>
          ]}
      >
        <div className={styles.detailContent}>
          {/* 商家基本信息 */}
          <Descriptions
              title={<div className={styles.sectionTitle}>商家信息</div>}
              bordered
              column={2}
              size="small"
              className={styles.descriptionSection}
          >
            <Descriptions.Item label="商家名称">{data.name}</Descriptions.Item>
            <Descriptions.Item label="统一社会信用代码">{data.socialCreditCode}</Descriptions.Item>
            <Descriptions.Item label="法定代表人">{data.legalName || '-'}</Descriptions.Item>
            <Descriptions.Item label="联系人">{data.contactName || '-'}</Descriptions.Item>
            <Descriptions.Item label="注册地址">{data.address || '-'}</Descriptions.Item>
            <Descriptions.Item label="主营范围">{data.mainBusiness || '-'}</Descriptions.Item>
            <Descriptions.Item label="状态">{data.statusDesc || '-'}</Descriptions.Item>
          </Descriptions>

          <div className={styles.vehicleTable}>
            <h3>银行卡信息</h3>
            <Table
                columns={columnsBankCard}
                dataSource={data?.bankCardInfo}
                pagination={false}
                scroll={{ x: 1000 }}
            />
          </div>

          <div className={styles.vehicleTable}>
            <h3>额度信息</h3>
            <Table
                columns={columnsCredit}
                dataSource={data?.creditInfo}
                pagination={false}
                scroll={{ x: 1000 }}
            />
          </div>

          {/* 照片展示区域改为Tab形式 */}
          <div className={styles.photoSection}>
            {/*<div className={styles.sectionTitle}>图片材料</div>*/}
            <Tabs
                items={tabItems}
                className={styles.photoTabs}
            />
          </div>
        </div>

        {/* 照片预览模态框 */}
        <Modal
            open={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewVisible(false)}
            width={800}
        >
          <Image
              alt={previewTitle}
              style={{ width: '100%' }}
              src={previewImage}
          />
        </Modal>
      </Modal>
  );
}

export default MerchantList; 
