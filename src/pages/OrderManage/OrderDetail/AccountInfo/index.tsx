import React from 'react';
import { Descriptions, Space } from 'antd';
import { OrderDetailInfo } from '../interface';

interface AccountInfoProps {
  orderDetail: OrderDetailInfo;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ orderDetail }) => {
  const accountTypes = [
    { key: 'disbursementAccount', label: '出款账户' },
    { key: 'supplierCollectionAccount', label: '供应商收款账户' },
    { key: 'dealerRepaymentAccount', label: '经销商还款账户' },
    { key: 'capitalCollectionAccount', label: '资方收款账户' },
    { key: 'marginCollectionAccount', label: '保证金收款账户' },
    { key: 'serviceFeeCollectionAccount', label: '服务费收款账户' },
    { key: 'storageFeeCollectionAccount', label: '仓储费收款账户' },
    { key: 'logisticsFeeCollectionAccount', label: '物流费收款账户' },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {accountTypes.map((type) => {
        const account = orderDetail[type.key as keyof OrderDetailInfo] as any;
        if (account) {
          return (
            <Descriptions key={type.key} title={type.label} bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="户名" span={3}>
                {account.accountName}
              </Descriptions.Item>
              <Descriptions.Item label="账号" span={3}>
                {account.bankAccount}
              </Descriptions.Item>
              <Descriptions.Item label="开户行" span={3}>
                {account.openingBank}
              </Descriptions.Item>
            </Descriptions>
          );
        }
        return null;
      })}
    </Space>
  );
};

export default AccountInfo; 