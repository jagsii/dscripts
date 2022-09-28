async function parseCatalog(url, options) {
  const httpOptions = {
    url,
    ...options.httpOptions
  };
  const clientOptions = {
    encoding: "utf-8",
    ...options.clientOptions
  };

  const {
    send
  } = require("http");

  const absoluteUrl = require("utils/absolute_url");

  stat('request');
  let response = await send(httpOptions, clientOptions);
  stat('request');

  if (options.retry != null) {
    let count = 0;

    while ((await options.retry(response, httpOptions, clientOptions, count)) === true) {
      response = await send(httpOptions, clientOptions);
    }
  }

  if (response.statusCode < 200 || response.statusCode > 299) {
    throw new Error(`Request failed with statusCode ${response.statusCode}, ${response.reasonPhrase}`);
  }

  const html = response.body;
  stat('parseRegex');
  const _fragmentRegex = /<ul id="chapter-list-[^>]*>(?<fragment>(?:\s*<li>\s*<a[^>]*>\s*<span>[^<]*<\/span>\s*<\/a>\s*<\/li>)+)/;
  const _regex = /href="(?<url>[^"]+\d+\.html)"[^>]*>\s*<span>(?<name>[^<]+)</g;
  stat('parseRegex');
  const _idRegexp = /(?<id>\d+)\.html/;
  stat('fragment');

  let fragment = _fragmentRegex.exec(html).groups.fragment;

  stat('fragment');
  stat('matchAll');
  const matches = fragment.matchAll(_regex);
  stat('matchAll');
  const catalog = [];
  stat('collect');

  for (let match of matches) {
    if (match.groups.name != null) {
      const cid = _idRegexp.exec(match.groups.url).groups.id;

      const record = {
        id: cid,
        name: match.groups.name,
        url: absoluteUrl(match.groups.url, url)
      };
      catalog.push(record);
    }
  }

  stat('collect');
  return catalog;
}

exports.parseCatalog = parseCatalog;