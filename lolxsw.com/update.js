exports=async function(a,b){const{parseUpdate:c}=await require("transcode/parse_update");return c(`https://m.lolxsw.com/${a}/`,"meta",{clientOptions:{...(b&&b.clientOptions)},format:"yyyy-MM-dd HH:mm"})};