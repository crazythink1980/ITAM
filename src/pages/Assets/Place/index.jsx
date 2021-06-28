import React, { Component } from 'react';
import { Card, Table, Button, message, Modal, Form, Cascader, Input } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'

import LinkButton from '../../../components/LinkButton';
import { COMPANY } from '../../../utils/constant'
import { reqPlace, reqPlaces, reqAddPlace, reqDelPlace, reqUpdatePlace } from '../../../api'

const Item = Form.Item

class Place extends Component {
    state = {
        loading: false,//列表加载的动画效果
        places: [],//当前显示的位置列表
        options: [],//级联下拉框的选项
        parentId: 0,//当前列表的父位置ID
        parents: [{ id: 0, name: COMPANY, hasChildren: true }],//记录当前列表的所有的父节点
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
                        {place.hasChildren ? <LinkButton onClick={() => this.displaySubPlaces(place)}>查看子分类</LinkButton> : <LinkButton onClick={() => this.delPlace(place)}>删除分类</LinkButton>}
                    </span>
                )
            },
        },
    ];

    displaySubPlaces = async (parent) => {
        const { parents } = this.state
        parents.push(parent)

        const parentId = parent.id

        this.setState({ loading: true })
        const result = await reqPlaces(parentId)
        this.setState({ loading: false })
        if (result.code === "success") {
            const places = result.data
            this.setState({ places, parentId, parents })
        } else {
            message.error('获取分类列表失败')

        }

    }

    jumpToPlaces = async (index) => {
        let { parents } = this.state
        const parentId = parents[index].id
        parents = parents.slice(0, index + 1)

        this.setState({ loading: true })
        const result = await reqPlaces(parentId)
        this.setState({ loading: false })
        if (result.code === "success") {
            const places = result.data
            this.setState({ places, parentId, parents })
        } else {
            message.error('获取分类列表失败')

        }
    }

    displayCurrentPlaces = async () => {
        const parentId = this.state.parentId
        this.setState({ loading: true })
        const result = await reqPlaces(parentId)
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

        const { parentId, parents } = this.state
        //初始化最顶端父节点
        const options = [{ value: 0, label: COMPANY, isLeaf: false }]

        if (parentId !== 0) {
            let parentOptions = options
            for (let parent of parents) {
                if (parent.id !== parentId) {
                    console.log(parent.id)
                    const places = await this.getPlaces(parent.id)
                    const childOptions = places.map(p => ({
                        value: p.id,
                        label: p.name,
                        isLeaf: !p.hasChildren
                    }))

                    //找到对应的父分类Option并关联
                    const targetOption = parentOptions.find(option => option.value === parent.id)
                    targetOption.children = childOptions
                    parentOptions = childOptions
                }
            }
        }
        this.setState({ options })
    }

    //显示增加分类对话框
    showAdd = async () => {
        //根据parents生成级联下拉框的初始值
        const { parents } = this.state
        const parentIds = []
        parents.forEach(p => {
            parentIds.push(p.id)
        })
        console.log(parentIds)

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
                    isLeaf: !c.hasChildren
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
                    message.success('增加分类成功')
                    this.displayCurrentPlaces()
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
                        message.success('修改分类成功')
                        this.displayCurrentPlaces()
                    } else {
                        message.error('修改分类失败')
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
                    message.success('删除分类成功')
                    this.displayCurrentPlaces()
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
        this.displayCurrentPlaces()
    }

    render() {
        const { places, loading, parentId, parents, showStatus } = this.state
        const title = (
            parents.map((p, index) => {
                //最后一个元素
                if (index === parents.length - 1) {
                    return (<span style={{ marginLeft: 5 }}>{p.name}</span>)
                }
                else {
                    return (<>
                        <LinkButton onClick={() => this.jumpToPlaces(index)}>{p.name}</LinkButton>
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