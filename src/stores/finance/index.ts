import { makeAutoObservable } from "mobx";

interface SettlementRecord {
  id?: string;
  settlementNo: string;
  orderNo?: string;
  amount?: number;
  amountStr?: string;
  fundTypeDesc?: string;
  productTypeDesc?: string;
  vendorName?: string;
  receiveBankCardInfo?: any;
  statusDesc?: string;
  status?: string;
  createTime?: string;
  [key: string]: any;
}

class FinanceStore {
    constructor() {
        makeAutoObservable(this);
    }

    settlementList: SettlementRecord[] = [];
    currentSettlement: SettlementRecord | null = null;

    setSettlementList = (val: SettlementRecord[]) => {
        this.settlementList = val;
    }

    // 根据 settlementNo 获取结算单详情
    getSettlementById = (settlementNo: string): SettlementRecord | null => {
        return this.settlementList.find(item => 
            item.settlementNo === settlementNo || item.id === settlementNo
        ) || null;
    }

    // 设置当前查看的结算单
    setCurrentSettlement = (settlement: SettlementRecord | null) => {
        this.currentSettlement = settlement;
    }

    // 清空数据
    clear = () => {
        this.settlementList = [];
        this.currentSettlement = null;
    }
}

const financeStore = new FinanceStore();
export default financeStore;
