console.log(JSON.stringify($environment));
console.log($script.type);

$notification.post('title', 'subtitle', 'body')

const url = $request.url;
const method = $request.method;
const notifyTitle = "抢票插件";



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
    $done({
        body
    });
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
    $done({
        body
    });
    }
} else {
    $done({});
}

console.log(`url:${url}`);
console.log(`body:${$response.body}`);



