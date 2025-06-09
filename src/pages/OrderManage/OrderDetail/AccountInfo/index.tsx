import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { OrderDetailInfo } from '../interface';

interface AccountInfoProps {
  orderDetail: OrderDetailInfo;
}

interface AccountItem {
  accountName: string;
  openingBank: string;
  bankAccount: string;
  accountStatus: string;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ orderDetail }) => {
  const columns: ColumnsType<AccountItem> = [
    {
      title: '账户名称',
      dataIndex: 'accountName',
      key: 'accountName',
      width: 150,
    },
    {
      title: '开户行',
      dataIndex: 'openingBank',
      key: 'openingBank',
      width: 180,
    },
    {
      title: '银行账号',
      dataIndex: 'bankAccount',
      key: 'bankAccount',
      width: 200,
    },
    {
      title: '账户状态',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      width: 120,
      render: (status: string) => (
        <Tag color={status === 'normal' ? 'green' : status === 'frozen' ? 'red' : 'default'}>
          {status === 'normal' ? '正常' : status === 'frozen' ? '冻结' : status}
        </Tag>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orderDetail.accountInfo || []}
      rowKey="bankAccount"
      pagination={false}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default AccountInfo; 