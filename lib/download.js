/*
 * @Desc:
 * @Author: JacksonZhou
 * @Date: 2022/03/19
 * @LastEditTime: 2022/05/09
 */
const download = require("download-git-repo");
const ora = require("ora");
const chalk = require("chalk");
const fse = require("fs-extra");
const path = require("path");

const tplPath = path.resolve(__dirname, "../template");

const asyncDownload = function (template, tplPath) {
  return new Promise((resolve, reject) => {
    download(template, tplPath, { clone: true }, function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

async function dlTemplate(answers) {
  await dlAction(answers);
}

async function dlAction(answers) {
  // 先清空模板文件夹
  try {
    await fse.remove(tplPath);
  } catch (err) {
    console.error(err);
    process.exit();
  }
  const dlSpinner = ora(chalk.cyan("Downloading template..."));
  const { name, type } = answers;
  const templateMap = {
    react: "github:GitHubJackson/react-spa-template#main",
    vue: "github:GitHubJackson/vue-spa-template#main",
    "vite-vue": "github:GitHubJackson/vite-vue-template#main",
    koa: "github:GitHubJackson/koa2-template-lite#main",
  };

  dlSpinner.start();
  // 下载模板后解压
  return asyncDownload(templateMap[type], tplPath)
    .then(() => {
      dlSpinner.text = "Download template successful.";
      dlSpinner.succeed();
    })
    .catch((err) => {
      dlSpinner.text = chalk.red(`Download template failed. ${err}`);
      dlSpinner.fail();
      process.exit();
    });
}

module.exports = dlTemplate;
