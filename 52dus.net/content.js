exports=async function(a,b,c,d){const{parseContentPaginate:e}=await require("transcode/parse_content");return e(b=>1===b?a:a.replace(/\.html/,`_${b-1}.html`),/<div[^>]* id="BookText"[^>]*>(?<fragment>(?:[^<]|<br ?\/?>)+)/,{...d,pageCleaner:a=>(a.last=a.last.replace("-->>",""),a.map(a=>a.trim()).filter(a=>0<a.length)),hasNextFn:a=>null!=/<p class="to_nextpage">\s*<a href="[^"]+_\d+\.html">/.exec(a)})};