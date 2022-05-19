/*
 * @Desc:
 * @Author: JacksonZhou
 * @Date: 2022/03/19
 * @LastEditTime: 2022/05/15
 */
const fse = require("fs-extra");
const ora = require("ora");
const chalk = require("chalk");
const inquirer = require("inquirer");
const symbols = require("log-symbols");
const handlebars = require("handlebars");
const path = require("path");
const shell = require("shelljs");
const fs = require("fs");

const dlTemplate = require("./download");
const tplPath = path.resolve(__dirname, "../templates");

async function initProject() {
  try {
    const processPath = process.cwd();
    const packageJSONPath = processPath + "/package.json";
    const packageObj = require(packageJSONPath);
    // 项目完整路径
    // const targetPath = `${processPath}/${projectName}`;
    // 检测是否有 package.json
    const exists = await fse.pathExists(packageJSONPath);
    if (!exists) {
      console.log(
        symbols.error,
        chalk.red("The package.json is lost, you need run <npm init> first")
      );
      return;
    }

    const promptList = [
      {
        type: "list",
        name: "type",
        message: "选择项目类型",
        default: "react",
        choices: ["react", "vue"],
      },
      {
        type: "confirm",
        message: "是否使用 typescript？",
        name: "ts",
      },
      {
        type: "list",
        message: "选择包管理工具",
        name: "pkg",
        default: "yarn",
        choices: ["npm", "yarn"],
      },
    ];

    const fileList = [".eslintrc.js"];

    // 选择模板
    inquirer.prompt(promptList).then(async (answers) => {
      const { type, ts, pkg } = answers;
      // 1.将配置文件引入或覆盖
      try {
        await fse.copy(path.resolve(tplPath, type), processPath, {
          overwrite: true,
        });
        if (!ts) {
          await fse.remove(processPath + "/tsconfig.json");
        }
        await fse.copy(path.resolve(tplPath, "common"), processPath, {
          overwrite: true,
        });
        console.log("write done...");
        // 2.修改 package.json
        let newPackageObj = {
          scripts: {
            prepare: "husky install",
            eslint: "eslint --fix src/**/*.{js,ts,jsx,tsx}",
            stylelint: "stylelint --fix src/**/*.{css,less}",
            prettier: "prettier --write src/**/*.{js,ts,jsx,tsx,less,css}",
          },
          "lint-staged": {
            "src/**/*.{js,jsx,ts,tsx}": [
              "prettier --write",
              "eslint --cache --fix",
            ],
            "src/**/*.{less,css}": ["stylelint --fix"],
          },
        };
        if (ts) {
          if (type === "react") {
          } else if (type === "vue") {
            newPackageObj = {
              scripts: {
                prepare: "husky install",
                eslint: "eslint --fix src/**/*.{js,ts,vue}",
                prettier: "prettier --write src/**/*.{js,ts,vue}",
                stylelint: "stylelint --fix src/**/*.{vue,css,less}",
              },
              "lint-staged": {
                "src/**/*.{vue,js,ts}": [
                  "prettier --write",
                  "eslint --cache --fix",
                ],
                "src/**/*.{vue,css,less}": ["stylelint --fix"],
              },
            };
          }
        } else {
          if (type === "react") {
            newPackageObj = {
              scripts: {
                prepare: "husky install",
                eslint: "eslint --fix src/**/*.{js,jsx}",
                stylelint: "stylelint --fix src/**/*.{css,less}",
                prettier: "prettier --write src/**/*.{js,jsx,less,css}",
              },
              "lint-staged": {
                "src/**/*.{js,jsx}": [
                  "prettier --write",
                  "eslint --cache --fix",
                ],
                "src/**/*.{less,css}": ["stylelint --fix"],
              },
            };
          } else if (type === "vue") {
            newPackageObj = {
              scripts: {
                prepare: "husky install",
                eslint: "eslint --fix src/**/*.{js,vue}",
                prettier: "prettier --write src/**/*.{js,vue}",
                stylelint: "stylelint --fix src/**/*.{vue,css,less}",
              },
              "lint-staged": {
                "src/**/*.{vue,js}": [
                  "prettier --write",
                  "eslint --cache --fix",
                ],
                "src/**/*.{vue,css,less}": ["stylelint --fix"],
              },
            };
          }
        }
        await fse.writeJson(
          packageJSONPath,
          {
            ...packageObj,
            ...newPackageObj,
            scripts: {
              ...packageObj.scripts,
              ...newPackageObj.scripts,
            },
          },
          { spaces: 2 }
        );
        // 3.安装依赖
        shell.exec(
          `${pkg} ${
            pkg === "yarn" ? "add" : "install"
          } eslint@^8.10.0 stylelint@^14.5.3 lint-staged@^12.3.4 husky@^7.0.4 postcss-less@^6.0.0 prettier@^2.5.1 stylelint-config-standard@^25.0.0 @commitlint/cli@^16.2.1 @commitlint/config-conventional@^16.2.1 @typescript-eslint/eslint-plugin@^5.12.1 @typescript-eslint/parser@^5.12.1 -D`
        );
        if (type === "react") {
          shell.exec(
            `${pkg} ${
              pkg === "yarn" ? "add" : "install"
            } eslint-plugin-react@^7.29.2 -D`
          );
        } else if (type === "vue") {
          shell.exec(
            `${pkg} ${
              pkg === "yarn" ? "add" : "install"
            }  eslint-plugin-vue@^7.0.0 -D`
          );
        }
        shell.echo("install done...");
        // 4.增加 husky 文件
        const exists = await fse.pathExists(processPath + "/.husky");
        if (!exists) {
          console.log(
            symbols.error,
            chalk.red(".husky is lost, you need run <husky install> first")
          );
          return;
        }
        shell
          .exec(`npx husky add .husky/commit-msg 'yarn commitlint --edit "$1"'`)
          .exec(`npx husky add .husky/pre-commit 'yarn lint-staged'`);

        await fs.promises.writeFile(
          processPath + "/.husky/commit-msg",
          `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "========= 校验 commit-msg ======="
yarn commitlint --edit $1`
        );
        await fs.promises.writeFile(
          processPath + "/.husky/pre-commit",
          `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "========= 执行 lint-staged ======="
yarn lint-staged`
        );
        shell.echo("husky write done...");
      } catch (error) {
        console.log(error);
      }
    });
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

module.exports = initProject;
