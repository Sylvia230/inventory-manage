import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Space, Tag, Spin, message, Tabs } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import BasicInfo from './BasicInfo'
import VehicleInfo from './VehicleInfo'
import StorageInfo from './StorageInfo'
import LogisticsInfo from './LogisticsInfo'
import SettlementInfo from './SettlementInfo'
import AccountInfo from './AccountInfo'
import { OrderDetailInfo } from './interface'

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetailInfo | null>(null);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      // TODO: 调用API获取订单详情
      // 模拟数据 (确保这里填充所有tab所需的数据)
      setOrderDetail({
        id: id || '',
        orderNumber: 'ORD202403150001',
        productName: '奥迪A7L',
        productType: '新车',
        applyTime: '2024-03-15 10:00:00',
        status: 'approved',

        dealer: '测试经销商1',
        dealerManager: '王经理',
        applicant: '李四',
        dealerContact: '13912345678',
        dealerBusinessScope: '汽车销售',

        supplier: '测试供应商1',
        supplierContact: '赵经理',
        supplierContactInfo: '13787654321',

        depositVoucher: ['https://example.com/deposit1.jpg', 'https://example.com/deposit2.jpg'],
        otherPhotos: ['https://example.com/other1.jpg', 'https://example.com/other2.jpg'],

        vehicles: [
          {
            id: 'vehicle-001',
            status: 'in_stock',
            vin: 'VIN001TEST123456789',
            specification: '中规',
            model: '奥迪A7L 2024款 45 TFSI quattro黑武士版',
            appearance: '皓月白',
            interior: '黑/暗影灰',
            msrp: 479700,
            appraisedPrice: 450000,
            deposit: 50000,
            depositRate: 10,
            contractPrice: 400000,
            downPayment: 10000,
            inspectionPhotos: ['https://example.com/inspection1.jpg', 'https://example.com/inspection2.jpg'],
            damagePhotos: [],
            documents: [{ name: '车辆合格证', url: 'https://example.com/doc1.pdf' }],
          },
          {
            id: 'vehicle-002',
            status: 'in_transit',
            vin: 'VIN002TEST987654321',
            specification: '中规',
            model: '宝马5系 2023款 530Li 尊享型',
            appearance: '黑色',
            interior: '棕色',
            msrp: 450000,
            appraisedPrice: 420000,
            deposit: 40000,
            depositRate: 9,
            contractPrice: 380000,
            downPayment: 8000,
            inspectionPhotos: ['https://example.com/inspection3.jpg'],
            damagePhotos: ['https://example.com/damage1.jpg'],
            documents: [{ name: '车辆信息表', url: 'https://example.com/doc2.pdf' }],
          },
        ],
        storageInfo: [
          {
            model: '奥迪A7L',
            vin: 'VIN001TEST123456789',
            warehouseName: '上海一号仓',
            contactPerson: '王大力',
            contactPhone: '13900001111',
            warehouseAddress: '上海市青浦区xxx仓库',
            outboundTime: '2024-03-20 14:00:00',
            inboundTime: '2024-03-18 10:00:00',
          },
        ],
        logisticsInfo: [
          {
            model: '宝马5系',
            vin: 'VIN002TEST987654321',
            logisticsCompany: '顺丰速运',
            trackingNumber: 'SF123456789',
            deliveryTime: '2024-03-22 09:30:00',
            estimatedDeliveryTime: '2024-03-23 18:00:00',
            logisticsStatus: 'in_transit',
          },
        ],
        settlementInfo: [
          {
            settlementNumber: 'SETT20240325001',
            settlementAmount: 150000,
            settlementStatus: 'completed',
            settlementTime: '2024-03-25 16:00:00',
          },
        ],
        accountInfo: [
          {
            accountName: '张三汽车销售有限公司',
            openingBank: '中国工商银行',
            bankAccount: '6222020300012345678',
            accountStatus: 'normal',
          },
        ],
      });
    } catch (error) {
      message.error('获取订单详情失败');
      console.error('Fetch order detail error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/orderManage/list');
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '基础信息',
      children: orderDetail && <BasicInfo orderDetail={orderDetail} />,
    },
    {
      key: '2',
      label: '车辆信息',
      children: orderDetail && <VehicleInfo orderDetail={orderDetail} />,
    },
    {
      key: '3',
      label: '仓储信息',
      children: orderDetail && <StorageInfo orderDetail={orderDetail} />,
    },
    {
      key: '4',
      label: '物流信息',
      children: orderDetail && <LogisticsInfo orderDetail={orderDetail} />,
    },
    {
      key: '5',
      label: '结算信息',
      children: orderDetail && <SettlementInfo orderDetail={orderDetail} />,
    },
    {
      key: '6',
      label: '账户信息',
      children: orderDetail && <AccountInfo orderDetail={orderDetail} />,
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        未找到订单信息
      </div>
    );
  }

  return (
    <div className="order-detail">
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
          >
            返回列表
          </Button>
        </Space>

        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </div>
  );
};

export default OrderDetail; 