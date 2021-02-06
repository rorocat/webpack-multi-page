const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const pageConfig = require('./page.config');
const PAGE_ROOT_PATH = './src/pages/';

module.exports = (webpackConfig, options) => {
  if(pageConfig && Array.isArray(pageConfig) && pageConfig.length) {
    pageConfig.forEach(page => {
      webpackConfig.entry[page.name] = `${PAGE_ROOT_PATH}${page.entry}`;
      const template = path.join(__dirname, `${PAGE_ROOT_PATH}${page.html}`);
      const filename = path.join(__dirname, `/dist/${page.name}.html`);
      webpackConfig['plugins'].push(new HtmlWebpackPlugin({
        template,
        filename,
        inject: true,
        title: page.title,
        chunks: ['common', page.name],
        inlineSource: '.(js|css)$',
        chunksSortMode: 'auto',
        minify: false,
        ...options
      }))
    })
  }
  return webpackConfig;
}