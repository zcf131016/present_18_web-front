import axios from 'axios'
import qs from 'qs'

const service = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 6000,
    withCredentials: true // 允许携带token ,这个是解决跨域产生的相关问题
})
// 在 request 拦截器实现
service.interceptors.request.use(
    config => {
        config.withCredentials = true
        let token = localStorage.getItem('access_token')
        if (token) {
            config.headers = {
                'access-token': token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        if (config.url === 'refresh') {
            config.headers = {
                'refresh-token': localStorage.getItem('refresh_token'),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

//在 response 拦截器实现
service.interceptors.response.use(
    response => {
        // 定时刷新access-token
        if (!response.data.value && response.data.data.message === 'token invalid') {
            // 刷新token

        }
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

export default service
