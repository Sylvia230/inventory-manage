import React, { useState,useEffect } from 'react';
import { Table, Button, Form, Input, Select, Space, Row, Col, Tag, Modal, message, Descriptions, Tabs, Empty, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { SearchOutlined, ReloadOutlined, EyeOutlined, GlobalOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import dayjs from 'dayjs';
import VehiclePhotoUpload from '@/components/VehiclePhotoUpload';
import { getGpsListApi,bindGPSApi, getInStockVehicleListApi, getInStockVehicleDetailApi } from '@/services/wareHouse';

const { Option } = Select;

interface VehicleRecord {
  id?: string;
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
  // 新增字段
  hasCertificate?: boolean;
  contactPerson?: string;
  contactPhone?: string;
  gpsDeviceNo?: string;
  gpsInstallLocation?: string;
  gpsBindTime?: string;
  gpsBindPerson?: string;
  gpsDeviceSource?: string;
  storageType?: string;
  systemStorageTime?: string;
  actualStorageTime?: string;
  storageAdmin?: string;

  // 验车信息字段
  inspectionTime?: string;
  inspector?: string;
  mileage?: number;
  productionDate?: string;
  inspectionPhotos?: {
    name: string;
    label: string;
    url: string;
  }[];
  damagePhotos?: string[];
}

interface UploadModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  loading?: boolean;
}

const UploadModal: React.FC<UploadModalProps> = ({ visible, onCancel, onOk, loading }) => {
  const [photoData, setPhotoData] = useState<Record<string, UploadFile[]>>({});
  const [formData, setFormData] = useState<any>({});
  
  const handleSubmit = async () => {
    try {
      // 合并照片数据和表单数据
      const values = {
        ...formData,
        photos: photoData
      };
      onOk(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    setPhotoData({});
    setFormData({});
    onCancel();
  };

  const handlePhotoChange = (value: Record<string, UploadFile[]>) => {
    setPhotoData(value);
  };

  const handleFormChange = (formValues: any) => {
    setFormData(formValues);
  };

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
      <VehiclePhotoUpload
        value={photoData}
        onChange={handlePhotoChange}
        showForm={true}
        onFormChange={handleFormChange}
        maxSize={10}
      />
    </Modal>
  );
};

// 添加GPS绑定弹窗组件
interface BindGPSModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (reason: string) => void;
  loading?: boolean;
}

const BindGPSModal: React.FC<BindGPSModalProps> = ({ visible, onCancel, onOk, loading }) => {
  const [form] = Form.useForm();
  const [gpsList, setGpsList] = useState<any[]>([]);
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onOk(values.gpsDeviceId);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    getGpsList();
  }, []);

  // 获取GPS
  const getGpsList = async () => {
    const res:any = await getGpsListApi({});
    console.log(res, 'getGpsList');
    setGpsList(res?.result || []);
  };

  return (
    <Modal
      title="绑定GPS"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={600}
      okText="确认"
      cancelText="取消"
      confirmLoading={loading}
    >
      <Form form={form} layout="inline">
        <Form.Item
            name="gpsDeviceId"
            label="选择GPS"
            rules={[{ required: true, message: '请选择GPS' }]}
            style={{ width: '100%' }}
          >
            <Select placeholder="请选择GPS">
              {gpsList.map(gps => (
                <Option key={gps.id} value={gps.id}>
                  {gps.simNo}
                </Option>
              ))}
            </Select>
          </Form.Item>
      </Form>
    </Modal>
  );
};

// 添加车辆详情弹窗组件
interface VehicleDetailModalProps {
  visible: boolean;
  onCancel: () => void;
  data: VehicleRecord | null;
  loading?: boolean;
}

// 照片类型配置
const PHOTO_LIST = [
  { name: 'leftFront45', label: '左前45度照片', value: '1' },    
  { name: 'leftFrontDoor', label: '左前门含A柱的照片', value: '2' },
  { name: 'leftRearDoor', label: '左后门的照片', value: '3' },
  { name: 'rearWheel', label: '后轮轮毂照片', value: '4' },
  { name: 'centerConsole', label: '中控台照片', value: '5' },
  { name: 'dashboard', label: '仪表盘照片', value: '6' },
  { name: 'rightRear45', label: '右后45度照片', value: '7' },
  { name: 'rightFrontDoor', label: '右前门含A柱的照片', value: '8' },
  { name: 'nameplate', label: '铭牌照片', value: '9' },
  { name: 'inventoryForm', label: '商品车入库信息采集表', value: '10' },
  { name: 'engineBay', label: '发动机舱', value: '11' },
];

const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ visible, onCancel, data, loading }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  if (!data) return null;

  // 处理照片预览
  const handlePreview = (url: string, title: string = '照片预览') => {
    setPreviewImage(url);
    setPreviewTitle(title);
    setPreviewVisible(true);
  };

  // 常规照片Tab内容
  const renderRegularPhotos = () => (
    <div className={styles.photoGrid}>
      {PHOTO_LIST.map((photo) => {
        const photoData = data.inspectionPhotos?.find(p => p.name === photo.name);
        return (
          <div key={photo.name} className={styles.photoItem}>
            <div className={styles.photoLabel}>{photo.label}</div>
            {photoData ? (
              <div className={styles.photoWrapper} onClick={() => handlePreview(photoData.url, photo.label)}>
                <img src={photoData.url} alt={photo.label} />
                <div className={styles.photoOverlay}>
                  <EyeOutlined />
                </div>
              </div>
            ) : (
              <div className={styles.photoEmpty}>暂无照片</div>
            )}
          </div>
        );
      })}
    </div>
  );

  // 质损照片Tab内容
  const renderDamagePhotos = () => (
    <div className={styles.photoGrid}>
      {data.damagePhotos?.map((url, index) => (
        <div key={index} className={styles.photoItem}>
          <div className={styles.photoLabel}>质损照片 {index + 1}</div>
          <div className={styles.photoWrapper} onClick={() => handlePreview(url, `质损照片 ${index + 1}`)}>
            <img src={url} alt={`质损照片 ${index + 1}`} />
            <div className={styles.photoOverlay}>
              <EyeOutlined />
            </div>
          </div>
        </div>
      )) || (
        <Empty description="暂无质损照片" />
      )}
    </div>
  );

  const tabItems = [
    {
      key: 'regular',
      label: '常规照片',
      children: renderRegularPhotos(),
    },
    {
      key: 'damage',
      label: (
        <span>
          质损照片
          {data.damagePhotos?.length ? (
            <Tag color="red" style={{ marginLeft: 8 }}>
              {data.damagePhotos.length}
            </Tag>
          ) : null}
        </span>
      ),
      children: renderDamagePhotos(),
    },
  ];

  return (
    <Modal
      title="车辆详情"
      open={visible}
      onCancel={onCancel}
      width={1000}
      confirmLoading={loading}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>
      ]}
    >
      <div className={styles.detailContent}>
        {/* 车辆信息 */}
        <Descriptions
          title={<div className={styles.sectionTitle}>车辆信息</div>}
          bordered
          column={2}
          size="small"
          className={styles.descriptionSection}
        >
          <Descriptions.Item label="车架号">{data.vin}</Descriptions.Item>
          <Descriptions.Item label="车辆属性">{data.vehicleType}</Descriptions.Item>
          <Descriptions.Item label="车辆库龄">{data.storageAge}天</Descriptions.Item>
          <Descriptions.Item label="关单/合格证">
            {data.hasCertificate ? '有' : '无'}
          </Descriptions.Item>
        </Descriptions>

        {/* 基本信息 */}
        <Descriptions
          title={<div className={styles.sectionTitle}>基本信息</div>}
          bordered
          column={2}
          size="small"
          className={styles.descriptionSection}
        >
          <Descriptions.Item label="业务类型">{data.productType}</Descriptions.Item>
          <Descriptions.Item label="客户">{data.customer}</Descriptions.Item>
          <Descriptions.Item label="联系人">{data.contactPerson || '-'}</Descriptions.Item>
          <Descriptions.Item label="联系方式">{data.contactPhone || '-'}</Descriptions.Item>
          <Descriptions.Item label="停放仓库" span={2}>{data.warehouse}</Descriptions.Item>
        </Descriptions>

        {/* GPS信息 */}
        <Descriptions
          title={<div className={styles.sectionTitle}>在库监管GPS信息</div>}
          bordered
          column={2}
          size="small"
          className={styles.descriptionSection}
        >
          <Descriptions.Item label="绑定状态">
            <Tag color={data.gpsStatus === '在线' ? 'success' : data.gpsStatus === '未绑定' ? 'warning' : 'error'}>
              {data.gpsStatus}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="当前设备号">{data.gpsDeviceNo || '-'}</Descriptions.Item>
          <Descriptions.Item label="安装位置">{data.gpsInstallLocation || '-'}</Descriptions.Item>
          <Descriptions.Item label="绑定时间">{data.gpsBindTime || '-'}</Descriptions.Item>
          <Descriptions.Item label="绑定人">{data.gpsBindPerson || '-'}</Descriptions.Item>
          <Descriptions.Item label="设备来源">{data.gpsDeviceSource || '-'}</Descriptions.Item>
        </Descriptions>

        {/* 入库信息 */}
        <Descriptions
          title={<div className={styles.sectionTitle}>入库信息</div>}
          bordered
          column={2}
          size="small"
          className={styles.descriptionSection}
        >
          <Descriptions.Item label="入库类型">{data.storageType || '-'}</Descriptions.Item>
          <Descriptions.Item label="系统入库时间">{data.systemStorageTime || '-'}</Descriptions.Item>
          <Descriptions.Item label="实际入库时间">{data.actualStorageTime || '-'}</Descriptions.Item>
          <Descriptions.Item label="入库管理员">{data.storageAdmin || '-'}</Descriptions.Item>
        </Descriptions>

        {/* 验车信息 */}
        <Descriptions
          title={<div className={styles.sectionTitle}>验车信息</div>}
          bordered
          column={2}
          size="small"
          className={styles.descriptionSection}
        >
          <Descriptions.Item label="验车时间">{data.inspectionTime || '-'}</Descriptions.Item>
          <Descriptions.Item label="验车人">{data.inspector || '-'}</Descriptions.Item>
          <Descriptions.Item label="里程数">{data.mileage ? `${data.mileage}公里` : '-'}</Descriptions.Item>
          <Descriptions.Item label="生产日期">{data.productionDate || '-'}</Descriptions.Item>
          <Descriptions.Item label="合格证/关单">{data.hasCertificate ? '有' : '无'}</Descriptions.Item>
        </Descriptions>

        {/* 照片展示区域改为Tab形式 */}
        <div className={styles.photoSection}>
          <div className={styles.sectionTitle}>车辆照片</div>
          <Tabs
            items={tabItems}
            className={styles.photoTabs}
          />
        </div>
      </div>

      {/* 照片预览模态框 */}
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        <Image
          alt={previewTitle}
          style={{ width: '100%' }}
          src={previewImage}
        />
      </Modal>
    </Modal>
  );
};

const VehicleListInStock: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [bindGPSModalVisible, setBindGPSModalVisible] = useState(false);
  const [currentBindRecord, setCurrentBindRecord] = useState<any>(null);
  const [bindLoading, setBindLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState<VehicleRecord[]>([]);

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
      dataIndex: 'vehicleName',
      width: 180,
    },
    // {
    //   title: '产品类型',
    //   dataIndex: 'productType',
    //   width: 120,
    //   render: (type: string) => (
    //     <Tag color={type === '新车' ? 'blue' : type === '二手车' ? 'green' : 'orange'}>
    //       {type}
    //     </Tag>
    //   ),
    // },
    {
      title: '业务单号',
      dataIndex: 'orderNo',
      width: 150,
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      width: 120,
    },
    {
      title: '停放仓库',
      dataIndex: 'warehouse',
      width: 150,
    },
    // {
    //   title: '车辆库龄',
    //   dataIndex: 'storageAge',
    //   width: 100,
    //   render: (age: number) => `${age}天`,
    // },
    {
      title: 'GPS状态',
      dataIndex: 'gpsStatusDesc',
      width: 100,
    },
    {
      title: '车辆状态',
      dataIndex: 'statusDesc',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <span>
            <Button 
              type="link" 
              icon={<GlobalOutlined />}
              onClick={() => handleBindGPS(record)}
            >
              绑定GPS
            </Button>
          {/* <Button type="link" onClick={() => handleUpload(record)}>
            上传照片
          </Button> */}
          <Button type="link" onClick={() => handleViewDetail(record)}>
            查看
          </Button>
        </span>
      ),
    },
  ];

  // // 模拟数据
  // const [dataSource] = useState<VehicleRecord[]>([
  //   {
  //     key: '1',
  //     vin: 'LVGBE40K8GP123456',
  //     vehicleType: 'SUV',
  //     productType: '新车',
  //     businessNo: 'BUS20240301001',
  //     customer: '张三',
  //     warehouse: '上海中心仓库',
  //     storageAge: 15,
  //     gpsStatus: '在线',
  //     vehicleStatus: '在库',
  //   },
  //   {
  //     key: '2',
  //     vin: 'LVGBE40K8GP123457',
  //     vehicleType: '轿车',
  //     productType: '二手车',
  //     businessNo: 'BUS20240301002',
  //     customer: '李四',
  //     warehouse: '北京分仓',
  //     storageAge: 30,
  //     gpsStatus: '未绑定',
  //     vehicleStatus: '出库中',
  //   },
  // ]);

  const fetchData = async (page = currentPage, size = pageSize) => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize: size,
      };
  
      const res = await getInStockVehicleListApi(params);
      console.log('在库车辆列表', res);
  
        setDataSource(res.result || []);
        setTotal(res.totalCount || 0);
    } catch (error) {
      console.error('获取商家列表失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, 10);
  }, []);

  const handleSearch = (values: any) => {
    console.log('搜索条件:', values);
    fetchData(1, 10);
    // TODO: 实现搜索逻辑
  };

  const handleReset = () => {
    form.resetFields();
  };

  // 处理查看详情
  const handleViewDetail = async (record: VehicleRecord) => {
    try {
      setLoading(true);
      
      // 调用获取详情接口
      const res = await getInStockVehicleDetailApi({ id: record.id });
      console.log('车辆详情', res);
      
      if (res?.result) {
        // 合并详情数据到记录中
        const detailData = {
          ...record,
          ...res.result,
          // 确保照片数据正确
          inspectionPhotos: res.result.inspectionPhotos || [],
          damagePhotos: res.result.damagePhotos || [],
        };
        
        setCurrentRecord(detailData);
        setDetailModalVisible(true);
      } else {
        message.error('获取车辆详情失败');
      }
    } catch (error) {
      console.error('获取车辆详情失败:', error);
      message.error('获取车辆详情失败');
    } finally {
      setLoading(false);
    }
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

  // 处理绑定GPS
  const handleBindGPS = (record: VehicleRecord) => {
    setCurrentBindRecord(record);
    setBindGPSModalVisible(true);
  };

  // 处理绑定GPS提交
  const handleBindGPSSubmit = async (gpsDeviceId: any) => {
    if (!currentBindRecord) return;
    
    setBindLoading(true);
    try {
      // TODO: 调用绑定GPS的API
      await bindGPSApi({
        wmsCarId: currentBindRecord.id,
        gpsDeviceId
      });
      
      message.success('GPS绑定成功');
      setBindGPSModalVisible(false);
      // 刷新列表数据
      fetchData(1, 10);
    } catch (error) {
      message.error('GPS绑定失败');
      console.error('绑定GPS失败:', error);
    } finally {
      setBindLoading(false);
    }
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

      <BindGPSModal
        visible={bindGPSModalVisible}
        onCancel={() => setBindGPSModalVisible(false)}
        onOk={handleBindGPSSubmit}
        loading={bindLoading}
      />

      <VehicleDetailModal
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        data={currentRecord}
        loading={loading}
      />
    </div>
  );
};

export default VehicleListInStock; 