function decryptCCTXT(raw) {
  let result;
  raw.split('\n').forEach(_ => {
    if (_.startsWith('var cctxt=')) {
      result = /var cctxt='(.+)';/.exec(_)[1];
      return;
    }

    if (_.startsWith('cctxt=cctxt.replace')) {
      const {
        regex,
        char
      } = _.subRegexMap(/\/(?<regex>[^\/]+)\/g,\s*'(?<char>[^']+)'/);

      result = result.replace(new RegExp(regex, 'g'), char);
      return;
    }
  });
  return result;
}

function decryptJS(raw) {
  const code = raw.replace(/\{var _0x\w+=new RegExp\([^;]+(\);return _0x\w+\[[^;]+\(\)\);|;var _0x\w+=_0x[^?]+\?--[^:]+:--[^:]+;return this\[[^;]+;)\}/g, '{return true}').replace(/\{var _0x\w+=new RegExp\('[^']+'\);return!_0x\w+\[[^;]+\(\)\);\}/g, '{return false}').replace('var cctxt=', '');
  return eval(code);
}

async function parseContent(url, bid, cid, options) {
  const {
    parseContent
  } = await require('transcode/parse_content');
  return parseContent(url.substring(url.indexOf('url=') + 4), null, {
    clientOptions: { ...(options && options.clientOptions)
    },
    transformer: raw => raw.indexOf('var _0x') === 0 ? decryptJS(raw) : decryptCCTXT(raw)
  });
}

exports.parseContent = parseContent;