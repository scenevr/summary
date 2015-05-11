var tape = require('tape');
var summary = require('./index');

tape('summarise', function (t) {
  summary('ws://home.scenevr.hosting/home.xml', function (err, html) {
    t.same(err, null);
    t.ok(html.match(/<div/));
    t.end();
  });
});

tape('summarise samples', function (t) {
  summary('ws://scenevr-demo.herokuapp.com/gallery.xml', function (err, html) {
    t.same(err, null);
    t.ok(html.match(/<a href=".scenevr-demo.herokuapp.com.+\.xml/));
    t.end();
  });
});

tape('summarise bad url', function (t) {
  summary('ws://blah.blah', function (err, html) {
    t.ok(err);
    t.end();
  });
});
