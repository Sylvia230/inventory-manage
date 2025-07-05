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
      console.log('详情页面检查store中的当前订单:', orderStore.currentOrder);
      
      // 优先从 store 中获取当前订单数据
      if (orderStore.currentOrder && (orderStore.currentOrder.orderNumber === id || orderStore.currentOrder.id === id)) {
        console.log('详情页面从store获取到当前订单数据:', orderStore.currentOrder);
        setOrderDetail(orderStore.currentOrder);
      } else {
        // 如果 store 中没有当前订单数据，尝试从订单列表中查找
        const orderData = orderStore.getOrderByNo(id);
        console.log('...orderData', orderData)
        setOrderDetail(orderData);
      }
    }
  }, [id]);
  
  if (!orderDetail) {
    return <div>加载中...</div>;
  }

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
});

export default OrderDetail; 