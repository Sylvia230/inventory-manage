// import { RouteObject } from 'react-router-dom';
// import Login from '../pages/Login';
// // 定义路由配置
// export const routes: RouteObject[] = [
//   {
//     path: '/',
//     element: <Login />,
//   },
//   // 这里可以添加更多路由
 
// ]; 

import { TableOutlined } from '@ant-design/icons'
import  { lazy } from 'react'
import { Link, Navigate, RouteObject } from 'react-router-dom'

import AdminLayout from '../components/Layout'
import { BreadcrumbMap, MenuItem, MenuRoute, RoutesType } from './interface'
const Login = lazy(() => import('../pages/Login'));
const TaskCenter = lazy(() => import('../pages/TaskCenter'));
const WareHouse = lazy(() => import('../pages/WareHouse'));
const MerchantManage = lazy(() => import('../pages/MerchantManage'));
const SignatureManage = lazy(() => import('../pages/MerchantManage/Signature'));
const Waybill = lazy(() => import('../pages/Waybill'));
const WaybillList = lazy(() => import('../pages/Waybill/WaybillList/index'));
const WaybillDetail = lazy(() => import('../pages/Waybill/WaybillDetail/index'));
const FinanceManage = lazy(() => import('../pages/FinanceManage'));
const ContractManage = lazy(() => import('../pages/ContractManage'));
const ContractList = lazy(() => import('../pages/ContractManage/ContractList/index'));
const BusinessConfig = lazy(() => import('../pages/CapitalManage/BusinessConfig'));
const Template = lazy(() => import('../pages/ContractManage/Template/index'));
const CapitalManage = lazy(() => import('../pages/CapitalManage'));
const CapitalList = lazy(() => import('../pages/CapitalManage/CapitalList/index'));
const UserManage = lazy(() => import('../pages/UserManage'));
const StaffManage = lazy(() => import('../pages/UserManage/Staff/index'));
const DepartmentManage = lazy(() => import('../pages/UserManage/Department/index'));
const RoleManage = lazy(() => import('../pages/UserManage/Role/index'));
const OperationLog = lazy(() => import('../pages/UserManage/OperationLog/index'));
const OrderList = lazy(() => import('../pages/OrderManage/OrderList/index'));
const OrderDetail = lazy(() => import('../pages/OrderManage/OrderDetail/index'));
const VehicleManage = lazy(() => import('../pages/VehicleManage/index'));
const PriceCheck = lazy(() => import('../pages/TaskCenter/PriceCheck'));
const PriceCheckDetail =  lazy(() => import('../pages/TaskCenter/PriceCheck/PriceCheckDetail'));
const PreSaleLetter = lazy(() => import('../pages/PreSaleLetter'));
const BlackListManage = lazy(() => import('../pages/MerchantManage/BlackList'));
const MerchantList = lazy(() => import('../pages/MerchantManage/MerchantList'));
const CreditLimit = lazy(() => import('../pages/MerchantManage/CreditLimit'));
const PushToInvestor = lazy(() => import('../pages/TaskCenter/PushToInvestor'));
const WarehouseList = lazy(() => import('../pages/WareHouse/WarehouseList/index'));
const VehicleListInStock = lazy(() => import('../pages/WareHouse/VehicleList/index'));
const VehicleIn = lazy(() => import('../pages/WareHouse/VehicleIn/index'));
const VehicleOut = lazy(() => import('../pages/WareHouse/VehicleOut/index')); 
const VehicleSettlement = lazy(() => import('../pages/WareHouse/Settlement/index')); 
const BankCard = lazy(() => import('../pages/FinanceManage/BankCard/index'));
const PaymentRequest = lazy(() => import('../pages/FinanceManage/PaymentRequest/index'));
const Settlement = lazy(() => import('../pages/FinanceManage/Settlement/index'));
const SettlementAudit = lazy(() => import('../pages/FinanceManage/Settlement/AuditDetail/index'));
const SettlementDetail = lazy(() => import('../pages/FinanceManage/Settlement/SettlementDetail/index'));
// const Dashboard = lazy(() => import('../pages/Dashboard'));

const menuRoutes: MenuRoute[] = [
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      // {
      //   path: 'dashboard',
      //   element: <Dashboard />,
      // },
      {
        path: '/orderManage/list',
        name: '订单管理',
        element: <OrderList />
      },
      {
        path: '/orderManage/detail/:id',
        name: '订单详情',
        element: <OrderDetail />,
        hideInMenu: true
      },
      {
        path: '/userManage',
        name: '用户管理',
        element: <UserManage />,
        children: [
          {
            path: '/userManage/staff',
            name: '员工管理',
            element: <StaffManage />
          },
          {
            path: '/userManage/department',
            name: '部门管理',
            element: <DepartmentManage />
          },
          {
            path: '/userManage/role',
            name: '角色管理',
            element: <RoleManage />
          },
          {
            path: '/userManage/record',
            name: '操作记录',
            element: <OperationLog />
          },
        ]
      },
       // 车型管理路由
      {
        path: '/vehicle',
        name: '车型管理',
        element: <VehicleManage/>,
        children: [
          {
            path: '/vehicle/list',
            name: '车系准入',
            element: <VehicleManage/>,
          },
        ],
      },
      {
        name: '任务中心',
        path: '/taskCenter',
        element: <TaskCenter />,
        children: [
          {
            name: '车辆核价',
            path: '/taskCenter/priceCheck',
            element: <PriceCheck />
          },
          {
            name: '核价处理',
            path: '/taskCenter/priceCheckDetail/:id',
            element: <PriceCheckDetail />,
            hideInMenu: true
          },
        
          {
            name: '推送到资方',
            path: '/taskCenter/investor',
            element: <PushToInvestor />
          },
          {
            name: '预授信',
            path: '/taskCenter/preSaleLetter',
            element: <PreSaleLetter />
          },
        ]
      },
      {
        name: '仓储管理',
        path: '/warehouse',
        element: <WareHouse />,
        children: [
          {
            name: '仓库列表',
            path: '/warehouse/list',
            element: <WarehouseList />
          },
          {
            name: '在库车辆',
            path: '/warehouse/inStock',
            element: <VehicleListInStock />
          },
          {
            name: '入库管理',
            path: '/warehouse/store',
            element: <VehicleIn />
          },
          {
            name: '出库管理',
            path: '/warehouse/outStock',
            element: <VehicleOut />
          },
          // {
          //   name: '仓储结算单', //不要啦
          //   path: '/warehouse/settlement',
          //   element: <VehicleSettlement />
          // },
        ]
      },
      {
        name: '运单管理',
        path: '/waybill',
        element: <Waybill />,
        children: [
          {
            name: '运单列表',
            path: '/waybill/list',
            element: <WaybillList />
          },
          {
            name: '运单详情',
            path: '/waybill/detail/:id',
            element: <WaybillDetail />,
            hideInMenu: true
          },
        ]
      },
      {
        name: '商家管理',
        path: '/merchant',
        element: <MerchantManage />,
        children: [
          {
            name: '商家列表',
            path: '/merchant/list',
            element: <MerchantList />
          },
          {
            name: '授信额度管理',
            path: '/merchant/creditLimit',
            element: <CreditLimit />
          },
          {
            name: '黑名单管理',
            path: '/merchant/blacklist',
            element: <BlackListManage />
          },
          {
            name: '签章人管理',
            path: '/merchant/signature',
            element: <SignatureManage />
          },
        ]
      },
      {
        name: '财务管理',
        path: '/financeManage',
        element: <FinanceManage />,
        children: [
          {
            name: '银行卡管理',
            path: '/financeManage/bankCard',
            element: <BankCard />
          },
          {
            name: '请款单管理',
            path: '/financeManage/payment',
            element: <PaymentRequest />
            
          },
          {
            name: '结算单管理',
            path: '/financeManage/balance',
            element: <Settlement />
          },
          {
            name: '结算单审核',
            path: '/financeManage/settlement/audit/:id',
            element: <SettlementAudit />,
            hideInMenu: true
          },
          {
            name: '结算单详情',
            path: '/financeManage/settlement/detail/:settlementId',
            element: <SettlementDetail />,
            hideInMenu: true
          },
        ]
      },
      {
        name: '合同管理',
        path: '/contract',
        element: <ContractManage />,
        children: [
          {
            name: '模板管理',
            path: '/contract/template',
            element: <Template />
          },
          {
            name: '合同列表',
            path: '/contract/list',
            element: <ContractList />
          },
        ]
      },
      {
        name: '资方管理',
        path: '/capitalManage',
        element: <CapitalManage />,
        children: [
          {
            name: '资方列表',
            path: '/capitalManage/list',
            element: <CapitalList />
          },
          {
            name: '业务配置',
            path: '/capitalManage/businessConfig',
            element: <BusinessConfig />
          },
        ]
      },
      {
        name: '报表',
        path: '/dataForm',
        element: <TaskCenter />,
      },
    ],
  },
  {
    path: '/login',
    name: '登录',
    element: <Login />,
  }
]
const extractMenuItems = (menuRoutes: MenuRoute[] = []) => {
  const breadcrumbNameMap: BreadcrumbMap<MenuRoute> = {}

  const recurExtractMenuItems = (menuRoutes: MenuRoute[], menuItems: MenuItem[]) => {
    if (menuRoutes?.length) {
      menuRoutes.forEach((item: MenuRoute) => {
        const { name, path, icon, hideInMenu, children } = item
        breadcrumbNameMap[path] = name as string
        if (!hideInMenu) {
          menuItems.push({
            key: path,
            icon: icon,
            label: name,
            ...(children?.length
              ? {
                  children: recurExtractMenuItems(children, [])
                }
              : {})
          })
        }
      })
    }
    return menuItems
  }
  const menuItems = recurExtractMenuItems(menuRoutes, [])
  return { menuItems, breadcrumbNameMap }
}

// extract routes for react-router-dom6
const extractRoutes = (menuRoutes: MenuRoute[]) => {
  const recurExtractRoutes = (menuRoutes: MenuRoute[], routes: RoutesType[]) => {
    if (menuRoutes?.length) {
      menuRoutes.forEach((item: MenuRoute) => {
        const { path,name,  element, loader, children } = item
        routes.push({
          loader,
          path,
          name,
          element: element,
          ...(children?.length
            ? {
                children: recurExtractRoutes(children, [])
              }
            : {})
        })
      })
    }
    return routes
  }
  return recurExtractRoutes(menuRoutes, [])
}

const { menuItems, breadcrumbNameMap } = extractMenuItems(menuRoutes[0]?.children)
console.log('menuItems', menuItems, 'breadcrumbNameMap', breadcrumbNameMap)
const routes = extractRoutes(menuRoutes)
console.log('routes', routes)

export { breadcrumbNameMap, menuItems, routes }