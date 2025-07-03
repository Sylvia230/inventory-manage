import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Table, Upload, Image, Button, Space, message, Form, Input, Modal } from 'antd';
import { ArrowLeftOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import styles from './index.module.less';
import { uploadFileApi } from '@/services/waybill';
import financeStore from '@/stores/finance';
import { observer } from 'mobx-react-lite';
import { auditSettlementApi } from '@/services/finance';

interface PaymentVoucher {
  key: string;
  amount: number;
  bankAccount: string;
  accountName: string;
  vouchers: string[];
}

interface SettlementDetail {
  settlementNo: string;
  orderNo: string;
  amount: number;
  payeeAccount: string;
  payeeBranch: string;
  payeeName: string;
  status: string;
  createTime: string;
  amountStr?: string;
  vendorName?: string;
  receiveBankCardInfo?: any;
  statusDesc?: string;
}

const AuditDetail: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [voucherPreviewVisible, setVoucherPreviewVisible] = useState(false);
  const [voucherPreviewImages, setVoucherPreviewImages] = useState<string[]>([]);
  const [currentVoucherIndex, setCurrentVoucherIndex] = useState(0);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectForm] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [settlementDetail, setSettlementDetail] = useState<any | null>(null);

  // 组件卸载时清理预览URL
  useEffect(() => {
    return () => {
      // 清理所有blob URL
      fileList.forEach(file => {
        if (file.url && file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [fileList]);

  // 从store获取结算单数据
  useEffect(() => {
    if (id) {
      // 优先从store获取数据
      const storeData = financeStore.currentSettlement;
      
      if (storeData && (storeData.settlementNo === id || storeData.id === id)) {
        console.log('审核页面从store获取数据:', storeData);
        setSettlementDetail(storeData);
      } else {
        // 如果store中没有数据，尝试通过ID查找
        const foundData = financeStore.getSettlementById(id);
        if (foundData) {
          financeStore.setCurrentSettlement(foundData);
          console.log('审核页面通过ID找到数据:', foundData);
        } else {
          // 使用默认模拟数据
          console.warn('审核页面store中没有找到数据，使用模拟数据');
          const mockData: SettlementDetail = {
            settlementNo: id || 'JS202403150001',
            orderNo: 'YH202411060879036513',
            amount: 150000.00,
            payeeAccount: '6222020300012345678',
            payeeBranch: '中国工商银行上海分行营业部',
            payeeName: '上海汽车金融有限公司',
            status: 'pending',
            createTime: '2024-03-15 10:00:00',
          };
          setSettlementDetail(mockData);
        }
      }
    }
  }, [id]);

  // 组件卸载时清理store数据
  useEffect(() => {
    return () => {
      // 页面卸载时清理当前结算单数据
      financeStore.setCurrentSettlement(null);
    };
  }, []);

  // 监听fileList变化
  useEffect(() => {
    console.log('fileList变化:', fileList);
  }, [fileList]);

  // 模拟用户上传凭证数据
  const paymentVoucherData: PaymentVoucher[] = [
    {
      key: '1',
      amount: 50000.00,
      bankAccount: '6222020300098765432',
      accountName: '张三汽车销售有限公司',
      vouchers: [
        'https://example.com/voucher1_1.jpg',
        'https://example.com/voucher1_2.jpg',
        'https://example.com/voucher1_3.jpg',
      ],
    },
    {
      key: '2',
      amount: 100000.00,
      bankAccount: '6222020300011223344',
      accountName: '李四汽车贸易有限公司',
      vouchers: [
        'https://example.com/voucher2_1.jpg',
        'https://example.com/voucher2_2.jpg',
      ],
    },
  ];

  // 用户上传凭证表格列定义
  const voucherColumns: ColumnsType<PaymentVoucher> = [
    {
      title: '打款金额',
      dataIndex: 'amountStr',
      key: 'amountStr',
      width: 120,
    },
    {
      title: '银行账户',
      dataIndex: 'payAccount',
      key: 'payAccount',
      width: 180,
    },
    {
      title: '户名',
      dataIndex: 'payAccountName',
      key: 'payAccountName',
      width: 200,
    },
    {
      title: '打款凭证',
      dataIndex: 'certificateImgUrlList',
      key: 'certificateImgUrlList',
      width: 200,
      render: (certificateImgUrlList: string[], record: PaymentVoucher) => (
        <Space>
          {certificateImgUrlList.length > 0 && (
            <Image
              width={60}
              height={60}
              src={certificateImgUrlList[0]}
              preview={false}
              style={{ objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => handleVoucherPreview(certificateImgUrlList, 0)}
            />
          )}
          {certificateImgUrlList.length > 1 && (
            <Button
              size="small"
              onClick={() => handleVoucherPreview(certificateImgUrlList, 0)}
            >
              查看全部({certificateImgUrlList.length}张)
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 处理凭证预览
  const handleVoucherPreview = (vouchers: string[], startIndex: number = 0) => {
    setVoucherPreviewImages(vouchers);
    setCurrentVoucherIndex(startIndex);
    setVoucherPreviewVisible(true);
  };

  // 处理网银凭证上传 - 只处理删除和排序
  const handleUpload = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    console.log('handleUpload called with:', newFileList);
    
    // 检查是否有文件被删除，如果有，清理对应的预览URL
    const removedFiles = fileList.filter(oldFile => 
      !newFileList.some(newFile => newFile.uid === oldFile.uid)
    );
    
    removedFiles.forEach(file => {
      if (file.url && file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url);
      }
    });
    
    // 只更新文件列表，不触发额外的上传
    setFileList(newFileList);
  };

  // 自定义上传处理
  const customRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      setUploading(true);
      message.loading('正在上传...', 0);
      
      console.log('开始上传文件:', file.name);
      
      // 调用上传API
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
      
      // 调用成功回调，让Upload组件自动处理文件状态
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

  // 上传前检查
  const beforeUpload = (file: File) => {
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
  };

  // 处理网银凭证预览
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  // 获取base64
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // 返回列表
  const handleBack = () => {
    navigate('/financeManage/balance');
  };

  // 提交审核
  const handleSubmitAudit = async (examineResult: number) => {
    if (!settlementDetail) {
      message.error('结算单数据获取失败');
      return;
    }
    
    try {
      const values = await form.validateFields();
      
      // 处理上传的网银凭证文件，转换为链接数组
      const voucherUrls: string[] = [];
      
      console.log('提交时的fileList:', fileList);
      
      for (const file of fileList) {
        if (file.status === 'done') {
          // 优先使用服务器返回的文件路径
          if (file.response?.path) {
            voucherUrls.push(file.response.path);
          } 
        }
      }
      
      // 如果没有上传任何凭证，给出提示
      if (voucherUrls.length === 0) {
        message.warning('请至少上传一张收款方网银凭证');
        return;
      }
      
      const auditData = {
        id: settlementDetail.settlementNo,
        settlementId: settlementDetail.settlementNo, // 结算单号
        certificateImgUrlList: voucherUrls, 
        examineResult,
        examineResultDesc: examineResult === 0 ? '通过' : '不通过',               // 收款方网银凭证链接数组
        remark: values.auditComment,                 // 备注
      };
      
      console.log('提交审核数据:', auditData);
      
      // TODO: 调用审核API
      await auditSettlementApi(auditData);
      
      message.success('审核成功');
      navigate('/financeManage/balance');
    } catch (error) {
      console.error('审核提交失败:', error);
      message.error('审核提交失败，请重试');
    }
  };

  // 处理拒绝审核弹窗
  const handleRejectAudit = () => {
    setRejectModalVisible(true);
  };

  // 确认拒绝审核
  const handleConfirmReject = async () => {
    try {
      const values = await rejectForm.validateFields();
      if (!values.rejectReason) {
        message.error('请输入驳回原因');
        return;
      }
      
      console.log('拒绝审核:', values);
      
      // TODO: 调用拒绝API
      message.success('审核已拒绝');
      setRejectModalVisible(false);
      rejectForm.resetFields();
      navigate('/financeManage/balance');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 数据加载中
  if (!settlementDetail) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          数据加载中...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            style={{ background: 'transparent' }}
          >
            返回
          </Button>
          <h2>结算单审核详情 - {settlementDetail.settlementNo}</h2>
        </Space>
      </div>

      {/* 基础信息 */}
      <Card title="基础信息" className={styles.card}>
        <Descriptions column={3} bordered>
          <Descriptions.Item label="结算单号" span={1}>
            {settlementDetail.settlementNo}
          </Descriptions.Item>
          <Descriptions.Item label="订单号" span={1}>
            {settlementDetail.orderNo}
          </Descriptions.Item>
          <Descriptions.Item label="结算金额" span={1}>
            {settlementDetail.amountStr}
          </Descriptions.Item>
          <Descriptions.Item label="收款账户" span={1}>
            {settlementDetail.receiveBankCardInfo.accountName}
          </Descriptions.Item>
          <Descriptions.Item label="收款支行" span={1}>
          {settlementDetail.receiveBankCardInfo.bankBranchName}
          </Descriptions.Item>
          <Descriptions.Item label="户名" span={1}>
          {settlementDetail.receiveBankCardInfo.bankName}
          </Descriptions.Item>
          {/* <Descriptions.Item label="创建时间" span={1}>
            {settlementDetail.createTime}
          </Descriptions.Item> */}
          {/* <Descriptions.Item label="状态" span={1}>
            {settlementDetail.status === 'pending' ? '待审核' : settlementDetail.status}
          </Descriptions.Item> */}
        </Descriptions>
      </Card>

      {/* 用户上传凭证 */}
      <Card title="用户上传凭证" className={styles.card}>
        <Table
          columns={voucherColumns}
          dataSource={settlementDetail.settlementRemitDTOS}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* 收款方网银凭证 */}
      <Card title="收款方网银凭证" className={styles.card}>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleUpload}
          beforeUpload={beforeUpload}
          customRequest={customRequest}
          maxCount={5}
          multiple={false}
          accept="image/*"
          disabled={uploading}
        >
          {fileList.length >= 5 ? null : (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>
                {uploading ? '上传中...' : '上传凭证'}
              </div>
            </div>
          )}
        </Upload>
        <div style={{ color: '#999', fontSize: '12px', marginTop: '8px' }}>
          最多可上传5张图片，支持 JPG、PNG 格式，单个文件不超过10MB
        </div>
      </Card>

      {/* 审核操作 */}
      <Card title="备注" className={styles.card}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="auditComment"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="请输入审核意见..."
              maxLength={500}
              showCount
            />
          </Form.Item>
          


          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                onClick={() => handleSubmitAudit(0)}
                size="large"
              >
                审核通过
              </Button>
              <Button 
                danger 
                // onClick={handleRejectAudit}
                onClick={() => handleSubmitAudit(1)}
                size="large"
              >
                拒绝审核
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 网银凭证预览 */}
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>

      {/* 打款凭证预览 */}
      <Modal
        open={voucherPreviewVisible}
        title={`打款凭证预览 (${currentVoucherIndex + 1}/${voucherPreviewImages.length})`}
        footer={[
          <Button key="prev" onClick={() => setCurrentVoucherIndex(Math.max(0, currentVoucherIndex - 1))} disabled={currentVoucherIndex === 0}>
            上一张
          </Button>,
          <Button key="next" onClick={() => setCurrentVoucherIndex(Math.min(voucherPreviewImages.length - 1, currentVoucherIndex + 1))} disabled={currentVoucherIndex === voucherPreviewImages.length - 1}>
            下一张
          </Button>,
          <Button key="close" onClick={() => setVoucherPreviewVisible(false)}>
            关闭
          </Button>,
        ]}
        onCancel={() => setVoucherPreviewVisible(false)}
        width={800}
      >
        {voucherPreviewImages.length > 0 && (
          <img 
            alt="voucher preview" 
            style={{ width: '100%' }} 
            src={voucherPreviewImages[currentVoucherIndex]} 
          />
        )}
      </Modal>

      {/* 拒绝审核弹窗 */}
      <Modal
        title="拒绝审核"
        open={rejectModalVisible}
        onOk={handleConfirmReject}
        onCancel={() => {
          setRejectModalVisible(false);
          rejectForm.resetFields();
        }}
        okText="确定驳回"
        cancelText="取消"
        width={600}
        okButtonProps={{ danger: true }}
      >
        <Form form={rejectForm} layout="inline">
          <Form.Item
            name="rejectReason"
            label="驳回原因"
            rules={[{ required: true, message: '请输入驳回原因' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="请输入驳回原因..."
              maxLength={500}
              style={{ width: '440px' }}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default AuditDetail;