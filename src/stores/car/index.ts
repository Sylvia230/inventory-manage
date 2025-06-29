import { makeAutoObservable } from "mobx";

class CarInfoStore {
    constructor() {
        makeAutoObservable(this);
    }


    carRegulations = [];

    setCarRegulations = (val:any) => {
        this.carRegulations = val
    }


    
}

const carInfoStore = new CarInfoStore();
export default carInfoStore;
