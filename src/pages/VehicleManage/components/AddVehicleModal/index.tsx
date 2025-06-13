import React, { useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, message } from 'antd';
import type { FormInstance } from 'antd/es/form';

const { Option } = Select;

interface AddVehicleModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  loading?: boolean;
}

// 品牌选项
const BRAND_OPTIONS = [
  { label: '奥迪', value: 'audi' },
  { label: '宝马', value: 'bmw' },
  { label: '奔驰', value: 'benz' },
  { label: '大众', value: 'volkswagen' },
  { label: '丰田', value: 'toyota' },
  { label: '本田', value: 'honda' },
];

// 车型选项
const MODEL_OPTIONS = [
  { label: '轿车', value: 'sedan' },
  { label: 'SUV', value: 'suv' },
  { label: 'MPV', value: 'mpv' },
  { label: '跑车', value: 'sports' },
  { label: '皮卡', value: 'pickup' },
];

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  visible,
  onCancel,
  onOk,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [brandInputVisible, setBrandInputVisible] = useState(false);
  const [newBrand, setNewBrand] = useState('');

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      // 表单验证失败
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setBrandInputVisible(false);
    setNewBrand('');
    onCancel();
  };

  // 处理品牌输入框显示
  const handleBrandInputChange = (value: string) => {
    console.log('...value', value)
    if (value === 'new') {
      setBrandInputVisible(true);
    } else {
      setBrandInputVisible(false);
    }
  };

  // 处理新增品牌
  const handleNewBrandConfirm = () => {
    if (newBrand) {
      form.setFieldsValue({ brand: newBrand });
      setBrandInputVisible(false);
      setNewBrand('');
    }
  };

  return (
    <Modal
      title="新增车型"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="brand"
          label="品牌"
          rules={[{ required: true, message: '请选择或输入品牌' }]}
        >
          {brandInputVisible ? (
            <Input
              placeholder="请输入品牌名称"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              onBlur={handleNewBrandConfirm}
              onPressEnter={handleNewBrandConfirm}
              autoFocus
            />
          ) : (
            <Select
              placeholder="请选择或输入品牌"
              onChange={handleBrandInputChange}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Select.Option value="new" style={{ borderTop: '1px solid #e8e8e8' }}>
                    + 新增品牌
                  </Select.Option>
                </>
              )}
            >
              {BRAND_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item
          name="model"
          label="车型"
          rules={[{ required: true, message: '请选择车型' }]}
        >
          <Select placeholder="请选择车型">
            {MODEL_OPTIONS.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="series"
          label="车系"
          rules={[{ required: true, message: '请输入车系' }]}
        >
          <Input placeholder="请输入车系" />
        </Form.Item>

        <Form.Item
          name="specification"
          label="车规"
          rules={[{ required: true, message: '请输入车规' }]}
        >
          <Select placeholder="请选择车规">
            {MODEL_OPTIONS.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="maxGuidePrice"
          label="最高指导价"
          rules={[{ required: true, message: '请输入指导价' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入指导价"
            min={0}
            precision={2}
            formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            // parser={(value) => value!.replace(/\¥\s?|(,*)/g, '')}
          />
        </Form.Item>
        <Form.Item
          name="miniGuidePrice"
          label="最低指导价"
          rules={[{ required: true, message: '请输入指导价' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入指导价"
            min={0}
            precision={2}
            formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            // parser={(value) => value!.replace(/\¥\s?|(,*)/g, '')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVehicleModal; 