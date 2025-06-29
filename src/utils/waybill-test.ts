// 运单详情页面测试
import type { WaybillDetailData } from '@/services/waybill';

// 测试数据
export const testWaybillDetailData: WaybillDetailData = {
  waybillNo: 'WB20240301001',
  status: 'in_transit',
  startLocation: '上海市浦东新区张江高科技园区',
  endLocation: '北京市朝阳区望京SOHO',
  orderTime: '2024-03-01 10:30:00',
  pickupTime: '2024-03-01 14:00:00',
  
  orderNo: 'ORD20240301001',
  businessManager: '张三',
  dealer: '上海汽车销售有限公司',
  supplier: '北京汽车制造厂',
  
  customerName: '李四',
  contactPerson: '李四',
  contactPhone: '13800138000',
  
  pickupContact: '王五',
  pickupPhone: '13900139000',
  pickupAddress: '上海市浦东新区张江高科技园区科苑路88号',
  
  deliveryContact: '赵六',
  deliveryPhone: '13600136000',
  deliveryAddress: '北京市朝阳区望京SOHO T1座15层'
};

// 验证收车方联系方式数据
export const validateDeliveryInfo = (data: WaybillDetailData) => {
  const requiredFields = ['deliveryContact', 'deliveryPhone', 'deliveryAddress'];
  const missingFields = requiredFields.filter(field => !data[field as keyof WaybillDetailData]);
  
  if (missingFields.length > 0) {
    throw new Error(`缺少收车方联系方式字段: ${missingFields.join(', ')}`);
  }
  
  return {
    isValid: true,
    deliveryInfo: {
      contact: data.deliveryContact,
      phone: data.deliveryPhone,
      address: data.deliveryAddress
    }
  };
};

// 测试函数
export const testWaybillDetail = () => {
  try {
    const validation = validateDeliveryInfo(testWaybillDetailData);
    console.log('✅ 运单详情页面测试通过');
    console.log('📞 收车方联系方式:', validation.deliveryInfo);
    return true;
  } catch (error) {
    console.error('❌ 运单详情页面测试失败:', error);
    return false;
  }
}; 