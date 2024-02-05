import os from "os";

export function osInfo(option) {
  switch (option) {
    case "--EOL":
      console.log(JSON.stringify(os.EOL));
      break;
    case "--cpus":
      os.cpus().forEach((cpu, index) => {
        console.log(`CPU ${index + 1}: ${cpu.model} - ${cpu.speed}MHz`);
      });
      break;
    case "--homedir":
      console.log(os.homedir());
      break;
    case "--username":
      console.log(os.userInfo().username);
      break;
    case "--architecture":
      console.log(os.arch());
      break;
    default:
      console.log("Unknown option");
  }
}
