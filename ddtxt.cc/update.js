exports=async function(a,b){const{parseUpdate:c}=await require("transcode/parse_update");return c(`https://www.ddtxt.net/book/${a}/`,"meta",{clientOptions:{...(b&&b.clientOptions),encoding:"gbk"},format:"yyyy-MM-dd HH:mm"})};