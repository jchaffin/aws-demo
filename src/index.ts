import * as AWS from 'aws-sdk';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { fileToStream } from './files';

const testFile = 'data/file.txt';

const s3 = new AWS.S3({
  apiVersion: '2006-03-01'
});

const bucketID = 's3-demo-bucket-00';
const defaultParams = { Bucket: bucketID };

function s3upload(params : { Bucket: string }, file : string) {
  const bucketKey = path.basename(testFile);
  // tslint:disable-next-line:no-console
  const fstream = fs.createReadStream(testFile).on('error', (err) => console.log(`Error: ${err}`)) ;
  const body = fstream;
  const uploadParams = {...params, Key: bucketKey, Body: body};
  return s3.upload(uploadParams, (err : Error, data : AWS.S3.ManagedUpload.SendData) => {
    if (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
    } else {
      // tslint:disable-next-line:no-console
      console.log(data.Location);
    }
  });
}

async function uploadFile(params : {Bucket: string}, file : string ) {
  const bucketKey = path.basename(testFile);
  try {
    const body = await fileToStream(file);
    const uploadParams = {...params, Key: bucketKey, Body: body};
    const data = await upload(uploadParams);
    // tslint:disable-next-line:no-console
    console.log(`Uploaded ${bucketKey} to ${data.Location}`);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(`Error: ${err}`);
  }
}

s3upload(defaultParams, testFile);













