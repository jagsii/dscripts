exports=async function(a,b){const{parseInfo:c}=await require("transcode/parse_info");return c("\u624B\u6253\u5427\u5C0F\u8BF4\u7F51",`https://m.shouda88.com/shu_${a}.html`,"meta",{clientOptions:{...(b&&b.clientOptions)},introRegex:".intro>p"})};