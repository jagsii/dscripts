exports=async function(a,b){const{parseUpdate:c}=await require("transcode/parse_update");return c(`http://m.yuedsk.com/book/${a}/`,"meta",{clientOptions:{...(b&&b.clientOptions)},format:"yyyy-MM-ddTHH:mm:ss"})};