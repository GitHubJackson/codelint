/*
 * @Desc:
 * @Author: JacksonZhou
 * @Date: 2022/03/19
 * @LastEditTime: 2022/05/02
 */
const updateNotifier = require("update-notifier");
const chalk = require("chalk");
const pkg = require("../package.json");

const notifier = updateNotifier({
  pkg,
  // 设定检查更新周期，默认为 1 天
  updateCheckInterval: 24 * 60 * 60 * 1000,
  // 自定义更新提示信息
  updateMessage: "package update from <%=current%> to <%=latest%>.",
  // 自定义强制更新的版本更新级别，默认是 major
  level: "minor",
});

function updateCheck() {
  // notifier.update.latest 获取最新版本号
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

module.exports = updateCheck;
