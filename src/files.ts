import * as fs from 'fs';
import * as path from 'path';
import { Duplex } from 'stream';
import { promisify } from 'util';

const stat = promisify(fs.stat);

function resolvePath(...pathSegments : string[] ) { 
  const filePath = path.join(...pathSegments);
  return path.isAbsolute(filePath) ? 
        filePath : 
        path.resolve(process.cwd(), filePath);
}

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

// function bufferToStream(buffer : Buffer) {
//   const stream = new Duplex();
//   stream.push(buffer);
//   stream.push(null);
//   return stream;
// }


async function handleDirectory(dirpath: string) {
  let fullpath;
  try {
    fullpath = await promisify(fs.realpath)(dirpath);
    return fullpath;
  } catch (err) {
    fullpath = await err.path;
    await promisify(fs.mkdir)(fullpath);
    return handleDirectory(fullpath);
  }
}


async function fileToStream(filePath : string)  {
  let fstream;
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      fstream = await fs.createReadStream(filePath);
      // tslint:disable-next-line:no-console
      fstream.on('error', (err) => console.error(`Error creating ReadStream: ${err}`));
      return fstream;
    } else {
      try {
        await handleDirectory(path.dirname(filePath));
        fstream.on('error', (err) => console.error(`Error creating ReadStream: ${err}`));
      } catch (err) {
        throw new FileError(filePath, stats); 
      }
    }
  } catch (err) {
    /* propogate error */
    throw err;
  }
}

async function bufferToFile(buf : Buffer, outFile: string) {
  try {
    const fPath = resolvePath(outFile);
    const dirPath = fPath.slice(-1) === '/' ?
                    await handleDirectory(outFile) :
                    await handleDirectory(path.dirname(outFile));
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

export { 
  bufferToFile,   
  fileToStream,
  handleDirectory,
  resolvePath
}
  

  
  


