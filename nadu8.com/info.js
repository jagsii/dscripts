exports=async function(a,b){const{parseInfo:c}=await require("transcode/parse_info");return c("\u54EA\u8BFB\u5427",`https://m.nadu8.com/ac/${a}`,[/<h1 class="comic-name"[^>]*>(?<name>[^<]+)<\/h1>/,/id="js_synopsis">(?<intro>[^<]*)<\/p>\s*<dl class="comic-author">\s*<dt>作者:<\/dt>\s*<dd>(?<author>[^<]+)</,/class="latest-chapter">(?<serial>[^<]*)</,/id="js_comic_header">\s*<img class="thumb"[^>]*data-src="(?<cover>[^"]+)"/],{clientOptions:{...(b&&b.clientOptions)},serialChar:"\u6700\u7EC8\u8BDD"}).then(a=>(a.cover&&!a.cover.endsWith(".webp")&&(a.cover+="-normal.webp"),a))};