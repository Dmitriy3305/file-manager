import path from "path";
import fs from "fs";
import { createReadStream, createWriteStream } from "fs";

export class App {
  constructor(currentDirectory) {
    this.currentDirectory = currentDirectory;
  }

  up() {
    this.currentDirectory = path.dirname(this.currentDirectory);
    console.log(this.currentDirectory);
  }

  cd(newPath, callback) {
    const newPathAbsolute = path.resolve(this.currentDirectory, newPath);
    fs.stat(newPathAbsolute, (err, stats) => {
      if (err) {
        callback(err);
      } else if (stats.isDirectory()) {
        this.currentDirectory = newPathAbsolute;
        callback(null, this.currentDirectory);
      } else {
        callback(new Error("Directory does not exist"));
      }
    });
  }

  ls(callback) {
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

  cat(filePath, callback) {
    const fullFilePath = path.resolve(this.currentDirectory, filePath);
    this.currentDirectory = path.dirname(fullFilePath);
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

  add(filename, callback) {
    const fullPath = path.join(this.currentDirectory, filename);
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

  rn(oldName, newName, callback) {
    this.currentDirectory = path.dirname(oldName);
    const oldPath = path.resolve(this.currentDirectory, oldName);
    const newPath = path.resolve(this.currentDirectory, newName);

    fs.rename(oldPath, newPath, callback);
  }

  cp(srcPath, destDir, callback) {
    this.currentDirectory = path.dirname(srcPath);
    let sourceFullPath = path.resolve(this.currentDirectory, srcPath);
    let destFullPath = path.resolve(destDir, path.basename(srcPath));
    const readStream = createReadStream(sourceFullPath);
    const writeStream = createWriteStream(destFullPath);
    this.currentDirectory = destDir;
    readStream.pipe(writeStream);
    callback(null);
  }
}
