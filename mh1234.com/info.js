exports=async function(a,b){const{parseInfo:c}=await require("transcode/parse_sinmh_info");return c("\u6F2B\u753B1234",`https://m.zxkai.com/comic/${a}.html`,{clientOptions:{...(b&&b.clientOptions)}})};