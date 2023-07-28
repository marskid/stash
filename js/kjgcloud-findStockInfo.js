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
    body.data.forEach(i => {
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



