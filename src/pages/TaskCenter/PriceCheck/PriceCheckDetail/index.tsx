import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tabs, Image, Form, Input, InputNumber, Button, message, Table, Space, Divider, Collapse, Col } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import type { ColumnsType } from 'antd/es/table';

const { TabPane } = Tabs;
const { Panel } = Collapse;

interface Photo {
  id: string;
  url: string;
  description: string;
}

interface Vehicle {
  id: string;
  vin: string;
  licensePlate: string;
  mileage: number;
  color: string;
  actualPrice?: number;
  remarks?: string;
  inspectionPhotos: Photo[];
  documentPhotos: Photo[];
}

interface VehicleModel {
  id: string;
  name: string;
  guidePrice: number;
  totalPrice?: number;
  vehicles: Vehicle[];
}

interface VehicleSeries {
  id: string;
  name: string;
  models: VehicleModel[];
}

interface Brand {
  id: string;
  name: string;
  logo?: string;
  series: VehicleSeries[];
}

interface VehicleInfo {
  id: string;
  year: number;
  status: string;
  brands: Brand[];
}

const PriceCheckDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedPhotos, setExpandedPhotos] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchVehicleInfo = async () => {
      setLoading(true);
      try {
        // Mock data for now
        const mockData: VehicleInfo = {
          id: id || '',
          year: 2020,
          status: '待核价',
          brands: [
            {
              id: 'brand1',
              name: 'Toyota 丰田',
              logo: 'https://via.placeholder.com/60x40?text=TOYOTA',
              series: [
                {
                  id: 'series1',
                  name: 'Camry 凯美瑞',
                  models: [
                    {
                      id: 'model1',
                      name: '2.5L 豪华版',
                      guidePrice: 200000,
                      vehicles: [
                        {
                          id: 'v1',
                          vin: 'LVGBE40K8GP123456',
                          licensePlate: '粤B12345',
                          mileage: 50000,
                          color: '白色',
                          inspectionPhotos: [
                            { id: 'ip1', url: 'https://via.placeholder.com/300x200?text=前脸', description: '前脸照片' },
                            { id: 'ip2', url: 'https://via.placeholder.com/300x200?text=侧面', description: '侧面照片' },
                            { id: 'ip3', url: 'https://via.placeholder.com/300x200?text=后部', description: '后部照片' },
                            { id: 'ip4', url: 'https://via.placeholder.com/300x200?text=内饰', description: '内饰照片' }
                          ],
                          documentPhotos: [
                            { id: 'dp1', url: 'https://via.placeholder.com/300x200?text=行驶证正面', description: '行驶证正面' },
                            { id: 'dp2', url: 'https://via.placeholder.com/300x200?text=行驶证背面', description: '行驶证背面' },
                            { id: 'dp3', url: 'https://via.placeholder.com/300x200?text=登记证', description: '车辆登记证' }
                          ]
                        },
                        {
                          id: 'v2',
                          vin: 'LVGBE40K8GP123457',
                          licensePlate: '粤B12346',
                          mileage: 45000,
                          color: '黑色',
                          inspectionPhotos: [
                            { id: 'ip5', url: 'https://via.placeholder.com/300x200?text=前脸', description: '前脸照片' },
                            { id: 'ip6', url: 'https://via.placeholder.com/300x200?text=侧面', description: '侧面照片' },
                            { id: 'ip7', url: 'https://via.placeholder.com/300x200?text=后部', description: '后部照片' },
                            { id: 'ip8', url: 'https://via.placeholder.com/300x200?text=内饰', description: '内饰照片' }
                          ],
                          documentPhotos: [
                            { id: 'dp4', url: 'https://via.placeholder.com/300x200?text=行驶证正面', description: '行驶证正面' },
                            { id: 'dp5', url: 'https://via.placeholder.com/300x200?text=行驶证背面', description: '行驶证背面' },
                            { id: 'dp6', url: 'https://via.placeholder.com/300x200?text=登记证', description: '车辆登记证' }
                          ]
                        }
                      ]
                    },
                    {
                      id: 'model2',
                      name: '2.5L 运动版',
                      guidePrice: 220000,
                      vehicles: [
                        {
                          id: 'v3',
                          vin: 'LVGBE40K8GP123458',
                          licensePlate: '粤B12347',
                          mileage: 30000,
                          color: '红色',
                          inspectionPhotos: [
                            { id: 'ip9', url: 'https://via.placeholder.com/300x200?text=前脸', description: '前脸照片' },
                            { id: 'ip10', url: 'https://via.placeholder.com/300x200?text=侧面', description: '侧面照片' },
                            { id: 'ip11', url: 'https://via.placeholder.com/300x200?text=后部', description: '后部照片' },
                            { id: 'ip12', url: 'https://via.placeholder.com/300x200?text=内饰', description: '内饰照片' }
                          ],
                          documentPhotos: [
                            { id: 'dp7', url: 'https://via.placeholder.com/300x200?text=行驶证正面', description: '行驶证正面' },
                            { id: 'dp8', url: 'https://via.placeholder.com/300x200?text=行驶证背面', description: '行驶证背面' },
                            { id: 'dp9', url: 'https://via.placeholder.com/300x200?text=登记证', description: '车辆登记证' }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 'series2',
                  name: 'RAV4 荣放',
                  models: [
                    {
                      id: 'model3',
                      name: '2.0L CVT豪华版',
                      guidePrice: 180000,
                      vehicles: [
                        {
                          id: 'v4',
                          vin: 'LVGBE40K8GP123459',
                          licensePlate: '粤B12348',
                          mileage: 25000,
                          color: '蓝色',
                          inspectionPhotos: [
                            { id: 'ip13', url: 'https://via.placeholder.com/300x200?text=前脸', description: '前脸照片' },
                            { id: 'ip14', url: 'https://via.placeholder.com/300x200?text=侧面', description: '侧面照片' },
                            { id: 'ip15', url: 'https://via.placeholder.com/300x200?text=后部', description: '后部照片' },
                            { id: 'ip16', url: 'https://via.placeholder.com/300x200?text=内饰', description: '内饰照片' }
                          ],
                          documentPhotos: [
                            { id: 'dp10', url: 'https://via.placeholder.com/300x200?text=行驶证正面', description: '行驶证正面' },
                            { id: 'dp11', url: 'https://via.placeholder.com/300x200?text=行驶证背面', description: '行驶证背面' },
                            { id: 'dp12', url: 'https://via.placeholder.com/300x200?text=登记证', description: '车辆登记证' }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: 'brand2',
              name: 'Honda 本田',
              logo: 'https://via.placeholder.com/60x40?text=HONDA',
              series: [
                {
                  id: 'series3',
                  name: 'Accord 雅阁',
                  models: [
                    {
                      id: 'model4',
                      name: '1.5T 豪华版',
                      guidePrice: 190000,
                      vehicles: [
                        {
                          id: 'v5',
                          vin: 'LVHFB40K8HP654321',
                          licensePlate: '粤B12349',
                          mileage: 35000,
                          color: '银色',
                          inspectionPhotos: [
                            { id: 'ip17', url: 'https://via.placeholder.com/300x200?text=前脸', description: '前脸照片' },
                            { id: 'ip18', url: 'https://via.placeholder.com/300x200?text=侧面', description: '侧面照片' },
                            { id: 'ip19', url: 'https://via.placeholder.com/300x200?text=后部', description: '后部照片' },
                            { id: 'ip20', url: 'https://via.placeholder.com/300x200?text=内饰', description: '内饰照片' }
                          ],
                          documentPhotos: [
                            { id: 'dp13', url: 'https://via.placeholder.com/300x200?text=行驶证正面', description: '行驶证正面' },
                            { id: 'dp14', url: 'https://via.placeholder.com/300x200?text=行驶证背面', description: '行驶证背面' },
                            { id: 'dp15', url: 'https://via.placeholder.com/300x200?text=登记证', description: '车辆登记证' }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 'series4',
                  name: 'CR-V',
                  models: [
                    {
                      id: 'model5',    
                      name: '1.5T 两驱都市版',
                      guidePrice: 170000,
                      vehicles: [
                        {
                          id: 'v6',
                          vin: 'LVHFB40K8HP654322',
                          licensePlate: '粤B12350',
                          mileage: 40000,
                          color: '白色',
                          inspectionPhotos: [
                            { id: 'ip21', url: 'https://via.placeholder.com/300x200?text=前脸', description: '前脸照片' },
                            { id: 'ip22', url: 'https://via.placeholder.com/300x200?text=侧面', description: '侧面照片' },
                            { id: 'ip23', url: 'https://via.placeholder.com/300x200?text=后部', description: '后部照片' },
                            { id: 'ip24', url: 'https://via.placeholder.com/300x200?text=内饰', description: '内饰照片' }
                          ],
                          documentPhotos: [
                            { id: 'dp16', url: 'https://via.placeholder.com/300x200?text=行驶证正面', description: '行驶证正面' },
                            { id: 'dp17', url: 'https://via.placeholder.com/300x200?text=行驶证背面', description: '行驶证背面' },
                            { id: 'dp18', url: 'https://via.placeholder.com/300x200?text=登记证', description: '车辆登记证' }
                          ]
                        }
                      ]
                    }
                  ]
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

  const togglePhotoExpansion = (vehicleId: string) => {
    setExpandedPhotos(prev => ({
      ...prev,
      [vehicleId]: !prev[vehicleId]
    }));
  };

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

  const handleTotalPriceChange = (brandId: string, seriesId: string, modelId: string, value: number | string | null) => {
    // if (!value || !vehicleInfo) return;
    
    const brand = vehicleInfo?.brands.find(b => b.id === brandId);
    if (!brand) return;
    
    const series = brand.series.find(s => s.id === seriesId);
    if (!series) return;
    
    const model = series.models.find(m => m.id === modelId);
    if (!model) return;

    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (numericValue && isNaN(numericValue)) return;
    console.log('numericValue', numericValue);
    const pricePerVehicle = numericValue ? Math.floor(numericValue / model.vehicles.length) : '';
    
    // 获取当前表单值
    const currentValues = form.getFieldsValue();
    // 创建新的表单值对象，确保实际价格被完全覆盖
    const newValues = {
      ...currentValues,
      brands: {
        ...currentValues.brands,
        [brandId]: {
          ...currentValues.brands?.[brandId],
          series: {
            ...currentValues.brands?.[brandId]?.series,
            [seriesId]: {
              ...currentValues.brands?.[brandId]?.series?.[seriesId],
              models: {
                ...currentValues.brands?.[brandId]?.series?.[seriesId]?.models,
                [modelId]: {
                  ...currentValues.brands?.[brandId]?.series?.[seriesId]?.models?.[modelId],
                  totalPrice: numericValue,
                  vehicles: {}
                }
              }
            }
          }
        }
      }
    };

    // 平均分配实际价格
    model.vehicles.forEach(vehicle => {
      newValues.brands[brandId].series[seriesId].models[modelId].vehicles[vehicle.id] = {
        actualPrice: pricePerVehicle,
        // 备注等其他字段可按需保留
      };
    });

    form.setFieldsValue(newValues);
  };

  // const handleTotalPriceChange = (brandId: string, seriesId: string, modelId: string, value: number | string | null) => {
  //   if (!value || !vehicleInfo) return;
    
  //   const brand = vehicleInfo.brands.find(b => b.id === brandId);
  //   if (!brand) return;
    
  //   const series = brand.series.find(s => s.id === seriesId);
  //   if (!series) return;
    
  //   const model = series.models.find(m => m.id === modelId);
  //   if (!model) return;

  //   const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  //   if (isNaN(numericValue)) return;

  //   const pricePerVehicle = Math.floor(numericValue / model.vehicles.length);
    
  //   // Update individual vehicle prices
  //   const newValues = { ...form.getFieldsValue() };
  //   if (!newValues.brands) {
  //     newValues.brands = {};
  //   }
  //   if (!newValues.brands[brandId]) {
  //     newValues.brands[brandId] = {};
  //   }
  //   if (!newValues.brands[brandId].series) {
  //     newValues.brands[brandId].series = {};
  //   }
  //   if (!newValues.brands[brandId].series[seriesId]) {
  //     newValues.brands[brandId].series[seriesId] = {};
  //   }
  //   if (!newValues.brands[brandId].series[seriesId].models) {
  //     newValues.brands[brandId].series[seriesId].models = {};
  //   }
  //   if (!newValues.brands[brandId].series[seriesId].models[modelId]) {
  //     newValues.brands[brandId].series[seriesId].models[modelId] = {};
  //   }
  //   if (!newValues.brands[brandId].series[seriesId].models[modelId].vehicles) {
  //     newValues.brands[brandId].series[seriesId].models[modelId].vehicles = {};
  //   }

  //   model.vehicles.forEach(vehicle => {
  //     newValues.brands[brandId].series[seriesId].models[modelId].vehicles[vehicle.id] = {
  //       ...newValues.brands[brandId].series[seriesId].models[modelId].vehicles[vehicle.id],
  //       actualPrice: pricePerVehicle
  //     };
  //   });

  //   form.setFieldsValue(newValues);
  // };

  const renderVehiclePhotos = (vehicle: Vehicle) => {
    const isExpanded = expandedPhotos[vehicle.id] || false;
    const inspectionCount = vehicle.inspectionPhotos.length;
    const documentCount = vehicle.documentPhotos.length;
    
    return (
      <div className={styles.vehiclePhotos}>
        <div 
          className={styles.photoToggle}
          onClick={() => togglePhotoExpansion(vehicle.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            background: '#f5f5f5',
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: isExpanded ? '12px' : '0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontWeight: 500 }}>车辆照片</span>
            <span style={{ color: '#666', fontSize: '12px' }}>
              验车照片({inspectionCount}张) | 质损照片({documentCount}张)
            </span>
          </div>
          {isExpanded ? <UpOutlined /> : <DownOutlined />}
        </div>
        
        {isExpanded && (
          <Tabs size="small">
            <TabPane tab={`验车照片 (${inspectionCount})`} key="inspection">
              <div className={styles.photoGrid}>
                {vehicle.inspectionPhotos.map(photo => (
                  <div key={photo.id} className={styles.photoItem}>
                    <Image
                      src={photo.url}
                      alt={photo.description}
                      style={{ width: '100%', height: 150, objectFit: 'cover' }}
                    />
                    <div className={styles.photoDescription}>
                      <span>{photo.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabPane>
            <TabPane tab={`质损照片 (${documentCount})`} key="document">
              <div className={styles.photoGrid}>
                {vehicle.documentPhotos.map(photo => (
                  <div key={photo.id} className={styles.photoItem}>
                    <Image
                      src={photo.url}
                      alt={photo.description}
                      style={{ width: '100%', height: 150, objectFit: 'cover' }}
                    />
                    <div className={styles.photoDescription}>
                      <span>{photo.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabPane>
          </Tabs>
        )}
      </div>
    );
  };

  // const renderVehicleCard = (vehicle: Vehicle, brandId: string, seriesId: string, modelId: string) => (
  //   <div 
  //     key={vehicle.id} 
  //     // size="small" 
  //     title={`${vehicle.licensePlate} (${vehicle.vin})`}
  //     className={styles.vehicleCard}
  //   >
  //     <div className={styles.vehicleInfo}>
  //       <Descriptions size="small" column={2}>
  //         <Descriptions.Item label="车架号">{vehicle.vin}</Descriptions.Item>
  //         <Descriptions.Item label="车牌号">{vehicle.licensePlate}</Descriptions.Item>
  //         <Descriptions.Item label="里程数">{vehicle.mileage.toLocaleString()}公里</Descriptions.Item>
  //         <Descriptions.Item label="颜色">{vehicle.color}</Descriptions.Item>
  //       </Descriptions>
        
  //       <div className={styles.priceInput}>
  //         <Form.Item
  //           name={['brands', brandId, 'series', seriesId, 'models', modelId, 'vehicles', vehicle.id, 'actualPrice']}
  //           label="实际价格"
  //           rules={[{ required: true, message: '请输入实际价格' }]}
  //         >
  //           <InputNumber
  //             style={{ width: '200px' }}
  //             formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
  //             parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
  //             placeholder="请输入实际价格"
  //           />
  //         </Form.Item>
          
  //         <Form.Item
  //           name={['brands', brandId, 'series', seriesId, 'models', modelId, 'vehicles', vehicle.id, 'remarks']}
  //           label="备注"
  //         >
  //           <Input.TextArea 
  //             placeholder="请输入备注" 
  //             rows={2}
  //             style={{ width: '300px' }}
  //           />
  //         </Form.Item>
  //       </div>
  //     </div>
      
  //     {renderVehiclePhotos(vehicle)}
  //   </div>
  // );

  const renderVehicleCard = (vehicle: Vehicle, brandId: string, seriesId: string, modelId: string) => {
    // 表格列定义
    const columns: ColumnsType<Vehicle> = [
      {
        title: '车架号',
        dataIndex: 'vin',
        key: 'vin',
        width: 180,
        render: (text: string) => <span style={{ fontFamily: 'monospace' }}>{text}</span>
      },
      {
        title: '指导价',
        key: 'guidePrice',
        width: 120,
        render: () => {
          const model = vehicleInfo?.brands
            .find(b => b.id === brandId)
            ?.series.find(s => s.id === seriesId)
            ?.models.find(m => m.id === modelId);
          return model ? `¥${model.guidePrice.toLocaleString()}` : '-';
        }
      },
      {
        title: '预授信',
        key: 'preCredit',
        width: 120,
        render: () => {
          const model = vehicleInfo?.brands
            .find(b => b.id === brandId)
            ?.series.find(s => s.id === seriesId)
            ?.models.find(m => m.id === modelId);
          return model ? `¥${Math.floor(model.guidePrice * 0.8).toLocaleString()}` : '-';
        }
      },
      {
        title: '里程数',
        dataIndex: 'mileage',
        key: 'mileage',
        width: 100,
        render: (mileage: number) => `${mileage.toLocaleString()}公里`
      },
      {
        title: '颜色',
        dataIndex: 'color',
        key: 'color',
        width: 80
      },
      {
        title: '实际价格',
        key: 'actualPrice',
        width: 200,
        render: () => (
          <Form.Item
            name={['brands', brandId, 'series', seriesId, 'models', modelId, 'vehicles', vehicle.id, 'actualPrice']}
            rules={[{ required: true, message: '请输入实际价格' }]}
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
              placeholder="请输入实际价格"
            />
          </Form.Item>
        )
      },
      {
        title: '备注',
        key: 'remarks',
        width: 200,
        render: () => (
          <Form.Item
            name={['brands', brandId, 'series', seriesId, 'models', modelId, 'vehicles', vehicle.id, 'remarks']}
            style={{ marginBottom: 0 }}
          >
            <Input.TextArea 
              placeholder="请输入备注" 
              rows={1}
              style={{ width: '100%' }}
            />
          </Form.Item>
        )
      }
    ];

    return (
      <div key={vehicle.id} className={styles.vehicleCard}>
        <Table
          columns={columns}
          dataSource={[vehicle]}
          pagination={false}
          size="small"
          bordered
          rowKey="id"
          style={{ marginBottom: 16 }}
        />
        
        {renderVehiclePhotos(vehicle)}
      </div>
    );
  };
  const renderModelSection = (model: VehicleModel, brandId: string, seriesId: string) => (
    <div key={model.id} className={styles.modelSection}>
      <div className={styles.modelHeader}>
        <h4>{model.name}</h4>
        <div className={styles.modelPrice}>
          <Form.Item
            name={['brands', brandId, 'series', seriesId, 'models', model.id, 'totalPrice']}
            label="总核价"
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              style={{ width: 200 }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
              onChange={(value) => handleTotalPriceChange(brandId, seriesId, model.id, value)}
              placeholder="请输入总核价"
            />
          </Form.Item>
          {/* <span style={{ marginLeft: 16, color: '#666' }}>
            指导价: ¥{model.guidePrice.toLocaleString()}
          </span> */}
        </div>
      </div>
      
      <div className={styles.vehiclesList}>
        {model.vehicles.map(vehicle => renderVehicleCard(vehicle, brandId, seriesId, model.id))}
      </div>
    </div>
  );

  const renderSeriesSection = (series: VehicleSeries, brandId: string) => (
    <Card key={series.id} className={styles.seriesCard}>
      {/* <div className={styles.seriesHeader}>
        <h3>{series.name}</h3>
      </div> */}
      
      {series.models.map((model, index) => (
        <React.Fragment key={model.id}>
          {/* {index > 0 && <Divider />} */}
          {renderModelSection(model, brandId, series.id)}
        </React.Fragment>
      ))}
    </Card>
  );

  const renderBrandSection = (brand: Brand) => (
    <div key={brand.id} className={styles.brandCard}>
      {/* <div className={styles.brandHeader}>
        <div className={styles.brandInfo}>
          {brand.logo && (
            <img src={brand.logo} alt={brand.name} className={styles.brandLogo} />
          )}
          <h2>{brand.name}</h2>
        </div>
      </div> */}
      
      {brand.series.map((series, index) => (
        <React.Fragment key={series.id}>
          {/* {index > 0 && <Divider style={{ margin: '24px 0' }} />} */}
          {renderSeriesSection(series, brand.id)}
        </React.Fragment>
      ))}
    </div>
  );

  // Generate initial form values
  const getInitialValues = () => {
    if (!vehicleInfo) return { orderId: id };

    const initialValues: any = {
      orderId: id,
      brands: {}
    };

    vehicleInfo.brands.forEach(brand => {
      initialValues.brands[brand.id] = {
        series: {}
      };

      brand.series.forEach(series => {
        initialValues.brands[brand.id].series[series.id] = {
          models: {}
        };

        series.models.forEach(model => {
          initialValues.brands[brand.id].series[series.id].models[model.id] = {
            totalPrice: model.guidePrice * model.vehicles.length,
            vehicles: {}
          };

          model.vehicles.forEach(vehicle => {
            initialValues.brands[brand.id].series[series.id].models[model.id].vehicles[vehicle.id] = {
              actualPrice: Math.floor(model.guidePrice * 0.9),
              remarks: ''
            };
          });
        });
      });
    });

    return initialValues;
  };

  return (
    <div className={styles.priceCheckDetail}>
      <Card>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSubmit}
          initialValues={getInitialValues()}
        >
          <Form.Item name="orderId" label="订单编号" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>

          <Col span={24}>
            <Card title="基本信息" loading={loading} size="small" style={{ marginBottom: 24 }}>
                {vehicleInfo && (
                  <Descriptions bordered size="small">
                    <Descriptions.Item label="品牌">{vehicleInfo.year}</Descriptions.Item>
                    <Descriptions.Item label="车系">{vehicleInfo.status}</Descriptions.Item>
                    <Descriptions.Item label="车型">{vehicleInfo.brands.length}个品牌</Descriptions.Item>
                  </Descriptions>
                )}
              </Card>
          </Col>
         

          {vehicleInfo?.brands.map((brand, index) => (
            <React.Fragment key={brand.id}>
              {/* {index > 0 && <Divider style={{ margin: '48px 0' }} />} */}
              {renderBrandSection(brand)}
            </React.Fragment>
          ))}

          <Form.Item style={{ marginTop: 32, textAlign: 'center' }}>
            <Space size="large">
              <Button onClick={() => navigate(-1)}>
                返回
              </Button>
              <Button type="primary" htmlType="submit" size="large">
                提交核价
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PriceCheckDetail;
