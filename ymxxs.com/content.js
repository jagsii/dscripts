exports=async function(a,b,c,d){const{parseContent:e}=await require("transcode/parse_content");return e(a,"div#content",{clientOptions:{...(d&&d.clientOptions)},preprocess:a=>a.replace("<script type=\"text/javascript\">applyChapterSetting();</script>","")})};