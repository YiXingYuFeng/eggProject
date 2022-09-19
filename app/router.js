'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 页面级路由
  router.get('/home', controller.home.home);
  router.get('/', controller.home.home);

  // 测试mock
  router.get('/mock', controller.mock.index);
  // 上传接口的路由
  router.post('/upload', controller.upload.index);
  router.post('/upload/file', controller.upload.uploadFile);
  // 合并文件
  router.get('/upload/merge', controller.upload.mergeFile);
  // 测试文件读写
  router.get('/read/file', controller.upload.fileRead);
  router.get('/excel', controller.excelFile.index);
  // 解析excel
  router.get('/read/excel', controller.excelFile.readFile);
  router.get('/read/excel1', controller.excelFile.createJson);
  // 爬虫
  router.get('/crawling', controller.crawling.index);
  // 生成目标json
  router.get('/json', controller.dataDeal.index);
};
