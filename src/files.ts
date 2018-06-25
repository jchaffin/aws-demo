import * as fs from 'fs';
import * as path from 'path';
import { Duplex } from 'stream';
import { promisify } from 'util';


const stat = promisify(fs.stat);
const fsPromises = fs.promises;
// const readFile = fsPromises.readFile;

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

function buffertoStream(buffer : Buffer) {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

async function fileToStream(filePath : string)  {
  const resolvePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  try {
    const stats = await stat(resolvePath);
    if (stats.isFile()) {
      const fstream = await fs.createReadStream(filePath);
      return fstream;
    } else {
      throw new FileError(filePath, stats); 
    }
  } catch (err) {
    throw err;
  }
}

export { fileToStream };


