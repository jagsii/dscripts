exports=async function(a,b){const{parseInfo:c}=await require("transcode/parse_info");return c("\u7267\u4E91\u6587\u5B66",`https://m.myitit.com/xs/${a}/`,"meta",{clientOptions:{...(b&&b.clientOptions),encoding:"gbk"}}).then(a=>(a.intro="",a))};