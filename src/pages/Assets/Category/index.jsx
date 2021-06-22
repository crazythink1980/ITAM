import React, { Component } from 'react';
import { Card, Table, Button, message, Modal, Form, Select, Input } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'

import LinkButton from '../../../components/LinkButton';
import { reqCategorys } from '../../../api'

const Item = Form.Item
const Option = Select.Option


class Category extends Component {
    state = {
        loading: false,
        categorys: [],
        subCategorys: [],
        parentId: 0,
        parentName: '',
        showStatus: 0
    }

    formAddRef = React.createRef()
    fromUpdateRef = React.createRef()

    columns = [
        {
            title: '分类名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '操作',
            key: 'action',
            width: 300,
            render: (category) => (
                <span>
                    <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                    {this.state.parentId === 0 ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
                </span>
            ),
        },
    ];

    //显示二级子分类列表
    showSubCategorys = (category) => {
        this.setState({
            parentId: category.id,
            parentName: category.name
        }, () => {
            this.getCategory()
        })

    }

    //返回一级分类列表
    showCategorys = () => {
        this.setState({
            parentId: 0,
            parentName: '',
            subCategorys: []
        })
    }

    //获取一级/二级分类列表
    getCategory = async () => {
        this.setState({ loading: true })
        const { parentId } = this.state
        const result = await reqCategorys(parentId)
        this.setState({ loading: false })
        if (result.code === "success") {
            const categorys = result.asset_type
            if (parentId === 0) {
                this.setState({ categorys })
            } else {
                this.setState({ subCategorys: categorys })
            }

        } else {
            message.error('获取分类列表失败')
        }

    }

    //显示增加分类对话框
    showAdd = () => {
        this.setState({ showStatus: 1 })
    }
    //增加分类
    addCategory = () => {
        console.log('增加分类')

        this.setState({ showStatus: 0 })
    }

    //显示更新分类对话框
    showUpdate = (category) => {
        this.category = category
        this.fromUpdateRef.current.setFieldsValue({
            categoryName: category.name,
        })
        this.setState({ showStatus: 2 })
    }
    //更新分类
    updateCategory = () => {
        console.log('更新分类')

        const categoryName = this.fromUpdateRef.current.getFieldValue('categoryName')
        console.log(categoryName)

        this.setState({ showStatus: 0 })
    }

    //关闭模态对话框
    handleCancel = () => {
        this.setState({ showStatus: 0 })
    }

    componentDidMount() {
        this.getCategory()
    }

    render() {
        const { categorys, subCategorys, loading, parentId, parentName, showStatus } = this.state
        const title = parentId === 0 ? '一级分类列表' :
            (
                <span>
                    <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                    <ArrowRightOutlined />
                    <span style={{ marginLeft: 5 }}>{parentName}</span>
                </span>
            )
        const extra = (
            <Button type="primary" icon={<PlusOutlined />} onClick={this.showAdd}>
                添加
            </Button>
        )
        const category = this.category || {}

        return (
            <Card title={title} extra={extra} >
                <Table
                    rowKey='id'
                    loading={loading}
                    bordered
                    dataSource={parentId === 0 ? categorys : subCategorys}
                    columns={this.columns} />
                <Modal title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}>
                    <Form ref={this.fromUpdateRef}>
                        <Item>
                            <Select>
                                <Option value='0'>
                                    AAAA
                                </Option>
                            </Select>
                        </Item>
                        <Item>
                            <Input />
                        </Item>
                    </Form>
                </Modal>
                <Modal title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}>
                    <Form ref={this.fromUpdateRef}>
                        <Item name="categoryName">
                            <Input />
                        </Item>
                    </Form>
                </Modal>
            </Card>
        );
    }
}

export default Category;