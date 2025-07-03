import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Table, Button, Space, Tag, Form, Input, InputNumber, message } from 'antd';
import { ArrowLeftOutlined, DollarOutlined } from '@ant-design/icons';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';

// 结算单基础信息
interface SettlementInfo {
  settlementId: string;
  orderNo: string;
  vehicleCount: number;
  customerName?: string; // 保证金类型
  deadline?: string; // 本息类型、服务费类型
  type: 'deposit' | 'interest' | 'service'; // 保证金、本息、服务费
  amount: number;
  status: string;
  createTime: string;
}

// 保证金车辆信息
interface DepositVehicle {
  key: string;
  vehicleType: string;
  depositAmount: number;
}

// 本息车辆信息
interface InterestVehicle {
  key: string;
  vin: string;
  vehicleType: string;
  loanAmount: number;
  interest: number;
  settlementAmount: number;
}

// 服务费明细
interface ServiceFeeDetail {
  key: string;
  dailyRate: number;
  fee: number;
  loanDate: string;
  endDate: string;
  chargeDays: number;
  vehicleType: string;
  vin: string;
}

// 本息明细信息
interface InterestDetail {
  startTime: string;
  endTime: string;
  chargeDays: number;
  rate: number;
}

const SettlementDetail: React.FC = () => {
  const { settlementId } = useParams<{ settlementId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [settlementInfo, setSettlementInfo] = useState<SettlementInfo | null>(null);
  const [interestDetail, setInterestDetail] = useState<InterestDetail | null>(null);
  const [adjustForm] = Form.useForm();
  
  // 检查是否为调价模式
  const isAdjustMode = searchParams.get('mode') === 'adjust';

  // 模拟获取结算单详情数据
  useEffect(() => {
    if (settlementId) {
      // 模拟API调用
      fetchSettlementDetail(settlementId);
    }
  }, [settlementId]);

  const fetchSettlementDetail = (id: string) => {
    // 模拟不同类型的数据
    const mockData = {
      'JS202403150001': {
        settlementId: 'JS202403150001',
        orderNo: 'YH202411060879036513',
        vehicleCount: 15,
        customerName: '上海汽车贸易有限公司',
        type: 'deposit' as const,
        amount: 150000.00,
        status: 'approved',
        createTime: '2024-03-15 10:00:00',
      },
      'JS202403150002': {
        settlementId: 'JS202403150002',
        orderNo: 'YH202411060879036514',
        vehicleCount: 8,
        deadline: '2024-04-15 23:59:59',
        type: 'interest' as const,
        amount: 200000.00,
        status: 'pending',
        createTime: '2024-03-15 11:00:00',
      },
      'JS202403150003': {
        settlementId: 'JS202403150003',
        orderNo: 'YH202411060879036515',
        vehicleCount: 12,
        deadline: '2024-05-15 23:59:59',
        type: 'service' as const,
        amount: 65000.00,
        status: 'approved',
        createTime: '2024-03-15 12:00:00',
      },
    };

    const detail = mockData[id as keyof typeof mockData] || mockData['JS202403150001'];
    setSettlementInfo(detail);

    // 如果是本息类型，设置本息明细
    if (detail.type === 'interest') {
      setInterestDetail({
        startTime: '2024-01-01 00:00:00',
        endTime: '2024-03-15 23:59:59',
        chargeDays: 74,
        rate: 0.0008, // 万分之8
      });
    }
  };

  // 保证金车辆列表
  const depositVehicleData: DepositVehicle[] = [
    { key: '1', vehicleType: '奔驰C200', depositAmount: 10000 },
    { key: '2', vehicleType: '宝马320i', depositAmount: 12000 },
    { key: '3', vehicleType: '奥迪A4L', depositAmount: 11000 },
  ];

  // 本息车辆列表
  const interestVehicleData: InterestVehicle[] = [
    {
      key: '1',
      vin: 'LSVAM4187C2184841',
      vehicleType: '奔驰C200',
      loanAmount: 150000,
      interest: 8880,
      settlementAmount: 158880,
    },
    {
      key: '2',
      vin: 'LSVAM4187C2184842',
      vehicleType: '宝马320i',
      loanAmount: 180000,
      interest: 10656,
      settlementAmount: 190656,
    },
  ];

  // 服务费明细列表
  const serviceFeeData: ServiceFeeDetail[] = [
    {
      key: '1',
      dailyRate: 0.0001,
      fee: 500,
      loanDate: '2024-01-01',
      endDate: '2024-01-15',
      chargeDays: 14,
      vehicleType: '奔驰C200',
      vin: 'LSVAM4187C2184841',
    },
    {
      key: '2',
      dailyRate: 0.0001,
      fee: 600,
      loanDate: '2024-01-01',
      endDate: '2024-01-18',
      chargeDays: 17,
      vehicleType: '宝马320i',
      vin: 'LSVAM4187C2184842',
    },
  ];

  // 保证金车辆表格列
  const depositColumns: ColumnsType<DepositVehicle> = [
    {
      title: '车型',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
    },
    {
      title: '保证金金额',
      dataIndex: 'depositAmount',
      key: 'depositAmount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
  ];

  // 本息车辆表格列
  const interestColumns: ColumnsType<InterestVehicle> = [
    {
      title: '车架号',
      dataIndex: 'vin',
      key: 'vin',
    },
    {
      title: '车型',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
    },
    {
      title: '出款金额',
      dataIndex: 'loanAmount',
      key: 'loanAmount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '利息',
      dataIndex: 'interest',
      key: 'interest',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '结算金额',
      dataIndex: 'settlementAmount',
      key: 'settlementAmount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
  ];

  // 服务费表格列
  const serviceFeeColumns: ColumnsType<ServiceFeeDetail> = [
    {
      title: '日费率',
      dataIndex: 'dailyRate',
      key: 'dailyRate',
      render: (rate: number) => `${(rate * 10000).toFixed(1)}‰`,
    },
    {
      title: '费用',
      dataIndex: 'fee',
      key: 'fee',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '借款日期',
      dataIndex: 'loanDate',
      key: 'loanDate',
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: '计费天数',
      dataIndex: 'chargeDays',
      key: 'chargeDays',
      render: (days: number) => `${days}天`,
    },
    {
      title: '车型',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
    },
    {
      title: '车架号',
      dataIndex: 'vin',
      key: 'vin',
    },
  ];

  const handleBack = () => {
    navigate('/financeManage/balance');
  };

  // 确认调价
  const handleConfirmAdjust = async () => {
    try {
      const values = await adjustForm.validateFields();
      
      const adjustData = {
        settlementId: settlementInfo?.settlementId,
        adjustAmount: values.adjustAmount,
        remark: values.remark,
        originalAmount: settlementInfo?.amount,
      };
      
      console.log('调价数据:', adjustData);
      
      // TODO: 调用调价API
      // await adjustSettlementApi(adjustData);
      
      message.success('调价成功');
      navigate('/financeManage/balance');
    } catch (error) {
      console.error('调价失败:', error);
      message.error('调价失败，请重试');
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'orange',
      approved: 'green',
      rejected: 'red',
    };
    return colorMap[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const textMap: Record<string, string> = {
      pending: '待审核',
      approved: '已通过',
      rejected: '已拒绝',
    };
    return textMap[status] || status;
  };

  const getTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      deposit: '保证金',
      interest: '本息',
      service: '服务费',
    };
    return typeMap[type] || type;
  };

  if (!settlementInfo) {
    return <div>加载中...</div>;
  }

  return (
    <div className={styles.container}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            style={{ background: 'transparent' }}
          >
            返回
          </Button>
          <h2>
            {isAdjustMode ? '结算单调价' : '结算单详情'} - {settlementInfo.settlementId}
          </h2>
          {/* {!isAdjustMode && (
            <Tag color={getStatusColor(settlementInfo.status)}>
              {getStatusText(settlementInfo.status)}
            </Tag>
          )}
          {isAdjustMode && (
            <Tag color="blue" icon={<DollarOutlined />}>
              调价模式
            </Tag>
          )} */}
        </Space>
      </div>

      {/* 基础信息 */}
      <Card title="基础信息" className={styles.card}>
        <Descriptions column={3} bordered>
          <Descriptions.Item label="结算单号" span={1}>
            {settlementInfo.settlementId}
          </Descriptions.Item>
          <Descriptions.Item label="订单号" span={1}>
            {settlementInfo.orderNo}
          </Descriptions.Item>
          <Descriptions.Item label="车辆总台数" span={1}>
            {settlementInfo.vehicleCount}台
          </Descriptions.Item>
          
          {/* 保证金类型显示客户名称 */}
          {settlementInfo.type === 'deposit' && settlementInfo.customerName && (
            <Descriptions.Item label="客户名称" span={1}>
              {settlementInfo.customerName}
            </Descriptions.Item>
          )}
          
          {/* 本息和服务费类型显示截止时间 */}
          {(settlementInfo.type === 'interest' || settlementInfo.type === 'service') && settlementInfo.deadline && (
            <Descriptions.Item label="截止时间" span={1}>
              {settlementInfo.deadline}
            </Descriptions.Item>
          )}
          
          <Descriptions.Item label="结算类型" span={1}>
            {getTypeText(settlementInfo.type)}
          </Descriptions.Item>
          <Descriptions.Item label="结算金额" span={1}>
            ¥{settlementInfo.amount.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={1}>
            {settlementInfo.createTime}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 本息类型的额外信息 */}
      {/* {settlementInfo.type === 'interest' && interestDetail && (
        <Card title="本息明细" className={styles.card}>
          <Descriptions column={4} bordered>
            <Descriptions.Item label="开始时间" span={1}>
              {interestDetail.startTime}
            </Descriptions.Item>
            <Descriptions.Item label="结束时间" span={1}>
              {interestDetail.endTime}
            </Descriptions.Item>
            <Descriptions.Item label="计费天数" span={1}>
              {interestDetail.chargeDays}天
            </Descriptions.Item>
            <Descriptions.Item label="费率" span={1}>
              {(interestDetail.rate * 10000).toFixed(1)}‰/日
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )} */}

      {/* 结算明细 - 根据类型显示不同内容 */}
      <Card title="结算明细" className={styles.card}>
        {settlementInfo.type === 'deposit' && (
          <Table
            columns={depositColumns}
            dataSource={depositVehicleData}
            pagination={false}
            // summary={() => (
            //   <Table.Summary.Row>
            //     <Table.Summary.Cell index={0}>
            //       <strong>合计</strong>
            //     </Table.Summary.Cell>
            //     <Table.Summary.Cell index={1}>
            //       <strong>
            //         ¥{depositVehicleData.reduce((sum, item) => sum + item.depositAmount, 0).toLocaleString()}
            //       </strong>
            //     </Table.Summary.Cell>
            //   </Table.Summary.Row>
            // )}
          />
        )}

        {settlementInfo.type === 'interest' && interestDetail  && (
            <>
             <Descriptions column={4} bordered>
                <Descriptions.Item label="开始时间" span={1}>
                {interestDetail.startTime}
                </Descriptions.Item>
                <Descriptions.Item label="结束时间" span={1}>
                {interestDetail.endTime}
                </Descriptions.Item>
                <Descriptions.Item label="计费天数" span={1}>
                {interestDetail.chargeDays}天
                </Descriptions.Item>
                <Descriptions.Item label="费率" span={1}>
                {(interestDetail.rate * 10000).toFixed(1)}‰/日
                </Descriptions.Item>
            </Descriptions>
            <Table
                columns={interestColumns}
                dataSource={interestVehicleData}
                pagination={false}
                style={{marginTop: '20px'}}
            />
            </>
          
        )}

        {settlementInfo.type === 'service' && (
          <Table
            columns={serviceFeeColumns}
            dataSource={serviceFeeData}
            pagination={false}
            // summary={() => (
            //   <Table.Summary.Row>
            //     <Table.Summary.Cell index={0}>
            //       <strong>合计</strong>
            //     </Table.Summary.Cell>
            //     <Table.Summary.Cell index={1}>
            //       <strong>
            //         ¥{serviceFeeData.reduce((sum, item) => sum + item.fee, 0).toLocaleString()}
            //       </strong>
            //     </Table.Summary.Cell>
            //     <Table.Summary.Cell index={2} colSpan={5} />
            //   </Table.Summary.Row>
            // )}
                     />
         )}
       </Card>

       {/* 调价功能 - 仅在调价模式下显示 */}
       {isAdjustMode && (
         <Card title="结算单调价" className={styles.card}>
           <Form
             form={adjustForm}
             layout="vertical"
             initialValues={{
               originalAmount: settlementInfo.amount,
             }}
           >
             <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
               <Form.Item
                 label="原结算金额"
                 style={{ flex: 1 }}
               >
                 <Input
                   value={`¥${settlementInfo.amount.toLocaleString()}`}
                   disabled
                   style={{ backgroundColor: '#f5f5f5' }}
                 />
               </Form.Item>
               
               <Form.Item
                 name="adjustAmount"
                 label="调价金额"
                 rules={[
                   { required: true, message: '请输入调价金额' },
                   { type: 'number', min: 0.01, message: '调价金额必须大于0' }
                 ]}
                 style={{ flex: 1 }}
               >
                                   <InputNumber
                    style={{ width: '100%' }}
                    placeholder="请输入调价金额"
                    precision={2}
                    min={0.01}
                    addonBefore="¥"
                  />
               </Form.Item>
             </div>
             
             <Form.Item
               name="remark"
               label="备注"
               rules={[{ required: true, message: '请输入调价原因' }]}
             >
               <Input.TextArea
                 rows={4}
                 placeholder="请输入调价原因..."
                 maxLength={500}
                 showCount
               />
             </Form.Item>
             
             <Form.Item>
               <Space size="large">
                 <Button 
                   type="primary" 
                   size="large"
                   onClick={handleConfirmAdjust}
                 >
                   确认调价
                 </Button>
                 <Button 
                   size="large"
                   onClick={handleBack}
                 >
                   取消
                 </Button>
               </Space>
             </Form.Item>
           </Form>
         </Card>
       )}
     </div>
   );
 };
 
 export default SettlementDetail; 