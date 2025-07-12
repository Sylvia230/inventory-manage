import React, { useState } from 'react';
import { Button, Modal, message, Space } from 'antd';
import VehiclePhotoUpload from './index';
import type { UploadFile } from 'antd/es/upload/interface';

// 模拟入库操作API
const mockInboundOperationApi = async (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('入库操作数据:', data);
      resolve({ success: true });
    }, 1000);
  });
};

const TestInboundComponent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [photoData, setPhotoData] = useState<Record<string, UploadFile[]>>({});
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [vehicleStatus, setVehicleStatus] = useState('待入库');

  const handlePhotoChange = (value: Record<string, UploadFile[]>) => {
    setPhotoData(value);
    console.log('照片数据变化:', value);
  };

  const handleFormChange = (formValues: any) => {
    setFormData(formValues);
    console.log('表单数据变化:', formValues);
  };

  // 模拟入库操作
  const handleInboundSubmit = async () => {
    try {
      setLoading(true);
      
      // 检查必填字段
      if (!formData.locationNo) {
        message.error('请输入车位号');
        return;
      }
      
      if (!formData.gpsDeviceId) {
        message.error('请选择GPS');
        return;
      }
      
      if (!formData.inboundTime) {
        message.error('请选择入库时间');
        return;
      }

      // 检查照片
      const photoCount = Object.keys(photoData).length;
      if (photoCount === 0) {
        message.error('请至少上传一张照片');
        return;
      }

      const submitData = {
        ...formData,
        photos: photoData,
        inboundTime: formData.inboundTime?.format('YYYY-MM-DD HH:mm:ss'),
      };

      // 调用入库API
      await mockInboundOperationApi(submitData);
      
      message.success('入库操作成功');
      
      // 更新车辆状态
      setVehicleStatus('已入库');
      
      // 清空数据
      setPhotoData({});
      setFormData({});
      setVisible(false);
      
    } catch (error) {
      message.error('入库操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPhotoData({});
    setFormData({});
    setVisible(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>测试入库操作成功后状态更新</h2>
      
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setVisible(true)}>
          打开入库操作弹窗
        </Button>
        <Button onClick={() => setVehicleStatus('待入库')}>
          重置车辆状态
        </Button>
      </Space>

      <div style={{ marginBottom: 16 }}>
        <strong>当前车辆状态：</strong>
        <span style={{ 
          color: vehicleStatus === '已入库' ? '#52c41a' : '#faad14',
          fontWeight: 'bold',
          marginLeft: 8
        }}>
          {vehicleStatus}
        </span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <strong>当前数据状态：</strong>
        <div>照片数量: {Object.keys(photoData).length}</div>
        <div>表单数据: {JSON.stringify(formData)}</div>
      </div>

      <Modal
        title="入库操作"
        open={visible}
        onCancel={handleCancel}
        onOk={handleInboundSubmit}
        confirmLoading={loading}
        width={1000}
        bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
      >
        <div style={{ marginBottom: 16 }}>
          <h4>车辆信息</h4>
          <div>车架号：LVGBE40K8GP123456</div>
          <div>车型：奥迪 A4L 2024款</div>
          <div>外观/内饰：白色 / 黑色</div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <h4>入库信息</h4>
          <Space>
            <input 
              placeholder="车位号" 
              value={formData.locationNo || ''} 
              onChange={(e) => setFormData((prev: any) => ({ ...prev, locationNo: e.target.value }))}
              style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
            />
            <select 
              value={formData.gpsDeviceId || ''} 
              onChange={(e) => setFormData((prev: any) => ({ ...prev, gpsDeviceId: e.target.value }))}
              style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
            >
              <option value="">选择GPS</option>
              <option value="gps1">GPS设备001</option>
              <option value="gps2">GPS设备002</option>
              <option value="gps3">GPS设备003</option>
            </select>
            <input 
              type="datetime-local" 
              value={formData.inboundTime || ''} 
              onChange={(e) => setFormData((prev: any) => ({ ...prev, inboundTime: e.target.value }))}
              style={{ padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
            />
          </Space>
        </div>

        <div>
          <h4>验车照片</h4>
          <VehiclePhotoUpload
            value={photoData}
            onChange={handlePhotoChange}
            maxSize={10}
            accept="image/*"
          />
        </div>
      </Modal>
    </div>
  );
};

export default TestInboundComponent; 