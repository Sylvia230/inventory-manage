import { yApiRequest } from "./index";

// 分页查询合同模板
export function GetCapitalApi(params: any): Promise<any> {
    return yApiRequest.post('/capital/pageQuery', params).then(res => res.result);
}

// 新增资方
export function AddCapitalApi(params: any): Promise<any> {
    return yApiRequest.post('/capital/saveCapital', params).then(res => res.result);
}

// // 编辑资方
// export function EditCapitalApi(params: any): Promise<any> {
//     return yApiRequest.post('/capital/edit', params).then(res => res.result);
// }

// 删除资方
export function DeleteCapitalApi(params: any): Promise<any> {
    return yApiRequest.post(`/capital/removeCapital?id=`+params.id).then(res => res.result);
}

// 业务配置列表
export function GetBusinessConfigApi(params: any): Promise<any> {
    return yApiRequest.post('/bizConfig/pageQuery', params).then(res => res.result);
}

//保存业务类型
export function SaveBusinessConfigApi(params: any): Promise<any> {
    return yApiRequest.post('/bizConfig/saveBizConfig', params).then(res => res.result);
}