import React, { Component } from 'react';
import { Menu } from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';

import './index.less'
import logo from '../../assets/logo.png'

const { SubMenu } = Menu;

class LeftNav extends Component {
    render() {
        return (
            <div className='left-nav'>
                <div className='left-nav-logo'>
                    <img src={logo} alt="logo" />
                    <h1>IT资产管理系统</h1>
                </div>
            </div>
        );
    }
}

export default LeftNav;