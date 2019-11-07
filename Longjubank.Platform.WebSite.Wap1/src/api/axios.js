import axios from 'axios'
import secureUtils from '@/utils/secretUtils.js'
import AppEventHandler from '@/utils/AppEventHandler.js'
import {Toast} from 'vant'
import {mainTainCode} from '@/api/messageCode'

const CryptoJS = require('crypto-js')
const USER_MACHINECODE = navigator.appCodeName + '_' + navigator.appVersion
const WAP_VERSION = '1.0.0'

const senstiveRequest = axios.create({
  method: 'post',
  baseURL: process.env.VUE_APP_DOMAINNAME + '/json/reply/SensitiveMessageRequest',
  timeout: 3000, // request timeout
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },

  transformRequest: [function (data) {
    //此处做加密逻辑
    var params = {}
    // 通用参数
    params['appid'] = process.env.VUE_APP_APPID
    params['version'] = WAP_VERSION
    params['machinecode'] = USER_MACHINECODE
    // TODO: 接入token
    // params['token'] = ''
    if (localStorage.getItem('token')) {
      params.token = localStorage.getItem('token')
    }
    // 方法名称及类型
    params['ActionName'] = data.ActionName
    params['MessageType'] = data.MessageType

    // 加密数据
    var key = secureUtils.aes_random_key()
    if (!('data' in data)) {
      data.data = { a: 0 }
    }
    params['data'] = secureUtils.aes_encrypt(JSON.stringify(data.data), key)

    // 加密key
    params['key'] = secureUtils.rsa_encrypt(key)
    // 签名
    params['timestamp'] = Math.round(new Date().getTime() / 1000)

    var paramsKeys = Object.keys(params).sort(function (a, b) {
      return requestKeyCompare(a, b)
    })
    var dataForSign = ''
    for (var signkey in paramsKeys) {
      dataForSign += params[paramsKeys[signkey]];
    }
    params['sign'] = secureUtils.rsa_sign(dataForSign)

    return JSON.stringify(params);
  }],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [function (response) {
    try {
      response = JSON.parse(response)
      var sign = response['Sign']

      var signKeys = Object.keys(response).sort(function (a, b) {
        return requestKeyCompare(a, b)
      })
      var responeSignData = ''
      for (var key in signKeys) {
        if (signKeys[key] != 'Sign') {
          responeSignData += response[signKeys[key]]
        }
      }
      var verifySuccess = secureUtils.rsa_verify(responeSignData, sign)
      if (verifySuccess) {
        // 验证通过，揭秘数据
        var responsekey = secureUtils.rsa_decrypt(response['Key'])
        var result = JSON.parse(secureUtils.aes_decrypt(response['Data'], responsekey))
        response = {
          'ResultCode': response['ResultCode'],
          'ResultMsg': response['ResultMsg'],
          'Data': result
        }
      } else {
        response = {
          'ResultCode': '1006',
          'ResultMsg': '从服务器返回的数据签名验证失败'
        }
      }
    } catch (error) {

    }

    return response;
  }],
})


const normalRequest = axios.create({
  method: 'post',
  baseURL: process.env.VUE_APP_DOMAINNAME + '/json/reply/MessageRequest',
  timeout: 3000, // request timeout
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },

  transformRequest: [function (data) {
    //此处做加密逻辑
    var params = {}
    // 通用参数
    params['appid'] = process.env.VUE_APP_APPID
    params['version'] = WAP_VERSION
    params['machinecode'] = USER_MACHINECODE
    // TODO: 接入token
    // params['token'] = ''

    if (localStorage.getItem('token')) {
      params.token = localStorage.getItem('token')
    }
    // 方法名称及类型
    params['ActionName'] = data.ActionName
    params['MessageType'] = data.MessageType

    // 加密数据
    if (!('data' in data)) {
      data.data = { a: 0 }
    }
    params['data'] = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(data.data)))

    // 签名
    params['timestamp'] = Math.round(new Date().getTime() / 1000)

    var paramsKeys = Object.keys(params).sort(function (a, b) {
      return requestKeyCompare(a, b)
    })

    var dataForSign = ''
    for (var signkey in paramsKeys) {
      dataForSign += params[paramsKeys[signkey]];
    }

    params['sign'] = secureUtils.normal_md5_sign(dataForSign);

    return JSON.stringify(params);
  }],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [function (response) {
    try {
      response = JSON.parse(response)
      var signKeys = Object.keys(response).sort(function (a, b) {
        return requestKeyCompare(a, b)
      })
      var responeSignData = ''
      for (var key in signKeys) {
        if (signKeys[key] != 'Sign') {
          if (signKeys[key] == 'ResultCode') {
            responeSignData += response[signKeys[key]].toString()
          } else {
            responeSignData += response[signKeys[key]]
          }
        }
      }

      if (response['Sign'] === secureUtils.normal_md5_sign(responeSignData)) {
        // 验证通过，揭秘数据
        var result = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(response['Data'])))
        response = {
          'ResultCode': response['ResultCode'],
          'ResultMsg': response['ResultMsg'],
          'Data': result
        }
      } else {
        response = {
          'ResultCode': '1006',
          'ResultMsg': '从服务器返回的数据签名验证失败'
        }
      }
    } catch (error) {

    }

    return response;
  }],
})



function interceptors(func) {
  // 添加请求拦截器
  func.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  // 添加响应拦截器
  func.interceptors.response.use(function (response) {
    if (response.data.ResultCode == 501) {
      // window.localStorage.removeItem('token')
      window.localStorage.setItem('token', '')
      AppEventHandler.triggerAppEvent(AppEventHandler.token_expired_event_name)
    }
    if(mainTainCode.indexOf(response.data.ResultCode)>-1){//新增当返回105时表示系统维护
      Toast({ message: response.data.ResultMsg, duration: 1500 });
    }
    // 对响应数据做点什么
    return response.data
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
}
interceptors(senstiveRequest)
interceptors(normalRequest)

// 字符串比较函数
function requestKeyCompare(str1, str2) {
  let a = str1.toLowerCase()
  let b = str2.toLowerCase()

  var minLength = Math.min(a.length, b.length)
  for (let i = 0; i < minLength; i++) {
    if (a.charCodeAt(i) != b.charCodeAt(i)) {
      return a.charCodeAt(i) - b.charCodeAt(i)
    }
  }

  return a.length - b.length
}



const http = {
  senstiveRequest,
  normalRequest
}

export default http
