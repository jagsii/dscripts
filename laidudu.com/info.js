exports=async function(a,b){const{parseInfo:c}=await require("transcode/parse_info");return c("\u6765\u8BFB\u8BFB\u5C0F\u8BF4",`https://m.laidudu.com/book/${a}/`,/<div class="book_info">\s*<div class="cover"><img src="(?<cover>[^"]*)"[^>]*>\s*<\/div>\s*<div[^>]*>\s*<dl>\s*<dt class="name">(?<name>[^<]+)<\/dt>\s*<dd[^>]*>\s*<span>作者：(?<author>[^<]*)<\/span>\s*<span>[^<]*<\/span>\s*<\/dd>\s*<dd[^>]*>\s*<span>状态：(?<serial>[^<]*)<[\S\s]+内容简介<\/dt>\s*<dd>(?<intro>(?:[^<]+|<span class="noshow">)*)</,{clientOptions:{...(b&&b.clientOptions)}}).then(a=>(a.intro=a.intro.replace("<span class=\"noshow\">",""),a))};