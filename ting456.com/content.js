exports=async function(a,b,c,d){const e={...(d&&d.clientOptions),encoding:"utf-8","x-mobile":1};stat("request");const{send:f}=require("http");let g=await f(a,e);stat("request"),assertOK(g);let h=g.body;const{now:i,pn:j,nextPage:k}=h.subRegexMap(/var now="(?<now>[^"]+)";[^<>]*?var pn="(?<pn>[^"]*)";[^<>]*?var nextPage="(?<nextPage>[^"]*)";/),l=require("utils/absolute_url");let m=l(`/js/player/${j}.html`,a);if(!m)return null;g=await f({url:m,headers:{Referer:a}},e),assertOK(g),h=g.body;let n=h.subRegex(/<iframe[^>]* runat="server" src="([^"]+)"/);if(!n)return null;const o={"parent.now":i,"parent.pn":j,"parent.nextPage":k};n=n.replace(/'\s*\+([^'+]+)\+\s*'/g,(a,b)=>o[b.trim()]),g=await f({url:l(n,m),headers:{Referer:m}},e),assertOK(g),h=g.body;const p=h.subRegex(/jPlayer\("setMedia",\s*{mp3:"([^"]+)/);return p?{url:encodeURI(p)}:null};