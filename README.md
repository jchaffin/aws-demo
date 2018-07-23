# AWS S3 CLI demo

CLI wrapper for AWS S3 using the JavaScript [SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html).

## Install

```shell
// Install
git clone https://github.com/jchaffin/aws-demo.git
# aws-demo
npm install
# Build
npm run build
# Link Executable
npm link
s3-demo ---setup
# Source login file
# Run
s3-demo -c CONFIG upload/download BUCKET FILE
```

Where `CONFIG` is a file path containing the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables. This option is only necessary if these variables are not set prior to runtime. Defaults to `.env`.

`BUCKET` is the S3 bucket ID and `FILE` is the file to be uploaded/downloaded.

## Demo Instructions

After setup, the following commands should work:

If installed globally with `npm link`

```shell
s3-demo download aws-s3-demo-default-bucket download/wave.png
s3-demo upload aws-s3-demo-default-bucke data/file.txt
```

Else:

```shell
# if  `/usr/bin/env node` is interpreter:
alias s3-demo='./bin/cli.js'
# this might work..
alias s3-demo='node ./bin/cli.js'
...
```
