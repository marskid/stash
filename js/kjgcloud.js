const notifyTitle = "抢票插件";

if ($script.type == 'response') {
    const url = $request.url;
    const method = $request.method;

    if (!$response.body) {
        $done({});
    }
    
    if (url.indexOf('queryDayStockMargin') != -1) {
        let body = JSON.parse($response.body);
        if (!body.data || body.code != "0") {
          $notification.post(notifyTitle, url, "data字段错误");
        } else {
        let lastStockId = 0;
        body.data.forEach((i,j) => {
            let next = body.data[j+1] || {};
            if (i.canOrder == true && i.itemStockId && next.canOrder == false) {
                let itemStockId = i.itemStockId.split(',')[0];
                if (itemStockId) {
                    lastStockId = parseInt(itemStockId);
                }
            }
            if (!i.itemStockId && lastStockId != 0) {
                let a = --lastStockId,b = --lastStockId;
                i.itemStockId = `${b},${a},`;
            }
            i.canOrder = true;
            i.canOrderStatus = 3;
            i.lastCount = 1000;
        });
        body = JSON.stringify(body);
        console.log(`url:${url}`);
        console.log(`body:${body}`);
        $done({ body });
        }
    } else if (url.indexOf('findStockInfo') != -1) {
        let body = JSON.parse($response.body);
        if (!body.data || body.code != "0") {
          $notification.post(notifyTitle, url, "data字段错误");
        } else {
        body.data.forEach(i => {
            i.stockCount = 1000;
            i.usedCount = 100;
        });
        body = JSON.stringify(body);
        console.log(`url:${url}`);
        console.log(`body:${body}`);
        $done({ body });
        }
    } else if (url.indexOf('newCreateOrder') != -1) {
        let body = JSON.parse($response.body);
        if (body.code != "0") {
            let data = [];
            let newCreateOrder = $persistentStore.read("newCreateOrder");
            if (newCreateOrder) {
                data = JSON.parse(newCreateOrder);
            }
            data.push($request);
            console.log("抢购请求：");
            console.log($request.url);
            console.log($request.body);
            $persistentStore.write(JSON.stringify(data), "newCreateOrder");
            $notification.post(notifyTitle, body.message, `已加入抢购队列${data.length+1}`);
        }
    } else {
        $done({});
    }
}

if ($script.type == 'cron') {
    let data = [];
    let newCreateOrder = $persistentStore.read("newCreateOrder");
    if (newCreateOrder) {
        data = JSON.parse(newCreateOrder);
    }
    data.forEach((req) => {
        $httpClient.post(req, (error, response, data) => {
            if (error) {
                console.log(error);
                $notification.post(notifyTitle, "抢票失败", JSON.stringify(error));
            } else {
                console.log(data);
                $notification.post(notifyTitle, "抢票成功", JSON.stringify(data));
            }
          });
    });
    $persistentStore.write(JSON.stringify([]), "newCreateOrder");
}
