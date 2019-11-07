import { vueInstance } from "@/main.js"
import Global from '@/utils/public'

/*
处理跨域的URL.
目前已经处理的有活动页（/Msg/html）、H5页面（/p2ph5）、msg项目（msg.xxxx.xxx/html）
*/
export function transCrossOriginURL(url) {
    var index = url.indexOf("/Msg/html");
    if (index > 0) {
        return process.env.VUE_APP_ACTIVITY_SERVER + url.slice(index);
    }

    index = url.indexOf("/p2ph5");
    if (index > 0) {
        return process.env.VUE_APP_H5SERVER + url.slice(index);
    }

    // 分解url
    var tempUrl = url
    var protocol = ''
    var domin = ''
    var queryPath = ''
    let protocolIndex = tempUrl.indexOf('://')
    if (protocolIndex > 0) {
        protocol = tempUrl.slice(0, protocolIndex + 3)
        tempUrl = tempUrl.slice(protocolIndex + 3)
    }

    let dominIndex = tempUrl.indexOf('/')
    if (dominIndex > 0) {
        domin = tempUrl.slice(0, dominIndex)
        queryPath = tempUrl.slice(dominIndex)
    } else {
        domin = tempUrl
    }

    if (domin.split('.')[0].indexOf('msg') >= 0 && queryPath.indexOf('/html') === 0) {
        return process.env.VUE_APP_MSG_SERVER + "/pcmsg" + queryPath;
    }

    return url
}

// 标题设置
export function setTitle(val) {
    document.title = val
}

//   Token 获取
export function getToken() {
    return Global.getItemFromLocalStorage("token");
}

//   UI交互
export function p2p_OpenUI(param) {
    try {
        let ui_params = JSON.parse(param);
        var destPath = "";
        if (ui_params.ui === "ui_main") {
            destPath = "/";
        } else if (ui_params.ui === "ui_finance") {
            destPath = "/moneymanage";
        } else if (
            ui_params.ui === "ui_users" ||
            ui_params.ui === "ui_aixiaodai" ||
            ui_params.ui === "ui_56pay"
        ) {
            destPath = "/myaccount";
        } else if (ui_params.ui === "ui_register") {
            destPath = "/register";
        }

        if (window.parent === window) {
            vueInstance.$router.replace(destPath);
        } else {
            window.parent.location.replace(destPath);
        }
    } catch (error) { }
}

// 跳转至登录页
export function goToLogin() {
    vueInstance.$router.push("/login");
}

export function enable_social_share() {
}
