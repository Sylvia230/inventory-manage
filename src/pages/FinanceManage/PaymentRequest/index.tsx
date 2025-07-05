import React, { useState, useEffect } from 'react';
import { Pagination, Button, Form, Input, Select, Space, Row, Col, DatePicker, Card, Descriptions, Tag, Typography, message, Spin, Modal, Upload, Image, Carousel } from 'antd';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined, EditOutlined, CloseOutlined, BankOutlined, DollarOutlined, SettingOutlined, UploadOutlined, EyeOutlined, LeftOutlined, RightOutlined, PictureOutlined } from '@ant-design/icons';
import { getPaymentRequestList, uploadCertApi, closePaymentApi } from '@/services/finance';
import { uploadFileApi } from '@/services/waybill';
import { GetUrlApi } from '@/services/user';
import dayjs from 'dayjs';
import { getImageUrl } from '@/utils';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface PaymentRequestRecord {
  key: string;
  requestId: string;
  paymentType: string;
  status: string;
  relatedOrder: string;
  fundType: string;
  amount: number;
  applicant: string;
  createTime: string;
  approveTime?: string;
}

const PaymentRequest: React.FC = () => {
  const [form] = Form.useForm();
  const [voucherForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  // 上传凭证弹窗相关状态
  const [voucherModalVisible, setVoucherModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // 关闭弹窗相关状态
  const [closeModalVisible, setCloseModalVisible] = useState(false);
  const [closeForm] = Form.useForm();
  const [closeLoading, setCloseLoading] = useState(false);
  
  // 查看凭证弹窗相关状态
  const [viewVoucherModalVisible, setViewVoucherModalVisible] = useState(false);
  const [voucherImages, setVoucherImages] = useState<string[]>([]);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [currentVoucherIndex, setCurrentVoucherIndex] = useState(0);

  // 格式化打款时间
  const formatPaymentTime = (timeStr: string) => {
    if (!timeStr) return '';
    return timeStr.split(' ')[0]; // 只取日期部分
  };

  // 出款类型选项
  const paymentTypeOptions = [
    { label: '采购付款', value: 'purchase' },
    { label: '销售退款', value: 'refund' },
    { label: '费用报销', value: 'expense' },
    { label: '其他', value: 'other' },
  ];

  // 状态选项
  const statusOptions = [
    { label: '待审核', value: 'pending' },
    { label: '审核中', value: 'processing' },
    { label: '已通过', value: 'approved' },
    { label: '已拒绝', value: 'rejected' },
  ];

  // 资金类型选项
  const fundTypeOptions = [
    { label: '现金', value: 'cash' },
    { label: '银行转账', value: 'bank' },
    { label: '支付宝', value: 'alipay' },
    { label: '微信', value: 'wechat' },
  ];

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  // 获取出款类型文本
  const getPaymentTypeText = (type: string) => {
    const option = paymentTypeOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  // 获取资金类型文本
  const getFundTypeText = (type: string) => {
    const option = fundTypeOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  // 初始化数据
  useEffect(() => {
    fetchData();
  }, []);

  // 获取数据
  const fetchData = async (params?: any, paginationParams?: any) => {
    try {
      setLoading(true);
      const currentPagination = paginationParams || pagination;
      const searchParams = {
        ...params,
        page: currentPagination.current,
        pageSize: currentPagination.pageSize,
      };
      
      // 调用API获取数据
      const res = await getPaymentRequestList(searchParams);
      console.log('请款单查询结果:', res);
      
      if (res) {
        setDataSource(res);
        setPagination(prev => ({
          ...prev,
          total: res.total || 0,
        }));
      } else {
        // 如果API返回数据格式不正确，使用模拟数据
        const mockData = [
          {
            key: '1',
            requestId: 'PR202403150001',
            paymentType: 'purchase',
            status: 'pending',
            relatedOrder: 'PO202403150001',
            fundType: 'bank',
            amount: 10000.00,
            applicant: '张三',
            createTime: '2024-03-15 10:00:00',
          },
          {
            key: '2',
            requestId: 'PR202403150002',
            paymentType: 'refund',
            status: 'approved',
            relatedOrder: 'SO202403150001',
            fundType: 'alipay',
            amount: 5000.00,
            applicant: '李四',
            createTime: '2024-03-15 11:00:00',
            approveTime: '2024-03-15 14:00:00',
          },
        ];
        setDataSource(mockData);
        setPagination(prev => ({
          ...prev,
          total: mockData.length,
        }));
      }
    } catch (error) {
      console.error('获取请款单数据失败:', error);
      message.error('获取数据失败，请稍后重试');
      
      // 发生错误时使用模拟数据
      const mockData = [
        {
          key: '1',
          requestId: 'PR202403150001',
          paymentType: 'purchase',
          status: 'pending',
          relatedOrder: 'PO202403150001',
          fundType: 'bank',
          amount: 10000.00,
          applicant: '张三',
          createTime: '2024-03-15 10:00:00',
        },
        {
          key: '2',
          requestId: 'PR202403150002',
          paymentType: 'refund',
          status: 'approved',
          relatedOrder: 'SO202403150001',
          fundType: 'alipay',
          amount: 5000.00,
          applicant: '李四',
          createTime: '2024-03-15 11:00:00',
          approveTime: '2024-03-15 14:00:00',
        },
      ];
      setDataSource(mockData);
      setPagination(prev => ({
        ...prev,
        total: mockData.length,
      }));
    } finally {
      setLoading(false);
    }
  };

  // 查看详情
  const handleViewDetail = (record: PaymentRequestRecord) => {
    console.log('查看详情:', record);
  };

  // 处理关闭按钮点击
  const handleClosePayment = (record: any) => {
    console.log('关闭请款单:', record);
    setCurrentRecord(record);
    setCloseModalVisible(true);
    closeForm.resetFields();
  };

  // 提交关闭原因
  const handleCloseSubmit = async () => {
    try {
      const values = await closeForm.validateFields();
      
      const submitData = {
        paymentId: currentRecord?.id,
        reason: values.closeReason,
      };
      
      console.log('提交关闭数据:', submitData);
      
      setCloseLoading(true);
      
      // 显示加载提示
      message.loading('正在关闭请款单...', 0);
      
      // 调用关闭API
      const res = await closePaymentApi(submitData);
      console.log('关闭请款单结果:', res);
      
      // 隐藏加载提示
      message.destroy();
      
      // 显示成功提示
      message.success('请款单关闭成功');
      
      // 关闭弹窗
      setCloseModalVisible(false);
      
      // 重新查询请款单列表
      const formValues = form.getFieldsValue();
      await fetchData(formValues);
      
    } catch (error) {
      console.error('关闭请款单失败:', error);
      message.destroy();
      message.error('关闭请款单失败，请重试');
    } finally {
      setCloseLoading(false);
    }
  };

  // 取消关闭
  const handleCloseCancel = () => {
    setCloseModalVisible(false);
    setCurrentRecord(null);
    closeForm.resetFields();
  };

  // 处理查看凭证按钮点击
  const handleViewVoucher = async (record: any) => {
    console.log('查看凭证:', record);
    setCurrentRecord(record);
    setViewVoucherModalVisible(true);
    setCurrentVoucherIndex(0);
    
    // 获取凭证图片列表
    setVoucherLoading(true);
    try {
      // 调用获取凭证API
      // const res = await getVoucherImagesApi(record.id);
      setVoucherImages(record.certificateFileUrlList || []);
      
    } catch (error) {
      console.error('获取凭证失败:', error);
      message.error('获取凭证失败');
    } finally {
      setVoucherLoading(false);
    }
  };

  // 关闭查看凭证弹窗
  const handleViewVoucherCancel = () => {
    setViewVoucherModalVisible(false);
    setCurrentRecord(null);
    setVoucherImages([]);
    setCurrentVoucherIndex(0);
  };

  // 上一张凭证
  const handlePrevVoucher = () => {
    setCurrentVoucherIndex(prev => 
      prev > 0 ? prev - 1 : voucherImages.length - 1
    );
  };

  // 下一张凭证
  const handleNextVoucher = () => {
    setCurrentVoucherIndex(prev => 
      prev < voucherImages.length - 1 ? prev + 1 : 0
    );
  };

  // 处理上传凭证点击
  const handleUploadVoucher = (record: any) => {
    console.log('上传凭证:', record);
    setCurrentRecord(record);
    setVoucherModalVisible(true);
    voucherForm.resetFields();
    setFileList([]);
    
    // 设置表单默认值
    setTimeout(() => {
      voucherForm.setFieldsValue({
        paymentAccount: record.payAccount || '',
        payAmount: record.payAmountStr || '',
        // 如果有历史打款时间且格式正确，则使用，否则使用当前时间
        paymentTime: record.payTimeStr ? 
          (dayjs(record.payTimeStr).isValid() ? dayjs(record.payTimeStr) : dayjs()) : 
          dayjs(),
      });
    }, 0);
  };

  // 处理文件上传
  const handleFileUpload = ({ fileList: newFileList }: any) => {
    console.log('handleUpload called with:', newFileList);
    
    // 检查是否有文件被删除，如果有，清理对应的预览URL
    const removedFiles = fileList.filter(oldFile => 
      !newFileList.some((newFile:any) => newFile.uid === oldFile.uid)
    );
    
    removedFiles.forEach(file => {
      if (file.url && file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url);
      }
    });
    
    // 只更新文件列表，不触发额外的上传
    setFileList(newFileList);
  };

  // 处理图片预览
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result as string));
        reader.readAsDataURL(file.originFileObj);
      });
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // 自定义上传请求
  const customUploadRequest = async ({ file, onSuccess, onError }: any)=> {
    try {
      setUploading(true);
      message.loading('正在上传...', 0);
      
      console.log('开始上传文件:', file.name);
      const res = await uploadFileApi({ file });
      console.log('上传成功，API返回数据:', res);
      
      // 创建预览URL
      const previewUrl = URL.createObjectURL(file);
      
      // 构造响应数据
      const responseData = {
        url: previewUrl,
        name: file.name,
        path: res.result?.path || res.result?.url || res.result,
        ...res.result
      };
      
      console.log('返回给Upload组件的数据:', responseData);
      onSuccess(responseData);
      
      message.destroy();
      message.success('上传成功');
      
    } catch (error) {
      console.error('上传失败:', error);
      message.destroy();
      message.error('上传失败');
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  // 提交上传凭证
  const handleVoucherSubmit = async () => {
    try {
      const values = await voucherForm.validateFields();
      
      const voucherUrls = fileList
        .filter(file => file.status === 'done')
        .map(file => file.response?.path || file.url);
      
      if (voucherUrls.length === 0) {
        message.warning('请上传打款凭证');
        return;
      }
      
      const submitData = {
        payAmount: Number(values.payAmount) * 100,
        realPayAccount: values.paymentAccount,
        payTime: dayjs(values.paymentTime).format('YYYY-MM-DD HH:mm:ss'),
        certUrlList: voucherUrls,
        paymentId: currentRecord?.id,
      };
      
      console.log('提交凭证数据:', submitData);
      
      // 显示加载提示
      message.loading('正在提交凭证...', 0);
      
      const res = await uploadCertApi(submitData);
      console.log('上传凭证结果:', res);
      
      // 隐藏加载提示
      message.destroy();
      
      // 显示成功提示
      message.success('凭证上传成功');
      
      // 关闭弹窗
      setVoucherModalVisible(false);
      
      // 重新查询请款单列表
      const formValues = form.getFieldsValue();
      await fetchData(formValues);
      
    } catch (error) {
      console.error('上传凭证失败:', error);
      message.destroy();
      message.error('上传凭证失败，请重试');
    }
  };

  // 关闭上传凭证弹窗
  const handleVoucherCancel = () => {
    setVoucherModalVisible(false);
    setCurrentRecord(null);
    setFileList([]);
    setPreviewImage('');
    setPreviewOpen(false);
    voucherForm.resetFields();
  };

  // 搜索
  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      console.log('搜索条件:', values);
      
      // 重置到第一页
      const newPagination = {
        current: 1,
        pageSize: pagination.pageSize,
        total: pagination.total,
      };
      
      setPagination(newPagination);
      
      // 获取数据
      await fetchData(values, newPagination);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    const newPagination = {
      current: 1,
      pageSize: pagination.pageSize,
      total: pagination.total,
    };
    setPagination(newPagination);
    fetchData(undefined, newPagination);
  };

  // 处理分页变化
  const handleTableChange = (page: number, pageSize: number) => {
    const newPagination = {
      current: page,
      pageSize: pageSize,
      total: pagination.total,
    };
    
    setPagination(newPagination);
    
    // 获取表单数据
    const formValues = form.getFieldsValue();
    fetchData(formValues, newPagination);
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        layout="inline"
        className={styles.searchForm}
      >
        <Row gutter={24} style={{ width: '100%' }}>
          {/* <Col span={6}>
            <Form.Item
              name="requestId"
              label="请款单ID"
            >
              <Input placeholder="请输入请款单ID" />
            </Form.Item>
          </Col> */}
          <Col span={6}>
            <Form.Item
              name="paymentType"
              label="出款类型"
            >
              <Select
                placeholder="请选择出款类型"
                options={paymentTypeOptions}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="status"
              label="状态"
            >
              <Select
                placeholder="请选择状态"
                options={statusOptions}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="orderNo"
              label="订单号"
            >
              <Input placeholder="请输入关联单号" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={6}>
            <Form.Item
              name="fundType"
              label="资金类型"
            >
              <Select
                placeholder="请选择资金类型"
                options={fundTypeOptions}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
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
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Spin spinning={loading}>
        <div style={{ marginBottom: 16 }}>
          {dataSource.length > 0 ? (
            dataSource.map((record) => (
              <Card key={record.key} className={styles.receiptCard} style={{ marginBottom: 16 }}>
                <div className={styles.receiptHeader}>
                  <Space size="large">
                    {/* <div>
                      <Text type="secondary">请款单ID：</Text>
                      <Text strong>{record.requestId}</Text>
                    </div> */}
                    <div>
                      <Text type="secondary">订单号：</Text>
                      <Text strong>{record.orderNo}</Text>
                    </div>
                    <div>
                      <Text type="secondary">请款单状态：</Text>
                      <Tag color={getStatusColor(record.status)}>{record.statusDesc}</Tag>
                    </div>
                  </Space>
                  <Space className='ml-12'>
                   {/* 成功状态下显示查看凭证按钮 */}
                   {record.status === 3 && (
                     <Button icon={<EyeOutlined />} onClick={() => handleViewVoucher(record)}>
                       查看凭证
                     </Button>
                   )}
                     {record.status !== 3 && record.status !== 5 && (
                     <>
                       <Button icon={<CloseOutlined />} onClick={() => handleClosePayment(record)}>
                         驳回
                       </Button>
                         <Button type="primary" icon={<DollarOutlined />} onClick={() => handleUploadVoucher(record)}>
                         上传凭证
                       </Button>
                     </>

                     )}
                 </Space>
                </div>

                <Row gutter={24} className={styles.receiptContent}>
                  <Col span={6} style={{padding: '0px'}}>
                    <Card size="small" className={styles.infoCard}>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="出款户名">{record.payAccountName}</Descriptions.Item>
                        <Descriptions.Item label="出款账户">{record.payAccount}</Descriptions.Item>
                        <Descriptions.Item label="出款金额">{record.payAmountStr}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                  <Col span={6} style={{padding: '0px'}}>
                    <Card size="small" className={styles.infoCard}>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="收款户名">
                          <Text>
                           {record.paymentSubDTOS[0]?.receiveAccount}
                          </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="收款账户"> {record.paymentSubDTOS[0]?.receiveAccountName}</Descriptions.Item>
                        <Descriptions.Item label="收款支行">{record.paymentSubDTOS[0]?.receiveBankBranch}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                  <Col span={6} style={{padding: '0px'}}>
                    <Card size="small" className={styles.infoCard}>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="产品类型">{record.productTypeDesc}</Descriptions.Item>
                        <Descriptions.Item label="资金类型">{record.fundTypeDesc}</Descriptions.Item>
                        <Descriptions.Item label="付款渠道">-</Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                  <Col span={6} style={{padding: '0px'}}>
                      <Card size="small" className={styles.infoCard}>
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="提交时间">{record.createTimeStr}</Descriptions.Item>
                          <Descriptions.Item label="成功时间">{record.payTimeStr}</Descriptions.Item>
                          <Descriptions.Item label="备注">-</Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>
                </Row>
              </Card>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
              <Text type="secondary">暂无请款单数据</Text>
            </div>
          )}
        </div>
      </Spin>

      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        showSizeChanger
        showQuickJumper
        showTotal={(total: number, range: [number, number]) => 
          `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
        }
        onChange={handleTableChange}
        onShowSizeChange={handleTableChange}
        pageSizeOptions={['10', '20', '50', '100']}
        style={{ textAlign: 'center', marginTop: 24 }}
      />

      {/* 上传凭证弹窗 */}
      <Modal
        title="上传打款凭证"
        open={voucherModalVisible}
        onOk={handleVoucherSubmit}
        onCancel={handleVoucherCancel}
        width={600}
        okText="确定"
        cancelText="取消"
        confirmLoading={uploading}
      >
        <Form
          form={voucherForm}
          layout="inline"
          initialValues={{
            paymentTime: null,
            paymentAccount: '',
            externalSerialNo: '',
            payAmount: '',
          }}
        >
            <Col span={24}>
              <Form.Item
                name="paymentTime"
                label="打款时间"
                rules={[{ required: true, message: '请选择打款时间' }]}
              >
                <DatePicker 
                  showTime 
                  style={{ width: '100%' }}
                  placeholder="请选择打款时间"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="paymentAccount"
                label="出款账户"
                rules={[{ required: true, message: '请输入出款账户' }]}
              >
                <Input placeholder="请输入出款账户" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="payAmount"
                label="出款金额"
                rules={[{ required: true, message: '请输入出款金额' }]}
              >
                <Input placeholder="请输入出款账户" />
              </Form.Item>
            </Col>
          <Form.Item
            name="voucherImages"
            label="打款凭证"
            // rules={[{ required: true, message: '请上传打款凭证' }]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleFileUpload}
              onPreview={handlePreview}
              customRequest={customUploadRequest}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('只能上传图片文件!');
                  return false;
                }
                const isLt10M = file.size / 1024 / 1024 < 10;
                if (!isLt10M) {
                  message.error('图片大小不能超过10MB!');
                  return false;
                }
                
                console.log('文件验证通过，准备上传:', file.name);
                // 返回true让Upload组件处理上传流程
                return true;
              }}
              // maxCount={3}
            >
              {
               (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
            <div style={{ color: '#999', fontSize: '12px', marginTop: 8 }}>
              支持jpg、png、jpeg格式，单张图片不超过5MB，最多上传3张
            </div>
          </Form.Item>
        </Form>

        {/* 当前请款单信息展示 */}
        {/* {currentRecord && (
          <Card size="small" style={{ marginTop: 16, backgroundColor: '#fafafa' }}>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="订单号">{currentRecord.orderNo}</Descriptions.Item>
              <Descriptions.Item label="出款金额">{currentRecord.payAmountStr}</Descriptions.Item>
              <Descriptions.Item label="收款户名">
                {currentRecord.paymentSubDTOS?.[0]?.receiveAccount || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="收款账户">
                {currentRecord.paymentSubDTOS?.[0]?.receiveAccountName || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )} */}
      </Modal>

      {/* 图片预览Modal */}
      {previewImage && (
        <Modal
          open={previewOpen}
          title="图片预览"
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          <Image
            alt="预览图片"
            style={{ width: '100%' }}
            src={previewImage}
          />
        </Modal>
      )}

      {/* 关闭请款单弹窗 */}
      <Modal
        title="驳回请款单"
        open={closeModalVisible}
        onOk={handleCloseSubmit}
        onCancel={handleCloseCancel}
        width={500}
        okText="确定驳回"
        cancelText="取消"
        confirmLoading={closeLoading}
        okButtonProps={{ danger: true }}
      >
        <Form
          form={closeForm}
          layout="inline"
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="closeReason"
            label="驳回原因"
            rules={[{ required: true, message: '请输入驳回原因' }]}
          >
            <Input.TextArea
              placeholder="请输入关闭原因"
              rows={4}
              maxLength={200}
              showCount
              style={{width: '360px'}}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看凭证弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PictureOutlined />
            <span>查看打款凭证</span>
            {voucherImages.length > 0 && (
              <span style={{ color: '#999', fontSize: '14px' }}>
                ({currentVoucherIndex + 1}/{voucherImages.length})
              </span>
            )}
          </div>
        }
        open={viewVoucherModalVisible}
        onCancel={handleViewVoucherCancel}
        footer={null}
        width={800}
        centered
      >
        <Spin spinning={voucherLoading}>
          {voucherImages.length > 0 ? (
            <div>
              {/* 凭证展示区域 */}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <Image
                  src={'http://120.26.232.36' + (voucherImages[currentVoucherIndex])}
                  alt={`凭证 ${currentVoucherIndex + 1}`}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '500px',
                    borderRadius: '8px',
                    border: '1px solid #d9d9d9'
                  }}
                  preview={false}
                />
              </div>
              
              {/* 导航控制 */}
              {voucherImages.length > 1 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  gap: '16px',
                  marginTop: '16px'
                }}>
                  <Button 
                    icon={<LeftOutlined />} 
                    onClick={handlePrevVoucher}
                    disabled={voucherImages.length <= 1}
                  >
                    上一张
                  </Button>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {voucherImages.map((_, index) => (
                      <div
                        key={index}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: index === currentVoucherIndex ? '#1890ff' : '#d9d9d9',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onClick={() => setCurrentVoucherIndex(index)}
                      />
                    ))}
                  </div>
                  
                  <Button 
                    icon={<RightOutlined />} 
                    onClick={handleNextVoucher}
                    disabled={voucherImages.length <= 1}
                  >
                    下一张
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
              <PictureOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <div>暂无凭证数据</div>
            </div>
          )}
        </Spin>
      </Modal>

    </div>
  );
};

export default PaymentRequest; 