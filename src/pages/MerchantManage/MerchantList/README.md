# 商家管理页面标签功能说明

## 功能概述

商家管理页面的标签功能允许用户为商家添加标签，支持从现有标签中选择或创建新标签。

## 主要功能

### 1. 标签选择功能

#### 功能入口
- 在商家列表的操作列中有"新增标签"按钮
- 点击按钮弹出添加标签弹窗

#### 标签选择弹窗
- **标签选择器**: 支持搜索和选择标签
  - 调用`GetTagListApi`接口获取现有标签
  - 支持按标签名称搜索
  - 如果输入的标签不存在，会自动添加为新标签选项

### 2. 标签匹配逻辑

#### 现有标签匹配
- 当用户输入搜索文本时，调用`GetTagListApi`接口
- 接口参数：`{ page: 1, pageSize: 100, name: searchText }`
- 将返回的标签数据转换为Select组件需要的格式

#### 新标签创建
- 如果用户输入的标签名称在现有标签中不存在
- 会自动在选项列表顶部添加新标签选项
- 新标签选项标记为`isNew: true`，颜色为绿色

### 3. 标签提交逻辑

#### 标签类型判断
- 检查选中的标签是否为新建标签
- 通过`isNew`属性判断是否为新标签
- 新标签的`value`不包含ID格式

#### 新标签处理
- 如果是新标签，先调用`AddTagApi`创建标签
- 创建成功后获取新标签的ID
- 然后调用商家标签关联API

#### 现有标签处理
- 直接使用现有标签的ID
- 调用商家标签关联API

### 4. 用户体验优化

#### 搜索防抖
- 使用`lodash/debounce`实现500ms防抖
- 避免频繁调用API接口

#### 加载状态
- 搜索时显示加载动画
- 提交时显示确认按钮加载状态

#### 错误处理
- API调用失败时显示错误提示
- 表单验证失败时阻止提交

## API接口

### 获取标签列表
```typescript
GetTagListApi(params: {
  page: number;
  pageSize: number;
  name?: string;
})
```

### 创建新标签
```typescript
AddTagApi(params: {
  name: string;
  color?: string;
})
```

### 添加商家标签（待实现）
```typescript
AddMerchantTagApi(params: {
  vendorId: string;
  tagId: string;
})
```

## 数据结构

### 标签选项接口
```typescript
interface TagOption {
  value: string;
  label: string;
  color?: string;
  isNew?: boolean;
}
```

### API返回的标签数据格式
```typescript
interface TagApiResponse {
  id: string;
  name: string;
  color?: string;
}
```

## 状态管理

### 标签相关状态
- `selectedTags`: 选中的标签数组
- `tagOptions`: 标签选项列表
- `fetching`: 标签搜索加载状态
- `tagModalVisible`: 标签弹窗显示状态

## 实现细节

### 1. 标签搜索逻辑
```typescript
const fetchTagOptions = async (searchText: string) => {
  // 调用API获取标签列表
  const response = await GetTagListApi({
    page: 1,
    pageSize: 100,
    name: searchText || undefined
  });
  
  // 转换数据格式
  const tagData = response.result.map((item: any) => ({
    value: item.id,
    label: item.name,
    color: item.color || 'blue'
  }));
  
  // 添加新标签选项
  if (searchText && !tagData.some((tag: any) => 
    tag.label.toLowerCase() === searchText.toLowerCase()
  )) {
    tagData.unshift({
      value: searchText,
      label: searchText,
      color: 'green',
      isNew: true
    });
  }
  
  setTagOptions(tagData);
};
```

### 2. 标签提交逻辑
```typescript
const handleTagSubmit = async (values: any) => {
  // 检查是否选择了标签
  if (!selectedTags || selectedTags.length === 0) {
    message.warning('请选择或输入标签');
    return;
  }

  // 判断是否为新标签
  const selectedTag = tagOptions.find(tag => tag.value === selectedTags[0]);
  const isNewTag = selectedTag && selectedTag.isNew;

  if (isNewTag) {
    // 创建新标签
    const createTagRes = await AddTagApi({
      name: selectedTag.label,
      color: selectedTag.color || 'blue'
    });
  }

  // 关联商家和标签
  // await AddMerchantTagApi({
  //   vendorId: selectedMerchant?.id,
  //   tagId: isNewTag ? createTagRes.id : selectedTags[0]
  // });
};
```

## 注意事项

1. 新标签创建时会自动设置颜色为绿色
2. 标签搜索支持模糊匹配
3. 防抖处理避免频繁API调用
4. 错误处理确保用户体验
5. 表单验证防止空标签提交
6. 状态重置确保弹窗数据清空

## 扩展功能

### 未来可能的改进
1. 支持多标签选择
2. 标签颜色自定义
3. 标签分类管理
4. 标签使用统计
5. 标签权限控制 