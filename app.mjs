import path from "path";

export class App {
  constructor(currentDirectory) {
    this.currentDirectory = currentDirectory;
  }
  up() {
    this.currentDirectory = path.dirname(this.currentDirectory);
    console.log(this.currentDirectory);
    return this.currentDirectory;
  }
}
