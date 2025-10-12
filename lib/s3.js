const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.S3_BUCKET;

async function putImage({ Key, Body, ContentType }) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key,
      Body,
      ContentType,
    })
  );
}

async function getPresignedGetUrl(Key, expiresIn = 300) {
  if (!Key) {
    Key = `menus/undefined.jpg`;
  }

  return await getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key }), {
    expiresIn,
  });
}

async function deleteObject(Key) {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key }));
}

module.exports = { s3, BUCKET, putImage, getPresignedGetUrl, deleteObject };
