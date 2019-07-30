
'use strict';

console.log('Loading function');

var detectFaces = require('./detectFaces');

exports.handler = async (event, context) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  return detectFaces(bucket, key)
};