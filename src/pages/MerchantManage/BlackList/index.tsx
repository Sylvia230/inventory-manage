import React, { useState } from 'react';
import { Table, Button, Space, Modal, message, Form, Input, Card, Row, Col, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from '../index.module.less';

interface Merchant {
  id: string;
  name: string;
  creditCode: string;
  legalPerson: string;
  legalPersonId: string;
  legalSignature: string;
  companySignature: string;
  contactPerson: string;
  businessAddress: string;
  creditLevel: 'A' | 'B' | 'C' | 'D';
  creditLimit: number;
  status: '待审核' | '正常' | '黑名单';
}

const BlackListManage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<Merchant[]>([
    {
      id: '1',
      name: '测试企业1',
      creditCode: '91110105MA12345678',
      legalPerson: '张三',
      legalPersonId: '110101199001011234',
      legalSignature: '张三',
      companySignature: '李四',
      contactPerson: '王五',
      businessAddress: '北京市朝阳区xxx街道',
      creditLevel: 'A',
      creditLimit: 1000000,
      status: '黑名单',
    },
    // 添加更多测试数据...
  ]);

  const handleRemoveFromBlacklist = (record: Merchant) => {
    Modal.confirm({
      title: '确认移除黑名单',
      content: `确定要将商家"${record.name}"从黑名单中移除吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          // TODO: 调用移除黑名单API
          // await removeFromBlacklist(record.id);
          setDataSource(dataSource.map(item => 
            item.id === record.id ? { ...item, status: '正常' } : item
          ));
          message.success('已从黑名单中移除');
        } catch (error) {
          message.error('操作失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSearch = async (values: any) => {
    try {
      setLoading(true);
      // TODO: 调用搜索API
      console.log('搜索条件：', values);
    } catch (error) {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '待审核':
        return 'warning';
      case '正常':
        return 'success';
      case '黑名单':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCreditLevelColor = (level: string) => {
    switch (level) {
      case 'A':
        return 'success';
      case 'B':
        return 'processing';
      case 'C':
        return 'warning';
      case 'D':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns: ColumnsType<Merchant> = [
    {
      title: '商家名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '统一社会信用代码',
      width:160,
      dataIndex: 'creditCode',
      key: 'creditCode',
    },
    {
      title: '法人代表',
      dataIndex: 'legalPerson',
      key: 'legalPerson',
    },
    {
      title: '法人代表身份证',
      width:160,
      dataIndex: 'legalPersonId',
      key: 'legalPersonId',
    },
    {
      title: '法人签章人',
      width:120,
      dataIndex: 'legalSignature',
      key: 'legalSignature',
    },
    {
      title: '企业签章人',
      width:120,
      dataIndex: 'companySignature',
      key: 'companySignature',
    },
    {
      title: '联系人',
      width:120,
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: '经营场所',
      dataIndex: 'businessAddress',
      key: 'businessAddress',
    },
    {
      title: '商家信用等级',
      dataIndex: 'creditLevel',
      key: 'creditLevel',
      render: (level: string) => (
        <Tag color={getCreditLevelColor(level)}>{level}</Tag>
      ),
    },
    {
      title: '授信额度',
      dataIndex: 'creditLimit',
      key: 'creditLimit',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          {record.status === '黑名单' && (
            <Button 
              type="link" 
              onClick={() => handleRemoveFromBlacklist(record)}
              loading={loading}
            >
              移除黑名单
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card className='mb-16'>
        <Form
          form={form}
          onFinish={handleSearch}
          layout="inline"
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="name"
                label="商家名称"
              >
                <Input placeholder="请输入商家名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item
                name="creditCode"
                label="统一社会信用代码"
              >
                <Input placeholder="请输入统一社会信用代码" allowClear />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name="legalPerson"
                label="法人代表"
              >
                <Input placeholder="请输入法人代表" allowClear />
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
      <div className={styles.container}>
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
                scroll={ { x: 1500 } }
            />
      </div>
      
    </div>
  );
};

export default BlackListManage; 