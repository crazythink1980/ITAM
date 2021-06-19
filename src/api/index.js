//import jsonp from 'jsonp'
import ajax from './ajax'
//import { message } from 'antd'

const BASE = ''

export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')
