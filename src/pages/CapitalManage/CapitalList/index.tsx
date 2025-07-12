import React, { useState, useEffect } from 'react';
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
import { GetCapitalApi, AddCapitalApi, DeleteCapitalApi } from '@/services/capital';

interface CapitalRecord {
  key: string;
  capitalId: string;
  name: string;
  type: string;
  signatory: string;
  phone: string;
  legalPerson: string;
  shortName?: string; // 资方简称
  socialCreditCode?: string; // 统一社会信用代码
}

const CapitalList: React.FC = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm(); // 为Modal创建独立的form实例
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState<any>(null);


    // 分页相关状态
    const [dataSource, setDataSource] = useState<any>([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [signerTypeOptions, setSignerTypeOptions] = useState<any[]>([]);

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
      dataIndex: 'id',
      key: 'id',
      width: 180,
    },
    {
      title: '资方名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '资方简称',
      dataIndex: 'shortName',
      key: 'shortName',
      width: 200,
    },
    {
      title: '统一社会码',
      dataIndex: 'socialCreditCode',
      key: 'socialCreditCode',
      width: 200,
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
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </span>
      ),
    },
  ];

// 显示删除确认弹窗
const handleDelete = (record: CapitalRecord) => {
  setDeleteRecord(record);
  setDeleteModalVisible(true);
};

// 确认删除
const handleDeleteConfirm = async () => {
  try {
    const res = await DeleteCapitalApi({ id: deleteRecord.id });
    console.log('删除资方:', res);
    if (res) {
      message.success('删除成功');
      fetchData(); // 刷新列表
    } else {
      message.error(res.msg || '删除失败');
    }
  } catch (error) {
    console.error('删除失败:', error);
    message.error('删除失败');
  } finally {
    setDeleteModalVisible(false);
    setDeleteRecord(null);
  }
};

   // 获取数据
   useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  // 获取合同模板列表数据
  const fetchData = async (searchParams?: any) => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        pageSize: pageSize,
        ...searchParams
      };
      
      const res = await GetCapitalApi(params);
      console.log('....fetchData', res)
      if (res.result) {
        // 转换API返回的数据格式为页面需要的格式
        const list = (res.result || []).map((item: any) => ({
          key: item.id,
          templateNo: item.id, // 使用id作为模板编号
          name: item.templateName,
          createTime: item.createTime,
          updateTime: item.updateTime,
          type: item.templateType,
          fundContractName: item.remark || '-', // 使用备注字段作为资方合同名称
          templateFile: item.templateContent, // 使用模板内容作为文件路径
        }));
        
        setDataSource(res.result);
        setTotal(res.totalCount || 0);
      } else {
        message.error(res.msg || '获取数据失败');
      }
    } catch (error) {
      console.error('获取合同模板列表失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 查看
  const handleView = (record: CapitalRecord) => {
    console.log('查看资方:', record);
  };

  // 编辑
  const handleEdit = (record: CapitalRecord) => {
    setIsEdit(true);
    setCurrentRecord(record);
    // 设置表单初始值
    modalForm.setFieldsValue({
      name: record.name,
      shortName: record.shortName,
      socialCreditCode: record.socialCreditCode,
    });
    setIsModalVisible(true);
  };

  // 新增
  const handleAdd = () => {
    setIsEdit(false);
    setCurrentRecord(null);
    // 清空表单
    modalForm.resetFields();
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

  // 确定 modal 回调
const handleModalOk = async () => {
  try {
    // 使用modalForm而不是form
    const values = await modalForm.validateFields();
    console.log('Modal表单数据:', values);

    let params = {
      ...values
    }
    if (isEdit) {
      // 调用修改接口
      params.id = currentRecord?.id;
    }
    console.log('....params', params)
    
    // 调用新增接口
    const res = await AddCapitalApi(params);
    console.log('新增资方:', values);
    if (res) {
      message.success('操作成功');
      setIsModalVisible(false);
      modalForm.resetFields();
      // 刷新列表
      fetchData();
    } else {
      message.error(res.msg || '操作失败');
    }
  } catch (error) {
    console.error('表单验证或提交失败:', error);
    message.error('请检查输入内容');
  }
};

// 取消Modal
const handleModalCancel = () => {
  setIsModalVisible(false);
  setCurrentRecord(null);
  modalForm.resetFields();
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
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
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
                label="资方名称"
                name="name"
                rules={[
                  { required: true, message: '请输入资方名称' },
                  { max: 50, message: '名称不能超过50个字符' }
                ]}
              >
                <Input placeholder="请输入资方名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="资方简称"
                name="shortName"
                rules={[
                  { required: true, message: '请输入资方简称' },
                  { max: 20, message: '简称不能超过20个字符' }
                ]}
              >
                <Input placeholder="请输入资方简称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="统一社会信用代码"
                name="socialCreditCode"
                rules={[
                  { required: true, message: '请输入统一社会信用代码' },
                  { pattern: /^[0-9A-Z]{18}$/, message: '请输入18位大写字母和数字组成的统一社会信用代码' }
                ]}
              >
                <Input placeholder="请输入18位统一社会信用代码" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal
        title="删除确认"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除该资方吗？</p>
        {deleteRecord && (
          <p style={{ color: '#666', fontSize: '14px' }}>
            资方名称：{deleteRecord.name}
          </p>
        )}
      </Modal>
          </div>
        );
      };

export default CapitalList; 