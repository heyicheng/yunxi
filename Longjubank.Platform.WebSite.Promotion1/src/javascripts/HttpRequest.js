import axios from 'axios'

const normalRequest = axios.create({
    method: 'post',
    baseURL: window.location.protocol + "//" + window.location.host + process.env.VUE_APP_WEBAPI_DOMAIN + '/json/reply/HtmlRequest',
    timeout: 3000, // request timeout
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    transformRequest: [function (data) {
        return JSON.stringify(data)
    }],
})

function interceptors(httpRequest) {
    // 添加响应拦截器
    httpRequest.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        return response.data
    }, function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    });
}

interceptors(normalRequest)

const http = { normalRequest }

export default http