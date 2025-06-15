import React from 'react';
import { Modal, Form, Input, Row, Col, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

interface AuditModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  loading?: boolean;
  merchantData?: {
    name: string;
    address: string;
    businessLicense?: string;
    legalPerson: string;
    businessScope: string;
  };
}

const AuditModal: React.FC<AuditModalProps> = ({
  open,
  onCancel,
  onOk,
  loading = false,
  merchantData,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: UploadFile) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <Modal
      title="商家审核"
      open={open}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="reject" onClick={handleCancel}>
          驳回
        </Button>,
        <Button key="approve" type="primary" loading={loading} onClick={handleOk}>
          通过
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={merchantData}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="公司全称"
              name="name"
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="公司地址"
              name="address"
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="营业执照"
          name="businessLicense"
        >
          <Upload
            {...uploadProps}
            listType="picture"
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>上传营业执照</Button>
          </Upload>
        </Form.Item>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="法人信息"
              name="legalPerson"
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="经营范围"
              name="businessScope"
            >
              <Input.TextArea rows={4} disabled />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="审核备注"
          name="remark"
          rules={[{ required: true, message: '请输入审核备注' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入审核备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AuditModal; 