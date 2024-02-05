import path from "path";
import { createBrotliCompress } from "zlib";
import { createReadStream, createWriteStream } from "fs";

export function compressFile(currentDirectory, srcPath, destPath, callback) {
  const sourceFullPath = path.resolve(currentDirectory, srcPath);
  const baseName = path.basename(srcPath);
  const compressedFileName = `${baseName}.br`;
  const destFullPath = path.resolve(
    currentDirectory,
    destPath,
    compressedFileName
  );

  const readStream = createReadStream(sourceFullPath);
  const writeStream = createWriteStream(destFullPath);
  const brotli = createBrotliCompress();

  readStream
    .pipe(brotli)
    .pipe(writeStream)
    .on("finish", () => {
      callback(null);
    })
    .on("error", callback);
}
