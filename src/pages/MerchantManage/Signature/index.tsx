import React, { useState } from 'react';
import { Table, Button, Space, Modal, message, Form, Input, Card, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import '../index.module.less'

interface SignaturePerson {
  id: string;
  name: string;
  signatureType: string;
  idType: string;
  idNumber: string;
  phone: string;
  companyName: string;
  authStatus: '已认证' | '未认证';
}

interface SearchParams {
  name?: string;
  idNumber?: string;
  phone?: string;
}

const SignatureManage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<SignaturePerson[]>([
    {
      id: '1',
      name: '张三',
      signatureType: '个人签章',
      idType: '身份证',
      idNumber: '110101199001011234',
      phone: '13800138000',
      companyName: '测试企业',
      authStatus: '已认证',
    },
    // 添加更多测试数据...
  ]);

  const handleDelete = (record: SignaturePerson) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除签章人"${record.name}"吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          // TODO: 调用删除API
          // await deleteSignaturePerson(record.id);
          setDataSource(dataSource.filter(item => item.id !== record.id));
          message.success('删除成功');
        } catch (error) {
          message.error('删除失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSearch = async (values: SearchParams) => {
    try {
      setLoading(true);
      // TODO: 调用搜索API
      // const res = await searchSignaturePersons(values);
      // setDataSource(res.data);
      console.log('搜索条件：', values);
    } catch (error) {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    // TODO: 重置后重新加载数据
    // handleSearch({});
  };

  const columns: ColumnsType<SignaturePerson> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '签章类型',
      dataIndex: 'signatureType',
      key: 'signatureType',
    },
    {
      title: '证件类型',
      dataIndex: 'idType',
      key: 'idType',
    },
    {
      title: '证件号',
      dataIndex: 'idNumber',
      key: 'idNumber',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '企业名称',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: '认证状态',
      dataIndex: 'authStatus',
      key: 'authStatus',
      render: (status: string) => (
        <span style={{ color: status === '已认证' ? '#52c41a' : '#ff4d4f' }}>
          {status}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            danger 
            onClick={() => handleDelete(record)}
            loading={loading}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card  className='container' style={{ marginBottom: '24px' }}>
        <Form
          form={form}
          onFinish={handleSearch}
          layout="inline"
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="name"
                label="姓名"
              >
                <Input placeholder="请输入姓名" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="idNumber"
                label="身份证号"
              >
                <Input placeholder="请输入身份证号" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="phone"
                label="手机号"
              >
                <Input placeholder="请输入手机号" allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={handleReset}>重置</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  查询
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </div>
  );
};

export default SignatureManage; 