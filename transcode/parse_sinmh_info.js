async function parseInfo(originName, url, options) {
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

  const absoluteUrl = require("utils/absolute_url");

  stat('request');
  let response = await send(httpOptions, clientOptions);
  stat('request');
  assertOK(response);
  let html = response.body;
  const result = {
    url,
    originName,
    name: '',
    author: '',
    cover: '',
    serial: 0,
    intro: ''
  };
  stat('collect');
  const matches = {};

  for (let re of [/id="comicName">(?<name>[^<]+)</, /id="Cover">\s*<img src="(?<cover>[^"]*)"[^>]*>\s*<\/div>\s*<div class="sub_r autoHeight">\s*<p class="txtItme">\s*<span class="icon icon01"><\/span>(?<author>[^<]*)</, /(?<serial>已完结)<\/a>\s*<\/p>\s*<p class="txtItme">/, /"txtDesc[^>]*>(?:介绍:)?(?<intro>[^<]*)<\/p>(?:\s*<p class="openBtn"><\/p>)?\s*<div/]) {
    Object.assign(matches, html.subRegexMap(re));
  }

  if (matches.name !== undefined) {
    result.name = matches.name.trim();
  }

  if (matches.author !== undefined) {
    result.author = matches.author.trim();
  }

  if (matches.cover !== undefined) {
    result.cover = absoluteUrl(matches.cover.trim(), url);
  }

  if (matches.serial !== undefined) {
    result.serial = matches.serial.indexOf('完结') === -1 ? 0 : 1;
  }

  if (matches.intro !== undefined) {
    result.intro = matches.intro.replace(/^漫画简介：/, '').trim();
  }

  stat('collect');

  if (options.postprocess != null) {
    options.postprocess(html, result);
  }

  return result;
}

exports.parseInfo = parseInfo;