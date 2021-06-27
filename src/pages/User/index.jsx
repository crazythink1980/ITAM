import React, { Component } from 'react';
import { message } from 'antd';
import { reqUserList } from '../../api'

class User extends Component {
    getUserList = async () => {
        const result = await reqUserList()
        if (result.code === "success") {
            // 提示登录成功 
            message.success('登录成功', 2)
        }
    }

    render() {

        //this.getUserList()
        return (
            <div>

            </div>
        );
    }
}

export default User;