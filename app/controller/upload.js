const Controller = require('egg').Controller;
const fs = require('fs');
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
      // console.info('文件fields:', fields);
      const [ chunk ] = files.chunk;
      const [ hash ] = fields.hash;
      const [ filename ] = fields.fileName;
      const chunkDir = path.resolve(uploadDir, filename);
      // const filePath = files.file[0].path;
      // const chunkDir = path.resolve(uploadDir, originalFilename);
      await fse.move(chunk.path, `${chunkDir}/${hash}`);
      // console.info(chunk.path, chunkDir);
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
      // await fse.move(filePath, `${chunkDir}/${originalFilename}`);
      await fse.move(filePath, `${chunkDir}`);
    });
    ctx.body = 200;
    /**
     *  multiparty 完美接收当前文件，可以直接在后端创建文件保存
     */
  }
  // 合并切片文件
  async mergeFile() {
    const { ctx } = this;
    console.info('合并切片文件', ctx.query);
    // 当前文件名称
    const currentFileName = ctx.query.fileName;
    const splitSize = ctx.query.size;
    // 读写文件流
    const pipeStream = (path, writeStream) =>
      new Promise(resolve => {
        const readStream = fse.createReadStream(path);
        readStream.on('end', () => {
          // todo 删除切片文件
          // fse.unlinkSync(path);
          resolve();
        });
        readStream.pipe(writeStream);
      });
    // 合并切片
    const mergeFileChunk = async (filePath, fileName, size) => {
      const chunkDir = path.resolve(uploadDir, fileName);
      const chunkPaths = await fse.readdir(chunkDir);
      await Promise.all(
        chunkPaths.map((chunkPath, index) => {
          console.info(chunkPath, index);
          pipeStream(
            path.resolve(chunkDir, chunkPath),
            fse.createWriteStream(filePath, {
              start: index * size,
              end: (index + 1) * size,
            })
          );
        })
      );
      // todo 删除文件有点问题？
      // fse.rmdirSync(chunkDir);
    };
    // 重新写入文件位置
    const filePath = path.resolve(__dirname, '../file', currentFileName);
    await mergeFileChunk(filePath, currentFileName, splitSize);
    ctx.body = 200;
  }
  // 测试文件流中是否可读问题
  async fileRead() {
    const { ctx } = this;
    const { fileName } = ctx.query;
    console.info('当前文件名称', fileName);
    const filePath = path.resolve(__dirname, '../files', fileName);
    console.info(filePath);
    const filedStream = fs.createReadStream(filePath);

    filedStream.on('open', () => {
      console.info('文件开始读写');
    });
    filedStream.on('data', data => {
      console.info('当前读写的文件流数据：');
      console.info(data);
    });
    filedStream.on('end', () => {
      console.info('文件读写完成');
    });
    filedStream.on('err', err => {
      console.info('文件读写失败', err);
    });
    ctx.body = 200;
  }
}

module.exports = UploadController;
