exports=async function(a,b){const{parseCatalogPaginate:c}=await require("transcode/parse_catalog"),d={...(b&&b.clientOptions)};return c(b=>`https://www.rmxsba.com/${a}${1===b?"":"_"+b}/`,[/全文阅读列表<\/h2>\s*<dl>(?<fragment>(?:\s*<dd>\s*<a[^>]*>[^<]*<\/a>\s*<\/dd>)+)/,/href="(?<url>[^"]+)"[^>]*>(?<name>[^<]+)/g],{...b,clientOptions:d,pageSize:900,totalPagesRegex:/【[^】]*】(?:&nbsp;|\s)*第\d+\/(?<totalPages>\d+)页<\/span>【/})};