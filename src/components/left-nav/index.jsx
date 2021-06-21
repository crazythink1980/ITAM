import React, { Component } from 'react';
import { Menu } from 'antd';

import './index.less'
import logo from '../../assets/logo.png'
import menuList from '../../config/menuConfig';

const { SubMenu } = Menu;

// const menuList = {
//     title: '首页',
//     key: '/home',
//     icon: <HomeOutlined />
// }

class LeftNav extends Component {
    getMenuNodes = (menuList) => {
        return menuList.map(item => {
            if (!item.children) {
                return (
                    < Menu.Item key={item.key} icon={item.icon} >
                        {item.title}
                    </Menu.Item >
                )
            }
            else {
                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }



    render() {
        return (
            <div className='left-nav'>
                <div className='left-nav-logo'>
                    <img src={logo} alt="logo" />
                    <h1>IT资产管理系统</h1>
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    {this.getMenuNodes(menuList)}
                </Menu>
            </div>
        );
    }
}

export default LeftNav;