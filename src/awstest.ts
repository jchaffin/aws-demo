import * as s3api from './s3api';

const defaultBucket = 'aws-s3-demo-default-bucket';

// listBuckets().then(data => console.log(data)).catch(err => console.log(err));
async function listObjectKeys() {
  const objects = await s3api.listObjects(defaultBucket);
  if (objects) {
    return objects.map(object => object.Key);
  }
}


listObjectKeys().then(console.log);


s3api.downloadResource(defaultBucket, 'test/unix-ref.pdf').then(console.log);
