// config/webpack.config.base.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");

module.exports = {
  entry: path.resolve(__dirname, "../src/index.js"),
  output: {
    filename: "[name].[hash].js", // 打包出的结果文件
    path: path.resolve(__dirname, "../dist"), // 打包到dist目录下
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "@": path.resolve(__dirname, "../src"), // 这样配置后 @ 可以指向 src 目录
    },
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      automaticNameDelimiter: "~",
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html", // 打包出来的文件名
      template: path.resolve(__dirname, "../index.html"), // 指定模板文件
      hash: true, // 在引用资源的后面增加hash戳
    }),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      include: /src/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {},
          },
        ],
      },
      {
        test: /\.less$/,
        loader: "less-loader", // 将 Less 文件编译为 CSS 文件
      },
      {
        test: /\.(js|ts)x?$/, //jsx或者tsx文件
        exclude: /(node_modules)/, // 排除node_modules
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
