exports=async function(a,b){const{parseUpdate:c}=await require("transcode/parse_update"),d=`https://www.1718k.com/files/article/html/${a.idPrefix()}/${a}/`;return c(d,"meta",{clientOptions:{...(b&&b.clientOptions)}})};