// 车辆信息组件
import React, { useState } from 'react';
import { Table, Card, Tag, Space, Image, Descriptions } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { OrderDetailInfo, VehicleData } from '../interface';
import { CaretRightOutlined } from '@ant-design/icons';
import VehicleDetailExpansion from './VehicleDetailExpansion';

interface VehicleInfoProps {
  orderDetail: OrderDetailInfo;
}

type ExpandRowData = { id: string; isExpandRow: true; vehicleId: string; };
type TableDataItem = VehicleData | ExpandRowData;

const VehicleInfo: React.FC<VehicleInfoProps> = ({ orderDetail }) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const columns: ColumnsType<TableDataItem> = [
    {
      title: '车辆ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (text: string, record: TableDataItem) => {
        if ((record as ExpandRowData).isExpandRow) {
          return {
            children: (
              <Space>
                <CaretRightOutlined rotate={expandedRows.includes(record.id) ? 90 : 0} />
                验车照片/质损照片/资料信息
              </Space>
            ),
            props: { colSpan: columns.length },
          };
        }
        return text;
      },
    },
    // {
    //   title: '车辆状态',
    //   dataIndex: 'status',
    //   key: 'status',
    //   width: 80,
    //   render: (status: string, record: TableDataItem) => {
    //     if ((record as ExpandRowData).isExpandRow) return { props: { colSpan: 0 } };
    //     const vehicleRecord = record as VehicleData;
    //     return (
    //       <Tag color={
    //         vehicleRecord.status === 'in_stock' ? 'green' :
    //         vehicleRecord.status === 'in_transit' ? 'blue' :
    //         vehicleRecord.status === 'delivered' ? 'purple' :
    //         'default'
    //       }>
    //         {vehicleRecord.status === 'in_stock' ? '在库' :
    //          vehicleRecord.status === 'in_transit' ? '运输中' :
    //          vehicleRecord.status === 'delivered' ? '已交付' :
    //          vehicleRecord.status}
    //       </Tag>
    //     );
    //   },
    // },
    {
      title: '车架号',
      dataIndex: 'vin',
      key: 'vin',
      width: 180,
      render: (text: string, record: TableDataItem) => {
        if ((record as ExpandRowData).isExpandRow) return { props: { colSpan: 0 } };
        return (record as VehicleData).vin;
      },
    },
    {
      title: '车规',
      dataIndex: 'specification',
      key: 'specification',
      width: 80,
      render: (text: string, record: TableDataItem) => {
        if ((record as ExpandRowData).isExpandRow) return { props: { colSpan: 0 } };
        return (record as VehicleData).specification;
      },
    },
    {
      title: '车型',
      dataIndex: 'model',
      key: 'model',
      width: 200,
      render: (text: string, record: TableDataItem) => {
        if ((record as ExpandRowData).isExpandRow) return { props: { colSpan: 0 } };
        return (record as VehicleData).model;
      },
    },
    {
      title: '外观/内饰',
      dataIndex: 'appearance',
      key: 'appearance',
      width: 150,
      render: (_, record: TableDataItem) => {
        if ((record as ExpandRowData).isExpandRow) return { props: { colSpan: 0 } };
        const vehicleRecord = record as VehicleData;
        return (
          <Space direction="vertical" size="small">
            <span>外观：{vehicleRecord.appearance}</span>
            <span>内饰：{vehicleRecord.interior}</span>
          </Space>
        );
      },
    },
    {
      title: '厂商指导价',
      dataIndex: 'msrp',
      key: 'msrp',
      width: 120,
      render: (price: number, record: TableDataItem) => {
        if ((record as ExpandRowData).isExpandRow) return { props: { colSpan: 0 } };
        return `¥${(record as VehicleData).msrp.toLocaleString()}`;
      },
    },
    {
      title: '核价金额',
      dataIndex: 'appraisedPrice',
      key: 'appraisedPrice',
      width: 120,
      render: (price: number, record: TableDataItem) => {
        if ((record as ExpandRowData).isExpandRow) return { props: { colSpan: 0 } };
        return `¥${(record as VehicleData).appraisedPrice.toLocaleString()}`;
      },
    },
    {
      title: '保证金',
      dataIndex: 'deposit',
      key: 'deposit',
      width: 120,
      render: (deposit: number, record: TableDataItem) => {
        if ((record as ExpandRowData).isExpandRow) return { props: { colSpan: 0 } };
        return `¥${(record as VehicleData).deposit.toLocaleString()}`;
      },
    },
    {
      title: '保证金比例',
      dataIndex: 'depositRate',
      key: 'depositRate',
      width: 120,
      render: (rate: number, record: TableDataItem) => {
        if ((record as ExpandRowData).isExpandRow) return { props: { colSpan: 0 } };
        return `${(record as VehicleData).depositRate}%`;
      },
    },
    {
      title: '合同单价/定金',
      key: 'contract',
      width: 150,
      render: (_, record: TableDataItem) => {
        if ((record as ExpandRowData).isExpandRow) return { props: { colSpan: 0 } };
        const vehicleRecord = record as VehicleData;
        return (
          <Space direction="vertical" size="small">
            <span>单价：¥{vehicleRecord.contractPrice.toLocaleString()}</span>
            <span>定金：¥{vehicleRecord.downPayment.toLocaleString()}</span>
          </Space>
        );
      },
    },
  ];

  const expandedRowRender = (record: TableDataItem) => {
    if (!(record as ExpandRowData).isExpandRow) return null;

    const actualVehicle = orderDetail.vehicles?.find(v => v.id === (record as ExpandRowData).vehicleId);
    if (!actualVehicle) return null;

    return <VehicleDetailExpansion vehicle={actualVehicle} />;
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {orderDetail?.vehicles?.map((vehicle: VehicleData, index: number) => (
        <Card 
          key={vehicle.id} 
          title={`车辆 ${index + 1}`}
          style={{ marginBottom: 16 }}
        >
          <Table
            columns={columns}
            dataSource={[
              vehicle,
              { id: `${vehicle.id}-expand`, isExpandRow: true, vehicleId: vehicle.id }
            ]}
            rowKey="id"
            pagination={false}
            scroll={{ x: 'max-content' }}
            expandable={{
              expandedRowRender,
              rowExpandable: (record) => (record as ExpandRowData).isExpandRow === true,
              expandedRowKeys: expandedRows,
              onExpand: (expanded, record) => {
                setExpandedRows(expanded ? [record.id] : []);
              },
            }}
          />
        </Card>
      ))}
    </Space>
  );
};

export default VehicleInfo;