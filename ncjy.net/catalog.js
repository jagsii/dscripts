exports=async function(a,b){const{parseCatalog:c}=await require("transcode/parse_catalog");return c(`http://www.ncjy.net/bxwx/${a}/`,".section-list",{clientOptions:{...(b&&b.clientOptions)}})};