#!/usr/bin/env node

const program = require("commander");
const chalk = require("chalk");
const updateChk = require("../lib/update");
const initProject = require("../lib/init");

// 获取版本号
program.version(require("../package.json").version, "-v, --version");

// 检查更新
program
  .command("upgrade")
  .description("Check the jupiter version.")
  .action(() => {
    updateChk();
  });

program.on("--help", () => {
  console.log(
    `\r\nRun ${chalk.cyan(
      `zr <command> --help`
    )} for detailed usage of given command\r\n`
  );
});

// init 初始化项目
program
  .name("jupiter")
  .usage("<commands> [options]")
  .command("init <project_name>")
  .description("create a new project.")
  .action((project) => {
    initProject(project);
  });

program.parse(process.argv);
