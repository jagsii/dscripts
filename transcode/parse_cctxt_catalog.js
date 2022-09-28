async function parseCatalog(bid, site, options) {
  const {
    send
  } = require("http");

  options = options || {};
  const clientOptions = {
    encoding: "utf-8",
    ...options.clientOptions
  };
  const url = `${site}/files/${bid.idPrefix()}/${bid}/${bid}.json?cdnversions=${Math.ceil(new Date().getTime() / 300000)}`;
  const httpOptions = {
    url,
    ...options.httpOptions
  };
  const response = await send(httpOptions, clientOptions);

  if (response.statusCode < 200 || response.statusCode > 299) {
    throw new Error(`Request failed with statusCode ${response.statusCode}, ${response.reasonPhrase}`);
  }

  const json = JSON.parse(response.body);
  const articleid = json.info.articleid + '';
  const idPrefix = articleid.idPrefix();
  const ssid = options.ssid || '555';
  return json.list.map(_ => ({
    id: _.chapterid + '',
    name: _.chaptername.trim(),
    url: `${site}/chapter.html?${bid}#mybookid=${bid}&bookid=${articleid}&chapterid=${_.chapterid}&url=${site}/files/article/html${ssid}/${idPrefix}/${articleid}/${_.chapterid}.html`
  }));
}

exports.parseCatalog = parseCatalog;