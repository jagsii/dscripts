exports=async function(a,b){const{parseCatalog:c}=await require("transcode/parse_catalog"),d=`https://www.23hh.com/book/${a.idPrefix()}/${a}/`;return c(d,"listmain>dl>dd",{clientOptions:{...(b&&b.clientOptions),encoding:"gbk"}})};