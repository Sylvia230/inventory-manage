import React from 'react';
import { Table, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { OrderDetailInfo } from '../interface';

interface StorageInfoProps {
  orderDetail: OrderDetailInfo;
}

interface StorageItem {
  model: string;
  vin: string;
  warehouseName: string;
  contactPerson: string;
  contactPhone: string;
  warehouseAddress: string;
  outboundTime: string;
  inboundTime: string;
}

const StorageInfo: React.FC<StorageInfoProps> = ({ orderDetail }) => {
  const columns: ColumnsType<StorageItem> = [
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
      title: '仓库',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 150,
    },
    {
      title: '联系人/电话',
      key: 'contact',
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span>联系人：{record.contactPerson}</span>
          <span>电话：{record.contactPhone}</span>
        </Space>
      ),
    },
    {
      title: '仓库地址',
      dataIndex: 'warehouseAddress',
      key: 'warehouseAddress',
      width: 200,
    },
    {
      title: '出库时间',
      dataIndex: 'outboundTime',
      key: 'outboundTime',
      width: 180,
    },
    {
      title: '入库时间',
      dataIndex: 'inboundTime',
      key: 'inboundTime',
      width: 180,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orderDetail.storageInfo || []}
      rowKey="vin"
      pagination={false}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default StorageInfo;
