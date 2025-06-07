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
const Login = lazy(() => import('../pages/Login'))

const menuRoutes: MenuRoute[] = [
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        name: '登录',
        path: '/login',
        element: <Login />
      },
    ]
  },
  {
    name: '登录',
    path: '/login',
    element: <Login />
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
        const { path, auth, element, loader, children } = item
        routes.push({
          // index,
          loader,
          path,
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