exports=async function(a,b){const{parseInfo:c}=await require("transcode/parse_info"),d=`http://www.ysxs8.vip/downlist/${a}.html`;return c("\u6709\u58F0\u5C0F\u8BF4\u5427",d,/h1>(?<name>[^<]+)有声小说<\/h1><\/div><div class="content_center"><font>播音：<a[^>]*>(?<author>[^<]*)<\/a>[^<>]*作者：<a[^>]*>[^<]*<\/a>[^<>]*类别：<a[^>]*>[^<]*<\/a><\/font><img[^>]*><\/div><div[^>]*><font>[^<]*<\/font><\/div><div[^>]*><[^>]*><[^>]*class="bookintro c_show">(?<intro>[^<]*)</,{clientOptions:{...(b&&b.clientOptions),encoding:"gbk","x-mobile":0},postprocess:(a,b)=>{const c=require("utils/absolute_url");b.cover=c(a.subRegex(/<div class="content_right"><img src="(?<cover>[^"]+)"/),d);}})};