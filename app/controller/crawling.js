'use strict';

const Controller = require('egg').Controller;
const request = require('request');
const https = require('https');
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve(__dirname, '..', 'dirImg');
const testUrl = 'https://www.pexels.com';
const domain = 'https://madoupan.com';
const fetch = require('node-fetch');
// const axios = require('axios');

class crawlingController extends Controller {
  async index() {
    this.getImg();
    await this.ctx.render('crawling');
  }
  async getImg() {
    const response = await fetch('https://www.pexels.com/zh-cn/',
      {
        authority: 'www.pexels.com',
        method: 'GET',
        path: '/zh-cn/photo/12079516/',
        scheme: 'https',
        headers: {
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          cookie: 'ab.storage.deviceId.5791d6db-4410-4ace-8814-12c903a548ba=%7B%22g%22%3A%22f03acec1-9a22-b12f-2844-34848669b668%22%2C%22c%22%3A1654502988123%2C%22l%22%3A1654502988123%7D; _ga=GA1.1.1477371704.1654502988; _fbp=fb.1.1654502998448.2075381234; _ga_8JE65Q40S6=GS1.1.1654502988.1.0.1654503930.0; ab.storage.sessionId.5791d6db-4410-4ace-8814-12c903a548ba=%7B%22g%22%3A%2246b7c7b3-5cec-1e1c-6d05-e6eefd898f98%22%2C%22e%22%3A1654505731149%2C%22c%22%3A1654502988122%2C%22l%22%3A1654503931149%7D; locale=zh-CN; NEXT_LOCALE=zh-CN; _hjSessionUser_171201=eyJpZCI6IjZlMWIyZGJmLTZiM2UtNTQ0ZC04MzcwLTE1OTIwNDk4ZDgyMSIsImNyZWF0ZWQiOjE2NTQ1MDM5NTI1NzksImV4aXN0aW5nIjpmYWxzZX0=; _hjFirstSeen=1; _hjSession_171201=eyJpZCI6IjYyODU0MTZjLWJhNmMtNGFjNC1iMjg5LTYwNzg4NzU3YmY2YiIsImNyZWF0ZWQiOjE2NTQ1MDM5NTMxNTUsImluU2FtcGxlIjpmYWxzZX0=; __cf_bm=wzkv3hi0bBXppP0Ceo8E6EwHfM8e8.e4nRaQy5n14lw-1654505501-0-AWHDSV7xK1N1A4eFT0nKNQY2FKHV1CLMfZW2rOceqij82wueSuNUWNjXbB4v5hY4jDxB2OV5GSIJmwrYRdT0/0BVIsvd5YA6mhqBBZdKsJ6PrMHWaYQ4QKpS6JJG8A9q6MKzxPoZWgXncZ+H31pa3vbMGwC4iyqJbos+oySESg++'
        },
      });
    console.info(response.status);
    // const body = await response.text();
    // console.info(body);
    // const cheerio = require('cheerio');
    // request('https://www.pexels.com/zh-cn/', function(err, res, body) {
    //   // const $ = cheerio.load(body);
    //   console.info(err);
    //   // $('.article-content p img').each(function(i) {
    //   //   console.info(i);
    //   //   saveImg(domain + '/' + $(this).attr('src'), i);
    //   // });
    // });
    function saveImg(url, i) {
      console.info('发起保存图片', url);
      https.get(url, function(req) {
        let imgData = '';
        req.on('data', function(chunk) {
          imgData += chunk;
        });
        // 设置服务器 响应数据编码 binary 二进制
        req.setEncoding('binary');
        req.on('end', function() {
          fs.writeFile(`${uploadDir}/${i}.jpg`, imgData, 'binary', function(err) {
            if (err) {
              console.info('保存图片失败', err);
            } else {
              console.info('保存图片成功');
            }
          });
        });
      });
    }

  }
}

module.exports = crawlingController;
