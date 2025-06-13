import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tabs, Image, Form, Input, InputNumber, Button, message, Table, Space, Divider } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import type { ColumnsType } from 'antd/es/table';

const { TabPane } = Tabs;

interface Vehicle {
  id: string;
  vin: string;
  licensePlate: string;
  mileage: number;
  color: string;
  actualPrice?: number;
  remarks?: string;
}

interface VehicleModel {
  id: string;
  name: string;
  guidePrice: number;
  totalPrice?: number;
  vehicles: Vehicle[];
}

interface VehicleInfo {
  id: string;
  brand: string;
  series: string;
  year: number;
  status: string;
  models: VehicleModel[];
}

const PriceCheckDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchVehicleInfo = async () => {
      setLoading(true);
      try {
        // Mock data for now
        const mockData: VehicleInfo = {
          id: id || '',
          brand: 'Toyota',
          series: 'Camry',
          year: 2020,
          status: '待核价',
          models: [
            {
              id: '1',
              name: '2.5L 豪华版',
              guidePrice: 200000,
              vehicles: [
                {
                  id: 'v1',
                  vin: 'LVGBE40K8GP123456',
                  licensePlate: '粤B12345',
                  mileage: 50000,
                  color: '白色'
                },
                {
                  id: 'v2',
                  vin: 'LVGBE40K8GP123457',
                  licensePlate: '粤B12346',
                  mileage: 45000,
                  color: '黑色'
                }
              ]
            },
            {
              id: '2',
              name: '2.5L 运动版',
              guidePrice: 220000,
              vehicles: [
                {
                  id: 'v3',
                  vin: 'LVGBE40K8GP123458',
                  licensePlate: '粤B12347',
                  mileage: 30000,
                  color: '红色'
                }
              ]
            }
          ]
        };
        setVehicleInfo(mockData);
      } catch (error) {
        message.error('获取车辆信息失败');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicleInfo();
    }
  }, [id]);

  const handleSubmit = async (values: any) => {
    try {
      // TODO: Replace with actual API call
      console.log('提交核价结果:', values);
      message.success('核价结果提交成功');
      navigate('/task-center/price-check');
    } catch (error) {
      message.error('提交失败，请重试');
    }
  };

  const handleTotalPriceChange = (modelId: string, value: number | string | null) => {
    if (!value || !vehicleInfo) return;
    
    const model = vehicleInfo.models.find(m => m.id === modelId);
    if (!model) return;

    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numericValue)) return;

    const pricePerVehicle = Math.floor(numericValue / model.vehicles.length);
    
    // Update individual vehicle prices
    const newValues = { ...form.getFieldsValue() };
    if (!newValues.models) {
      newValues.models = {};
    }
    if (!newValues.models[modelId]) {
      newValues.models[modelId] = {};
    }
    if (!newValues.models[modelId].vehicles) {
      newValues.models[modelId].vehicles = {};
    }

    model.vehicles.forEach(vehicle => {
      newValues.models[modelId].vehicles[vehicle.id] = {
        ...newValues.models[modelId].vehicles[vehicle.id],
        actualPrice: pricePerVehicle
      };
    });

    form.setFieldsValue(newValues);
  };
    // Mock photo data
    const inspectionPhotos = [
        { id: 1, url: 'https://example.com/photo1.jpg', description: '前脸照片' },
        { id: 2, url: 'https://example.com/photo2.jpg', description: '侧面照片' },
        { id: 3, url: 'https://example.com/photo3.jpg', description: '后部照片' },
        { id: 4, url: 'https://example.com/photo4.jpg', description: '内饰照片' }
      ];
    
      const documentPhotos = [
        { id: 1, url: 'https://example.com/doc1.jpg', description: '行驶证正面' },
        { id: 2, url: 'https://example.com/doc2.jpg', description: '行驶证背面' },
        { id: 3, url: 'https://example.com/doc3.jpg', description: '车辆登记证' }
      ];    

  const renderModelSection = (model: VehicleModel) => {
    const columns: ColumnsType<Vehicle> = [
      {
        title: '车架号',
        dataIndex: 'vin',
        key: 'vin',
      },
      {
        title: '车牌号',
        dataIndex: 'licensePlate',
        key: 'licensePlate',
      },
      {
        title: '里程数',
        dataIndex: 'mileage',
        key: 'mileage',
        render: (mileage: number) => `${mileage.toLocaleString()}公里`,
      },
      {
        title: '颜色',
        dataIndex: 'color',
        key: 'color',
      },
      {
        title: '实际价格',
        dataIndex: 'actualPrice',
        key: 'actualPrice',
        render: (_, record) => (
          <Form.Item
            name={['models', model.id, 'vehicles', record.id, 'actualPrice']}
            rules={[{ required: true, message: '请输入实际价格' }]}
            noStyle
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
            />
          </Form.Item>
        ),
      },
      // {
      //   title: '备注',
      //   dataIndex: 'remarks',
      //   key: 'remarks',
      //   render: (_, record) => (
      //     <Form.Item
      //       name={['models', model.id, 'vehicles', record.id, 'remarks']}
      //       noStyle
      //     >
      //       <Input placeholder="请输入备注" />
      //     </Form.Item>
      //   ),
      // },
    ];

    return (
      <div key={model.id} className={styles.modelSection}>
        <div className={styles.modelHeader}>
          <h3>{model.name}</h3>
          <div className={styles.modelPrice}>
            <Form.Item
              name={['models', model.id, 'totalPrice']}
              label="总核价"
              style={{ marginLeft: 24, marginBottom: 0 }}
            >
              <InputNumber
                style={{ width: 200 }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
                onChange={(value) => handleTotalPriceChange(model.id, value)}
              />
            </Form.Item>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={model.vehicles}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </div>
    );
  };

  return (
    <div className={styles.priceCheckDetail}>
      <Card style={{ marginTop: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            orderId: id,
            models: vehicleInfo?.models.reduce((acc, model) => ({
              ...acc,
              [model.id]: {
                totalPrice: model.guidePrice * model.vehicles.length,
                vehicles: model.vehicles.reduce((vehicleAcc, vehicle) => ({
                  ...vehicleAcc,
                  [vehicle.id]: {
                    actualPrice: Math.floor(model.guidePrice * 0.9),
                    remarks: ''
                  }
                }), {})
              }
            }), {})
          }}
        >
          <Form.Item name="orderId" label="订单编号" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>

          {vehicleInfo?.models.map((model, index) => (
            <React.Fragment key={model.id}>
              {index > 0 && <Divider />}
              {renderModelSection(model)}
            </React.Fragment>
          ))}

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit">
              提交核价结果
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="基本信息" loading={loading}>
        {vehicleInfo && (
          <Descriptions bordered>
            <Descriptions.Item label="品牌">{vehicleInfo.brand}</Descriptions.Item>
            <Descriptions.Item label="车系">{vehicleInfo.series}</Descriptions.Item>
            <Descriptions.Item label="年份">{vehicleInfo.year}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>
        <Card style={{ marginTop: 24 }}>
          <Tabs defaultActiveKey="1">
          <TabPane tab="验车照片" key="1">
            <div className={styles.photoGrid}>
              {inspectionPhotos.map(photo => (
                <div key={photo.id} className={styles.photoItem}>
                  <Image
                    src={photo.url}
                    alt={photo.description}
                    style={{ width: '100%', height: 200, objectFit: 'cover' }}
                  />
                  <div className={styles.photoDescription}>
                    <h4>{photo.description}</h4>
                  </div>
                </div>
              ))}
            </div>
          </TabPane>
          <TabPane tab="证件照片" key="2">
            <div className={styles.photoGrid}>
              {documentPhotos.map(photo => (
                <div key={photo.id} className={styles.photoItem}>
                  <Image
                    src={photo.url}
                    alt={photo.description}
                    style={{ width: '100%', height: 200, objectFit: 'cover' }}
                  />
                  <div className={styles.photoDescription}>
                    <h4>{photo.description}</h4>
                  </div>
                </div>
              ))}
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default PriceCheckDetail;
