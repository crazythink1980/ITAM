//import jsonp from 'jsonp'
import ajax from './ajax'
//import { message } from 'antd'

const BASE = 'http://localhost:5000'

export const reqLogin = (username, password) => ajax(BASE + '/api/user/login', { username, password }, 'POST')

export const reqUserList = () => ajax(BASE + '/api/user', {}, 'GET')