exports=async function(a,b){const{parseCatalog:c}=await require("transcode/parse_catalog");return c(`https://www.etingshu.com/show/${a}.html`,[/<div[^>]*id="playlist"[^>]*>(?<fragment>(?:\s*<li[^>]*>\s*<a[^>]*>[^<]*<\/a>\s*<\/li>)+)/,/<a[^>]*href=['"](?<url>[^'"]+)['"][^>]*>(?<name>[^<]+)</g],{clientOptions:{...(b&&b.clientOptions),"x-mobile":1}})};