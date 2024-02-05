import path from "path";
import { createBrotliCompress } from "zlib";
import { createReadStream, createWriteStream } from "fs";

export function getCompress(currentDirectory, srcPath, destPath, callback) {
  let sourceFullPath = path.resolve(currentDirectory, srcPath);
  const destFileName = "output-compressed";
  let destFullPath = path.resolve(currentDirectory, destPath, destFileName);
  const readStream = createReadStream(sourceFullPath);
  const writeStream = createWriteStream(destFullPath);
  const brotli = createBrotliCompress();
  readStream.pipe(brotli).pipe(writeStream);
  readStream.on("end", () => {
    callback(null);
  });
}
