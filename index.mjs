import os from "os";

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

const printCurrentDirectory = () => {
  console.log(`You are currently in ${currentDirectory}`);
};
