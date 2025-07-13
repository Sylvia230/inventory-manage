import React, { useState,useEffect } from 'react';
import { Table, Button, Form, Input, Space, Row, Col, Modal, message, Select, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { GetCapitalApi, SaveBusinessConfigApi } from '@/services/capital';
import { GetEnumApi } from '@/services/user';
import { GetContractTemplateApi } from '@/services/contract';
import { GetBusinessConfigApi } from '@/services/capital';
import { id } from '@antv/g2/lib/data/utils/arc/sort';

interface BusinessConfigRecord {
  key: string;
  id: string;
  legalRelationName: string;
  capital: string;
  product: string;
  phone: string;
}

// 合同行数据接口
interface ContractRow {
  key: string;
  templateId: string;
  generateDimension: string;
}

// 签章主体行数据接口
interface SignatureSubjectRow {
  key: string;
  roleId: string;
  merchantId: string;
}

const BusinessConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<BusinessConfigRecord | null>(null);
  const [modalForm] = Form.useForm();
  const [contractRows, setContractRows] = useState<ContractRow[]>([]);
  const [signatureSubjectRows, setSignatureSubjectRows] = useState<SignatureSubjectRow[]>([]);

  // 分页相关状态
  const [dataSource, setDataSource] = useState<BusinessConfigRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 获取资方列表
  const [capitalOptions, setCapitalOptions] = useState<any[]>([]);
  const [productOptions, setProductOptions] = useState<any[]>([]);
  const [productSmallOptions, setProductSmallOptions] = useState<any[]>([]);
  const [filteredProductSmallOptions, setFilteredProductSmallOptions] = useState<any[]>([]);
  const [roleOptions, setRoleOptions] = useState<any[]>([]);
  const [merchantOptions, setMerchantOptions] = useState<any[]>([]);
  const [dimensionOptions, setDimensionOptions] = useState<any[]>([]);
  const [templateOptions, setTemplateOptions] = useState<any[]>([]);
  
  useEffect(() => {
    getCapitalList();
    getProductList();
    getProductSmallList();
    getRoleList();
    getMerchantList();
    getContractTemplateList();
    getGenerateDimensionList();
  }, []);
  
  // 获取数据
  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = async (searchParams?: any) => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        pageSize: pageSize,
        ...searchParams
      };
      
      const res = await GetBusinessConfigApi(params);
      console.log('....fetchData', res);
      if (res?.result) {
        // // 转换API返回的数据格式为页面需要的格式
        // const list = (res.result || []).map((item: any) => ({
        //   key: item.id,
        //   id: item.id,
        //   name: item.name,
        //   capitalId: item.capitalId,
        //   capitalName: item.capitalName,
        //   bizCategory: item.bizCategory,
        //   bizCategorySub: item.bizCategorySub,
        //   term: item.term,
        //   rate: item.rate,
        //   createTime: item.createTime,
        //   updateTime: item.updateTime,
        // }));
        
        setDataSource(res?.result);
        setTotal(res.totalCount || 0);
      } else {
        message.error(res.msg || '获取数据失败');
      }
    } catch (error) {
      console.error('获取业务配置列表失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const getCapitalList = async () => {
    const res = await GetCapitalApi({
      page: 1,
      pageSize: 1000,
    });
    console.log('....getCapitalList', res?.result)
    if (res?.result) {
      setCapitalOptions(res?.result);
    }
  }

  // 获取产品大类
  const getProductList = async () => {
    const res = await GetEnumApi('BizCategoryEnum');
    console.log('....getProductList', res)
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
    console.log('....getProductSmallList', res);
    let productSmallOptionsList:any[] = []
    res?.forEach((item: any) => {
      productSmallOptionsList.push({
        label: item.desc,
        value: item.code,
      })
    })
    setProductSmallOptions(productSmallOptionsList);
  }

  // 获取角色列表
  const getRoleList = async () => {
    const res = await GetEnumApi('SignerRoleEnum');
    console.log('....getRoleList', res);
    let roleOptionsList: any[] = [];
    res?.forEach((item: any) => {
      roleOptionsList.push({
        label: item.desc,
        value: item.code,
      });
    });
    setRoleOptions(roleOptionsList);
  };

  // 获取商家列表
  const getMerchantList = async () => {
    // 模拟商家数据，实际应该调用API
    const mockMerchants = [
      { id: '1', name: '上海汽车销售有限公司' },
      { id: '2', name: '北京汽车贸易集团' },
      { id: '3', name: '广州汽车服务有限公司' },
      { id: '4', name: '深圳汽车销售中心' },
    ];
    setMerchantOptions(mockMerchants);
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
    modalForm.setFieldsValue({ productSmall: undefined });
  };

  // 获取合同模板
  const getContractTemplateList = async () => {
    const res = await GetContractTemplateApi({
      page: 1,
      pageSize: 1000,
    });
    console.log('....getContractTemplateList', res);
    let templateOptionsList:any[] = []
    res?.result?.forEach((item: any) => {
      templateOptionsList.push({
        label: item.name,
        value: item.id, 
      })
    })
    setTemplateOptions(templateOptionsList);
  }

  // 获取生成维度
  const getGenerateDimensionList = async () => {
    const res = await GetEnumApi('BizConfigContractTemplateScopeEnum');
    console.log('....getGenerateDimensionList', res);
    let generateDimensionOptionsList:any[] = []
    res?.forEach((item: any) => {
      generateDimensionOptionsList.push({
        label: item.desc,
        value: item.code,
      })
    })
    setDimensionOptions(generateDimensionOptionsList);
  }

  // // 合同模板选项
  // const templateOptions = [
  //   { label: '标准购车合同', value: 'template_001' },
  //   { label: '融资租赁合同', value: 'template_002' },
  //   { label: '服务合同', value: 'template_003' },
  // ];

  // // 生成维度选项
  // const dimensionOptions = [
  //   { label: '按车辆', value: 'by_vehicle' },
  //   { label: '按订单', value: 'by_order' },
  //   { label: '按客户', value: 'by_customer' },
  // ];

  // 签章主体表格列定义
  const signatureSubjectColumns: ColumnsType<SignatureSubjectRow> = [
    {
      title: '角色',
      dataIndex: 'roleId',
      key: 'roleId',
      width: 200,
      render: (value, record) => (
        <Select
          value={value}
          placeholder="请选择角色"
          options={roleOptions}
          style={{ width: '100%' }}
          onChange={(val) => handleSignatureSubjectFieldChange(record.key, 'roleId', val)}
        />
      ),
    },
    {
      title: '商家',
      dataIndex: 'merchantId',
      key: 'merchantId',
      width: 300,
      render: (value, record) => (
        <Select
          value={value}
          placeholder="请选择商家"
          options={merchantOptions.map((item: any) => ({
            label: item.name,
            value: item.id,
          }))}
          style={{ width: '100%' }}
          onChange={(val) => handleSignatureSubjectFieldChange(record.key, 'merchantId', val)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          danger
          size="small"
          onClick={() => handleDeleteSignatureSubjectRow(record.key)}
        >
          删除
        </Button>
      ),
    },
  ];

  // 合同表格列定义
  const contractColumns: ColumnsType<ContractRow> = [
    {
      title: '合同模板',
      dataIndex: 'templateId',
      key: 'templateId',
      width: 200,
      render: (value, record) => (
        <Select
          value={value}
          placeholder="请选择合同模板"
          options={templateOptions}
          style={{ width: '100%' }}
          onChange={(val) => handleContractFieldChange(record.key, 'templateId', val)}
        />
      ),
    },
    {
      title: '生成维度',
      dataIndex: 'scope',
      key: 'scope',
      width: 200,
      render: (value, record) => (
        <Select
          value={value}
          placeholder="请选择生成维度"
          options={dimensionOptions}
          style={{ width: '100%' }}
          onChange={(val) => handleContractFieldChange(record.key, 'scope', val)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          danger
          size="small"
          onClick={() => handleDeleteContractRow(record.key)}
        >
          删除
        </Button>
      ),
    },
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
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '资方',
      dataIndex: 'capitalName',
      key: 'capitalName',
      width: 150,
    },
    {
      title: '产品大类',
      dataIndex: 'bizCategoryDesc',
      key: 'bizCategoryDesc',
      width: 120,
    },
    {
      title: '产品子类',
      dataIndex: 'bizCategorySubDesc',
      key: 'bizCategorySubDesc',
      width: 120,
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
  // 新增
  const handleAdd = () => {
    setIsEdit(false);
    setCurrentRecord(null);
    modalForm.resetFields();
    setContractRows([]); // 清空合同行
    setSignatureSubjectRows([]); // 清空签章主体行
    setFilteredProductSmallOptions([]); // 清空筛选后的小类选项
    setIsModalVisible(true);
  };

  // 编辑
  const handleEdit = (record: any) => {
    console.log('handleEdit', record);
    setIsEdit(true);
    setCurrentRecord(record);
    // 提取合同配置和签章主体数据
  const contractData = record.configContractTemplateList?.map((item: any) => ({
    key: item.id,
    templateId: item.contractTemplateId,
    scope: item.scope,
  })) || [];

  const signatureSubjectData = record.fixedSignerList?.map((item: any) => ({
    key: item.id,
    roleId: item.signerRole,
    merchantId: item.vendorId,
  })) || [];

  // 设置表单初始值
  modalForm.setFieldsValue({
    name: record.name,
    capitalId: record.capitalId,
    bizCategory: record.bizCategory,
    bizCategorySub: record.bizCategorySub,
    term: record.term,
    rate: record.rate,
  });
  
  // 更新下拉筛选选项（根据产品大类）
  handleProductCategoryChange(record.bizCategory);
  // 回填合同配置和签章主体数据
  setContractRows(contractData);
  setSignatureSubjectRows(signatureSubjectData);
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

  // 添加合同行
  const handleAddContractRow = () => {
    const newRow: ContractRow = {
      key: Date.now().toString(),
      templateId: '',
      generateDimension: '',
    };
    setContractRows([...contractRows, newRow]);
  };

  // 删除合同行
  const handleDeleteContractRow = (key: string) => {
    setContractRows(contractRows.filter(row => row.key !== key));
  };

  // 处理合同字段变更
  const handleContractFieldChange = (key: string, field: any, value: string) => {
    setContractRows(prev => 
      prev.map(row => 
        row.key === key ? { ...row, [field]: value } : row
      )
    );
  };

  // 添加签章主体行
  const handleAddSignatureSubjectRow = () => {
    const newRow: SignatureSubjectRow = {
      key: Date.now().toString(),
      roleId: '',
      merchantId: '',
    };
    setSignatureSubjectRows([...signatureSubjectRows, newRow]);
  };

  // 删除签章主体行
  const handleDeleteSignatureSubjectRow = (key: string) => {
    setSignatureSubjectRows(signatureSubjectRows.filter(row => row.key !== key));
  };

  // 处理签章主体字段变更
  const handleSignatureSubjectFieldChange = (key: string, field: keyof SignatureSubjectRow, value: string) => {
    setSignatureSubjectRows(prev => 
      prev.map(row => 
        row.key === key ? { ...row, [field]: value } : row
      )
    );
  };

  // 搜索
  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      console.log('搜索条件:', values);
      setLoading(true);
      fetchData();
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

  // 处理Modal确认
  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields();
      console.log('业务配置数据:', values);
      console.log('合同数据:', contractRows);
      console.log('签章主体数据:', signatureSubjectRows);
      
      // 验证合同数据
      if (contractRows.length === 0) {
       
        message.error('请至少添加一个合同配置');
        return;
      }

      // const hasEmptyContractFields = contractRows.some(row => !row.templateId || !row.generateDimension);
      // if (hasEmptyContractFields) {
      //   message.error('请完善所有合同配置信息');
      //   return;
      // }

      // 验证签章主体数据
      if (signatureSubjectRows.length === 0) {
        message.error('请至少添加一个签章主体');
        return;
      }

      // const hasEmptySignatureFields = signatureSubjectRows.some(row => !row.roleId || !row.merchantId);
      // if (hasEmptySignatureFields) {
      //   message.error('请完善所有签章主体信息');
      //   return;
      // }

      let configContractTemplateList:any[] =   []
      let fixedSignerList:any[] = []

      contractRows?.forEach((row: any) => {
        console.log('....row', row, dimensionOptions);
        let selectedDimension = dimensionOptions.find((item: any) => item.value == row.scope);
         if(isEdit) {
           configContractTemplateList.push({   
            contractTemplateId: row.templateId || '',
            scope: row.scope || '',
            scopeDesc: selectedDimension?.label || '',
            id: row.key || '',
          })
        } else {
          configContractTemplateList.push({   
            contractTemplateId: row.templateId || '',
            scope: row.scope || '',
            scopeDesc: selectedDimension?.label || '',
          })
        }
      })

      if(signatureSubjectRows.length) {
        signatureSubjectRows.forEach((row: any) => {
          let selectedRole = roleOptions.find((item: any) => item.value == row.roleId);
          let selectedMerchant = merchantOptions.find((item: any) => item.value == row.merchantId);
           if(isEdit) {
              fixedSignerList.push({  
              signerRole: row.roleId  || '',
              signerRoleDesc: selectedRole?.label || '',
              vendorId: row.merchantId || '',
              vendorName: selectedMerchant?.label || '',
              id: row.key
            })
           } else {
            fixedSignerList.push({  
              signerRole: row.roleId  || '',
              signerRoleDesc: selectedRole?.label || '',
              vendorId: row.merchantId || '',
              vendorName: selectedMerchant?.label || '',
            })
           }
          
        })
      }
      let params:any = {
        name: values.name,
        capitalId: values.capitalId,
        bizCategory: values.bizCategory,
        bizCategorySub: values.bizCategorySub,
        term: values.term,
        rate: values.rate,
        configContractTemplateList:configContractTemplateList,
        fixedSignerList:fixedSignerList
      }
      if(isEdit) {
        params.id = currentRecord?.id
      }
      const res = await SaveBusinessConfigApi(params);
      console.log('....保存业务配置', res);

      message.success(isEdit ? '修改成功' : '新增成功');
      fetchData();
      setIsModalVisible(false);
      modalForm.resetFields();
      setContractRows([]);
      setSignatureSubjectRows([]);
      setFilteredProductSmallOptions([]);
    } catch (error) {
      console.error('表单验证失败:', error);
      message.error('请检查输入内容');
    }
  };

  // 处理Modal取消
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setCurrentRecord(null);
    modalForm.resetFields();
    setContractRows([]);
    setSignatureSubjectRows([]);
    setFilteredProductSmallOptions([]);
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
                options={capitalOptions.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                }))}
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
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={1000}
        destroyOnClose
      >
        <Form
          form={modalForm}
          layout="vertical"
          initialValues={currentRecord || {}}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="法律关系名称"
                rules={[{ required: true, message: '请输入法律关系名称' }]}
              >
                <Input placeholder="请输入法律关系名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="capitalId"
                label="资方"
                rules={[{ required: true, message: '请选择资方' }]}
              >
                <Select
                  placeholder="请选择资方"
                  options={capitalOptions.map((item: any) => ({
                    label: item.name,
                    value: item.id,
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
            <Col span={12}>
              <Form.Item
                name="term"
                label="天数"
                rules={[{ required: true, message: '请输入周期天数' }]}
              >
                <InputNumber placeholder="请输入天数" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="rate"
                label="年化利率百分比"
                rules={[{ required: true, message: '请输入年化利率百分比' }]}
              >
                <InputNumber placeholder="年化利率" style={{ width: '100%' }}/>
              </Form.Item>
            </Col>
          </Row>

          {/* 合同配置区域 */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4 style={{ margin: 0 }}>合同配置</h4>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddContractRow}
              >
                新增一组合同
              </Button>
            </div>
            
            <Table
              columns={contractColumns}
              dataSource={contractRows}
              pagination={false}
              size="small"
              locale={{
                emptyText: '暂无合同配置，请点击"新增一组合同"添加',
              }}
              rowKey="key"
            />
          </div>

          {/* 签章主体配置区域 */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4 style={{ margin: 0 }}>签章主体配置</h4>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddSignatureSubjectRow}
              >
                添加签章人
              </Button>
            </div>
            
            <Table
              columns={signatureSubjectColumns}
              dataSource={signatureSubjectRows}
              pagination={false}
              size="small"
              locale={{
                emptyText: '暂无签章主体配置，请点击"添加签章人"添加',
              }}
              rowKey="key"
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BusinessConfig; 