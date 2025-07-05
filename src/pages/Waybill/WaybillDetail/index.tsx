import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { 
  Card, 
  Descriptions, 
  Button, 
  Space, 
  Tag, 
  Divider,
  Row,
  Col,
  Spin,
  message,
  Table,
  Upload,
  Modal,
  Tooltip,
  Select,
  Image,
  List,
  Form,
  DatePicker,
  TimePicker,
  Input,
  InputNumber,
  Radio
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import { 
  ArrowLeftOutlined, 
  PrinterOutlined, 
  DownloadOutlined,
  UploadOutlined,
  FileProtectOutlined,
  CarOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  FileTextOutlined,
  CameraOutlined,
  EyeOutlined,
  PlusOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import styles from './index.module.less';
import { 
  getWaybillDetailApi, 
  completePickupApi,
  vehicleArrivalApi,
  uploadFileApi,
  saveBatchInspectionApi,
  uploadVehiclePhoto, 
  batchOperateVehicles,
  getVehiclePhotos,
  type WaybillDetailData, 
  type VehicleInfo,
  type BatchOperationType,
  PhotoType,
  type PhotoInfo
} from '@/services/waybill';
import { GetEnumApi } from '@/services/user';
import InsuranceModal from '../InsuranceModal';

const WaybillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState<any>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [currentVehicleId, setCurrentVehicleId] = useState<string>('');
  const [selectedPhotoType, setSelectedPhotoType] = useState<PhotoType>(PhotoType.FRONT_LEFT_45);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [form] = Form.useForm();
  const [uploadedPhotos, setUploadedPhotos] = useState<{[key: string]: any}>({});
  const [insuranceModalVisible, setInsuranceModalVisible] = useState(false);
  const [deliveryDocModalVisible, setDeliveryDocModalVisible] = useState(false);
  const [deliveryDocForm] = Form.useForm();
  const [isDamaged, setIsDamaged] = useState<boolean>(false);
  const [damagePhotos, setDamagePhotos] = useState<any[]>([]);
  const [currentVehicleInfo, setCurrentVehicleInfo] = useState<any>(null);
  const [photoViewModalVisible, setPhotoViewModalVisible] = useState(false);
  const [currentViewPhotos, setCurrentViewPhotos] = useState<any[]>([]);
  const [photoViewType, setPhotoViewType] = useState<'inspection' | 'damage'>('inspection');
  const [inspectionPhotosExpanded, setInspectionPhotosExpanded] = useState(false);
  const [damagePhotosExpanded, setDamagePhotosExpanded] = useState(false);

  // 照片列表配置
  const photoList = [
    { name: 'leftFront45', label: '左前45度照片',value: '1' },    
    { name: 'leftFrontDoor', label: '左前门含A柱的照片',value: '2' },
    { name: 'leftRearDoor', label: '左后门的照片',value: '3' },
    { name: 'rearWheel', label: '后轮轮毂照片',value: '4' },
    { name: 'centerConsole', label: '中控台照片',value: '5' },
    { name: 'dashboard', label: '仪表盘照片',value: '6' },
    { name: 'rightRear45', label: '右后45度照片',value: '7' },
    { name: 'rightFrontDoor', label: '右前门含A柱的照片',value: '8' },
    { name: 'nameplate', label: '铭牌照片',value: '9' },
    { name: 'inventoryForm', label: '商品车入库信息采集表',value: '10' },
    { name: 'engineBay', label: '发动机舱',value: '11' },
  ];



  // 照片类型选项
  const photoTypeOptions = [
    { label: '左前45度照片', value: PhotoType.FRONT_LEFT_45 },
    { label: '左前门含A柱照片', value: PhotoType.FRONT_LEFT_DOOR_A_PILLAR },
    { label: '左后门照片', value: PhotoType.REAR_LEFT_DOOR },
    { label: '后轮轮毂照片', value: PhotoType.REAR_WHEEL_HUB },
    { label: '中控台照片', value: PhotoType.CENTER_CONSOLE },
    { label: '仪表盘照片', value: PhotoType.DASHBOARD },
    { label: '右后45度照片', value: PhotoType.RIGHT_REAR_45 },
    { label: '右前门含A柱的照片', value: PhotoType.RIGHT_FRONT_DOOR_A_PILLAR },
    { label: '铭牌照片', value: PhotoType.NAMEPLATE },
    { label: '商品车入库信息采集表', value: PhotoType.INVENTORY_FORM },
    { label: '发动机舱', value: PhotoType.ENGINE_BAY },

  ];

  useEffect(() => {
    getUploadVehicleTypeEnum();
    if (id) {
      fetchWaybillDetail();
    }
  }, [id]);

  // 获取上传车辆类型枚举
  const getUploadVehicleTypeEnum = async () => {
    const response:any = await GetEnumApi('FileTypeEnum');
    console.log('....getUploadVehicleTypeEnum', response)
  }

  const fetchWaybillDetail = async () => {
    try {
      setLoading(true);
      // // 模拟API调用
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      // // 模拟数据
      // const mockData: WaybillDetailData = {
      //   waybillNo: 'WB20240301001',
      //   status: 'in_transit',
      //   startLocation: '上海市浦东新区张江高科技园区',
      //   endLocation: '北京市朝阳区望京SOHO',
      //   orderTime: '2024-03-01 10:30:00',
      //   pickupTime: '2024-03-01 14:00:00',
        
      //   orderNo: 'ORD20240301001',
      //   businessManager: '张三',
      //   dealer: '上海汽车销售有限公司',
      //   supplier: '北京汽车制造厂',
        
      //   customerName: '李四',
      //   contactPerson: '李四',
      //   contactPhone: '13800138000',
        
      //   pickupContact: '王五',
      //   pickupPhone: '13900139000',
      //   pickupAddress: '上海市浦东新区张江高科技园区科苑路88号',
        
      //   deliveryContact: '赵六',
      //   deliveryPhone: '13600136000',
      //   deliveryAddress: '北京市朝阳区望京SOHO T1座15层',
        
      //   vehicles: [
      //     {
      //       id: '1',
      //       vin: 'LSGWB6338ES123456',
      //       model: '奔驰E300L',
      //       interior: '黑色真皮',
      //       exterior: '珍珠白',
      //       targetWarehouse: '北京仓库A区',
      //       contractPrice: 450000,
      //       guidePrice: 480000,
      //       estimatedArrivalTime: '2024-03-05 15:00:00',
      //       isDamaged: false,
      //       photos: []
      //     },
      //     {
      //       id: '2',
      //       vin: 'LSGWB6338ES789012',
      //       model: '宝马530Li',
      //       interior: '米色真皮',
      //       exterior: '墨玉黑',
      //       targetWarehouse: '北京仓库B区',
      //       contractPrice: 520000,
      //       guidePrice: 550000,
      //       estimatedArrivalTime: '2024-03-05 16:30:00',
      //       isDamaged: true,
      //       photos: []
      //     },
      //     {
      //       id: '3',
      //       vin: 'LSGWB6338ES345678',
      //       model: '奥迪A6L',
      //       interior: '棕色真皮',
      //       exterior: '银色',
      //       targetWarehouse: '北京仓库C区',
      //       contractPrice: 420000,
      //       guidePrice: 450000,
      //       estimatedArrivalTime: '2024-03-05 14:00:00',
      //       isDamaged: false,
      //       photos: []
      //     }
      //   ]
      // };
      
      // setDetailData(mockData);
      
      // 实际API调用
      const response:any = await getWaybillDetailApi(id!);
      console.log('....response', response)
      setDetailData(response);
    } catch (error) {
      message.error('获取运单详情失败');
      console.error('获取运单详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    const statusMap = {
      pending: { color: 'orange', text: '待发车' },
      in_transit: { color: 'blue', text: '运输中' },
      delivered: { color: 'green', text: '已送达' },
      cancelled: { color: 'red', text: '已取消' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { color: 'default', text: '未知' };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  // 车辆表格列定义
  const vehicleColumns: ColumnsType<VehicleInfo> = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '车架号',
      dataIndex: 'vin',
      key: 'vin',
      width: 150,
    },
    {
      title: '车型',
      dataIndex: 'vehicleName',
      key: 'vehicleName',
      width: 120,
    },
    {
      title: '内外饰',
      dataIndex: 'outInColor',
      key: 'outInColor',
      width: 150,
    },
    {
      title: '目的仓库',
      dataIndex: 'targetWarehouse',
      key: 'targetWarehouse',
      width: 120,
      render: (targetWarehouse: string) => {
          return <div color="blue">{detailData?.wmsWarehouseDTO?.warehouseAddress}</div>
      }
    },
    {
      title: '合同价(元)',
      dataIndex: 'contractAmountStr',
      key: 'contractAmountStr',
      width: 100,
    },
    {
      title: '指导价(元)',
      dataIndex: 'guidePrice',
      key: 'guidePrice',
      width: 100,
    },
    {
      title: '预计到达时间',
      dataIndex: 'estimatedArrivalTime',
      key: 'estimatedArrivalTime',
      width: 150,
      render: (estimatedArrivalTime: string) => {
        return <div>{detailData?.reachTimeStr}</div>
      }
    },
    {
      title: '质损照片',
      dataIndex: 'isQualityDamage',
      key: 'isQualityDamage',
      width: 80,
             render: (_, record:any) => (
         <Space size="small">
           <Button 
             type="link" 
             icon={<EyeOutlined />} 
             onClick={() => handleViewDamagePhotos(record.id)}
             size="small"
             disabled={!record.qualityDamageImgUrlList?.length}
           >
             {record.qualityDamageImgUrlList?.length || 0}
           </Button>
         </Space>
       ),
    },
    {
      title: '验车照片',
      key: 'photos',
      width: 100,
      render: (_, record:any) => (
        <Space size="small">
                     <Button 
             type="link" 
             icon={<EyeOutlined />} 
             onClick={() => handleViewPhotos(record.id)}
             size="small"
             disabled={!record.inspectionCarDTOS?.length}
           >
             {record.inspectionCarDTOS?.length || 0}
           </Button>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          icon={<CameraOutlined />}
          onClick={() => handleUploadPhoto(record.id)}
        >
          上传照片
        </Button>
      ),
    },
  ];

  // 表格行选择配置
  const rowSelection: TableRowSelection<VehicleInfo> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleBack = () => {
    navigate('/waybill/list');
  };

  const handlePrint = () => {
    message.info('打印功能开发中...');
  };

  const handleDownload = () => {
    message.info('下载功能开发中...');
  };

  // 上传照片
  const handleUploadPhoto = (vehicleId: string) => {
    setCurrentVehicleId(vehicleId);
    // 找到当前车辆信息
    const vehicleInfo = detailData?.carInfo?.find(car => car.id === vehicleId);
    setCurrentVehicleInfo(vehicleInfo);
    setIsDamaged(vehicleInfo?.isQualityDamage || false);
    setUploadModalVisible(true);
    form.setFieldsValue({
      vin: vehicleInfo?.vin,
      odometer: vehicleInfo?.odometer,
      isQualityDamage: vehicleInfo?.isQualityDamage,
      productionDate: vehicleInfo?.productionDate ? dayjs(vehicleInfo.productionDate) : null,
    });

    // 回填已有的验车照片
    if (vehicleInfo?.inspectionCarDTOS && vehicleInfo.inspectionCarDTOS.length > 0) {
      const existingPhotos: any = {};
      vehicleInfo.inspectionCarDTOS.forEach((photo: any) => {
        const photoItem = photoList.find(item => item.value === photo.anglePosition);
        if (photoItem) {
          existingPhotos[photoItem.name] = {
            uid: photo.id || Date.now().toString(),
            name: `${photoItem.label}.jpg`,
            status: 'done',
            url: photo.fileUrl,
            anglePosition: photo.anglePosition,
            fileUrl: photo.fileUrl,
          };
        }
      });
      setUploadedPhotos(existingPhotos);
    }

    // 回填已有的质损照片
    if (vehicleInfo?.qualityDamageImgUrlList && vehicleInfo.qualityDamageImgUrlList.length > 0) {
      const existingDamagePhotos = vehicleInfo.qualityDamageImgUrlList.map((url: string, index: number) => ({
        uid: `damage_${index}_${Date.now()}`,
        name: `质损照片_${index + 1}.jpg`,
        status: 'done',
        url: url,
        fileUrl: url,
      }));
      setDamagePhotos(existingDamagePhotos);
    }
  };

  // 关闭上传模态框
  const handleCloseUploadModal = () => {
    // 清理未保存的URL对象（只清理新上传的，不清理已有的）
    Object.values(uploadedPhotos).forEach((photo: any) => {
      if (photo?.url && photo.url.startsWith('blob:')) {
        URL.revokeObjectURL(photo.url);
      }
    });
    
    // 清理质损照片的URL对象（只清理新上传的，不清理已有的）
    damagePhotos.forEach((photo: any) => {
      if (photo?.url && photo.url.startsWith('blob:')) {
        URL.revokeObjectURL(photo.url);
      }
    });
    
    setUploadModalVisible(false);
    setUploadedPhotos({});
    setDamagePhotos([]);
    setIsDamaged(false);
    setCurrentVehicleInfo(null);
    form.resetFields();
  };

  // 保存所有照片
  const handleSavePhotos = async () => {
    try {
      let value = await form.validateFields();
      console.log('...handleSavePhotos', value)
      
      // 检查是否有必填的验车照片
      if (Object.keys(uploadedPhotos).length === 0 && !currentVehicleInfo?.inspectionCarDTOS?.length) {
        message.warning('请至少上传一张验车照片');
        return;
      }

      message.loading('正在保存照片...', 0);
      
      // 这里可以调用API保存所有照片
      // 模拟保存延迟
      // await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(uploadedPhotos, 'uploadedPhotos');
      let inspectionCarDTOList:any = [];
      Object.values(uploadedPhotos).forEach((value: any) => {
        inspectionCarDTOList.push({
          anglePosition: value.anglePosition,
          fileUrl: value.fileUrl,
        })
      })
      let qualityDamageImgUrlList:any = [];
      Object.values(damagePhotos).forEach((value: any) => {
        qualityDamageImgUrlList.push(value.fileUrl);
      })
      await saveBatchInspectionApi({
        carId:currentVehicleId,
        inspectionCarDTOList,
        vin: value.vin,
        odometer: value.odometer,
        tmsWaybillNo: detailData?.waybillNo,
        productionDate: dayjs(value.productionDate).format('YYYY-MM-DD'),
        isQualityDamage: value.isQualityDamage ? 1 : 0,
        qualityDamageImgUrlList: qualityDamageImgUrlList,
        mileage: value.mileage,
      });
      
      message.destroy();
      message.success(`成功保存验车信息`);
      
      setUploadModalVisible(false);
      setUploadedPhotos({});
      setDamagePhotos([]);
      setIsDamaged(false);
      setCurrentVehicleInfo(null);
      form.resetFields();
      
      // 刷新数据
      fetchWaybillDetail();
      
    } catch (error) {
      message.destroy();
      message.error('保存照片失败');
      console.error('保存照片失败:', error);
    }
  };



  // 查看验车照片
  const handleViewPhotos = (vehicleId: string) => {
    const vehicleInfo = detailData?.carInfo?.find(car => car.id === vehicleId);
    if (vehicleInfo?.inspectionCarDTOS && vehicleInfo.inspectionCarDTOS.length > 0) {
      setCurrentViewPhotos(vehicleInfo.inspectionCarDTOS);
      setPhotoViewType('inspection');
      setPhotoViewModalVisible(true);
    } else {
      message.info('该车辆暂无验车照片');
    }
  };

  // 查看质损照片
  const handleViewDamagePhotos = (vehicleId: string) => {
    const vehicleInfo = detailData?.carInfo?.find(car => car.id === vehicleId);
    if (vehicleInfo?.qualityDamageImgUrlList && vehicleInfo.qualityDamageImgUrlList.length > 0) {
      // 转换质损照片格式以适配预览组件
      const damagePhotos = vehicleInfo.qualityDamageImgUrlList.map((url: string, index: number) => ({
        id: `damage_${index}`,
        fileUrl: url,
        anglePosition: '质损照片',
        createTime: vehicleInfo.createTime || new Date().toISOString()
      }));
      setCurrentViewPhotos(damagePhotos);
      setPhotoViewType('damage');
      setPhotoViewModalVisible(true);
    } else {
      message.info('该车辆暂无质损照片');
    }
  };

  // 预览照片
  const handlePreview = (url: string) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  // 删除照片
  const handleRemovePhoto = (photoName: string) => {
    // 清理URL对象
    if (uploadedPhotos[photoName]?.url) {
      URL.revokeObjectURL(uploadedPhotos[photoName].url);
    }
    
    // 更新状态
    setUploadedPhotos(prev => {
      const newPhotos = { ...prev };
      delete newPhotos[photoName];
      return newPhotos;
    });
    
    // 清除表单值
    form.setFieldValue(photoName, undefined);
    
    message.success('照片删除成功');
  };

  // 处理保单创建成功
  const handleInsuranceSuccess = () => {
    setSelectedRowKeys([]);
    fetchWaybillDetail();
  };

  // 关闭保单模态框
  const handleInsuranceModalClose = () => {
    setInsuranceModalVisible(false);
  };

  // 处理交车单上传
  const handleDeliveryDocSubmit = async () => {
    try {
      const values = await deliveryDocForm.validateFields();
      
      message.loading('正在提交交车单信息...', 0);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 实际API调用
      // await uploadDeliveryDocuments(values.selectedVins, {
      //   contactPerson: values.contactPerson,
      //   contactPhone: values.contactPhone,
      //   idCard: values.idCard,
      //   deliveryDocPhoto: values.deliveryDocPhoto,
      //   personVehiclePhoto: values.personVehiclePhoto
      // });
      
      message.destroy();
      message.success(`成功提交 ${values.selectedVins.length} 辆车的交车单信息`);
      
      setDeliveryDocModalVisible(false);
      setSelectedRowKeys([]);
      deliveryDocForm.resetFields();
      
      // 刷新数据
      fetchWaybillDetail();
      
    } catch (error: any) {
      message.destroy();
      if (error?.errorFields) {
        message.error('请填写完整信息');
      } else {
        message.error('交车单提交失败');
        console.error('交车单提交失败:', error);
      }
    }
  };

  // 关闭交车单模态框
  const handleDeliveryDocModalClose = () => {
    setDeliveryDocModalVisible(false);
    deliveryDocForm.resetFields();
  };



  // 批量操作
  const handleBatchOperation = async (operation: BatchOperationType) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择车辆');
      return;
    }

    // 如果是创建保单操作，显示保单弹窗
    if (operation === 'createInsurance') {
      setInsuranceModalVisible(true);
      return;
    }

    // 如果是上传交车单操作，显示交车单弹窗
    if (operation === 'uploadDeliveryDoc') {
      setDeliveryDocModalVisible(true);
      return;
    }

    try {
      const operationNames = {
        createInsurance: '创建保单',
        completePickup: '完成提车',
        vehicleArrival: '车辆到达',
        startTransport: '开始运输',
        cancelInsurance: '退保',
        uploadDeliveryDoc: '上传交车单',
        
      };

      // 为退保操作提供特殊的确认提示
      if (operation === 'cancelInsurance') {
        Modal.confirm({
          title: '确认退保操作',
          content: (
            <div>
              <p>请确认是否退保已选的车辆？</p>
              <p style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '8px' }}>
                ⚠️ 已选中 <strong>{selectedRowKeys.length}</strong> 辆车，退保后将无法恢复
              </p>
            </div>
          ),
          okText: '确认退保',
          cancelText: '取消',
          okType: 'danger',
          onOk: async () => {
            try {
              message.loading('正在处理退保操作...', 0);
              
              // 实际API调用
              // await batchOperateVehicles(selectedRowKeys as string[], operation);
              
              // 模拟操作延迟
              await new Promise(resolve => setTimeout(resolve, 1500));
              
              message.destroy();
              message.success(`成功退保 ${selectedRowKeys.length} 辆车`);
              setSelectedRowKeys([]);
              
              // 刷新数据
              fetchWaybillDetail();
            } catch (error) {
              message.destroy();
              message.error('退保操作失败');
              console.error('退保操作失败:', error);
            }
          }
        });
        return;
      }

      // 其他操作的通用确认对话框
      Modal.confirm({
        title: `确认${operationNames[operation]}`,
        content: `是否对选中的 ${selectedRowKeys.length} 辆车执行${operationNames[operation]}操作？`,
        onOk: async () => {
          // 实际API调用
          // await batchOperateVehicles(selectedRowKeys as string[], operation);
          
          // 模拟操作
          message.success(`${operationNames[operation]}操作成功`);
          setSelectedRowKeys([]);
        }
      });
    } catch (error) {
      message.error('批量操作失败');
    }
  };

  // 实际上传照片
  const handleUploadFile = async (file: File, photoName: string, photoLabel: string, anglePosition: string) => {
    try {
      message.loading(`正在上传${photoLabel}...`, 0);
      
      // 模拟上传成功，实际项目中这里调用真实API
     let res = await uploadFileApi({
        currentVehicleId,
        file,
      });
      console.log(res, 'upload');
      // // 模拟上传延迟
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 创建预览URL
      const previewUrl = URL.createObjectURL(file);
      
      // 更新上传状态
      setUploadedPhotos(prev => ({
        ...prev,
        [photoName]: {
          uid: Date.now().toString(),
          name: file.name,
          status: 'done',
          url: previewUrl,
          originFileObj: file,
          anglePosition: anglePosition,
          fileUrl: res.result.path,
        }
      }));
      
      // 更新表单值
      form.setFieldValue(photoName, [{
        uid: Date.now().toString(),
        name: file.name,
        status: 'done',
        url: previewUrl
      }]);
      
      message.destroy();
      message.success(`${photoLabel} 上传成功`);
      
    } catch (error) {
      message.destroy();
      message.error('照片上传失败');
      console.error('照片上传失败:', error);
    }
  };

  // 上传质损照片
  const handleUploadDamagePhoto = async (file: File) => {
    try {
      message.loading('正在上传质损照片...', 0);
      
      // // 模拟上传延迟
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      // // 创建预览URL
      const previewUrl = URL.createObjectURL(file);
      let res = await uploadFileApi({
        file,
      });
      
      const newPhoto = {
        uid: Date.now().toString(),
        name: file.name,
        status: 'done',
        url: previewUrl,
        originFileObj: file,
        fileUrl: res.result.path,
      };
      
      // 添加到质损照片列表
      setDamagePhotos(prev => [...prev, newPhoto]);
      
      message.destroy();
      message.success('质损照片上传成功');
      
    } catch (error) {
      message.destroy();
      message.error('质损照片上传失败');
      console.error('质损照片上传失败:', error);
    }
  };

  // 删除质损照片
  const handleRemoveDamagePhoto = (photoUid: string) => {
    // 清理URL对象
    const photoToRemove = damagePhotos.find(photo => photo.uid === photoUid);
    if (photoToRemove?.url) {
      URL.revokeObjectURL(photoToRemove.url);
    }
    
    // 从列表中移除
    setDamagePhotos(prev => prev.filter(photo => photo.uid !== photoUid));
    
    message.success('质损照片删除成功');
  };


  // 创建上传配置函数
  const createUploadProps = (photoName: string, photoLabel: string, anglePosition: any) => ({
    name: 'file',
    multiple: false,
    accept: 'image/*',
    showUploadList: false, // 不显示默认的上传列表
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件!');
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('图片大小不能超过10MB!');
        return false;
      }
      
      // 调用实际上传函数
      handleUploadFile(file, photoName, photoLabel, anglePosition);
      
      return false; // 阻止默认上传行为
    },
  });

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>加载中...</div>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className={styles.errorContainer}>
        <div>运单详情不存在</div>
        <Button type="primary" onClick={handleBack} style={{ marginTop: 16 }}>
          返回列表
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            style={{background:'transparent'}}
          >
            返回
          </Button>
          <h2>运单详情 - {detailData.waybillNo}</h2>
        </Space>
    
      </div>

      <Row gutter={8}>
        {/* 运单基本信息 */}
        <Col span={15}>
          <Card title="运单基本信息" className={styles.card}>
            <Descriptions column={1}>
              <Descriptions.Item label="运单号" span={1}>
                {detailData.waybillNo}
              </Descriptions.Item>
              <Descriptions.Item label="状态" span={1}>
                {getStatusTag(detailData.statusDesc)}
              </Descriptions.Item>
              <Descriptions.Item label="始发地" span={1}>
                {detailData.senderProvince}{detailData.senderCity}{detailData.senderAddress}
              </Descriptions.Item>
              <Descriptions.Item label="目的地" span={1}>
                {detailData.warehouseName}
              </Descriptions.Item>
              <Descriptions.Item label="下单时间" span={1}>
                { detailData.inWarehouseTimeStr ? dayjs(detailData.inWarehouseTimeStr).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="提车时间" span={1}>
                { detailData.pickupTimeStr ? dayjs(detailData.pickupTimeStr).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 订单宝信息 */}
        <Col span={9}>
          <Card title="订单宝信息" className={styles.card}>
            <Descriptions column={2}>
              <Descriptions.Item label="订单号" span={1}>
                {detailData?.orderDTO?.orderNo}
              </Descriptions.Item>
              <Descriptions.Item label="业务经理" span={1}>
                {detailData?.orderDTO?.managerName}
              </Descriptions.Item>
              <Descriptions.Item label="经销商" span={1}>
                {detailData?.orderDTO?.vendorName}
              </Descriptions.Item>
              <Descriptions.Item label="供应商" span={1}>
                {detailData?.orderDTO?.sellerName}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 客户信息 */}
        <Col span={6}>
          <Card title="客户信息" className={styles.card}>
            <Descriptions column={1}>
              <Descriptions.Item label="客户名">
                {detailData?.customerDTO?.name}
              </Descriptions.Item>
              <Descriptions.Item label="联系人">
                {detailData?.customerDTO?.contactName}
              </Descriptions.Item>
              <Descriptions.Item label="联系方式">
                {detailData.contactPhone}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 发车方联系方式 */}
        <Col span={9}>
          <Card title="发车方联系方式" className={styles.card}>
            <Descriptions column={1}>
              <Descriptions.Item label="提车联系人">
                {detailData.pickupContactName}
              </Descriptions.Item>
              <Descriptions.Item label="联系方式">
                {detailData.pickupContactPhone}
              </Descriptions.Item>
              <Descriptions.Item label="提车地址">
                {detailData.senderAddress}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 收车方联系方式 */}
        <Col span={9}>
          <Card title="收车方联系方式" className={styles.card}>
            <Descriptions column={1}>
              <Descriptions.Item label="库管" span={1}>
                {detailData?.wmsWarehouseDTO?.keeperName}
              </Descriptions.Item>
              <Descriptions.Item label="联系方式">
                {detailData?.wmsWarehouseDTO?.keeperPhone}
              </Descriptions.Item>
              <Descriptions.Item label="交车地址">
                {detailData?.wmsWarehouseDTO?.warehouseAddress}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 车辆信息 */}
        <Col span={24}>
          <Card 
            title={
              <Space>
                <CarOutlined />
                车辆信息
                <Tag color="blue">{detailData?.orderDTO?.carCount} 辆</Tag>
              </Space>
            } 
            className={styles.card}
            extra={
              <Space>
                <Button
                  type="primary"
                  icon={<FileProtectOutlined />}
                  onClick={() => handleBatchOperation('createInsurance')}
                  disabled={selectedRowKeys.length === 0}
                >
                  创建保单
                </Button>

                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleBatchOperation('cancelInsurance')}
                  disabled={selectedRowKeys.length === 0}
                >
                  退保
                </Button>
                <Button
                  icon={<FileTextOutlined />}
                  onClick={() => handleBatchOperation('uploadDeliveryDoc')}
                  disabled={selectedRowKeys.length === 0}
                >
                  上传交车单
                </Button>
              </Space>
            }
          >
            <Table
              rowSelection={rowSelection}
              columns={vehicleColumns}
              dataSource={detailData?.carInfo}
              rowKey="id"
              pagination={false}
              scroll={{ x: 1200 }}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      {/* 上传照片模态框 */}
      <Modal
        title="上传验车信息"
        open={uploadModalVisible}
        onCancel={handleCloseUploadModal}
        onOk={handleSavePhotos}
        okText="提交"
        cancelText="取消"
        width={1000}
        height={600}
        style={{overflowY: 'scroll'}}
        okButtonProps={{ 
          disabled: Object.keys(uploadedPhotos).length === 0 
        }}
        className={styles.uploadModal}
      >
         <Form
        form={form}
        layout="inline"
        requiredMark={false}
      >
          {/* 车辆基本信息回显 */}
          <Row gutter={8} style={{width: '100%'}} >
            <Col span={8}>
              <Form.Item label="车型">
                <Input 
                  value={currentVehicleInfo?.vehicleName} 
                  disabled 
                  style={{ background: '#f5f5f5' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="内外饰">
                <Input 
                  value={currentVehicleInfo?.outInColor} 
                  disabled 
                  style={{ background: '#f5f5f5' }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 验车信息录入 */}
          <Row gutter={8} style={{width: '100%'}}>
            <Col span={8}>
              <Form.Item
                name="vin"
                label="车架号"
                rules={[{ required: true, message: '请输入车架号' }]}
              >
                <Input 
                  placeholder="请输入车架号" 
                  maxLength={17}
                  defaultValue={currentVehicleInfo?.vin}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="productionDate"
                label="生产日期"
                rules={[{ required: true, message: '请选择生产日期' }]}
              >
                <DatePicker 
                  placeholder="请选择生产日期"
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current > dayjs().endOf('day')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="odometer"
                label="公里数(km)"
                rules={[
                  { required: true, message: '请输入公里数' },
                ]}
              >
                                 <Input
                   placeholder="请输入公里数"
                   maxLength={7}
                   onChange={e => {
                     // 只保留数字
                     const value = e.target.value.replace(/[^\d]/g, '');
                     form.setFieldsValue({ odometer: value });
                   }}
                 />
              </Form.Item>
            </Col>
          </Row>

          {/* 是否质损选择 */}
          <Row gutter={8} style={{width: '100%'}}>
            <Col span={24}>
              <Form.Item label="是否质损" labelCol={{span: 2}} name="isQualityDamage">
                <Radio.Group 
                  value={isDamaged} 
                  onChange={(e) => setIsDamaged(e.target.value)}
                  defaultValue={false}
                >
                  <Radio value={false}>否</Radio>
                  <Radio value={true}>是</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {/* 质损照片上传区域 */}
          {isDamaged && (
            <Row gutter={8} style={{width: '100%'}}>
              <Col span={24}>
                <Form.Item label="质损照片" labelCol={{span: 2}}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'flex-start' }}>
                    {/* 已上传的质损照片 */}
                    {damagePhotos.map((photo) => (
                      <div key={photo.uid} style={{ position: 'relative', border: '1px solid #d9d9d9', borderRadius: '6px' }}>
                        <img 
                          src={photo.url} 
                          alt="质损照片"
                          style={{ width: '104px', height: '104px', objectFit: 'cover', borderRadius: '6px' }}
                          onClick={() => handlePreview(photo.url)}
                        />
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          background: 'rgba(0, 0, 0, 0.5)',
                          borderRadius: '0 6px 0 6px',
                          padding: '4px'
                        }}>
                          <Button 
                            type="text" 
                            icon={<EyeOutlined />} 
                            size="small"
                            onClick={() => handlePreview(photo.url)}
                            style={{ color: 'white', padding: '0 4px', marginRight: '2px' }}
                          />
                          <Button 
                            type="text" 
                            icon={<DeleteOutlined />} 
                            size="small"
                            onClick={() => handleRemoveDamagePhoto(photo.uid)}
                            style={{ color: 'white', padding: '0 4px' }}
                          />
                        </div>
                      </div>
                    ))}
                    
                    {/* 上传按钮 */}
                    <Upload
                      name="file"
                      accept="image/*"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        const isImage = file.type.startsWith('image/');
                        if (!isImage) {
                          message.error('只能上传图片文件!');
                          return false;
                        }
                        const isLt10M = file.size / 1024 / 1024 < 10;
                        if (!isLt10M) {
                          message.error('图片大小不能超过10MB!');
                          return false;
                        }
                        
                        handleUploadDamagePhoto(file);
                        return false;
                      }}
                    >
                      <div style={{ 
                        width: '104px', 
                        height: '104px', 
                        border: '1px dashed #d9d9d9', 
                        borderRadius: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: '#fafafa'
                      }}>
                        <PlusOutlined style={{ fontSize: '20px', color: '#999' }} />
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>上传质损照片</div>
                      </div>
                    </Upload>
                  </div>
                  <div style={{ color: '#999', fontSize: '12px', marginTop: '8px' }}>
                    支持jpg、png格式，单个文件不超过10MB，可上传多张
                  </div>
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* 标准照片上传区域 */}
          <Row gutter={8} style={{width: '100%'}}>
            <Col span={24}>
              <Form.Item label="验车照片" labelCol={{span: 2}}>
                <div className={styles.photoGrid} style={{width: '100%'}}>
                  {photoList.map((photo, index) => (
                    <div key={photo.name} className={styles.photoItem}>
                      <Form.Item
                        name={photo.name}
                        rules={[{ required: false, message: `请上传${photo.label}` }]}
                      >
                        {uploadedPhotos[photo.name] ? (
                          // 显示已上传的图片
                          <div className={styles.uploadedPhoto}>
                            <img 
                              src={uploadedPhotos[photo.name].url} 
                              alt={photo.label}
                              style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }}
                              onClick={() => handlePreview(uploadedPhotos[photo.name].url)}
                            />
                            <div className={styles.photoActions}>
                              <Button 
                                type="text" 
                                icon={<EyeOutlined />} 
                                onClick={() => handlePreview(uploadedPhotos[photo.name].url)}
                                style={{ color: 'white' }}
                              />
                              <Button 
                                type="text" 
                                icon={<DeleteOutlined />} 
                                onClick={() => handleRemovePhoto(photo.name)}
                                style={{ color: 'white' }}
                              />
                            </div>
                          </div>
                        ) : (
                          // 显示上传按钮
                          <Upload
                            {...createUploadProps(photo.name, photo.label, photo.value )}
                            listType="picture-card"
                            maxCount={1}
                          >
                            <div>
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>点击上传{photo.label}</div>
                            </div>
                          </Upload>
                        )}
                      </Form.Item>
                    </div>
                  ))}
                </div>
              </Form.Item>
            </Col>
          </Row>
      </Form>
        
      </Modal>

      {/* 照片预览模态框 */}
      <Modal
        open={previewVisible}
        title="照片预览"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        <Image
          alt="照片预览"
          style={{ width: '100%' }}
          src={previewImage}
        />
      </Modal>



        {/* 创建保单模态框 */}
        <InsuranceModal
          visible={insuranceModalVisible}
          onCancel={handleInsuranceModalClose}
          selectedVehicles={detailData?.carInfo?.filter(vehicle => 
            selectedRowKeys.includes(vehicle.id)
          )}
          onSuccess={handleInsuranceSuccess}
          waybillNo={detailData.waybillNo}
        />

        {/* 上传交车单模态框 */}
        <Modal
          title="上传交车单"
          open={deliveryDocModalVisible}
          onCancel={handleDeliveryDocModalClose}
          onOk={handleDeliveryDocSubmit}
          okText="提交"
          cancelText="取消"
          width={600}
          className={styles.deliveryDocModal}
        >
          <div style={{ marginBottom: 16 }}>
            <p>可选车辆数量：<strong>{selectedRowKeys.length}</strong> 辆</p>
          </div>
          
          <Form
            form={deliveryDocForm}
            layout="inline"
            requiredMark={false}
          >
            {/* 车架号关联选择 */}
            <Form.Item 
              name="selectedVins"
              label="关联车架号"
              rules={[{ required: true, message: '请选择要上传交车单的车架号' }]}
              initialValue={detailData?.carInfo
                ?.filter(vehicle => selectedRowKeys.includes(vehicle.id))
                .map(vehicle => vehicle.vin)
              }
            >
              <Select
                mode="multiple"
                placeholder="请选择车架号"
                style={{ width: '450px' }}
                options={detailData?.vehicles
                  ?.filter(vehicle => selectedRowKeys.includes(vehicle.id))
                  .map(vehicle => ({
                    value: vehicle.vin,
                    label: `${vehicle.vin} (${vehicle.model})`,
                    key: vehicle.id
                  }))
                }
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="contactPerson"
                  label="交车联系人"
                  rules={[{ required: true, message: '请输入交车联系人' }]}
                >
                  <Input placeholder="请输入交车联系人" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="contactPhone"
                  label="联系电话"
                  rules={[
                    { required: true, message: '请输入联系电话' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                  ]}
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
            </Row>
            <Col span={24}>
              <Form.Item
                name="idCard"
                label="身份证号"
                rules={[
                  { required: true, message: '请输入身份证号' },
                  { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号码' }
                ]}
              >
                <Input placeholder="请输入身份证号码" />
              </Form.Item>
            </Col>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="deliveryDocPhoto"
                  label="交车单"
                  rules={[{ required: true, message: '请上传交车单照片' }]}
                >
                  <Upload
                    listType="picture-card"
                    maxCount={1}
                    accept="image/*"
                    beforeUpload={() => false}
                    onChange={({ fileList }) => {
                      deliveryDocForm.setFieldValue('deliveryDocPhoto', fileList);
                    }}
                  >
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>上传交车单</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="personVehiclePhoto"
                  label="人车照"
                  rules={[{ required: true, message: '请上传人车照' }]}
                >
                  <Upload
                    listType="picture-card"
                    maxCount={1}
                    accept="image/*"
                    beforeUpload={() => false}
                    onChange={({ fileList }) => {
                      deliveryDocForm.setFieldValue('personVehiclePhoto', fileList);
                    }}
                  >
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>上传人车照</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>


        {/* 照片预览模态框 */}
        <Modal
          title={
            <div>
              <span>{photoViewType === 'inspection' ? '验车照片预览' : '质损照片预览'}</span>
              <Tag color="blue" style={{ marginLeft: 8 }}>
                共 {currentViewPhotos.length} 张
              </Tag>
            </div>
          }
          open={photoViewModalVisible}
          onCancel={() => {
            setPhotoViewModalVisible(false);
            setCurrentViewPhotos([]);
          }}
          footer={[
            <Button key="close" onClick={() => {
              setPhotoViewModalVisible(false);
              setCurrentViewPhotos([]);
            }}>
              关闭
            </Button>
          ]}
          width={1200}
          className={styles.photoViewModal}
        >
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <Row gutter={[16, 16]}>
              {currentViewPhotos.map((photo, index) => {
                // 获取角度位置描述
                const getAngleDescription = (anglePosition: string) => {
                  const angleMap: { [key: string]: string } = {
                    '1': '左前45度照片',
                    '2': '左前门含A柱的照片',
                    '3': '左后门的照片',
                    '4': '后轮轮毂照片',
                    '5': '中控台照片',
                    '6': '仪表盘照片',
                    '7': '右后45度照片',
                    '8': '右前门含A柱的照片',
                    '9': '铭牌照片',
                    '10': '商品车入库信息采集表',
                    '11': '发动机舱'
                  };
                  return angleMap[anglePosition] || anglePosition || '未知位置';
                };

                return (
                  <Col key={photo.id || index} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      cover={
                        <div style={{ height: 200, overflow: 'hidden' }}>
                          <Image
                            alt={getAngleDescription(photo.anglePosition)}
                            src={'http://120.26.232.36'+photo.fileUrl}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }}
                            preview={{
                              mask: (
                                <div style={{ color: 'white', textAlign: 'center' }}>
                                  <EyeOutlined style={{ fontSize: 20 }} />
                                  <div style={{ marginTop: 4 }}>预览</div>
                                </div>
                              )
                            }}
                          />
                        </div>
                      }
                      size="small"
                    >
                      <Card.Meta
                        title={
                          <div style={{ fontSize: '12px', lineHeight: '16px' }}>
                            {getAngleDescription(photo.anglePosition)}
                          </div>
                        }
                        // description={
                        //   <div style={{ fontSize: '11px', color: '#999' }}>
                        //     {photo.createTime ? dayjs(photo.createTime).format('YYYY-MM-DD HH:mm:ss') : ''}
                        //   </div>
                        // }
                      />
                    </Card>
                  </Col>
                );
              })}
            </Row>
            
            {currentViewPhotos.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 0',
                color: '#999'
              }}>
                暂无照片
              </div>
            )}
          </div>
        </Modal>
      </div>
    );
  };

  export default WaybillDetail; 