var express = require('express')
var bodyParser = require('body-parser')
var AWS = require('aws-sdk');

const rekognitionCollecitonID = 'skooldio'

var app = express()
// parse application/json
app.use(bodyParser.json())

//config for region
AWS.config.update({
	region: 'ap-southeast-1',
});
var rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'})


app.get('/face', function(req, res) {
  var s3bucket = req.query.s3bucket || process.env.S3_BUCKET
  var s3path = req.query.s3path

  console.log(`Searching faces by image s3://${s3bucket}/${s3path}`)
  var searchParams = {
    CollectionId: rekognitionCollecitonID,
    Image: {
      S3Object: {
        Bucket: s3bucket, 
        Name: s3path
      }
    }
  }
  rekognition.searchFacesByImage(searchParams, function(error, response) {
    if (error) {
      console.log(error, error.stack) // an error occurred
      res.status(500).json(error)
    } else {
      res.json(response)
    }
  })
})

app.post('/face', function(req, res) {
  var s3bucket = req.body.s3bucket || process.env.S3_BUCKET
  var s3path = req.body.s3path
  var name = req.body.name

  console.log(`Indexing follwing face image to collection: s3://${s3bucket}/${s3path}`)
  var indexParams = {
    CollectionId: rekognitionCollecitonID,
    ExternalImageId: name, 
    Image: {
      S3Object: {
        Bucket: s3bucket, 
        Name: s3path
      }
    }
  }
  rekognition.indexFaces(indexParams, function(error, response) {
    if (error) {
      console.log(error, error.stack) // an error occurred
      res.status(500).json(error)
    }
    else {
      res.json(response)
    }
  })
})


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
