import * as AWS from 'aws-sdk';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import {bufferToFile, fileToStream, resolvePath} from './files';


config();

const accessKeyId : string = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey : string = process.env.AWS_SECRET_ACCESS_KEY || "";

const cred = new AWS.Credentials({
  accessKeyId,
  secretAccessKey
})

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

if (cred.accessKeyId === "" || cred.secretAccessKey === "") {
  console.log(`Access Key ID: ${cred.accessKeyId}`); 
  console.log(`Secret Access Key: ${cred.secretAccessKey}`); 
  throw new Error("Access keys not found!");
}

// Upload a file to an AWS S3 Bucket.
// Another option would be to use the `s3.putObject' method
// `s3.upload' allows an arbitraily size  buffer, blob or stream
// Additionally, uses concurrent handling of parts if the payload
// is necessarily large.
async function uploadResource(bucket: string, inFile: string) {
  const bucketKey = path.basename(inFile);
  try {
    const body = await fileToStream(inFile);
    const uploadParams = {Bucket: bucket, Key: bucketKey, Body: body};
    const data: AWS.S3.ManagedUpload.SendData =
        await s3.upload(uploadParams).promise();
    // tslint:disable-next-line:no-console
    console.log(`Uploaded ${bucketKey} to ${data.Location}`);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(`Error: ${err}`);
  }
}

async function downloadResource(bucket: string, bucketKey: string, outDir?: string) {
  try {
    const downloadParams:
        AWS.S3.GetObjectRequest = {Bucket: bucket, Key: bucketKey};
    const data: AWS.S3.GetObjectOutput =
        await s3.getObject(downloadParams).promise();
    if (data.Body instanceof Buffer) {
      const outPath = outDir ? resolvePath(outDir, bucketKey) : resolvePath(bucketKey);

      const wstream: fs.WriteStream = await bufferToFile(data.Body, outPath);
      // tslint:disable-next-line:no-console
       console.log(`Resource ${bucketKey} written to ${wstream.path}`);
       console.log(`File Size: ${data.ContentLength}`);

    } else {
      throw new Error(
          `Expected response of type Buffer. Got ${typeof data.Body}`);
    }
  } catch (err) {
    if (err.stack) {
      console.error(err, err.stack);
    } else {
      console.error(err);
    }
  }
}

async function listBuckets() {
  try {
    const params = {};
    const buckets: AWS.S3.ListBucketsOutput = await s3.listBuckets().promise();
    return buckets;
  } catch (err) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(err);
    }
  }
}


async function listObjects(bucket : string ) {

  try {
    const params = { Bucket: bucket };
    const objects: AWS.S3.ListObjectsOutput = await s3.listObjects(params).promise();
    return objects.Contents;
  } catch (err) {
    if (err.stack) {
      console.log(err, err.stack);
    } else {
      console.log(err);
    }
  }
}



export {uploadResource, downloadResource, listBuckets, listObjects};
