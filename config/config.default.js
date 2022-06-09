/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1645517707324_8077';

  // add your middleware config here
  config.middleware = [];

  // 页面配置
  config.view = {
    defaultViewEngine: 'ejs',
    mapping: {
      '.html': 'ejs',
    },
  };
  // 跨域设置
  config.security = {
    csrf: {
      enable: false,
      // ignore: ctx => {
      //   if (ctx.request.url === `/${config.adminPath}/product/doUpload`) {
      //     return true;
      //   }
      // },
    },
    domainWhiteList: [ '*' ],
  };
  config.cors = {
    credentials: true,
    origin: '*',
    allowMethods: 'GET,PUT,POST,DELETE',
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
