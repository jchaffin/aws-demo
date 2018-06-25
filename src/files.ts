import * as fs from 'fs';
import * as path from 'path';
import { Duplex } from 'stream';
import { promisify } from 'util';

const stat = promisify(fs.stat);
const resolvePath = (filePath : string) => path.isAbsolute(filePath) ? path.resolve(process.cwd(), filePath) : filePath;

class FileError extends Error {
  public path: string;
  public stats: fs.Stats;
  constructor(fPath : string, stats : fs.Stats) {
    super(`${path.basename(fPath)} is not a regular file.`);
    this.path = fPath;
    this.name = 'FileError';
    this.stats = stats;
  }
} 

function bufferToStream(buffer : Buffer) {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

async function fileToStream(filePath : string)  {
  const fPath = resolvePath(filePath);
  try {
    const stats = await stat(fPath);
    if (stats.isFile()) {
      const fstream = await fs.createReadStream(fPath);
      // tslint:disable-next-line:no-console
      fstream.on('error', (err) => console.error(`Error creating ReadStream: ${err}`));
      return fstream;
    } else {
      throw new FileError(fPath, stats); 
    }
  } catch (err) {
    /* propogate error */
    throw err;
  }
}

async function bufferToFile(buf : Buffer, outFile: string) {
  try {
    const fPath = resolvePath(outFile);
    const wstream = await fs.createWriteStream(fPath);
    // tslint:disable-next-line:no-console
    wstream.write(buf);
    wstream.on('error', (err) => { throw err } );
    wstream.end();
    const stats = await stat(fPath);
    if (stats.isFile()) {
      return wstream;
    } else {
      throw new FileError(fPath, stats);
    } 
  } catch (err) {
    /* propogate error. */
    throw err;
  }
}

export { resolvePath, fileToStream, bufferToFile, bufferToStream };


