String.prototype.matchAll||(String.prototype.matchAll=function(a){let b;const c=[];for(;null!==(b=a.exec(this));)c.push(b);return c[Symbol.iterator]()}),"undefined"==typeof globalThis&&("undefined"==typeof window?"undefined"==typeof global?"undefined"!=typeof self&&(self.globalThis=self):global.globalThis=global:window.globalThis=window),String.prototype.subRegex||(String.prototype.subRegex=function(a){const b=a.exec(this);return null==b?null:b[1]}),String.prototype.subRegexFirst||(String.prototype.subRegexFirst=function(a){const b=a.exec(this);if(null==b)return null;for(let c=1;c<b.length;c++)if(b[c]!==void 0)return b[c];return null}),String.prototype.subRegexAll||(String.prototype.subRegexAll=function(a){if(-1===a.flags.indexOf("g"))throw "subRegexAll regex flag must include g";const b=[];for(let c;null!==(c=a.exec(this));)b.push(c[1]);return b}),String.prototype.subRegexMap||(String.prototype.subRegexMap=function(a){const b={};if(-1===a.flags.indexOf("g")){const c=a.exec(this);if(null!=c)for(let a in c.groups)void 0!==c.groups[a]&&(b[a]=c.groups[a]);}else {const c=this.matchAll(a);for(let a of c)for(let c in a.groups)if(a.groups[c]!==void 0){b[c]=a.groups[c];break}}return b}),String.prototype.contains||(String.prototype.contains=function(a){return -1!==this.indexOf(a)}),String.prototype.idPrefix||(String.prototype.idPrefix=function(){return 3<this.length?this.substring(0,this.length-3):"0"}),Array.prototype.first||Object.defineProperty(Array.prototype,"first",{get(){return 0===this.length?void 0:this[0]},set(a){this[0]=a;},enumerable:!1}),Array.prototype.last||Object.defineProperty(Array.prototype,"last",{get(){return 0===this.length?void 0:this[this.length-1]},set(a){this[this.length-1]=a;},enumerable:!1}),globalThis.delay=async function(a){return new Promise(b=>{setTimeout(()=>b(),a);})},globalThis.stat===void 0&&(globalThis.stat=function(){}),globalThis.assertOK=function(a){if(200>a.statusCode||299<a.statusCode)throw new Error(`Request failed with statusCode ${a.statusCode}, ${a.reasonPhrase}`)},globalThis.formatTags=function(a){return a.split(/[\s,]/).map(a=>a.trim()).filter(a=>0<a.length).join(",")},globalThis.cleanHTMLComments=function(a){return a.replace(/<!--.*?-->/g,"")},globalThis.cleanHTML=function(a){return this.cleanHTMLComments(a).replace(/<script(?: [^>]+)?>[^<]+<\/script>/i,"")},globalThis.Utils={getUrlPath(a){let b=a;(a.startsWith("http:")||a.startsWith("https:"))&&(b=a.substring(a.indexOf("/")));let c=b.indexOf("?");return -1!==c&&(b=b.substring(0,c)),c=b.indexOf("#"),-1!==c&&(b=b.substring(0,c)),b}};