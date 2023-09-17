const AWS = require('aws-sdk');

export default async function deleteFile(fileName) {
  const BUCKET_NAME = 'shared-sunday';

    const s3 = new AWS.S3();
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName
    };

    try {
        await s3.deleteObject(params).promise();
    } catch (error) {
        console.error(`Erro ao deletar o arquivo ${fileName}:`, error);
    }
}
