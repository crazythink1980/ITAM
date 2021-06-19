import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import './index.less'


/*
登录的路由组件
 */


class Login extends Component {

    render() {
        return (
            <div className="login">
                <div className="login-content">
                    <h2>IT资产管理系统</h2>
                    <Form className="login-form">
                        <Form.Item>
                            <Input placeholder="用户名" prefix={<UserOutlined />} />
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder="密码" type="password" prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Login;
