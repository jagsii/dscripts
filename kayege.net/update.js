exports=async function(a,b){const{parseUpdate:c}=await require("transcode/parse_update"),d=`https://m.kayege.net/${a.idPrefix()}_${a}/`;return c(d,"Synopsis",{clientOptions:{...(b&&b.clientOptions)},format:"yyyy-MM-dd"})};