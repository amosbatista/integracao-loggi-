const AWS = require('aws-sdk');


export default function uploadFileToS3(fileContent, fileName) {
  return new Promise( async (resolve, reject) => {

    const s3 = new AWS.S3({
      accessKeyId: process.env.THO_S3_ACCESS_KEY,
      secretAccessKey: process.env.THO_S3_ACCESS_SECRET,
      apiVersion: 'latest'
    });   

    const BUCKET_NAME = 'shared-sunday';

    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ACL: 'public-read',
    };

    try {
      const data = await s3.upload(params).promise();

      resolve(data);
      console.log(`File uploaded successfully. ${data.Location}`);
    } catch (err) {
      console.log('Error', err);
      reject(err);
    }
  })
}