import React, { useState } from 'react';
import { Card, Descriptions, Table, Upload, Image, Button, Space, message, Form, Input, Modal } from 'antd';
import { ArrowLeftOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import styles from './index.module.less';
import { uploadFileApi } from '@/services/waybill';

interface PaymentVoucher {
  key: string;
  amount: number;
  bankAccount: string;
  accountName: string;
  vouchers: string[];
}

interface SettlementDetail {
  settlementId: string;
  orderNo: string;
  amount: number;
  payeeAccount: string;
  payeeBranch: string;
  payeeName: string;
  status: string;
  createTime: string;
}

const AuditDetail: React.FC = () => {
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
  const [uploadedPhotos, setUploadedPhotos] = useState<{[key: string]: any}>({});

  // 模拟详情数据
  const settlementDetail: SettlementDetail = {
    settlementId: id || 'JS202403150001',
    orderNo: 'YH202411060879036513',
    amount: 150000.00,
    payeeAccount: '6222020300012345678',
    payeeBranch: '中国工商银行上海分行营业部',
    payeeName: '上海汽车金融有限公司',
    status: 'pending',
    createTime: '2024-03-15 10:00:00',
  };

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
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '银行账户',
      dataIndex: 'bankAccount',
      key: 'bankAccount',
      width: 180,
    },
    {
      title: '户名',
      dataIndex: 'accountName',
      key: 'accountName',
      width: 200,
    },
    {
      title: '打款凭证',
      dataIndex: 'vouchers',
      key: 'vouchers',
      width: 200,
      render: (vouchers: string[], record: PaymentVoucher) => (
        <Space>
          {vouchers.length > 0 && (
            <Image
              width={60}
              height={60}
              src={vouchers[0]}
              preview={false}
              style={{ objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => handleVoucherPreview(vouchers, 0)}
            />
          )}
          {vouchers.length > 1 && (
            <Button
              size="small"
              onClick={() => handleVoucherPreview(vouchers, 0)}
            >
              查看全部({vouchers.length}张)
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

  // 处理网银凭证上传
  const handleUpload = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  // 创建上传配置函数
  const createUploadProps = () => ({
    name: 'file',
    multiple: false,
    accept: 'image/*',
    showUploadList: false, // 不显示默认的上传列表
    beforeUpload: (file: File) => {
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
      
      // 调用实际上传函数
      handleUploadFile(file);
      
      return false; // 阻止默认上传行为
    },
  });
// 实际上传照片
const handleUploadFile = async (file: File) => {
    try {
        message.loading(`正在上传...`, 0);
        
        // 模拟上传成功，实际项目中这里调用真实API
        let res = await uploadFileApi({
            file,
        });
        console.log(res, 'upload');
        // // 模拟上传延迟
        // await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 创建预览URL
        const previewUrl = URL.createObjectURL(file);
        
        // 更新上传状态
        setUploadedPhotos(prev => ({
        ...prev,
        ['fileList']: {
            uid: Date.now().toString(),
            name: file.name,
            status: 'done',
            url: previewUrl,
            originFileObj: file,
            fileUrl: res.result.path,
        }
        }));
        
        // // 更新表单值
        // form.setFieldValue(photoName, [{
        //     uid: Date.now().toString(),
        //     name: file.name,
        //     status: 'done',
        //     url: previewUrl
        // }]);
        
        message.destroy();
        message.success(`上传成功`);
        
    } catch (error) {
        message.destroy();
        message.error('照片上传失败');
        console.error('照片上传失败:', error);
    }
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
  const handleSubmitAudit = async () => {
    try {
      const values = await form.validateFields();
      
      // 处理上传的网银凭证文件，转换为链接数组
      const voucherUrls: string[] = [];
      
      for (const file of fileList) {
        if (file.originFileObj) {
          // TODO: 这里应该调用文件上传接口，获取服务器返回的URL
          // const uploadResponse = await uploadFile(file.originFileObj);
          // voucherUrls.push(uploadResponse.url);
          
          // 临时模拟：使用本地URL或base64
          const url = file.url || await getBase64(file.originFileObj);
          voucherUrls.push(url);
        } else if (file.url) {
          // 已经是URL的情况
          voucherUrls.push(file.url);
        }
      }
      
      const auditData = {
        settlementId: settlementDetail.settlementId, // 结算单号
        bankVoucherUrls: voucherUrls,                // 收款方网银凭证链接数组
        remark: values.auditComment,                 // 备注
        auditStatus: 'approved'                      // 审核状态
      };
      
      console.log('提交审核数据:', auditData);
      
      // TODO: 调用审核API
      // await auditSettlementApi(auditData);
      
      message.success('审核通过成功');
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
          <h2>结算单审核详情 - {settlementDetail.settlementId}</h2>
        </Space>
      </div>

      {/* 基础信息 */}
      <Card title="基础信息" className={styles.card}>
        <Descriptions column={3} bordered>
          <Descriptions.Item label="结算单号" span={1}>
            {settlementDetail.settlementId}
          </Descriptions.Item>
          <Descriptions.Item label="订单号" span={1}>
            {settlementDetail.orderNo}
          </Descriptions.Item>
          <Descriptions.Item label="结算金额" span={1}>
            ¥{settlementDetail.amount.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="收款账户" span={1}>
            {settlementDetail.payeeAccount}
          </Descriptions.Item>
          <Descriptions.Item label="收款支行" span={1}>
            {settlementDetail.payeeBranch}
          </Descriptions.Item>
          <Descriptions.Item label="户名" span={1}>
            {settlementDetail.payeeName}
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
          dataSource={paymentVoucherData}
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
          maxCount={5}
          {...createUploadProps()}
        >
          {fileList.length >= 5 ? null : (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>上传凭证</div>
            </div>
          )}
        </Upload>
        <div style={{ color: '#999', fontSize: '12px', marginTop: '8px' }}>
          最多可上传5张图片，支持 JPG、PNG 格式
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
                onClick={handleSubmitAudit}
                size="large"
              >
                审核通过
              </Button>
              <Button 
                danger 
                onClick={handleRejectAudit}
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
};

export default AuditDetail; 