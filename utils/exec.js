const { resolve, join } = require("path");
const { execSync } = require("child_process");
const which = require("which");

const path = [
  process.cwd(),
  resolve(__dirname, "..")
].map(
  dir => join(dir, "node_modules", ".bin")
).join(":");

module.exports = (command, env) => {
  const [name, ...args] = command.split(" ");
  const commandPath = which.sync(name, { path });
  command = [commandPath, ...args].join(" ");

  env = Object.assign({}, process.env, env);

  return execSync(command, { stdio: "inherit", env });
}
