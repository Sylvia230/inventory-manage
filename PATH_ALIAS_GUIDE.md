# @路径别名使用指南

## 配置完成

您的项目已经成功配置了@路径别名，现在可以使用`@/`来引用`src/`目录下的文件。

## 使用方法

### 1. 导入组件
```typescript
// 之前
import Layout from '../components/Layout'

// 现在
import Layout from '@/components/Layout'
```

### 2. 导入页面
```typescript
// 之前
import OrderList from '../pages/OrderManage/OrderList'

// 现在
import OrderList from '@/pages/OrderManage/OrderList'
```

### 3. 导入服务
```typescript
// 之前
import { yApiRequest } from '../services'

// 现在
import { yApiRequest } from '@/services'
```

### 4. 导入工具函数
```typescript
// 之前
import { formatDate } from '../utils'

// 现在
import { formatDate } from '@/utils'
```

### 5. 导入常量
```typescript
// 之前
import { BASE_URL } from '../constants'

// 现在
import { BASE_URL } from '@/constants'
```

### 6. 导入样式
```typescript
// 之前
import styles from '../styles/global.less'

// 现在
import styles from '@/styles/global.less'
```

## 常用路径别名

| 别名 | 对应路径 | 说明 |
|------|----------|------|
| `@/components` | `src/components` | 组件目录 |
| `@/pages` | `src/pages` | 页面目录 |
| `@/services` | `src/services` | 服务目录 |
| `@/utils` | `src/utils` | 工具函数目录 |
| `@/constants` | `src/constants` | 常量目录 |
| `@/styles` | `src/styles` | 样式目录 |
| `@/assets` | `src/assets` | 静态资源目录 |

## 配置说明

### Vite配置 (vite.config.ts)
```typescript
resolve: {
  alias: {
    '@': resolve(__dirname, 'src')
  }
}
```

### TypeScript配置 (tsconfig.json & tsconfig.app.json)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### ESLint配置 (eslint.config.js)
```javascript
languageOptions: {
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: resolve(__dirname),
  },
}
```

## 优势

1. **更清晰的导入路径**：不需要使用复杂的相对路径
2. **更好的可维护性**：文件移动时不需要修改导入路径
3. **更好的IDE支持**：自动补全和跳转功能
4. **减少路径错误**：避免手动计算相对路径的错误

## 测试

运行以下命令测试配置是否正确：

```bash
npm run dev
```

如果配置正确，项目应该能够正常启动，并且可以使用@路径别名导入文件。 