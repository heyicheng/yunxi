import http from './axios'

/**
 * 修改登录密码
 * @param {String} oldPwd 旧密码
 * @param {String} newPwd 新密码
 */
export function EditLoginPwd(oldPwd, newPwd) {
    var params = {
        ActionName: 'EditLoginPwd',
        MessageType: 'Oauth',
        data: { OldPwd: oldPwd, NewPwd: newPwd }
    }
    return http.senstiveRequest({
        data: params
    })
}
/**
 * 绑定新手机号
 * @param {number} phone 手机号
 */
export function BindMobile(phone) {
    var params = {
        ActionName: 'BindMobile',
        MessageType: 'Account',
        data: { mobile: phone }
    }

    return http.normalRequest({ data: params })
}
/**
 * 设置授权密码
 * @param {number} password 密码
 */
export function SetPayPwd(password) {
    var params = {
        ActionName: 'SetPayPwd',
        MessageType: 'Oauth',
        data: { NewPayPwd: password }
    }

    return http.senstiveRequest({ data: params })
}
/**
 * 修改授权密码
 * @param {number} oldPayPwd 旧密码
 * @param {number} newPayPwd 新密码
 */
export function EditPayPwd(oldPayPwd, newPayPwd) {
    var params = {
        ActionName: 'EditPayPwd',
        MessageType: 'Oauth',
        data: { OldPayPwd: oldPayPwd, NewPayPwd: newPayPwd }
    }

    return http.senstiveRequest({ data: params })
}
/**
 * 修改密码，验证原授权密码
 * @param {number} paypwd 密码
 */
export function CheckPayPwd(paypwd) {
    var params = {
        ActionName: 'CheckPayPwd',
        MessageType: 'Oauth',
        data: { paypwd: paypwd}
    }

    return http.senstiveRequest({ data: params })
}
/**
 * 找回支付密码/重置密码
 * @param {number} mobile 手机号
 * @param {number} NewPayPwd 密码
 */
export function RetrievePayPwd(mobile,NewPayPwd) {
    var params = {
        ActionName: 'RetrievePayPwd',
        MessageType: 'Oauth',
        data: { mobile: mobile,NewPayPwd:NewPayPwd}
    }

    return http.senstiveRequest({ data: params })
}
/**
 * 上传头像
 * @param {Base64} pic 图片
 */
export function UpdateHeadPic(pic) {
    var params = {
        ActionName: 'UpdateHeadPic',
        MessageType: 'Account',
        data: { pic: pic}
    }

    return http.senstiveRequest({ data: params })
}