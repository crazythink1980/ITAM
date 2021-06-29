import { request } from './request'

const BASE = 'http://localhost:5000'

//用户登录
export const reqLogin = (username, password) => request(BASE + '/api/users/login', 'POST', { username, password })
//获取用户列表
export const reqUserList = () => request(BASE + '/api/users/', 'GET')

//获取资产分类列表
export const reqCategorys = (parent_id) => request(BASE + '/api/assettype', 'GET', { parent_id })
//增加资产分类列表
export const reqAddCategory = (parent_id, name) => request(BASE + '/api/assettype', 'POST', { parent_id, name })
//更新资产分类列表
export const reqUpdateCategory = (id, parent_id, name) => request(BASE + '/api/assettype', 'PUT', { id, parent_id, name })
//删除资产分类列表
export const reqDelCategory = (id) => request(BASE + '/api/assettype', 'DELETE', { id })
//获取单个资产分类
export const reqCategory = (id) => request(BASE + '/api/assettype', 'GET', { id })

//获取资产列表
export const reqAssets = (pageNum = 1, pageSize = 10, type = 0) => request(BASE + '/api/assets', 'GET', { pageNum, pageSize, type })
//获取资产详情
export const reqAsset = (id) => request(BASE + '/api/assets/detail', 'GET', { id })
//增加或更新资产
export const reqAddOrUpdateAsset = (asset) => request(BASE + '/api/assets', asset.id ? 'PUT' : 'POST', asset)
//删除资产
export const reqDelAsset = (id) => request(BASE + '/api/assets', 'DELETE', { id })

//获取资产位置列表
export const reqPlaces = (parent_id) => request(BASE + '/api/place', 'GET', { parent_id })
//获取资产位置信息（单个）
export const reqPlace = (id) => request(BASE + '/api/place', 'GET', { id })
//增加资产位置
export const reqAddPlace = (parent_id, name) => request(BASE + '/api/place', 'POST', { parent_id, name })
//更新资产位置
export const reqUpdatePlace = (id, parent_id, name) => request(BASE + '/api/place', 'PUT', { id, parent_id, name })
//删除资产位置
export const reqDelPlace = (id) => request(BASE + '/api/place', 'DELETE', { id })
