import { makeAutoObservable } from 'mobx';
import { OrderDetailInfo } from '@/pages/OrderManage/OrderDetail/interface';

interface OrderListItem {
  applicationId: string;
  orderNo: string;
  orderId: string | null;
  applyDate: number;
  createTime: number;
  taskCode: string[];
  taskCodeDesc: string[];
  orderStatusDesc: string;
  applicationStatus: number;
  applicationStatusDesc: string;
  regionId: string | null;
  areaName: string | null;
  vendorName: string;
  sellerName: string;
  providerId: number;
  providerName: string;
  providerUserId: number;
  providerUserName: string;
  providerUserPhone: string;
  isMakeOrder: boolean;
  isSurvey: string;
  contractAmount: number;
  contractAmountCNY: string;
  loanAmount: number | null;
  loanAmountCNY: string | null;
  managerId: number | null;
  manager: string | null;
  managerNick: string | null;
  userName: string;
  userMobile: string;
  contactsName: string;
  contactsPhone: string;
  storeId: string | null;
  wareHouseDetail: any;
  transportInfo: any;
  carCount: number;
  carList: Array<{
    vehicleName: string;
    emission: string;
    vin?: string;
  }>;
  carDetail: Array<{
    modelName: string;
    uniqueNum: number;
    carUniqueList: string[];
  }>;
  productType: number;
  productTypeDesc: string;
  dealerId: number;
  userId: number;
  signerName: string;
  signerMobile: string;
  lowerReaches: string | null;
  lowerReachesId: string | null;
  upperReaches: string | null;
  upperReachesId: string | null;
  labelInfo: any;
  orderSourceNum: string | null;
  createInvoice: any;
  isExtension: any;
  [key: string]: any;
}

class OrderStore {
  // 订单列表数据
  orderList: OrderListItem[] = [];
  
  // 当前查看的订单详情
  currentOrder: OrderDetailInfo | null = null;
  
  // 加载状态
  loading = false;
  
  // 分页信息
  pagination = {
    current: 1,
    pageSize: 20,
    total: 0,
  };

  constructor() {
    makeAutoObservable(this);
  }

  // 设置订单列表数据
  setOrderList(data: OrderListItem[]) {
    this.orderList = data;
  }

  // 根据订单号获取订单数据
  getOrderByNo(orderNo: string): OrderListItem | null {
    return this.orderList.find(order => order.orderNo === orderNo) || null;
  }

  // 设置当前查看的订单
  setCurrentOrder(order: OrderDetailInfo | null) {
    console.log('...order', order)
    this.currentOrder = order;
  }

//   // 将订单列表数据转换为详情页面所需的格式
//   convertToOrderDetail(orderData: OrderListItem): OrderDetailInfo {
//     console.log('...orderData', orderData)
//     return {
//       id: orderData.applicationId,
//       orderNumber: orderData.orderNo,
//       productName: orderData.carDetail?.[0]?.modelName || '暂无',
//       productType: orderData.productTypeDesc || '暂无',
//       applyTime: new Date(orderData.createTime).toLocaleString(),
//       status: this.getStatusByCode(orderData.applicationStatus),
      
//       // 经销商信息
//       dealer: orderData.vendorName || '暂无',
//       dealerManager: orderData.manager || orderData.userName || '暂无',
//       applicant: orderData.contactsName || '暂无',
//       dealerContact: orderData.contactsPhone || '暂无',
//       dealerBusinessScope: '汽车销售',
      
//       // 供应商信息
//       supplier: orderData.sellerName || orderData.providerName || '暂无',
//       supplierContact: orderData.providerUserName || '暂无',
//       supplierContactInfo: orderData.providerUserPhone || '暂无',
      
//       // 支付凭证（暂时为空，后续可从API获取）
//       depositVoucher: [],
//       principalInterestVoucher: [],
//       serviceFeeVoucher: [],
//       storageFeeVoucher: [],
//       logisticsFeeVoucher: [],
      
//       // 其他照片
//       otherPhotos: [],
      
//       // 车辆信息
//       carList: this.convertVehicleData(orderData),
      
//       // 仓储信息（暂时为空，后续可从API获取）
//       storageInfo: [],
      
//       // 物流信息（暂时为空，后续可从API获取）
//       logisticsInfo: [],
      
//       // 结算信息（暂时为空，后续可从API获取）
//       settlementInfo: [],
      
//       // 账户信息（暂时为空，后续可从API获取）
//       accountInfo: {
//         accountName: orderData.vendorName || '暂无',
//         openingBank: '暂无',
//         bankAccount: '暂无',
//         accountStatus: 'normal',
//       },
//     };
//   }

//   // 转换车辆数据
//   private convertVehicleData(orderData: OrderListItem) {
//     const vehicles: any[] = [];
    
//     if (orderData.carDetail) {
//       orderData.carDetail.forEach((car, index) => {
//         const carInfo = orderData.carList?.[index];
//         vehicles.push({
//           id: `${orderData.applicationId}-${index}`,
//           status: 'normal',
//           vin: car.carUniqueList?.[0] || carInfo?.vin || '暂无',
//           specification: '暂无',
//           model: car.modelName,
//           appearance: '暂无',
//           interior: '暂无',
//           msrp: Math.round(orderData.contractAmount / orderData.carCount) || 0,
//           appraisedPrice: Math.round(orderData.contractAmount / orderData.carCount * 0.9) || 0,
//           deposit: Math.round(orderData.contractAmount / orderData.carCount * 0.1) || 0,
//           depositRate: 0.1,
//           contractPrice: Math.round(orderData.contractAmount / orderData.carCount) || 0,
//           downPayment: Math.round(orderData.contractAmount / orderData.carCount * 0.3) || 0,
//           inspectionPhotos: [],
//           damagePhotos: [],
//           documents: [],
//         });
//       });
//     }
    
//     return vehicles;
//   }

//   // 根据状态码获取状态
//   private getStatusByCode(status: number): 'pending' | 'approved' | 'rejected' {
//     switch (status) {
//       case 1:
//       case 2:
//       case 3:
//       case 4:
//       case 5:
//         return 'pending';
//       case 6:
//       case 7:
//         return 'approved';
//       case 8:
//       case 9:
//         return 'rejected';
//       default:
//         return 'pending';
//     }
//   }

  // 设置加载状态
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  // 设置分页信息
  setPagination(pagination: typeof this.pagination) {
    this.pagination = pagination;
  }

  // 清空数据
  clear() {
    this.orderList = [];
    this.currentOrder = null;
    this.pagination = {
      current: 1,
      pageSize: 20,
      total: 0,
    };
  }
}

const orderStore = new OrderStore();
export default orderStore;
