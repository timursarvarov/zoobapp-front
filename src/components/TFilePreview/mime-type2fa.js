
/* eslint-disable */ 
const mapping = [
    // Images
    ['file-image', /^image\//],
    // Audio
    ['file-audio', /^audio\//],
    // Video
    ['file-video', /^video\//],
    // Documents
    ['file-pdf', 'application/pdf'],
    ['file-alt', 'text/plain'],
    ['file-code', [
      'text/html',
      'text/javascript',
    ]],
    // Archives
    ['file-archive', [
      /^application\/x-(g?tar|xz|compress|bzip2|g?zip)$/,
      /^application\/x-(7z|rar|zip)-compressed$/,
      /^application\/(zip|gzip|tar)$/,
    ]],
    // Word
    ['file-word', [
      /ms-?word/,
      'application/vnd.oasis.opendocument.text',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]],
    // Powerpoint
    ['file-powerpoint', [
      /ms-?powerpoint/,
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ]],
    // Excel
    ['file-excel', [
      /ms-?excel/,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]],
    // Default, misc
    ['file'],
  ];

  function match(mimetype, cond) {
    if (Array.isArray(cond)) {
      return cond.reduce((v, c) => v || match(mimetype, c), false);
    } if (cond instanceof RegExp) {
      return cond.test(mimetype);
    } if (cond === undefined) {
      return true;
    }
      return mimetype === cond;
  }

  const cache = {};

  function resolve(mimetype) {
    if (cache[mimetype]) {
      return cache[mimetype];
    }

    for (let i = 0; i < mapping.length; i++) {
      if (match(mimetype, mapping[i][1])) {
        cache[mimetype] = mapping[i][0];
        return mapping[i][0];
      }
    }
  }

  function mimetype2fa(mimetype, options) {
    if (typeof mimetype === 'object') {
      options = mimetype;
      return function (mimetype) {
        return mimetype2fa(mimetype, options);
      };
    }
      const icon = resolve(mimetype);

      if (icon && options && options.prefix) {
        return options.prefix + icon;
      }
        return icon;
  }
  export default mimetype2fa;
