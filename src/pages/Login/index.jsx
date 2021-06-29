import React from "react";
import { Redirect } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import "./index.less";
import { reqLogin } from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";

/*
登录的路由组件
 */
function Login(props) {
  const onFinish = async (values) => {
    const { username, password } = values;
    const result = await reqLogin(username, password);
    if (result.code === "success") {
      // 提示登录成功
      message.success("登录成功", 2);
      // 保存用户登录信息
      memoryUtils.user = result.user;
      storageUtils.saveUser(memoryUtils.user);
      //跳转到主页面
      props.history.replace("/");
    } else {
      // 登录失败, 提示错误
      message.error(result.message);
    }
  };

  const { user } = memoryUtils;
  //如果存在有access_token，就表明已经登录
  if (user.access_token) return <Redirect to="/" />;
  return (
    <div className="login">
      <div className="login-content">
        <h2>IT资产管理系统</h2>
        <Form name="normal_login" className="login-form" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "请输入用户名",
              },
              {
                min: 4,
                message: "用户名最少4位",
              },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "用户名必须是英文、数字或下划线组成",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "请输入密码",
              },
              {
                min: 6,
                message: "密码最少6位",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
