import React, { useState, useEffect } from 'react'
import { Table, DatePicker, Space, Button, Input, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { RangePickerProps } from 'antd/es/date-picker'
import { SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import styles from './index.module.css'

const { RangePicker } = DatePicker

interface OperationLogData {
  id: string
  operationTime: string
  name: string
  operationType: string
  params: string
  phone: string
}

// 操作类型选项
const operationTypes = [
  { label: '新增员工', value: '新增员工' },
  { label: '编辑员工', value: '编辑员工' },
  { label: '删除员工', value: '删除员工' },
  { label: '新增角色', value: '新增角色' },
  { label: '编辑角色', value: '编辑角色' },
  { label: '删除角色', value: '删除角色' },
]

// 模拟操作记录数据
const mockData: OperationLogData[] = [
  {
    id: '1',
    operationTime: '2024-01-01 10:00:00',
    name: '张三',
    operationType: '新增员工',
    params: '{"name":"李四","phone":"13800138001","department":"技术部"}',
    phone: '13800138000'
  },
  {
    id: '2',
    operationTime: '2024-01-01 11:00:00',
    name: '李四',
    operationType: '编辑角色',
    params: '{"roleId":"1","name":"管理员","staffIds":["1","2"]}',
    phone: '13800138001'
  },
  {
    id: '3',
    operationTime: '2024-01-01 12:00:00',
    name: '王五',
    operationType: '删除员工',
    params: '{"staffId":"3"}',
    phone: '13800138002'
  },
  {
    id: '4',
    operationTime: '2024-01-01 13:00:00',
    name: '赵六',
    operationType: '新增角色',
    params: '{"name":"普通用户","staffIds":["4","5"]}',
    phone: '13800138003'
  },
  {
    id: '5',
    operationTime: '2024-01-01 14:00:00',
    name: '钱七',
    operationType: '编辑员工',
    params: '{"staffId":"5","department":"财务部","role":"财务专员"}',
    phone: '13800138004'
  }
]

const OperationLog: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<OperationLogData[]>([])
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
  const [operatorName, setOperatorName] = useState('')
  const [operationType, setOperationType] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  // 获取操作记录列表
  const fetchOperationLogList = async (params = {}) => {
    try {
      setLoading(true)
      // 使用模拟数据
      let filteredData = [...mockData]

      // 根据时间范围筛选
      if (dateRange) {
        const [start, end] = dateRange
        filteredData = filteredData.filter(item => {
          const operationTime = dayjs(item.operationTime)
          return operationTime.isAfter(start) && operationTime.isBefore(end)
        })
      }

      // 根据操作人筛选
      if (operatorName) {
        filteredData = filteredData.filter(item =>
          item.name.toLowerCase().includes(operatorName.toLowerCase())
        )
      }

      // 根据操作类型筛选
      if (operationType) {
        filteredData = filteredData.filter(item => item.operationType === operationType)
      }

      setDataSource(filteredData)
      setPagination(prev => ({
        ...prev,
        total: filteredData.length,
      }))
    } catch (error) {
      console.error('获取操作记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOperationLogList()
  }, [dateRange, operatorName, operationType, pagination.current, pagination.pageSize])

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination)
  }

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates)
  }

  const handleOperatorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOperatorName(e.target.value)
  }

  const handleOperationTypeChange = (value: string | null) => {
    setOperationType(value)
  }

  const handleReset = () => {
    setDateRange(null)
    setOperatorName('')
    setOperationType(null)
  }

  const columns: ColumnsType<OperationLogData> = [
    {
      title: '操作时间',
      dataIndex: 'operationTime',
      key: 'operationTime',
      width: 180,
      sorter: (a, b) => dayjs(a.operationTime).unix() - dayjs(b.operationTime).unix(),
    },
    {
      title: '操作人',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 120,
    },
    {
      title: '操作参数',
      dataIndex: 'params',
      key: 'params',
      width: 300,
      render: (params: string) => {
        try {
          const parsedParams = JSON.parse(params)
          return (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(parsedParams, null, 2)}
            </pre>
          )
        } catch {
          return params
        }
      },
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
  ]

  // 禁用未来日期
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current > dayjs().endOf('day')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Space size="middle">
          <RangePicker
            showTime
            value={dateRange}
            onChange={handleDateRangeChange}
            disabledDate={disabledDate}
            placeholder={['开始时间', '结束时间']}
          />
          <Input
            placeholder="搜索操作人"
            prefix={<SearchOutlined />}
            value={operatorName}
            onChange={handleOperatorNameChange}
            style={{ width: 200 }}
          />
          <Select
            placeholder="选择操作类型"
            value={operationType}
            onChange={handleOperationTypeChange}
            options={operationTypes}
            style={{ width: 200 }}
            allowClear
          />
          <Button onClick={handleReset}>重置</Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`
        }}
        onChange={handleTableChange}
      />
    </div>
  )
}

export default OperationLog 