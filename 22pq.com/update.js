exports=async function(a,b){const{parseUpdate:c}=await require("transcode/parse_update");return c(`https://m.umiwx.com/read/${a}.html`,"meta",b)};