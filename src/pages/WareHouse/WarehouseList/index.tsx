import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Select, Space, Card, Row, Col, Tag, Modal, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { getProvinceListApi, getCityListApi, getDistrictListApi, getWarehouseListApi, addWarehouseApi, getWarehouseKeeperListApi,deleteWarehouseApi,enableOrDisableWarehouseApi } from '@/services/wareHouse';

interface WarehouseRecord {
  key: string;
  id?: string;
  name: string;
  address: string;
  type: string;
  status: string;
  serviceProvider: string;
  totalSpaces: number;
  location: string;
  isBankApproved: boolean;
  currentVehicles: number;
  // 编辑相关字段
  warehouseAddress?: string;
  warehouseType?: string;
  warehouseStatus?: string;
  warehouseTypeDesc?: string;
  warehouseStatusDesc?: string;
  provinceId?: string;
  provinceCode?: string;
  cityId?: string;
  districtId?: string;
  // 新增字段
  keeperId?: string;
  parkingLotCount?: number;
  longitude?: number;
  latitude?: number;
}

const WarehouseList: React.FC = () => {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editRecord, setEditRecord] = useState<WarehouseRecord | null>(null);
  
  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  // 仓库列表数据
  const [warehouseList, setWarehouseList] = useState<WarehouseRecord[]>([]);
  
  // 省市区数据状态
  const [provinces, setProvinces] = useState<Array<{value: string, name: string}>>([]);
  const [provinceId, setProvinceId] = useState<string>('');
  const [cities, setCities] = useState<Array<{value: string, name: string}>>([]);
  const [cityId, setCityId] = useState<string>('');
  const [districts, setDistricts] = useState<Array<{value: string, name: string}>>([]);
  const [districtId, setDistrictId] = useState<string>('');
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [warehouseKeeperList, setWarehouseKeeperList] = useState<Array<{value: string, name: string}>>([]);

  // 获取省份数据
  const getProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const res = await getProvinceListApi({});
      console.log(res, 'response');
      // API返回的数据结构应该是一个数组，包含 {id, name} 或 {value, label} 格式
      setProvinces(res || []);
    } catch (error) {
      console.error('获取省份数据失败:', error);
      message.error('获取省份数据失败');
    } finally {
      setLoadingProvinces(false);
    }
  };

  // 根据省份获取城市数据
  const getCities = async (provinceCode: string) => {
    setLoadingCities(true);
    try {
      const response = await getCityListApi({ provinceCode  });
      console.log(response, 'cities response');
      setCities(response || []);
    } catch (error) {
      console.error('获取城市数据失败:', error);
      message.error('获取城市数据失败');
    } finally {
      setLoadingCities(false);
    }
  };

  // 根据城市获取区域数据
  const getDistricts = async (cityId: string) => {
    setLoadingDistricts(true);
    try {
      const response = await getDistrictListApi({ 
        cityId: cityId,
        provinceId: provinceId.split('-')[0]
       });
      console.log(response, 'districts response');
      setDistricts(response || []);
    } catch (error) {
      console.error('获取区域数据失败:', error);
      message.error('获取区域数据失败');
    } finally {
      setLoadingDistricts(false);
    }
  };

  // 处理省份变化
  const handleProvinceChange = (provinceId: string) => {
    setProvinceId(provinceId);
    // 清空城市和区域
    addForm.setFieldsValue({
      city: undefined,
      district: undefined,
    });
    setCities([]);
    setDistricts([]);
    if (provinceId) {
      let proviceItem:any = provinces.find((item: any) => item.id === provinceId);
      getCities(proviceItem.code);
    }
  };

  // 处理城市变化
  const handleCityChange = (cityId: string) => {
    setCityId(cityId);
    // 清空区域
    addForm.setFieldsValue({
      district: undefined,
    });
    setDistricts([]);
    setDistrictId('');
    
    if (cityId) {
      getDistricts(cityId);
    }
  };

  // 处理区域变化
  const handleDistrictChange = (districtId: string) => {
    setDistrictId(districtId);
  };

  // 获取仓库列表
  const getWarehouseList = async (params: any = {}, page: number = pagination.current, size: number = pagination.pageSize) => {
    setLoading(true);
    try {
      const searchParams = {
        ...params,
        pageNo: page,
        pageSize: size,
      };
      
      const res = await getWarehouseListApi(searchParams);
      console.log('仓库列表响应:', res);
      
      // 根据API返回的数据结构调整
      const { result = [], totalCount = 0 } = res || {};
      
      // 为每个数据项添加 key 字段，用于表格渲染
      const formattedList = result.map((item: any, index: number) => ({
        ...item,
        key: item.id || index,
      }));
      
      setWarehouseList(formattedList);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: size,
        total: totalCount,
      }));
    } catch (error) {
      console.error('获取仓库列表失败:', error);
      message.error('获取仓库列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取省份数据和仓库列表
  useEffect(() => {
    getProvinces();
    getWarehouseList();
    getWarehouseKeeperList();
  }, []);

  // 获取仓库管理员
  const getWarehouseKeeperList = async () => {
    let res = await getWarehouseKeeperListApi({});
    console.log('仓库管理员列表响应:', res);
    setWarehouseKeeperList(res || []);
  }


  // 仓库类型选项
  const warehouseTypeOptions = [
    { label: '自建仓', value: '1' },
    { label: '合作仓', value: '2' },
  ];

  // 仓库状态选项
  const warehouseStatusOptions = [
    { label: '启用', value: '1' },
    { label: '作废', value: '0' },
  ];



  // 表格列定义
  const columns: ColumnsType<WarehouseRecord> = [
    {
      title: '仓库名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '仓库地址',
      dataIndex: 'warehouseAddress',
      width: 200,
    },
    {
      title: '仓库类型',
      dataIndex: 'warehouseTypeDesc',
      width: 120,
    },
    {
      title: '仓库状态',
      dataIndex: 'warehouseStatusDesc',
      width: 100,
    },
    {
      title: '仓库管理员',
      dataIndex: 'keeperName',
      width: 150,
    },
    {
      title: '总车位数',
      dataIndex: 'parkingLotCount',
      width: 100,
    },
    {
      title: '经纬度',
      dataIndex: 'location',
      width: 150,
    },
    {
      title: '是否银行准入',
      dataIndex: 'isCapitalAccess',
      width: 120,
      render: (isApproved: boolean) => (
        <Tag color={isApproved ? 'success' : 'error'}>
          {isApproved ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '在库车辆数',
      dataIndex: 'onLotCarCount',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleDelete(record)}>
            删除
          </Button>
          {
            record.warehouseStatus == '1' && (
              <Button type="link" onClick={() => handleDisable(record)}>
                作废
              </Button>
            )
          }
          {
            record.warehouseStatus == '0' && (
              <Button type="link" onClick={() => handleEnable(record)}>
                启用
              </Button>
            )
          }
        </span>
      ),
    },
  ];

  const handleSearch = (values: any) => {
    console.log('搜索条件:', values);
    // 执行搜索，重置到第一页
    getWarehouseList(values, 1, pagination.pageSize);
  };

  const handleReset = () => {
    form.resetFields();
    // 重新加载数据，重置到第一页
    getWarehouseList({}, 1, pagination.pageSize);
  };

  // 处理分页变化
  const handleTableChange = (paginationInfo: any) => {
    const formValues = form.getFieldsValue();
    getWarehouseList(formValues, paginationInfo.current, paginationInfo.pageSize);
  };

  // 根据显示文本获取对应的值
  const getValueByLabel = (label: string, options: Array<{label: string, value: string}>) => {
    const option = options.find(opt => opt.label === label);
    return option ? option.value : label;
  };

  const handleEdit = async (record: WarehouseRecord) => {
    console.log('编辑仓库:', record);
    
    // 设置编辑状态
    setIsEdit(true);
    setEditRecord(record);
    
    // 获取省市区域数据
    try {
      // 获取省份数据
      const provincesRes = await getProvinceListApi({});
      setProvinces(provincesRes || []);
      
      // 根据仓库数据设置省份
      if (record.provinceId) {
        setProvinceId(record.provinceId);
        let proviceItem:any = provinces.find((item: any) => item.id === record.provinceId);
        // 获取城市数据
        const citiesRes = await getCityListApi({ provinceCode: proviceItem.code });
        setCities(citiesRes || []);
        
        // 设置城市
        if (record.cityId) {
          setCityId(record.cityId);
          // 获取区域数据
          const districtsRes = await getDistrictListApi({ 
            cityId: record.cityId,
            provinceId: record.provinceId
          });
          setDistricts(districtsRes || []);
          setDistrictId(record.districtId || '');
        }
      }
      
      // 根据显示文本获取对应的值
      const warehouseTypeValue = getValueByLabel(record.warehouseTypeDesc || '', warehouseTypeOptions);
      const warehouseStatusValue = getValueByLabel(record.warehouseStatusDesc || '', warehouseStatusOptions);
      
      // 填充表单数据
      addForm.setFieldsValue({
        name: record.name,
        province: record.provinceId,
        city: record.cityId,
        // district: record.districtId,
        warehouseAddress: record.warehouseAddress,
        warehouseType: warehouseTypeValue,
        warehouseStatus: warehouseStatusValue,
        keeperId: record.keeperId,
        parkingLotCount: record.parkingLotCount,
        longitude: record.longitude,
        latitude: record.latitude,
      });
      
      // 打开弹窗
      setAddModalVisible(true);
    } catch (error) {
      console.error('获取编辑数据失败:', error);
      message.error('获取编辑数据失败');
    }
  };

  const handleViewDetail = (record: WarehouseRecord) => {
    console.log('查看仓库详情:', record);
    // TODO: 实现查看详情逻辑
  };

  // 删除仓库
  const handleDelete = (record: WarehouseRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除仓库"${record.name}"吗？删除后无法恢复。`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          console.log('删除仓库:', record);
          const response = await deleteWarehouseApi({ id: record.id });
          console.log('删除仓库响应:', response);
          
          if (response && response.code === "00000") {
            message.success('删除仓库成功');
            // 重新加载仓库列表
            getWarehouseList();
          } else {
            message.error(response?.message || '删除仓库失败');
          }
        } catch (error) {
          console.error('删除仓库失败:', error);
          message.error('删除仓库失败，请重试');
        }
      },
    });
  };

  // 作废仓库
  const handleDisable = (record: WarehouseRecord) => {
    Modal.confirm({
      title: '确认作废',
      content: `确定要作废仓库"${record.name}"吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          console.log('作废仓库:', record);
          const response = await enableOrDisableWarehouseApi({ 
            id: record.id, 
            status: 0
          });
          console.log('作废仓库响应:', response);
          
          if (response && response.code === "00000") {
            message.success('作废仓库成功');
            // 重新加载仓库列表
            getWarehouseList();
          } else {
            message.error(response?.message || '作废仓库失败');
          }
        } catch (error) {
          console.error('作废仓库失败:', error);
          message.error('作废仓库失败，请重试');
        }
      },
    });
  };

  // 启用仓库
  const handleEnable = (record: WarehouseRecord) => {
    Modal.confirm({
      title: '确认启用',
      content: `确定要启用仓库"${record.name}"吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          console.log('启用仓库:', record);
          const response = await enableOrDisableWarehouseApi({ 
            id: record.id, 
            status: 1
          });
          console.log('启用仓库响应:', response);
          
          if (response && response.code === "00000") {
            message.success('启用仓库成功');
            // 重新加载仓库列表
            getWarehouseList();
          } else {
            message.error(response?.message || '启用仓库失败');
          }
        } catch (error) {
          console.error('启用仓库失败:', error);
          message.error('启用仓库失败，请重试');
        }
      },
    });
  };

  const handleAdd = () => {
    // 重置编辑状态
    setIsEdit(false);
    setEditRecord(null);
    // 清空表单
    addForm.resetFields();
    // 重置省市区状态
    setProvinceId('');
    setCityId('');
    setDistrictId('');
    setCities([]);
    setDistricts([]);
    // 打开弹窗
    setAddModalVisible(true);
  };

  const handleAddCancel = () => {
    setAddModalVisible(false);
    addForm.resetFields();
    // 重置状态
    setIsEdit(false);
    setEditRecord(null);
    setProvinceId('');
    setCityId('');
    setDistrictId('');
    setCities([]);
    setDistricts([]);
  };

  const handleAddSubmit = async () => {
    try {
      const values = await addForm.validateFields();
      console.log('表单数据:', values);
      
      // 根据省份ID获取省份名称
      const selectedProvince = provinces.find((item: any) => item.id === values.province);
      const provinceName = selectedProvince ? selectedProvince.name : '';
      
      // 根据城市ID获取城市名称
      const selectedCity = cities.find((item: any) => item.id === values.city);
      const cityName = selectedCity ? selectedCity.name : '';
      
      // 根据管理员ID获取管理员名称
      const selectedKeeper: any = warehouseKeeperList.find((item: any) => item.id === values.keeperId);
      const keeperName = selectedKeeper ? selectedKeeper.personName : '';
      
      // 构建接口参数
      const params: any = {
        name: values.name,
        provinceId: values.province ? values.province.split('-')[0] : '',
        provinceName: provinceName,
        cityId: values.city,
        cityName: cityName,
        warehouseAddress: values.warehouseAddress,
        warehouseType: values.warehouseType,
        warehouseStatus: values.warehouseStatus,
        keeperId: values.keeperId,
        keeperName: keeperName,
        parkingLotCount: values.parkingLotCount,
        longitude: values.longitude,
        latitude: values.latitude,
      };
      
      let response;
      if (isEdit && editRecord) {
        // 编辑模式
        params.id = editRecord.id;
        console.log('编辑仓库接口参数:', params);
        // TODO: 调用编辑接口
        // response = await editWarehouseApi(params);
        response = { code: "00000" }; // 临时模拟
      } else {
        // 新增模式
        console.log('新增仓库接口参数:', params);
        response = await addWarehouseApi(params);
      }
      
      console.log('接口响应:', response);
      
      if (response && response.code == "00000") {
        message.success(isEdit ? '编辑仓库成功' : '新增仓库成功');
        setAddModalVisible(false);
        addForm.resetFields();
        // 重置状态
        setIsEdit(false);
        setEditRecord(null);
        setProvinceId('');
        setCityId('');
        setDistrictId('');
        setCities([]);
        setDistricts([]);
        // 重新加载仓库列表
        getWarehouseList();
      } else {
        message.error(response?.message || (isEdit ? '编辑仓库失败' : '新增仓库失败'));
      }
    } catch (error) {
      console.error(isEdit ? '编辑仓库失败:' : '新增仓库失败:', error);
      message.error(isEdit ? '编辑仓库失败，请重试' : '新增仓库失败，请重试');
    }
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.header}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增仓库
        </Button>
      </div> */}

      <Form
        form={form}
        onFinish={handleSearch}
        layout="inline"
      >
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={8}>
            <Form.Item
              name="name"
              label="仓库名称"
            >
              <Input placeholder="请输入仓库名称" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="warehouseType"
              label="仓库类型"
            >
              <Select
                placeholder="请选择仓库类型"
                allowClear
                options={warehouseTypeOptions}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="warehouseStatus"
              label="仓库状态"
            >
              <Select
                placeholder="请选择仓库状态"
                allowClear
                options={warehouseStatusOptions}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ width: '100%' }}>
          <Col span={24}>
            <Space>
              <Button icon={<SearchOutlined />} type="primary" htmlType="submit" loading={loading}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增仓库
        </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      <Table
        columns={columns}
        dataSource={warehouseList}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1500 }}
      />

      <Modal
        title={isEdit ? "编辑仓库" : "新增仓库"}
        open={addModalVisible}
        onOk={handleAddSubmit}
        onCancel={handleAddCancel}
        width={600}
        okText="确认"
        cancelText="取消"
      >
        <Form
          form={addForm}
          layout="inline"
          requiredMark={false}
        >
          <Col span={24}>
            <Form.Item
              name="name"
              label="仓库名称"
              rules={[{ required: true, message: '请输入仓库名称' }]}
            >
              <Input placeholder="请输入仓库名称" />
            </Form.Item>
          </Col>
          
          <Col span={24}>
            <Form.Item
              name="province"
              label="省份"
              rules={[{ required: true, message: '请选择省份' }]}
            >
              <Select
                placeholder="请选择省份"
                loading={loadingProvinces}
                onChange={handleProvinceChange}
                allowClear
                value={provinceId}
              >
                {
                  provinces?.map((item:any) => (
                    <Select.Option key={item.id } value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>

            <Form.Item
              name="city"
              label="城市"
              rules={[{ required: true, message: '请选择城市' }]}
            >
              <Select
                placeholder="请选择城市"
                loading={loadingCities}
                onChange={handleCityChange}
                allowClear
                disabled={cities.length === 0}
                value={cityId}
              >
                {
                  cities?.map((item:any) => (
                    <Select.Option key={item.id || item.value} value={item.id || item.value}>
                      {item.name || item.label}
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>

            {/* <Form.Item
              name="district"
              label="区域"
              rules={[{ required: true, message: '请选择区域' }]}
            >
              <Select
                placeholder="请选择区域"
                loading={loadingDistricts}
                onChange={handleDistrictChange}
                allowClear
                disabled={districts.length === 0}
                value={districtId}
              >
                {
                  districts?.map((item:any) => (
                    <Select.Option key={item.id || item.value} value={item.id || item.value}>
                      {item.name || item.label}
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item> */}

            <Form.Item
              name="warehouseAddress"
              label="详细地址"
              rules={[{ required: true, message: '请输入详细地址' }]}
            >
              <Input.TextArea
                placeholder="请输入详细地址"
                rows={3}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="warehouseType"
              label="仓库类型"
              rules={[{ required: true, message: '请选择仓库类型' }]}
            >
              <Select
                placeholder="请选择仓库类型"
                options={warehouseTypeOptions}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="warehouseStatus"
              label="仓库状态"
              rules={[{ required: true, message: '请选择仓库状态' }]}
            >
              <Select
                placeholder="请选择仓库状态"
                options={warehouseStatusOptions}
              />
            </Form.Item>
          </Col>
          
          <Col span={24}>
            <Form.Item
              name="keeperId"
              label="仓库管理员"
              rules={[{ required: true, message: '请选择仓库管理员' }]}
            >
              <Select
                placeholder="请选择仓库管理员"
                allowClear
              >
                {
                  warehouseKeeperList?.map((item: any) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.personName}
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={24}>
            <Form.Item
              name="parkingLotCount"
              label="总车位数"
              rules={[{ required: true, message: '请输入总车位数' }]}
            >
              <Input 
                placeholder="请输入总车位数" 
                type="number"
                min={0}
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="longitude"
              label="经度"
              rules={[{ required: true, message: '请输入经度' }]}
            >
              <Input 
                placeholder="请输入经度" 
                type="number"
                step="0.000001"
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="latitude"
              label="纬度"
              rules={[{ required: true, message: '请输入纬度' }]}
            >
              <Input 
                placeholder="请输入纬度" 
                type="number"
                step="0.000001"
              />
            </Form.Item>
          </Col>
        </Form>
      </Modal>
    </div>
  );
};

export default WarehouseList; 