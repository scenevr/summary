var tape = require('tape');
var summary = require('./index');

tape('summarise', function (t) {
  summary('ws://home.scenevr.hosting/home.xml', function (err, html) {
    t.ok(!err);
    t.ok(html.match(/<div/));
    t.ok(html.match(/<a href/));
    t.end();
  });
});

tape('summarise bad url', function (t) {
  summary('ws://blah.blah', function (err, html) {
    t.ok(err);
    t.end();
  });
});
