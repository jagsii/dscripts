exports=async function(a,b){const{parseCatalog:c}=await require("transcode/parse_catalog");return c(`https://www.bqg.org/book_${a}/`,"div#list>dl>(dt,dd)",{clientOptions:{...(b&&b.clientOptions),encoding:"gbk"}})};