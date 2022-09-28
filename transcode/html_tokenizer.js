function stepOverString(pos, html) {
  const q = html.charAt(pos);
  pos = pos + 1;
  let c;

  while (pos < html.length) {
    c = html.charAt(pos);

    if (c === '\\') {
      pos += 2;
      continue;
    }

    if (html.charAt(pos) === q) {
      return pos;
    }

    pos++;
  }

  return -1;
}

function getScriptContent(pos, html) {
  const begin = pos;
  let c;

  while (pos < html.length) {
    c = html.charAt(pos);

    if (c === '\'' || c === '"') {
      pos = stepOverString(pos, html);

      if (pos === -1) {
        return html.substring(begin);
      }

      pos++;
      continue;
    }

    if (c === '<' && pos + 7 < html.length && html.substr(pos + 1, 7).toLowerCase() === '/script') {
      const endPos = pos;
      pos += 8;

      while (pos < html.length) {
        if (html.charAt(pos) === '>') {
          return html.substring(begin, endPos);
        }

        if (html.charAt(pos) === ' ') {
          pos++;
          continue;
        }

        break;
      }
    }

    pos++;
  }

  return html.substring(begin);
}

function getCommentTag(pos, html) {
  if (pos + 3 >= html.length) {
    return null;
  }

  if (!(html.charAt(pos + 1) === '!' && html.charAt(pos + 2) === '-' && html.charAt(pos + 3) === '-')) {
    return null;
  }

  const name = '#comment';
  const open = true;
  const begin = pos;
  pos += 4;
  let c;

  while (pos < html.length) {
    c = html.charAt(pos);

    if (c === '-') {
      if (pos + 2 < html.length && html.charAt(pos + 1) === '-' && html.charAt(pos + 2) === '>') {
        return {
          name,
          open,
          begin,
          end: pos + 3,
          selfClosing: true,
          extra: html.substring(begin + 4, pos)
        };
      }
    }

    pos++;
  }

  return {
    name,
    open,
    begin,
    end: html.length,
    extra: html.substring(begin + 4)
  };
}

function getTextTag(pos, html) {
  const begin = pos;
  const open = true;
  const name = '#text';
  pos++;

  while (pos < html.length) {
    if (html.charAt(pos) === '<') {
      return {
        name,
        open,
        begin,
        end: pos,
        extra: html.substring(begin, pos)
      };
    }

    pos++;
  }

  return {
    name,
    open,
    begin,
    end: html.length,
    extra: html.substring(begin, html.length)
  };
}

function isTagChar(char) {
  return char >= 48 && char <= 57 || char >= 97 && char <= 122 || char >= 65 && char <= 90 || char === 45 || char === 58;
}

function getTagName(pos, html) {
  const begin = pos;

  while (pos < html.length) {
    if (!isTagChar(html.charCodeAt(pos))) {
      break;
    }

    pos++;
  }

  if (pos === begin) {
    return null;
  }

  return html.substring(begin, pos);
}

function getOpeningTag(pos, html) {
  const name = getTagName(pos + 1, html);

  if (!name) {
    return null;
  }

  const open = true;
  const begin = pos;
  pos = pos + name.length + 1;
  const attrBegin = pos;
  let c;

  while (pos < html.length) {
    c = html.charAt(pos);

    if (c === '\'' || c === '"') {
      pos = stepOverString(pos, html);

      if (pos === -1) {
        return {
          name,
          open,
          attributes: html.substring(attrBegin, html.length),
          begin,
          end: html.length
        };
      }

      pos++;
      continue;
    }

    if (c === '<') {
      return {
        name,
        open,
        attributes: html.substring(attrBegin, pos),
        begin,
        end: pos
      };
    }

    if (c === '>') {
      const selfClosing = html.charAt(pos - 1) === '/';
      return {
        name,
        open,
        attributes: html.substring(attrBegin, selfClosing ? pos - 1 : pos),
        begin,
        end: pos + 1,
        selfClosing
      };
    }

    pos++;
  }

  return {
    name,
    open,
    attributes: html.substring(attrBegin, html.length),
    begin,
    end: html.length
  };
}

function getClosingTag(pos, html) {
  if (pos + 1 >= html.length || html.charAt(pos + 1) !== '/') {
    return null;
  }

  const name = getTagName(pos + 2, html);

  if (!name) {
    return null;
  }

  const begin = pos;
  const open = false;
  pos += 2 + name.length;

  while (pos < html.length) {
    if (html.charAt(pos) === '>') {
      return {
        name,
        open,
        begin,
        end: pos + 1
      };
    }

    if (html.charAt(pos) === '<') {
      return {
        name,
        open,
        begin,
        end: pos
      };
    }

    pos++;
  }

  return {
    name,
    open,
    begin,
    end: html.length
  };
}

function htmlTokenize(html, options) {
  options = {
    filterEmptyString: false,
    trimString: false,
    trimAttributes: true,
    lowerCaseTagName: true,
    ...options
  };
  const result = [];
  let pos = 0;
  const length = html.length;
  let c;

  while (pos < length) {
    c = html.charAt(pos);
    let tag;

    if (c === '<') {
      tag = getCommentTag(pos, html) || getOpeningTag(pos, html) || getClosingTag(pos, html);

      if (tag) {
        if (options.lowerCaseTagName) {
          tag.name = tag.name.toLowerCase();
        }

        pos = tag.end;

        if (tag.attributes && options.trimAttributes) {
          tag.attributes = tag.attributes.trim();
        }

        if (tag.attributes !== undefined && tag.attributes.length === 0) {
          delete tag.attributes;
        }

        if (tag.name.toLowerCase() === 'script' && tag.open) {
          tag.extra = getScriptContent(pos, html);

          if (tag.extra) {
            pos = pos + tag.extra.length;
          }
        }

        result.push(tag);
        continue;
      }
    }

    const textTag = getTextTag(pos, html);

    if (options.trimString) {
      textTag.extra = textTag.extra.trim();
    }

    if (!options.filterEmptyString || textTag.extra.length > 0) {
      result.push(textTag);
    }

    pos = textTag.end;
  }

  return result;
}

exports = htmlTokenize;