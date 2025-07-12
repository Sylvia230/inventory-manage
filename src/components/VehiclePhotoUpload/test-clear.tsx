import React, { useState } from 'react';
import { Button, Space, message } from 'antd';
import VehiclePhotoUpload from './index';
import type { UploadFile } from 'antd/es/upload/interface';

const TestClearComponent: React.FC = () => {
  const [photoData, setPhotoData] = useState<Record<string, UploadFile[]>>({});
  const [formData, setFormData] = useState<any>({});

  const handlePhotoChange = (value: Record<string, UploadFile[]>) => {
    setPhotoData(value);
    console.log('照片数据变化:', value);
  };

  const handleFormChange = (formValues: any) => {
    setFormData(formValues);
    console.log('表单数据变化:', formValues);
  };

  // 清空所有数据
  const handleClear = () => {
    setPhotoData({});
    setFormData({});
    message.success('数据已清空');
  };

  // 模拟提交成功
  const handleSubmit = () => {
    console.log('提交数据:', { photos: photoData, form: formData });
    message.success('提交成功，正在清空数据...');
    
    // 模拟API调用延迟
    setTimeout(() => {
      handleClear();
    }, 1000);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>测试清空功能</h2>
      
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleSubmit}>
          提交并清空
        </Button>
        <Button onClick={handleClear}>
          手动清空
        </Button>
      </Space>

      <div style={{ marginBottom: 16 }}>
        <strong>当前数据状态：</strong>
        <div>照片数量: {Object.keys(photoData).length}</div>
        <div>表单数据: {JSON.stringify(formData)}</div>
      </div>

      <VehiclePhotoUpload
        value={photoData}
        onChange={handlePhotoChange}
        showForm={true}
        onFormChange={handleFormChange}
        maxSize={10}
      />
    </div>
  );
};

export default TestClearComponent; 