const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");


export default function uploadFileToS3(fileContent, fileName) {
  return new Promise( async  (resolve, reject) => {

    const s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.THO_S3_ACCESS_KEY,
        secretAccessKey: process.env.THO_S3_ACCESS_SECRET,
      },
      apiVersion: 'latest',
      region: 'us-east-1'
    });   

    const BUCKET_NAME = 'shared-sunday';

    const putCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ACL: 'public-read',
    })


    const data = await s3.send(putCommand).catch(err => {
      console.log('Error', err);
      reject(err);

      return;
    }) 

    data.Location = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`
    resolve(data);
    console.log(`File uploaded successfully. ${data.Location}`);
    
  })
}