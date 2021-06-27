import React, { Component } from 'react';
import { Card, Table, Button, message, Modal, Form, Cascader, Input } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'

import LinkButton from '../../../components/LinkButton';
import { reqPlace, reqPlaces, reqAddPlace, reqDelPlace, reqUpdatePlace } from '../../../api'

const Item = Form.Item

class Place extends Component {
    state = {
        loading: false,//列表加载的动画效果
        places: [],//当前显示的位置列表
        options: [],//级联下拉框的选项
        parentId: 0,//当前列表的父位置ID
        parent: [{ id: 0, name: 'XX公司' }],//记录所有的父位置
        showStatus: 0,//控制模态对话框显示/隐藏的状态量 0：两个都隐藏 1：显示增加 2：显示更新
        // type: 0
    }

    formAddRef = React.createRef()
    formUpdateRef = React.createRef()

    columns = [
        {
            title: '位置名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '操作',
            key: 'action',
            width: 300,
            render: (place) => {
                return (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(place)}>修改分类</LinkButton>
                        {place.children.length === 0 ? <LinkButton onClick={() => this.delPlace(place)}>删除分类</LinkButton> : <LinkButton onClick={() => this.displayPlaces(place.id)}>查看子分类</LinkButton>}
                    </span>
                )
            },
        },
    ];

    //根据ID显示位置列表
    displayPlaces = async (parent_Id) => {
        this.setState({ loading: true })
        let parentId, result
        if (parent_Id === 0) {
            parentId = parent_Id
        }
        else {
            parentId = parent_Id || this.state.parentId
        }

        //生成parent数组，里面记录所有的父位置
        const parent = []
        if (parentId !== 0) {
            result = await reqPlace(parentId)
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
                message.error('获取分类列表失败')
            }
        }
        else {
            parent.unshift({ id: 0, name: 'XX公司' })
        }

        this.setState({ parent, parentId })

        result = await reqPlaces(parentId)
        this.setState({ loading: false })
        if (result.code === "success") {
            const places = result.data
            this.setState({ places })
        } else {
            message.error('获取分类列表失败')
        }

    }


    //获取位置列表
    getPlaces = async (parent_Id) => {

        const result = await reqPlaces(parent_Id)

        if (result.code === "success") {
            return result.data
        } else {
            message.error('获取分类列表失败')
        }

    }

    initPlaceOptions = async () => {
        const { parent } = this.state

        //初始化最顶端父节点
        const options = [{ value: 0, label: 'XX公司', isLeaf: false }]
        if (parent.length !== 1) {
            //遍历parent，读取当前的所有父位置的列表，并形成options（其中最后一个为当前父位置，不用读）
            let parentOptions = options
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
        this.setState({ options })
    }

    //显示增加分类对话框
    showAdd = () => {
        //根据parent生成级联下拉框的初始值
        const { parent } = this.state
        const parentIds = []
        for (var i = 0; i < parent.length; i++) {
            parentIds.push(parent[i].id)
        }
        //初始化级联下拉框的Options
        this.initPlaceOptions()
        //显示增加对话框，并设置初始值
        this.setState({ showStatus: 1 }, () => {
            this.formAddRef.current.setFieldsValue({
                parentIds,
                placeName: '',
            })
        })
    }

    //级联下拉框选择时自动加载下级Options
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
                options: [...this.state.options]
            })
        } else {
            message.error('获取分类列表失败')
        }
    }

    //级联下拉框选择的值改变后改变状态
    // onTypeChange = (value, selectedOptions) => {
    //     if (value[selectedOptions.length - 1] !== this.state.type) {
    //         this.setState({
    //             type: value[selectedOptions.length - 1]
    //         })
    //     }
    // }


    //增加分类
    addPlace = (values) => {
        this.formAddRef.current.validateFields()
            .then(async values => {
                const { parentIds, placeName } = values
                const parentId = parentIds.pop()
                const result = await reqAddPlace(parentId, placeName)
                if (result.code === "success") {

                    this.displayPlaces()

                } else {
                    message.error('增加分类失败')
                }

                this.setState({ showStatus: 0 })
            })
            .catch(err => {

            })
    }

    //显示更新分类对话框
    showUpdate = (place) => {
        this.place = place
        this.setState({ showStatus: 2 }, () => {
            this.formUpdateRef.current.setFieldsValue({
                placeName: place.name,
            })
        })
    }
    //更新分类
    updatePlace = (values) => {
        this.formUpdateRef.current.validateFields()
            .then(async values => {
                const placeName = values.placeName
                const { id, parent_id, name } = this.place
                if (placeName !== name) {
                    const result = await reqUpdatePlace(id, parent_id, placeName)
                    if (result.code === "success") {
                        this.displayPlaces()
                    } else {
                        message.error('增加分类失败')
                    }
                }

                this.setState({ showStatus: 0 })
            })
            .catch(err => {

            })


    }

    //删除分类
    delPlace = (place) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定删除分类：' + place.name + '？',
            okText: '确定 ',
            cancelText: '取消',
            onOk: async () => {
                const { id } = place
                const result = await reqDelPlace(id)
                if (result.code === "success") {
                    this.displayPlaces()
                } else {
                    message.error('删除分类失败')
                }
            }
        })
    }

    //关闭模态对话框
    handleCancel = () => {
        this.setState({ showStatus: 0 })
    }

    componentDidMount() {
        this.displayPlaces()
    }

    render() {
        const { places, loading, parentId, parent, showStatus } = this.state
        const title = (

            parent.map(p => {
                if (p.id === parentId) {
                    return (<span style={{ marginLeft: 5 }}>{p.name}</span>)
                }
                else {
                    return (<>
                        <LinkButton onClick={() => this.displayPlaces(p.id)}>{p.name}</LinkButton>
                        <ArrowRightOutlined /></>)
                }

            })

        )
        const extra = (
            <Button type="primary" icon={<PlusOutlined />} onClick={this.showAdd}>
                添加
            </Button>
        )

        return (
            <Card title={title} extra={extra} >
                <Table
                    rowKey='id'
                    loading={loading}
                    bordered
                    childrenColumnName={'a'}
                    dataSource={places}
                    columns={this.columns}
                />

                <Modal title="添加分类"
                    okText="确定"
                    cancelText="取消"
                    visible={showStatus === 1}
                    onCancel={this.handleCancel}
                    onOk={this.addPlace}
                >
                    <Form ref={this.formAddRef} >
                        <Item name="parentIds">
                            <Cascader
                                placeholder='请选择资产类型'
                                options={this.state.options}
                                loadData={this.loadPlaceData}
                                onChange={this.onTypeChange}
                                changeOnSelect
                            />


                        </Item>
                        <Item
                            name="placeName"
                            rules={[
                                {
                                    required: true,
                                    message: '分类名必须输入',
                                },
                                {
                                    max: 20,
                                    message: '分类名最多20位',
                                },
                            ]}
                        >
                            <Input placeholder='请输入分类名称' />
                        </Item>
                    </Form>
                </Modal>
                <Modal title="更新分类"
                    okText="确定"
                    cancelText="取消"
                    visible={showStatus === 2}
                    onCancel={this.handleCancel}
                    onOk={this.updatePlace}
                >
                    <Form ref={this.formUpdateRef} >
                        <Item
                            name="placeName"
                            rules={[
                                {
                                    required: true,
                                    message: '分类名必须输入',
                                },
                                {
                                    max: 20,
                                    message: '分类名最多20位',
                                },
                            ]}
                        >
                            <Input />
                        </Item>
                    </Form>
                </Modal>
            </Card >
        );
    }
}

export default Place;