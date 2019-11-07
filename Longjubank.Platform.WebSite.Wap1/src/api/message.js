import http from './axios'
//个人消息列表
export function GetMyMessageList(pageindex) {
    var params = {
        ActionName: 'GetMyMessageList',
        MessageType: 'PushMessage',
        data: { msgtype: 1, pageindex: pageindex, pagesize: 20 }
    }
    return http.normalRequest({
        data: params
    })
}
/**
 * 查看消息详情，更改消息状态
 * @param {number} msgtype 1个人消息 2活动通知 3平台公告
 * @param {number} msgid 消息ID
 */
export function GetMyMessage(msgtype,msgid) {
    var params = {
        ActionName: 'GetMyMessage',
        MessageType: 'PushMessage',
        data: { msgtype: msgtype, msgid: msgid }
    }
    return http.normalRequest({
        data: params
    })
}
/**
 *  * 平台公告
 * @param {boolean} islogin  登录状态  活动通知为false
 * @param {number} msgtype 1个人消息 2活动通知 3平台公告
 * @param {number} pageindex 分页页码
 */
export function GetSysMessageList(islogin,msgtype,pageindex) {
    var params = {
        ActionName: islogin?'GetSystemMessageList':'GetMessageList',
        MessageType: 'PCPushMessage',
        data: { msgtype: msgtype, pageindex: pageindex, pagesize: 20 }
    }
    return http.normalRequest({
        data: params
    })
}
/**
 *  * 获取未读消息数量
 */
export function GetMessageCount(islogin,msgtype,pageindex) {
    var params = {
        ActionName: 'GetMessageCount',
        MessageType: 'PushMessage'
    }
    return http.normalRequest({
        data: params
    })
}
/**
 * 全设已读
 */
export function ReadAllMessage() {
    var params = {
        ActionName: 'ReadAllMessage',
        MessageType: 'PushMessage',
    }
    return http.normalRequest({
        data: params
    })
}