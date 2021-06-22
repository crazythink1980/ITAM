import axios from 'axios'
import { message } from 'antd'

import memoryUtils from '../utils/memoryUtils'

const headerJSON = {
    "Content-Type": "application/json"
};

// http request 拦截器
axios.interceptors.request.use(
    config => {
        const token = memoryUtils.user.access_token
        if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.authorization = token  //请求头加上token
        }
        return config
    },
    err => {
        return Promise.reject(err)
    })

export default function ajax(url, data = {}, type = 'GET') {

    return new Promise((resolve, reject) => {
        let promise
        if (type === 'GET') {
            promise = axios.get(url, {
                params: data
            })
        } else {
            promise = axios.post(url, JSON.stringify(data), { headers: headerJSON })
        }
        promise.then(response => {
            resolve(response.data)
        }).catch(error => {
            message.error('请求出错了: ' + error.message)
        })
    })

}

export const request = (api, method = 'GET', params = {}, config = {}) => {
    const data = (method === 'GET') ? 'params' : 'data';
    let headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
    };

    if (memoryUtils.user.access_token) {
        headers = {
            ...headers,
            'Authorization': `Bearer ${memoryUtils.user.access_tokenn}`,
        }

        if (config.headers) {
            headers = {
                ...headers,
                ...config.headers
            }
        }
        return new Promise((resolve, reject) => {
            axios({
                url: api,
                method,
                [data]: params,
                headers,
            }).then(response => {
                resolve(response.data)
            })
                .catch(error => {
                    console.dir(error);
                    message.error(typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data));
                    reject(error);
                });
        });
    }
}
