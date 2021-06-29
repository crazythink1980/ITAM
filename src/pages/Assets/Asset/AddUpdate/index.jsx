import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Cascader,
  DatePicker,
  InputNumber,
  Button,
  Select,
  Switch,
  message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment";

import { reqCategorys, reqAddOrUpdateAsset, reqPlaces } from "../../../../api";
import { ASSET_TYPES } from "../../../../utils/constant";

const { Item } = Form;
const { Option } = Select;

export default function AssetAddUpdate(props) {
  const [typeOptions, setTypeOptions] = useState([]);
  const [placeOptions, setPlaceOptions] = useState([]);
  const [type, setType] = useState("");
  const assetFromProps = this.props.location.state;
  const isUpdate = !!assetFromProps;
  const asset = assetFromProps || {};
  const types = [];
  if (isUpdate) {
    types.push(asset.type);
    if (asset.sub_type) {
      types.push(asset.sub_type);
    }
  }

  let places = [];
  if (isUpdate) {
    places = [...asset.place_obj.parent_ids, asset.place_obj.id];
  }

  const title = (
    <span>
      <Button
        type="link"
        onClick={() => {
          this.props.history.goBack();
        }}
      >
        <ArrowLeftOutlined style={{ fontSize: 15 }} />
      </Button>
      {isUpdate ? "编辑资产" : "添加资产"}
    </span>
  );

  const initTypeOptions = async () => {
    const initTypeOptions = [];
    for (var key in ASSET_TYPES) {
      const option = { value: key, label: ASSET_TYPES[key], isLeaf: false };
      initTypeOptions.push(option);
    }

    //如果是编辑资产且存在资产子类
    const { type, sub_type } = asset;
    if (isUpdate && sub_type) {
      //获取资产子类
      const result = await reqCategorys(type);
      if (result.code === "success") {
        //生成子类列表
        const categorys = result.data;

        const childOptions = categorys.map((c) => ({
          value: c.id,
          label: c.name,
          isLeaf: true,
        }));

        //找到对应的一级分类Option并关联
        const targetOption = initTypeOptions.find(
          (option) => option.value === type
        );
        targetOption.children = childOptions;
      } else {
        message.error("获取分类列表失败");
      }
    }
    setTypeOptions(initTypeOptions);
  };

  const loadTypeData = async (selectedOptions) => {
    const targetOption = selectedOptions[0];
    targetOption.loading = true;

    const result = await reqCategorys(targetOption.value);
    targetOption.loading = false;

    this.setState({ loading: false });
    if (result.code === "success") {
      const categorys = result.data;
      if (categorys && categorys.length > 0) {
        const childOptions = categorys.map((c) => ({
          value: c.id,
          label: c.name,
          isLeaf: true,
        }));
        targetOption.children = childOptions;
      } else {
        targetOption.isLeaf = true;
      }
      setTypeOptions(typeOptions);
    } else {
      message.error("获取分类列表失败");
    }
  };

  const onTypeChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    if (value[0] !== type) {
      setType(value[0]);
    }
  };

  //获取位置列表
  const getPlaces = async (parent_Id) => {
    const result = await reqPlaces(parent_Id);

    if (result.code === "success") {
      return result.data;
    } else {
      message.error("获取分类列表失败");
    }
  };

  //初始化位置级联下拉框的Options
  const initPlaceOptions = async () => {
    //初始化最顶端父节点
    const placeOptions = [{ value: 0, label: "XX公司", isLeaf: false }];

    //如果是编辑资产
    if (
      isUpdate &&
      asset.place_obj &&
      asset.place_obj.parent_ids &&
      asset.place_obj.parent_ids.length > 1
    ) {
      const place_id = asset.place_obj.parent_ids;
      //遍历parent，读取当前的所有父位置的列表，并形成options
      let parentOptions = placeOptions;
      for (let id of place_id) {
        const places = await this.getPlaces(id);
        const childOptions = places.map((p) => ({
          value: p.id,
          label: p.name,
          isLeaf: !p.hasChildren,
        }));

        //找到对应的父分类Option并关联
        const targetOption = parentOptions.find(
          (option) => option.value === id
        );
        targetOption.children = childOptions;
        parentOptions = childOptions;
      }
    }
    //更新状态
    setPlaceOptions(placeOptions);
  };

  //用户点击级联下拉框相应选项，动态加载下一级
  const loadPlaceData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const result = await reqPlaces(targetOption.value);
    targetOption.loading = false;

    this.setState({ loading: false });
    if (result.code === "success") {
      const places = result.data;
      if (places && places.length > 0) {
        const childOptions = places.map((c) => ({
          value: c.id,
          label: c.name,
          isLeaf: !c.hasChildren,
        }));
        targetOption.children = childOptions;
      } else {
        targetOption.isLeaf = true;
      }
      setPlaceOptions(placeOptions);
    } else {
      message.error("获取分类列表失败");
    }
  };

  const onFinish = async (values) => {
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
      ip,
      mac,
      display,
      printer,
      cpu,
      memory,
      disk,
      os,
      func_type,
      paper,
      nic,
      database,
      middleware,
      usage,
      online_dateObj,
      management_ip,
      port_num,
      device_detail,
    } = values;
    //status处理
    let status = 2;
    if (statusDisplay) {
      status = 1;
    }
    //type.sub_type处理
    let type, sub_type;
    if (types.length === 1) {
      type = types[0];
    } else {
      type = types[0];
      sub_type = types[1];
    }
    //位置处理
    let place;
    if (places.length > 0) {
      place = places[places.length - 1];
    } else {
      place = null;
    }

    if (use_dept === "") {
      use_dept = null;
    }
    if (manage_user === "") {
      manage_user = null;
    }
    //日期处理
    const product_date = product_dateObj
      ? product_dateObj.format("YYYY-MM-DD")
      : null;
    const trade_date = trade_dateObj
      ? trade_dateObj.format("YYYY-MM-DD")
      : null;
    const expire_date = expire_dateObj
      ? expire_dateObj.format("YYYY-MM-DD")
      : null;
    const online_date = online_dateObj
      ? online_dateObj.format("YYYY-MM-DD")
      : null;

    const newAsset = {
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
      ip,
      mac,
      display,
      printer,
      cpu,
      memory,
      disk,
      os,
      func_type,
      paper,
      nic,
      database,
      middleware,
      usage,
      online_date,
      management_ip,
      port_num,
      device_detail,
    };
    //如果是更新，还需要加入id
    if (isUpdate) {
      newAsset.id = asset.id;
    }

    //发送请求
    const result = await reqAddOrUpdateAsset(newAsset);
    if (result.code === "success") {
      message.success(`${isUpdate ? "更新" : "新增"}资产成功`);
      props.history.goBack();
    } else {
      message.error(`${isUpdate ? "更新" : "新增"}资产失败`);
    }
  };

  useEffect(() => {
    if (isUpdate) {
      setType(props.location.state.type);
    }
    initTypeOptions();
    initPlaceOptions();
  }, []);

  return (
    <Card title={title}>
      <Form
        labelCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: 4, offset: 4 },
        }}
        wrapperCol={{
          xs: { span: 24 },
          sm: { span: 12 },
        }}
        onFinish={onFinish}
      >
        <Item
          name="types"
          initialValue={types}
          label="资产类型"
          rules={[{ required: true }]}
        >
          <Cascader
            placeholder="请选择资产类型"
            disabled={isUpdate}
            options={typeOptions}
            loadData={loadTypeData}
            onChange={onTypeChange}
          />
        </Item>

        <Item
          name="name"
          initialValue={asset.name}
          label="资产名称"
          rules={[{ required: true }]}
        >
          <Input placeholder="请输入资产名称" />
        </Item>

        <Item
          name="statusDisplay"
          label="状态"
          initialValue={
            asset.status ? (asset.status === 1 ? true : false) : true
          }
          valuePropName="checked"
          rules={[{ required: true }]}
        >
          <Switch checkedChildren="使用中" unCheckedChildren="停止使用" />
        </Item>

        <Item name="places" initialValue={places} label="资产位置">
          <Cascader
            placeholder="请选择资产位置"
            options={placeOptions}
            loadData={loadPlaceData}
          />
        </Item>

        <Item name="use_dept" initialValue={asset.use_dept} label="使用部门">
          <Input placeholder="请输入使用部门" />
        </Item>

        <Item
          name="manage_user"
          initialValue={asset.manage_user}
          label="管理人"
        >
          <Input placeholder="请输入管理人" />
        </Item>

        <Item name="model" initialValue={asset.model} label="型号">
          <Input placeholder="请输入型号" />
        </Item>

        <Item
          name="manufactory"
          initialValue={asset.manufactory}
          label="生产厂家"
        >
          <Input placeholder="请输入生产厂家" />
        </Item>

        <Item name="sn" initialValue={asset.sn} label="系列号">
          <Input placeholder="请输入系列号" />
        </Item>

        <Item
          name="product_dateObj"
          initialValue={asset.product_date ? moment(asset.product_date) : null}
          label="生产日期"
        >
          <DatePicker placeholder="请选择生产日期" />
        </Item>

        <Item
          name="trade_dateObj"
          initialValue={asset.trade_date ? moment(asset.trade_date) : null}
          label="购买日期"
        >
          <DatePicker placeholder="请选择购买日期" />
        </Item>

        <Item
          name="expire_dateObj"
          initialValue={asset.expire_date ? moment(asset.expire_date) : null}
          label="过保日期"
        >
          <DatePicker placeholder="请选择过保日期" />
        </Item>

        <Item
          name="asset_code"
          initialValue={asset.asset_code}
          label="固定资产编码"
        >
          <Input placeholder="请输入固定资产编码" />
        </Item>

        {(() => {
          switch (type) {
            case "PC":
              return <PCAddUpdate asset={asset} />;
            case "Printer":
              return <PrinterAddUpdate asset={asset} />;
            case "Server":
              return <ServerAddUpdate asset={asset} />;
            case "NetDevice":
              return <NetDevAddUpdate asset={asset} />;
            case "SecDevice":
              return <SecDevAddUpdate asset={asset} />;
            default:
              return null;
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
    </Card>
  );
}

// class AssetAddUpdate extends Component {

//     state = {
//         typeOptions: [],//资产类型级联下拉框的Options
//         placeOptions: [],//资产位置级联下拉框的Options
//         type: '',//记录资产类型选中的分类，动态加载对应组件
//     }

//     initTypeOptions = async () => {
//         const typeOptions = []
//         for (var key in ASSET_TYPES) {
//             const option = { value: key, label: ASSET_TYPES[key], isLeaf: false }
//             typeOptions.push(option)
//         }

//         //如果是编辑资产且存在资产子类
//         const { isUpdate, asset } = this
//         const { type, sub_type } = asset
//         if (isUpdate && sub_type) {
//             //获取资产子类
//             const result = await reqCategorys(type)
//             if (result.code === "success") {
//                 //生成子类列表
//                 const categorys = result.data

//                 const childOptions = categorys.map(c => ({
//                     value: c.id,
//                     label: c.name,
//                     isLeaf: true
//                 }))

//                 //找到对应的一级分类Option并关联
//                 const targetOption = typeOptions.find(option => option.value === type)
//                 targetOption.children = childOptions

//             } else {
//                 message.error('获取分类列表失败')
//             }
//         }
//         this.setState({
//             typeOptions
//         })
//     }

//     loadTypeData = async selectedOptions => {
//         const targetOption = selectedOptions[0];
//         targetOption.loading = true;

//         const result = await reqCategorys(targetOption.value)
//         targetOption.loading = false;

//         this.setState({ loading: false })
//         if (result.code === "success") {
//             const categorys = result.data
//             if (categorys && categorys.length > 0) {
//                 const childOptions = categorys.map(c => ({
//                     value: c.id,
//                     label: c.name,
//                     isLeaf: true
//                 }))
//                 targetOption.children = childOptions
//             }
//             else {
//                 targetOption.isLeaf = true
//             }
//             this.setState({
//                 typeOptions: [...this.state.typeOptions]
//             })
//         } else {
//             message.error('获取分类列表失败')
//         }
//     }

//     onTypeChange = (value, selectedOptions) => {
//         console.log(value, selectedOptions)
//         if (value[0] !== this.state.type) {
//             this.setState({
//                 type: value[0]
//             })
//         }
//     }

//     //获取位置列表
//     getPlaces = async (parent_Id) => {

//         const result = await reqPlaces(parent_Id)

//         if (result.code === "success") {
//             return result.data
//         } else {
//             message.error('获取分类列表失败')
//         }

//     }

//     //初始化位置级联下拉框的Options
//     initPlaceOptions = async () => {
//         //初始化最顶端父节点
//         const placeOptions = [{ value: 0, label: 'XX公司', isLeaf: false }]

//         //如果是编辑资产
//         const { isUpdate, asset } = this
//         if (isUpdate && asset.place_obj && asset.place_obj.parent_ids && asset.place_obj.parent_ids.length > 1) {
//             const place_id = asset.place_obj.parent_ids
//             //遍历parent，读取当前的所有父位置的列表，并形成options
//             let parentOptions = placeOptions
//             for (let id of place_id) {
//                 const places = await this.getPlaces(id)
//                 const childOptions = places.map(p => ({
//                     value: p.id,
//                     label: p.name,
//                     isLeaf: !p.hasChildren
//                 }))

//                 //找到对应的父分类Option并关联
//                 const targetOption = parentOptions.find(option => option.value === id)
//                 targetOption.children = childOptions
//                 parentOptions = childOptions
//             }
//         }
//         //更新状态
//         this.setState({ placeOptions })
//     }

//     //用户点击级联下拉框相应选项，动态加载下一级
//     loadPlaceData = async selectedOptions => {
//         const targetOption = selectedOptions[selectedOptions.length - 1];
//         targetOption.loading = true;
//         const result = await reqPlaces(targetOption.value)
//         targetOption.loading = false;

//         this.setState({ loading: false })
//         if (result.code === "success") {
//             const places = result.data
//             if (places && places.length > 0) {
//                 const childOptions = places.map(c => ({
//                     value: c.id,
//                     label: c.name,
//                     isLeaf: !c.hasChildren
//                 }))
//                 targetOption.children = childOptions
//             }
//             else {
//                 targetOption.isLeaf = true
//             }
//             this.setState({
//                 placeOptions: [...this.state.placeOptions]
//             })
//         } else {
//             message.error('获取分类列表失败')
//         }
//     }

//     //表单提交处理
//     onFinish = async (values) => {
//         //获取并处理数据
//         const {
//             name,
//             types,
//             statusDisplay,
//             places,
//             use_dept,
//             manage_user,
//             model,
//             manufactory,
//             sn,
//             product_dateObj,
//             trade_dateObj,
//             expire_dateObj,
//             asset_code,
//             ip,
//             mac,
//             display,
//             printer,
//             cpu,
//             memory,
//             disk,
//             os,
//             func_type,
//             paper,
//             nic,
//             database,
//             middleware,
//             usage,
//             online_dateObj,
//             management_ip,
//             port_num,
//             device_detail,
//         } = values
//         //status处理
//         let status = 2
//         if (statusDisplay) {
//             status = 1
//         }
//         //type.sub_type处理
//         let type, sub_type
//         if (types.length === 1) {
//             type = types[0]
//         }
//         else {
//             type = types[0]
//             sub_type = types[1]
//         }
//         //位置处理
//         let place
//         if (places.length > 0) {
//             place = places[places.length - 1]
//         }
//         else {
//             place = null
//         }

//         if (use_dept === '') {
//             use_dept = null
//         }
//         if (manage_user === '') {
//             manage_user = null
//         }
//         //日期处理
//         const product_date = product_dateObj ? product_dateObj.format('YYYY-MM-DD') : null
//         const trade_date = trade_dateObj ? trade_dateObj.format('YYYY-MM-DD') : null
//         const expire_date = expire_dateObj ? expire_dateObj.format('YYYY-MM-DD') : null
//         const online_date = online_dateObj ? online_dateObj.format('YYYY-MM-DD') : null

//         const asset = {
//             name,
//             type,
//             sub_type,
//             status,
//             place,
//             use_dept,
//             manage_user,
//             model,
//             manufactory,
//             sn,
//             product_date,
//             trade_date,
//             expire_date,
//             asset_code,
//             ip,
//             mac,
//             display,
//             printer,
//             cpu,
//             memory,
//             disk,
//             os,
//             func_type,
//             paper,
//             nic,
//             database,
//             middleware,
//             usage,
//             online_date,
//             management_ip,
//             port_num,
//             device_detail,
//         }
//         //如果是更新，还需要加入id
//         if (this.isUpdate) {
//             asset.id = this.asset.id
//         }

//         //发送请求
//         const result = await reqAddOrUpdateAsset(asset)
//         if (result.code === "success") {
//             message.success(`${this.isUpdate ? '更新' : '新增'}资产成功`)
//             this.props.history.goBack()
//         }
//         else {
//             message.error(`${this.isUpdate ? '更新' : '新增'}资产失败`)
//         }
//     };

//     constructor(props) {
//         super(props)
//         const asset = this.props.location.state
//         this.isUpdate = !!asset
//         this.asset = asset || {}
//     }

//     componentDidMount() {
//         if (this.isUpdate) {
//             this.setState({
//                 type: this.props.location.state.type
//             })
//         }
//         this.initTypeOptions()
//         this.initPlaceOptions()

//     }

//     render() {
//         const { typeOptions, type, placeOptions } = this.state
//         const { isUpdate, asset } = this

//         const types = []
//         if (isUpdate) {
//             types.push(asset.type)
//             if (asset.sub_type) {
//                 types.push(asset.sub_type)
//             }
//         }

//         let places = []
//         if (isUpdate) {
//             places = [...asset.place_obj.parent_ids, asset.place_obj.id]
//         }

//         const title = (
//             <span>
//                 <Button type='link' onClick={() => { this.props.history.goBack() }}><ArrowLeftOutlined style={{ fontSize: 15 }} /></Button>
//                 {isUpdate ? '编辑资产' : '添加资产'}
//             </span>
//         )

//         return (

//             < Card title={title} >
//                 <Form
//                     labelCol={{
//                         xs: { span: 24, offset: 0 },
//                         sm: { span: 4, offset: 4 },
//                     }}
//                     wrapperCol={{
//                         xs: { span: 24 },
//                         sm: { span: 12 },
//                     }}
//                     onFinish={this.onFinish}
//                 >
//                     <Item name='types' initialValue={types} label="资产类型" rules={[{ required: true }]}>
//                         <Cascader
//                             placeholder='请选择资产类型'
//                             disabled={isUpdate}
//                             options={typeOptions}
//                             loadData={this.loadTypeData}
//                             onChange={this.onTypeChange}
//                         />
//                     </Item>

//                     <Item name='name' initialValue={asset.name} label="资产名称" rules={[{ required: true }]}>
//                         <Input placeholder='请输入资产名称' />
//                     </Item>

//                     <Item name='statusDisplay' label="状态" initialValue={asset.status ? (asset.status === 1 ? true : false) : true} valuePropName="checked" rules={[{ required: true }]}>
//                         <Switch checkedChildren="使用中" unCheckedChildren="停止使用" />
//                     </Item>

//                     <Item name='places' initialValue={places} label="资产位置" >
//                         <Cascader
//                             placeholder='请选择资产位置'
//                             options={placeOptions}
//                             loadData={this.loadPlaceData}
//                         //onChange={this.onPlaceChange}
//                         />
//                     </Item>

//                     <Item name='use_dept' initialValue={asset.use_dept} label="使用部门" >
//                         <Input placeholder='请输入使用部门' />
//                     </Item>

//                     <Item name='manage_user' initialValue={asset.manage_user} label="管理人">
//                         <Input placeholder='请输入管理人' />
//                     </Item>

//                     <Item name='model' initialValue={asset.model} label="型号" >
//                         <Input placeholder='请输入型号' />
//                     </Item>

//                     <Item name='manufactory' initialValue={asset.manufactory} label="生产厂家" >
//                         <Input placeholder='请输入生产厂家' />
//                     </Item>

//                     <Item name='sn' initialValue={asset.sn} label="系列号" >
//                         <Input placeholder='请输入系列号' />
//                     </Item>

//                     <Item name='product_dateObj' initialValue={asset.product_date ? moment(asset.product_date) : null} label="生产日期" >
//                         <DatePicker placeholder='请选择生产日期' />
//                     </Item>

//                     <Item name='trade_dateObj' initialValue={asset.trade_date ? moment(asset.trade_date) : null} label="购买日期" >
//                         <DatePicker placeholder='请选择购买日期' />
//                     </Item>

//                     <Item name='expire_dateObj' initialValue={asset.expire_date ? moment(asset.expire_date) : null} label="过保日期" >
//                         <DatePicker placeholder='请选择过保日期' />
//                     </Item>

//                     <Item name='asset_code' initialValue={asset.asset_code} label="固定资产编码" >
//                         <Input placeholder='请输入固定资产编码' />
//                     </Item>

//                     {(() => {
//                         switch (type) {
//                             case 'PC':
//                                 return <PCAddUpdate asset={asset} />
//                             case 'Printer':
//                                 return <PrinterAddUpdate asset={asset} />
//                             case 'Server':
//                                 return <ServerAddUpdate asset={asset} />
//                             case 'NetDevice':
//                                 return <NetDevAddUpdate asset={asset} />
//                             case 'SecDevice':
//                                 return <SecDevAddUpdate asset={asset} />
//                             default:
//                                 return null
//                         }
//                     })()}

//                     <Item
//                         wrapperCol={{
//                             xs: { span: 24, offset: 0 },
//                             sm: { span: 16, offset: 8 },
//                         }}
//                     >
//                         <Button type="primary" htmlType="submit">
//                             提交
//                         </Button>
//                     </Item>

//                 </Form>
//             </Card >
//         );
//     }
// }

function PCAddUpdate(props) {
  const { asset } = props;
  return (
    <>
      <Item name="ip" initialValue={asset.ip} label="IP地址">
        <Input placeholder="请输入IP地址" />
      </Item>
      <Item name="mac" initialValue={asset.mac} label="Mac地址">
        <Input placeholder="请输入Mac地址" />
      </Item>
      <Item name="display" initialValue={asset.display} label="显示器型号">
        <Input placeholder="请输入显示器型号" />
      </Item>
      <Item name="printer" initialValue={asset.printer} label="打印机型号">
        <Input placeholder="请输入打印机型号" />
      </Item>
      <Item name="cpu" initialValue={asset.cpu} label="CPU型号">
        <Input placeholder="请输入CPU型号" />
      </Item>
      <Item name="memory" initialValue={asset.memory} label="内存容量">
        <Input placeholder="请输入内存容量" />
      </Item>
      <Item name="disk" initialValue={asset.disk} label="硬盘容量">
        <Input placeholder="请输入硬盘容量" />
      </Item>
      <Item name="os" initialValue={asset.os} label="操作系统版本">
        <Input placeholder="请输入操作系统版本" />
      </Item>
    </>
  );
}

function PrinterAddUpdate(props) {
  const { asset } = props;
  return (
    <>
      <Item name="ip" initialValue={asset.ip} label="IP地址">
        <Input placeholder="请输入IP地址" />
      </Item>
      <Item name="mac" initialValue={asset.mac} label="Mac地址">
        <Input placeholder="请输入Mac地址" />
      </Item>
      <Item name="func_type" initialValue={asset.func_type} label="打印机功能">
        <Select placeholder="请选择打印机功能">
          <Option value={1}>打印</Option>
          <Option value={2}>打印+扫描</Option>
          <Option value={3}>打印+扫描+传真</Option>
        </Select>
      </Item>
      <Item name="paper" initialValue={asset.paper} label="支持纸张类型">
        <Input placeholder="请输入支持纸张类型" />
      </Item>
    </>
  );
}

function ServerAddUpdate(props) {
  const { asset } = props;
  return (
    <>
      <Item name="ip" initialValue={asset.ip} label="IP地址">
        <Input placeholder="请输入IP地址" />
      </Item>
      <Item name="mac" initialValue={asset.mac} label="Mac地址">
        <Input placeholder="请输入Mac地址" />
      </Item>
      <Item name="cpu" initialValue={asset.cpu} label="CPU型号">
        <Input placeholder="请输入CPU型号" />
      </Item>
      <Item name="memory" initialValue={asset.memory} label="内存容量">
        <Input placeholder="请输入内存容量" />
      </Item>
      <Item name="disk" initialValue={asset.disk} label="硬盘容量">
        <Input placeholder="请输入硬盘容量" />
      </Item>
      <Item name="nic" initialValue={asset.disk} label="网络接口">
        <Input placeholder="请输入网络接口" />
      </Item>
      <Item name="os" initialValue={asset.os} label="操作系统版本">
        <Input placeholder="请输入操作系统版本" />
      </Item>
      <Item name="database" initialValue={asset.database} label="数据库版本">
        <Input placeholder="请输入数据库版本" />
      </Item>
      <Item
        name="middleware"
        initialValue={asset.middleware}
        label="中间件版本"
      >
        <Input placeholder="请输入中间件版本" />
      </Item>
      <Item name="usage" initialValue={asset.os} label="用途">
        <Input placeholder="请输入用途" />
      </Item>
      <Item
        name="online_dateObj"
        initialValue={asset.online_date ? moment(asset.online_date) : null}
        label="上线日期"
      >
        <DatePicker placeholder="请选择上线日期" />
      </Item>
    </>
  );
}

function NetDevAddUpdate(props) {
  const { asset } = props;
  return (
    <>
      <Item
        name="management_ip"
        initialValue={asset.management_ip}
        label="管理IP地址"
      >
        <Input placeholder="请输入管理IP地址" />
      </Item>
      <Item name="port_num" initialValue={asset.port_num} label="端口个数">
        <InputNumber placeholder="请输入端口个数" />
      </Item>
      <Item
        name="device_detail"
        initialValue={asset.device_detail}
        label="设备详情"
        style={{ textAlign: "left" }}
      >
        <Input.TextArea placeholder="请输入设备详情" />
      </Item>
    </>
  );
}

function SecDevAddUpdate(props) {
  const { asset } = props;
  return (
    <>
      <Item
        name="management_ip"
        initialValue={asset.management_ip}
        label="管理IP地址"
      >
        <Input placeholder="请输入管理IP地址" />
      </Item>
      <Item name="usage" initialValue={asset.usage} label="用途">
        <Input placeholder="请输入用途" />
      </Item>
      <Item
        name="device_detail"
        initialValue={asset.device_detail}
        label="设备详情"
        style={{ textAlign: "left" }}
      >
        <Input.TextArea placeholder="请输入设备详情" />
      </Item>
    </>
  );
}

//export default AssetAddUpdate;
