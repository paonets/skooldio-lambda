var detectFaces = require('./detectFaces');

var resultPromise = detectFaces('skooldio-face-image-1564388793', 'A1.jpg')
resultPromise.then(function(data) {
  console.log(data)
}, function(err) {
  console.log(err);
})