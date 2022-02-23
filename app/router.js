'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 页面级路由
  router.get('/home', controller.home.home);
  router.get('/', controller.home.home);
  // 上传接口的路由
  router.post('/upload', controller.upload.index);
  router.post('/upload/file', controller.upload.uploadFile);
};
