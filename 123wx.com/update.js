exports=async function(a,b){const{parseUpdate:c}=await require("transcode/parse_update"),d=`https://wap.123wxwx.com/html/${a.idPrefix()}/${a}/`;return c(d,"dd_box",{clientOptions:{...(b&&b.clientOptions),encoding:"gbk"}})};