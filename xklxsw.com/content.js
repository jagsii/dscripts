exports=async function(a,b,c,d){const{parseContent:e}=await require("transcode/parse_content");return e(a,/<div [^>]*id="content"[^>]*>\s*纯文字在线阅读(?:[^<>]+|<b(?: [^>]*)?>.*?<\/b>)+(?<fragment>(?:[^<>]+|<br\s*\/?>)+)/,{clientOptions:{...(d&&d.clientOptions),encoding:"gbk"}})};