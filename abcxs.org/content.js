exports=async function(a,b,c,d){const{parseContent:e}=await require("transcode/parse_content");return e(a,"div#content",{clientOptions:{...(d&&d.clientOptions),encoding:"gbk"}}).then(a=>(a.last.startsWith("\u5929\u624D\u4E00\u79D2\u8BB0\u4F4F\u672C\u7AD9\u5730\u5740\uFF1A")&&(/https?:\/\/[a-z0-9.\-_]+/i.test(a[a.length-2])?a.splice(a.length-2,2):a.splice(a.length-1,1)),a))};