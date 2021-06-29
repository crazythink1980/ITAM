import React, { useState, useEffect } from "react";
import { Card, Select, Input, Button, Table, Tag, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { reqAssets, reqAsset, reqDelAsset } from "../../../../api";
import { PAGE_SIZE, ASSET_TYPES } from "../../../../utils/constant";

const Option = Select.Option;

export default function AseetHome(props) {
  const [assets, setAssets] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "序号",
      render: (text, record, index) =>
        `${(pageNum - 1) * PAGE_SIZE + (index + 1)}`, //当前页数减1乘以每一页页数再加当前页序号+1
    },
    {
      title: "资产类型",
      dataIndex: "type",
      render: (type) => ASSET_TYPES[type],
    },
    {
      title: "资产名称",
      dataIndex: "name",
    },
    {
      title: "型号",
      dataIndex: "model",
    },
    {
      title: "生产厂家",
      dataIndex: "manufactory",
    },
    {
      title: "资产位置",
      dataIndex: "place_obj",
      render: (place_obj) => place_obj.fullname,
    },
    {
      title: "使用部门",
      dataIndex: "use_dept",
    },
    {
      title: "管理人",
      dataIndex: "manage_user",
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      render: (status) => {
        return (
          <span>
            {status === 1 ? (
              <Tag color="success">使用中</Tag>
            ) : (
              <Tag color="warning">停止使用</Tag>
            )}
          </span>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "id",
      width: 100,
      render: (id, record, index) => {
        return (
          <span>
            <Button
              type="link"
              onClick={() => {
                handleAssetDetail(id);
              }}
            >
              详情
            </Button>
            <Button
              type="link"
              onClick={() => {
                handleAssetAddUpdate(id);
              }}
            >
              修改
            </Button>
            <Button
              type="link"
              onClick={() => {
                handleAssetDelete(record, index);
              }}
            >
              删除
            </Button>
          </span>
        );
      },
    },
  ];

  const title = (
    <span>
      <Select value="1" style={{ width: 150 }}>
        <Option value="1">按名称搜索</Option>
        <Option value="2">按描述搜索</Option>
      </Select>
      <Input placeholder="关键字" style={{ width: 120, margin: "0 15px" }} />
      <Button type="primary">搜索</Button>
    </span>
  );

  const extra = (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => {
        props.history.push("/assets/asset/addupdate");
      }}
    >
      添加
    </Button>
  );

  const getAssets = async (pageNum) => {
    setLoading(true);
    const result = await reqAssets(pageNum, PAGE_SIZE);
    setLoading(false);
    if (result.code === "success") {
      const { list, total } = result.data;
      setTotal(total);
      setPageNum(pageNum);
      setAssets(list);
    } else {
      message.error("获取资产列表失败");
    }
  };

  const getAssetDetail = async (id) => {
    const result = await reqAsset(id);
    if (result.code === "success") {
      return result.data;
    } else {
      message.error("获取资产详情失败");
    }
  };

  const handleAssetDetail = async (id) => {
    const asset = await getAssetDetail(id);
    if (asset) {
      props.history.push("/assets/asset/detail", asset);
    }
  };

  const handleAssetAddUpdate = async (id) => {
    const asset = await getAssetDetail(id);
    if (asset) {
      props.history.push("/assets/asset/addupdate", asset);
    }
  };

  const handleAssetDelete = (asset, index) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定删除资产：" + asset.name + " ?",
      okText: "确定 ",
      cancelText: "取消",
      onOk: async () => {
        const result = await reqDelAsset(asset.id);
        if (result.code === "success") {
          message.success("删除资产成功");
          const current = (pageNum - 1) * PAGE_SIZE + (index + 1); //计算当前被删除的记录是第几条
          //如果当前记录不是第一页且是最后一条而且在列表的最顶端,获取并显示上一页列表
          if (pageNum !== 1 && current === total && index === 0) {
            getAssets(pageNum - 1);
          } else {
            getAssets(pageNum); //获取并显示当前页
          }
        } else {
          message.error("删除资产失败");
        }
      },
    });
  };

  useEffect(() => {
    getAssets(1);
  }, []);

  return (
    <Card title={title} extra={extra}>
      <Table
        rowKey="id"
        bordered
        loading={loading}
        dataSource={assets}
        columns={columns}
        pagination={{
          defaultPageSize: PAGE_SIZE,
          showQuickJumper: true,
          total,
          onChange: getAssets,
        }}
      />
    </Card>
  );
}
