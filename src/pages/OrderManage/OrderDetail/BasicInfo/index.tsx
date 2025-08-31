// 基础信息组件
import React from 'react';
import { Descriptions, Image, Space } from 'antd';

interface BasicInfoProps {
    orderSimpleDTO: any;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ orderSimpleDTO }) => {

  return (
    <Descriptions bordered>
      {/* 订单基本信息 */}
      <Descriptions.Item label="订单号" span={3}>
        {orderSimpleDTO.orderNo}
      </Descriptions.Item>
      <Descriptions.Item label="产品名称" span={3}>
        {orderSimpleDTO.bizCategoryDesc}
      </Descriptions.Item>
      <Descriptions.Item label="申请时间" span={3}>
        {orderSimpleDTO.createTimeStr}
      </Descriptions.Item>
      <Descriptions.Item label="订单状态" span={3}>
        {orderSimpleDTO.orderStatusDesc}
      </Descriptions.Item>

      {/* 经销商信息 */}
      <Descriptions.Item label="经销商" span={3}>
        {orderSimpleDTO.vendorName}
      </Descriptions.Item>
      <Descriptions.Item label="业务经理" span={3}>
        {orderSimpleDTO.managerName}
      </Descriptions.Item>
      <Descriptions.Item label="经销商联系方式" span={3}>
        {orderSimpleDTO.dealerContact}
      </Descriptions.Item>
      <Descriptions.Item label="经销商经营范围" span={3}>
        {orderSimpleDTO.dealerBusinessScope}
      </Descriptions.Item>

      {/* 供应商信息 */}
        {orderSimpleDTO?.bizCategory === 2 && (
            <>
              <Descriptions.Item label="供应商" span={3}>
                {orderSimpleDTO.supplier}
              </Descriptions.Item>
              <Descriptions.Item label="联系人" span={3}>
                {orderSimpleDTO.supplierContact}
              </Descriptions.Item>
              <Descriptions.Item label="供应商联系方式" span={3}>
                {orderSimpleDTO.supplierContactInfo}
              </Descriptions.Item>
            </>
        )}

        <Descriptions.Item  label={`出款凭证`} span={3}>
            <Space>
                {/*{orderDetail[key]?.map((url: string, index: number) => (*/}
                {/*    <Image*/}
                {/*        key={index}*/}
                {/*        width={100}*/}
                {/*        height={100}*/}
                {/*        src={url}*/}
                {/*        alt={`${label}凭证${index + 1}`}*/}
                {/*        style={{ objectFit: 'cover' }}*/}
                {/*    />*/}
                {/*))}*/}
            </Space>
        </Descriptions.Item>
    </Descriptions>
  );
};

export default BasicInfo;