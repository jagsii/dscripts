function parseRegex(regex) {
  if (regex instanceof RegExp) {
    return regex;
  }

  if (regex instanceof Array) {
    return regex;
  }

  if (regex === 'Synopsis') {
    return /更新：(?<updateTime>[^<]+)<\/a><\/h2>\s*<div[^>]* class="directoryArea">\s*<p>\s*<a[^>]*>(?<name>[^<]+)</;
  }

  if (regex === 'block_txt2') {
    return /<p>更新：(?<updateTime>[^<]*)<\/p>\s*<p>\s*最新：<a[^>]*>(?<name>[^<]*)</;
  }

  if (regex === 'meta') {
    return [/<meta property=["']og:novel:update_time["'] content=["'](?<updateTime>[^"']+)["']/, /<meta property=["']og:novel:las?test_chapter_name["'] content=["'](?<name>[^"']+)["']/];
  }

  if (regex === 'dd_box') {
    return /<dd>\s*<span style="width: 100%;">更新：(?<updateTime>[^<]+)<\/span>\s*<\/dd>\s*<dd>\s*<span style="width: 100%;">最新：<a[^>]*>(?<name>[^<]+)</;
  }

  throw new Error(`unknown ParseUpdate regex ${regex}`);
}

async function parseUpdate(url, regex, options) {
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

  if (options.retry != null) {
    let count = 0;

    while ((await options.retry(response, httpOptions, clientOptions, count)) === true) {
      response = await send(httpOptions, clientOptions);
    }
  }

  if (response.statusCode < 200 || response.statusCode > 299) {
    throw new Error(`Request failed with statusCode ${response.statusCode}, ${response.reasonPhrase}`);
  }

  let html = response.body;

  if (options.preprocess != null) {
    html = options.preprocess(html);
  }

  if (typeof regex === 'function') {
    const _ = regex(html);

    const result = {
      url,
      name: _.name
    };

    if (typeof _.updateTime === 'string') {
      result.updateTime = parseDate(_.updateTime, options.format);
    } else if (_.updateTime != null) {
      result.updateTime = _.updateTime;
    }

    return result;
  } else {
    let _regex = parseRegex(regex);

    stat('match');
    let matches;

    if (_regex instanceof Array) {
      matches = {};

      for (let re of _regex) {
        Object.assign(matches, html.subRegexMap(re));
      }
    } else {
      let _ = _regex.exec(html);

      if (_ != null) {
        matches = _.groups;
      }
    }

    stat('match');

    if (matches == null) {
      return null;
    }

    const result = {
      url,
      name: matches.name
    };

    if (matches.updateTime) {
      result.updateTime = parseDate(matches.updateTime, options.format);
    }

    return result;
  }
}

exports.parseUpdate = parseUpdate;