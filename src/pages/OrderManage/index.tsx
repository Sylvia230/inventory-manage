import React from 'react'
import { Outlet } from 'react-router-dom'
import Login from '../Login/index'

const OrderManage: React.FC = () => {
  return(
    <>
    <Login />
    {/* <Outlet /> */}
    </> 
  )
  return <Outlet />
}

export default OrderManage