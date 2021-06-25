import React, { Component } from 'react';
import {
    Card,
    Select,
    Input,
    Button,
    Table
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const Option = Select.Option

class AssetHome extends Component {

    state = {
        assets: []
    }

    columns = [
        {
            title: '资产名称',
            dataIndex: 'name',
        },
        {
            title: '年龄',
            dataIndex: 'age',
        },
        {
            title: '住址',
            dataIndex: 'address',
        },
    ];

    render() {
        const { assets } = this.state
        const title = (
            <span>
                <Select value='1' style={{ width: 150 }}>
                    <Option value='1'>按名称搜索</Option>
                    <Option value='2'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{ width: 120, margin: '0 15px' }} />
                <Button type='primary'>搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary' icon={<PlusOutlined />} >
                添加
            </ Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    rowKey='id'
                    dataSource={assets}
                    columns={this.columns}
                />
            </Card>
        );
    }
}

export default AssetHome;