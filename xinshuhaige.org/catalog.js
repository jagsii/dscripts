exports=async function(a,b){const{parseCatalogPaginate:c}=await require("transcode/parse_catalog"),d={...(b&&b.clientOptions)};return c(b=>`https://www.shuhaige.net/${a}${1===b?"":"_"+b}/`,[/h2 class="book_article_texttitle">[^<]+<\/h2>\s*<dl>(?<fragment>(?:\s*<dd>\s*<a[^>]*>[^<]*<\/a>\s*<\/dd>)+)/,/href="(?<url>[^"]+)"[^>]*>(?<name>[^<]+)/g],{...b,clientOptions:d,pageSize:900,totalPagesRegex:/class="caption"><span>(?:【<a[^>]+>[^<]+<\/a>】|&nbsp;|\s)+第\d+\/(?<totalPages>\d+)页</})};