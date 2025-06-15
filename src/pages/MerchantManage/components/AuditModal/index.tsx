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
      width={600}
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
        layout="inline"
        initialValues={merchantData}
      >
        {/* <Row gutter={24}> */}
          <Col span={24}>
            <Form.Item
              label="公司全称"
              name="name"
            >
              张三
              {/* <Input disabled /> */}
            </Form.Item>
          </Col>
         
        {/* </Row> */}
        <Col>
          <Form.Item
            label="公司地址"
            name="address"
          >
            浙江杭州
            {/* <Input disabled /> */}
          </Form.Item>
        </Col>
        {/* <Row gutter={24}> */}
          <Col span={24}>
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
            </Col>
        {/* </Row> */}

        {/* <Row gutter={24}> */}
          <Col span={24}>
            <Form.Item
              label="法人信息"
              name="legalPerson"
            >
              李四
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="经营范围"
              name="businessScope"
            >
              浙江杭州台州
            </Form.Item>
          </Col>
        {/* </Row> */}

        <Form.Item
          label="备注"
          name="remark"
          rules={[{ required: true, message: '请输入备注' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入备注" style={{width: '500px'}}/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AuditModal; 