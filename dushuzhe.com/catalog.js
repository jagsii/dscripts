exports=async function(a,b){const{parseCatalog:c}=await require("transcode/parse_catalog");return c(`https://www.dushuzhe.cc/book/${a}/`,[/<div class="listmain">\s*<dl>(?<fragment>(?:\s*<dt>[^<]*<\/dt>|\s*<dd><a[^>]*>[^<]*<\/a><\/dd>)+)/,/<dt>(?<volume>[^<]+)<\/dt>|<a href\s*="(?<url>[^"]+)">(?<name>[^<]+)</g,a=>{if(0===a.length||null==a.first.volume)return a;let b=-1;for(let c=0;7>c;c++)if(!/最新\d+章节/.test(a[c].volume)){b=c;break}return 0<b&&a.splice(0,b),a}],{clientOptions:{...(b&&b.clientOptions),encoding:"gbk"}})};