exports=async function(a,b){const{parseCatalog:c}=await require("transcode/parse_catalog"),d=a.idPrefix();return c(`https://www.youshu8.cc/ks/${d}/${a}/`,[/最新章节（[^）]+）<\/div>\s*<div class="ListChapter">\s*<ul>(?:\s*<li>\s*<a[^>]*>[^<]*<\/a>\s*<\/li>)+\s*<\/ul>\s*<\/div>(?<fragment>(?:\s*<div class="ListTitle">[^<]*<\/div>|(?:\s*<div class="ListChapter">\s*<ul>(?:\s*<li>\s*<a[^>]*>[^<]*<\/a>\s*<\/li>)+\s*<\/ul>\s*<\/div>))+)/,/href="(?<url>[^"]+)"[^>]*>(?<name>[^<]+)/g],{clientOptions:{...(b&&b.clientOptions),encoding:"gbk"},urlBuilder:b=>`https://www.youshu8.cc/ks/${d}/${a}/${b}.html#url=https://www.youshu8.cc/ks/txtt333/${a}/${b}.txt`})};