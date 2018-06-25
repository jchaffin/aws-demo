# AWS S3 CLI demo

CLI wrapper for AWS S3 using the JavaScript [SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html).


```js
// Install
git clone https://github.com/jchaffin/aws-demo.git
cd aws-demo
npm install
// Build
npm run build
// Link Executable
npm link
// Run
aws-demo -c CONFIG upload/download BUCKET FILE
```

Where `CONFIG` is a file path containing the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables. This option is only necessary if these variables are not set prior to runtime. Defaults to `.env`.

`BUCKET` is the S3 bucket ID and `FILE` is the file to be uploaded/downloaded.

  




   








