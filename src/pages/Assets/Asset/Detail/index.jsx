import React, { Component } from 'react'
import { Card, Button, Tag, Descriptions } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import { reqCategory } from "../../../../api";

const { Item } = Descriptions
const asset_types = {
    PC: 'PC',
    Printer: '网络打印机',
    Server: '服务器',
    NetDevice: '网络设备',
    SecDevice: '安全设备',
    Software: '软件'
}
class AssetDetail extends Component {

    state = {
        cName: '',
    }

    getAssetSubType = async () => {
        const { sub_type } = this.props.location.state
        if (sub_type) {
            const result = await reqCategory(sub_type)
            this.setState({ cName: result.data.name })
        }

    }



    componentDidMount() {
        this.getAssetSubType()
    }

    render() {
        const asset = this.props.location.state
        const { cName } = this.state
        const title = (
            <span>
                <Button type='link' onClick={() => { this.props.history.goBack() }}><ArrowLeftOutlined style={{ fontSize: 15 }} /></Button>
                资产详情
            </span>
        )
        return (

            <Card title={title}>
                <Descriptions title='基本信息'>
                    <Item label="资产类型"> {asset_types[asset.type]} {cName ? '/' + cName : null}</Item>
                    <Item label="资产名称">{asset.name}</Item>
                    <Item label="状态">{asset.status === 1 ? <Tag color="success">使用中</Tag> : <Tag color="warning">停止使用</Tag>}</Item>
                    <Item label="设备位置">{asset.place}</Item>
                    <Item label="使用部门">{asset.use_dept}</Item>
                    <Item label="管理人">{asset.manage_user}</Item>
                    <Item label="型号">{asset.model}</Item>
                    <Item label="生产厂家">{asset.manufactory}</Item>
                    <Item label="系列号">{asset.sn}</Item>
                    <Item label="生产日期">{asset.product_date}</Item>
                    <Item label="购买日期">{asset.trade_date}</Item>
                    <Item label="过保日期">{asset.expire_date}</Item>
                    <Item label="固定资产编码">{asset.asset_code}</Item>
                </Descriptions>

                {(() => {
                    switch (asset.type) {
                        case 'PC':
                            return <PCDetail asset={asset} />
                        case 'Printer':
                            return <PrinterDetail asset={asset} />
                        case 'Server':
                            return <ServerDetail asset={asset} />
                        case 'NetDevice':
                            return <NetDevDetail asset={asset} />
                        case 'SecDevice':
                            return <SecDevDetail asset={asset} />
                        default:
                            return null
                    }
                })()}

            </Card>

        );
    }
}

class PCDetail extends Component {
    render() {
        const { asset } = this.props
        return (
            <Descriptions title='PC类型信息'>

            </Descriptions>
        )
    }

}

class PrinterDetail extends Component {
    render() {
        const { asset } = this.props
        return (
            <Descriptions title='网络打印机类型信息'>

            </Descriptions>
        )
    }

}

class ServerDetail extends Component {
    render() {
        const { asset } = this.props
        return (
            <Descriptions title='服务器类型信息'>

            </Descriptions>
        )
    }

}

class NetDevDetail extends Component {
    render() {
        const { asset } = this.props
        return (
            <Descriptions title='网络设备类型信息'>
                <Item label="管理IP地址">{asset.management_ip}</Item>
                <Item label="端口数" span={2}>{asset.port_num}</Item>
                <Item label="设备详情" span={3}>{asset.device_detail}</Item>
            </Descriptions>
        )
    }

}

class SecDevDetail extends Component {
    render() {
        const { asset } = this.props
        return (
            <Descriptions title='安全设备类型信息'>

            </Descriptions>
        )
    }

}

export default AssetDetail;