// 测试@路径别名是否正常工作
// 这个文件用于验证路径别名配置是否正确

// 使用@别名导入
import { BASE_URL } from '@/constants'
import type { ResponseData } from '@/services/typings'

// 测试函数
export function testPathAlias() {
  console.log('@路径别名测试:', {
    BASE_URL,
    ResponseDataType: 'ResponseData type imported successfully'
  })
  
  return {
    success: true,
    message: '@路径别名配置成功！'
  }
}

// 导出一些常用的路径别名示例
export const pathAliasExamples = {
  // 组件
  components: '@/components',
  // 页面
  pages: '@/pages',
  // 服务
  services: '@/services',
  // 工具
  utils: '@/utils',
  // 常量
  constants: '@/constants',
  // 样式
  styles: '@/styles'
} 