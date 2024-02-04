import path from "path";
import fs from "fs";
import { createReadStream } from "fs";

export class App {
  constructor(currentDirectory) {
    this.currentDirectory = currentDirectory;
  }
  up() {
    this.currentDirectory = path.dirname(this.currentDirectory);
    console.log(this.currentDirectory);
    return this.currentDirectory;
  }
  cd(newPath) {
    let newPathAbsolute = path.resolve(this.currentDirectory, newPath);
    if (
      fs.existsSync(newPathAbsolute) &&
      fs.statSync(newPathAbsolute).isDirectory()
    ) {
      this.currentDirectory = newPathAbsolute;
      return this.currentDirectory;
    } else {
      throw new Error("Directory does not exist");
    }
  }
  ls() {
    let filesAndDirectorys = fs.readdirSync(this.currentDirectory);
    filesAndDirectorys.sort();
    let filesAndDirectorysData = filesAndDirectorys.map((name) => {
      let fullPath = path.join(this.currentDirectory, name);
      let stats = fs.statSync(fullPath);
      return {
        Name: name,
        Type: stats.isFile() ? "file" : "directory",
      };
    });

    console.table(filesAndDirectorysData);
  }
  cat(filePath, callback) {
    const fullFilePath = path.resolve(this.currentDirectory, filePath);
    if (fs.existsSync(fullFilePath) && fs.statSync(fullFilePath).isFile()) {
      const stream = createReadStream(fullFilePath);
      stream.on("data", (chunk) => {
        process.stdout.write(chunk);
      });
      this.currentDirectory = path.dirname(fullFilePath);
      stream.on("end", () => {
        callback();
      });
      stream.on("error", (err) => {
        console.error(`Error reading file: ${err.message}`);
        callback();
      });
    } else {
      throw new Error("File does not exist");
    }
  }
  add(filename) {
    let fullPath = path.join(this.currentDirectory, filename);
    fs.closeSync(fs.openSync(fullPath, "w"));
  }
}
