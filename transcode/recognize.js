function wrap(type, origin, _) {
  if (!_) {
    return null;
  }

  let originId;
  let cid;

  if (typeof _ === 'string') {
    originId = _;
  } else {
    if (!_.bid) {
      return null;
    }

    originId = _.bid;
    cid = _.cid;
  }

  const result = {
    '#type': 'subject',
    type,
    origin,
    originId
  };

  if (cid != null) {
    result['cid'] = cid;
  }

  return result;
}

async function getHtml(url) {
  const {
    send
  } = require('http');

  const response = await send(url);
  assertOK(response);
  return response.body;
}

exports = async function (url) {
  if (!url) {
    return null;
  }

  let host;

  if (url.startsWith('http://')) {
    host = url.substring(7);
  } else if (url.startsWith('https://')) {
    host = url.substring(8);
  }

  if (!host) {
    return null;
  }

  let path = '/';
  let pos = host.indexOf('/');

  if (pos !== -1) {
    path = host.substring(pos);
    host = host.substring(0, pos);
  }

  pos = host.indexOf('#');

  if (pos !== -1) {
    host = host.substring(0, pos);
  }

  if (!host) {
    return null;
  }

  const hostTokens = host.split('.');
  let mainHost;

  if (hostTokens[hostTokens.length - 1] === 'cn' && hostTokens[hostTokens.length - 2] === 'com') {
    mainHost = hostTokens.slice(hostTokens.length - 3).join('.');
  } else {
    mainHost = hostTokens.slice(hostTokens.length - 2).join('.');
  }

  switch (mainHost) {
    case '101du.net':
      return wrap('book', '101du.net', path.subRegexMap(/\/(?:book|html)\/(?<bid>\d+)(?:\/(?<cid>\d+)(?:_\d+)?\.html)?/));

    case '123wx.com':
    case '123wxwx.com':
      return wrap('book', '123wx.com', path.subRegexMap(/\/html\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '1718k.com':
      return wrap('book', '1718k.com', path.subRegexMap(/\/files\/article\/html\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '17zw.com':
      return wrap('book', '17zw.com', path.subRegexMap(/\/(?:book|chapters)[_\/](?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '188xiaoshuo.com':
      return wrap('book', 'yousheng8.com', path.subRegexMap(/\/files\/article\/html\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '22ff.org':
    case '22ff.vip':
      return wrap('book', '22ff.org', path.subRegexMap(/\/xs\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '2100book.com':
      return wrap('book', '2100book.com', path.subRegexMap(/\/ebook\/(?<bid>[a-zA-Z\d]+)(?:\/(?<cid>[a-zA-Z\d]+)\.html)?/));

    case '22pq.com':
    case 'umiwx.com':
      return wrap('book', '22pq.com', path.subRegexMap(/\/(?:read|book\/\d+)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '22zw.com':
    case '999xs.net':
      return wrap('book', '22zw.com', path.subRegexMap(/\/files?\/article\/html\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '23hh.com':
      return wrap('book', '23hh.com', path.subRegexMap(/\/(?:book\/\d+|booklist)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '23txt.com':
    case '23sk.com':
      return wrap('book', '23txt.com', path.subRegexMap(/\/article\/html\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '266ks.com':
      return wrap('book', '266ks.com', path.subRegexMap(/^\/(?:txt\/|\d+_)(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '2uxs.com':
      return wrap('audio', '2uxs.com', path.subRegexMap(/^\/(?:youshengxiaoshuo|play)\/(?<bid>\d+)(?:_\d+_(?<cid>\d+))?/));

    case '2wxs.com':
    case '2wxs.net':
      return wrap('book', '2wxs.com', path.subRegexMap(/\/(?:xstxt|book)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '2xiaoshuo.com':
      return wrap('book', '2xiaoshuo.com', path.subRegexMap(/\/(?:books|read)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '360xs.com':
      {
        const data = path.subRegexMap(/^\/(?:book|mulu\/\d+)\/(?<bid>\d+)(?:[\/\-](?<cid>[a-zA-Z0-9]+\/[a-zA-Z0-9]+|\d+)(?:-\d+)?\.html)?/);

        if (data['cid'] && data['cid'].startsWith('0')) {
          delete data['cid'];
        }

        return wrap('book', '360xs.com', data);
      }

    case '3ixs.net':
      return wrap('book', '3ixs.net', path.subRegexMap(/\/(?:book|html\/\d+)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '3qbook.com':
      return wrap('book', '3qbook.com', path.subRegexMap(/\/book\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '56tingshu.com':
      return wrap('audio', '56tingshu.com', path.subRegexMap(/^\/(?:show|play)\/(?<bid>\d+)(?:-\d+-(?<cid>\d+))?/));

    case '56wen.com':
      {
        const type = 'book';
        const origin = '56wen.com';
        let originId;

        if (/\/(chapter|book)\/\d+\/\d+\.html/.test(url)) {
          const html = await getHtml(url);
          originId = html.subRegex(url.indexOf('/chapter/') === -1 ? /<span>小说：<a href="\/txt\/(\d+)\.html"/ : /<a href="\/txt\/(\d+)\.html" class="cur"/);

          if (path.startsWith('/book/')) {
            return wrap(type, origin, {
              bid: originId,
              cid: path.subRegex(/(\d+)\.html/)
            });
          }
        } else {
          originId = url.subRegex(/\/txt\/(\d+)/);
        }

        return wrap('book', '56wen.com', originId);
      }

    case '5du5.org':
      return wrap('book', '5du5.org', path.subRegexMap(/^\/(?:book|chapters|\d+)_(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '67book.net':
    case '67shu.net':
      {
        const data = path.subRegexMap(/\/(?:book[\/_]|article\/|chapters_(?:rev_)?)(?<bid>\d+)(?:\/(?<cid>\d+))?/);

        if (path.indexOf('/chapters') !== -1) {
          delete data['cid'];
        }

        return wrap('book', '67shu.net', data);
      }

    case '69shu.com':
      return wrap('book', '69shu.com', path.subRegexMap(/^(?:\/txt)?\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '70zw.com':
      return wrap('book', '70zw.com', path.subRegexMap(/^\/(?:book_|chapters_|chapters_rev_)(?<bid>\d+)(?:\/(?<cid>\d+)\.html)?/));

    case '71wxc.com':
      return wrap('book', '71wxc.com', path.subRegexMap(/^\/(?:book\/|\d+_)(?<bid>\d+)(?:\/(?<cid>\d+)(?:_\d+)?\.html)?/));

    case '75txt.com':
      return wrap('book', '75txt.com', path.subRegexMap(/^\/(?:xs_|txt_)?(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '75zhongwen.com':
    case '75zw.vip':
    case '75zw.info':
    case '75zworg.com':
      return wrap('book', '75zw.com', path.subRegexMap(/^\/(?:xiaoshuo|xiazai)?(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '7edm.com':
      return wrap('comic', '7edm.com', path.subRegexMap(/^\/(?<bid>[a-z]+\/[a-z\d]+)\/(?:(?<cid>\d+)\.html)?(?:\?.+)?$/));

    case '88danmei.net':
    case '88danmei.com':
    case 'danmei.org':
    case 'danmei.la':
      return wrap('book', 'danmei.org', path.subRegexMap(host.startsWith('m.') || host.startsWith('wap.') ? /^\/(?:info|mulu|book|wapbook)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/ : /^\/book\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '81book.com':
    case 'zwdu.com':
      return wrap('book', 'zwdu.com', path.subRegexMap(/^\/(?:book|txt)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '88txs.com':
      return wrap('book', '88txs.com', path.subRegexMap(/^\/88txs\/book\/(?<bid>\d+)(?:\/(?<cid>\d+)(?:_\d+)?\.html)?/));

    case 'aabook.cc':
    case 'aabook.xyz':
    case 'czbook.xyz':
      {
        if (path.startsWith('/read-') || path.startsWith('/m/read-')) {
          const html = await getHtml(url);
          const bid = html.subRegex(/<a href="book-(\d+)\.html"/);
          const cid = path.subRegex(/read-(\d+)/);
          return wrap('book', 'aabook.cc', {
            bid,
            cid
          });
        }

        return wrap('book', 'aabook.cc', path.subRegexMap(/^\/(?:m\/)?(?:book|chapterList)-(?<bid>\d+)\.html/));
      }

    case 'abcxs.org':
      return wrap('book', 'abcxs.org', path.subRegexMap(/^\/(?:book|\d+)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'aidusk.com':
      return wrap('book', 'aidusk.com', path.subRegexMap(/^\/(?:t\/|txt)?(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'aixswx.com':
      return wrap('book', 'aixswx.com', path.subRegexMap(/^\/(?:book|xs\/\d+)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'awedding.net':
    case 'awe-xs.com':
      {
        if (path.startsWith('/chapter.html')) {
          return wrap('book', 'awedding.net', path.subRegexMap(/\?(?<bid>\d+)(?:#.*chapterid=(?<cid>\d+))?/));
        }

        return wrap('book', 'awedding.net', path.subRegexMap(/^\/xs\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));
      }

    case 'acgzone.net':
    case 'lianaimh.com':
      return wrap('comic', 'acgzone.net', path.subRegexMap(/^\/manhua\/(?<bid>[A-Za-z0-9_]+)(?:\/(?<cid>\d+))?/));

    case 'biqugetv.com':
      return wrap('book', 'biqugetv.com', path.subRegexMap(/^\/\d+_(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'biqugewu.net':
      return wrap('book', 'biqugewu.net', path.subRegexMap(/^\/(?:\d+_|\d+\/|book\/)(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'biquwx.la':
    case 'xbiquwx.la':
      return wrap('book', 'biquge.info', path.subRegexMap(/^\/\d+_(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'bjcan8.com':
      {
        let originId;
        let cid;

        if (path.startsWith('/chapter/')) {
          const html = await getHtml(url);
          originId = html.subRegex(host.startsWith('m.') ? /rel="canonical" href="[^"]*\/book\/(\d+)\.html">/ : /<div class="info fl">\s*<a href="\/book\/(\d+)\.html"/);
          cid = path.subRegex(/\/chapter\/(\d+\/[a-z0-9]+)\.html/);
        } else {
          originId = path.subRegex(/^\/(?:book|home\/chapter\/lists\/id)\/(\d+)/);
        }

        return wrap('book', 'bjcan.com', cid ? {
          bid: originId,
          cid
        } : originId);
      }

    case 'blxsw.net':
      return wrap('book', 'blxsw.net', path.subRegexMap(/^\/(?:info-|wapbook-|\d+_)(?<bid>\d+)(?:[\/\-](?<cid>\d+))?/));

    case 'bookzx.cc':
      return wrap('book', 'bookzx.cc', path.subRegexMap(/^\/htm\/(?<bid>\d+)(?:\/(?<cid>\d+)(?:_\d+)?\.html)?/));

    case 'bqg.org':
      {
        const data = path.subRegexMap(/^\/(?:book_|chapters_|chapters_rev_)(?<bid>\d+)(?:\/(?<cid>\d+))?/);

        if (path.startsWith('/chapters')) {
          delete data['cid'];
        }

        return wrap('book', 'bqg.org', data);
      }

    case 'bshuku.com':
      return wrap('book', 'bshuku.com', path.subRegexMap(/^\/(?:book\/(?:info\/)?\d+|html)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'bwsk.com':
      {
        const m = path.subRegexMap(/^\/(?<bid>[a-z]+\/[a-z]\/[a-z]+(?:\/[a-z]+)?)(?:\/(?<cid>\d+)\.htm)?/);

        if (m.bid && m.bid.endsWith('index')) {
          m.bid = m.bid.replace(/\/index$/, '');
        }

        return wrap('book', 'bwsk.com', m);
      }

    case 'bxuu.net':
      return wrap('book', 'bxuu.net', path.subRegexMap(host.startsWith('m.') ? /^\/(?<bid>\d+)(?:\/(?<cid>\d+))?/ : /^\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'cjdushu.com':
      return wrap('book', 'cjdushu.com', path.subRegexMap(/^\/(?:new|txtdown|read)_(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'cn3k5.com':
      return wrap('book', 'cn3k5.com', path.subRegexMap(/^\/(?:info-|wapbook-|book\/|\d+\/)(?<bid>\d+)(?:[\/\-](?<cid>\d+))?/));

    case 'cnd1wx.com':
      return wrap('book', 'cnd1wx.com', path.subRegexMap(/^\/(?:xs\/|txt\/)?(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'cyewx.com':
    case 'biquxs.la':
      return wrap('book', 'cyewx.com', path.subRegexMap(/^\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'daxiabook.com':
      return wrap('book', 'daxiabook.com', path.subRegexMap(/^\/(?:shu\/|du\/|xz_)(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'ddtxt.cc':
      return wrap('book', 'ddtxt.cc', path.subRegexMap(/^\/book\/(?<bid>\d+)(?:_(?<cid>\d+))?/));

    case 'ddtxt.net':
      return wrap('book', 'ddtxt.cc', path.subRegexMap(/^\/[a-z]+\/\d+_\d+(_\d+)?\.html/.test(path) ? /^\/[a-z]+\/(?<bid>\d+)_(?<cid>\d+)(?:_\d+)?\.html/ : /^\/(?:book|chapters)\/(?<bid>\d+)(?:\/(?<cid>\d+)(?:_\d+)?\.html)?/));

    case 'ddxstxt8.com':
    case 'ddyueshu.com':
      return wrap('book', 'ddxstxt8.com', path.subRegexMap(host.startsWith('m.') ? /^\/wapbook\/(?<bid>\d+)(?:_(?<cid>\d+))?/ : /^\/\d+_(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'dingdian6.com':
      return wrap('book', 'dingdian6.com', path.subRegexMap(/^\/book(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'dizishu.com':
      return wrap('book', 'dizishu.com', path.subRegexMap(/^\/b\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'duqu.net':
      return wrap('book', 'duqu.net', path.subRegexMap(host.startsWith('www.') && url.indexOf('/html/') !== -1 ? /^\/html\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/ : /^\/(?:html|book)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'dushuzhe.com':
    case 'dushuzhe.cc':
      return wrap('book', 'dushuzhe.com', path.subRegexMap(/^\/book\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'dmzj.com':
      let data;

      if (host.startsWith('m.') && /^\/view\/\d+\/\d+\.html/.test(path)) {
        const html = await getHtml(url);
        data = html.subRegexMap(/<link rel="canonical" href="[^"]+\/view\/(?<bid>[a-z\d]+)\/(?<cid>\d+)\.html"/);
      } else {
        data = path.subRegexMap(/^\/(?:info|view)\/(?<bid>[a-z\d]+)(?:\/(?<cid>\d+))?/);
      }

      return wrap('comic', 'dmzj.com', data);

    case 'ebookchina.com':
      return wrap('book', 'ebookchina.com', path.subRegexMap(/^\/book\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'epzw.com':
      return wrap('book', 'epzw.com', path.subRegexMap(/^\/html\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'etingshu.com':
      return wrap('audio', 'etingshu.com', path.subRegexMap(/^\/(?:show|play)\/(?<bid>\d+)(?:-\d+-(?<cid>\d+))?/));

    case 'etongxs.com':
      return wrap('book', 'etongxs.com', path.subRegexMap(/^\/xs\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'feiwenwang.org':
      return wrap('book', 'shupu.org', path.subRegexMap(/^\/(?:intro|yuedu\/\d+)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'hjwxs.com':
      return wrap('book', 'hjwxs.com', path.subRegexMap(/^\/(?:book|index)\/(?<bid>\d+)(?:\/(?<cid>\d+)(?:_\d+)?\.html)?/));

    case 'ibotaodz.com':
      return wrap('book', 'botaodz.com', path.subRegexMap(/^\/(?:novel\/)?(?<bid>\d+)(?:\/read_(?<cid>\d+))?/));

    case 'ishuyin.com':
      {
        const type = 'audio';
        const origin = 'ishuyin.com';

        if (path.startsWith('/show')) {
          const id = path.subRegex(/(?:\/show-|show\.php\?id=)(\d+)/);
          const html = await getHtml(`https://m.ishuyin.com/show-${id}.html`);
          let bid = html.subRegex(/<a href="\/(\d+\/\d+)\/0\.html"[^>]* id="nowRead"/);

          if (bid) {
            bid = bid.replace('/', '-');
          }

          return wrap(type, origin, bid);
        }

        if (path.startsWith('/album')) {
          return wrap(type, origin, path.subRegex(/\/album-(\d+-\d+)/));
        }

        const _ = path.subRegexMap(/^\/(?<bid>\d+\/\d+)\/(?<cid>\d+)\.html/);

        if (_.bid) {
          _.bid = _.bid.replace('/', '-');
        }

        return wrap(type, origin, _);
      }

    case 'jieyues.com':
      {
        let originId;
        let match = url.subRegexMap(/\/(?<bid>look\/\d+\/[a-z0-9]+)(?:\/(?<cid>\d+)|\/list(?:_\d+)?)?\.html/);
        let id = match.bid;
        let cid = match.cid;

        if (id) {
          originId = `jieyues.com|${id}|/list`;
        }

        if (!originId) {
          match = url.subRegexMap(/\/shu\/(?<bid>[a-z0-9]+)(?:\/(?<cid>\d+))?\.html/);
          id = match.bid;
          cid = match.cid;

          if (id) {
            originId = `jieyues.com|shu/${id}|`;
          }
        }

        if (!originId) {
          id = url.subRegex(/\/topics\/\d+_([a-z0-9]+)\.html/);

          if (id) {
            originId = `jieyues.com|look/0/${id}|/list`;
          }
        }

        if (!originId) {
          return null;
        }

        return wrap('book', 'jieyues.com', cid ? {
          bid: originId,
          cid
        } : originId);
      }

    case 'jikage.com':
    case 'biquna.com':
      return wrap('book', 'biquna.com', path.subRegexMap(/^\/(?:book\/)?\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'jingwuhotel.com':
    case 'jingwubook.com':
      {
        return wrap('book', 'jingwuhotel.com', path.subRegexMap(/^\/(?:book|xiaoshuo)\/(?<bid>\d+)(?:\/(?<cid>\d+)(?:_\d+)?\.html)?/));
      }

    case 'jx.la':
      return wrap('book', 'jx.la', path.subRegexMap(/^\/book\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'kandashuw.com':
      return wrap('book', 'kandashuw.com', path.subRegexMap(/^\/book\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'kanshuge.org':
      {
        const data = path.subRegexMap(/^\/(?:\d+|chapterlist)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/);

        if (path.startsWith('/chapterlist/')) {
          delete data['cid'];
        }

        return wrap('book', 'kanshuge.org', data);
      }

    case 'kayege.net':
      return wrap('book', 'kayege.net', path.subRegexMap(/^\/(?:\d+_|\d+\/|book\/)(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'kenshuzw.com':
      {
        const data = path.subRegexMap(/^\/(?:xiaoshuo|down)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/);

        if (data['cid'] === '0') {
          delete data['cid'];
        }

        return wrap('book', 'kenshuzw.com', data);
      }

    case 'kenwen.com':
      return wrap('book', 'kenwen.com', path.subRegexMap(/^\/cview\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'klsxs.com':
      return wrap('book', 'klsxs.com', path.subRegexMap(/^\/(?:info|html)\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'kxs7.net':
      return wrap('book', 'kxs7.net', path.subRegexMap(/^\/(?:shu|du)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'laidudu.com':
      return wrap('book', 'laidudu.com', path.subRegexMap(/^\/book\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'leting8.com':
      return wrap('audio', 'leting8.com', path.subRegexMap(/^\/(?:so|play)\/(?<bid>\d+)(?:-\d+-(?<cid>\d+))?/));

    case 'lnwow.net':
      return wrap('book', 'lnwow.net', path.subRegexMap(/^\/(?:info-|wapbook-|html\/book\/\d+\/)(?<bid>\d+)(?:[\/-](?<cid>\d+))?/));

    case 'luoqiuzw.com':
      return wrap('book', 'luoqiuzw.com', path.subRegexMap(/^\/book\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'lolxsw.com':
      {
        const data = path.subRegexMap(/^\/(?<bid>\d+)(?:\/(?<cid>\d+))?/);

        if (!path.endsWith('.html')) {
          delete data['cid'];
        }

        return wrap('book', 'lolxsw.com', data);
      }

    case 'mgting.com':
      return wrap('audio', 'mgting.com', path.subRegexMap(/^\/(?:mp3|play)\/(?<bid>\d+)(?:-\d+-(?<cid>\d+))?/));

    case 'mianhuatangtxt.com':
      return wrap('book', 'mianhuatangtxt.com', path.subRegexMap(/^\/(?:book|xiazai)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'miaoshuzhai.net':
    case 'doucehua.com':
      return wrap('book', 'miaoshuzhai.net', path.subRegexMap(/^\/xs\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'mingrenteahouse.com':
      return wrap('book', 'mingrenteahouse.com', path.subRegexMap(/^\/shu\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'moyankanshu.com':
    case 'moyandushu.com':
      return wrap('book', 'moyankanshu.com', path.subRegexMap(/^\/(?:info|\d+\/\d+)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'my1587.com':
    case 'nbaxiaoshuo.com':
      return wrap('book', 'my1587.com', path.subRegexMap(/^\/(?:info|html)\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'myitit.com':
      return wrap('book', 'myitit.com', path.subRegexMap(/^\/xs\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'manhuapi.com':
    case 'manhuapi.net':
      {
        let originId;
        let cid;

        if (path.startsWith('/chapter/')) {
          const html = await getHtml(url);
          originId = html.subRegex(/<body[^>]* article-id="(\d+)"/);
          cid = path.subRegex(/\/chapter\/(\d+)/);
        } else {
          originId = path.subRegex(/^\/(?:manhua|menu)\/(\d+)/);
        }

        return wrap('comic', 'manhuapi.com', cid ? {
          bid: originId,
          cid
        } : originId);
      }

    case 'manmankan.cc':
      {
        let originId;
        let cid;

        if (path.startsWith('/chapter/')) {
          const html = await getHtml(url);
          originId = html.subRegex(host.startsWith('m.') ? /<link rel="canonical" href="[^"]+\/manhua\/(\d+)\/\d+\.html">/ : /head_title"><h1><a href="\/manhua\/(\d+)\/"/);
          cid = path.subRegex(/\/chapter\/(\d+)/);
        } else {
          originId = path.subRegex(/^\/manhua\/(\d+)/);
        }

        return wrap('comic', 'manmankan.cc', cid ? {
          bid: originId,
          cid
        } : originId);
      }

    case 'mh1234.com':
    case 'zxkai.com':
      return wrap('comic', 'mh1234.com', path.subRegexMap(/^\/comic\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'manhua39.com':
      return wrap('comic', 'manhua39.com', path.subRegexMap(/^\/manhua\/(?<bid>[a-zA-Z\d]+)(?:\/(?<cid>\d+))?/));

    case 'manhuacat.com':
    case 'maofly.com':
      return wrap('comic', 'manhuacat.com', path.subRegexMap(/^\/manga\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'mailtxt.org':
    case 'lwcr.net':
      {
        let data;

        if (host.startsWith('m.') && /^\/[a-z]+\/\d+\/\d+\.html/.test(path)) {
          data = path.subRegexMap(/^\/[a-z]+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/);
        } else {
          data = path.subRegexMap(/^\/(?:book|\d+)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/);
        }

        return wrap('book', 'mailtxt.org', data);
      }

    case 'ncjy.net':
      return wrap('book', 'ncjy.net', path.subRegexMap(/^\/(?:txt|bxwx)\/(?<bid>\d+)(?:\/(?<cid>\d+)(?:_\d+)?\.html)?/));

    case 'nfxs.com':
      return wrap('book', 'nfxs.com', path.subRegexMap(/^\/book\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'paoshu8.com':
      return wrap('book', 'paoshu8.com', path.subRegexMap(/^\/(?:info-|wapbook-|\d+_)(?<bid>\d+)(?:[\/\-](?<cid>\d+))?/));

    case 'pingshu365.com':
      {
        let intermediate;
        let cid;

        if (path.startsWith('/play/')) {
          cid = path.subRegex(/\/play\/(\d+)/);
          intermediate = `https://m.pingshu365.com/pm/${cid}.html`;
        } else if (path.contains('/pm/')) {
          cid = path.subRegex(/\/pm\/(\d+)/);
          intermediate = url;
        }

        let m;

        if (intermediate) {
          const html = await getHtml(intermediate);
          m = {
            bid: html.subRegex(/<a href=['"]\/lm\/(\d+)\.html['"]>返回目录</),
            cid
          };
        } else {
          m = path.subRegex(/^\/(?:ps|lm)\/(?<bid>\d+)\.html/);
        }

        return wrap('audio', 'pingshu365.com', m);
      }

    case 'pinshu5.com':
      return wrap('book', 'pinshu5.com', path.subRegexMap(/^\/(?:txt\/)?(?<bid>\d+)(?:\/(?<cid>\d+)(?:_\d+)?\.html)?/));

    case 'qbxs.com':
      return wrap('book', 'qbxs.com', path.subRegexMap(/^\/book\/(?<bid>\d+)(?:\/(?<cid>\d+)(?:_\d+)?\.html)?/));

    case 'qiushubang.me':
    case 'qiushubang.com':
      return wrap('book', 'qiushubang.com', path.subRegexMap(/^\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'qkshuba.com':
    case 'qkshuw.com':
    case '70dushu.com':
      return wrap('book', 'qkshuba.com', path.subRegexMap(/^\/book\/(?<bid>[a-z\d]+)(?:\/(?<cid>\d+))?/));

    case 'quanben.me':
      return wrap('book', 'quanben.me', path.subRegexMap(/^\/ls-(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'quwenyi.com':
      {
        let data;

        if (hostTokens.length === 3 && hostTokens[0] !== 'www' && hostTokens[0] !== 'm') {
          data = hostTokens[0];
        } else if (hostTokens.length === 4 && hostTokens[1] === 'm') {
          data = hostTokens[0];
        } else {
          data = path.subRegexMap(/^\/shu\/(?<bid>[a-z\d]+)(?:\/(?<cid>\d+))?/);
        }

        return wrap('book', 'quwenyi.com', data);
      }

    case 'ranwen.la':
      return wrap('book', 'ranwen.la', path.subRegexMap(/^\/files\/article\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'remenxs.org':
      return wrap('book', 'remenxs.org', path.subRegexMap(/^\/book\/(?<bid>\d+)(?:\/(?<cid>\d+)(?:_\d+)?\.html)?/));

    case 'rizhaoxs.com':
      return wrap('book', 'rizhaoxs.com', path.subRegexMap(/^\/b\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'rmxsba.com':
      return wrap('book', 'rmxsba.com', path.subRegexMap(/^\/(?:shu\/|txtxz\/)?(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'rexuemh.com':
      return wrap('comic', 'rexuemh.com', path.subRegexMap(/^\/manhua\/(?<bid>[a-z\d]+)(?:\/(?<cid>\d+))?/));

    case 'shouda88.net':
    case 'shouda88.com':
    case 'shouda8.com':
      return wrap('book', 'shouda8.com', path.subRegexMap(/^\/(?:txt_|shu_)?(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'silukew.com':
      return wrap('book', 'siluke.tv', path.subRegexMap(/^\/ny(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'soxscc.org':
    case 'soxscc.com':
    case 'soxscc.info':
    case 'soxscc.net':
    case 'soxscc.cc':
    case 'soxs.cc':
      return wrap('book', 'soxscc.com', path.subRegexMap(/^\/(?:txt\/|book\/)?(?<bid>[a-zA-Z\d]+)(?:\/(?<cid>\d+))?/));

    case 'szyangxiao.com':
      return wrap('book', 'szyangxiao.com', path.subRegexMap(/^\/(?:xs|txt)?(?<bid>\d+)(?:\/zhangjie(?<cid>\d+))?/));

    case 'tiantingfm.com':
      {
        let intermediate;

        if (path.contains('vod-down-id-')) {
          intermediate = `https://m.tiantingfm.com/down/${path.subRegex(/down-id-(\d+)/)}.html`;
        } else if (path.contains('/down/')) {
          intermediate = url;
        }

        let m;

        if (intermediate) {
          const html = await getHtml(intermediate);
          m = html.subRegex(/<a href="[^"]*m\.tiantingfm\.com\/?\/([^\/][^"]+)\/" class="btn-book-download"/);
        } else {
          const {
            bid,
            cid
          } = path.subRegexMap(/^\/(?<bid>[^\/]+\/[^\/]+)(?:\/\d+-(?<cid>\d+)\.html)?/);
          m = {
            bid,
            cid
          };
        }

        return wrap('audio', 'tiantingfm.com', m);
      }

    case 'tianyabook.com':
      return wrap('book', 'tianyabook.com', path.subRegexMap(/^\/shu\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'ttkxs.com':
      return wrap('book', 'ttkxs.com', path.subRegexMap(/^\/(?:xs_|txt_)?(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'ting456.com':
      return wrap('audio', 'ting456.com', path.subRegexMap(/^\/(?:book\/d|play\/)(?<bid>\d+)(?:-\d+-(?<cid>\d+))?/));

    case 'ting55.com':
      return wrap('audio', 'ting55.com', path.subRegexMap(/^\/book\/(?<bid>\d+)(?:-(?<cid>\d+))?/));

    case 'ting56.com':
      return wrap('audio', 'ting56.com', path.subRegexMap(/^\/(?:mp3|video)\/(?<bid>\d+)(?:-\d+-(?<cid>\d+))?/));

    case 'ting56.cc':
      return wrap('audio', 'ting56.cc', path.subRegexMap(/^\/(?:mp3|play)\/(?<bid>\d+)(?:-\d+-(?<cid>\d+))?/));

    case 'ting74.com':
      return wrap('audio', 'ting74.com', path.subRegexMap(/^\/tingshu\/(?<bid>\d+)(?:\/paly_(?<cid>\d+))?/));

    case 'tingchina.com':
      return wrap('audio', 'tingchina.com', path.subRegexMap(/^\/yousheng\/(?:disp_)?(?<bid>\d+)(?:\/play_\d+_(?<cid>\d+))?/));

    case 'tingshucn.com':
      return wrap('audio', 'tingshucn.com', path.subRegexMap(/^\/(?:book|play)\/(?<bid>\d+)(?:-\d+-(?<cid>\d+))?/));

    case 'tingzh.com':
      return wrap('audio', 'tingzh.com', path.subRegexMap(/^\/(?:book|play)\/(?<bid>\d+)(?:-\d+-(?<cid>\d+))?/));

    case 'trxs.me':
      return wrap('book', 'trxs.me', path.subRegexMap(/^\/(?:tongren\/|txt\/\d+-)(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'ttlyl.com':
    case 'ttlyl.net':
    case 'ttlyl.cc':
      return wrap('comic', 'ttlyl.com', path.subRegexMap(/^\/(?:mh|lu|play)\/(?<bid>\d+)(?:-\d+-(?<cid>\d+))?/));

    case 'tuhao456.com':
    case 'kawazhuyy.com':
      {
        let originId;
        let cid;

        if (path.startsWith('/chapter/')) {
          const html = await getHtml(url);
          originId = html.subRegex(host.startsWith('m.') ? /<link rel="canonical" href="[^"]+\/manhua\/(\d+)\/\d+\.html">/ : /<div class="head_title"><h1><a href="\/manhua\/(\d+)\/"/);
          cid = path.subRegex(/\/chapter\/(\d+)/);
        } else {
          originId = path.subRegex(/^\/manhua\/(\d+)/);
        }

        return wrap('comic', 'tuhao456.com', cid ? {
          bid: originId,
          cid
        } : originId);
      }

    case 'uutxt.com':
      return wrap('book', 'uutxt.com', path.subRegexMap(/^\/(?:book\/\d+|booklist)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'vipkanshu.com':
    case 'vipkanshu.vip':
      return wrap('book', 'vipkanshu.com', path.subRegexMap(/^\/shu\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'vipzw.com':
    case 'vipxs.la':
    case 'vipsk.org':
      return wrap('book', 'vipzw.com', path.subRegexMap(/^\/(?:info-|wapbook-|\d+_)(?<bid>\d+)(?:[\/\-](?<cid>\d+))?/));

    case 'wdxs.net':
      return wrap('book', '5du5.org', path.subRegexMap(/\/(?:book|chapters|\d+)_(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'wkshu.com':
      return wrap('book', 'wkshu.com', path.subRegexMap(/\/(?:xs_|txtdown)?(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'wo400.com':
      return wrap('book', 'wo400.com', path.subRegexMap(/\/(?:m|novel\/\d+)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case '52dus.net':
    case '52dus.org':
    case 'x52dus.com':
      return wrap('book', '52dus.net', path.subRegexMap(/\/(?:xuanhuan|xiuzhen|dushi|lishi|wangyou|kehuan|nvpin|qita)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'xcmfu.com':
      return wrap('book', 'xcmfu.com', path.subRegexMap(/^\/(?:\d+|index)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'xread8.com':
      return wrap('book', 'read8.net', path.subRegexMap(/^\/dushu\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'xs98.com':
      return wrap('book', 'xs98.com', path.subRegexMap(/^\/xs(?<bid>\d+)(?:\/(?<cid>\d+)(?:_\d+)?\.html)?/));

    case 'vbiquge.com':
    case 'xxbiquge.net':
    case 'biqufan.com':
    case 'biqupai.com':
      return wrap('book', 'vbiquge.com', path.subRegexMap(/^\/\d+_(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'xbiquke.com':
      return wrap('book', 'xbiquke.com', path.subRegexMap(/^\/bq\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'xiaoshuoba.com':
      return wrap('book', 'xiaoshuoba.com', path.subRegexMap(host.startsWith('www.') ? /^\/(?:book|html\/\d+)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/ : /^\/(?:html|book)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'xiaoshuowu.com':
      return wrap('book', 'xiaoshuowu.com', path.subRegexMap(host.startsWith('www.') ? /^\/(?:book|html\/\d+)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/ : /^\/(?:html|book)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'xinshuhaige.net':
    case 'xinshuhaige.org':
    case 'xinshuhaige.cc':
    case 'xinshuhaige.info':
    case 'shuhaige.org':
    case 'shuhaige.net':
    case 'shuhaige.tw':
    case 'shg.tw':
      return wrap('book', 'xinshuhaige.org', path.subRegexMap(/^\/(?:shu_|txt_)?(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'xklxsw.com':
      return wrap('book', 'xklxsw.com', path.subRegexMap(/^\/book\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'xqianqian.com':
      return wrap('book', 'xqianqian.com', path.subRegexMap(/^\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'xinqingxiaoshuo.com':
      {
        const data = path.subRegexMap(/^\/(?:book|\d+|content)\/(?<bid>\d+)(?:[\/_](?<cid>\d+))?/);

        if (!path.startsWith('/content/') && !path.startsWith('/book/')) {
          delete data['cid'];
        }

        return wrap('book', 'xinqingxiaoshuo.com', data);
      }

    case 'yikanxs.com':
      return wrap('book', 'yikanxs.com', path.subRegexMap(/^\/(?:books?\/|blist\/\d+\/|\d+\/|[a-z]+_)(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'yanmoxuan.net':
      return wrap('book', 'ymxxs.com', path.subRegexMap(/^\/(?:wu|text_|txtdown_|book\/\d+\/)(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'youshu8.cc':
      return wrap('book', 'youshuba.cc', path.subRegexMap(/^\/ks\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'yqzw2.com':
    case 'yqzwww.com':
      return wrap('book', 'yqzw2.com', path.subRegexMap(/^\/(?:xs|files\/article\/html)\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'yuedsk.com':
      return wrap('book', 'yuedsk.com', path.subRegexMap(host.startsWith('www.') ? /^\/(?:book|html\/\d+)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/ : /^\/(?:book|html)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'ysts8.net':
      return wrap('audio', 'ysts8.net', path.subRegexMap(/^\/(?:m_h\/|play_m\/|Yshtml\/Ys|play_)(?<bid>\d+)(?:_\d+_\d+_(?<cid>\d+))?/));

    case 'ysxs8.com':
    case 'ysxs8.vip':
      return wrap('audio', 'ysxs8.com', path.subRegexMap(/^\/(?:downlist|yousheng)\/(?<bid>\d+)(?:_(?<cid>\d+))?/));

    case 'yousheng8.com':
      return wrap('book', 'yousheng8.com', path.subRegexMap(/^\/yousheng\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'zjsw.org':
      return wrap('book', 'zjsw.org', path.subRegexMap(/^\/(?:book|read)\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'zuimh.com':
      return wrap('comic', 'zuimh.com', path.subRegexMap(/^\/manhua\/(?<bid>[^\/]+)(?:\/(?<cid>\d+))?/));

    case 'zwwx.com':
      return wrap('book', 'zwwx.com', path.subRegexMap(/^\/book\/\d+\/(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    case 'zzzcn.com':
      return wrap('book', 'zzzcn.com', path.subRegexMap(/\/3z(?:info-)?(?<bid>\d+)(?:\/(?<cid>\d+))?/));

    default:
      return null;
  }
};