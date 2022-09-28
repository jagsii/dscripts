async function parseUpdate(url, options) {
  options = options || {};
  const httpOptions = {
    url,
    ...options.httpOptions
  };
  const clientOptions = {
    encoding: "utf-8",
    "x-mobile": 1,
    ...options.clientOptions
  };

  const {
    send
  } = require("http");

  const parseDate = require("datetime/parse_date");

  stat('request');
  let response = await send(httpOptions, clientOptions);
  stat('request');
  assertOK(response);
  let html = response.body;
  stat('match');
  const name = html.subRegex(/<ul id="chapter-list[^>]*>(?:\s*<li>\s*<a[^>]*>\s*<span[^>]*>[^<]*<\/span>\s*<\/a>\s*<\/li>)*\s*<li>\s*<a[^>]*[^>]*href="[^"]+\d+\.html"[^>]*>\s*<span>(?<name>[^<]*)<\/span>\s*<\/a>\s*<\/li>(?:\s*<li>\s*<a[^>]*>\s*<span>下拉式阅读<\/span>\s*<\/a>\s*<\/li>)?\s*<\/ul>/);
  const updateTime = html.subRegex(/<span class="date">(?<updateTime>[^<]*)</);
  stat('match');
  const result = {
    url,
    name
  };

  if (updateTime) {
    result.updateTime = parseDate(updateTime, options.format || 'yyyy-MM-dd HH:mm');
  }

  return result;
}

exports.parseUpdate = parseUpdate;