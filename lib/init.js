/*
 * @Desc:
 * @Author: JacksonZhou
 * @Date: 2022/03/19
 * @LastEditTime: 2022/05/02
 */
const fse = require("fs-extra");
const ora = require("ora");
const chalk = require("chalk");
const inquirer = require("inquirer");
const symbols = require("log-symbols");
const handlebars = require("handlebars");
const path = require("path");

const dlTemplate = require("./download");
const tplPath = path.resolve(__dirname, "../template");

async function initProject(projectName) {
  try {
    const processPath = process.cwd();
    // 项目完整路径
    const targetPath = `${processPath}/${projectName}`;
    const exists = await fse.pathExists(targetPath);
    if (exists) {
      console.log(symbols.error, chalk.red("The project is exists."));
      return;
    }

    const promptList = [
      {
        type: "list",
        name: "type",
        message: "选择项目模板",
        default: "react",
        choices: ["react", "vue", "vite-vue", "koa"],
      },
    ];

    // 选择模板
    inquirer.prompt(promptList).then(async (answers) => {
      // 根据配置拉取指定项目
      await dlTemplate(answers);
      // 等待复制好模板文件到对应路径去，模板文件在 ./template 下
      try {
        await fse.copy(tplPath, targetPath);
        console.log("copy success");
      } catch (err) {
        console.log(symbols.error, chalk.red(`Copy template failed. ${err}`));
        process.exit();
      }
    });
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

module.exports = initProject;
