const {
  send
} = require("http");

const breakPunchCodes = [12290, 65281, 65311, 8221];

function isBreakPunch(charCode, charCodeLast2, charCodeLast3) {
  return charCode === 46 && charCodeLast2 === 46 && charCodeLast3 === 46 || breakPunchCodes.indexOf(charCode) !== -1;
}

function noopPageCleaner(pageContent) {
  return pageContent;
}

function repeatMerger(content, pageContent, isPunch) {
  if (pageContent.length === 0) {
    return;
  }

  if (content.length === 0) {
    pageContent.forEach(_ => content.push(_));
    return;
  }

  if (content[content.length - 1] !== pageContent[0]) {
    content.push(pageContent[0]);
  }

  for (let i = 1; i < pageContent.length; i++) {
    content.push(pageContent[i]);
  }
}

function cleanContent(content) {
  return content.map(_ => _.replace(/[\u200B-\u200F\uFEFF\u0300-\u036f]/g, "")).filter(_ => _.length > 0);
}

const paragraphContentRegexFragment = '(?<fragment>(?:[^<]+|<br\\s*\\/?>|<p[^>]*>|<\\/p>|<[^\\/a-zA-Z])*)';
const brContentRegexFragment = '(?<fragment>(?:[^<]+|<br\\s*\\/?>|<[^\\/a-zA-Z])*)';

function parseWrapperRegex(wrapperRegex) {
  if (wrapperRegex == null) {
    return null;
  }

  if (wrapperRegex instanceof RegExp) {
    return wrapperRegex;
  }

  if (wrapperRegex === 'div#content') {
    return /id="content"[^>]*>(?:\s*(?:<!--[\S\s]*?-->|<script>[\S\s]*?<\/script>|<div[^>]*>[\S\s]*?<\/div>|<a[^>]*>[\S\s]*?<\/a>)\s*(?:<br\s*\/?>)*)*(?<fragment>(?:[^<]+|<br\s*\/?>|<p[^>]*>|<\/p>|<[^\/a-zA-Z])*)</;
  }

  if (wrapperRegex === 'div.content') {
    return /class="content"[^>]*>(?:\s*(?:<!--[\S\s]*?-->|<script>[\S\s]*?<\/script>|<div[^>]*>[\S\s]*?<\/div>|<a[^>]*>[\S\s]*?<\/a>)\s*(?:<br\s*\/?>)*)*(?<fragment>(?:<br\s*\/?>|<p[^>]*>|<\/p>|<[^\/a-zA-Z]|[^<]+)*)</;
  }

  if (wrapperRegex === 'div#BookText') {
    return /<div id="BookText">(?:<!--.*?-->)*(?<fragment>(?:[^<]|<br\s*\/?>|<p>|<\/p>|<[^\/a-zA-Z])*)<\/div>/;
  }

  if (wrapperRegex === 'div.article-body>p') {
    return /<div class="article-body" role="article-body">(?:(?:<div class="k"><\/div>)?(?:<div class="kk">(?:<script>.*?<\/script>)?<\/div>)?)?(?<fragment>(?:\s*<p>(?:[^<]|<[^\/a-zA-Z])*<\/p>\s*)+)/;
  }

  if (wrapperRegex === 'div#chapter_content>p') {
    return /<div id="chapter_content">(?:<!--[^>]*-->)*(?<fragment>(?:\s*<p>(?:[^<]|<[^\/a-zA-Z])*<\/p>\s*)+)/;
  }

  if (wrapperRegex === 'div#txt>p') {
    return /<div [^>]*id="txt"[^>]*>(?:<!--[^>]*-->)*(?<fragment>(?:\s*<p>(?:[^<]|<[^\/a-zA-Z])*<\/p>\s*)+)/;
  }

  throw new Error(`unknown ParseContent wrapperRegex ${wrapperRegex}`);
}

function collectLines(html, content) {
  html.split(/<[^<>]+>|\n/).forEach(_ => {
    _ = _.trim();

    if (_.length > 0) {
      content.push(_);
    }
  });
}

function simpleMerger(content, pageContent, isBreakPunch) {
  for (let c of pageContent) {
    content.push(c);
  }
}

async function parseContent(url, wrapperRegex, options) {
  const content = [];
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

  let html = response.body;

  if (options.preprocess != null) {
    html = options.preprocess(html);
  }

  if (options.parser != null) {
    return options.parser(html);
  }

  html = html.replace(/<a [^>]*>[^<]*<\/a>/g, '');
  let wpRegex = parseWrapperRegex(wrapperRegex);
  stat('fragment');
  let fragment = wpRegex == null ? html : wpRegex.exec(html).groups.fragment;
  stat('fragment');

  if (options.transformer != null) {
    stat('transformer');

    const _ = options.transformer(fragment);

    fragment = _ instanceof Promise ? await _ : _;
    stat('transformer');
  }

  stat('collect');
  collectLines(fragment, content);
  stat('collect');
  return cleanContent(content);
}

async function parseContentPaginate(urlGenerator, wrapperRegex, options) {
  let page = 1;
  const content = [];
  let hasNext = true;
  const clientOptions = {
    encoding: "utf-8",
    ...options.clientOptions
  };
  let wpRegex = parseWrapperRegex(wrapperRegex);
  let pageCleaner = options.pageCleaner || noopPageCleaner;

  do {
    if (page > 10) {
      break;
    }

    const _url = urlGenerator(page);

    const httpOptions = {
      url: _url,
      ...options.httpOptions
    };
    let response = await send(httpOptions, clientOptions);

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

    hasNext = options.hasNextFn(html);
    html = html.replace(/<a [^>]*>[^<]*<\/a>/g, '');
    let merger;

    if (options.merger === undefined) {
      merger = (content, pageContent, isBreakPunch) => {
        if (pageContent.length === 0) {
          return;
        }

        if (content.length === 0) {
          pageContent.forEach(_ => content.push(_));
          return;
        }

        const prevLast = content[content.length - 1].trim();
        const nextFirst = pageContent[0].trim();
        const prevLastLength = prevLast.length;
        const lastChar = prevLast.charCodeAt(prevLastLength - 1);

        if (isBreakPunch(lastChar, prevLastLength > 1 ? prevLast.charCodeAt(prevLastLength - 2) : null, prevLastLength > 2 ? prevLast.charCodeAt(prevLastLength - 3) : null)) {
          content[content.length - 1] = prevLast;
          content.push(nextFirst);
        } else {
          content[content.length - 1] = prevLast + nextFirst;
        }

        for (let i = 1; i < pageContent.length; i++) {
          content.push(pageContent[i]);
        }
      };
    } else if (options.merger) {
      merger = options.merger;
    }

    if (options.parser != null) {
      const _ = options.parser(html);

      if (merger != null) {
        merger(content, pageCleaner(_ instanceof Array ? _ : _.content), isBreakPunch);
      } else {
        pageCleaner(_ instanceof Array ? _ : _.content).forEach(__ => content.push(__));
      }
    } else {
      let fragment = wpRegex == null ? html : wpRegex.exec(html).groups.fragment;

      if (options.transformer != null) {
        const _ = options.transformer(fragment);

        fragment = _ instanceof Promise ? await _ : _;
      }

      if (merger) {
        const pageContent = [];
        collectLines(fragment, pageContent);
        merger(content, pageCleaner(pageContent), isBreakPunch);
      } else {
        collectLines(fragment, content);
      }

      if (options.delay !== 0) {
        await delay(options.delay || 200);
      }
    }

    page++;
  } while (hasNext);

  return cleanContent(content);
}

exports.parseContent = parseContent;
exports.parseContentPaginate = parseContentPaginate;
exports.simpleMerger = simpleMerger;
exports.repeatMerger = repeatMerger;
exports.cleanContent = cleanContent;
exports.paragraphContentRegexFragment = paragraphContentRegexFragment;
exports.brContentRegexFragment = brContentRegexFragment;