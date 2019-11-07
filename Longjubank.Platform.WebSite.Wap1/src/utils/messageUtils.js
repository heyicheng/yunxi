import { GetMessageCount } from "@/api/message.js"
import CommonUtils from  '@/utils/public'

// 记录是否在查询中
var quering = false;
// 记录回调列表
var callbackList = [];

/**
 * 消息数量获取的工具方法
 * @param {function} callback (个人消息数量， 活动消息数量， 平台公告消息数量，返回值回调)=>{}
 * 需要注意的是，目前该接口并未返回活动消息数量，因此活动消息数量始终返回0
 */
export function GetMessageCountUtils(callback) {
    if (CommonUtils.isEmpty(localStorage.getItem('token'))) {
        callback(0, 0, 0, null)
        return
    }
    if (callback) {
        callbackList.push(callback)
    }

    if (quering) {
        return
    }
    quering = true
    GetMessageCount().then(response => {
        if (response.ResultCode != 0) {
            messageCountUtilsCallback(0, 0, 0, { code: response.ResultCode, msg: response.ResultMsg })
        } else {
            messageCountUtilsCallback(response.Data.personalnumber, 0, response.Data.systemnumber, null)
        }
        quering = false
    }).catch(error => {
        messageCountUtilsCallback(0, 0, 0, { code: 1006, msg: "网络异常" })
        quering = false
    })
}

function messageCountUtilsCallback(personal, acitivty, system, error) {
    callbackList.forEach((callback) => {
        callback(personal, acitivty, system, error)
    })

    callbackList = []
}