# 授信额度管理页面

## 功能概述

授信额度管理页面用于管理商家与资方之间的授信额度关系，包括额度查询、状态管理等。

## 主要功能

### 1. 列表展示
- **商家名称**: 显示商家全称
- **产品类型**: 新车、二手车、试驾车等
- **资方名称**: 提供授信的资方机构
- **授信额度**: 总授信金额（万元显示）
- **已用额度**: 已使用的授信金额（万元显示）
- **可用额度**: 剩余可用授信金额（万元显示）
- **使用率**: 已用额度占总授信额度的百分比，带颜色标识
- **状态**: 正常、停用、待审核等状态

### 2. 搜索功能
- 商家名称搜索
- 产品类型筛选
- 资方筛选
- 状态筛选

### 3. 操作功能
- **查看**: 查看授信额度详细信息
- **编辑**: 编辑授信额度配置（开发中）
- **删除**: 删除授信额度记录

### 4. 分页功能
- 支持分页查询
- 支持每页条数调整
- 支持快速跳转

## 数据接口

### API列表
- `GetCreditLimitListApi`: 获取授信额度列表
- `SaveCreditLimitApi`: 保存授信额度
- `DeleteCreditLimitApi`: 删除授信额度
- `GetCreditLimitDetailApi`: 获取授信额度详情

### 数据结构
```typescript
interface CreditLimitRecord {
  id: string;
  merchantId: string;
  merchantName: string;
  productType: string;
  capitalId: string;
  capitalName: string;
  creditLimit: number;
  usedLimit: number;
  availableLimit: number;
  status: 'active' | 'inactive' | 'pending';
  createTime: string;
  updateTime: string;
}
```

## 使用说明

1. **访问路径**: `/merchant/creditLimit`
2. **权限要求**: 需要商家管理相关权限
3. **数据刷新**: 页面会自动加载数据，支持手动刷新

## 注意事项

- 金额显示单位为万元，便于阅读
- 使用率超过80%显示红色警告，60%-80%显示橙色提醒
- 删除操作需要二次确认
- 编辑功能正在开发中

## 后续开发计划

- [ ] 新增授信额度功能
- [ ] 编辑授信额度功能
- [ ] 批量操作功能
- [ ] 导出功能
- [ ] 额度变更历史记录 