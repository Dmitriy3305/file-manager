import os from "os";
import { App } from "./src/app.mjs";
import readline from "readline";
import errors from "./src/utils/const/errors.mjs";

const homeDirectory = os.homedir();
let currentDirectory = homeDirectory;
const args = process.argv.slice(2);
const usernameArg = args.find((arg) => arg.startsWith("--username="));

if (!usernameArg) {
  console.error(`Operation failed: ${errors.USERNAME_REQUIRED}`);
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
    case "up":
      app.up();
      handleCommandCompletion();
      break;
    case "cd":
      if (args.length > 0) {
        app.cd(args.join(" "), handleCommandCompletion);
      } else {
        handleCommandCompletion(new Error(errors.PATH_REQUIRED_FOR_CD));
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
        handleCommandCompletion(new Error(errors.FILE_REQUIRED_FOR_CAT));
      }
      break;
    case "add":
      if (args.length > 0) {
        app.add(args[0], handleCommandCompletion);
      } else {
        handleCommandCompletion(new Error(errors.FILENAME_REQUIRED_FOR_ADD));
      }
      break;
    case "rn":
      if (args.length >= 2) {
        app.rn(args[0], args[1], handleCommandCompletion);
      } else {
        handleCommandCompletion(
          new Error(errors.TWO_ARGUMENTS_REQUIRED_FOR_RN)
        );
      }
      break;
    case "cp":
      if (args.length >= 2) {
        app.cp(args[0], args[1], handleCommandCompletion);
      } else {
        handleCommandCompletion(
          new Error(errors.TWO_ARGUMENTS_REQUIRED_FOR_CP)
        );
      }
    case "mv":
      if (args.length >= 2) {
        app.mv(args[0], args[1], handleCommandCompletion);
      } else {
        handleCommandCompletion(
          new Error(errors.TWO_ARGUMENTS_REQUIRED_FOR_MV)
        );
      }
      break;
    case "rm":
      if (args.length) {
        app.rm(args[0], handleCommandCompletion);
      } else {
        handleCommandCompletion(new Error(errors.PATH_REQUIRED_FOR_RM));
      }
      break;
    case "os":
      if (args.length === 0) {
        console.error("No option provided for 'os' command");
        handleCommandCompletion(new Error(errors.OPTION_REQUIRED_FOR_OS));
        return;
      }
      app.osInfo(args.join(" "));
      handleCommandCompletion();
      break;
    case "hash":
      if (args.length < 1) {
        handleCommandCompletion(new Error(errors.PATH_REQUIRED_FOR_HASH));
      }
      app.hash(args[0], handleCommandCompletion);
      break;
    case "compress":
      if (args.length < 2) {
        handleCommandCompletion(
          new Error(errors.TWO_ARGUMENTS_REQUIRED_FOR_COMPRESS)
        );
      }
      app.compress(args[0], args[1], handleCommandCompletion);
      break;
    case "decompress":
      if (args.length < 2) {
        handleCommandCompletion(
          new Error(errors.TWO_ARGUMENTS_REQUIRED_FOR_DECOMPRESS)
        );
      }
      app.decompress(args[0], args[1], handleCommandCompletion);
      break;
    default:
      handleCommandCompletion(new Error(errors.INVALID_INPUT));
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
