exports=async function(a,b){const{parseCatalog:c}=await require("transcode/parse_catalog");return c(`https://www.70dushu.com/book/${a}/`,[/id="list"[^>]*>\s*<ul>\s*(?<fragment>(?:\s*<li>\s*<a[^>]*>[^<]*<\/a>\s*<\/li>)+)/,/href="(?<url>[^"]+)"[^>]*>(?<name>[^<]+)/g],{clientOptions:{...(b&&b.clientOptions)}})};