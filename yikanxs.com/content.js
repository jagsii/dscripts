exports=async function(a,b,c,d){const{parseContentPaginate:e}=await require("transcode/parse_content");return e(a=>`https://m.yikanxs.com/books/${b}/${c}${1===a?"":"_"+a}.html`,/<div [^>]*id="nr"[^>]*>\s*(?:\s*<a[^>]*>)?(?<fragment>(?:[^<>]+|<br\s*\/?>)+)/,{clientOptions:{...(d&&d.clientOptions),encoding:"gbk","x-mobile":1},hasNextFn:a=>null!=/<a [^>]*href="[^"]*\d+\/\d+_\d+\.html"[^>]*>(<\/a>)?下一页</.exec(a)})};