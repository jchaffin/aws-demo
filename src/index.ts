import * as program from "commander"
import { config } from 'dotenv';
import { downloadResource, uploadResource } from './s3api';

program.version('0.1.0');

// tslint:disable-next-line:no-console
program
  .option('-c, --config <path>', 'path to AWS credentials file. Defaults to .env')
  .command('upload <bucket> <file>')
  .description("Upload FILE to BUCKET")
  .action((bucket, file) => uploadResource(bucket, file));

program
  .command('download <bucket> <file>')
  .description("Download FILE from BUCKET")
  .action((bucket, file) => downloadResource(bucket, file));

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);

if (program.config) {
  config({path: program.config})
} else {
  config();
}