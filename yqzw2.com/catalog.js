exports=async function(a,b){const{parseCatalog:c}=await require("transcode/parse_catalog"),d=`http://www.yqzwww.com/files/article/html/${a.idPrefix()}/${a}/index.html`;return c(d,[/<div class="box"[^>]*>\s*(?<fragment>(?:\s*<div[^>]*>\s*<ol>(?:\s*<li>\s*<a[^>]*>[^<]*<\/a>\s*<\/li>|&nbsp;|\s)+\s*<\/ol>\s*<\/div>)+)/,/href="(?<url>[^"]+)"[^>]*>(?<name>[^<]+)/g],{clientOptions:{...(b&&b.clientOptions),encoding:"gbk"}})};