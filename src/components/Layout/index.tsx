import { Layout, Menu, Row } from 'antd'
import  { Suspense, useMemo, useState } from 'react'
import {  Outlet, useLocation, useMatches, useNavigate } from 'react-router-dom'

import Loading from '../Loading'

import { menuItems } from '../../router'
import Header from './header'
import Login from '../../pages/Login/index'

const { Content, Sider } = Layout

export default function AdminLayout() {
  const location = useLocation()
  const matches = useMatches()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const selectedKeys = [location.pathname]
  const defaultOpenKeys = useMemo(() => {
    return matches.slice(1, -1).map((item) => item.pathname)
  }, [matches])

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  // 判断是否是根路径
  const isRootPath = location.pathname === '/'
  
  return (
    <Layout style={{ minHeight: '100%', minWidth: 960 }}>
      {isRootPath ? (
        <Login />
      ) : (
        <>
          <Sider
            width={200}
            collapsed={collapsed}
            collapsible
            onCollapse={(value) => setCollapsed(value)}
          >
            <Row justify="center">
              {collapsed ? 'Admin' : 'Admin Template'}
            </Row>
            <Menu
              theme="dark"
              mode="inline"
              style={{ height: '100vh', overflowY: 'scroll' }}
              items={menuItems}
              selectedKeys={selectedKeys}
              defaultOpenKeys={defaultOpenKeys}
              onClick={handleMenuClick}
            />
          </Sider>
          <Layout>
            <Header />
            <Content>
              <Suspense fallback={<Loading />}>
                <Outlet />
              </Suspense>
            </Content>
          </Layout>
        </>
      )}
    </Layout>
  )
}