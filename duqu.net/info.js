exports=async function(a,b){const{parseInfo:c}=await require("transcode/parse_info");return c("\u8BFB\u8DA3\u7F51",`http://www.duqu.net/book/${a}/`,"meta",{clientOptions:{...(b&&b.clientOptions),"x-mobile":0},introRegex:/<div class="tabcontent">\s*<div[^>]*>\s*<div[^>]*>(?<intro>[^<]*)</})};