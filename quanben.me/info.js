exports=async function(a,b){const{parseInfo:c}=await require("transcode/parse_info");return c("\u5168\u672C\u5C0F\u8BF4\u7F51",`http://m.quanben.me/ls-${a}/`,"meta",{clientOptions:{...(b&&b.clientOptions)}})};