exports=async function(a,b,c,d){const{parseContent:e}=await require("transcode/parse_content");return e(a,/<div class="read-content[^>]*>(?<fragment>(?:[^<]+|<\/?p>)+)/,{clientOptions:{...(d&&d.clientOptions)}})};