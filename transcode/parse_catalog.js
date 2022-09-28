const {
  send
} = require("http");

const absoluteUrl = require("utils/absolute_url");

function cleanNewest(catalog) {
  if (catalog.length === 0) {
    return catalog;
  }

  let since = -1;
  const maxCheck = Math.min(17, catalog.length);

  if (!catalog.first.volume) {
    for (let i = 0; i < maxCheck; i++) {
      if (catalog[i].id !== catalog[catalog.length - 1 - i].id) {
        since = i;
        break;
      }
    }
  } else {
    for (let i = 0; i < maxCheck; i++) {
      if (catalog[i].volume && catalog[i].volume.indexOf('最新章节') === -1) {
        since = i;
        break;
      }
    }
  }

  if (since > 0) {
    catalog.splice(0, since);
  }

  return catalog;
}

function parseRegex(regex) {
  if (regex instanceof Array) {
    let _regex = regex[1];

    if (_regex.flags.indexOf('g') === -1) {
      _regex = RegExp(_regex, 'g');
    }

    const result = [regex[0], _regex];

    if (regex.length > 2) {
      result.push(regex[2]);
    }

    return result;
  }

  if (regex === 'div.mulu+dl>(dt,dd)') {
    return [/<div class="mulu"[^>]*>(?:<script>[^<]*<\/script>)?<\/div>\s*<dl[^>]*>\s*(?<fragment>(?:\s*<dt>[^<]*<\/dt>\s*|\s*<dd>\s*<a href="[^"]+">[^<]+<\/a>\s*<\/dd>\s*)*)\s*<\/dl>/, /<dt>(?<volume>[^<]+)<\/dt>|<dd>\s*<a href="(?<url>[^"]+)"[^>]*>(?<name>[^<]+)<\/a>\s*<\/dd>/g];
  }

  if (regex === 'div#list>dl>(dt,dd)') {
    return [/<div (?:id|class)="list"[^>]*>\s*<dl>\s*(?<fragment>(?:\s*<dt[^>]*>(?:\s*(?:<b>)?[^<]+<\/b>)?[^<]*<\/dt>\s*|\s*<dd>\s*(?:<a[^>]*>[^<]+<\/a>)?\s*<\/dd>\s*|\s*<(?:div|center) class="clear">[\S\s]*?<\/(?:div|center)>\s*)*)\s*<\/dl>/, /<dt[^>]*>(?:\s*(?:<b>)?[^<]+<\/b>)?(?<volume>[^<]+)<\/dt>|<dd>\s*<a[^>]* href\s*="(?<url>[^"]+)"[^>]*>(?<name>[^<]+)<\/a>\s*<\/dd>/g];
  }

  if (regex === 'listmain>dl>dd') {
    return [/<div (?:id|class)="listmain"[^>]*>\s*<dl>\s*(?<fragment>(?:\s*<dt>[^<]*<\/dt>\s*|\s*<dd>\s*(?:<a[^>]*>[^<]+<\/a>)?\s*<\/dd>\s*)*)\s*<\/dl>/, /<dd>\s*<a href\s*="(?<url>[^"]+)"[^>]*>(?<name>[^<]+)<\/a>\s*<\/dd>/g];
  }

  if (regex === 'div#list>dl>(dt>b,dd)') {
    return [/<div id="list"[^>]*>\s*<dl>\s*(?<fragment>(?:\s*<dt>\s*(<b>[^<]+<\/b>\s*(?:<a[^>]*>[^<]+<\/a>)?|[^<]+)\s*<\/dt>\s*|\s*<dd>\s*(<a[^>]*>[^<]+<\/a>)?\s*<\/dd>\s*)+)\s*/, /(?<since><dt>\s*<b>(?:《[^》]+》)?\s*(?<volume>[^<]+)<\/b>)|<dd>\s*<a href\s*="(?<url>[^"]+)"[^>]*>(?<name>[^<]+)<\/a>\s*<\/dd>/g];
  }

  if (regex === 'div#list>dl>dd') {
    return [/<div[^>]*(?:id|class)="list"[^>]*>\s*<dl[^>]*>(?:[\S\s]*?\s*<dt>\s*(?:<b>)?[^<]*(?:<\/b>)?<\/dt>)?(?<fragment>(?:\s*<dd>\s*(?:<a[^>]*>[^<]*<\/a>\s*)?<\/dd>)*)\s*<\/dl>/, /<dd>\s*(?:<a[^>]* href="(?<url>[^"]*)"[^>]*>(?<name>[^<]*)<\/a>)?\s*<\/dd>/g];
  }

  if (regex === 'div#list>dl>dd@last') {
    return [{
      pattern: /<div[^>]*(?:id|class)="list"[^>]*>\s*<dl[^>]*>(?:[\S\s]*?\s*<dt>\s*(?:<b>)?[^<]*(?:<\/b>)?<\/dt>)?(?<fragment>(?:\s*<dd>\s*<a[^>]*>[^<]*<\/a>\s*<\/dd>)*)\s*<\/dl>/g,
      index: -1
    }, /<dd>\s*(?:<a[^>]* href="(?<url>[^"]*)"[^>]*>(?<name>[^<]*)<\/a>)?\s*<\/dd>/g];
  }

  if (regex === '.section-list') {
    return [{
      pattern: /<ul [^>]*class="section-list[^"]*"[^>]*>(?<fragment>(?:\s*<li[^>]*>\s*<a[^>]*>[^<]*<\/a>\s*<\/li>\s*)*)/g,
      index: -1
    }, /<a [^>]*href="(?<url>[^"]+)"[^>]*>(?<name>[^<]+)</g];
  }

  if (regex === '下拉式阅读') {
    return [/<ul id="chapter-list-[^>]*>(?<fragment>(?:\s*<li>\s*<a[^>]*>\s*<span>[^<]*<\/span>\s*<\/a>\s*<\/li>)+)/, /href="(?<url>[^"]+\d+\.html)"[^>]*>\s*<span>(?<name>[^<]+)</g];
  }

  if (regex === 'jieqi230') {
    return [/<div class="index">\s*(?<fragment>(?:\s*<div class="volume">[^<]*<\/div>|\s*<\/?ul[^>]*>|\s*<li[^>]*>\s*<a[^>]*>[^<]*<\/a>\s*<\/li>)+)/, /volume">\s*(?:[^<\s]+\s)?(?<volume>[^<]+)|href="(?<url>[^"]+)"[^>]*>(?<name>[^<]+)/g];
  }

  throw new Error(`unknown ParseCatalog regex ${regex}`);
}

async function collect(html, regex, url, options) {
  if (options.preprocess != null) {
    html = options.preprocess(html);
  }

  if (options.parser) {
    return options.parser(html);
  }

  stat('parseRegex');
  const [_fragmentRegex, _regex, postprocess] = parseRegex(regex);
  stat('parseRegex');
  const hasVolume = _regex.source.indexOf('?<volume>') !== -1;

  const _idRegexp = options.idRegex || /(?<id>\d+)\.s?html?/;

  let skip = _regex.source.indexOf('?<skip>') !== -1;
  let since = _regex.source.indexOf('?<since>') !== -1;
  let volumeRegex;

  if (hasVolume) {
    if (options.hasOwnProperty('volumeRegex') && options.volumeRegex == null) {
      volumeRegex = null;
    } else {
      volumeRegex = options.volumeRegex || /(?:《[^》]*》)?\s*(?<volume>.+)\s*/;
    }
  }

  let fragment;
  stat('fragment');

  if (_fragmentRegex === null) {
    fragment = html;
  } else if (_fragmentRegex instanceof RegExp) {
    fragment = _fragmentRegex.exec(html).groups.fragment;
  } else {
    const _ = [...html.matchAll(_fragmentRegex.pattern)];
    fragment = _[_fragmentRegex.index < 0 ? _.length + _fragmentRegex.index : _fragmentRegex.index][1];
  }

  stat('fragment');

  if (options.transformer != null) {
    stat('transformer');

    const _ = options.transformer(fragment);

    fragment = _ instanceof Promise ? await _ : _;
    stat('transformer');
  }

  stat('matchAll');
  const matches = fragment.matchAll(_regex);
  stat('matchAll');
  let volume = null;
  const catalog = [];
  const buildUrl = options.urlBuilder != null;
  stat('collect');

  for (let match of matches) {
    if (skip) {
      if (match.groups.skip == null) {
        continue;
      }

      skip = false;
      continue;
    }

    if (since) {
      if (match.groups.since == null) {
        continue;
      }

      since = false;
    }

    if (hasVolume && match.groups.volume != null) {
      volume = match.groups.volume;

      if (volumeRegex != null) {
        volume = volumeRegex.exec(volume).groups.volume.trim();
      }

      continue;
    }

    if (match.groups.name != null) {
      const cid = _idRegexp.exec(match.groups.url).groups.id;

      const record = {
        id: cid,
        name: match.groups.name,
        url: buildUrl ? options.urlBuilder(cid) : absoluteUrl(match.groups.url, url)
      };

      if (hasVolume && volume !== undefined && volume !== null) {
        record.volume = volume;
      }

      catalog.push(record);
    }
  }

  cleanNewest(catalog);
  stat('collect');

  if (postprocess != null) {
    return postprocess(catalog);
  }

  return catalog;
}

async function parseCatalog(url, regex, options) {
  options = options || {};
  const httpOptions = {
    url,
    ...options.httpOptions
  };
  const clientOptions = {
    encoding: "utf-8",
    ...options.clientOptions
  };
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
  return await collect(html, regex, url, options);
}

async function parseCatalogPaginate(urlGenerator, regex, options) {
  const pageSize = options.pageSize || 20;
  const totalPagesOffset = options.totalPagesOffset == null ? 0 : options.totalPagesOffset;
  let fetchLast;
  let page = options.page;
  let chapterIndex = options.chapterIndex;

  if (page === -1) {
    fetchLast = true;
    page = null;
  } else {
    fetchLast = false;
  }

  if (page == null) {
    if (chapterIndex == null) {
      page = 1;
    } else {
      page = Math.floor(chapterIndex / pageSize) + 1;
    }
  }

  if (page < 1) {
    page = 1;
  }

  let url = urlGenerator(page);
  const httpOptions = {
    url,
    ...options.httpOptions
  };
  const clientOptions = {
    encoding: "utf-8",
    ...options.clientOptions
  };
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
  const totalPagesMatch = options.totalPagesRegex.exec(html);
  const totalPages = totalPagesMatch ? parseInt(totalPagesMatch.groups.totalPages) + totalPagesOffset : 1;

  if (fetchLast && totalPages > page || totalPages < page) {
    page = totalPages;
    url = urlGenerator(page);
    stat('request');
    response = await send({ ...httpOptions,
      url
    }, clientOptions);
    stat('request');

    if (response.statusCode < 200 || response.statusCode > 299) {
      throw new Error(`Request failed with statusCode ${response.statusCode}, ${response.reasonPhrase}`);
    }

    html = response.body;
  }

  const catalog = await collect(html, regex, url, options);
  return {
    paginate: {
      pageNo: page,
      pageSize,
      totalPages
    },
    catalog
  };
}

exports.cleanNewest = cleanNewest;
exports.parseCatalog = parseCatalog;
exports.parseCatalogPaginate = parseCatalogPaginate;