exports=async function(a,b){const{parseUpdate:c}=await require("transcode/parse_update");return c(`https://m.myitit.com/xs/${a}/`,/最近更新：<\/span>\s*<a[^>]*>(?<name>[^<]+)<\/a>\s*<\/p>\s*<p class="time"><span>更新时间：<\/span>(?<updateTime>[^<]+)</,{clientOptions:{...(b&&b.clientOptions),encoding:"gbk"}})};