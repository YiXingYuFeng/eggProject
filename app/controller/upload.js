const Controller = require('egg').Controller;
const fse = require('fs-extra'); // 文件系统模块
const multiparty = require('multiparty');
const path = require('path');
// 文件的存储目录
const uploadDir = path.resolve(__dirname, '..', 'files');
class UploadController extends Controller {
  async index() {
    const { ctx } = this;
    const multipart = new multiparty.Form();
    multipart.parse(ctx.req, async (err, fields, files) => {
      if (err) { return; }
      // const { originalFilename } = files.file[0];
      // console.info(files);
      const [ chunk ] = files.chunk;
      const [ hash ] = fields.hash;
      const [ filename ] = fields.filename;
      const chunkDir = path.resolve(uploadDir, filename);
      // const filePath = files.file[0].path;
      // const chunkDir = path.resolve(uploadDir, originalFilename);
      await fse.move(chunk.path, `${chunkDir}/${hash}`);
      // https://juejin.cn/post/6844904046436843527
    });
    ctx.body = '200';
  }
  // 测试  multiparty包对文件上传的适配性
  async uploadFile() {
    const { ctx } = this;
    const multipart = new multiparty.Form();
    multipart.parse(ctx.req, async (err, fields, files) => {
      if (err) { return; }
      const { originalFilename } = files.file[0];
      const filePath = files.file[0].path;
      const chunkDir = path.resolve(uploadDir, originalFilename);
      await fse.move(filePath, `${chunkDir}/${originalFilename}`);
    });
    ctx.body = 200;
    /**
     *  multiparty 完美接收当前文件，可以直接在后端创建文件保存
     */
  }
}

module.exports = UploadController;
