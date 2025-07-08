import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tabs, Image, Form, Input, InputNumber, Button, message, Space, Row, Col, Tag, Table } from 'antd';
import { DownOutlined, UpOutlined, EyeOutlined } from '@ant-design/icons';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { HandlePriceCheckApi } from '@/services/taskCenter';
import styles from './index.module.less';
import { GetPriceCheckVehicleApi } from '@/services/taskCenter';

const PriceCheckDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [vehicleInfo, setVehicleInfo] = useState<any>([]);
  const [expandedPhotos, setExpandedPhotos] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const fetchVehicleInfo = async () => {
      try {
        // 使用useSearchParams获取type参数，默认为1
        const typeParam = searchParams.get('type');
        const apiType = typeParam ? parseInt(typeParam) : 1;
        
        console.log('URL查询参数 - type:', typeParam, 'apiType:', apiType);
        
        let res = await GetPriceCheckVehicleApi({ 
          taskId: id,
          type: apiType,
        });
        setVehicleInfo(res);
      } catch (error) {
        message.error('获取车辆信息失败');
      }
    };

    if (id) {
      fetchVehicleInfo();
    }
  }, [id, searchParams]);

  const togglePhotoExpansion = (vehicleId: string) => {
    setExpandedPhotos(prev => ({
      ...prev,
      [vehicleId]: !prev[vehicleId]
    }));
  };

  const handleTotalPriceChange = (modelId: string, value: number | string | null) => {
    // if (!value || !vehicleInfo) return;
    
    const model = vehicleInfo.find((m: any) => m.id === modelId);
    if (!model) return;

    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (numericValue && isNaN(numericValue)) return;
    
    const vehicleCount = model.pricingTaskCarInfoList?.length || 0;
    const pricePerVehicle = vehicleCount > 0 ? numericValue ? Math.floor(numericValue / vehicleCount) : null : null;
    
    const currentValues = form.getFieldsValue();
    const newValues = {
      ...currentValues,
      models: {
        ...currentValues.models,
        [modelId]: {
          totalPrice: numericValue,
        }
      },
      vehicles: {
        ...currentValues.vehicles,
        [modelId]: {}
      }
    };

    model.pricingTaskCarInfoList?.forEach((vehicle: any) => {
      newValues.vehicles[modelId][vehicle.id] = {
        actualPrice: pricePerVehicle,
        remarks: currentValues.vehicles?.[modelId]?.[vehicle.id]?.remarks || ''
      };
    });

    form.setFieldsValue(newValues);
  };

  // 处理核价结果提交
  const handleSubmitPricing = async () => {
    try {
      // 验证表单
      const values = await form.validateFields();
      
      // 构建pricingCarResultDTOList数组
      const pricingCarResultDTOList: any[] = [];
      
      vehicleInfo.forEach((model: any) => {
        model.pricingTaskCarInfoList?.forEach((vehicle: any) => {
          const actualPrice = values.vehicles?.[model.id]?.[vehicle.id]?.actualPrice;
          const remarks = values.vehicles?.[model.id]?.[vehicle.id]?.remarks;
          
          if (actualPrice) {
            pricingCarResultDTOList.push({
              carId: vehicle.id,
              pricingLoanAmount: actualPrice,
            //   remarks: remarks || ''
            });
          }
        });
      });
      
      // 检查是否有车辆没有填写出款金额
      if (pricingCarResultDTOList.length === 0) {
        message.error('请至少为一辆车填写出款金额');
        return;
      }
      
      // 检查是否所有车辆都填写了出款金额
      const totalVehicles = vehicleInfo.reduce((sum: number, model: any) => 
        sum + (model.pricingTaskCarInfoList?.length || 0), 0
      );
      
      if (pricingCarResultDTOList.length < totalVehicles) {
        message.warning(`还有 ${totalVehicles - pricingCarResultDTOList.length} 辆车未填写出款金额`);
      }
      
      // 调用API
      message.loading('正在提交核价结果...', 0);
      
      const requestData = {
        taskId: id, // 使用路由参数中的id作为taskId
        pricingCarResultDTOList
      };
      
      console.log('提交核价数据:', requestData);
      
      await HandlePriceCheckApi(requestData);
      
      message.destroy();
      message.success('核价结果提交成功');
      
      // 返回列表页面
      navigate('/taskCenter/priceCheck');
      
    } catch (error: any) {
      message.destroy();
      
      if (error?.errorFields) {
        message.error('请填写完整的核价信息');
        // 聚焦到第一个错误字段
        const firstErrorField = error.errorFields[0];
        if (firstErrorField?.name) {
          form.scrollToField(firstErrorField.name);
        }
      } else {
        message.error('核价结果提交失败，请重试');
        console.error('核价提交失败:', error);
      }
    }
  };

  // 渲染车辆表格
  const renderVehicleTable = (vehicles: any[], modelId: string) => {
    const columns = [
      {
        title: '车架号',
        dataIndex: 'vin',
        key: 'vin',
        // width: 130,
        render: (text: string) => (
          <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
            {text}
          </span>
        ),
      },
      {
        title: '指导价(万元)',
        dataIndex: 'guidePrice',
        key: 'guidePrice',
        // width: 100,
      },
      {
        title: '生产日期',
        dataIndex: 'productionDate',
        key: 'productionDate',
        // width: 100,
        render: (text: string) => text || '-',
      },
      {
        title: '里程数(km)',
        dataIndex: 'odometer',
        key: 'odometer',
        // width: 130,
        render: (value: number) => value ? `${value.toLocaleString()}` : '-',
      },
      {
        title: '内外饰',
        dataIndex: 'outInColor',
        key: 'outInColor',
        // width: 130,
        render: (text: string) => text || '-',
      },
      {
        title: '合同金额(元)',
        dataIndex: 'contractAmountStr',
        key: 'contractAmountStr',
        // width: 130,
        render: (text: string) => text || '-',
      },
      {
        title: '出款金额(元)',
        key: 'actualPrice',
        width: 130,
        render: (_: any, record: any) => (
          <Form.Item
            name={['vehicles', modelId, record.id, 'actualPrice']}
            rules={[{ required: true, message: '请输入出款金额' }]}
            style={{ marginBottom: 0 }}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
              parser={value => value ? value.replace(/\$\s?|(,*)/g, '') : ''}
              placeholder="请输入出款金额"
            />
          </Form.Item>
        ),
      },
    //   {
    //     title: '备注',
    //     key: 'remarks',
    //     width: 120,
    //     render: (_: any, record: any) => (
    //       <Form.Item
    //         name={['vehicles', modelId, record.id, 'remarks']}
    //         style={{ marginBottom: 0 }}
    //       >
    //         <Input.TextArea 
    //           placeholder="请输入备注" 
    //           rows={1}
    //           style={{ width: '100%' }}
    //         />
    //       </Form.Item>
    //     ),
    //   },
      {
        title: '照片',
        key: 'photos',
        // width: 130,
        render: (_: any, record: any) => {
          const inspectionCount = record?.inspectionCarDTOS?.length || 0;
          const damageCount = record?.qualityDamageImgUrlList?.length || 0;
          const isExpanded = expandedPhotos[record.id] || false;
          
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                             <div style={{ display: 'flex', gap: '4px' }}>
                 <Tag color="blue">验车:{inspectionCount}</Tag>
                 <Tag color="orange">质损:{damageCount}</Tag>
               </div>
              <Button 
                type="link" 
                size="small"
                icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                onClick={() => togglePhotoExpansion(record.id)}
                style={{ padding: 0, height: 'auto' }}
              >
                {isExpanded ? '收起' : '展开'}
              </Button>
            </div>
          );
        },
      },
    ];

    return (
      <div>
        <Table
          columns={columns}
          dataSource={vehicles}
          pagination={false}
          size="small"
          bordered
          rowKey="id"
          style={{width: '100%'}}
        //   scroll={{ x: 1200 }}
          expandable={{
            expandedRowKeys: Object.keys(expandedPhotos).filter(key => expandedPhotos[key]),
            onExpand: (expanded: boolean, record: any) => {
              togglePhotoExpansion(record.id);
              // 延迟设置colSpan以确保DOM已更新
              setTimeout(() => {
                const expandedRows = document.querySelectorAll('.ant-table-expanded-row td');
                expandedRows.forEach(td => {
                  (td as HTMLElement).setAttribute('colspan', '8');
                });
              }, 0);
            },
            columnWidth: 0, // 设置展开列宽度为0
            expandedRowRender: (record: any) => {
              const inspectionCount = record?.inspectionCarDTOS?.length || 0;
              const damageCount = record?.qualityDamageImgUrlList?.length || 0;    
              return (
                <div style={{ padding: '16px', background: '#fafafa' }}>
                  <Tabs size="small">
                    <Tabs.TabPane tab={`验车照片 (${inspectionCount})`} key="inspection">
                      <div className={styles.photoGrid}>
                        {record.inspectionCarDTOS?.map((photo: any, index: number) => (
                          <div key={photo.id || index} className={styles.photoItem}>
                            <Image
                              src={'http://120.26.232.36' + photo.fileUrl}
                              alt={`验车照片${index + 1}`}
                              style={{ width: '100%', height: 150, objectFit: 'cover' }}
                              preview={{
                                mask: (
                                  <div style={{ color: 'white', textAlign: 'center' }}>
                                    <EyeOutlined style={{ fontSize: 20 }} />
                                    <div style={{ marginTop: 4 }}>预览</div>
                                  </div>
                                )
                              }}
                            />
                            <div className={styles.photoDescription}>
                              <span>验车照片 {index + 1}</span>
                            </div>
                          </div>
                        ))}
                        {inspectionCount === 0 && (
                          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                            暂无验车照片
                          </div>
                        )}
                      </div>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={`质损照片 (${damageCount})`} key="damage">
                      <div className={styles.photoGrid}>
                        {record.qualityDamageImgUrlList?.map((url: string, index: number) => (
                          <div key={index} className={styles.photoItem}>
                            <Image
                              src={'http://120.26.232.36' + url}
                              alt={`质损照片${index + 1}`}
                              style={{ width: '100%', height: 150, objectFit: 'cover' }}
                              preview={{
                                mask: (
                                  <div style={{ color: 'white', textAlign: 'center' }}>
                                    <EyeOutlined style={{ fontSize: 20 }} />
                                    <div style={{ marginTop: 4 }}>预览</div>
                                  </div>
                                )
                              }}
                            />
                            <div className={styles.photoDescription}>
                              <span>质损照片 {index + 1}</span>
                            </div>
                          </div>
                        ))}
                        {damageCount === 0 && (
                          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                            暂无质损照片
                          </div>
                        )}
                      </div>
                    </Tabs.TabPane>
                  </Tabs>
                </div>
              );
            },
            expandIcon: () => null, // 隐藏默认的展开图标，使用自定义的
          }}
        />
      </div>
    );
  };

  const renderModelSection = (vehicleName: string, model: any) => (
    <Card 
      key={model.id} 
      className={styles.modelSection}
      style={{ marginBottom: 24 }}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
              {vehicleName}
            </h3>
            <Tag color="green">
              {model.pricingTaskCarInfoList?.length || 0} 辆车
            </Tag>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Form.Item
              name={['models', model.id, 'totalPrice']}
              label="总核价(元)"
              style={{ marginBottom: '0px !important' }}
            >
              <InputNumber
                style={{ width: 250 }}
                onChange={(value) => handleTotalPriceChange(model.id, value)}
                placeholder="请输入总核价"
                size="large"
              />
            </Form.Item>
          </div>
        </div>
      }
    >
      <div className={styles.vehiclesList}>
        {renderVehicleTable(model.pricingTaskCarInfoList || [], model.id)}
      </div>
    </Card>
  );

  return (
    <div className={styles.priceCheckDetail}>
      <Card>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSubmitPricing}
          initialValues={{ orderId: id }}
        >
          <Form.Item name="orderId" label="订单编号" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>

          {vehicleInfo?.map((model: any, index: number) => (
            <React.Fragment key={model.id}>
              {renderModelSection(model.vehicleName, model)}
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