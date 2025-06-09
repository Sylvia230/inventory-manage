import React from 'react';
import { Table, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { OrderDetailInfo } from '../interface';

interface LogisticsInfoProps {
  orderDetail: OrderDetailInfo;
}

interface LogisticsItem {
  model: string;
  vin: string;
  logisticsCompany: string;
  trackingNumber: string;
  deliveryTime: string;
  estimatedDeliveryTime: string;
  logisticsStatus: string;
}

const LogisticsInfo: React.FC<LogisticsInfoProps> = ({ orderDetail }) => {
  const columns: ColumnsType<LogisticsItem> = [
    {
      title: '车型',
      dataIndex: 'model',
      key: 'model',
      width: 150,
    },
    {
      title: '车架号',
      dataIndex: 'vin',
      key: 'vin',
      width: 180,
    },
    {
      title: '物流公司',
      dataIndex: 'logisticsCompany',
      key: 'logisticsCompany',
      width: 150,
    },
    {
      title: '运单号',
      dataIndex: 'trackingNumber',
      key: 'trackingNumber',
      width: 180,
    },
    {
      title: '发货时间',
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
      width: 180,
    },
    {
      title: '预计送达时间',
      dataIndex: 'estimatedDeliveryTime',
      key: 'estimatedDeliveryTime',
      width: 180,
    },
    {
      title: '物流状态',
      dataIndex: 'logisticsStatus',
      key: 'logisticsStatus',
      width: 120,
      render: (status: string) => (
        <Tag color={
          status === 'in_transit' ? 'blue' :
          status === 'delivered' ? 'green' :
          status === 'exception' ? 'red' :
          'default'
        }>
          {status === 'in_transit' ? '运输中' :
           status === 'delivered' ? '已送达' :
           status === 'exception' ? '异常' :
           status}
        </Tag>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orderDetail.logisticsInfo || []}
      rowKey="vin"
      pagination={false}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default LogisticsInfo; 