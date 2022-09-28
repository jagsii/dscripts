async function redirectCookiesRetry(response, httpOptions, clientOptions, count) {
  if (count > 3) {
    return false;
  }

  if (response.statusCode === 302) {
    if (!response.headers['set-cookie']) {
      return false;
    }

    if (!httpOptions.headers) {
      httpOptions.headers = {};
    }

    httpOptions.headers['Cookie'] = response.headers['set-cookie'].split(',').map(_ => {
      let i = _.indexOf(';');

      if (i !== -1) {
        return _.substring(0, i).trim();
      }

      return _.trim();
    }).join('; ');
    return true;
  }
}

exports.redirectCookiesRetry = redirectCookiesRetry;