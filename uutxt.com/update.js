exports=async function(a,b){const{parseUpdate:c}=await require("transcode/parse_update"),d=`https://m.uutxt.com/book/${a.idPrefix()}/${a}/`;return c(d,"meta",{clientOptions:{...(b&&b.clientOptions)}})};