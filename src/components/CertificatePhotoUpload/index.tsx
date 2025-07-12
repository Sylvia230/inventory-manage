import React, { useState } from 'react';
import { Upload, Button, message, Modal, Image, Space, Form } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { uploadFileApi } from '@/services/waybill';
import styles from './index.module.less';

// 证件照片类型定义
export interface CertificatePhotoItem {
  uid: string;
  name: string;
  url: string;
  fileUrl?: string;
  type: 'registration' | 'certificate'; // 登记证或合格证
}

// 组件Props
interface CertificatePhotoUploadProps {
  value?: CertificatePhotoItem[];
  onChange?: (value: CertificatePhotoItem[]) => void;
  maxSize?: number; // 最大文件大小，单位MB
  accept?: string; // 接受的文件类型
  disabled?: boolean;
  type: 'registration' | 'certificate'; // 证件类型
  title: string; // 标题
}

const CertificatePhotoUpload: React.FC<CertificatePhotoUploadProps> = ({
  value = [],
  onChange,
  maxSize = 10, // 默认10MB
  accept = 'image/*',
  disabled = false,
  type,
  title,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  // 处理文件上传前的验证
  const beforeUpload = (file: File) => {
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
  const handleUploadFile = async (file: File) => {
    try {
      message.loading(`正在上传${title}...`, 0);
      
      // 调用上传API
      const res = await uploadFileApi({ file });
      console.log('上传结果:', res);
      
      // 创建预览URL
      const previewUrl = URL.createObjectURL(file);
      
      // 创建新的照片项
      const newPhotoItem: CertificatePhotoItem = {
        uid: Date.now().toString(),
        name: file.name,
        url: previewUrl,
        fileUrl: res.result.path,
        type: type,
      };
      
      // 更新照片列表
      const newValue = [...value, newPhotoItem];
      onChange?.(newValue);
      
      message.destroy();
      message.success(`${title} 上传成功`);
      
    } catch (error) {
      message.destroy();
      message.error('照片上传失败');
      console.error('照片上传失败:', error);
    }
  };

  // 处理文件删除
  const handleRemovePhoto = (uid: string) => {
    // 清理URL对象
    const photoToRemove = value.find(photo => photo.uid === uid);
    if (photoToRemove?.url) {
      URL.revokeObjectURL(photoToRemove.url);
    }
    
    // 更新照片列表
    const newValue = value.filter(photo => photo.uid !== uid);
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
  const createUploadProps = () => ({
    name: 'file',
    multiple: false,
    accept: accept,
    showUploadList: false, // 不显示默认的上传列表
    beforeUpload: (file: File) => {
      if (!beforeUpload(file)) {
        return false;
      }
      
      // 调用实际上传函数
      handleUploadFile(file);
      
      return false; // 阻止默认上传行为
    },
  });

  return (
    <div className={styles.certificatePhotoUpload}>
      <div className={styles.uploadHeader}>
        <h4>{title}</h4>
        <Upload {...createUploadProps()} disabled={disabled}>
          <Button icon={<PlusOutlined />} disabled={disabled}>
            上传{title}
          </Button>
        </Upload>
      </div>

      {/* 照片列表 */}
      <div className={styles.photoList}>
        {value.map((photo) => (
          <div key={photo.uid} className={styles.photoItem}>
            <div className={styles.photoWrapper}>
              <img 
                src={photo.url} 
                alt={photo.name}
                style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                onClick={() => handlePreview(photo.url, photo.name)}
              />
              <div className={styles.photoActions}>
                <Button 
                  type="text" 
                  icon={<EyeOutlined />} 
                  onClick={() => handlePreview(photo.url, photo.name)}
                  style={{ color: 'white' }}
                />
                <Button 
                  type="text" 
                  icon={<DeleteOutlined />} 
                  onClick={() => handleRemovePhoto(photo.uid)}
                  style={{ color: 'white' }}
                  disabled={disabled}
                />
              </div>
            </div>
            <div className={styles.photoName}>{photo.name}</div>
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

export default CertificatePhotoUpload; 