export interface OrderDetailInfo {
    id: string;
    orderNumber: string;
    productName: string;
    productType: string;
    applyTime: string;
    status: 'pending' | 'approved' | 'rejected';
    
    // 经销商信息
    dealer: string;
    dealerManager: string;
    applicant: string;
    dealerContact: string;
    dealerBusinessScope: string;
    
    // 供应商信息
    supplier: string;
    supplierContact: string;
    supplierContactInfo: string;
    
    // 支付凭证
    depositVoucher?: string[];
    principalInterestVoucher?: string[];
    serviceFeeVoucher?: string[];
    storageFeeVoucher?: string[];
    logisticsFeeVoucher?: string[];
    
    // 其他照片
    otherPhotos?: string[];

    // 车辆信息
    vehicles?: VehicleData[];

    // 仓储信息
    storageInfo?: {
        model: string;
        vin: string;
        warehouseName: string;
        contactPerson: string;
        contactPhone: string;
        warehouseAddress: string;
        outboundTime: string;
        inboundTime: string;
    }[];

    // 物流信息
    logisticsInfo?: {
        model: string;
        vin: string;
        logisticsCompany: string;
        trackingNumber: string;
        deliveryTime: string;
        estimatedDeliveryTime: string;
        logisticsStatus: string;
    }[];

    // 结算信息
    settlementInfo?: {
        settlementNumber: string;
        settlementAmount: number;
        settlementStatus: string;
        settlementTime: string;
    }[];

    // 账户信息
    accountInfo?: {
        accountName: string;
        openingBank: string;
        bankAccount: string;
        accountStatus: string;
    };
    disbursementAccount?: {
        accountName: string;
        bankAccount: string;
        openingBank: string;
    };
    supplierCollectionAccount?: {
        accountName: string;
        bankAccount: string;
        openingBank: string;
    };
    dealerRepaymentAccount?: {
        accountName: string;
        bankAccount: string;
        openingBank: string;
    };
    capitalCollectionAccount?: {
        accountName: string;
        bankAccount: string;
        openingBank: string;
    };
    marginCollectionAccount?: {
        accountName: string;
        bankAccount: string;
        openingBank: string;
    };
    serviceFeeCollectionAccount?: {
        accountName: string;
        bankAccount: string;
        openingBank: string;
    };
    storageFeeCollectionAccount?: {
        accountName: string;
        bankAccount: string;
        openingBank: string;
    };
    logisticsFeeCollectionAccount?: {
        accountName: string;
        bankAccount: string;
        openingBank: string;
    };
}

export interface VehicleData {
    id: string;
    status: string;
    vin: string;
    specification: string;
    model: string;
    appearance: string;
    interior: string;
    msrp: number;
    appraisedPrice: number;
    deposit: number;
    depositRate: number;
    contractPrice: number;
    downPayment: number;
    inspectionPhotos?: string[];
    damagePhotos?: string[];
    documents?: {
        name: string;
        url: string;
    }[];
}