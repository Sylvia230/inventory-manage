import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Form, Input, Card, Row, Col, Tag, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from '../index.module.less';
import { GetBlackListApi, AddBlackListApi, GetVendorListApi, RemoveBlackListApi } from '@/services/merchant';

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

interface VendorOption {
  id: string;
  name: string;
  creditCode: string;
  legalPerson: string;
}

const BlackListManage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
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

 



  const handleRemoveFromBlacklist = (record: any) => {
    Modal.confirm({
      title: '确认移除黑名单',
      content: `确定要将商家"${record.vendorName}"从黑名单中移除吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          // TODO: 调用移除黑名单API
          await RemoveBlackListApi({id: record.id});
          fetchData(1, 10);
          // setDataSource(dataSource.map(item => 
          //   item.id === record.id ? { ...item, status: '正常' } : item
          // ));
          message.success('已从黑名单中移除');
        } catch (error) {
          message.error('操作失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };
  const fetchData = async (page = currentPage, size = pageSize) => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize: size,
        // 可以添加其他搜索参数，例如：
        // name: form.getFieldValue('name'),
        // creditCode: form.getFieldValue('creditCode'),
      };
  
      const res = await GetBlackListApi(params);
      console.log('黑名单列表', res);
  
      setDataSource(res || []);
        // setTotal(res.totalCount || 0);
      // } else {
      //   message.error(res.msg || '获取数据失败');
      // }
    } catch (error) {
      console.error('获取商家列表失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(1, 10);
  }, []);
  const handleSearch = async (values: any) => {
    try {
      setLoading(true);
      // TODO: 调用搜索API
      console.log('搜索条件：', values);
      const res = await GetBlackListApi(values);
      console.log('黑名单列表', res);

      setDataSource(res || []);
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
      dataIndex: 'vendorName',
      key: 'vendorName',
    },
    {
      title: '统一社会信用代码',
      width:160,
      dataIndex: 'socialCreditCode',
      key: 'socialCreditCode',
    },
    {
      title: '法人名称',
      dataIndex: 'legalName',
      key: 'legalName',
    },
    {
      title: '法人身份证',
      width:160,
      dataIndex: 'legalCode',
      key: 'legalCode',
    },
    {
      title: '签章人',
      width:120,
      dataIndex: 'signerName',
      key: 'signerName',
    },
    {
      title: '联系人手机号',
      width:120,
      dataIndex: 'contactMobile',
      key: 'contactMobile',
    },
    {
      title: '拉黑原因',
      dataIndex: 'reason',
      key: 'reason',
    },
  
    {
      title: '状态',
      dataIndex: 'statusDesc',
      key: 'statusDesc',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
            <Button 
              type="link" 
              onClick={() => handleRemoveFromBlacklist(record)}
              loading={loading}
            >
              移除黑名单
            </Button>
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
          <Row gutter={48}>
            <Col span={48}>
              <Form.Item
                name="vendorName"
                label="商家名称"
              >
                <Input placeholder="请输入商家名称" allowClear />
              </Form.Item>
            </Col>
            {/*<Col span={9}>*/}
            {/*  <Form.Item*/}
            {/*    name="creditCode"*/}
            {/*    label="统一社会信用代码"*/}
            {/*  >*/}
            {/*    <Input placeholder="请输入统一社会信用代码" allowClear />*/}
            {/*  </Form.Item>*/}
            {/*</Col>*/}
            {/*<Col span={7}>*/}
            {/*  <Form.Item*/}
            {/*    name="legalPerson"*/}
            {/*    label="法人代表"*/}
            {/*  >*/}
            {/*    <Input placeholder="请输入法人代表" allowClear />*/}
            {/*  </Form.Item>*/}
            {/*</Col>*/}
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