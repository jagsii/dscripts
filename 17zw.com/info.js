exports=async function(a,b){const{parseInfo:c}=await require("transcode/parse_info");return c("\u8A00\u60C5\u4E2D\u6587\u7F51",`https://m.17zw.com/book_${a}/`,"meta",{clientOptions:{...(b&&b.clientOptions),encoding:"gbk","x-mobile":1},introRegex:/<div class="intro">(?<intro>[^<]*)<\/div>/})};