import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../LinkButton';

import './index.less'


class Header extends Component {

    state = {
        curTime: ''
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
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        <span>首页</span>
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