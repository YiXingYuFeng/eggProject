'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve(__dirname, '..', 'mp3');
const axios = require('axios');

class crawlingController extends Controller {
  async index() {
    this.getMp3File();
    await this.ctx.render('crawling');
  }
  async getMp3File() {
    const url = 'https://lovekevin.top/d/放松一下/光光&沉珂 - 飞向别人的床.mp3';
    // console.info(encodeURI(a));
    try {
      axios(encodeURI(url), { responseType: 'stream' })
        .then(res => {
          this.writeFileToLocal(res.data);
        });
    } catch (err) {
      console.error(err);
    }
    return 'a';
  }
  // 文件流写入
  async writeFileToLocal(data) {
    console.log('开始写入', uploadDir);
    const writeStream = fs.createWriteStream(`${uploadDir}/1.mp3`, { encoding: 'binary' });
    data.pipe(writeStream);
    data.on('close', () => {
      writeStream.close();
      console.log('写入完成');
    });

  }
}

module.exports = crawlingController;
