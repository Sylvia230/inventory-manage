import React, { useState } from 'react';
import { Upload, Button, message, Modal, Image, Space } from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import styles from './index.module.less';

// 照片类型定义
export interface PhotoItem {
  name: string;
  label: string;
  required?: boolean;
}

// 组件Props
interface PhotoUploadProps {
  photoList: PhotoItem[];
  value?: Record<string, UploadFile[]>;
  onChange?: (value: Record<string, UploadFile[]>) => void;
  maxSize?: number; // 最大文件大小，单位MB
  accept?: string; // 接受的文件类型
  disabled?: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photoList,
  value = {},
  onChange,
  maxSize = 10, // 默认10MB
  accept = 'image/*',
  disabled = false,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

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

  // 处理文件上传
  const handleUpload = (info: any, photoName: string) => {
    const { fileList } = info;
    
    // 限制每个照片类型只能上传一张
    const limitedFileList = fileList.slice(-1);
    
    const newValue = {
      ...value,
      [photoName]: limitedFileList,
    };
    
    onChange?.(newValue);
  };

  // 处理文件删除
  const handleRemove = (photoName: string) => {
    const newValue = {
      ...value,
      [photoName]: [],
    };
    onChange?.(newValue);
  };

  // 预览图片
  const handlePreview = (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  // 上传按钮
  const uploadButton = (
    <div className={styles.uploadButton}>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  return (
    <div className={styles.photoUpload}>
      <div className={styles.photoGrid}>
        {photoList.map((photo) => (
          <div key={photo.name} className={styles.photoItem}>
            <div className={styles.photoLabel}>
              {photo.label}
              {photo.required && <span className={styles.required}>*</span>}
            </div>
            
            <Upload
              listType="picture-card"
              fileList={value[photo.name] || []}
              beforeUpload={(file) => beforeUpload(file, photo.name)}
              onChange={(info) => handleUpload(info, photo.name)}
              onPreview={handlePreview}
              onRemove={() => handleRemove(photo.name)}
              accept={accept}
              disabled={disabled}
              className={styles.upload}
            >
              {(value[photo.name]?.length || 0) < 1 && uploadButton}
            </Upload>
            
            {value[photo.name]?.length > 0 && (
              <div className={styles.photoActions}>
                <Space>
                  <Button
                    type="link"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handlePreview(value[photo.name][0])}
                  >
                    预览
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove(photo.name)}
                    disabled={disabled}
                  >
                    删除
                  </Button>
                </Space>
              </div>
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

export default PhotoUpload; 