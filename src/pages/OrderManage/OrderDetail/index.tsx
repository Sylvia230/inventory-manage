import React, { useState, useEffect } from 'react';
import { Card, Tabs, message } from 'antd';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { OrderDetailInfo } from './interface';
import BasicInfo from './BasicInfo';
import VehicleInfo from './VehicleInfo';
import StorageInfo from './StorageInfo';
import LogisticsInfo from './LogisticsInfo';
import SettlementInfo from './SettlementInfo';
import AccountInfo from './AccountInfo';
import orderStore from '@/stores/order';
import {GetDetailApi} from "@/services/order.ts";
// import OrderTable from './OrderTable';

const OrderDetail: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  
  console.log('订单详情页面，获取到的订单号:', id);
  
  const [orderDetail, setOrderDetail] = useState<any>(null);
  
  // 组件卸载时清理数据
  useEffect(() => {
    return () => {
      orderStore.clear();
    };
  }, []);
  
  useEffect(() => {
    if (id) {
      fetchDetail(id);
    }
  }, [id]);

  const fetchDetail = async (orderNo: string) => {
    try {
      const res = await GetDetailApi(orderNo);
      setOrderDetail(res);
    } catch (error) {
      message.error("加载详情失败")
    }
  }
  
  if (!orderDetail) {
    return <div>加载中...</div>;
  }

  const items = [
    {
      key: 'basic',
      label: '基本信息',
      children: <BasicInfo orderSimpleDTO={orderDetail.orderSimpleDTO} />,
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
});

export default OrderDetail; 