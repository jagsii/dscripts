exports=async function(a,b,c,d){const{send:e}=require("http"),f={...(d&&d.clientOptions),encoding:"utf-8","x-mobile":0};stat("request");let g=await e(a,f);stat("request"),assertOK(g);let h=g.body;const i=h.subRegex(/,"page_url":"([^"]+)"/).split(/\|[a-zA-Z\d]+\|/);return {urls:i}};