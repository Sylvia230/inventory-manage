import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, DatePicker, Input, Card, Button, Table, Space, message, Col, Row } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import styles from './index.module.less';
import { GetVehicleBrandListApi, GetVehicleSeriesListApi, GetVehicleModelListApi } from '@/services/vehicle';
import { getWarehouseListApi, getCustomerListApi, getAppearanceAndInteriorListApi, addInboundApi } from '@/services/wareHouse';

interface AddVehicleInModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
}

interface CustomerInfo {
  id: string;
  name: string;
  contact: string;
  phone: string;
}

interface VehicleInfo {
  key: string;
  spec: string;
  brand: string;
  series: string;
  model: string;
  exterior: string;
  interior: string;
  quantity: number;
  vins: string[];
}

interface BrandItem {
  id: number;
  brandName: string;
  carBrandName: string; // 添加API返回的品牌名称字段
}

interface SeriesItem {
  id: number;
  seriesName: string;
  carSeriesName: string; // 添加API返回的车系名称字段
}

interface ModelItem {
  id: number;
  modelName: string;
  carVehicleName: string; // 添加车型名称字段
}

interface AppearanceInteriorItem {
  id: string;
  name: string;
  type: 'exterior' | 'interior';
  colorName: string; // 添加颜色名称字段
}

type SeriesOptionsType = {
  [key: string]: Array<{ label: string; value: string; }>;
};

type ModelOptionsType = {
  [key: string]: Array<{ label: string; value: string; }>;
};

const AddVehicleInModal: React.FC<AddVehicleInModalProps> = ({
  open,
  onCancel,
  onOk,
}) => {
  const [baseForm] = Form.useForm();
  const [vehicleForm] = Form.useForm();
  const [customerList, setCustomerList] = useState<CustomerInfo[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInfo | null>(null);
  const [vehicleList, setVehicleList] = useState<VehicleInfo[]>([]);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  
  // 品牌、车系、车型数据状态
  const [brandList, setBrandList] = useState<BrandItem[]>([]);
  const [seriesList, setSeriesList] = useState<SeriesItem[]>([]);
  const [modelList, setModelList] = useState<ModelItem[]>([]);
  const [brandLoading, setBrandLoading] = useState(false);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);

  const [warehouseOptions, setWarehouseOptions] = useState<any[]>([]);

  // 外观内饰数据状态
  const [exteriorList, setExteriorList] = useState<AppearanceInteriorItem[]>([]);
  const [interiorList, setInteriorList] = useState<AppearanceInteriorItem[]>([]);
  const [appearanceLoading, setAppearanceLoading] = useState(false);

  // 入库类型选项
  const inStockTypeOptions = [
    { label: '贸融入库', value: '1' },
    { label: '普通入库', value: '2' },
  ];

  // 车规选项
  const specOptions = [
    {"code": 1, "desc": "国产", label: "国产", value: 1},
    {"code": 2, "desc": "中规", label: "中规", value: 2},
    {"code": 3, "desc": "美规", label: "美规", value: 3},
    {"code": 4, "desc": "加规", label: "加规", value: 4},
    {"code": 5, "desc": "中东", label: "中东", value: 5},
    {"code": 6, "desc": "欧规", label: "欧规", value: 6},
    {"code": 7, "desc": "墨西哥版", label: "墨西哥版", value: 7},
    {"code": 8, "desc": "平行进口", label: "平行进口", value: 8},
    {"code": 9, "desc": "亚洲版", label: "亚洲版", value: 9}
  ];

  // 获取品牌列表
  const fetchBrandList = async () => {
    try {
      setBrandLoading(true);
      const res = await GetVehicleBrandListApi({
        pageNo: 1,
        pageSize: 1000
      });
      if (res?.result?.result) {
        setBrandList(res?.result?.result);
      }
    } catch (error) {
      message.error('获取品牌列表失败');
    } finally {
      setBrandLoading(false);
    }
  };

  // 获取车系列表
  const fetchSeriesList = async (brandId: number) => {
    try {
      setSeriesLoading(true);
      const res = await GetVehicleSeriesListApi({
        pageNo: 1,
        pageSize: 1000,
        carBrandId: brandId
      });
      if (res?.result?.result) {
        setSeriesList(res?.result?.result);
      }
    } catch (error) {
      message.error('获取车系列表失败');
    } finally {
      setSeriesLoading(false);
    }
  };

  // 获取车型列表
  const fetchModelList = async (seriesId: number) => {
    try {
      setModelLoading(true);
      const res = await GetVehicleModelListApi({
        pageNo: 1,
        pageSize: 1000,
        carSeriesId:seriesId
      });
      if (res?.result?.result) {
        setModelList(res?.result?.result);
      }
    } catch (error) {
      message.error('获取车型列表失败');
    } finally {
      setModelLoading(false);
    }
  };

  // 获取外观内饰列表
  const fetchAppearanceInteriorList = async (vehicleId: number) => {
    try {
      setAppearanceLoading(true);
      
      const res = await getAppearanceAndInteriorListApi({
        carVehicleId: vehicleId,
        colorType: 1,   // 1: 外观 2: 内饰
        pageNo: 1,
        pageSize: 1000
      });
      console.log(res, '外观');
      if (res?.result) {
        // 分离外观和内饰数据
        const exteriorData = res.result
        setExteriorList(exteriorData);
      }

      const resInter = await getAppearanceAndInteriorListApi({
        carVehicleId: vehicleId,
        colorType: 2,   // 1: 外观 2: 内饰
        pageNo: 1,
        pageSize: 1000
      });
      console.log(resInter, '内饰');
      if (resInter?.result) {
        const interiorData = resInter.result
        setInteriorList(interiorData);
      }
    } catch (error) {
      message.error('获取外观内饰列表失败');
    } finally {
      setAppearanceLoading(false);
    }
  };

  // 获取停放车库
  const getInboundList = async () => {
    const res:any = await getWarehouseListApi({
      pageSize: 1000,
      pageNo: 1,
    });
    setWarehouseOptions(res.result);
    console.log(res, 'getInboundList');
  };

  // 获取客户列表
  const getCustomerList = async () => {
    const res:any = await getCustomerListApi({
      pageSize: 1000,
      pageNo: 1,
    });
    console.log(res, 'getCustomerList');
    setCustomerList(res?.result?.result);
  };

  // 初始化时获取品牌列表
  useEffect(() => {
    if (open) {
      fetchBrandList();
      getInboundList();
    }
  }, [open]);

  useEffect(() => {
    getCustomerList();
  }, []);

  const handleCustomerChange = (customerId: string) => {
    const customer:any = customerList.find(c => c.id === customerId);
    setSelectedCustomer(customer || null);
    if (customer) {
      baseForm.setFieldsValue({
        contactPerson: customer.contactName,
        contactPhone: customer.contactMobile,
      });
    }
  };

  // 品牌选择变化
  const handleBrandChange = (brandId: number) => {
    vehicleForm.setFieldsValue({ series: undefined,vehicleId : undefined, outerColorId: undefined, innerColorId: undefined });
    setSeriesList([]);
    setModelList([]);
    setExteriorList([]);
    setInteriorList([]);
    if (brandId) {
      fetchSeriesList(brandId);
    }
  };

  // 车系选择变化
  const handleSeriesChange = (seriesId: number) => {
    vehicleForm.setFieldsValue({ model: undefined, vehicleId: undefined, outerColorId: undefined, innerColorId: undefined });
    setModelList([]);
    setExteriorList([]);
    setInteriorList([]);
    if (seriesId) {
      fetchModelList(seriesId);
    }
  };

  // 车型选择变化
  const handleModelChange = (vehicleId: number) => {
    vehicleForm.setFieldsValue({ outerColorId: undefined, innerColorId: undefined });
    setExteriorList([]);
    setInteriorList([]);
    if (vehicleId) {
      fetchAppearanceInteriorList(vehicleId);
    }
  };

  const handleAddVehicle = async () => {
    try {
      const values = await vehicleForm.validateFields();
      const vins = values.vins.split(',')
        .filter((vin: string) => Boolean(vin))
        .map((vin: string) => vin.trim());
      
      console.log(vins, 'vins', values.quantity);
      if (vins.length != values.quantity) {
        message.error('车架号数量与车辆数量不匹配');
        return;
      }

      // 获取选中的品牌名称
      const selectedBrand = brandList.find(item => item.id === values.brand);
      // 获取选中的车系名称
      const selectedSeries = seriesList.find(item => item.id === values.series);
      // 获取选中的车型名称
      const selectedModel:any = modelList.find(item => item.id === values.vehicleId);
      // 获取选中的外观名称
      const selectedExterior = exteriorList.find(item => item.id === values.outerColorId);
      // 获取选中的内饰名称
      const selectedInterior = interiorList.find(item => item.id === values.innerColorId);

      const newVehicle: VehicleInfo = {
        key: Date.now().toString(),
        ...values,
        brandId: selectedBrand?.id,
        brandName: selectedBrand?.carBrandName, // 使用品牌名称
        seriesId: selectedSeries?.id,
        guidePrice: selectedModel?.guidePrice,
        emission: selectedModel?.emission,
        specName: selectedModel.spec,
        seriesName: selectedSeries?.carSeriesName, // 使用车系名称
        vehicleName: selectedModel?.carVehicleName, // 使用车型名称
        outerColorName: selectedExterior?.colorName, // 使用外观名称
        innerColorName: selectedInterior?.colorName, // 使用内饰名称
        vins,
      };

      setVehicleList([...vehicleList, newVehicle]);
      setIsAddingVehicle(false);
      vehicleForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleDeleteVehicle = (key: string) => {
    setVehicleList(vehicleList.filter(item => item.key !== key));
  };

  const handleOk = async () => {
    try {
      const values = await baseForm.validateFields();
      console.log(vehicleList, 'vehicleList');
      // 获取选中的仓库和客户信息
      const selectedWarehouse = warehouseOptions.find(w => w.id === values.warehouse);
      const selectedCustomer = customerList.find(c => c.id === values.customerId);

      const params: any = {
        warehouseId: values.warehouse,
        warehouseName: selectedWarehouse?.name,
        // storageTime: dayjs(values.storageTime).format('YYYY-MM-DD HH:mm:ss'),
        type: 2,
        customerId: values.customerId,
        customerName: selectedCustomer?.name || '',
        remark: values.remarks,
        inboundCarDTOS: vehicleList.map((item:any) => ({
          brandId: item.brand,
          spec: item.spec,
          seriesId: item.seriesId,
          vehicleId: item.vehicleId,
          vehicleName: item.vehicleName,
          outerColorId: item.outerColorId,
          innerColorId: item.innerColorId,
          carCount: Number(item.quantity),
          vin: item.vins.join(','),
          guidePrice: item.guidePrice,
          emission: item.emission,
        }))
      };

      console.log(params, 'handleOk');

      if (vehicleList.length === 0) {
        message.error('请至少添加一个车辆');
        return;
      }
      const res:any = await addInboundApi(params);
      if(res?.code == '00000') {
        message.success('入库成功');
        handleCancel();
        onOk(params);
      } else {
        message.error('入库失败');
      } console.log('新增入库数据:', values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    baseForm.resetFields();
    vehicleForm.resetFields();
    setSelectedCustomer(null);
    setVehicleList([]);
    setIsAddingVehicle(false);
    onCancel();
  };

  const columns = [
    {
      title: '车型信息',
      dataIndex: 'model',
      render: (_: unknown, record: any) => (
        <span>{record.brandName} {record.seriesName} {record.vehicleName}</span>
      ),
    },
    {
      title: '内饰/外饰',
      dataIndex: 'style',
      render: (_: unknown, record: any) => (
        <span>{record.outerColorName} / {record.innerColorName}</span>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
    },
    {
      title: '车架号',
      dataIndex: 'vins',
      render: (vins: string[]) => vins.join(', '),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: VehicleInfo) => (
        <Button 
          type="link" 
          danger 
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteVehicle(record.key)}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title="新增入库"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
    >
      <Card title="基本信息" style={{ marginBottom: 16 }} className={styles.cardWrapper}>
        <Form
          form={baseForm}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          {/* <Form.Item
            name="inStockType"
            label="入库类型"
            rules={[{ required: true, message: '请选择入库类型' }]}
          >
            <Select options={inStockTypeOptions} placeholder="请选择入库类型" />
          </Form.Item> */}

          <Form.Item
            name="warehouse"
            label="停放仓库"
            rules={[{ required: true, message: '请选择停放仓库' }]}
          >
            <Select options={warehouseOptions.map((item:any) => ({ label: item.name, value: item.id }))} placeholder="请选择停放仓库" />
          </Form.Item>

          {/* <Form.Item
            name="expectedTime"
            label="预计到库时间"
            rules={[{ required: true, message: '请选择预计到库时间' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请选择预计到库时间" />
          </Form.Item> */}

          <Form.Item
            name="customerId"
            label="客户"
            rules={[{ required: true, message: '请选择客户' }]}
          >
            <Select
              options={customerList.map(c => ({ label: c.name, value: c.id }))}
              placeholder="请选择客户"
              onChange={handleCustomerChange}
            />
          </Form.Item>

          <Form.Item
            name="contactPerson"
            label="联系人"
          >
            <Input disabled placeholder="选择客户后自动填充" />
          </Form.Item>

          <Form.Item
            name="contactPhone"
            label="联系方式"
          >
            <Input disabled placeholder="选择客户后自动填充" />
          </Form.Item>

          <Form.Item
            name="remarks"
            label="备注"
          >
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Card>

      <Card 
        title="车辆信息" 
        className={styles.cardWrapper}
        extra={
          !isAddingVehicle && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddingVehicle(true)}>
              添加车辆
            </Button>
          )
        }
      >
        {isAddingVehicle ? (
          <Form
            form={vehicleForm}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              name="spec"
              label="车规"
              rules={[{ required: true, message: '请选择车规' }]}
            >
              <Select options={specOptions} placeholder="请选择车规" />
            </Form.Item>

            <Form.Item
              name="brand"
              label="品牌"
              rules={[{ required: true, message: '请选择品牌' }]}
            >
              <Select 
                loading={brandLoading}
                options={brandList.map((item:any) => ({ 
                  label: item.carBrandName, 
                  value: item.id 
                }))}
                placeholder="请选择品牌"
                onChange={handleBrandChange}
              />
            </Form.Item>

            <Form.Item
              name="series"
              label="车系"
              rules={[{ required: true, message: '请选择车系' }]}
            >
              <Select 
                loading={seriesLoading}
                options={seriesList.map((item:any) => ({ 
                  label: item.carSeriesName, 
                  value: item.id 
                }))}
                placeholder="请选择车系"
                onChange={handleSeriesChange}
                disabled={!vehicleForm.getFieldValue('brand')}
              />
            </Form.Item>

            <Form.Item
              name="vehicleId"
              label="车型"
              rules={[{ required: true, message: '请选择车型' }]}
            >
              <Select 
                loading={modelLoading}
                options={modelList.map((item:any) => ({ 
                  label: item.carVehicleName, 
                  value: item.id 
                }))}
                placeholder="请选择车型"
                onChange={handleModelChange}
                disabled={!vehicleForm.getFieldValue('series')}
              />
            </Form.Item>

            <Form.Item
              name="outerColorId"
              label="外观"
              rules={[{ required: true, message: '请选择外观' }]}
            >
              <Select 
                loading={appearanceLoading}
                options={exteriorList.map((item: any) => ({ 
                  label: item.colorName, 
                  value: item.id 
                }))}
                placeholder="请选择外观"
                disabled={!vehicleForm.getFieldValue('vehicleId')}
              />
            </Form.Item>

            <Form.Item
              name="innerColorId"
              label="内饰"
              rules={[{ required: true, message: '请选择内饰' }]}
            >
              <Select 
                loading={appearanceLoading}
                options={interiorList.map((item: any) => ({ 
                  label: item.colorName, 
                  value: item.id 
                }))}
                placeholder="请选择内饰"
                disabled={!vehicleForm.getFieldValue('vehicleId')}
              />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="数量"
              rules={[{ required: true, message: '请输入数量' }]}
            >
              <Input type="number" min={1} placeholder="请输入数量" />
            </Form.Item>

            <Form.Item
              name="vins"
              label="车架号"
              rules={[{ required: true, message: '请输入车架号' }]}
            >
              <Input.TextArea rows={4} placeholder="请输入车架号，多个车架号用逗号分隔" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <Space>
                <Button type="primary" onClick={handleAddVehicle}>
                  保存
                </Button>
                <Button onClick={() => {
                  setIsAddingVehicle(false);
                  vehicleForm.resetFields();
                }}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        ) : (
          <Table
            columns={columns}
            dataSource={vehicleList}
            pagination={false}
          />
        )}
      </Card>
    </Modal>
  );
};

export default AddVehicleInModal; 