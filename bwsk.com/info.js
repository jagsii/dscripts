exports=async function(a,b){const{parseInfo:c}=await require("transcode/parse_info");return c("\u535A\u5927\u4E66\u5E93",`http://www.bwsk.com/${a}/index.html`,[/<a href="[^"]*index.html">(?<author>[^<]+)作品集\s*</i,/<span[^>]+>\s*<font[^>]*color="#FF0000"[^>]*>(?<name>[^<]+)<\/font>/i,/<title>博大书库[-－]{2}>?(?<name>[^()]+)\((?<author>[^)]+)\)<\//i],{clientOptions:{...(b&&b.clientOptions),encoding:"gbk"}}).then(a=>(a.author||(a.author=a.name,a.name+="\u4F5C\u54C1\u96C6"),a.serial=1,a))};