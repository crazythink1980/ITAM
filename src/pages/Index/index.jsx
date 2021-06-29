import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Layout } from "antd";

import memoryUtils from "../../utils/memoryUtils";
import LeftNav from "../../components/LeftNav";
import Header from "../../components/Header";
import Home from "../Home";
import Asset from "../Assets/Asset";
import Category from "../Assets/Category";
import Place from "../Assets/Place";
import User from "../User";
import Role from "../Role";
import Bar from "../Charts/Bar";
import Line from "../Charts/Line";
import Pie from "../Charts/Pie";

const { Content, Footer, Sider } = Layout;

export default function Index() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = memoryUtils;

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  if (!user.access_token) {
    return <Redirect to="/login" />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <LeftNav collapsed={collapsed} />
      </Sider>
      <Layout className="site-layout">
        <Header />
        <Content
          style={{ margin: "16px 16px 0px 16px", backgroundColor: "white" }}
        >
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/assets/category" component={Category} />
            <Route path="/assets/place" component={Place} />
            <Route path="/assets/asset" component={Asset} />
            <Route path="/role" component={Role} />
            <Route path="/user" component={User} />
            <Route path="/charts/bar" component={Bar} />
            <Route path="/charts/line" component={Line} />
            <Route path="/charts/pie" component={Pie} />
            <Redirect to="/home" />
          </Switch>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}
