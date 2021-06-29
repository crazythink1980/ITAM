import React, { useState, useEffect } from "react";
import { Card, Button, Tag, Descriptions } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { reqCategory } from "../../../../api";
import { ASSET_TYPES } from "../../../../utils/constant";

const { Item } = Descriptions;

function AssetDetail(props) {
  const [cName, setCName] = useState("");
  const asset = props.location.state;
  const title = (
    <span>
      <Button
        type="link"
        onClick={() => {
          props.history.goBack();
        }}
      >
        <ArrowLeftOutlined style={{ fontSize: 15 }} />
      </Button>
      资产详情
    </span>
  );

  const getAssetSubType = async () => {
    const { sub_type } = props.location.state;
    if (sub_type) {
      const result = await reqCategory(sub_type);
      setCName(result.data.name);
    }
  };

  useEffect(() => {
    getAssetSubType();
  }, []);

  return (
    <Card title={title}>
      <Descriptions title="基本信息">
        <Item label="资产类型">
          {" "}
          {ASSET_TYPES[asset.type]} {cName ? "/" + cName : null}
        </Item>
        <Item label="资产名称">{asset.name}</Item>
        <Item label="状态">
          {asset.status === 1 ? (
            <Tag color="success">使用中</Tag>
          ) : (
            <Tag color="warning">停止使用</Tag>
          )}
        </Item>
        <Item label="设备位置">{asset.place_obj.fullname}</Item>
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
          case "PC":
            return <PCDetail asset={asset} />;
          case "Printer":
            return <PrinterDetail asset={asset} />;
          case "Server":
            return <ServerDetail asset={asset} />;
          case "NetDevice":
            return <NetDevDetail asset={asset} />;
          case "SecDevice":
            return <SecDevDetail asset={asset} />;
          default:
            return null;
        }
      })()}
    </Card>
  );
}

function PCDetail(props) {
  const { asset } = props;
  return (
    <Descriptions title="PC信息">
      <Item label="IP地址">{asset.ip}</Item>
      <Item label="Mac地址" span={2}>
        {asset.mac}
      </Item>
      <Item label="显示器型号">{asset.display}</Item>
      <Item label="打印机型号" span={2}>
        {asset.printer}
      </Item>
      <Item label="CPU型号">{asset.cpu}</Item>
      <Item label="内存容量">{asset.memory}</Item>
      <Item label="硬盘容量">{asset.disk}</Item>
      <Item label="操作系统版本">{asset.os}</Item>
    </Descriptions>
  );
}

function PrinterDetail(props) {
  const { asset } = props;
  return (
    <Descriptions title="打印机信息">
      <Item label="IP地址">{asset.ip}</Item>
      <Item label="Mac地址" span={2}>
        {asset.mac}
      </Item>
      <Item label="打印机功能">
        {(() => {
          switch (asset.func_type) {
            case 1:
              return "打印";
            case 2:
              return "打印+扫描";
            case 3:
              return "打印+扫描+传真";
            default:
              return null;
          }
        })()}
      </Item>
      <Item label="支持纸张类型" span={2}>
        {asset.paper}
      </Item>
    </Descriptions>
  );
}

function ServerDetail(props) {
  const { asset } = props;
  return (
    <Descriptions title="服务器信息">
      <Item label="IP地址">{asset.ip}</Item>
      <Item label="Mac地址">{asset.mac}</Item>
      <Item label="网络接口">{asset.nic}</Item>
      <Item label="CPU型号">{asset.cpu}</Item>
      <Item label="内存容量">{asset.memory}</Item>
      <Item label="硬盘容量">{asset.disk}</Item>
      <Item label="操作系统版本">{asset.os}</Item>
      <Item label="数据库版本">{asset.database}</Item>
      <Item label="中间件版本">{asset.middleware}</Item>
      <Item label="用途">{asset.usage}</Item>
      <Item label="上线日期">{asset.online_date}</Item>
    </Descriptions>
  );
}

function NetDevDetail(props) {
  const { asset } = props;
  return (
    <Descriptions title="网络设备信息">
      <Item label="管理IP地址">{asset.management_ip}</Item>
      <Item label="端口数" span={2}>
        {asset.port_num}
      </Item>
      <Item label="设备详情" span={3}>
        {asset.device_detail}
      </Item>
    </Descriptions>
  );
}

function SecDevDetail(props) {
  const { asset } = props;
  return (
    <Descriptions title="安全设备信息">
      <Item label="管理IP地址">{asset.management_ip}</Item>
      <Item label="用途" span={2}>
        {asset.usage}
      </Item>
      <Item label="设备详情" span={3}>
        {asset.device_detail}
      </Item>
    </Descriptions>
  );
}

export default AssetDetail;
