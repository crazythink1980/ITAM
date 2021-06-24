import { request } from './request'

const BASE = 'http://localhost:5000'

//用户登录
export const reqLogin = (username, password) => request(BASE + '/api/user/login', 'POST', { username, password })
//获取用户列表
export const reqUserList = () => request(BASE + '/api/user/', 'GET')

//获取资产分类列表
export const reqCategorys = (parent_id) => request(BASE + '/api/assets/assettype', 'GET', { parent_id })
//增加资产分类列表
export const reqAddCategory = (parent_id, name) => request(BASE + '/api/assets/assettype', 'POST', { parent_id, name })
//更新资产分类列表
export const reqUpdateCategory = (id, parent_id, name) => request(BASE + '/api/assets/assettype', 'PUT', { id, parent_id, name })
//删除资产分类列表
export const reqDelCategory = (id) => request(BASE + '/api/assets/assettype', 'DELETE', { id })