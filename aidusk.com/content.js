exports=async function(a,b,c,d){const{parseContent:e}=await require("transcode/parse_content");return e(a,"div#content",{clientOptions:{...(d&&d.clientOptions)}}).then(a=>a.map(a=>a.replace(/【www\.13800100\.Com文字首发138看书网】/i,"")))};