exports=async function(a,b){const{parseUpdate:c}=await require("transcode/parse_update"),d=`https://m.71wxc.com/${a.idPrefix()}_${a}/`;return c(d,"dd_box",{clientOptions:{...(b&&b.clientOptions),encoding:"gbk"}})};