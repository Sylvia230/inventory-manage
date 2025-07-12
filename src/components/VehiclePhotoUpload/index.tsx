import React, { useState, useEffect } from 'react';
import { Upload, Button, message, Modal, Image, Space, Form, DatePicker, Radio } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { uploadFileApi } from '@/services/waybill';
import styles from './index.module.less';

// 车辆照片类型定义
export interface VehiclePhotoItem {
  name: string;
  label: string;
  value: string;
  required?: boolean;
}

// 扩展的UploadFile类型
interface ExtendedUploadFile extends UploadFile {
  anglePosition?: string;
  fileUrl?: string;
}

// 组件Props
interface VehiclePhotoUploadProps {
  photoList?: VehiclePhotoItem[];
  value?: Record<string, UploadFile[]>;
  onChange?: (value: Record<string, UploadFile[]>) => void;
  maxSize?: number; // 最大文件大小，单位MB
  accept?: string; // 接受的文件类型
  disabled?: boolean;
  showForm?: boolean; // 是否显示表单字段（生产日期、关单/合格证）
  onFormChange?: (formData: any) => void; // 表单数据变化回调
}

// 默认的11张标准验车照片
const DEFAULT_PHOTO_LIST: VehiclePhotoItem[] = [
  { name: 'leftFront45', label: '左前45度照片', value: '1', required: true },
  { name: 'leftFrontDoor', label: '左前门含A柱的照片', value: '2', required: true },
  { name: 'leftRearDoor', label: '左后门的照片', value: '3', required: true },
  { name: 'rearWheel', label: '后轮轮毂照片', value: '4', required: true },
  { name: 'centerConsole', label: '中控台照片', value: '5', required: true },
  { name: 'dashboard', label: '仪表盘照片', value: '6', required: true },
  { name: 'rightRear45', label: '右后45度照片', value: '7', required: true },
  { name: 'rightFrontDoor', label: '右前门含A柱的照片', value: '8', required: true },
  { name: 'nameplate', label: '铭牌照片', value: '9', required: true },
  { name: 'inventoryForm', label: '商品车入库信息采集表', value: '10', required: true },
  { name: 'engineBay', label: '发动机舱', value: '11', required: true },
];

const VehiclePhotoUpload: React.FC<VehiclePhotoUploadProps> = ({
  photoList = DEFAULT_PHOTO_LIST,
  value = {},
  onChange,
  maxSize = 10, // 默认10MB
  accept = 'image/*',
  disabled = false,
  showForm = false,
  onFormChange,
}) => {
  const [form] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<{[key: string]: ExtendedUploadFile}>({});

  // 监听外部value变化，同步内部状态
  useEffect(() => {
    if (Object.keys(value).length === 0) {
      // 如果外部value为空，清空内部状态
      setUploadedPhotos({});
    }
  }, [value]);

  // 处理文件上传前的验证
  const beforeUpload = (file: File, photoName: string) => {
    // 检查文件类型
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件！');
      return false;
    }

    // 检查文件大小
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      message.error(`图片大小不能超过 ${maxSize}MB！`);
      return false;
    }

    return true;
  };

  // 实际上传照片
  const handleUploadFile = async (file: File, photoName: string, photoLabel: string, anglePosition: string) => {
    try {
      message.loading(`正在上传${photoLabel}...`, 0);
      
      // 调用上传API
      const res = await uploadFileApi({ file });
      console.log('上传结果:', res);
      
      // 创建预览URL
      const previewUrl = URL.createObjectURL(file);
      
      // 更新上传状态
      const newPhotoData: ExtendedUploadFile = {
        uid: Date.now().toString(),
        name: file.name,
        status: 'done',
        url: previewUrl,
        originFileObj: file as any, // 类型转换
        anglePosition: anglePosition,
        fileUrl: res.result.path,
      };
      
      setUploadedPhotos(prev => ({
        ...prev,
        [photoName]: newPhotoData
      }));
      
      // 更新表单值
      const newValue = {
        ...value,
        [photoName]: [newPhotoData]
      };
      onChange?.(newValue);
      
      message.destroy();
      message.success(`${photoLabel} 上传成功`);
      
    } catch (error) {
      message.destroy();
      message.error('照片上传失败');
      console.error('照片上传失败:', error);
    }
  };

  // 处理文件删除
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
    
    // 更新表单值
    const newValue = {
      ...value,
      [photoName]: []
    };
    onChange?.(newValue);
    
    message.success('照片删除成功');
  };

  // 预览图片
  const handlePreview = (url: string, title: string = '照片预览') => {
    setPreviewImage(url);
    setPreviewTitle(title);
    setPreviewVisible(true);
  };

  // 创建上传配置函数
  const createUploadProps = (photoName: string, photoLabel: string, anglePosition: string) => ({
    name: 'file',
    multiple: false,
    accept: accept,
    showUploadList: false, // 不显示默认的上传列表
    beforeUpload: (file: File) => {
      if (!beforeUpload(file, photoName)) {
        return false;
      }
      
      // 调用实际上传函数
      handleUploadFile(file, photoName, photoLabel, anglePosition);
      
      return false; // 阻止默认上传行为
    },
  });

  // 处理表单变化
  const handleFormChange = (changedValues: any, allValues: any) => {
    onFormChange?.(allValues);
  };

  return (
    <div className={styles.vehiclePhotoUpload}>

      {/* 照片上传区域 */}
      <div className={styles.photoGrid}>
        {photoList.map((photo) => (
          <div key={photo.name} className={styles.photoItem}>
            {/* <div className={styles.photoLabel}>
              {photo.label}
              {photo.required && <span className={styles.required}>*</span>}
            </div> */}
            
            {uploadedPhotos[photo.name] ? (
              // 显示已上传的图片
              <div className={styles.uploadedPhoto}>
                <img 
                  src={uploadedPhotos[photo.name].url} 
                  alt={photo.label}
                  style={{ width: '200px', height: '140px', objectFit: 'cover', borderRadius: '6px' }}
                  onClick={() => handlePreview(uploadedPhotos[photo.name].url || '', photo.label)}
                />
                <div className={styles.photoActions}>
                  <Button 
                    type="text" 
                    icon={<EyeOutlined />} 
                    onClick={() => handlePreview(uploadedPhotos[photo.name].url || '', photo.label)}
                    style={{ color: 'white' }}
                  />
                  <Button 
                    type="text" 
                    icon={<DeleteOutlined />} 
                    onClick={() => handleRemovePhoto(photo.name)}
                    style={{ color: 'white' }}
                    disabled={disabled}
                  />
                </div>
              </div>
            ) : (
              // 显示上传按钮
              <Upload
                {...createUploadProps(photo.name, photo.label, photo.value)}
                listType="picture-card"
                maxCount={1}
                disabled={disabled}
                className={styles.upload}
              >
                <div className={styles.uploadButton}>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>点击上传{photo.label}</div>
                </div>
              </Upload>
            )}
          </div>
        ))}
      </div>

      {/* 图片预览模态框 */}
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
    </div>
  );
};

export default VehiclePhotoUpload; 