exports=async function(a,b){const{parseCatalog:c}=await require("transcode/parse_catalog");return c(`http://m.ting74.com/tingshu/${a}/`,[/id="playlist">\s*<ul>(?<fragment>(?:\s*<li>\s*<a[^>]*>[^<]*<\/a>\s*<\/li>)+)/,/href="(?<url>[^"]+)"[^>]*>(?<name>[^<]+)</g],{clientOptions:{...(b&&b.clientOptions),"x-mobile":1}})};