var AWS = require('aws-sdk');

//config for region
AWS.config.update({
	region: 'ap-southeast-1',
});
var rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'})
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

const detectFaces = (s3bucket, s3path) => {
  console.log(`Detecting face by image s3://${s3bucket}/${s3path}`)
  return new Promise((resolve, reject) => {
    var detectParams = {
      Attributes: ['ALL'],
      Image: {
        S3Object: {
          Bucket: s3bucket, 
          Name: s3path
        }
      }
    }
    // Call detectFaces
    rekognition.detectFaces(detectParams, function(error, response) {
      if (error) {
        console.log(error, error.stack) // an error occurred
        reject(error)
      } else {
        var metadatPath = s3path + '.metadata.json'
        console.log(`Uploading result to s3://${s3bucket}/${metadatPath}`)
        var params = {
          Body: JSON.stringify(response, null, 2),
          Bucket: s3bucket,
          Key: metadatPath,
        };
        // Put result in the same S3 bucket
        s3.putObject(params, function(error, data) {
          if (error) {
            console.log(error, error.stack); // an error occurred
            reject(error)
          } else {
            console.log('Upload succeeded'); // an error occurred
            resolve(data)
          }
        });
      }
    })
  })
}

module.exports = detectFaces