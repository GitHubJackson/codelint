/*
 * @Desc:
 * @Author: JacksonZhou
 * @Date: 2022/03/19
 * @LastEditTime: 2022/03/19
 */
const download = require("download-git-repo");
const ora = require("ora");
const chalk = require("chalk");
const fse = require("fs-extra");
const path = require("path");

// const defConfig = require("./config");

// const cfgPath = path.resolve(__dirname, "../config.json");
const tplPath = path.resolve(__dirname, "../template");

async function dlTemplate() {
  // 参考上方 mirror.js 主代码注释
  // const exists = await fse.pathExists(cfgPath);
  // if (exists) {
  // 这里记得加 await，在 init.js 调用时使用 async/await 生效
  await dlAction();
  // } else {
  //   await defConfig();
  //   // 同上
  //   await dlAction();
  // }
}

async function dlAction() {
  // 清空模板文件夹的相关内容，用法见 fs-extra 的 README.md
  try {
    await fse.remove(tplPath);
  } catch (err) {
    console.error(err);
    process.exit();
  }

  // 读取配置，用于获取镜像链接
  // const jsonConfig = await fse.readJson(cfgPath);
  // Spinner 初始设置
  const dlSpinner = ora(chalk.cyan("Downloading template..."));

  // 开始执行等待动画
  dlSpinner.start();
  // 下载模板后解压
  download(
    "github:billmian/react-webpack-template#main",
    tplPath,
    { clone: true },
    function (err) {
      // 下载失败时提示
      if (err) {
        dlSpinner.text = chalk.red(`Download template failed. ${err}`);
        dlSpinner.fail();
        process.exit();
      }
      dlSpinner.text = "Download template successful.";
      dlSpinner.succeed();
    }
  );
}

module.exports = dlTemplate;
