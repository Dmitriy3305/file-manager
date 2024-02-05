import path from "path";
import { createBrotliDecompress } from "zlib";
import { createReadStream, createWriteStream } from "fs";

export function decompressFile(currentDirectory, srcPath, destPath, callback) {
  const sourceFullPath = path.resolve(currentDirectory, srcPath);
  const baseName = path.basename(srcPath);
  const decompressedFileName = baseName.endsWith(".br")
    ? baseName.slice(0, -3)
    : baseName;
  const destFullPath = path.resolve(
    currentDirectory,
    destPath,
    decompressedFileName
  );

  const readStream = createReadStream(sourceFullPath);
  const writeStream = createWriteStream(destFullPath);
  const brotli = createBrotliDecompress();

  readStream
    .pipe(brotli)
    .pipe(writeStream)
    .on("finish", () => {
      callback(null);
    })
    .on("error", callback);
}
