var WebSocket = require('ws');
var htmlparser = require('htmlparser2');
var URI = require('uri-js');

module.exports = function (url, callback) {
  var ws = new WebSocket(url, 'scenevr');
  var tag = null;
  var output = '<div style="font-family: arial; font-size: 24px; line-height: 150%; max-width: 512px; margin: 0 auto">';

  var baseUri = URI.parse(url);
  baseUri.scheme = 'http';

  var parser = new htmlparser.Parser({
    onopentag: function (name, attribs) {
      tag = name;

      if (name === 'link') {
        var u = URI.resolve(URI.serialize(baseUri), attribs.href);
        output += '<a href="/' + u.replace(/^.+?\/\//, '') + '">' + attribs.href + '</a>\n';
      }

      if (name === 'model') {
        output += 'Model ' + URI.resolve(URI.serialize(baseUri), attribs.src) + '\n';
      }
    },
    ontext: function (text) {
      if (tag === 'billboard') {
        text = text.replace(/src="(.+?)"/, function (_, arg) {
          return 'src="' + URI.resolve(URI.serialize(baseUri), arg) + '"';
        });

        output += text + '\n';
      }
    },
    onclosetag: function (tagname) {
      tag = null;
    }
  }, { xmlMode: true });

  var timeout = null;

  ws.on('open', function open () {
    // Cancel connection after 5 seconds
    timeout = setTimeout(function () {
      ws.removeAllListeners();
      ws.close();
      callback('timeout');
    }, 5000);
  });

  ws.on('error', function (err) {
    clearTimeout(timeout);
    ws.removeAllListeners();
    ws.close();
    callback(err);
  });

  ws.on('message', function (data, flags) {
    if (data.match(/<spawn/)) {
      parser.write(data);
      parser.end();

      clearTimeout(timeout);
      ws.removeAllListeners();
      ws.close();

      output += '</div>';
      callback(null, output);
    }
  });
};
