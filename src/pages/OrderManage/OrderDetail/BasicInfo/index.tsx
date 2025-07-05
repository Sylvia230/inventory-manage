// 基础信息组件
import React from 'react';
import { Descriptions, Image, Space, Tag } from 'antd';
import { OrderDetailInfo } from '../interface';

interface BasicInfoProps {
  orderDetail: any;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ orderDetail }) => {
  // 支付凭证图片列表
  const paymentVouchers = [
    { label: '保证金', key: 'depositVoucher' },
    { label: '本息', key: 'principalInterestVoucher' },
    { label: '服务费', key: 'serviceFeeVoucher' },
    { label: '仓储费', key: 'storageFeeVoucher' },
    { label: '物流费', key: 'logisticsFeeVoucher' },
  ];

  return (
    <Descriptions bordered>
      {/* 订单基本信息 */}
      <Descriptions.Item label="订单号" span={3}>
        {orderDetail.orderNo}
      </Descriptions.Item>
      <Descriptions.Item label="产品名称" span={3}>
        {orderDetail.productName}
      </Descriptions.Item>
      <Descriptions.Item label="产品类型" span={3}>
        {orderDetail.productType}
      </Descriptions.Item>
      <Descriptions.Item label="申请时间" span={3}>
        {orderDetail.createTime}
      </Descriptions.Item>
      <Descriptions.Item label="申请单状态" span={3}>
        {orderDetail.orderStatusDesc}
      </Descriptions.Item>

      {/* 经销商信息 */}
      <Descriptions.Item label="经销商" span={3}>
        {orderDetail.dealer}
      </Descriptions.Item>
      <Descriptions.Item label="经销商业务经理" span={3}>
        {orderDetail.dealerManager}
      </Descriptions.Item>
      <Descriptions.Item label="申请人" span={3}>
        {orderDetail.applicant}
      </Descriptions.Item>
      <Descriptions.Item label="经销商联系方式" span={3}>
        {orderDetail.dealerContact}
      </Descriptions.Item>
      <Descriptions.Item label="经销商经营范围" span={3}>
        {orderDetail.dealerBusinessScope}
      </Descriptions.Item>

      {/* 供应商信息 */}
      <Descriptions.Item label="供应商" span={3}>
        {orderDetail.supplier}
      </Descriptions.Item>
      <Descriptions.Item label="联系人" span={3}>
        {orderDetail.supplierContact}
      </Descriptions.Item>
      <Descriptions.Item label="供应商联系方式" span={3}>
        {orderDetail.supplierContactInfo}
      </Descriptions.Item>

      {/* 支付凭证 */}
      {paymentVouchers.map(({ label, key }) => (
        <Descriptions.Item key={key} label={`${label}凭证`} span={3}>
          <Space>
            {orderDetail[key]?.map((url: string, index: number) => (
              <Image
                key={index}
                width={100}
                height={100}
                src={url}
                alt={`${label}凭证${index + 1}`}
                style={{ objectFit: 'cover' }}
              />
            ))}
          </Space>
        </Descriptions.Item>
      ))}

      {/* 其他照片 */}
      <Descriptions.Item label="其他照片" span={3}>
        <Space>
          {orderDetail.otherPhotos?.map((url: string, index: number) => (
            <Image
              key={index}
              width={100}
              height={100}
              src={url}
              alt={`其他照片${index + 1}`}
              style={{ objectFit: 'cover' }}
            />
          ))}
        </Space>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default BasicInfo;