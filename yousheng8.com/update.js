exports=async function(a,b){const{parseUpdate:c}=await require("transcode/parse_update");return c(`https://m.yousheng8.com/yousheng/${a}/`,"meta",{clientOptions:{...(b&&b.clientOptions),encoding:"gbk"}})};