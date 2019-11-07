import http from './axios'

function GetWebNewsList(index, pagesize) {
    var params = {
        ActionName: 'GetWebNewsList',
        MessageType: 'WebManager',
    }

    params['data'] = {
        pagesize: pagesize,
        pageindex: index
    }

    return http.normalRequest({ data: params })
}

export { GetWebNewsList }