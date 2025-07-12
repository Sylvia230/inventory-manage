import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import VehiclePhotoUpload from './index';
import type { UploadFile } from 'antd/es/upload/interface';

// 示例1：基本使用
export const BasicExample: React.FC = () => {
  const [photoData, setPhotoData] = useState<Record<string, UploadFile[]>>({});

  const handlePhotoChange = (value: Record<string, UploadFile[]>) => {
    setPhotoData(value);
    console.log('照片数据变化:', value);
  };

  const handleSubmit = () => {
    console.log('提交数据:', photoData);
    message.success('提交成功');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>基本使用示例</h2>
      <VehiclePhotoUpload
        value={photoData}
        onChange={handlePhotoChange}
        maxSize={10}
      />
      <Button type="primary" onClick={handleSubmit} style={{ marginTop: 16 }}>
        提交
      </Button>
    </div>
  );
};

// 示例2：带表单字段的使用
export const FormExample: React.FC = () => {
  const [photoData, setPhotoData] = useState<Record<string, UploadFile[]>>({});
  const [formData, setFormData] = useState<any>({});

  const handlePhotoChange = (value: Record<string, UploadFile[]>) => {
    setPhotoData(value);
  };

  const handleFormChange = (formValues: any) => {
    setFormData(formValues);
    console.log('表单数据变化:', formValues);
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      photos: photoData
    };
    console.log('提交数据:', submitData);
    message.success('提交成功');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>带表单字段的使用示例</h2>
      <VehiclePhotoUpload
        value={photoData}
        onChange={handlePhotoChange}
        showForm={true}
        onFormChange={handleFormChange}
        maxSize={10}
      />
      <Button type="primary" onClick={handleSubmit} style={{ marginTop: 16 }}>
        提交
      </Button>
    </div>
  );
};

// 示例3：自定义照片列表
export const CustomPhotoListExample: React.FC = () => {
  const [photoData, setPhotoData] = useState<Record<string, UploadFile[]>>({});

  // 自定义照片列表
  const customPhotoList = [
    { name: 'front', label: '前视图', value: '1', required: true },
    { name: 'back', label: '后视图', value: '2', required: true },
    { name: 'left', label: '左视图', value: '3', required: false },
    { name: 'right', label: '右视图', value: '4', required: false },
    { name: 'interior', label: '内饰', value: '5', required: false },
  ];

  const handlePhotoChange = (value: Record<string, UploadFile[]>) => {
    setPhotoData(value);
  };

  const handleSubmit = () => {
    console.log('提交数据:', photoData);
    message.success('提交成功');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>自定义照片列表示例</h2>
      <VehiclePhotoUpload
        photoList={customPhotoList}
        value={photoData}
        onChange={handlePhotoChange}
        maxSize={5}
      />
      <Button type="primary" onClick={handleSubmit} style={{ marginTop: 16 }}>
        提交
      </Button>
    </div>
  );
};

// 示例4：在Modal中使用
export const ModalExample: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [photoData, setPhotoData] = useState<Record<string, UploadFile[]>>({});
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = () => {
    const values = {
      ...formData,
      photos: photoData
    };
    console.log('提交数据:', values);
    message.success('提交成功');
    setVisible(false);
  };

  const handleCancel = () => {
    setPhotoData({});
    setFormData({});
    setVisible(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Modal中使用示例</h2>
      <Button type="primary" onClick={() => setVisible(true)}>
        打开上传弹窗
      </Button>

      <Modal
        title="上传车辆照片"
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={800}
      >
        <VehiclePhotoUpload
          value={photoData}
          onChange={setPhotoData}
          showForm={true}
          onFormChange={setFormData}
          maxSize={10}
        />
      </Modal>
    </div>
  );
};

// 示例5：禁用状态
export const DisabledExample: React.FC = () => {
  const [photoData, setPhotoData] = useState<Record<string, UploadFile[]>>({});

  const handlePhotoChange = (value: Record<string, UploadFile[]>) => {
    setPhotoData(value);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>禁用状态示例</h2>
      <VehiclePhotoUpload
        value={photoData}
        onChange={handlePhotoChange}
        disabled={true}
        maxSize={10}
      />
    </div>
  );
}; 