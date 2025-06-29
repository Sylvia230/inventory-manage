import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Steps, 
  Button, 
  Space, 
  DatePicker, 
  Table, 
  Row, 
  Col,
  message,
  Descriptions
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import styles from './index.module.less';
import { createInsuranceApi, getInsurancePersonApi } from '@/services/waybill';
import wayBillStore from '@/stores/wayBill';

const { Step } = Steps;

// 车辆保险信息接口
interface VehicleInsuranceInfo {
  id: string;
  vin: string; // 车架号
  vehicleAttribute: string; // 车辆属性
  startLocation: string; // 起始地
  endLocation: string; // 目的地
  contractPrice: number; // 合同价(万元)
  insuranceAmount: number; // 保额
  insurancePremium: number; // 保险金额(万元)
  insuranceStartDate?: string; // 保险起期
  insuranceEndDate?: string; // 保险终期
}

// 投被保信息接口
interface InsurancePartyInfo {
  objectType: string; // 对象类型
  insuredName: string; // 被投保人
  insuredCreditCode: string; // 被投保人统一社会信用代码
  insuredContact: string; // 被投保联系人
  insuredPhone: string; // 被投保联系电话
  applicantName: string; // 投保人
  applicantCreditCode: string; // 投保人统一社会信用代码
  applicantContact: string; // 投保联系人
  applicantPhone: string; // 投保联系电话
}

interface InsuranceModalProps {
  visible: boolean;
  onCancel: () => void;
  selectedVehicles: any[]; // 选中的车辆数据
  onSuccess: () => void;
  waybillNo: string;
}

const InsuranceModal: React.FC<InsuranceModalProps> = ({
  visible,
  onCancel,
  selectedVehicles,
  onSuccess,
  waybillNo
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [effectiveDate, setEffectiveDate] = useState<Dayjs | null>(null);
  const [vehicleInsuranceData, setVehicleInsuranceData] = useState<VehicleInsuranceInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { insurancePersonInfo, setInsurancePersonInfo } = wayBillStore;

  // 初始化车辆保险数据
  useEffect(() => {
    if (selectedVehicles?.length > 0) {
      const insuranceData = selectedVehicles.map(vehicle => ({
        id: vehicle.id,
        vin: vehicle.vin,
        vehicleAttribute: `${vehicle.vehicleName}`,
        startLocation: '上海市浦东新区', // 这里应该从实际数据获取
        endLocation: vehicle.targetWarehouse,
        contractPrice: vehicle.contractPrice ? vehicle.contractPrice / 10000 : 0, // 转换为万元
        insuranceAmount: vehicle.contractPrice ? vehicle.contractPrice * 0.8 : 0, // 保额为合同价的80%
        insurancePremium: vehicle.contractPrice ? vehicle.contractPrice * 0.008 : 0, // 保险金额为合同价的0.8%
        insuranceStartDate: '',
        insuranceEndDate: ''
      }));
      setVehicleInsuranceData(insuranceData);
    }
  }, [selectedVehicles]);

  useEffect(() => {
    if (visible) {
      getInsurancePersonInfo();
    }
  }, [visible]);

  // 保险生效起期变更处理
  const handleEffectiveDateChange = (date: Dayjs | null) => {
    setEffectiveDate(date);
    if (date) {
      const startDate = date.format('YYYY-MM-DD HH:mm:ss');
      const endDate = date.add(3, 'month').format('YYYY-MM-DD HH:mm:ss');
      
      const updatedData = vehicleInsuranceData.map(item => ({
        ...item,
        insuranceStartDate: startDate,
        insuranceEndDate: endDate
      }));
      setVehicleInsuranceData(updatedData);
    }
  };

  // 第一步的表格列定义
  const step1Columns: ColumnsType<VehicleInsuranceInfo> = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: '车架号',
      dataIndex: 'vin',
      key: 'vin',
      width: 150,
    },
    {
      title: '车型',
      dataIndex: 'vehicleName',
      key: 'vehicleName',
      width: 200,
    },
    {
      title: '起始地',
      dataIndex: 'startLocation',
      key: 'startLocation',
      width: 150,
    },
    {
      title: '目的地',
      dataIndex: 'endLocation',
      key: 'endLocation',
      width: 120,
    },
    {
      title: '合同价(万元)',
      dataIndex: 'contractPrice',
      key: 'contractPrice',
      width: 120,
      render: (value: number) => value.toFixed(2),
    },
    {
      title: '保额',
      dataIndex: 'insuranceAmount',
      key: 'insuranceAmount',
      width: 120,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '保险金额(万元)',
      dataIndex: 'insurancePremium',
      key: 'insurancePremium',
      width: 120,
      render: (value: number) => (value / 10000).toFixed(2),
    },
    {
      title: '保险起期',
      dataIndex: 'insuranceStartDate',
      key: 'insuranceStartDate',
      width: 120,
    },
    {
      title: '保险终期',
      dataIndex: 'insuranceEndDate',
      key: 'insuranceEndDate',
      width: 120,
    },
  ];

  // 下一步操作
  const handleNext = () => {
    if (currentStep === 0) {
      if (!effectiveDate) {
        message.error('请选择保险生效起期');
        return;
      }
      setCurrentStep(1);
    }
  };

  // 获取投保人数据
  const getInsurancePersonInfo = async () => {
    const res = await getInsurancePersonApi({
      tmsWaybillNo: waybillNo
    });
    setInsurancePersonInfo(res.result);
    console.log(res, 'getInsurancePersonInfo');
  };
  // 上一步操作
  const handlePrev = () => {
    setCurrentStep(0);
  };

  // 创建保单
  const handleCreateInsurance = async () => {
    try {
      setLoading(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      await createInsuranceApi({
        tmsWaybillNo: waybillNo,
        takeEffect: dayjs(effectiveDate).format('YYYY-MM-DD HH:mm:ss'),
        tmsWaybillCarDTOList: vehicleInsuranceData
      });
      
      message.success(`成功创建 ${selectedVehicles.length} 辆车的电子保单`);
      setLoading(false);
      onSuccess();
      handleModalClose();
      
    } catch (error: any) {
      setLoading(false);
      message.error('创建保单失败');
    }
  };

  // 关闭模态框
  const handleModalClose = () => {
    setCurrentStep(0);
    setEffectiveDate(null);
    onCancel();
  };

  // 步骤配置
  const steps = [
    {
      title: '选择保险起期',
      content: 'insurance-period'
    },
    {
      title: '投被保信息',
      content: 'insurance-info'
    }
  ];

  return (
    <Modal
      title="创建电子保单"
      open={visible}
      onCancel={handleModalClose}
      width={1200}
      height={600}
      style={{overflowY: 'scroll'}}
      // footer={null}
      onOk={handleCreateInsurance}
      okText="创建"
      cancelText="关闭"
      className={styles.insuranceModal}
      destroyOnClose
    >
      <div className={styles.modalContent}>
        {/* 步骤条  暂时先不要了，保留以防后面要放开*/}
        {/* <Steps current={currentStep} className={styles.steps}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps> */}

        {/* 第一步：选择保险起期 */}
        {currentStep === 0 && (
          <div className={styles.stepContent}>
            <div className={styles.dateSelector}>
              <Row gutter={16} align="middle">
                <Col span={4}>
                  <label className={styles.label}>保险生效起期：</label>
                </Col>
                <Col span={8}>
                  <DatePicker
                    showTime
                    value={effectiveDate}
                    onChange={handleEffectiveDateChange}
                    placeholder="请选择保险生效起期"
                    style={{ width: '100%' }}
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                  />
                </Col>
                <Col span={12}>
                  <span className={styles.hint}>
                    选择起期后，保险终期将自动设置为起期后3个月
                  </span>
                </Col>
              </Row>
            </div>

            <div className={styles.vehicleTable}>
              {/* <h3>车辆保险信息</h3> */}
              <Table
                columns={step1Columns}
                dataSource={vehicleInsuranceData}
                rowKey="id"
                pagination={false}
                scroll={{ x: 1200 }}
                size="small"
              />
            </div>
            <div>
              {/* <div className={styles.insuranceInfoTitle}>对象类型: 企业</div> */}
              <Row gutter={24}>
                <Col span={12}>
                  <Descriptions
                    // title="被投保人信息"
                    bordered
                    column={1}
                    size="small"
                    className={styles.infoSection}
                  >
                    {/* <Descriptions.Item label="对象类型">企业</Descriptions.Item> */}
                    <Descriptions.Item label="被投保人">{insurancePersonInfo.insuredPersonName}</Descriptions.Item>
                    <Descriptions.Item label="统一社会信用代码">{insurancePersonInfo.insuredPersonReditCode}</Descriptions.Item>
                    <Descriptions.Item label="被投保联系人">{insurancePersonInfo.insuredPersonContactName}</Descriptions.Item>
                    <Descriptions.Item label="联系电话">{insurancePersonInfo.insuredPersonContactPhone}</Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Descriptions
                    // title="投保人信息"
                    bordered
                    column={1}
                    size="small"
                    className={styles.infoSection}
                  >
                    <Descriptions.Item label="投保人">{insurancePersonInfo.policyholderName}</Descriptions.Item>
                    <Descriptions.Item label="统一社会信用代码">{insurancePersonInfo.policyholderReditCode}</Descriptions.Item>
                    <Descriptions.Item label="投保联系人">{insurancePersonInfo.policyholderContactName}</Descriptions.Item>
                    <Descriptions.Item label="联系电话">{insurancePersonInfo.policyholderContactPhone}</Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </div>
            {/* <div className={styles.stepButtons}>
              <Space>
                <Button onClick={handleModalClose}>关闭</Button>
                <Button 
                  type="primary" 
                  onClick={handleNext}
                  disabled={!effectiveDate}
                >
                  下一步
                </Button>
              </Space>
            </div> */}
          </div>
        )}

        {/* 第二步：投被保信息 */}
        {currentStep === 1 && (
          <div className={styles.stepContent}>
            <h3>投被保信息</h3>
            <div>
              {/* <div className={styles.insuranceInfoTitle}>对象类型: 企业</div> */}
              <Row gutter={24}>
                <Col span={12}>
                  <Descriptions
                    // title="被投保人信息"
                    bordered
                    column={1}
                    size="small"
                    className={styles.infoSection}
                  >
                    {/* <Descriptions.Item label="对象类型">企业</Descriptions.Item> */}
                    <Descriptions.Item label="被投保人">{insurancePersonInfo.insuredPersonName}</Descriptions.Item>
                    <Descriptions.Item label="统一社会信用代码">{insurancePersonInfo.insuredPersonReditCode}</Descriptions.Item>
                    <Descriptions.Item label="被投保联系人">{insurancePersonInfo.insuredPersonContactName}</Descriptions.Item>
                    <Descriptions.Item label="联系电话">{insurancePersonInfo.insuredPersonContactPhone}</Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Descriptions
                    // title="投保人信息"
                    bordered
                    column={1}
                    size="small"
                    className={styles.infoSection}
                  >
                    <Descriptions.Item label="投保人">{insurancePersonInfo.policyholderName}</Descriptions.Item>
                    <Descriptions.Item label="统一社会信用代码">{insurancePersonInfo.policyholderReditCode}</Descriptions.Item>
                    <Descriptions.Item label="投保联系人">{insurancePersonInfo.policyholderContactName}</Descriptions.Item>
                    <Descriptions.Item label="联系电话">{insurancePersonInfo.policyholderContactPhone}</Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </div>

            <div className={styles.stepButtons}>
              <Space>
                <Button onClick={handleModalClose}>关闭</Button>
                <Button onClick={handlePrev}>上一步</Button>
                <Button 
                  type="primary" 
                  onClick={handleCreateInsurance}
                  loading={loading}
                >
                  创建
                </Button>
              </Space>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InsuranceModal; 