const express = require('express');
const Busboy = require('busboy');
const AWS = require("aws-sdk");
require('dotenv').config();

const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const region = process.env.AWS_REGION;

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
});

const app = express();
const port = 4000;

app.post('/uploader/do', (req, res) => {
    try {
        const busboy = Busboy({ headers: req.headers });
        busboy.on("file", (name, file, info) => {
          const s3 = new AWS.S3();
          const params = {
            Bucket: bucketName,
            Key: info.filename,
            Body: file,
          };
          s3.upload(params, (err, data) => {
            if (err) {
              console.error(err);
              res.status(500).send(err);
            } else {
              return res.status(200).json(data);
            }
          });
        });
        req.pipe(busboy);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});