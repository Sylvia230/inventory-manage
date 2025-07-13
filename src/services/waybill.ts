import { yApiRequest } from '@/services';
import type { ResponseData } from '@/services/typings';

// 照片类型枚举
export enum PhotoType {
  FRONT_LEFT_45 = '1', // 左前45度照片
  FRONT_LEFT_DOOR_A_PILLAR = '2', // 左前门含A柱照片
  REAR_LEFT_DOOR = '3', // 左后门照片
  REAR_WHEEL_HUB = '4', // 后轮轮毂照片
  CENTER_CONSOLE = '5', // 中控台照片
  DASHBOARD = '6', // 仪表盘照片
  RIGHT_REAR_45 = '7', // 右后45度照片
  RIGHT_FRONT_DOOR_A_PILLAR = '8', // 右前门含A柱的照片
  NAMEPLATE = '9', // 铭牌照片
  INVENTORY_FORM = '10', // 商品车入库信息采集表
  ENGINE_BAY = '11' // 发动机舱
}

// 照片信息接口
export interface PhotoInfo {
  id: string;
  type: PhotoType;
  url: string;
  uploadTime: string;
  fileName: string;
}

// 车辆信息接口
export interface VehicleInfo {
  id: string;
  vin: string; // 车架号
  model: string; // 车型
  interior: string; // 内饰
  exterior: string; // 外饰
  targetWarehouse: string; // 目的仓库
  contractPrice: number; // 合同价
  guidePrice: number; // 指导价
  estimatedArrivalTime: string; // 预计车辆到达时间
  isDamaged: boolean; // 是否质损
  photos: PhotoInfo[]; // 照片列表
}

// 运单记录接口
export interface WaybillRecord {
  id: string;
  key: string;
  waybillNo: string;
  startLocation: string;
  endLocation: string;
  driverPhone: string;
  estimatedArrivalTime: string;
  insuranceNo: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
}

// 运单详情接口
export interface WaybillDetailData {
  // 运单基本信息
  id: string;
  waybillNo: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  statusDesc: string;
  startLocation: string;
  endLocation: string;
  orderTime: string;
  pickupTime: string;
  senderProvince: string;
  senderCity: string;
  senderAddress: string; 
  warehouseName: string;
  pickupTimeStr: string;
  inWarehouseTimeStr: string;
  carInfo: any[];
  reachTimeStr: string;
  orderDTO: {
    orderNo: string;
    managerName: string;
    vendorName: string;
    sellerName: string;
    carCount: number;
    carList: any[];
  }
  wmsWarehouseDTO: {
    keeperName: string;
    keeperPhone: string;
    provinceName: string;
    cityName: string;
    address: string;
    warehouseAddress: string;
  }
  
  // 订单宝信息
  orderNo: string;
  businessManager: string;
  dealer: string;
  supplier: string;
  
  // 客户信息
  customerName: string;
  contactPerson: string;
  contactPhone: string;
  
  // 发车方联系方式
  pickupContact: string;
  pickupPhone: string;
  pickupAddress: string;
  
  // 收车方联系方式
  deliveryContact: string;
  deliveryPhone: string;
  deliveryAddress: string;
  
  // 车辆信息列表
  vehicles: VehicleInfo[];
}

// 运单查询参数
export interface WaybillQueryParams {
  waybillNo?: string;
  startLocation?: string;
  endLocation?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

// 批量操作类型
export type BatchOperationType = 'createInsurance' | 'completePickup' | 'vehicleArrival' | 'cancelInsurance' | 'uploadDeliveryDoc' | 'startTransport';

// 获取运单列表
export const getWaybillList = async (params: WaybillQueryParams): Promise<ResponseData<{
  list: WaybillRecord[];
  total: number;
}>> => {
  return yApiRequest.post('/tmsWaybill/pageQuery', params).then(res => res.result);
};

// export function GetLoginInfoApi(data: any) {
// 	return axios.post<unknown, any>('/auth/login', data).then(res => res.result);
// }
// 获取运单详情
export const getWaybillDetailApi = async (id: string): Promise<ResponseData<WaybillDetailData>> => {
  return yApiRequest.get(`/tmsWaybill/detail`, {
    id
  }).then(res => res.result);
};

// 更新运单状态
export const updateWaybillStatus = async (id: string, status: string): Promise<ResponseData<any>> => {
  return yApiRequest.post('/waybill/status', { id, status });
};

// 创建运单
export const createWaybill = async (data: Partial<WaybillDetailData>): Promise<ResponseData<any>> => {
  return yApiRequest.post('/waybill/create', data);
};

// 删除运单
export const deleteWaybillApi = async (id: string): Promise<ResponseData<any>> => {
  return yApiRequest.post('/waybill/delete', { id });
};

//提车
export const completePickupApi = async (params:any): Promise<ResponseData<any>> => {
  return yApiRequest.post('/tmsWaybill/pickup', params).then(res => res.result);
};

// 车辆到达
export const vehicleArrivalApi = async (params:any): Promise<ResponseData<any>> => {
  return yApiRequest.post('/tmsWaybill/reach', params).then(res => res.result);
};

// 上传车辆照片
export const uploadVehiclePhoto = async (
  vehicleId: string, 
  file: File, 
  photoType: PhotoType
): Promise<ResponseData<PhotoInfo>> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('vehicleId', vehicleId);
  formData.append('photoType', photoType);
  return yApiRequest.post('/waybill/vehicle/upload-photo', formData, {
    'Content-Type': 'multipart/form-data'
  });
};

// 获取车辆照片列表
export const getVehiclePhotos = async (vehicleId: string): Promise<ResponseData<PhotoInfo[]>> => {
  return yApiRequest.get(`/waybill/vehicle/${vehicleId}/photos`);
};

// 删除车辆照片
export const deleteVehiclePhoto = async (photoId: string): Promise<ResponseData<void>> => {
  return yApiRequest.post(`/waybill/vehicle/photo/${photoId}/delete`);
};

// 创建车辆保单
export const createVehicleInsurance = async (data: {
  vehicleIds: string[];
  effectiveDate: string;
  insuranceInfo: any;
}): Promise<ResponseData<any>> => {
  return yApiRequest.post('/waybill/vehicle/create-insurance', data);
};

// 批量操作车辆
export const batchOperateVehicles = async (
  vehicleIds: string[], 
  operation: BatchOperationType,
  extraData?: any
): Promise<ResponseData<any>> => {
  return yApiRequest.post('/waybill/vehicle/batch-operate', { 
    vehicleIds, 
    operation, 
    ...extraData 
  });
}; 

// 上传文件/图片接口
export const uploadFileApi = async (data: any): Promise<ResponseData<any>> => {
  const formData = new FormData();
  formData.append('file', data.file);
  return yApiRequest.post(`/file/upload`, formData, {
    'Content-Type': 'multipart/form-data'
  });
};

// 上传保单接口
export const createInsuranceApi = async (data: any): Promise<ResponseData<any>> => {
  return yApiRequest.post('/tmsWaybill/createInsurance', data);
};

// 投保人接口
export const getInsurancePersonApi = async (data: any): Promise<ResponseData<any>> => {
  return yApiRequest.post('/tmsWaybill/insuranceObjectInfo', data);
};

// 批量提交验车照片，上传验车信息
export const saveBatchInspectionApi = async (data: any): Promise<ResponseData<any>> => {
  return yApiRequest.post('/inspectionCar/saveBatchInspection', data);
};