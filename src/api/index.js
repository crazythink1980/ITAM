import { request } from './request'

const BASE = 'http://localhost:5000'

export const reqLogin = (username, password) => request(BASE + '/api/user/login', 'POST', { username, password })

export const reqUserList = () => request(BASE + '/api/user/', 'GET')