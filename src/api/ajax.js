import axios from 'axios'
import { message } from 'antd'

const headerJSON = {
    "Content-Type": "application/json"
};

export default function ajax(url, data = {}, type = 'GET') {

    return new Promise((resolve, reject) => {
        let promise
        if (type === 'GET') {
            promise = axios.get(url, {
                params: data
            })
        } else {
            promise = axios.post(url, JSON.stringify(data), { headerJSON })
        }
        promise.then(response => {
            resolve(response.data)
        }).catch(error => {
            message.error('请求出错了: ' + error.message)
        })
    })

}
