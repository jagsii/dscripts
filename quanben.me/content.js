exports=async function(a,b,c,d){const{parseContentPaginate:e}=await require("transcode/parse_content");return e(a=>`http://www.quanben.me/ls-${b}/${c}${1===a?"":"_"+a}.html`,"div#content",{clientOptions:{...(d&&d.clientOptions)},pageCleaner:a=>(0<a.length&&/.+\(第\d+\/\d+页\).*/.test(a[0])&&a.splice(0,1),0<a.length&&/.+本章未完，请点击下一页继续阅读.+/.test(a.last)&&a.splice(a.length-1,1),a),hasNextFn:a=>null!=/<a href="\/ls-\d+\/\d+_\d+\.html">下一页</.exec(a)})};