exports=async function(a,b,c,d){const{parseContent:e}=await require("transcode/parse_content");return e(a,/id="htmlContent"[^>]*>(?<fragment>(?:[^<]+|<br ?\/?>)+)/,{clientOptions:{...(d&&d.clientOptions),encoding:"gbk"},preprocess:a=>a.replace(/class="contentbox">(\s*<table[^>]*>\s*<tr>(?:\s*<td[^>]*>\s*<script[^>]*>[^<]*<\/script>\s*<\/td>)+\s*<\/tr>\s*<\/table>)/,">")})};