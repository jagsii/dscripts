exports=async function(a,b,c,d){const{send:e}=require("http"),f={...(d&&d.clientOptions),encoding:"utf-8","x-mobile":1};let g=!0,h=1;const i=[];do{if(50<h)break;stat("request");let a=await e(`https://m.manhuapi.com/chapter/${c}_${h++}.html`,f);stat("request"),assertOK(a);let b=a.body;g=/<a class="pg-next" href="[^"]+\d+_\d+\.html">下一页</.test(b),i.push(b.subRegex(/<div id="content"><p>(?:<a href="[^"]*">)?<img src="([^"]+)"/)),await delay(200);}while(g);return {urls:i}};