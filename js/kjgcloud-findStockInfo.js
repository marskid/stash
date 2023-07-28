const url = $request.url;
const method = $request.method;
const notifyTitle = "抢票插件";

if (url.indexOf('findStockInfo') == -1) {
  $done({});
}

if (method !== "POST") {
    $done({});
}

if (!$response.body) {
    $done({});
}
console.log(url);
console.log(`body:${$response.body}`);

let body = JSON.parse($response.body);
if (!body.data || body.code != "0") {
    $notification.post(notifyTitle, url, "data字段错误");
} else {
  body.data.forEach(i => {
    i.stockCount = 1000;
    i.usedCount = 100;
  });
  body = JSON.stringify(body);
  console.log(`body:${$response.body}`);
  $done({
      body
  });
}
