import { request } from './request'

const BASE = 'http://localhost:5000'

export const reqLogin = (username, password) => request(BASE + '/api/user/login', 'POST', { username, password })

export const reqUserList = () => request(BASE + '/api/user/', 'GET')

export const reqCategorys = (parent_id) => request(BASE + '/api/assets/assettype', 'GET', { parent_id })