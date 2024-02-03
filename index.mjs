import os from "os";
import { App } from "./app.mjs";
import readline from "readline";

const homeDirectory = os.homedir();
let currentDirectory = homeDirectory;
const args = process.argv.slice(2);
const usernameArg = args.find((arg) => arg.startsWith("--username="));

if (!usernameArg) {
  console.error("Please provide --username argument.");
  process.exit(1);
}

const username = usernameArg.split("=")[1];

console.log(`Welcome to the File Manager, ${username}!`);

const app = new App(currentDirectory);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Enter your command: ",
});

process.on("exit", () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
});

process.on("SIGINT", () => {
  process.exit();
});

const printCurrentDirectory = () => {
  console.log(`You are currently in ${app.currentDirectory}`);
};

const runCommand = (command) => {
  const [cmd, ...args] = command.trim().split(" ");
  try {
    switch (cmd) {
      case ".exit":
        process.exit();
      case "up":
        app.up();
        currentDirectory = app.currentDirectory;
        break;
      case "cd":
        if (args.length > 0) {
          app.cd(args.join(" "));
          currentDirectory = app.currentDirectory;
        } else {
          throw new Error('No path specified for "cd" command');
        }
        break;
      default:
        console.error("Invalid input");
        break;
    }
  } catch (error) {
    console.error("Operation failed:", error.message);
  }
};

rl.on("line", (line) => {
  runCommand(line);
  printCurrentDirectory();
  rl.prompt();
}).on("close", () => {
  process.exit();
});

printCurrentDirectory();
rl.prompt();
