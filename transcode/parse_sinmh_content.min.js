function getNodeHost(path, nodeHosts, sum = 256) {
  var a = path.match(/images\/\w\/(.{2})/i);
  var weight = 1;

  if (a !== null && a[1]) {
    weight = parseInt('0x' + a[1], 16);
  }

  var hosts = nodeHosts;
  var total = 0;
  hosts.forEach(function (item) {
    if (typeof item === "string") {
      item = {
        weight: 1,
        value: item
      };
    }

    if (!item.value) {
      return;
    }

    total += item.weight ? item.weight : 1;
  });
  total = total > 0 ? total : 1;
  var host = null;
  var w = 0;
  hosts.forEach(function (item) {
    if (host !== null) {
      return;
    }

    if (typeof item === "string") {
      item = {
        weight: 1,
        value: item
      };
    }

    if (!item.value) {
      return;
    }

    w += (item.weight ? item.weight : 1) / total * sum;

    if (w > weight) {
      host = item.value;
    }
  });
  return host;
}

async function parseContent(url, options) {
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

  const {
    send
  } = require("http");

  let response = await send(httpOptions, clientOptions);
  stat('request');
  assertOK(response);
  let html = response.body;
  const {
    chapterImages,
    nodeHost,
    nodeHosts
  } = html.subRegexMap(/var chapterImages\s*=\s*(?<chapterImages>\[[^\]]+\]);[^<]*?var nodeHost\s*=\s*"(?<nodeHost>[^"]*)";[^<]*?var nodeHosts\s*=\s*(?<nodeHosts>\[[^;]*\]);/);
  const {
    getCih,
    getCirh
  } = html.subRegexMap(/function getCih\(\)\{\s*return ["'](?<getCih>[^"']+)["'];\s*\}<\/script>\s*<script>function getCirh\(\)\{return ["'](?<getCirh>[^"']+)["'];/);
  const chapterImageHost = html.subRegex(/var chapterImageHost\s*=\s*"([^"]*)";/);
  const chapterImageRHost = html.subRegex(/var chapterImageRHost\s*=\s*"([^"]*)";/);
  var host = chapterImageHost ? chapterImageHost : '';

  if (getCih !== undefined) {
    host = getCih;
  }

  let cirh = chapterImageRHost ? chapterImageRHost : '';

  if (getCirh !== undefined) {
    cirh = getCirh;
  }

  const hosts = JSON.parse(nodeHosts);
  const urls = JSON.parse(chapterImages.replace(/\\/g, '')).map(_ => {
    if (cirh && /^(\/[rz]\/?)/i.test(_)) {
      return cirh + _;
    }

    if (/^(\/p\/?)/i.test(_)) {
      return nodeHost + _;
    }

    if (/^\/images\/p\//i.test(_)) {
      return getNodeHost(_, hosts) + _;
    }

    if (host && /^(\/|images?)/i.test(_)) {
      return host + _;
    }

    return _;
  });
  return {
    urls
  };
}

exports.getNodeHost = getNodeHost;
exports.parseContent = parseContent;