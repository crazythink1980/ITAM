import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
import LinkButton from '../LinkButton';

import './index.less'


class Header extends Component {

    state = {
        curTime: ''
    }

    getTitle = () => {
        let title
        const { pathname } = this.props.location
        menuList.forEach(item => {
            if (item.key === pathname) {
                title = item.title
            }
            else if (item.children) {
                const cItem = item.children.find(cItem => cItem.key === pathname)
                if (cItem) {
                    title = cItem.title
                }

            }
        })
        return title
    }

    //退出登录
    logout = () => {
        Modal.confirm({
            content: '确定退出吗？',
            onOk: () => {
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
            }
        })
    }

    componentDidMount() {
        //使用定时器获取当前时间并格式化
        this.intervalId = setInterval(() => {
            const myDate = new Date()
            const curTime = myDate.getFullYear() +
                '-' + (myDate.getMonth() + 1) +
                '-' + myDate.getDate() +
                ' ' + myDate.getHours() +
                ':' + myDate.getMinutes() +
                ':' + myDate.getSeconds()
            this.setState({ curTime })
        }, 1000)

    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
    }

    render() {
        const { curTime } = this.state
        const { username } = memoryUtils.user
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        <span>{title}</span>
                    </div>
                    <div className='header-bottom-right'>
                        <span>{curTime}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);