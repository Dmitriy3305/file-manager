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

const handleCommandCompletion = (error) => {
  if (error) {
    console.error(`Operation failed: ${error.message}`);
  }
  printCurrentDirectory();
  rl.prompt();
};

const runCommand = (command) => {
  const [cmd, ...args] = command.trim().split(" ");
  switch (cmd) {
    case ".exit":
      process.exit();
      break;
    case "up":
      app.up();
      handleCommandCompletion();
      break;
    case "cd":
      if (args.length > 0) {
        app.cd(args.join(" "), handleCommandCompletion);
      } else {
        handleCommandCompletion(
          new Error('No path specified for "cd" command')
        );
      }
      break;
    case "ls":
      app.ls(handleCommandCompletion);
      break;
    case "cat":
      if (args.length > 0) {
        app.cat(args[0], () => {
          console.log("");
          handleCommandCompletion();
        });
      } else {
        handleCommandCompletion(
          new Error('No file specified for "cat" command')
        );
      }
      break;
    case "add":
      if (args.length > 0) {
        app.add(args[0], handleCommandCompletion);
      } else {
        handleCommandCompletion(
          new Error('No filename specified for "add" command')
        );
      }
      break;
    case "rn":
      if (args.length >= 2) {
        app.rn(args[0], args[1], handleCommandCompletion);
      } else {
        handleCommandCompletion(
          new Error(
            'The "rn" command requires two arguments: the old name and the new name'
          )
        );
      }
      break;
    case "cp":
      if (args.length >= 2) {
        app.cp(args[0], args[1], handleCommandCompletion);
      } else {
        handleCommandCompletion(
          new Error(
            'The "cp" command requires two arguments: path to file and path to new directory'
          )
        );
      }
      break;
    default:
      console.error("Invalid input");
      handleCommandCompletion();
      break;
  }
};

rl.on("line", (line) => {
  runCommand(line);
}).on("close", () => {
  process.exit();
});

printCurrentDirectory();
rl.prompt();
