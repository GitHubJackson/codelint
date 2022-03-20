/*
 * @Desc:
 * @Author: JacksonZhou
 * @Date: 2022/03/19
 * @LastEditTime: 2022/03/19
 */
const updateNotifier = require("update-notifier");
const chalk = require("chalk");
const pkg = require("../package.json");

const notifier = updateNotifier({
  pkg,
  // 设定检查更新周期，默认为 1 天
  // FIXME 这里设定为 1s
  updateCheckInterval: 1000,
});

function updateChk() {
  // 当检测到版本时，notifier.update 会返回 Object
  // 此时可以用 notifier.update.latest 获取最新版本号
  if (notifier.update) {
    console.log(
      `New version available: ${chalk.cyan(
        notifier.update.latest
      )}, it's recommended that you update before using.`
    );
    notifier.notify();
  } else {
    console.log("No new version is available.");
  }
}

module.exports = updateChk;
