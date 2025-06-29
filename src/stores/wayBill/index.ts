import { makeAutoObservable } from "mobx";

class WayBillStore {
    constructor() {
        makeAutoObservable(this);
    }


    wayBilllist = [];

    setWayBillList = (val:any) => {
        this.wayBilllist = val
    }

    insurancePersonInfo:any = {};
   
    setInsurancePersonInfo = (val:any) => {
        this.insurancePersonInfo = val
    }

    
}

const wayBillStore = new WayBillStore();
export default wayBillStore;
