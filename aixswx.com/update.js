exports=async function(a,b){const{parseUpdate:c}=await require("transcode/parse_update");return c(`https://wap.aixswx.com/book/${a}.html`,"meta",{clientOptions:{...(b&&b.clientOptions)}})};