import http from './HttpRequest';
import { isNull } from "util";

function getCookie(name) {
    var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
}

var TopJetConfig = {
    AppId: "100212",
    Version: "2.6.1",
    equipment: '', //设备，app or pc
    token: ''
};

// 判断设备返回app和pc
function judgeEquipment() {
    if (typeof sug != 'undefined' || typeof window.getToken != 'undefined') {
        TopJetConfig.equipment = 'app';
    } else {
        TopJetConfig.equipment = 'pc';
    }
};
judgeEquipment()

//获取token包含app还是pc端两种情况
function getPcToken() {
    var pcToken = getCookie(process.env.VUE_APP_PC_TOKEN_COOKIE_KEY);
    if (pcToken) {
        return pcToken;
    } else {
        return '';
    }
};
function getAppToken() {
    if (typeof sug != "undefined") {
        return sug.getToken();
    } else {
        return window.getToken();
    }
};
function getAllToken() {
    if (TopJetConfig.equipment == 'app') {
        TopJetConfig.token = getAppToken();
    } else if (TopJetConfig.equipment == 'pc') {
        TopJetConfig.token = getPcToken();
    }
};
getAllToken()

function LongjulcServerRequest(ActionName, MessageType, data) {
    var params = {
        ActionName: ActionName,
        MessageType: MessageType,
        AppId: TopJetConfig.AppId,
        Version: TopJetConfig.Version,
        timestamp: Math.round(new Date().getTime() / 1000),
        Token: TopJetConfig.token
    }
    if (data === undefined || isNull(data)) {
        params.Data = "{}"
    } else {
        params.Data = JSON.stringify(data)
    }
    return http.normalRequest({ data: params })
}

function GoToLogin() {
    if (TopJetConfig.equipment === "pc") {
        // PC
        location.href = process.env.VUE_APP_LONGJULC_HOME_URL + "/User/Login";
    } else {
        // APP,SUG为android，其余为iOS
        if (typeof sug != "undefined" && typeof sug.goToLogin != "undefined") {
            return sug.goToLogin();
        } else if (typeof window.goToLogin != "undefined") {
            return window.goToLogin();
        }
    }
}


export { TopJetConfig, getAllToken, getCookie, LongjulcServerRequest, GoToLogin }

