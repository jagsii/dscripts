exports=async function(a,b,c,d){const{parseContent:e}=await require("transcode/parse_content");return e(a,/div id="content"[^>]*>(?<fragment>(?:[^<]+|<br ?\/?>)+)/,{clientOptions:{...(d&&d.clientOptions)}}).then(a=>(a.last=a.last.replace("\u4E00\u79D2\u8BB0\u4F4F\u3010\u6606\u4ED1\u5C71\u5C0F\u8BF4\u514D\u8D39\u7F51 www.klsxs.com\u3011\uFF0C\u7CBE\u5F69\u5C0F\u8BF4\u65E0\u5F39\u7A97\u514D\u8D39\u9605\u8BFB\uFF01",""),a))};