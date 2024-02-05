import * as fsOperations from "./fs/fsOperations.mjs";
import * as osOperations from "./os/osOperation.mjs";

export class App {
  constructor(currentDirectory) {
    this.currentDirectory = currentDirectory;
  }

  up() {
    this.currentDirectory = fsOperations.up(this.currentDirectory);
    console.log(this.currentDirectory);
  }

  cd(newPath, callback) {
    fsOperations.cd(this.currentDirectory, newPath, (err, newPathAbsolute) => {
      if (!err) {
        this.currentDirectory = newPathAbsolute;
      }
      callback(err, this.currentDirectory);
    });
  }

  ls(callback) {
    fsOperations.ls(this.currentDirectory, callback);
  }

  cat(filePath, callback) {
    fsOperations.cat(this.currentDirectory, filePath, callback);
  }

  add(filename, callback) {
    fsOperations.add(this.currentDirectory, filename, callback);
  }

  rn(oldName, newName, callback) {
    fsOperations.rn(this.currentDirectory, oldName, newName, callback);
  }

  cp(srcPath, destDir, callback) {
    fsOperations.cp(this.currentDirectory, srcPath, destDir, callback);
  }

  mv(srcPath, destDir, callback) {
    fsOperations.mv(this.currentDirectory, srcPath, destDir, callback);
  }

  rm(filePath, callback) {
    fsOperations.rm(this.currentDirectory, filePath, callback);
  }
  osInfo(option) {
    osOperations.osInfo(option);
  }
}
