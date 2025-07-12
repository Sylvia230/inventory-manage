import React, { useState } from 'react';
import { Modal, Descriptions, Table, Button, Space, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import InboundOperationModal from '../InboundOperationModal';
import styles from './index.module.less';
import { inboundOperationApi } from '@/services/wareHouse';

interface AuditModalProps {
  open: boolean;
  onCancel: () => void;
  onReject: () => void;
  onApprove: () => void;
  data: any; // 实际使用时应该定义具体的类型
  onRefresh?: () => void; // 刷新数据的回调函数
}

interface VehicleRecord {
  spec: string;
  brand: string;
  series: string;
  model: string;
  interior: string;
  exterior: string;
  quantity: number;
  vins: string[];
}

const AuditModal: React.FC<AuditModalProps> = ({
  open,
  onCancel,
  onReject,
  onApprove,
  data,
  onRefresh
}) => {
  const [inboundModalVisible, setInboundModalVisible] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<any>(null);

  // 处理入库操作
  const handleInStock = (record: VehicleRecord) => {
    setCurrentVehicle(record);
    setInboundModalVisible(true);
  };

  // 处理入库操作提交
  const handleInboundSubmit = async (values: any) => {
    try {
      console.log('入库操作数据:', values);
      // 这里调用入库操作API
      await inboundOperationApi(values);
      message.success('入库操作成功');
      setInboundModalVisible(false);
      data.wmsCarDTOList = data.wmsCarDTOList.map((item: any) => {
        if (item.id === currentVehicle.carId) {
          item.status = 2;
          item.statusDesc = '已入库';
        }
        return item;
      });
      setCurrentVehicle(null);
      
      // 刷新数据
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      message.error('入库操作失败');
    }
  };

  // 模拟GPS选项
  const gpsOptions = [
    { id: 'gps1', name: 'GPS设备001' },
    { id: 'gps2', name: 'GPS设备002' },
    { id: 'gps3', name: 'GPS设备003' },
  ];

  const columns: ColumnsType<VehicleRecord> = [
    {
      title: '车型',
      dataIndex: 'model',
      width: 600,
      render: (_, record:any) => (
        <span>{record.vehicleName}</span>
      ),
    },
    {
      title: '车架号',
      dataIndex: 'vin',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'statusDesc',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 150,
      render: (_, record:any) => (
          record.status === 1 ? (
            <Button type="link" onClick={() => {
              handleInStock(record);
            }}>入库</Button>): null
      ),
    },
  ];

  // 计算库位相关数据的展示样式
  const getSpaceStatusStyle = () => {
    const availableSpace = data?.availableSpace || 0;
    const requiredSpace = data?.pendingVehicles || 0;
    const actualAvailableSpace = availableSpace - requiredSpace;
    
    if (actualAvailableSpace < 0) {
      return { color: '#ff4d4f' }; // 红色，库位不足
    }
    if (actualAvailableSpace < 10) {
      return { color: '#faad14' }; // 黄色，库位紧张
    }
    return { color: '#52c41a' }; // 绿色，库位充足
  };

  return (
    <>
      <Modal
        title="入库"
        open={open}
        onCancel={onCancel}
        footer={null}
        width={1200}
        bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
      >
        <div className={styles.auditContent}>
          <Descriptions title="" bordered column={3}>
            <Descriptions.Item label="入库单号">{data?.inboundNo}</Descriptions.Item>
            <Descriptions.Item label="接收仓库">{data?.warehouseName}</Descriptions.Item>
            <Descriptions.Item label="入库单生成时间">{data?.createTime}</Descriptions.Item>
          </Descriptions>

          <Descriptions title="" bordered column={3} style={{ marginTop: 24 }}>
            <Descriptions.Item label="库位可用数">{data?.parkingLotCount}</Descriptions.Item>
            <Descriptions.Item label="在库车辆数">{data?.onLotCarCount}</Descriptions.Item>
            <Descriptions.Item label="实际可用库位数">
              <span style={getSpaceStatusStyle()}>
                {(data?.availableCount || 0) - (data?.availableCount || 0)}
              </span>
            </Descriptions.Item>
          </Descriptions>

          <Descriptions title="" bordered column={3} style={{ marginTop: 24 }}>
            {/* <Descriptions.Item label="业务员">{data?.salesperson}</Descriptions.Item>
            <Descriptions.Item label="联系方式">{data?.salespersonPhone}</Descriptions.Item> */}
            <Descriptions.Item label="客户">{data?.customerName}</Descriptions.Item>
            {/* <Descriptions.Item label="客户类型">
              <Tag color={data?.customerType === '个人' ? 'blue' : 'green'}>
                {data?.customerType}
              </Tag>
            </Descriptions.Item> */}
            <Descriptions.Item label="联系人">{data?.customerContact}</Descriptions.Item>
            <Descriptions.Item label="联系方式">{data?.customerPhone}</Descriptions.Item>
          </Descriptions>

          <div className={styles.vehicleTable}>
            <h3>车辆信息</h3>
            <Table
              columns={columns}
              dataSource={data?.wmsCarDTOList}
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </div>

          <div className={styles.remarks}>
            <h3>备注</h3>
            <div className={styles.remarksContent}>{data?.remarks || '无'}</div>
          </div>

          {/* <div className={styles.footer}>
            <Space size="middle">
              <Button type="primary" danger onClick={onReject}>
                拒绝入库
              </Button>
              <Button type="primary" onClick={onApprove}>
                同意入库
              </Button>
            </Space>
          </div> */}
        </div>
      </Modal>

      {/* 入库操作弹窗 */}
      <InboundOperationModal
        visible={inboundModalVisible}
        onCancel={() => {
          setInboundModalVisible(false);
          setCurrentVehicle(null);
        }}
        onOk={handleInboundSubmit}
        vehicleData={currentVehicle}
        gpsOptions={gpsOptions}
        data={data}
      />
    </>
  );
};

export default AuditModal; 