import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Card, message, Modal, Form, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import AddVehicleModal from '../AddVehicleModal';
import { GetVehicleListApi } from '@/services/vehicle';

interface VehicleData {
  admittanceCarId: string,
  seriesId: string,
  seriesName: string,
  brandId: string,
  brandName: string,
  standard: number,
  standardName:any,
  miniGuidePrice: any,
  maxGuidePrice: any,
  status: any
}

interface EditGuidePriceModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  loading: boolean;
  initialValues?: {
    miniGuidePrice?: number;
    maxGuidePrice?: number;
  };
}

const EditGuidePriceModal: React.FC<EditGuidePriceModalProps> = ({
  visible,
  onCancel,
  onOk,
  loading,
  initialValues
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      // Form validation failed
    }
  };

  return (
    <Modal
      title="编辑指导价"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
      width={360}
    >
      <Form
        form={form}
        layout="inline"
        initialValues={initialValues}
      >
        <Form.Item
          name="miniGuidePrice"
          label="最低指导价"
          rules={[
            { required: true, message: '请输入最低指导价' },
            { type: 'number', min: 0, message: '价格必须大于0' }
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
            placeholder="请输入最低指导价"
          />
        </Form.Item>
        <Form.Item
          name="maxGuidePrice"
          label="最高指导价"
          rules={[
            { required: true, message: '请输入最高指导价' },
            { type: 'number', min: 0, message: '价格必须大于0' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || !getFieldValue('miniGuidePrice') || value >= getFieldValue('miniGuidePrice')) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('最高指导价必须大于最低指导价'));
              },
            }),
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
            placeholder="请输入最高指导价"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const VehicleList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<VehicleData[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editGuidePriceModalVisible, setEditGuidePriceModalVisible] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<VehicleData | null>(null);

  useState(() => {
    setData([
      {
          "admittanceCarId": "4080",
          "seriesId": "594",
          "seriesName": "埃尔法",
          "brandId": "41",
          "brandName": "丰田",
          "standard": 2,
          "standardName": [
              "中规"
          ],
          "miniGuidePrice": 9,
          "maxGuidePrice": 16,
          "status": 1
      },
      {
          "admittanceCarId": "4079",
          "seriesId": "10149",
          "seriesName": "金刚炮",
          "brandId": "25",
          "brandName": "长城",
          "standard": 1,
          "standardName": [
              "国产"
          ],
          "miniGuidePrice": 0,
          "maxGuidePrice": 0,
          "status": 0
      },
      {
          "admittanceCarId": "4078",
          "seriesId": "5687",
          "seriesName": "长安欧尚科尚",
          "brandId": "24",
          "brandName": "长安欧尚",
          "standard": 2,
          "standardName": [
              "中规"
          ],
          "miniGuidePrice": null,
          "maxGuidePrice": null,
          "status": 1
      },
      {
          "admittanceCarId": "4077",
          "seriesId": "9936",
          "seriesName": "猎人",
          "brandId": "410",
          "brandName": "瓦滋",
          "standard": 124,
          "standardName": [
              "美规",
              "加规",
              "中东",
              "欧规",
              "墨西哥版"
          ],
          "miniGuidePrice": "0",
          "maxGuidePrice": "0",
          "status": 1
      },
      {
          "admittanceCarId": "4076",
          "seriesId": "2329",
          "seriesName": "福特F150(猛禽)",
          "brandId": "44",
          "brandName": "福特",
          "standard": 92,
          "standardName": [
              "美规",
              "加规",
              "中东",
              "墨西哥版"
          ],
          "miniGuidePrice": "80",
          "maxGuidePrice": "111.2",
          "status": 1
      },
      {
          "admittanceCarId": "4075",
          "seriesId": "9922",
          "seriesName": "Chiron赤龙",
          "brandId": "21",
          "brandName": "布加迪",
          "standard": 124,
          "standardName": [
              "美规",
              "加规",
              "中东",
              "欧规",
              "墨西哥版"
          ],
          "miniGuidePrice": null,
          "maxGuidePrice": null,
          "status": 1
      },
      {
          "admittanceCarId": "4074",
          "seriesId": "2477",
          "seriesName": "巴博斯-迈巴赫S级",
          "brandId": "5",
          "brandName": "博速",
          "standard": 32,
          "standardName": [
              "欧规"
          ],
          "miniGuidePrice": null,
          "maxGuidePrice": null,
          "status": 1
      },
      {
          "admittanceCarId": "4073",
          "seriesId": "2328",
          "seriesName": "奥迪Q5",
          "brandId": "4",
          "brandName": "奥迪",
          "standard": 108,
          "standardName": [
              "美规",
              "加规",
              "欧规",
              "墨西哥版"
          ],
          "miniGuidePrice": "12",
          "maxGuidePrice": "24.22",
          "status": 1
      },
      {
          "admittanceCarId": "4071",
          "seriesId": "2476",
          "seriesName": "AC X5",
          "brandId": "149",
          "brandName": "AC Schnitzer",
          "standard": 4,
          "standardName": [
              "美规"
          ],
          "miniGuidePrice": "9",
          "maxGuidePrice": "4",
          "status": 1
      },
      {
          "admittanceCarId": "4070",
          "seriesId": "9921",
          "seriesName": "博速 G级4x4",
          "brandId": "5",
          "brandName": "博速",
          "standard": 124,
          "standardName": [
              "美规",
              "加规",
              "中东",
              "欧规",
              "墨西哥版"
          ],
          "miniGuidePrice": "10.8",
          "maxGuidePrice": "11.7",
          "status": 1
      }
  ])
  })

  const getVehicleList = async () => {
    const res = await GetVehicleListApi({});
    console.log('..res', res)
  }

  useEffect(() => {
    getVehicleList();
  }, []);
  // 处理新增车型
  const handleAddVehicle = async (values: any) => {
    try {
      setLoading(true);
      // TODO: 调用新增车型 API
      message.success('新增车型成功');
      setAddModalVisible(false);
    } catch (error) {
      message.error('新增车型失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑指导价
  const handleEditGuidePrice = async (values: any) => {
    try {
      setLoading(true);
      // TODO: 调用编辑指导价 API
      message.success('编辑指导价成功');
      setEditGuidePriceModalVisible(false);
    } catch (error) {
      message.error('编辑指导价失败');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<VehicleData> = [
    {
      title: '品牌',
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: '车系',
      dataIndex: 'seriesName',
      key: 'seriesName',
    },
    {
      title: '车型',
      width: 120,
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '车规',
      width: 120,
      dataIndex: 'standardName',
      key: 'standardName',
      render: (value:any, row:any) => {
          console.log('..value', value)
          return (
            value?.length && value.map((item:any) => (
              <div>{item}</div>
            ))
          );
      },
    },
    {
      title: '最高指导价',
      dataIndex: 'maxGuidePrice',
      key: 'maxGuidePrice',
    },
    {
      title: '最低指导价',
      dataIndex: 'miniGuidePrice',
      key: 'miniGuidePrice',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ color: status === 'active' ? '#52c41a' : '#ff4d4f' }}>
          {status === 'active' ? '已启用' : '已禁用'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width:120,
      render: (_, record) => (
        <span>
          <Button type="link" 
            onClick={() => {
              setCurrentVehicle(record);
              setEditGuidePriceModalVisible(true);
            }}>编辑指导价</Button>
          <Button type="link" danger>
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Input
              placeholder="请输入品牌/车系/车型"
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Button type="primary">搜索</Button>
          </Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setAddModalVisible(true)}
          >
            新增车型
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{
            total: 0,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <AddVehicleModal
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={handleAddVehicle}
        loading={loading}
      />

      <EditGuidePriceModal
        visible={editGuidePriceModalVisible}
        onCancel={() => {
          setEditGuidePriceModalVisible(false);
          setCurrentVehicle(null);
        }}
        onOk={handleEditGuidePrice}
        loading={loading}
        initialValues={currentVehicle ? {
          miniGuidePrice: currentVehicle.miniGuidePrice,
          maxGuidePrice: currentVehicle.maxGuidePrice
        } : undefined}
      />
    </div>
  );
};

export default VehicleList; 