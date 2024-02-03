import path from "path";
import fs from "fs";

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
}
