exports=async function(a,b,d,e){const{send:f}=require("http"),g={...(e&&e.clientOptions),encoding:"utf-8","x-mobile":1};stat("request");let h=await f(a,g);if(stat("request"),200!=h.statusCode)throw new Error(h.reasonPhrase);let i=h.body,j=0;for(;i.contains("\u8BBF\u95EE\u9891\u7387\u8FC7\u9AD8\uFF0C\u8BF7\u4F11\u606F")&&3>j++;){const b=i.subRegex(/document\.cookie='([^;]+);/),{cookieManager:c}=await require("http");if(await c.set(a,b),h=await f(a,g),200!=h.statusCode)throw new Error(h.reasonPhrase);i=h.body;}if(h=await f(/initTxt\("([^"]+)"/.exec(i)[1],g),200!=h.statusCode)throw new Error(h.reasonPhrase);const k={"":"_0x0001","":"_0x0002","":"_0x0003","":"_0x0004","":"_0x0005","":"_0x0006","":"_0x0007","":"_0x0008"},l=/_txt_call\((.+)\);$/.exec(h.body)[1].replace(/[\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008]/g,a=>k[a]),m=JSON.parse(l),n=m.replace;let p=m.content;for(let c in n)n.hasOwnProperty(c)&&(p=p.replaceAll(n[c],c));return p.split(/\s{2,}|<\/ ?p>/).map(a=>a.replace("<p>","").trim()).filter(a=>0<a.length)};