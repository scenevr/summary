var WebSocket = require('ws');
var htmlparser = require('htmlparser2');
var URI = require('uri-js');

module.exports = function (url, callback) {
  var ws = new WebSocket('ws:' + url, 'scenevr');
  var tag = null;
  var output = '<div style="font-family: arial; font-size: 24px; line-height: 150%; max-width: 512px; margin: 0 auto">';

  var parser = new htmlparser.Parser({
    onopentag: function (name, attribs) {
      tag = name;

      if (name === 'link') {
        output += '<a href="/?connect=' + attribs.href.replace(/^\/\//, '') + '">' + attribs.href + '</a>\n';
      }

      if (name === 'model') {
        output += 'Model ' + URI.resolve('http:' + url, attribs.src) + '\n';
      }
    },
    ontext: function (text) {
      if (tag === 'billboard') {
        text = text.replace(/src="(.+?)"/, function (_, arg) {
          return 'src="' + URI.resolve('http:' + url, arg) + '"';
        });

        output += text + '\n';
      }
    },
    onclosetag: function (tagname) {
      tag = null;
    }
  }, { xmlMode: true });

  var timeout = null;

  var finish = function () {
    clearTimeout(timeout);
    ws.close();
    output += '</div>';
    callback(output);
  };

  ws.on('open', function open () {
    // Cancel connection after 5 seconds

    timeout = setTimeout(function () {
      finish();
    }, 5000);
  });

  ws.on('message', function (data, flags) {
    // flags.binary will be set if a binary data is received.
    // flags.masked will be set if the data was masked.

    if (data.match(/<spawn/)) {
      parser.write(data);
      parser.end();
      finish();
    }
  });
};
