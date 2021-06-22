import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd';

import './index.less'
import logo from '../../assets/logo.png'
import menuList from '../../config/menuConfig';

const { SubMenu } = Menu;

class LeftNav extends Component {

    //根据menuList动态生成菜单项
    getMenuNodes = (menuList) => {
        const { pathname } = this.props.location
        return menuList.map(item => {
            if (!item.children) {
                return (

                    < Menu.Item key={item.key} icon={item.icon} >
                        <Link to={item.key}>
                            {item.title}
                        </Link>
                    </Menu.Item >

                )
            }
            else {
                const cItem = item.children.find(cItem => cItem.key === pathname)
                if (cItem) {
                    this.openKey = item.key
                }

                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }

    menuNodes = this.getMenuNodes(menuList)

    render() {
        const { collapsed } = this.props;
        const { pathname } = this.props.location
        return (
            <div className='left-nav'>
                <div className='left-nav-logo'>
                    <img src={logo} alt="logo" />
                    <h1 style={collapsed ? { display: 'none' } : {}}>IT资产管理系统</h1>
                </div>
                <Menu theme="dark" selectedKeys={[pathname]} defaultOpenKeys={[this.openKey]} mode="inline">
                    {this.menuNodes}
                </Menu>
            </div>
        );
    }
}

export default withRouter(LeftNav);