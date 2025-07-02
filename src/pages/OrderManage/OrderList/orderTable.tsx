import React, { useState, useMemo } from 'react';
import { Button, Space, Tag, Modal, Input, message, Select, Spin, Form } from 'antd';
import type { SelectProps } from 'antd/es/select';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import styles from './index.module.less';

const { TextArea } = Input;

interface OrderTableProps {
  orderData: Array<{
    applicationId: string;
    orderId: string | null;
    applyDate: number;
    taskCode: string[];
    taskCodeDesc: string[];
    orderStatusDesc: string;
    applicationStatus: number;
    applicationStatusDesc: string;
    dealName: string;
    providerName: string;
    contractAmount: number;
    contractAmountCNY: string;
    carDetail: Array<{
      modelName: string;
      uniqueNum: number;
      carUniqueList: string[];
    }>;
    totalCar: number;
    userName: string;
    userMobile: string;
    contactsName: string;
    contactsPhone: string;
    providerUserName: string;
    providerUserPhone: string;
    [key: string]: any;
  }>;
}

interface TagOption {
  value: string;
  label: string;
  color?: string;
}

interface BusinessOwner {
  id: string;
  name: string;
}

// 操作按钮配置
const ACTION_BUTTONS = [
  { text: '添加备注', type: 'primary', action: 'addRemark' },
  // { text: '修改车辆信息', type: 'primary' },
  { text: '添加标签', type: 'primary', action: 'addTag' },
  { text: '业务归属', type: 'primary', action: 'setBusinessOwner' },
  { text: '推送到资方', type: 'primary', action: 'pushToProvider' },
  // { text: '退款', type: 'primary' },
  // { text: '申请还款', type: 'primary' },
  { text: '核价', type: 'primary', action: 'priceCheck' },
  { text: '后台结算', type: 'primary' },
  { text: '关闭申请单', type: 'primary', danger: true },
];

// 车辆信息表格列配置
const VEHICLE_COLUMNS = [
  { title: '车型', dataIndex: 'modelName', width: 140 },
  { title: '数量', dataIndex: 'uniqueNum', width: 60 },
  { title: '车架号', dataIndex: 'carUniqueList' },
];

const OrderTable: React.FC<OrderTableProps> = ({ orderData }) => {
  console.log('orderData', orderData);
  const navigate = useNavigate();
  const [isRemarkModalVisible, setIsRemarkModalVisible] = useState(false);
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [isPushConfirmModalVisible, setIsPushConfirmModalVisible] = useState(false);
  const [isBusinessOwnerModalVisible, setIsBusinessOwnerModalVisible] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [remarkText, setRemarkText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<TagOption[]>([]);
  const [fetching, setFetching] = useState(false);
  const [businessOwnerOptions, setBusinessOwnerOptions] = useState<BusinessOwner[]>([]);
  const [selectedBusinessOwner, setSelectedBusinessOwner] = useState<string>();
  const [businessOwnerFetching, setBusinessOwnerFetching] = useState(false);
  const [form] = Form.useForm();
  const [businessOwnerForm] = Form.useForm();

  const formItemLayout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 18,
        },
    };

  // 处理点击订单号跳转到详情页
  const handleOrderNoClick = (orderNo: string) => {
  // if (!applicationId) {
  //     message.error('订单ID不存在，无法跳转到详情页');
  //     return;
  //   }
    navigate(`/orderManage/detail/${orderNo}`);
  };

  // 处理添加备注
  const handleAddRemark = (applicationId: string) => {
    setCurrentOrderId(applicationId);
    setRemarkText('');
    setIsRemarkModalVisible(true);
  };

  // 处理添加标签
  const handleAddTag = (applicationId: string) => {
    setCurrentOrderId(applicationId);
    setSelectedTags([]);
    form.resetFields();
    setIsTagModalVisible(true);
  };

  // 处理备注提交
  const handleRemarkSubmit = async () => {
    if (!remarkText.trim()) {
      message.warning('请输入备注内容');
      return;
    }

    try {
      // TODO: 调用API保存备注
      // await request.post('/api/orders/remark', {
      //   applicationId: currentOrderId,
      //   remark: remarkText
      // });
      
      message.success('备注添加成功');
      setIsRemarkModalVisible(false);
    } catch (error) {
      message.error('备注添加失败');
    }
  };

  // 处理标签提交
  const handleTagSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedTags.length === 0) {
        message.warning('请选择至少一个标签');
        return;
      }

      // TODO: 调用API保存标签
      // await request.post('/api/orders/tags', {
      //   applicationId: currentOrderId,
      //   tags: selectedTags,
      //   label: values.label
      // });
      
      message.success('标签添加成功');
      setIsTagModalVisible(false);
      form.resetFields();
    } catch (error) {
      // Form validation failed
      return;
    }
  };

  // 远程搜索标签
  const fetchTagOptions = async (searchText: string) => {
    setFetching(true);
    try {
      // TODO: 替换为实际的API调用
      // const response = await request.get('/api/tags/search', {
      //   params: { keyword: searchText }
      // });
      // setTagOptions(response.data);
      
      // 模拟数据
      const mockData: TagOption[] = [
        { value: 'urgent', label: '加急', color: 'red' },
        { value: 'vip', label: 'VIP客户', color: 'gold' },
        { value: 'new', label: '新客户', color: 'green' },
        { value: 'special', label: '特殊处理', color: 'purple' },
      ].filter(item => 
        item.label.toLowerCase().includes(searchText.toLowerCase())
      );
      
      setTagOptions(mockData);
    } catch (error) {
      message.error('获取标签列表失败');
    } finally {
      setFetching(false);
    }
  };

  // 使用防抖处理搜索
  const debouncedFetchTagOptions = useMemo(
    () => debounce(fetchTagOptions, 500),
    []
  );

  // 处理推送到资方
  const handlePushToProvider = (applicationId: string) => {
    setCurrentOrderId(applicationId);
    setIsPushConfirmModalVisible(true);
  };

  // 确认推送到资方
  const handlePushConfirm = async () => {
    try {
      // TODO: 调用推送API
      // await request.post('/api/orders/push', {
      //   applicationId: currentOrderId
      // });
      
      message.success('推送成功');
      setIsPushConfirmModalVisible(false);
    } catch (error) {
      message.error('推送失败');
    }
  };

  // 处理业务归属
  const handleSetBusinessOwner = (applicationId: string) => {
    setCurrentOrderId(applicationId);
    setSelectedBusinessOwner(undefined);
    businessOwnerForm.resetFields();
    setIsBusinessOwnerModalVisible(true);
  };

  // 处理核价
  const handlePriceCheck = (record: OrderTableProps['orderData'][0]) => {
    console.log('跳转到核价页面，订单信息:', record);
    // 跳转到车辆核价页面，并传递订单号进行筛选
    navigate(`/taskCenter/priceCheck?orderNumber=${record.orderNo}`);
  };

  // 确认业务归属
  const handleBusinessOwnerSubmit = async () => {
    try {
      const values = await businessOwnerForm.validateFields();
      if (!values.businessOwner) {
        message.warning('请选择业务归属人');
        return;
      }

      // TODO: 调用API保存业务归属
      // await request.post('/api/orders/business-owner', {
      //   applicationId: currentOrderId,
      //   businessOwnerId: values.businessOwner
      // });
      
      message.success('业务归属设置成功');
      setIsBusinessOwnerModalVisible(false);
      businessOwnerForm.resetFields();
    } catch (error) {
      // Form validation failed
      return;
    }
  };

  // 搜索业务归属人
  const fetchBusinessOwners = async (searchText: string) => {
    setBusinessOwnerFetching(true);
    try {
      // TODO: 替换为实际的API调用
      // const response = await request.get('/api/business-owners/search', {
      //   params: { keyword: searchText }
      // });
      // setBusinessOwnerOptions(response.data);
      
      // 模拟数据
      const mockData: BusinessOwner[] = [
        { id: '1', name: '张三', },
        { id: '2', name: '李四', },
        { id: '3', name: '王五', },
        { id: '4', name: '赵六',},
      ].filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      
      setBusinessOwnerOptions(mockData);
    } catch (error) {
      message.error('获取业务归属人列表失败');
    } finally {
      setBusinessOwnerFetching(false);
    }
  };

  // 使用防抖处理搜索
  const debouncedFetchBusinessOwners = useMemo(
    () => debounce(fetchBusinessOwners, 500),
    []
  );

  const useAction = () => {
    const actionMap: Record<any, any> = useMemo(() => {
      return {
        addRemark: (params: any) => {
          handleAddRemark(params);
        },
        addTag: (params: any) => {
          handleAddTag(params);
        },
        pushToProvider: (params: any) => {
          handlePushToProvider(params);
        },
        setBusinessOwner: (params: any) => {
          handleSetBusinessOwner(params);
        },
        priceCheck: (params: any, record: any) => {
          handlePriceCheck(record);
        },
      };
    }, []);
    return actionMap;
  };

  const actionMap = useAction();

  const handleBatchOpt = (applicationId: any, action: any, record?: any) => {
    if (action === 'priceCheck') {
      actionMap[action]?.(applicationId, record);
    } else {
      actionMap[action]?.(applicationId);
    }
  };

  // 渲染操作按钮
  const renderActionButtons = (status: string, record: OrderTableProps['orderData'][0]) => (
    <div className={styles.orderHeader}>
      {/* <Tag color="processing" className={styles.orderStatus}>{status}</Tag> */}
      <Space wrap className={styles.actionButtons}>
        {ACTION_BUTTONS.map((btn, index) => (
          <Button
            key={index}
            type={btn.type as any}
            size="small"
            danger={btn.danger}
            onClick={() => handleBatchOpt(record.orderNo, btn.action, record)}
          >
            {btn.text}
          </Button>
        ))}
      </Space>
    </div>
  );

  // 渲染车辆信息表格
  const renderVehicleTable = (vehicleData: any) => (
    <div className={styles.vehicleTableContainer}>
      <table className={styles.tableInner}>
        <thead>
          <tr>
            {VEHICLE_COLUMNS.map((col, index) => (
              <th key={index}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vehicleData?.carList?.map((vehicle:any, index:number) => (
            <tr key={index}>
              <td>{vehicle.vehicleName }</td>
              <td>{vehicle.emission}</td>
              <td>{vehicle?.vin || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {orderData?.map((item, index) => (
        <div key={item.applicationId} className={styles.orderTableWrapper}>
          <table className={`${styles.table} ${styles.tableBorder} ${styles.tableFixed}`}>
            <thead>
              <tr>
                <th colSpan={7} className={styles.orderItemActions}>
                  {renderActionButtons(item.applicationStatusDesc, item)}
                </th>
              </tr>
              <tr>
                <th colSpan={3} className={styles.orderInfo}>
                  订单号:
                                                            <span 
                        className={`${styles.orderNumber} ${styles.clickable}`}
                        onClick={() => handleOrderNoClick(item.orderNo)}
                      >
                        {item.orderNo}
                      </span>
                  &nbsp;&nbsp;时间：{new Date(item.createTime).toLocaleString()}
                </th>
                <th colSpan={1} className={styles.taskStatus}>
                  <div>进行中的任务:</div>
                  {/* <Button size="small">更多</Button> */}
                </th>
                <th colSpan={3} className={styles.orderStatusInfo}>
                  <span>订单状态: </span>
                  <span>{item.orderStatusDesc}</span>
                </th>
              </tr>
               {/* 标签，如果返回就展示 */}
              <tr>
                <th colSpan={7} className='text-left'>
                  <span className={styles.labelButtonBox}>
                    <Button size="small" icon={<i className="el-icon-close" />}>6</Button>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={2}>经销商名称：{item.vendorName}</td>
                <td colSpan={2}>
                  <div className={styles.supplierInfo}>
                    <div>供应商名称：{item.sellerName}</div>
                  </div>
                </td>
                <td colSpan={2}>合同金额：{item.contractAmount}元</td>
                <td rowSpan={2}>{renderVehicleTable(item)}</td>
              </tr>
              <tr>
                <td>业务经理：{item.userName}</td>
                <td>申请人：{item.contactsName}</td>
                <td>手机：{item.contactsPhone}</td>
                <td>联系人：{item.providerUserName}</td>
                <td>手机：{item.providerUserPhone}</td>
                <td>车辆数：{item.carCount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      {/* 备注弹窗 */}
      <Modal
        title="添加备注"
        open={isRemarkModalVisible}
        onOk={handleRemarkSubmit}
        onCancel={() => setIsRemarkModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <TextArea
          value={remarkText}
          onChange={(e) => setRemarkText(e.target.value)}
          maxLength={200}
          showCount
          placeholder="请输入备注内容（最多200字）"
          autoSize={{ minRows: 4, maxRows: 6 }}
          className='mb-20'
        />
      </Modal>

      {/* 标签弹窗 */}
      <Modal
        title="添加标签"
        open={isTagModalVisible}
        onOk={handleTagSubmit}
        onCancel={() => {
          setIsTagModalVisible(false);
          form.resetFields();
        }}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="inline"
        >
          <Form.Item
            label="标签"
            required
            tooltip="请至少选择一个标签"
             { ...formItemLayout }
          >
            <Select
              // mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择或搜索标签"
              value={selectedTags}
              onChange={setSelectedTags}
              onSearch={debouncedFetchTagOptions}
              notFoundContent={fetching ? <Spin size="small" /> : null}
              options={tagOptions}
              optionLabelProp="label"
              optionFilterProp="label"
              showSearch
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 业务归属弹窗 */}
      <Modal
        title="添加归属"
        open={isBusinessOwnerModalVisible}
        onOk={handleBusinessOwnerSubmit}
        onCancel={() => {
          setIsBusinessOwnerModalVisible(false);
          businessOwnerForm.resetFields();
        }}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={businessOwnerForm}
          layout="inline"
        >
          <Form.Item
            name="businessOwner"
            label="归属"
            rules={[{ required: true, message: '请选择业务归属人' }]}
          >
            <Select
              showSearch
              placeholder="请选择或搜索业务归属人"
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={debouncedFetchBusinessOwners}
              notFoundContent={businessOwnerFetching ? <Spin size="small" /> : null}
              onChange={setSelectedBusinessOwner}
              style={{ width: '100%' }}
            >
              {businessOwnerOptions.map(owner => (
                <Select.Option key={owner.id} value={owner.id}>
                  <div>
                    <div>{owner.name}</div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 推送到资方确认弹窗 */}
      <Modal
        title="确认推送"
        open={isPushConfirmModalVisible}
        onOk={handlePushConfirm}
        onCancel={() => setIsPushConfirmModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <p>请确认是否要推送订单？</p>
      </Modal>
    </div>
  );
};

export default OrderTable; 
