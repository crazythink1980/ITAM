//公司名称
export const COMPANY = 'XX公司'

//资产管理中的每页显示条数
export const PAGE_SIZE = 3

//资产一级分类，资产管理使用，同步对应下面的CATEGORYS，需要一同修改
export const ASSET_TYPES = {
    PC: 'PC',
    Printer: '网络打印机',
    Server: '服务器',
    NetDevice: '网络设备',
    SecDevice: '安全设备',
    Software: '软件'
}

//资产一级分类，资产分类管理中使用，同步对于上面的ASSET_TYPES，需要一同修改
export const CATEGORYS = [
    { id: 'PC', name: 'PC终端', parent_id: '0' },
    { id: 'Printer', name: '网络打印机', parent_id: '0' },
    { id: 'Server', name: '服务器', parent_id: '0' },
    { id: 'NetDevice', name: '网络设备', parent_id: '0' },
    { id: 'SecDevice', name: '安全设备', parent_id: '0' },
    { id: 'Software', name: '软件', parent_id: '0' },
];