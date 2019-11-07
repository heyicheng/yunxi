import http from './axios'

/*登录  */
export function LOGIN(LoginName, Pwd) {
  var params = {}
  // 接口方法
  params['ActionName'] = 'AccountLogin'
  params['MessageType'] = 'Oauth'
  // 接口参数
  params['data'] = {
    'Pwd': Pwd,
    'LoginName': LoginName
  };
  return http.senstiveRequest({
    data: params
  })
}
/* 发送验证码 
type ： 1注册 2找回密码 3快速登录
*/
export function SendSmsCode(mobile, type) {
  var params = {}
  // 接口方法
  params['ActionName'] = 'SendSmsCode'
  params['MessageType'] = 'Mobile'
  // 接口参数
  params['data'] = {
    'mobile': mobile,
    'sendType': type
  };
  return http.normalRequest({
    data: params
  })
}
/* 快速登录  */
export function AccountFastLogin(LoginName, code) {
  var params = {}
  // 接口方法
  params['ActionName'] = 'AccountFastLogin'
  params['MessageType'] = 'FastOauth'
  // 接口参数
  params['data'] = {
    'Vcode': code,
    'LoginName': LoginName
  };
  return http.senstiveRequest({
    data: params
  })
}
/* 短信验证
type ： 1注册 2找回密码 3快速登录
code ：验证码
*/
export function CheckSmsCode(mobile, type, code) {
  var params = {}
  // 接口方法
  params['ActionName'] = 'CheckSmsCode'
  params['MessageType'] = 'Mobile'
  // 接口参数
  params['data'] = {
    'mobile': mobile,
    'sendType': type,
    'code': code
  };
  return http.normalRequest({
    data: params
  })
}
/* 注册 */
export function AccountRegister(useraccount, loginpwd, reference) {
  var params = {}
  // 接口方法
  params['ActionName'] = 'AccountRegister'
  params['MessageType'] = 'Oauth'
  // 接口参数
  params['data'] = {
    /* 账户 */
    'useraccount': useraccount,
    /* 密码 */
    'loginpwd': loginpwd,
    /* 推荐人 */
    'reference': reference,
    /* 地址 */
    'regaddress': ""
  };
  return http.senstiveRequest({
    data: params
  })
}
/* 找回密码 */
export function RetrieveLoginPwd(mobile,newpwd) {
  var params = {}
  // 接口方法
  params['ActionName'] = 'RetrieveLoginPwd'
  params['MessageType'] = 'Oauth'
  // 接口参数
  params['data'] = {
    /* 账户 */
    'mobile': mobile,
    /* 密码 */
    'newpwd': newpwd,
  };
  return http.senstiveRequest({
    data: params
  })
}
/* 退出登录 */
export function LoginOut() {
  var params = {}
  // 接口方法
  params['ActionName'] = 'LoginOut'
  params['MessageType'] = 'Oauth'
  params['data'] = '';
  return http.senstiveRequest({
    data: params
  })
}
