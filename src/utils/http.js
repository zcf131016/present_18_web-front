import axios from 'axios'
import router from "@/router"

const service = axios.create({
    baseURL: 'http://159.75.51.228:8080',
    timeout: 6000,
    withCredentials: false
})
// 在 request 拦截器实现
service.interceptors.request.use(
    config => {
        let token = localStorage.getItem('access_token')
        if (token) {
            config.headers = {
                'Authorization': token,
            }
        } else {
            config.headers = {
            }
        }
        // 刷新令牌
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
        // 刷新access-token
        if( response.data.token ) {
            window.localStorage.setItem('access_token',response.data.token)
        }
        if(response.status == 200) {
            switch (response.data.status) {
                // 401 权限不足
                case 401:
                    router.replace({
                        path: '/login'
                    }).then(r => {
                        alert(response.data.msg)
                    })
                    break

                // 403 登录过期
                case 403:
                    router.replace({
                        path: '/login'
                    }).then(r => {
                        // 删除旧的token
                        window.localStorage.removeItem('access_token')
                        alert(response.data.msg)
                    })
                    break


                // 404 页面不存在
                case 404:
                    router.replace({
                        path: '/404'
                    }).then(r => {
                    })
                    break
            }
        } else {
            alert('服务器未响应！')
        }
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

export default service
