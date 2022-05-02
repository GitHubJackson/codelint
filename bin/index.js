#!/usr/bin/env node

const program = require("commander");
const chalk = require("chalk");
const updateChk = require("../lib/update");
const dlTemplate = require("../lib/download");
const initProject = require("../lib/init");

// 获取版本号
program.version(require("../package.json").version, "-v, --version");

// 检查更新
program
  .command("upgrade")
  .description("Check the js-pro-cli version.")
  .action(() => {
    updateChk();
  });

program
  // 监听 --help 执行
  .on("--help", () => {
    // 新增说明信息
    console.log(
      `\r\nRun ${chalk.cyan(
        `zr <command> --help`
      )} for detailed usage of given command\r\n`
    );
  });
// template 下载/更新模板
// program
//   .command("template")
//   .description("Download template.")
//   .action(() => {
//     dlTemplate();
//   });

// init 初始化项目
program
  .name("js-pro-cli")
  .usage("<commands> [options]")
  .command("init <project_name>")
  .description("Create a react project.")
  .action((project) => {
    initProject(project);
  });

program.parse(process.argv);
