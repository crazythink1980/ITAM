import React from 'react';
import { Redirect } from 'react-router-dom'
import { Layout, Table } from 'antd';
import memoryUtils from '../../utils/memoryUtils'

const { Header, Content } = Layout;

const dataSource = [
    {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
    },
    {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号',
    },
];

const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
    },
];

class Homepage extends React.Component {
    render() {
        const { user } = memoryUtils
        if (!user || !user.access_token)
            return <Redirect to='/login' />
        return (
            <Layout>
                <Header>
                    <div style={{ lineHeight: '64px', fontSize: "20px", color: "white", textAlign: "center" }}>
                        拉布拉卡 - 卡片管理系统--{memoryUtils.user.username}
                    </div>
                </Header>

                <Content >
                    <Table dataSource={dataSource} columns={columns} />
                </Content>
            </Layout>
        );
    }
}

export default Homepage;
