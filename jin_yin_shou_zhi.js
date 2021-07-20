/**
金银手指，小羊毛
获取cookie地址：""https://h4.102727.com/?openId=osZYi6ChfrvbXNGPSd5xBFSnSyGM&t=5935&code=001jUA000pf45M1oBq000zFD3c4jUA0A&state=STATE"
 */

var $nobyda = nobyda()
var cookieVal = $nobyda.read("CookieTB");


var  get_cookie = {
    url : "https://h4.102727.com/?openId=osZYi6ChfrvbXNGPSd5xBFSnSyGM&t=5935&code=001jUA000pf45M1oBq000zFD3c4jUA0A&state=STATE",
    headers:{
        Cookie : cookieVal,
        "User-Agent" : "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63030073)"
    }
};
get_cookie()

function GetCookie() {
    var headerCookie = $request.headers["Cookie"];
    if (headerCookie.indexOf("Cookie") != -1) {
        var cookie = $nobyda.write(headerCookie, "caakieTB")
        if (!cookie) {
            $nobyda.notify("写入cookie失败", "", "");
        } else {
            $nobyda.notify("写入成功", "", "");
        }
    }
    $nobyda.done()
}

function nobyda() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const adapterStatus = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status
            } else if (response.statusCode) {
                response["status"] = response.statusCode
            }
        }
        return response
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = {
                url: options
            }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, (error, response, body) => {
            callback(error, adapterStatus(response), body)
        })
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = {
                url: options
            }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) {
            $httpClient.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
    }
    const done = (value = {}) => {
        if (isQuanX) return $done(value)
        if (isSurge) isRequest ? $done(value) : $done()
    }
    return {
        isRequest,
        notify,
        write,
        read,
        get,
        post,
        done
    }
};