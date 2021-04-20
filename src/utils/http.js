import axios from 'axios'
import router from "@/router"

const service = axios.create({
    baseURL: 'http://159.75.51.228:8080',
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
            }
        } else {
            config.headers = {
            }
        }
        if (config.url === 'refresh') {
            config.headers = {
                'refresh-token': localStorage.getItem('refresh_token'),
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
        if( response.data.token ) {
            localStorage.setItem('access_token',response.data.token)
        }
        switch (response.status) {
            // 401 权限不足
            case 401:
                router.replace({
                    path: '/login'
                }).then(r => {
                    alert('请先登录！')
                })
                break

            // 403 登录过期
            case 403:
                router.replace({
                    path: '/login'
                }).then(r => {
                    // 删除旧的token
                    localStorage.removeItem('access_token')
                    alert('登录过期，请重新登录！')
                })
                break

            // 404 页面不存在
            case 404:
                router.replace({
                    path: '/404'
                }).then(r => {})
                break

            // 500 服务器错误
            case 500:
                router.replace({
                    path: '/500'
                }).then(r => {})
                break

        }
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

export default service
