exports=async function(a,b){const{parseUpdate:c}=await require("transcode/parse_update"),d=`https://wap.zwwx.com/book/${a.idPrefix()}/${a}/`;return c(d,"block_txt2",{clientOptions:{...(b&&b.clientOptions)}})};