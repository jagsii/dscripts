exports=async function(a,b,c,d){const{parseContent:e,paragraphContentRegexFragment:f}=await require("transcode/parse_content");return e(a,new RegExp(`<div class="read_chapterDetail">${f}`),{clientOptions:{...(d&&d.clientOptions),encoding:"gbk"}})};