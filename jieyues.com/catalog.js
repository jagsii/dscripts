exports=async function(a,b){const{parseCatalog:c,parseCatalogPaginate:d}=await require("transcode/parse_catalog"),[e,f,g]=a.split("|"),h={...(b&&b.clientOptions),"x-mobile":1,followCookies:!0},i=async(a,b)=>{const c=a.body;if(c.contains("\u8BBF\u95EE\u9891\u7387\u8FC7\u9AD8\uFF0C\u8BF7\u4F11\u606F")){const a=c.subRegex(/document\.cookie='([^;]+);/),{cookieManager:d}=await require("http");return await d.set(b.url,a),!0}return !1},j=[/<ul class="[^"]*chapter-list">(?<fragment>(?:\s*<li[^>]*>\s*<a[^>]*>(?:\s*<p>)?\s*[^<]*\s*(?:<\/p>\s*)?<\/a>\s*<\/li>)+)/,/<a[^>]*href="(?<url>[^"]+)">(?:\s*<p>)?\s*(?<name>[^<]+)\s*(?:<\/p>\s*)?<\/a>/g];return ""===g?c(`https://m.${e}/${f}.html`,j,{clientOptions:h,retry:i}):d(a=>`https://m.${e}/${f}${g}_${a}.html`,j,{...b,clientOptions:h,retry:i,pageSize:60,totalPagesRegex:/<a href="[^"]+_(?<totalPages>\d+)\.html">尾页</})};