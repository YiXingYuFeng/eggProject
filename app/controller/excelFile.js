'use strict';

const Controller = require('egg').Controller;
const xlsx = require('node-xlsx');
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve(__dirname, '..', 'file');
const axios = require('axios');


class ExcelFileController extends Controller {
  async index() {
    await this.ctx.render('excelHtml.html');
  }
  // 读写文件
  async readFile() {
    // xlsx.readFile(uploadDir)
    console.info('开始解读文件', uploadDir);
    // const filePath = path.resolve(uploadDir, '健康餐声量趋势_2.xlsx');
    const filePath = path.resolve(uploadDir, '植物奶油趋势_change.xlsx');
    const workSheetsFromFile = xlsx.parse(fs.readFileSync(filePath));

    // 解读第一sheet
    const excelSheet = workSheetsFromFile[0].data;
    const cloumns = excelSheet[0];

    // 表头对应的key
    const columnsObj = {
      index: '',
      reference_name: 'reference_name',
      datetime: 'yearmonth',
      actualVolume: 'true_value',
      predictionVolume: 'fitted_vaulue',
      predictionVolumeMax: 'lower y',
      predictionVolumeMin: 'upper y',
    };
    const JSONKey = [ 'index', 'datetime','actualVolume', 'predictionVolume', 'predictionVolumeMin', 'predictionVolumeMax' ];
    // const JSONKey = [ 'index', 'dateValue', 'datetime', 'actualVolume', 'predictionVolume', 'predictionVolumeMin', 'predictionVolumeMax' ];
    const finalArr = [];
    console.info('当前JSONkey', JSONKey);
    // 表内容
    const jsonData = excelSheet.slice(1);
    console.info(jsonData);
    jsonData.forEach(lineItem => {
      const arrItem = {};
      lineItem.forEach((item, index) => {
        Object.assign(arrItem, { [JSONKey[index]]: item ? item : '-' });
      });
      finalArr.push(arrItem);
    });
    const data = JSON.stringify(finalArr, null, '\t');
    // const uploadDir = path.resolve(__dirname, '..', 'file');
    // 生成JSON 文件
    fs.writeFile(`${uploadDir}/excel.json`, data, 'utf-8', function(err) {
      if (err) {
        console.log(err);
      }
    });
    await this.ctx.render('index');
  }
  // 读取文件-解析成目标json
  async createJson() {
    console.info('开始解读文件', uploadDir);
    const filePath = path.resolve(uploadDir, 'poi按分类随机提取500条(1).xlsx');
    const workSheetsFromFile = xlsx.parse(fs.readFileSync(filePath));
    // 解读第一sheet
    const excelSheet = workSheetsFromFile[0].data;
    const JSONKey = [ 'name', 'address', 'telephone', 'provincename', 'cityname', 'districtname', 'township_name' ];
    const finalArr = [];

    // 表内容
    const jsonData = excelSheet.slice(1);
    jsonData.forEach(lineItem => {
      const arrItem = {};
      lineItem.forEach((item, index) => {
        if (index > 1 && index < 9) {
          Object.assign(arrItem, { [JSONKey[index - 2]]: item ? item : '-' });
        }
      });
      finalArr.push(arrItem);
    });
    // console.info(finalArr);
    const data = JSON.stringify(finalArr, null, '\t');
    // 生成JSON 文件
    fs.writeFile(`${uploadDir}/excel.json`, data, 'utf-8', function(err) {
      if (err) {
        console.log(err);
      }
    });
    this.readJson();
    await this.ctx.render('index');
  }
  async readJson(keywords) {
    // 高德key
    const key = 'efd44e2a2b88601560beb8135e24c117';
    // const keywords = '四川省｜广元市｜朝天区｜家乐福';
    // let types = '010000|020000|030000|040000|050000|060000|070000|080000|090000|100000|110000|120000|130000|140000|150000|170000|180000|190000|200000|210000||220000|';
    const url = 'https://restapi.amap.com/v5/place/text';
    // let a = `${url}?key=${key}&keywords=${keywords}&types=${types}`

    const result = await axios.get(url, {
      params: {
        key,
        keywords,
        output: 'json',
      },
    });
    // 成功
    if (result.data.status === '1') {
      return result.data.pois[0].location;
    }
    console.log('获取点位数据失败', keywords);


  }
  // 解析城市
  async cityJson() {
    console.info('开始解读文件', uploadDir);
    const filePath = path.resolve(uploadDir, 'res_city.xlsx');
    const workSheetsFromFile = xlsx.parse(fs.readFileSync(filePath));
    // 解读第一sheet
    const excelSheet = workSheetsFromFile[0].data;
    const finalArr = {};
    // 高德key
    const key = 'efd44e2a2b88601560beb8135e24c117';
    const url = 'https://restapi.amap.com/v5/place/text';
    // 表内容
    const jsonData = excelSheet.slice(1);
    let num = 0;
    for (const item of jsonData) {
      const result = await axios.get(url, {
        params: {
          key,
          keywords: item[4],
          output: 'json',
        },
      });
      if (result.data.status === '1') {
        finalArr[[ item[3] ]] = { name: item[4], value: result.data.pois[0].location.split(',') };
        console.log(num++);
        // Object.assign(finalArr, { [item[3]]: });
      }
    }
    const data = JSON.stringify(finalArr, null, '\t');
    // 生成JSON 文件
    fs.writeFile(`${uploadDir}/excel.json`, data, 'utf-8', function(err) {
      if (err) {
        console.log(err);
      }
    });
    await this.ctx.render('excelHtml');
  }
}

module.exports = ExcelFileController;
