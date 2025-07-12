# VehiclePhotoUpload 车辆照片上传组件

这是一个通用的车辆照片上传组件，支持11张标准验车照片的上传、预览和删除功能。

## 功能特性

- ✅ 支持11张标准验车照片上传
- ✅ 照片预览和删除功能
- ✅ 文件格式和大小验证
- ✅ 可选的表单字段（生产日期、关单/合格证）
- ✅ 响应式布局
- ✅ 完全可配置的照片列表
- ✅ 支持禁用状态

## 基本用法

```tsx
import VehiclePhotoUpload from '@/components/VehiclePhotoUpload';

// 基本使用
<VehiclePhotoUpload
  value={photoData}
  onChange={handlePhotoChange}
  maxSize={10}
/>

// 带表单字段的使用
<VehiclePhotoUpload
  value={photoData}
  onChange={handlePhotoChange}
  showForm={true}
  onFormChange={handleFormChange}
  maxSize={10}
/>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| photoList | 照片列表配置 | `VehiclePhotoItem[]` | 默认11张标准照片 |
| value | 当前照片数据 | `Record<string, UploadFile[]>` | `{}` |
| onChange | 照片数据变化回调 | `(value: Record<string, UploadFile[]>) => void` | - |
| maxSize | 最大文件大小（MB） | `number` | `10` |
| accept | 接受的文件类型 | `string` | `'image/*'` |
| disabled | 是否禁用 | `boolean` | `false` |
| showForm | 是否显示表单字段 | `boolean` | `false` |
| onFormChange | 表单数据变化回调 | `(formData: any) => void` | - |

### VehiclePhotoItem

```tsx
interface VehiclePhotoItem {
  name: string;        // 照片名称（唯一标识）
  label: string;       // 显示标签
  value: string;       // 角度位置值
  required?: boolean;  // 是否必填
}
```

### 默认照片列表

```tsx
const DEFAULT_PHOTO_LIST = [
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
```

## 使用示例

### 1. 基本使用

```tsx
import React, { useState } from 'react';
import VehiclePhotoUpload from '@/components/VehiclePhotoUpload';
import type { UploadFile } from 'antd/es/upload/interface';

const MyComponent: React.FC = () => {
  const [photoData, setPhotoData] = useState<Record<string, UploadFile[]>>({});

  const handlePhotoChange = (value: Record<string, UploadFile[]>) => {
    setPhotoData(value);
  };

  return (
    <VehiclePhotoUpload
      value={photoData}
      onChange={handlePhotoChange}
      maxSize={10}
    />
  );
};
```

### 2. 带表单字段的使用

```tsx
import React, { useState } from 'react';
import VehiclePhotoUpload from '@/components/VehiclePhotoUpload';
import type { UploadFile } from 'antd/es/upload/interface';

const MyComponent: React.FC = () => {
  const [photoData, setPhotoData] = useState<Record<string, UploadFile[]>>({});
  const [formData, setFormData] = useState<any>({});

  const handlePhotoChange = (value: Record<string, UploadFile[]>) => {
    setPhotoData(value);
  };

  const handleFormChange = (formValues: any) => {
    setFormData(formValues);
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      photos: photoData
    };
    console.log('提交数据:', submitData);
  };

  return (
    <div>
      <VehiclePhotoUpload
        value={photoData}
        onChange={handlePhotoChange}
        showForm={true}
        onFormChange={handleFormChange}
        maxSize={10}
      />
      <button onClick={handleSubmit}>提交</button>
    </div>
  );
};
```

### 3. 自定义照片列表

```tsx
import React, { useState } from 'react';
import VehiclePhotoUpload from '@/components/VehiclePhotoUpload';
import type { VehiclePhotoItem } from '@/components/VehiclePhotoUpload';

const MyComponent: React.FC = () => {
  const [photoData, setPhotoData] = useState<Record<string, UploadFile[]>>({});

  // 自定义照片列表
  const customPhotoList: VehiclePhotoItem[] = [
    { name: 'front', label: '前视图', value: '1', required: true },
    { name: 'back', label: '后视图', value: '2', required: true },
    { name: 'left', label: '左视图', value: '3', required: false },
    { name: 'right', label: '右视图', value: '4', required: false },
  ];

  const handlePhotoChange = (value: Record<string, UploadFile[]>) => {
    setPhotoData(value);
  };

  return (
    <VehiclePhotoUpload
      photoList={customPhotoList}
      value={photoData}
      onChange={handlePhotoChange}
      maxSize={5}
    />
  );
};
```

### 4. 在Modal中使用

```tsx
import React, { useState } from 'react';
import { Modal } from 'antd';
import VehiclePhotoUpload from '@/components/VehiclePhotoUpload';
import type { UploadFile } from 'antd/es/upload/interface';

const UploadModal: React.FC<{
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
}> = ({ visible, onCancel, onOk }) => {
  const [photoData, setPhotoData] = useState<Record<string, UploadFile[]>>({});
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = () => {
    const values = {
      ...formData,
      photos: photoData
    };
    onOk(values);
  };

  const handleCancel = () => {
    setPhotoData({});
    setFormData({});
    onCancel();
  };

  return (
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
  );
};
```

## 注意事项

1. 组件内部使用了 `uploadFileApi` 进行文件上传，请确保该API已正确配置
2. 照片数据格式为 `Record<string, UploadFile[]>`，其中key为照片名称
3. 组件支持响应式布局，在不同屏幕尺寸下会自动调整
4. 文件大小限制默认为10MB，可通过 `maxSize` 属性调整
5. 支持的文件格式默认为所有图片格式，可通过 `accept` 属性调整

## 清空数据

当需要清空组件数据时，可以通过以下方式：

### 方式1：通过value属性清空
```tsx
const [photoData, setPhotoData] = useState<Record<string, UploadFile[]>>({});

// 清空数据
const handleClear = () => {
  setPhotoData({});
};

<VehiclePhotoUpload
  value={photoData}
  onChange={handlePhotoChange}
/>
```

### 方式2：使用key强制重新渲染
```tsx
const [photoUploadKey, setPhotoUploadKey] = useState(0);

const handleReset = () => {
  setPhotoUploadKey(prev => prev + 1);
  setPhotoData({});
};

<VehiclePhotoUpload
  key={photoUploadKey}
  value={photoData}
  onChange={handlePhotoChange}
/>
```

### 方式3：在Modal中使用
```tsx
const handleSubmit = async () => {
  try {
    // 提交数据
    await submitApi(data);
    message.success('提交成功');
    
    // 清空数据并关闭弹窗
    setPhotoData({});
    setFormData({});
    setVisible(false);
  } catch (error) {
    message.error('提交失败');
  }
};
``` 