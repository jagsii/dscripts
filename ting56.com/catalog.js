exports=async function(a,b){const{parseCatalog:c}=await require("transcode/parse_catalog");return c(`http://www.ting56.com/mp3/${a}.html`,[/<div id="vlink_1"><ul>(?<fragment>(?:\s*<li>[^<]*<a[^>]*>[^<]*<\/a>\s*<\/li>)+)/,/href=['"](?<url>[^'"]+)['"][^>]*>(?<name>[^<]+)/g],{clientOptions:{...(b&&b.clientOptions),encoding:"gbk","x-mobile":0}})};