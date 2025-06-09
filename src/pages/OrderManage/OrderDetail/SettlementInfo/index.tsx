import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { OrderDetailInfo } from '../interface';

interface SettlementInfoProps {
  orderDetail: OrderDetailInfo;
}

interface SettlementItem {
  settlementNumber: string;
  settlementAmount: number;
  settlementStatus: string;
  settlementTime: string;
}

const SettlementInfo: React.FC<SettlementInfoProps> = ({ orderDetail }) => {
  const columns: ColumnsType<SettlementItem> = [
    {
      title: '结算单号',
      dataIndex: 'settlementNumber',
      key: 'settlementNumber',
      width: 180,
    },
    {
      title: '结算金额',
      dataIndex: 'settlementAmount',
      key: 'settlementAmount',
      width: 150,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '结算状态',
      dataIndex: 'settlementStatus',
      key: 'settlementStatus',
      width: 120,
      render: (status: string) => (
        <Tag color={
          status === 'pending' ? 'orange' :
          status === 'completed' ? 'green' :
          status === 'failed' ? 'red' :
          'default'
        }>
          {status === 'pending' ? '待结算' :
           status === 'completed' ? '已结算' :
           status === 'failed' ? '结算失败' :
           status}
        </Tag>
      ),
    },
    {
      title: '结算时间',
      dataIndex: 'settlementTime',
      key: 'settlementTime',
      width: 180,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orderDetail.settlementInfo || []}
      rowKey="settlementNumber"
      pagination={false}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default SettlementInfo; 