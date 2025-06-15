import React, { useState } from 'react'
import { Form, Input, Button, Card, message, Modal } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.css'
import { GetLoginInfoApi } from '@/services/user';

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [changePasswordVisible, setChangePasswordVisible] = useState(false)
  const [changePasswordForm] = Form.useForm()
  const navigate = useNavigate()

  const onFinish = async (values: { phone: string; password: string }) => {
    try {
      setLoading(true)
      let res = await GetLoginInfoApi({
        username: values.phone,
        password: values.password
      })
      console.log('login...res ', res)
      
      // 保存 token 到 localStorage
      if (res?.jwt) {
        localStorage.setItem('token', res.jwt)
        message.success('登录成功')
        
        // // 检查密码是否为123456
        // if (values.password === '123456') {
        //   setChangePasswordVisible(true)
        // } else {
          // 如果不是默认密码，直接跳转到首页
          navigate('/orderManage/list')
        // }
      } else {
        message.error('登录失败：未获取到有效的登录凭证')
      }
    } catch (error) {
      message.error('登录失败')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (values: {
    oldPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    try {
      if (values.newPassword !== values.confirmPassword) {
        message.error('两次输入的密码不一致')
        return
      }
      // TODO: 实现修改密码的逻辑
      console.log('修改密码:', values)
      message.success('密码修改成功')
      setChangePasswordVisible(false)
      // 修改密码成功后跳转到首页
      navigate('/orderManage')
    } catch (error) {
      message.error('密码修改失败')
    }
  }

  return (
    <div className={styles.container}>
      <Card className={styles.loginCard} title="用户登录">
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入用户名' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              maxLength={11}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度不能小于6位' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        title="修改密码"
        open={changePasswordVisible}
        onCancel={() => setChangePasswordVisible(false)}
        footer={null}
        maskClosable={false}
        closable={false}
      >
        <Form
          form={changePasswordForm}
          onFinish={handleChangePassword}
          layout="vertical"
        >
          <Form.Item
            name="oldPassword"
            label="原密码"
            rules={[
              { required: true, message: '请输入原密码' },
              { min: 6, message: '密码长度不能小于6位' }
            ]}
          >
            <Input.Password placeholder="请输入原密码" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度不能小于6位' }
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            rules={[
              { required: true, message: '请确认新密码' },
              { min: 6, message: '密码长度不能小于6位' }
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Login