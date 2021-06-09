import service from "@/utils/http";
import qs from 'qs'
// // 获取本地token, 默认请求头带token
// let token = window.localStorage['token'];
// axios.defaults.headers.common['token'] = token;
// 封装axios
// post 请求
export const postRequest = (url, params) => {
  return service({
    method: 'post',
    url: `${url}`,
    data: params,
    // transformRequest: [function (data) {
    //   // 对接受到的数据进行转换
    //   let ret = ''
    //   for (let it in data) {
    //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    //   }
    //   return ret
    // }],
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
// 上传文件
export const uploadFileRequest = (url, params) => {
  return service({
    method: 'post',
    url: `${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
export const putRequest = (url, params) => {
  return service({
    method: 'put',
    url: `${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
// 删除请求
export const deleteRequest = (url) => {
  return service({
    method: 'delete',
    url: `${url}`
  });
}

// get 请求
export const getRequest = (url,params) => {
  return service({
    method: 'get',
    params: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: `${url}`
  });
}


