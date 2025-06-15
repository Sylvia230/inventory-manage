import React, { useState } from 'react';
import { Table, Button, Form, Input, Select, Space, Row, Col, Tag, Modal, DatePicker, Radio, Upload, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface VehicleRecord {
  key: string;
  vin: string;
  vehicleType: string;
  productType: string;
  businessNo: string;
  customer: string;
  warehouse: string;
  storageAge: number;
  gpsStatus: string;
  vehicleStatus: string;
}

interface UploadModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  loading?: boolean;
}

const UploadModal: React.FC<UploadModalProps> = ({ visible, onCancel, onOk, loading }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    action: '/api/upload', // TODO: 替换为实际的上传接口
    onChange(info: any) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  const photoList = [
    { name: 'leftFront45', label: '左前45度照片' },
    { name: 'leftFrontDoor', label: '左前门含A柱的照片' },
    { name: 'leftRearDoor', label: '左后门的照片' },
    { name: 'rearWheel', label: '后轮轮毂照片' },
    { name: 'centerConsole', label: '中控台照片' },
    { name: 'dashboard', label: '仪表盘照片' },
    { name: 'rightRear45', label: '右后45度照片' },
    { name: 'rightFrontDoor', label: '右前门含A柱的照片' },
    { name: 'nameplate', label: '铭牌照片' },
    { name: 'inventoryForm', label: '商品车入库信息采集表' },
    { name: 'engineBay', label: '发动机舱' },
  ];

  return (
    <Modal
      title="上传车辆照片"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={800}
      okText="确认"
      cancelText="取消"
      confirmLoading={loading}
      bodyStyle={{ padding: '24px 24px 0' }}
    >
      <Form
        form={form}
        layout="inline"
        requiredMark={false}
      >
        <Row gutter={24} style={{ width: '100%', marginBottom: 16 }}>
          <Col span={12}>
            <Form.Item
              name="productionDate"
              label="生产日期"
              rules={[{ required: true, message: '请选择生产日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="hasCertificate"
              label="关单/合格证"
              rules={[{ required: true, message: '请选择是否有关单/合格证' }]}
            >
              <Radio.Group>
                <Radio value="yes">有</Radio>
                <Radio value="no">无</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <div className={styles.photoGrid}>
          {photoList.map((photo, index) => (
            <div key={photo.name} className={styles.photoItem}>
              <Form.Item
                name={photo.name}
                // label={photo.label}
                rules={[{ required: true, message: `请上传${photo.label}` }]}
              >
                <Upload
                  {...uploadProps}
                  listType="picture-card"
                  maxCount={1}
                  style={{width: '200px'}}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>{photo.label}</div>
                  </div>
                </Upload>
              </Form.Item>
            </div>
          ))}
        </div>
      </Form>
    </Modal>
  );
};

const VehicleListInStock: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<VehicleRecord | null>(null);

  // 车辆状态选项
  const vehicleStatusOptions = [
    { label: '在库', value: '在库' },
    { label: '出库中', value: '出库中' },
    { label: '已出库', value: '已出库' },
    { label: '维修中', value: '维修中' },
  ];

  // 产品类型选项
  const productTypeOptions = [
    { label: '新车', value: '新车' },
    { label: '二手车', value: '二手车' },
    { label: '试驾车', value: '试驾车' },
  ];

  // 表格列定义
  const columns: ColumnsType<VehicleRecord> = [
    {
      title: '车架号',
      dataIndex: 'vin',
      width: 180,
    },
    {
      title: '车辆属性',
      dataIndex: 'vehicleType',
      width: 120,
    },
    {
      title: '产品类型',
      dataIndex: 'productType',
      width: 120,
      render: (type: string) => (
        <Tag color={type === '新车' ? 'blue' : type === '二手车' ? 'green' : 'orange'}>
          {type}
        </Tag>
      ),
    },
    {
      title: '业务单号',
      dataIndex: 'businessNo',
      width: 150,
    },
    {
      title: '客户',
      dataIndex: 'customer',
      width: 120,
    },
    {
      title: '停放仓库',
      dataIndex: 'warehouse',
      width: 150,
    },
    {
      title: '车辆库龄',
      dataIndex: 'storageAge',
      width: 100,
      render: (age: number) => `${age}天`,
    },
    {
      title: 'Gps状态',
      dataIndex: 'gpsStatus',
      width: 100,
      render: (status: string) => (
        <Tag color={status === '在线' ? 'success' : 'error'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '车辆状态',
      dataIndex: 'vehicleStatus',
      width: 100,
      render: (status: string) => (
        <Tag color={
          status === '在库' ? 'success' :
          status === '出库中' ? 'warning' :
          status === '已出库' ? 'default' : 'error'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleUpload(record)}>
            上传照片
          </Button>
          <Button type="link" onClick={() => handleViewDetail(record)}>
            查看
          </Button>
        </Space>
      ),
    },
  ];

  // 模拟数据
  const [dataSource] = useState<VehicleRecord[]>([
    {
      key: '1',
      vin: 'LVGBE40K8GP123456',
      vehicleType: 'SUV',
      productType: '新车',
      businessNo: 'BUS20240301001',
      customer: '张三',
      warehouse: '上海中心仓库',
      storageAge: 15,
      gpsStatus: '在线',
      vehicleStatus: '在库',
    },
    {
      key: '2',
      vin: 'LVGBE40K8GP123457',
      vehicleType: '轿车',
      productType: '二手车',
      businessNo: 'BUS20240301002',
      customer: '李四',
      warehouse: '北京分仓',
      storageAge: 30,
      gpsStatus: '离线',
      vehicleStatus: '出库中',
    },
  ]);

  const handleSearch = (values: any) => {
    console.log('搜索条件:', values);
    // TODO: 实现搜索逻辑
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleViewDetail = (record: VehicleRecord) => {
    console.log('查看车辆详情:', record);
    // TODO: 实现查看详情逻辑
  };

  const handleUpload = (record: VehicleRecord) => {
    setCurrentRecord(record);
    setUploadModalVisible(true);
  };

  const handleUploadSubmit = (values: any) => {
    console.log('上传数据:', values);
    // TODO: 调用上传接口
    message.success('上传成功');
    setUploadModalVisible(false);
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        onFinish={handleSearch}
        layout="inline"
      >
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={8}>
            <Form.Item
              name="vin"
              label="车架号"
            >
              <Input placeholder="请输入车架号" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="businessNo"
              label="业务单号"
            >
              <Input placeholder="请输入业务单号" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="vehicleStatus"
              label="车辆状态"
            >
              <Select
                placeholder="请选择车辆状态"
                allowClear
                options={vehicleStatusOptions}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ width: '100%' }}>
          <Col span={8}>
            <Form.Item
              name="productType"
              label="产品类型"
            >
              <Select
                placeholder="请选择产品类型"
                allowClear
                options={productTypeOptions}
              />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Space>
              <Button icon={<SearchOutlined />} type="primary" htmlType="submit" loading={loading}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          total: dataSource.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        scroll={{ x: 1500 }}
      />

      <UploadModal
        visible={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        onOk={handleUploadSubmit}
        loading={loading}
      />
    </div>
  );
};

export default VehicleListInStock; 