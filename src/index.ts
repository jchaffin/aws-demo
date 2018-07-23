import * as program from 'commander';
import { readdir } from 'fs';
import * as omelette from 'omelette';
import { promisify } from 'util';
import { downloadResource, listBuckets, listObjects, uploadResource } from './s3api';


function CLI()  {
  program.version('0.1.0');

  // tslint:disable-next-line:no-console
  program
  .option('--setup', 'Setup shell completion.')
  
  program
    .command('upload <bucket> <file>')
    .description("Upload FILE to BUCKET")
    .action((bucket, file) => uploadResource(bucket, file));
  
  program
    .command('download <bucket> <key>')
    .option('-d, --dir <path>', 'Output directory')    
    .description("Download resource with KEY from BUCKET")
    .action((bucket, key, cmd) => {
      if (cmd.dir) {
        downloadResource(bucket, key, cmd.dir);
      } else {
        downloadResource(bucket, key);
      }
    })
  
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }

  program.parse(process.argv);
}

const completion = omelette(`s3-demo <action> <bucket> <file>`);

completion.on( 'action', ({ reply }) => {
  reply(['upload', 'download']);
});

completion.onAsync('bucket', async ({ reply }) => {
    const response = await listBuckets();
    reply(new Promise((resolve) => {
      if (response) {
        const buckets = response.Buckets;
        if (buckets) {
          resolve(buckets.map(bucket => bucket.Name));
        }
      }
    })
  );
});

completion.onAsync('file', async ({line, before, reply }) => {
  line.includes('upload') ? 
  reply(await promisify(readdir)('.')) :
  reply(await listObjects(before).then(
    objects => objects ? objects
     .map(o => o.Key ? o.Key.replace(' ', '\ ').toString() : "")
    .filter(key => key.slice(-1) !== '/') : ""
  ));
})

// tslint:disable-next-line:no-bitwise
if (~process.argv.indexOf('--setup')) {
  completion.setupShellInitFile()
}

completion.next(() => {
  CLI();
});

completion.init();


