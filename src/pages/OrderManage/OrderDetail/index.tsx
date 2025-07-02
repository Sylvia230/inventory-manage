import React, { useState } from 'react';
import { Card, Tabs, message } from 'antd';
import { useParams } from 'react-router-dom';
import { OrderDetailInfo } from './interface';
import BasicInfo from './BasicInfo';
import VehicleInfo from './VehicleInfo';
import StorageInfo from './StorageInfo';
import LogisticsInfo from './LogisticsInfo';
import SettlementInfo from './SettlementInfo';
import AccountInfo from './AccountInfo';
// import OrderTable from './OrderTable';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  console.log('订单详情页面，获取到的ID:', id);
  
  const [orderDetail, setOrderDetail] = useState<OrderDetailInfo>({
    id: '1',
    orderNumber: 'YH202411060879036513',
    productName: '奥迪A4L',
    productType: '轿车',
    applyTime: '2024-11-06 16:24:22',
    status: 'pending',
    
    // 经销商信息
    dealer: '上海安趣盈科技有限公司',
    dealerManager: '巧莹',
    applicant: '黄巧莹',
    dealerContact: '17816869350',
    dealerBusinessScope: '汽车销售',
    
    // 供应商信息
    supplier: '上海喜马拉雅科技有限公司',
    supplierContact: '黄巧莹',
    supplierContactInfo: '17816869523',
    
    // 支付凭证
    depositVoucher: ['https://example.com/deposit1.jpg'],
    principalInterestVoucher: ['https://example.com/principal1.jpg'],
    serviceFeeVoucher: ['https://example.com/service1.jpg'],
    storageFeeVoucher: ['https://example.com/storage1.jpg'],
    logisticsFeeVoucher: ['https://example.com/logistics1.jpg'],
    
    // 其他照片
    otherPhotos: ['https://example.com/other1.jpg'],
    
    // 车辆信息
    vehicles: [
      {
        id: '1',
        status: 'normal',
        vin: 'LVGBE40K8GP123456',
        specification: '2.0T 自动 豪华型',
        model: '奥迪A4L 2020款 35 TFSI 时尚动感型',
        appearance: '白色',
        interior: '黑色',
        msrp: 320000,
        appraisedPrice: 300000,
        deposit: 30000,
        depositRate: 0.1,
        contractPrice: 170000,
        downPayment: 50000,
        inspectionPhotos: ['https://example.com/inspection1.jpg'],
        damagePhotos: ['https://example.com/damage1.jpg'],
        documents: [
          {
            name: '车辆登记证',
            url: 'https://example.com/registration.pdf',
          },
        ],
      },
      {
        id: '2',
        status: 'normal',
        vin: 'LVGBE40K8GP123457',
        specification: '1.5T 手动 舒适型',
        model: '宝骏530 2021款 全球车周年纪念版 1.5T 手动舒适型 5座',
        appearance: '红色',
        interior: '米色',
        msrp: 150000,
        appraisedPrice: 140000,
        deposit: 15000,
        depositRate: 0.1,
        contractPrice: 120000,
        downPayment: 30000,
        inspectionPhotos: ['https://example.com/inspection2.jpg'],
        damagePhotos: ['https://example.com/damage2.jpg'],
        documents: [
          {
            name: '车辆登记证',
            url: 'https://example.com/registration2.pdf',
          },
        ],
      },
    ],
    
    // 仓储信息
    storageInfo: [
      {
        model: '奥迪A4L 2020款 35 TFSI 时尚动感型',
        vin: 'LVGBE40K8GP123456',
        warehouseName: '上海仓库',
        contactPerson: '张经理',
        contactPhone: '13800138000',
        warehouseAddress: '上海市浦东新区XX路XX号',
        outboundTime: '2024-11-07 10:00:00',
        inboundTime: '2024-11-06 15:00:00',
      },
    ],
    
    // 物流信息
    logisticsInfo: [
      {
        model: '奥迪A4L 2020款 35 TFSI 时尚动感型',
        vin: 'LVGBE40K8GP123456',
        logisticsCompany: '顺丰速运',
        trackingNumber: 'SF1234567890',
        deliveryTime: '2024-11-08 14:00:00',
        estimatedDeliveryTime: '2024-11-08 16:00:00',
        logisticsStatus: '运输中',
      },
    ],
    
    // 结算信息
    settlementInfo: [
      {
        settlementNumber: 'JS202411060001',
        settlementAmount: 170000,
        settlementStatus: '待结算',
        settlementTime: '2024-11-06 16:24:22',
      },
    ],
    
    // 账户信息
    accountInfo: {
      accountName: '张三汽车销售有限公司',
      openingBank: '中国工商银行',
      bankAccount: '6222020300012345678',
      accountStatus: 'normal',
    },
    disbursementAccount: {
      accountName: '出款公司',
      bankAccount: '6222020300098765432',
      openingBank: '中国建设银行',
    },
    supplierCollectionAccount: {
      accountName: '供应商A',
      bankAccount: '6222020300011223344',
      openingBank: '中国农业银行',
    },
    dealerRepaymentAccount: {
      accountName: '经销商B',
      bankAccount: '6222020300055667788',
      openingBank: '中国银行',
    },
    capitalCollectionAccount: {
      accountName: '资方C',
      bankAccount: '6222020300099887766',
      openingBank: '招商银行',
    },
    marginCollectionAccount: {
      accountName: '保证金专用',
      bankAccount: '6222020300011122233',
      openingBank: '浦发银行',
    },
    serviceFeeCollectionAccount: {
      accountName: '服务费专用',
      bankAccount: '6222020300044455566',
      openingBank: '交通银行',
    },
    storageFeeCollectionAccount: {
      accountName: '仓储费专用',
      bankAccount: '6222020300077788899',
      openingBank: '中信银行',
    },
    logisticsFeeCollectionAccount: {
      accountName: '物流费专用',
      bankAccount: '6222020300000011122',
      openingBank: '光大银行',
    },
  });

  const items = [
    {
      key: 'basic',
      label: '基本信息',
      children: <BasicInfo orderDetail={orderDetail} />,
    },
    {
      key: 'vehicle',
      label: '车辆信息',
      children: <VehicleInfo orderDetail={orderDetail} />,
    },
    {
      key: 'storage',
      label: '仓储信息',
      children: <StorageInfo orderDetail={orderDetail} />,
    },
    {
      key: 'logistics',
      label: '物流信息',
      children: <LogisticsInfo orderDetail={orderDetail} />,
    },
    {
      key: 'settlement',
      label: '结算信息',
      children: <SettlementInfo orderDetail={orderDetail} />,
    },
    {
      key: 'account',
      label: '账户信息',
      children: <AccountInfo orderDetail={orderDetail} />,
    },
  ];

  return (
    <div>
      {/* <OrderTable orderData={orderDetail} /> */}
      <Card style={{ marginTop: '24px' }}>
        <Tabs items={items} />
      </Card>
    </div>
  );
};

export default OrderDetail; 