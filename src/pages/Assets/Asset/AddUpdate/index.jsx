import React, { Component } from 'react'
import { Card, Form, Input, Cascader, DatePicker, InputNumber, Button, Switch, Row, Col, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons'
import moment from 'moment'

import { reqCategorys, reqAddOrUpdateAsset, reqPlaces, reqPlace } from '../../../../api'

const { Item } = Form

const asset_types = {
    PC: 'PC',
    Printer: '网络打印机',
    Server: '服务器',
    NetDevice: '网络设备',
    SecDevice: '安全设备',
    Software: '软件'
}

class AssetAddUpdate extends Component {

    state = {
        typeOptions: [],
        placeOptions: [],
        type: ''
    }

    initTypeOptions = async () => {
        const typeOptions = []
        for (var key in asset_types) {
            const option = { value: key, label: asset_types[key], isLeaf: false }
            typeOptions.push(option)
        }

        //如果是编辑资产且存在资产子类
        const { isUpdate, asset } = this
        const { type, sub_type } = asset
        if (isUpdate && sub_type) {
            //获取资产子类
            const result = await reqCategorys(type)
            if (result.code === "success") {
                //生成子类列表
                const categorys = result.data

                const childOptions = categorys.map(c => ({
                    value: c.id,
                    label: c.name,
                    isLeaf: true
                }))

                //找到对应的一级分类Option并关联
                const targetOption = typeOptions.find(option => option.value === type)
                targetOption.children = childOptions


            } else {
                message.error('获取分类列表失败')
            }
        }
        this.setState({
            typeOptions
        })
    }

    loadTypeData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;

        const result = await reqCategorys(targetOption.value)
        targetOption.loading = false;

        this.setState({ loading: false })
        if (result.code === "success") {
            const categorys = result.data
            if (categorys && categorys.length > 0) {
                const childOptions = categorys.map(c => ({
                    value: c.id,
                    label: c.name,
                    isLeaf: true
                }))
                targetOption.children = childOptions
            }
            else {
                targetOption.isLeaf = true
            }
            this.setState({
                typeOptions: [...this.state.typeOptions]
            })
        } else {
            message.error('获取分类列表失败')
        }
    }

    onTypeChange = (value, selectedOptions) => {
        console.log(value, selectedOptions)
        if (value[0] !== this.state.type) {
            this.setState({
                type: value[0]
            })
        }
    }

    initPlaceOptions = async () => {

        //初始化最顶端父节点
        const placeOptions = [{ value: 0, label: 'XX公司', isLeaf: false }]

        //如果是编辑资产
        const { isUpdate, asset } = this
        if (isUpdate && asset.place) {
            //生成parent数组，里面记录所有的父位置
            const parent = []
            if (asset.place !== 0) {
                //取得资产对于的位置的详细信息
                const result = await reqPlace(asset.place)
                if (result.code === "success") {
                    let place = result.data
                    parent.unshift({ id: place.id, name: place.name })
                    while (place.parent) {
                        place = place.parent
                        parent.unshift({ id: place.id, name: place.name })

                    }
                    parent.unshift({ id: 0, name: 'XX公司' })
                }
                else {
                    message.error('获取位置列表失败')
                }
            }
            else {
                parent.unshift({ id: 0, name: 'XX公司' })
            }

            if (parent.length !== 1) {
                //遍历parent，读取当前的所有父位置的列表，并形成options（其中最后一个为当前父位置，不用读）
                let parentOptions = placeOptions
                for (var i = 0; i < parent.length - 1; i++) {
                    const places = await this.getPlaces(parent[i].id)
                    const childOptions = places.map(p => ({
                        value: p.id,
                        label: p.name,
                        isLeaf: false
                    }))

                    //找到对应的父分类Option并关联
                    const targetOption = parentOptions.find(option => option.value === parent[i].id)
                    targetOption.children = childOptions
                    parentOptions = childOptions
                }
            }

        }
        this.setState({ placeOptions })
    }

    loadPlaceData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        const result = await reqPlaces(targetOption.value)
        targetOption.loading = false;

        this.setState({ loading: false })
        if (result.code === "success") {
            const places = result.data
            if (places && places.length > 0) {
                const childOptions = places.map(c => ({
                    value: c.id,
                    label: c.name,
                    isLeaf: false
                }))
                targetOption.children = childOptions
            }
            else {
                targetOption.isLeaf = true
            }
            this.setState({
                placeOptions: [...this.state.placeOptions]
            })
        } else {
            message.error('获取分类列表失败')
        }
    }

    onFinish = async (values) => {
        //获取并处理数据
        const {
            name,
            types,
            statusDisplay,
            places,
            use_dept,
            manage_user,
            model,
            manufactory,
            sn,
            product_dateObj,
            trade_dateObj,
            expire_dateObj,
            asset_code,
            management_ip,
            port_num,
            device_detail
        } = values
        //status处理
        let status = 2
        if (statusDisplay) {
            status = 1
        }
        //type.sub_type处理
        let type, sub_type
        if (types.length === 1) {
            type = types[0]
        }
        else {
            type = types[0]
            sub_type = types[1]
        }
        let place
        if (places.length > 0) {
            place = places[places.length - 1]
        }
        else {
            place = null
        }

        if (use_dept === '') {
            use_dept = null
        }
        if (manage_user === '') {
            manage_user = null
        }
        //日期处理
        const product_date = product_dateObj ? product_dateObj.format('YYYY-MM-DD') : null
        const trade_date = trade_dateObj ? trade_dateObj.format('YYYY-MM-DD') : null
        const expire_date = expire_dateObj ? expire_dateObj.format('YYYY-MM-DD') : null

        const asset = {
            name,
            type,
            sub_type,
            status,
            place,
            use_dept,
            manage_user,
            model,
            manufactory,
            sn,
            product_date,
            trade_date,
            expire_date,
            asset_code,
            management_ip,
            port_num,
            device_detail
        }
        //如果是更新，还需要加入id
        if (this.isUpdate) {
            asset.id = this.asset.id
        }

        //发送请求
        const result = await reqAddOrUpdateAsset(asset)
        if (result.code === "success") {
            message.success(`${this.isUpdate ? '更新' : '新增' + '资产成功'}`)
            this.props.history.goBack()
        }
        else {
            message.error(`${this.isUpdate ? '更新' : '新增' + '资产失败'}`)
        }
    };

    constructor(props) {
        super(props)
        //this.formAddUpdateRef = React.createRef()
        const asset = this.props.location.state
        this.isUpdate = !!asset
        this.asset = asset || {}
    }

    componentDidMount() {
        if (this.isUpdate) {
            this.setState({
                type: this.props.location.state.type
            })
        }
        this.initTypeOptions()
        this.initPlaceOptions()

    }

    render() {
        const { typeOptions, type, placeOptions } = this.state
        const { isUpdate, asset } = this
        const types = []
        if (isUpdate) {
            types.push(asset.type)
            if (asset.sub_type) {
                types.push(asset.sub_type)
            }
        }
        const title = (
            <span>
                <Button type='link' onClick={() => { this.props.history.goBack() }}><ArrowLeftOutlined style={{ fontSize: 15 }} /></Button>
                {isUpdate ? '编辑资产' : '添加资产'}
            </span>
        )

        return (

            < Card title={title} >
                <Form
                    labelCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 4, offset: 4 },
                    }}
                    wrapperCol={{
                        xs: { span: 24 },
                        sm: { span: 12 },
                    }}
                    onFinish={this.onFinish}
                >
                    <Item name='types' initialValue={types} label="资产类型" rules={[{ required: true }]}>
                        <Cascader
                            placeholder='请选择资产类型'
                            disabled={isUpdate}
                            options={typeOptions}
                            loadData={this.loadTypeData}
                            onChange={this.onTypeChange}
                        />
                    </Item>


                    <Item name='name' initialValue={asset.name} label="资产名称" rules={[{ required: true }]}>
                        <Input placeholder='请输入资产名称' />
                    </Item>


                    <Item name='statusDisplay' label="状态" initialValue={asset.status ? (asset.status === 1 ? true : false) : true} valuePropName="checked" rules={[{ required: true }]}>
                        <Switch checkedChildren="使用中" unCheckedChildren="停止使用" />
                    </Item>


                    <Item name='places' initialValue={asset.place} label="资产位置" >
                        <Cascader
                            placeholder='请选择资产位置'
                            disabled={isUpdate}
                            options={placeOptions}
                            loadData={this.loadPlaceData}
                            onChange={this.onPlaceChange}
                        />
                    </Item>


                    <Item name='use_dept' initialValue={asset.use_dept} label="使用部门" >
                        <Input placeholder='请输入使用部门' />
                    </Item>


                    <Item name='manage_user' initialValue={asset.manage_user} label="管理人">
                        <Input placeholder='请输入管理人' />
                    </Item>



                    <Item name='model' initialValue={asset.model} label="型号" >
                        <Input placeholder='请输入型号' />
                    </Item>


                    <Item name='manufactory' initialValue={asset.manufactory} label="生产厂家" >
                        <Input placeholder='请输入生产厂家' />
                    </Item>


                    <Item name='sn' initialValue={asset.sn} label="系列号" >
                        <Input placeholder='请输入系列号' />
                    </Item>



                    <Item name='product_dateObj' initialValue={asset.product_date ? moment(asset.product_date) : null} label="生产日期" >
                        <DatePicker placeholder='请选择生产日期' />
                    </Item>


                    <Item name='trade_dateObj' initialValue={asset.trade_date ? moment(asset.trade_date) : null} label="购买日期" >
                        <DatePicker placeholder='请选择购买日期' />
                    </Item>


                    <Item name='expire_dateObj' initialValue={asset.expire_date ? moment(asset.expire_date) : null} label="过保日期" >
                        <DatePicker placeholder='请选择过保日期' />
                    </Item>



                    <Item name='asset_code' initialValue={asset.asset_code} label="固定资产编码" >
                        <Input placeholder='请输入固定资产编码' />
                    </Item>




                    {(() => {
                        switch (type) {
                            case 'PC':
                                return <PCAddUpdate asset={asset} />
                            case 'Printer':
                                return <PrinterAddUpdate asset={asset} />
                            case 'Server':
                                return <ServerAddUpdate asset={asset} />
                            case 'NetDevice':
                                return <NetDevAddUpdate asset={asset} />
                            case 'SecDevice':
                                return <SecDevAddUpdate asset={asset} />
                            default:
                                return null
                        }
                    })()}


                    <Item
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 16, offset: 8 },
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Item>

                </Form>
            </Card >
        );
    }
}

class PCAddUpdate extends Component {
    render() {
        const { asset } = this.props
        return (
            <Item name='pcname' label="PC资产名称" rules={[{ required: true }]}>
                <Input />
            </Item>
        )
    }

}

class PrinterAddUpdate extends Component {
    render() {
        const { asset } = this.props
        return (
            <Row>
                <Item name='pcname' label="网络打印机资产名称" rules={[{ required: true }]}>
                    <Input />
                </Item>
            </Row>
        )
    }

}

class ServerAddUpdate extends Component {
    render() {
        const { asset } = this.props
        return (
            <Row >
                <Col span={8}>
                    <Item name='pcname' label="服务器资产名称" rules={[{ required: true }]}>
                        <Input />
                    </Item>
                </Col>

            </Row>

        )
    }

}

class NetDevAddUpdate extends Component {
    render() {
        const { asset } = this.props
        return (

            <>

                <Item name='management_ip' initialValue={asset.management_ip} label="管理IP地址" >
                    <Input />
                </Item>


                <Item name='port_num' initialValue={asset.port_num} label="端口个数" >
                    <InputNumber />
                </Item>

                <Item name='device_detail' initialValue={asset.device_detail} label="设备详情" style={{ textAlign: 'left' }}>
                    <Input.TextArea />
                </Item>

            </>

        )
    }

}

class SecDevAddUpdate extends Component {
    render() {
        const { asset } = this.props
        return (
            <Item name='pcname' label="安全设备资产名称" rules={[{ required: true }]}>
                <Input />
            </Item>
        )
    }

}

export default AssetAddUpdate;