exports=async function(a,b){const{parseUpdate:c}=await require("transcode/parse_update"),d=`http://www.nbaxiaoshuo.com/info/${a.idPrefix()}/${a}/index.shtml`;return c(d,/og:novel:latest_chapter_name" content=['"]([^'"\s]+ )?(?<name>[^'"]+)['"]>\s*<meta[^>]+>\s*<meta property="og:novel:update_time" content=['"](?<updateTime>[^'"]+)['"]/,{clientOptions:{...(b&&b.clientOptions),encoding:"gbk"},format:"yyyy-MM-dd"})};