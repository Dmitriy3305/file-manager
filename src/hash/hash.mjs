import path from "path";
import { createHash } from 'crypto';
import { createReadStream } from 'fs';

export function getHash(currentDirectory, filePath, callback) {
    let fullPath = path.resolve(currentDirectory, filePath);
    const hash = createHash('sha256');
    const readStream = createReadStream(fullPath);
    readStream.on('data', chunk => {
      hash.update(chunk);
    });
    readStream.on('end', () => {
      console.log(hash.digest('hex'));
      callback(null)
    });
}