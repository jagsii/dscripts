exports=async function(a,b){const{parseInfo:c}=await require("transcode/parse_info"),d=`http://www.paoshu8.com/${a.idPrefix()}_${a}/`;return c("\u7B14\u8DA3\u9601",d,"meta",{clientOptions:{...(b&&b.clientOptions),"x-mobile":0}})};