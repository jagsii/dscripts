exports=async function(a,b,c,d){const{parseContent:e}=await require("transcode/parse_content");return e(a,/<div id="htmlContent"[^>]*>(?<fragment>(?:[^<]+|<br ?\/?>)+)/,{clientOptions:{...(d&&d.clientOptions),encoding:"gbk"}})};