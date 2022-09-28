async function parseInfo(originName, url, regex, options) {
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

  let _regex;

  if (typeof regex === 'string') {
    if (regex === 'Synopsis') {
      _regex = /<span class="title">(?<name>[^<]*)<[\S\s]*<div class="synopsisArea_detail">(?:\s*<div id="bookdetail">\s*<div id="thumb">)?\s*<img src="(?<cover>[^"]*)"[\S\s]*<(?:p|li) class="author">(?:作者：|<a[^>]*>)+(?<author>[^<]*)<[\S\s]*状态：(?<serial>[^<]*)<\/[\S\s]*<p class="review">(?<intro>[^<]*)<\/p>/;
    } else if (regex === 'block_txt2') {
      _regex = /class="block_img2">\s*<img src="(?<cover>[^"]*)"[\S\s]+<div class="block_txt2">\s*<p>\s*<a[^>]*>\s*<h2>(?<name>[^<]+).*<[\S\s]*<p>作者：(?:<a[^>]*>)?(?<author>[^<]*)[\S\s]*<p>状态：(?<serial>[^<]*)<\/p>[\S\s]+<div class="intro_info">(?<intro>(?:[^<]+|<br ?\/?>)+)</;
    } else if (regex === 'meta') {
      _regex = /meta (?:property|name)="og:novel:book_name" content="(?<name>[^"]+)"|meta (?:property|name)="og:novel:author" content="(?<author>[^"]+)"|meta property="og:novel:status" content="(?<serial>[^"]+)"|meta property="og:image" content="(?<cover>[^"]+)"|meta property="og:description" content="(?<intro>[^"]+)"/g;
    } else if (regex === 'dd_box') {
      _regex = /<div class="cover">\s*<img src="(?<cover>[^"]*)"[\S\s]+?<dt class="name">(?<name>[^<]+)<\/dt>\s*<dd class="dd_box">\s*<span>作者：(?<author>[^<]+)<[\S\s]+?<dd class="dd_box">\s*<span>状态：(?<serial>[^<]*)<[\S\s]+?<dt>(?:内容|手机)简介<\/dt>\s*<dd>(?<intro>[^<]*)/;
    } else {
      throw new Error(`unknown ParseInfo regex ${regex}`);
    }
  } else {
    _regex = regex;
  }

  const result = {
    url,
    originName,
    name: '',
    author: '',
    cover: '',
    serial: 0,
    intro: ''
  };
  const serialChar = options.serialChar || '完';
  stat('collect');

  if (_regex instanceof Array) {
    const matches = {};

    for (let re of _regex) {
      Object.assign(matches, html.subRegexMap(re));
    }

    if (matches.name !== undefined) {
      result.name = matches.name;
    }

    if (matches.author !== undefined) {
      result.author = matches.author;
    }

    if (matches.cover !== undefined) {
      result.cover = absoluteUrl(matches.cover.trim(), url);
    }

    if (matches.serial !== undefined) {
      result.serial = (typeof serialChar === 'string' ? matches.serial.indexOf(serialChar) !== -1 : serialChar.test(matches.serial)) ? 1 : 0;
    }

    if (matches.intro !== undefined) {
      result.intro = matches.intro;
    }
  } else {
    if (_regex.flags.indexOf('g') === -1) {
      stat('match');

      const m = _regex.exec(html);

      stat('match');

      if (m == null) {
        return null;
      }

      if (m.groups.name !== undefined) {
        result.name = m.groups.name;
      }

      if (m.groups.author !== undefined) {
        result.author = m.groups.author;
      }

      if (m.groups.cover !== undefined) {
        result.cover = absoluteUrl(m.groups.cover.trim(), url);
      }

      if (m.groups.serial !== undefined) {
        result.serial = (typeof serialChar === 'string' ? m.groups.serial.indexOf(serialChar) !== -1 : serialChar.test(m.groups.serial)) ? 1 : 0;
      }

      if (m.groups.intro !== undefined) {
        result.intro = m.groups.intro;
      }
    } else {
      stat('matchAll');
      const matches = html.matchAll(_regex);
      stat('matchAll');

      for (let m of matches) {
        if (m.groups.name !== undefined) {
          result.name = m.groups.name;
          continue;
        }

        if (m.groups.author !== undefined) {
          result.author = m.groups.author;
          continue;
        }

        if (m.groups.cover !== undefined) {
          result.cover = absoluteUrl(m.groups.cover.trim(), url);
          continue;
        }

        if (m.groups.serial !== undefined) {
          result.serial = (typeof serialChar === 'string' ? m.groups.serial.indexOf(serialChar) !== -1 : serialChar.test(m.groups.serial)) ? 1 : 0;
          continue;
        }

        if (m.groups.intro !== undefined) {
          result.intro = m.groups.intro;
        }
      }
    }
  }

  if (options.introRegex != null) {
    stat('intro');
    let introRegex;

    if (options.introRegex === '.intro>p') {
      introRegex = /<div class="intro">\s*<p>(?<intro>[^<]*)</;
    } else if (options.introRegex === '.intro_info') {
      introRegex = /<div class="intro_info">(?<intro>[^<]*)</;
    } else {
      introRegex = options.introRegex;
    }

    const introMatch = introRegex.exec(html);

    if (introMatch != null) {
      result.intro = introMatch.groups.intro;
    }

    stat('intro');
  }

  if (result.intro.indexOf('<p>') !== -1) {
    result.intro = result.intro.replace(/<\/p>/g, '\n').replace(/<p>/g, '');
  }

  stat('collect');

  if (options.postprocess != null) {
    options.postprocess(html, result);
  }

  return result;
}

exports.parseInfo = parseInfo;