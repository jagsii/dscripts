exports=async function(a,b){const{parseInfo:c}=await require("transcode/parse_info"),d=`http://m.yqzwww.com/xs/${a.idPrefix()}/${a}.htm`;return c("\u8A00\u60C5\u4E2D\u6587\u7F51",d,"block_txt2",{clientOptions:{...(b&&b.clientOptions),encoding:"gbk"}})};