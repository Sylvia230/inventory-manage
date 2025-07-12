import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, message, Tabs } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import VehiclePhotoUpload from '@/components/VehiclePhotoUpload';
import CertificatePhotoUpload from '@/components/CertificatePhotoUpload';
import type { CertificatePhotoItem } from '@/components/CertificatePhotoUpload';
import styles from './index.module.less';
import { getGpsListApi } from '@/services/wareHouse';

const { Option } = Select;

interface InboundOperationModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  vehicleData?: any;
  gpsOptions?: Array<{ id: string; name: string }>;
  data?: any;
}

// 11张标准验车照片
const PHOTO_LIST: any[] = [
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

const InboundOperationModal: React.FC<InboundOperationModalProps> = ({
  visible,
  onCancel,
  onOk,
  vehicleData,
  gpsOptions = [],
  data
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<Record<string, UploadFile[]>>({});
  const [registrationPhotos, setRegistrationPhotos] = useState<CertificatePhotoItem[]>([]);
  const [certificatePhotos, setCertificatePhotos] = useState<CertificatePhotoItem[]>([]);
  const [gpsList, setGpsList] = useState<any[]>([]);
  const [photoUploadKey, setPhotoUploadKey] = useState(0); // 用于强制重新渲染照片上传组件

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 检查必填照片是否已上传
      const missingPhotos = PHOTO_LIST.filter(photo => 
        photo.required && (!photos[photo.name] || photos[photo.name].length === 0)
      );

      if (missingPhotos.length > 0) {
        message.error(`请上传以下必填照片：${missingPhotos.map(p => p.label).join('、')}`);
        return;
      }

      console.log(photos, 'uploadedPhotos');
      let inspectionCarDTOList: any = [];
      Object.values(photos).forEach((value: any) => {
        if (value && value.length > 0) {
          inspectionCarDTOList.push({
            anglePosition: Number(value[0].anglePosition),
            fileUrl: value[0].fileUrl,
            type: 2
          });
        }
      });

      // 处理登记证照片
      const registerCertUrl: any = [];
      registrationPhotos?.forEach(photo => {
        registerCertUrl.push(photo.fileUrl);
      });

      // 处理合格证照片
      const conformityCertUrl: any = [];
      certificatePhotos?.forEach(photo => {
        conformityCertUrl.push(photo.fileUrl);
      });

      const submitData = {
        carId: vehicleData?.carId,
        locationNo: values.locationNo,
        gpsDeviceId: values.gpsDeviceId,
        inspectionCarDTOList,
        registerCertUrl,
        conformityCertUrl,
        inboundId: data?.id,
        inboundNo: data?.inboundNo,
        vehicleId: vehicleData?.id,
        inboundTime: values.inboundTime?.format('YYYY-MM-DD HH:mm:ss'),
      };

      console.log(submitData, 'submitData');
      // 调用入库操作API
      await onOk(submitData);
      message.success('入库操作成功');
      
      // 清空所有数据
      handleReset();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('提交失败，请重试');
      }
    } finally {
      setLoading(false);
    }
  };

  // 重置所有数据
  const handleReset = () => {
    form.resetFields();
    setPhotos({});
    setRegistrationPhotos([]);
    setCertificatePhotos([]);
    setPhotoUploadKey(prev => prev + 1); // 强制重新渲染照片上传组件
    onCancel();
  };

  // 处理取消
  const handleCancel = () => {
    handleReset();
  };

  // 处理照片变化
  const handlePhotosChange = (newPhotos: Record<string, UploadFile[]>) => {
    console.log(newPhotos, 'newPhotos');
    setPhotos(newPhotos);
  };

  // 获取GPS
  const getGpsList = async () => {
    const res:any = await getGpsListApi({});
    console.log(res, 'getGpsList');
    setGpsList(res?.result || []);

  };

  useEffect(() => {
    getGpsList();
  }, []);

  return (
    <Modal
      title="入库操作"
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={1000}
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
    >
      <Form
        form={form}
        layout="inline"
        className={styles.form}
      >
        {/* 车辆信息展示 */}
        {vehicleData && (
          <div className={styles.vehicleInfo}>
            <h4>车辆信息</h4>
            <div className={styles.vehicleDetails}>
              <span>车架号：{vehicleData.vin}</span>
              <span>车型：{vehicleData.brand} {vehicleData.series} {vehicleData.vehicleName}</span>
              <span>外观/内饰：{vehicleData.exterior} / {vehicleData.interior}</span>
            </div>
          </div>
        )}

        {/* 入库信息 */}
        <div className={styles.inboundInfo}>
          <h4>入库信息</h4>
          
          <Form.Item
            name="locationNo"
            label="车位号"
            rules={[{ required: true, message: '请输入车位号' }]}
          >
            <Input placeholder="请输入车位号" />
          </Form.Item>

          <Form.Item
            name="gpsDeviceId"
            label="选择GPS"
            rules={[{ required: true, message: '请选择GPS' }]}
          >
            <Select placeholder="请选择GPS">
              {gpsList.map(gps => (
                <Option key={gps.id} value={gps.id}>
                  {gps.simNo}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="inboundTime"
            label="入库时间"
            rules={[{ required: true, message: '请选择入库时间' }]}
          >
            <DatePicker
              showTime
              style={{ width: '100%' }}
              placeholder="请选择入库时间"
            />
          </Form.Item>
        </div>
      </Form>
        {/* 照片上传 */}
        <div className={styles.photoSection}>
          <Tabs
            items={[
              {
                key: 'inspection',
                label: '验车照片',
                children: (
                  <VehiclePhotoUpload
                    key={photoUploadKey} // 使用key强制重新渲染
                    photoList={PHOTO_LIST}
                    value={photos}
                    onChange={handlePhotosChange}
                    maxSize={10}
                    accept="image/*"
                  />
                ),
              },
              {
                key: 'registration',
                label: '登记证照片',
                children: (
                  <CertificatePhotoUpload
                    value={registrationPhotos}
                    onChange={setRegistrationPhotos}
                    maxSize={10}
                    accept="image/*"
                    type="registration"
                    title="登记证照片"
                  />
                ),
              },
              {
                key: 'certificate',
                label: '合格证照片',
                children: (
                  <CertificatePhotoUpload
                    value={certificatePhotos}
                    onChange={setCertificatePhotos}
                    maxSize={10}
                    accept="image/*"
                    type="certificate"
                    title="合格证照片"
                  />
                ),
              },
            ]}
          />
        </div>
    </Modal>
  );
};

export default InboundOperationModal; 