import path from "path";
import fs from "fs";
import { createReadStream, createWriteStream } from "fs";

export function up(currentDirectory) {
  return path.dirname(currentDirectory);
}

export function cd(currentDirectory, newPath, callback) {
  const newPathAbsolute = path.resolve(currentDirectory, newPath);
  fs.stat(newPathAbsolute, (err, stats) => {
    if (err) {
      callback(err);
    } else if (stats.isDirectory()) {
      callback(null, newPathAbsolute);
    } else {
      callback(new Error("Directory does not exist"));
    }
  });
}

export function ls(callback) {
  fs.readdir(
    this.currentDirectory,
    { withFileTypes: true },
    (err, filesAndDirectorys) => {
      if (err) {
        callback(err);
        return;
      }

      const results = filesAndDirectorys.map((dirent) => ({
        Name: dirent.name,
        Type: dirent.isFile() ? "file" : "directory",
      }));

      results.sort((a, b) => {
        if (a.Type === b.Type) {
          return a.Name.localeCompare(b.Name);
        }
        return a.Type === "directory" ? -1 : 1;
      });

      console.table(results);
      callback(null, results);
    }
  );
}

export function cat(currentDirectory, filePath, callback) {
  const fullFilePath = path.resolve(currentDirectory, filePath);
  currentDirectory = path.dirname(fullFilePath);
  fs.stat(fullFilePath, (err, stats) => {
    if (err || !stats.isFile()) {
      callback(new Error("File does not exist"));
      return;
    }

    const stream = createReadStream(fullFilePath);
    stream.pipe(process.stdout);
    stream.on("end", callback);
    stream.on("error", (streamErr) => {
      console.error(`Error reading file: ${streamErr.message}`);
      callback(streamErr);
    });
  });
}

export function add(currentDirectory, filename, callback) {
  const fullPath = path.join(currentDirectory, filename);
  fs.open(fullPath, "w", (err, fd) => {
    if (err) {
      callback(err);
      return;
    }

    fs.close(fd, (closeErr) => {
      if (closeErr) {
        callback(closeErr);
        return;
      }
      callback(null);
    });
  });
}

export function rn(currentDirectory, oldName, newName, callback) {
  currentDirectory = path.dirname(oldName);
  const oldPath = path.resolve(currentDirectory, oldName);
  const newPath = path.resolve(currentDirectory, newName);

  fs.rename(oldPath, newPath, callback);
}

export function cp(currentDirectory, srcPath, destDir, callback) {
  currentDirectory = path.dirname(srcPath);
  let sourceFullPath = path.resolve(currentDirectory, srcPath);
  let destFullPath = path.resolve(destDir, path.basename(srcPath));
  const readStream = createReadStream(sourceFullPath);
  const writeStream = createWriteStream(destFullPath);
  currentDirectory = destDir;
  readStream.pipe(writeStream);
  callback(null);
}

export function mv(currentDirectory, srcPath, destDir, callback) {
  currentDirectory = path.dirname(srcPath);
  let sourceFullPath = path.resolve(currentDirectory, srcPath);
  let destFullPath = path.resolve(destDir, path.basename(srcPath));
  const readStream = createReadStream(sourceFullPath);
  const writeStream = createWriteStream(destFullPath);
  currentDirectory = destDir;
  writeStream.on("finish", () => {
    fs.unlink(sourceFullPath, (err) => {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  });
  readStream.pipe(writeStream);
}

export function rm(currentDirectory, filePath, callback) {
  let fullPath = path.resolve(currentDirectory, filePath);
  fs.unlink(fullPath, callback);
}
