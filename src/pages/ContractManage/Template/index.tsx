import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Select, Space, Row, Col, Modal, message, Upload } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';
import styles from './index.module.less';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined,
  UploadOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { 
  GetContractTemplateApi,
  type ContractTemplateRecord,
  type ContractTemplateQueryParams,
  SaveContractTemplateSignerApi
} from '@/services/contract';
import { GetEnumApi } from '@/services/user';
import { uploadFileApi } from '@/services/waybill';
import { SaveContractTemplateApi, GetContractSignPositionApi, RemoveContractTemplateSignerApi, DeleteContractTemplateApi } from '@/services/contract';
import dayjs from 'dayjs';

interface TemplateRecord {
  key: string;
  templateNo: string;
  name: string;
  createTime: string;
  updateTime: string;
  type: string;
  fundContractName: string;
  templateFile?: string; // 模版文件路径
}

// 签章位置数据结构
interface SignaturePosition {
  id: string;
  signerType: string;
  keyword: string;
  isNew?: boolean; // 标识是否为新增的待提交数据
}

const Template: React.FC = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [signaturePositions, setSignaturePositions] = useState<SignaturePosition[]>([]);
  const [typeOptions, setTypeOptions] = useState<any[]>([]);
  const [templateId, setTemplateId] = useState<string>('');
  
  // 分页相关状态
  const [dataSource, setDataSource] = useState<TemplateRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [signerTypeOptions, setSignerTypeOptions] = useState<any[]>([]);

  // // 合同类型选项
  // const typeOptions = [
  //   { label: '购车合同', value: 'purchase' },
  //   { label: '租赁合同', value: 'lease' },
  //   { label: '服务合同', value: 'service' },
  //   { label: '其他', value: 'other' },
  // ];

  // // 签署方类型选项
  // const signerTypeOptions = [
  //   { label: '甲方', value: 'party_a' },
  //   { label: '乙方', value: 'party_b' },
  //   { label: '丙方', value: 'party_c' },
  //   { label: '资方', value: 'investor' },
  //   { label: '担保方', value: 'guarantor' },
  // ];


  // 获取合同类型枚举
  const getContractTypeEnum = async () => {
    const res:any = await GetEnumApi('ContractTypeEnum');
    setTypeOptions(res);

    const resSinger:any = await GetEnumApi('SignerRoleEnum');
    setSignerTypeOptions(resSinger);
    // console.log('....getContractTypeEnum', res)
  }

  // 获取数据
  useEffect(() => {
    fetchData();
    getContractTypeEnum();
  }, [currentPage, pageSize]);

  // 获取合同模板列表数据
  const fetchData = async (searchParams?: ContractTemplateQueryParams) => {
    setLoading(true);
    try {
      const params: ContractTemplateQueryParams = {
        page: currentPage,
        pageSize: pageSize,
        ...searchParams
      };
      
      const res = await GetContractTemplateApi(params);
      console.log('....fetchData', res)
      if (res.result) {
        // 转换API返回的数据格式为页面需要的格式
        const list = (res.result || []).map((item: ContractTemplateRecord) => ({
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

  // 表格列定义
  const columns: ColumnsType<TemplateRecord> = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
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
      render: (text) => {
        return text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-';
      },
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
      dataIndex: 'capitalName',
      key: 'capitalName',
      width: 200,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <span>
          <Button 
            size='small'
            type="link" 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size='small'
            danger
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
          <Button 
           size='small'
            type="link" 
            onClick={() => handleSetSignature(record)}
          >
            设置签章位置
          </Button>
          {/* <Button 
            size='small'
            type="link" 
            onClick={() => handleValidate(record)}
          >
            校验
          </Button> */}
        </span>
      ),
    },
  ];

  // 签章位置表格列定义
  const signatureColumns: ColumnsType<SignaturePosition> = [
    {
      title: '签署方类型',
      dataIndex: 'signerType',
      key: 'signerType',
      width: 150,
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Select
              value={text}
              placeholder="请选择签署方类型"
              options={signerTypeOptions.map((item: any) => ({
                label: item.desc,
                value: item.code,
              })) }
              style={{ width: '100%' }}
              onChange={(value) => handleSignatureFieldChange(record.id, 'signerType', value)}
            />
          );
        }
        const option = signerTypeOptions.find(opt => opt.value === text);
        return option ? option.label : text;
      },
    },
    {
      title: '签章关键字',
      dataIndex: 'keyword',
      key: 'keyword',
      width: 200,
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              value={text}
              placeholder="请输入签章关键字"
              onChange={(e) => handleSignatureFieldChange(record.id, 'keyword', e.target.value)}
            />
          );
        }
        return text;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          {record.isNew ? (
            <Button 
              type="primary" 
              size="small"
              onClick={() => handleAddSignaturePosition(record)}
            >
              添加
            </Button>
          ) : null}
          <Button 
            type="link" 
            size="small"
            danger
            onClick={() => handleDeleteSignaturePosition(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 编辑
  const handleEdit = (record: any) => {
    setCurrentRecord(record);
    editForm.setFieldsValue({
      name: record.name,
      fundContractName: record.capitalName,
      type: record.type,
    });
    
    // 设置文件列表
    if (record.templateFile) {
      setFileList([
        {
          uid: '-1',
          name: record.templateFile.split('/').pop() || 'template.html',
          status: 'done',
          url: record.templateFile,
        },
      ]);
    } else {
      setFileList([]);
    }
    
    setEditModalVisible(true);
  };

  // 删除
  const handleDelete = async(record: any) => {
    setCurrentRecord(record);
    setDeleteModalVisible(true);
  };

  // 确认删除
  const handleDeleteConfirm = async () => {
    try {
      // TODO: 实现删除逻辑
      console.log('删除模板:', currentRecord);
       let res = await DeleteContractTemplateApi({
        id: currentRecord.id,
      });
      console.log('....res', res)
      message.success('删除成功');
      setDeleteModalVisible(false);
      setCurrentRecord(null);
      // 重新获取数据
      fetchData();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  // 确认编辑
  const handleEditConfirm = async () => {
    try {
      const values = await editForm.validateFields();
      
      // 检查是否有文件
      if (fileList.length === 0) {
        message.error('请上传合同模版文件');
        return;
      }
      
      let formData:any = {
        fileId: templateId,
        name: values.name,
        capitalName: values.fundContractName,
        type: values.type,
      };

      if(currentRecord?.id){
        formData.id = currentRecord.id;
      }
      
      console.log('编辑模板数据:', formData);
      await SaveContractTemplateApi(formData);
      
      // TODO: 实现编辑逻辑
      message.success('编辑成功');
      setEditModalVisible(false);
      setCurrentRecord(null);
      editForm.resetFields();
      setFileList([]);
      // 重新获取数据
      fetchData();
    } catch (error) {
      console.error('编辑失败:', error);
      message.error('编辑失败');
    }
  };

  // 取消编辑
  const handleEditCancel = () => {
    setEditModalVisible(false);
    setCurrentRecord(null);
    editForm.resetFields();
    setFileList([]);
  };

  // 文件上传配置
 const uploadProps: UploadProps = {
  name: 'file',
  fileList,
  accept: '.html,.htm,.xhtml',
  maxCount: 1,
  beforeUpload: (file) => {
    const isValidType = ['html', 'htm', 'xhtml'].includes(
      file.name.split('.').pop()?.toLowerCase() || ''
    );
    if (!isValidType) {
      message.error('只能上传 HTML、HTM、XHTML 格式的文件！');
      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('文件大小不能超过 10MB！');
      return false;
    }
    return true;
  },
  customRequest: async (options) => {
    const { file, onSuccess, onError } = options;
    console.log('....file', file)
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadFileApi({
        file
      });
      setTemplateId(res.result.id);
      console.log('上传成功，API返回数据:', res);
      onSuccess?.(res, file);
      message.success('上传成功');
    } catch (error) {
      onError?.(new Error('上传失败'));
      message.error('上传失败');
    }
  },
  onChange: ({ fileList: newFileList }) => {
    setFileList(newFileList);
  },
  onRemove: () => {
    setFileList([]);
  },
};


  // 设置签章位置
  const handleSetSignature = async(record: any) => {
    setCurrentRecord(record);
    let res = await GetContractSignPositionApi({
      contractTemplateId: record.id,
    });
    console.log('....设置签章位置', res)
   
    let list = res.result.map((item: any) => (
      {
        id: item.id,
        signerType: item.signerRole,
        keyword: item.keyword,
        isNew: false,
        contractTemplateId: item.contractTemplateId,
    }));
    setSignaturePositions(list);
    setSignatureModalVisible(true);
  };

  // 添加新的签章位置行
  const handleAddSignatureRow = () => {
    const newRow: SignaturePosition = {
      id: Date.now().toString(),
      signerType: '',
      keyword: '',
      isNew: true,
    };
    setSignaturePositions([...signaturePositions, newRow]);
  };

  // 签章位置字段变化
  const handleSignatureFieldChange = (id: string, field: keyof SignaturePosition, value: string) => {
    setSignaturePositions(positions =>
      positions.map(pos =>
        pos.id === id ? { ...pos, [field]: value } : pos
      )
    );
  };

  // 添加签章位置（调用接口）
  const handleAddSignaturePosition = async (record: SignaturePosition) => {
    try {
      if (!record.signerType || !record.keyword) {
        message.error('请填写完整的签章位置信息');
        return;
      }
  
      const params = {
        signerRole: record.signerType,
        keyword: record.keyword,
        contractTemplateId: currentRecord?.id,
      };
  
      const res = await SaveContractTemplateSignerApi(params);
  
      console.log('添加签章位置:', params);
      
      // 获取对应 label
      const selectedOption = signerTypeOptions.find(opt => opt.code === record.signerType);
      const label = selectedOption ? selectedOption.desc : record.signerType;
  
      message.success('签章位置添加成功');
  
      // 更新列表，移除 isNew 标识并替换 signerType 为 label
      setSignaturePositions(positions =>
        positions.map(pos =>
          pos.id === record.id 
            ? { 
                ...pos, 
                isNew: false,
                signerType: label, // 使用 label 替换原来的 code
                contractTemplateId: selectedOption.contractTemplateId
              } 
            : pos
        )
      );
    } catch (error) {
      console.error('添加签章位置失败:', error);
      message.error('添加签章位置失败');
    }
  };

  // 删除签章位置
  const handleDeleteSignaturePosition = (record: any) => {
    console.log('....record', record)
    RemoveContractTemplateSignerApi({
      id: record.id,
    }).then((res: any) => {
      console.log('....res', res)
      if (res) {
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    });
    setSignaturePositions(positions =>
      positions.filter(pos => pos.id !== record.id)
    );
  };

  // 关闭签章位置弹窗
  const handleSignatureModalCancel = () => {
    setSignatureModalVisible(false);
    setCurrentRecord(null);
    setSignaturePositions([]);
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
      setCurrentPage(1); // 重置到第一页
      fetchData(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 重置
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
        layout="inline"
        className={styles.searchForm}
      >
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={8}>
            <Form.Item
              name="templateName"
              label="模板名称"
            >
              <Input placeholder="请输入模板名称" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="templateType"
              label="模板类型"
            >
              <Select
                placeholder="请选择模板类型"
                options={typeOptions}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                  loading={loading}
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
                  icon={<PlusOutlined />} 
                  type="primary"
                  onClick={() => {
                    setCurrentRecord(null);
                    editForm.resetFields();
                    setEditModalVisible(true);
                  }}
                >
                  新增模板
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
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1500 }}
        rowKey="key"
      />
      {/* 编辑合同模板弹窗 */}
      <Modal
        title={currentRecord ? '编辑合同模板' : '新增合同模板'}
        open={editModalVisible}
        onOk={handleEditConfirm}
        onCancel={handleEditCancel}
        okText="确认"
        cancelText="取消"
        width={600}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="inline"
          preserve={false}
        >
             <Col span={24}>
              <Form.Item
                  name="name"
                  label="合同名称"
                  rules={[
                      { required: true, message: '请输入合同名称' },
                      { max: 20, message: '合同名称不能超过20个字符' },
                  ]}
              >
                 <Input
                  placeholder="请输入合同名称"
                  showCount
                  maxLength={20}
                  />
              </Form.Item>
             </Col>
            
             <Col span={24}>
            <Form.Item
              name="fundContractName"
              label="资方合同名称"
            >
              <Input placeholder="请输入资方合同名称" />
            </Form.Item>
           </Col>
           <Col span={24}>
            <Form.Item
              name="type"
              label="合同类型"
              rules={[
                { required: true, message: '请选择合同类型' },
              ]}
            >
              <Select
                placeholder="请选择合同类型"
                options={typeOptions.map((item: any) => ({
                  label: item.desc,
                  value: item.code,
                }))}
              />
            </Form.Item>
           </Col>
           <Col span={24}>
            <Form.Item
              label="合同模版"
              required
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>
                  选择文件
                </Button>
              </Upload>
              <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
                支持格式：HTML、HTM、XHTML，文件大小不超过10MB
              </div>
            </Form.Item>
           </Col>
        </Form>
      </Modal>

      {/* 设置签章位置弹窗 */}
      <Modal
        title="设置签章位置"
        open={signatureModalVisible}
        onCancel={handleSignatureModalCancel}
        footer={[
          <Button key="cancel" onClick={handleSignatureModalCancel}>
            关闭
          </Button>,
        ]}
        width={800}
        destroyOnClose
      >
        <div style={{ marginBottom: 16 }}>
          <Button 
            type="primary" 
            onClick={handleAddSignatureRow}
          >
            添加签章位置
          </Button>
        </div>
        
        <Table
          columns={signatureColumns}
          dataSource={signaturePositions}
          pagination={false}
          size="small"
          locale={{
            emptyText: '暂无签章位置，请点击上方按钮添加',
          }}
        />
      </Modal>

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
            模板编号：{currentRecord.id}
          </p>
        )}
      </Modal>
    </div>
  );
};

export default Template; 