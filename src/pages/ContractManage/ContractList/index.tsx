import React, { useState,useEffect } from 'react';
import { Table, Button, Form, Input, Space, Row, Col, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.less';
import { SearchOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { GetContractApi } from '@/services/contract';
import axios from "axios";

interface ContractRecord {
  id: string;
  contractTypeDesc: string;
  orderId: string;
  orderNo: string;
  carId: string;
  vin: string;
  contractId: string;
  path: string;
  vendorName: string;
  contractName: string;
  signStatusDesc: string;
}

const ContractList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ContractRecord[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  // 获取数据
  useEffect(() => {
    handleSearch();
  }, [pagination.current, pagination.pageSize]);



  // 合同状态选项
  const statusOptions = [
    { label: '待签署', value: 'pending', color: 'orange' },
    { label: '已签署', value: 'signed', color: 'green' },
    { label: '已作废', value: 'void', color: 'red' },
    { label: '已过期', value: 'expired', color: 'gray' },
  ];

  // 合同类型选项
  const typeOptions = [
    { label: '购车合同', value: 'purchase' },
    { label: '租赁合同', value: 'lease' },
    { label: '服务合同', value: 'service' },
    { label: '其他', value: 'other' },
  ];

  // 表格列定义
  const columns: ColumnsType<ContractRecord> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
    },
    {
      title: '客户名称',
      dataIndex: 'vendorName',
      key: 'vendorName',
      width: 150,
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      key: 'contractName',
      width: 200,
    },
    {
      title: '合同状态',
      dataIndex: 'signStatusDesc',
      key: 'signStatusDesc',
      width: 100,
      render: (text) => {
        const option = statusOptions.find(opt => opt.value === text);
        return option ? (
          <Tag color={option.color}>{option.label}</Tag>
        ) : text;
      },
    },
    {
      title: '合同类型',
      dataIndex: 'contractTypeDesc',
      key: 'contractTypeDesc',
      width: 120,
      render: (text) => {
        const option = typeOptions.find(opt => opt.value === text);
        return option ? option.label : text;
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  // 查看
  const handleView = async (record: ContractRecord) => {
    console.log('查看合同:', record);
    try {
      const token = localStorage.getItem('token')
      // 通过 axios 请求图片（会走拦截器）
      const response = await axios.get(
          record.path,
          {
            responseType: 'blob', // 重要：指定响应类型为二进制
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
      );

      // 创建 Blob URL
      const url = URL.createObjectURL(response.data);
      window.open(url);
    } catch (error) {
      console.error('加载图片失败', error);
    }
  };

  // 搜索
  const handleSearch = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const params = {
        ...values,
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
      }
      console.log('搜索条件:', values);
      const res = await GetContractApi(params);
      setDataSource(res?.result);
      setPagination(prev => ({
        ...prev,
        total: res?.totalCount || 0
      }));
    } catch (error) {
      console.error('查询数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination)
  }

  // 重置
  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        layout="inline"
        className={styles.searchForm}
      >
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={8}>
            <Form.Item
              name="orderNo"
              label="订单号"
            >
              <Input placeholder="请输入订单号" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="vendorName"
              label="客户名称"
            >
              <Input placeholder="请输入客户名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                >
                  搜索
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`
        }}
        onChange={handleTableChange}
        scroll={{ x: 1100 }}
      />
    </div>
  );
};

export default ContractList; 