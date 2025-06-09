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
import { Link } from 'react-router-dom'

import AdminLayout from '../components/Layout'
import { BreadcrumbMap, MenuItem, MenuRoute, RoutesType } from './interface'
const Login = lazy(() => import('../pages/Login'));
const OrderManage = lazy(() => import('../pages/OrderManage'));
const TaskCenter = lazy(() => import('../pages/TaskCenter'));
const WareHouse = lazy(() => import('../pages/WareHouse'));
const MerchantManage = lazy(() => import('../pages/MerchantManage'));
const Waybill = lazy(() => import('../pages/Waybill'));
const FinanceManage = lazy(() => import('../pages/FinanceManage'));
const ContractManage = lazy(() => import('../pages/ContractManage'));
const CapitalManage = lazy(() => import('../pages/CapitalManage'));
const UserManage = lazy(() => import('../pages/UserManage'));
const StaffManage = lazy(() => import('../pages/UserManage/Staff/index'));
const DepartmentManage = lazy(() => import('../pages/UserManage/Department/index'));
const RoleManage = lazy(() => import('../pages/UserManage/Role/index'));
const OperationLog = lazy(() => import('../pages/UserManage/OperationLog/index'));
const OrderList = lazy(() => import('../pages/OrderManage/OrderList/index'));
const OrderDetail = lazy(() => import('../pages/OrderManage/OrderDetail/index'));
const menuRoutes: MenuRoute[] = [
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        name: '订单管理',
        path: '/orderManage',
        element: <OrderManage />,
        children: [
          {
            name: '订单列表',
            path: '/orderManage/list',
            element: <OrderList />
          },
          {
            name: '订单详情',
            path: '/orderManage/detail/:id',
            element: <OrderDetail />,
            hideInMenu: true
          }
        ]
      },
      {
        name: '用户管理',
        path: '/userManage',
        // hideInMenu: true,
        element: <UserManage />,
        children: [
          {
            name: '员工管理',
            path: '/userManage/staff',
            element: <StaffManage />
          },
          {
            name: '部门管理',
            path: '/userManage/department',
            element: <DepartmentManage />
          },
          {
            name: '角色管理',
            path: '/userManage/role',
            element: <RoleManage />
          },
          {
            name: '操作记录',
            path: '/userManage/record',
            element: <OperationLog />
          },
        ]
      },
      {
        name: '任务中心',
        path: '/taskCenter',
        element: <TaskCenter />,
        children: [
          {
            name: '车辆核价',
            path: '/taskCenter/price',
            element: <TaskCenter />
          },
          {
            name: '推送到资方',
            path: '/taskCenter/capital',
            element: <TaskCenter />
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
            element: <WareHouse />
          },
          {
            name: '在库车辆',
            path: '/warehouse/inStock',
            element: <WareHouse />
          },
          {
            name: '入库管理',
            path: '/warehouse/store',
            element: <WareHouse />
          },
          {
            name: '出库管理',
            path: '/warehouse/outStock',
            element: <WareHouse />
          },
          {
            name: '仓储结算单',
            path: '/warehouse/settlement',
            element: <WareHouse />
          },
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
            element: <Waybill />
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
            element: <MerchantManage />
          },
          {
            name: '黑名单管理',
            path: '/merchant/blackUser',
            element: <MerchantManage />
          },
          {
            name: '签章人管理',
            path: '/merchant/sign',
            element: <MerchantManage />
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
            element: <FinanceManage />
          },
          {
            name: '结算单管理',
            path: '/financeManage/balance',
            element: <FinanceManage />
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
            element: <ContractManage />
          },
          {
            name: '合同列表',
            path: '/contract/list',
            element: <ContractManage />
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
            element: <CapitalManage />
          },
          {
            name: '法律关系',
            path: '/capitalManage/law',
            element: <CapitalManage />
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
  },
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
            label: children?.length ? name : <Link to={path}>{name}</Link>,
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