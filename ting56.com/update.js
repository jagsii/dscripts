exports=async function(a,b){const{parseUpdate:c}=await require("transcode/parse_update");return c(`http://www.ting56.com/mp3/${a}.html`,/<li><a title=['"][^'"]+['"] href=['"][^'"]+['"] target="_blank">(?<name>[^<>]+)<\/a><\/li>\s*<\/ul>[\s\S]+<dd><span>更新时间：<\/span>(?<updateTime>[^<>]+)<\/dd>/,{clientOptions:{...(b&&b.clientOptions),encoding:"gbk","x-mobile":0},format:"yyyy/M/d H:mm:ss"})};