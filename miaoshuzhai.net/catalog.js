exports=async function(a,b){const{parseCatalog:c}=await require("transcode/parse_catalog"),{prepareCookie:d}=await require("book/miaoshuzhai.net/common");return c(`https://www.doucehua.com/xs/${a}.html`,"div#list>dl>dd",{httpOptions:d(),clientOptions:{...(b&&b.clientOptions)}})};