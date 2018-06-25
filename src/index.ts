import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { fileToStream } from './files';


const s3 = new AWS.S3({
  apiVersion: '2006-03-01'
});

const bucketID = 's3-demo-bucket-00';
const defaultParams = { Bucket: bucketID };

 
async function uploadFile(params : {Bucket: string}, file : string ) {
  const bucketKey = path.basename(file);
  try {
    const body = await fileToStream(file);
    const uploadParams = {...params, Key: bucketKey, Body: body};
    const data : AWS.S3.ManagedUpload.SendData = await s3.upload(uploadParams).promise();
    // tslint:disable-next-line:no-console
     console.log(`Uploaded ${bucketKey} to ${data.Location}`);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(`Error: ${err}`);
  }
}

const testFile = 'data/file.txt';
uploadFile(defaultParams, testFile);



// function s3upload(fstream: fs.ReadStream, params : { Bucket: string }, file : string) {
//   const bucketKey = path.basename(file);
//   // tslint:disable-next-line:no-console
//   // const fstream = fs.createReadStream(testFile).on('error', (err) => console.log(`Error: ${err}`)) ;
//   const body = fstream;
//   const uploadParams = {...params, Key: bucketKey, Body: body};
//   return s3.upload(uploadParams, (err : Error, data : AWS.S3.ManagedUpload.SendData) => {
//     if (err) {
//       // tslint:disable-next-line:no-console
//       console.log(err);
//     } else {
//       // tslint:disable-next-line:no-console
//       console.log(data.Location);
//     }
//   });
// }

// fileToStream('data/file.txt').then(stream => uploadFile(stream)).catch(console.error);













