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
        break;
      case "up":
        app.up();
        currentDirectory = app.currentDirectory;
        printCurrentDirectory();
        rl.prompt();
        break;
      case "cd":
        if (args.length > 0) {
          app.cd(args.join(" "));
          currentDirectory = app.currentDirectory;
        } else {
          throw new Error('No path specified for "cd" command');
        }
        printCurrentDirectory();
        rl.prompt();
        break;
      case "ls":
        app.ls();
        printCurrentDirectory();
        rl.prompt();
        break;
      case "cat":
        app.cat(args[0], () => {
          console.log("");
          printCurrentDirectory();
          rl.prompt();
        });
        break;
      case "add":
        app.add(args[0]);
        printCurrentDirectory();
        rl.prompt();
        break;
      case "rn":
        app.rn(args[0], args[1]);
        printCurrentDirectory();
        rl.prompt();
        break;
      default:
        console.error("Invalid input");
        printCurrentDirectory();
        rl.prompt();
        break;
    }
  } catch (error) {
    console.error("Operation failed:", error.message);
    printCurrentDirectory();
    rl.prompt();
  }
};

rl.on("line", (line) => {
  runCommand(line);
}).on("close", () => {
  process.exit();
});

printCurrentDirectory();
rl.prompt();
