import React, { useState } from 'react';
import { Button, Space, message } from 'antd';
import CertificatePhotoUpload from './index';
import type { CertificatePhotoItem } from './index';

const CertificatePhotoExample: React.FC = () => {
  const [registrationPhotos, setRegistrationPhotos] = useState<CertificatePhotoItem[]>([]);
  const [certificatePhotos, setCertificatePhotos] = useState<CertificatePhotoItem[]>([]);

  const handleRegistrationChange = (value: CertificatePhotoItem[]) => {
    setRegistrationPhotos(value);
    console.log('登记证照片变化:', value);
  };

  const handleCertificateChange = (value: CertificatePhotoItem[]) => {
    setCertificatePhotos(value);
    console.log('合格证照片变化:', value);
  };

  const handleSubmit = () => {
    const submitData = {
      registrationPhotos,
      certificatePhotos,
    };
    console.log('提交数据:', submitData);
    message.success('提交成功');
  };

  const handleClear = () => {
    setRegistrationPhotos([]);
    setCertificatePhotos([]);
    message.success('数据已清空');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>证件照片上传示例</h2>
      
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleSubmit}>
          提交
        </Button>
        <Button onClick={handleClear}>
          清空
        </Button>
      </Space>

      <div style={{ marginBottom: 16 }}>
        <strong>当前数据状态：</strong>
        <div>登记证照片数量: {registrationPhotos.length}</div>
        <div>合格证照片数量: {certificatePhotos.length}</div>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h3>登记证照片</h3>
          <CertificatePhotoUpload
            value={registrationPhotos}
            onChange={handleRegistrationChange}
            maxSize={10}
            accept="image/*"
            type="registration"
            title="登记证照片"
          />
        </div>

        <div style={{ flex: 1 }}>
          <h3>合格证照片</h3>
          <CertificatePhotoUpload
            value={certificatePhotos}
            onChange={handleCertificateChange}
            maxSize={10}
            accept="image/*"
            type="certificate"
            title="合格证照片"
          />
        </div>
      </div>
    </div>
  );
};

export default CertificatePhotoExample; 