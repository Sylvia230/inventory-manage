import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Space, Row, Col, Modal, message, Select, Tag, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined
} from '@ant-design/icons';
import styles from './index.module.less';
import {
  GetCreditLimitListApi,
  DeleteCreditLimitApi,
  GetVendorListApi,
  SaveCreditLimitApi,
  RemoveBlackListApi
} from '@/services/merchant';
import debounce from "lodash/debounce";
import {GetEnumApi} from "@/services/user.ts";
import {angle} from "@antv/g2/lib/utils/vector";

// 授信额度记录接口
interface CreditLimitRecord {
  id: string;
  key: string;
  merchantId: string;
  vendorName: string;
  productType: string;
  capitalId: string;
  capitalName: string;
  creditLimit: number;
  usedLimit: number;
  availableLimit: number;
  status: number;
  createTime: string;
  updateTime: string;
}

const CreditLimit: React.FC = () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<CreditLimitRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<CreditLimitRecord | null>(null);

  //新增额度
  const [loadingVendorList, setLoadingVendorList] = useState(false);
  const [vendorList, setVendorList] = useState<Array<any>>([]);
  const [productTypeList, setProductTypeList] = useState<Array<any>>([]);

  //调整额度
  const [updateCreditVisible, setUpdateCreditVisible] = useState(false);

  // 产品类型选项
  const productTypeOptions = [
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

  // 状态选项
  const statusOptions = [
    { label: '正常', value: 'active' },
    { label: '停用', value: 'inactive' },
    { label: '待审核', value: 'pending' },
  ];

  // 获取数据
  useEffect(() => {
    fetchData();
    fetchVendorList();
    fetchProductList();
  }, [currentPage, pageSize]);

  const fetchProductList = async () => {
    try {
      const productList = await GetEnumApi('BizCategorySubEnum');
      setProductTypeList(productList);
    } catch (error) {
      console.error('获取产品类型数据失败:', error);
      message.error('获取产品类型数据失败');
    }

  }
  const fetchVendorList = async (name?:string) => {
    setLoadingVendorList(true)
    try {
      const res = await GetVendorListApi({pageSize:1000,name:name});
      setVendorList(res.result);
    } catch (error) {
      console.error('获取商家数据失败:', error);
      message.error('获取商家数据失败');
    } finally {
      setLoadingVendorList(false);
    }

  }

  const fetchData = async (searchParams?: any) => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        pageSize: pageSize,
        ...searchParams
      };
      
      // 调用授信额度列表API
      const res = await GetCreditLimitListApi(params);
      console.log('授信额度列表', res);
      setDataSource(res.result);
      setTotal(res.totalCount || 0);
    } catch (error) {
      console.error('获取授信额度列表失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 表格列定义
  const columns: ColumnsType<CreditLimitRecord> = [
    {
      title: '商家名称',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: 150,
    },
    {
      title: '产品类型',
      dataIndex: 'bizCategorySubDesc',
      key: 'bizCategorySubDesc',
      width: 90,
    },
    {
      title: '授信额度',
      dataIndex: 'creditAmountStr',
      key: 'creditAmountStr',
      width: 90,
    },
    {
      title: '已用额度',
      dataIndex: 'usedCreditAmountStr',
      key: 'usedCreditAmountStr',
      width: 90,
    },
    {
      title: '剩余额度',
      dataIndex: 'remainingCreditAmountStr',
      key: 'remainingCreditAmountStr',
      width: 90,
    },
    {
      title: '状态',
      dataIndex: 'statusDesc',
      key: 'statusDesc',
      width: 90,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 60,
      render: (_, record) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Button 
            size="small"
            type="link" 
            onClick={() => handleEdit(record)}
          >
            调整额度
          </Button>
            {
                record.status === 1 &&
              <Button
                  type="link"
                  size="small"
                  danger
                  onClick={() => handleFrozen(record)}
              >
                冻结
              </Button>
            }

            {
                record.status === 2 &&  <Button
                    type="link"
                    size="small"
                    onClick={() => handleEnable(record)}
                >
                  启用
                </Button>
            }
          </div>
      ),
    },
  ];


  // 处理编辑
  const handleEdit = (record: CreditLimitRecord) => {
    setCurrentRecord(record);
    setUpdateCreditVisible(true);
  };

  const handleFrozen = async (record: CreditLimitRecord) => {
    Modal.confirm({
      title: '确认冻结额度',
      content: `确定要将商家"${record.vendorName}"额度冻结吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const params = {
            id: record?.id,
            status: 2,
          };
          await SaveCreditLimitApi(params);
          fetchData();
          message.success("冻结成功")
        } catch (error) {
          message.error('操作失败');
        } finally {
          setLoading(false);
        }
      },
    });
  }

  const handleEnable = async (record: CreditLimitRecord) => {
    Modal.confirm({
      title: '确认启用额度',
      content: `确定要将商家"${record.vendorName}"额度启用吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const params = {
            id: record?.id,
            status: 1,
          };
          await SaveCreditLimitApi(params);
          fetchData();
          message.success("启用成功")
        } catch (error) {
          message.error('操作失败');
        } finally {
          setLoading(false);
        }
      },
    });
  }



  //处理额度调整的提交
  const updateCreditSubmit = async () => {
    try {
      const values = await updateForm.validateFields();
      console.log("v",values);
      const params = {
        id: currentRecord?.id,
        creditAmount: values?.creditAmount * 100,
      };
      await SaveCreditLimitApi(params);
      fetchData();
      message.success("额度调整成功")
    } catch (error) {
      message.error("额度调整异常")
    } finally {
      updateForm.resetFields();
      setUpdateCreditVisible(false);
    }
  }

  // 处理删除
  const handleDelete = (record: CreditLimitRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除商家"${record.merchantName}"的授信额度记录吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await DeleteCreditLimitApi({ id: record.id });
          if (res) {
            message.success('删除成功');
            fetchData();
          } else {
            message.error('删除失败');
          }
        } catch (error) {
          console.error('删除授信额度失败:', error);
          message.error('删除失败');
        }
      },
    });
  };

  // 处理搜索
  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      console.log('搜索条件:', values);
      setCurrentPage(1);
      fetchData(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleAdd = () => {
    setAddModalVisible(true);
    addForm.resetFields();
  }

  const handleAddSubmit = async () => {
    try {
      let values = await addForm.validateFields();
      let vendor = vendorList.find((item: any) => item.id === values.vendorId);
      values.vendorName = vendor.name;
      values.creditAmount = values?.creditAmount * 100;
      await SaveCreditLimitApi(values);
      message.success("保存成功");
      setAddModalVisible(false);
      fetchData();
      addForm.resetFields();
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  }

  const handleVendorSearch  = debounce((inputValue: string) =>{
    if (/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/.test(inputValue)) {
      // alert(inputValue.length)
      fetchVendorList(inputValue);
    }
  },400)

  const handleCancle = () => {
    setAddModalVisible(false);
    addForm.resetFields();
  }

  // 处理重置
  const handleReset = () => {
    form.resetFields();
    setCurrentPage(1);
    fetchData();
  };

  // 处理分页变化
  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
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
              name="vendorName"
              label="商家名称"
            >
              <Input placeholder="请输入商家名称" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="bizCategorySub"
              label="产品类型"
            >
              <Select
                placeholder="请选择产品类型"
                allowClear
                options={productTypeList.map((item:any) => ({
                  label:item.desc,
                  value:item.code
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} style={{ width: '100%' }}>

          <Col span={16}>
            <Space>
              <Button icon={<SearchOutlined />} type="primary" htmlType="submit" loading={loading}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button 
                icon={<PlusOutlined />} 
                type="primary"
                onClick={handleAdd}
              >
                新增授信额度
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
        onChange={handleTableChange}
        scroll={{ x: 1100 }}
        rowKey="id"
      />


      <Modal
        title="添加额度"
        open={addModalVisible}
        onOk={handleAddSubmit}
        onCancel={handleCancle}
        width={800}
      >
        <Form
            form={addForm}
            layout="vertical"
            requiredMark={false}
        >
          <Form.Item
              name="vendorId"
              label="商家"
              style={{ width: '100%' }}
          >
            <Select
                showSearch
                allowClear
                loading={loadingVendorList}
                filterOption={false}
                onSearch={handleVendorSearch}
                placeholder="请选择商家"
                options={vendorList.map((item:any) => ({
                  label:item.name,
                  value:item.id
                }))}
            />
          </Form.Item>

          <Form.Item
              name="bizCategorySub"
              label="产品类型"
              style={{ width: '100%' }}
          >
            <Select
                showSearch
                allowClear
                loading={loadingVendorList}
                filterOption={false}
                placeholder="请选择产品类型"
                options={productTypeList.map((item:any) => ({
                  label:item.desc,
                  value:item.code
                }))}
            />
          </Form.Item>

          <Form.Item
              name="creditAmount"
              label="额度（元）"
              rules={[
                { required: true, message: '请输入授信额度' },
                { pattern: /^\d{1,19}$/, message: '请输入数字' }
              ]}
              style={{ width: '100%' }}
          >
            <Input placeholder="请输入授信额度" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
          title="调整额度"
          open={updateCreditVisible}
          onOk={updateCreditSubmit}
          onCancel={() => {
            setUpdateCreditVisible(false);
            updateForm.resetFields();
          }}
          okText="确定"
          cancelText="取消"
      >
        <Form form={updateForm} layout="vertical">
          <Form.Item
              label="授信额度（元）"
              name="creditAmount"
              rules={[
                { required: true, message: '请输入授信额度' },
                { type: 'number', min: 0, max: 100000000000, message: '请输入数值' }
              ]}
          >
            <InputNumber placeholder="请输入授信额度（元）" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreditLimit; 