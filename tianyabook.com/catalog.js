exports=async function(a,b){const{parseCatalog:c}=await require("transcode/parse_catalog"),{redirectCookiesRetry:d}=await require("transcode/utils");return c(`https://www.tianyabook.com/shu/${a}.html`,[/全部章节目录<\/strong>\s*<\/div>\s*<dl[^>]+>(?<fragment>(?:\s*<dd[^>]+>\s*<a[^>]*>[^<]*<\/a>\s*<\/dd>)+)/,/href="(?<url>[^"]+)"[^>]+>(?<name>[^<]+)/g],{httpOptions:{followRedirects:!1},clientOptions:{...(b&&b.clientOptions),encoding:"gbk"},retry:d})};