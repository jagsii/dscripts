exports=async function(a,b){const{parseInfo:c}=await require("transcode/parse_info");return c("\u9B54\u773C\u770B\u4E66",`https://m.moyandushu.com/info/${a}.html`,"meta",{clientOptions:{...(b&&b.clientOptions)},introRegex:/<div class="intro">(?<intro>(?:<p>[^<]+<\/p>)+)/,serialChar:"\u5168\u672C"})};