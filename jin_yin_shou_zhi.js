/**
金银手指，小羊毛
获取cookie地址：""https://h4.102727.com/?openId=osZYi6ChfrvbXNGPSd5xBFSnSyGM&t=5935&code=001jUA000pf45M1oBq000zFD3c4jUA0A&state=STATE"
 */
var $nobyda = nobyda()

if ($nobyda.isRequest) {
    GetCookie()
}





function GetCookie() {
    var CookieName = "B站漫画";
    var CookieKey = "CookieBM";
    var regex = /UM_distinctid=.+?;/;
    if ($request.headers) {
        var header = $request.headers['Cookie'] ? $request.headers['Cookie'] : "";
        if (header.indexOf("UM_distinctid=") != -1) {
            var CookieValue = regex.exec(header)[0];
            if ($nobyda.read(CookieKey)) {
                if ($nobyda.read(CookieKey) != CookieValue) {
                    var cookie = $nobyda.write(CookieValue, CookieKey);
                    if (!cookie) {
                        $nobyda.notify("更新" + CookieName + "Cookie失败‼️", "", "");
                    } else {
                        $nobyda.notify("更新" + CookieName + "Cookie成功 🎉", "", "");
                    }
                }
            } else {
                var cookie = $nobyda.write(CookieValue, CookieKey);
                if (!cookie) {
                    $nobyda.notify("首次写入" + CookieName + "Cookie失败‼️", "", "");
                } else {
                    $nobyda.notify("首次写入" + CookieName + "Cookie成功 🎉", "", "");
                }
            }
        } else {
            $nobyda.notify("写入" + CookieName + "Cookie失败‼️", "", "Cookie关键值缺失");
        }
    } else {
        $nobyda.notify("写入" + CookieName + "Cookie失败‼️", "", "配置错误, 无法读取请求头,");
    }
    $nobyda.end()
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