import React from 'react';
import { Modal, Descriptions, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';

interface ViewDetailModalProps {
  open: boolean;
  onCancel: () => void;
  data: any; // 实际使用时应该定义具体的类型
}

interface VehicleRecord {
  vin: string;
  attributes: string;
  quantity: number;
  status: string;
  operator: string;
  operateTime: string;
}

const ViewDetailModal: React.FC<ViewDetailModalProps> = ({
  open,
  onCancel,
  data
}) => {
  const columns: ColumnsType<VehicleRecord> = [
    {
      title: '车架号',
      dataIndex: 'vin',
      width: 180,
    },
    {
      title: '车辆属性',
      dataIndex: 'vehicleName',
      width: 200,
    },
    {
      title: '车辆状态',
      dataIndex: 'statusDesc',
      width: 120,
    },
    // {
    //   title: '操作人',
    //   dataIndex: 'operator',
    //   width: 120,
    // },
  ];

  return (
    <Modal
      title="入库单详情"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={1200}
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
    >
      <div className={styles.detailContent}>
        <Descriptions title="基本信息" bordered column={3}>
          <Descriptions.Item label="入库单编号">{data?.inboundNo}</Descriptions.Item>
          <Descriptions.Item label="接收仓库">{data?.warehouseName}</Descriptions.Item>
          <Descriptions.Item label="入库单生成时间">{data?.createTime}</Descriptions.Item>
          {/* <Descriptions.Item label="预计到库时间">{data?.expectedTime}</Descriptions.Item> */}
          {/* <Descriptions.Item label="来源">{data?.source}</Descriptions.Item> */}
          {/* <Descriptions.Item label="来源单号">{data?.orderNo}</Descriptions.Item> */}
          <Descriptions.Item label="入库类型">{data?.typeDesc}</Descriptions.Item>
          <Descriptions.Item label="车辆总数">{data?.wmsCarDTOList?.length}</Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{data?.remark}</Descriptions.Item>
        </Descriptions>

        <Descriptions title="客户信息" bordered column={3} style={{ marginTop: 24 }}>
          <Descriptions.Item label="客户名称">{data?.customerName}</Descriptions.Item>
          <Descriptions.Item label="联系人">{data?.customerContact}</Descriptions.Item>
          <Descriptions.Item label="联系方式">{data?.customerPhone}</Descriptions.Item>
        </Descriptions>

        {/* <Descriptions title="物流信息" bordered column={3} style={{ marginTop: 24 }}>
          <Descriptions.Item label="物流公司">{data?.logistics}</Descriptions.Item>
          <Descriptions.Item label="联系人">{data?.logisticsContact}</Descriptions.Item>
          <Descriptions.Item label="联系方式">{data?.logisticsPhone}</Descriptions.Item>
        </Descriptions> */}
        <div className={styles.vehicleTable}>
          <h3>车辆信息</h3>
          <Table
            columns={columns}
            dataSource={data?.wmsCarDTOList}
            pagination={false}
            scroll={{ x: 1000 }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ViewDetailModal; 