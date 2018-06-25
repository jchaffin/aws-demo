import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import { bufferToFile, fileToStream } from './files';


const s3 = new AWS.S3({
  apiVersion: '2006-03-01'
});

const bucketID = 's3-demo-bucket-00';
const defaultParams = { Bucket: bucketID };

// Upload a file to an AWS S3 Bucket.  
// Another option would be to use the `s3.putObject' method
// `s3.upload' allows an arbitraily size  buffer, blob or stream
// Additionally, uses concurrent handling of parts if the payload
// is necessarily large.
async function uploadResource(bucket : string, inFile : string ) {
  const bucketKey = path.basename(inFile);
  try {
    const body = await fileToStream(inFile);
    const uploadParams = {Bucket: bucket, Key: bucketKey, Body: body};
    const data : AWS.S3.ManagedUpload.SendData = await s3.upload(uploadParams).promise();
    // tslint:disable-next-line:no-console
     console.log(`Uploaded ${bucketKey} to ${data.Location}`);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(`Error: ${err}`);
  }
}

async function downloadResource(bucket : string, outFile : string) {
  try {
    const bucketKey = path.basename(outFile);
    const downloadParams : AWS.S3.GetObjectRequest = {Bucket: bucket, Key: bucketKey};
    const data : AWS.S3.GetObjectOutput = await s3.getObject(downloadParams).promise();
    if (data.Body instanceof Buffer) {
      const wstream : fs.WriteStream = await bufferToFile(data.Body, outFile);
      // tslint:disable-next-line:no-console
      console.log(`Resource ${bucketKey} written to ${wstream.path}`);
      wstream.end();
    } else {
      throw new Error(`Expected response of type Buffer. Got ${typeof data.Body}`);
    }
  } catch (err) {
    if (err instanceof AWS.AWSError) {
      // tslint:disable-next-line:no-console
      console.log(err, err.stack);
    } else {
      // tslint:disable-next-line:no-console
      console.log(err);
    }
  }
}


export { uploadResource, downloadResource };;












