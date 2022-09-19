'use strict';

const Controller = require('egg').Controller;
const xlsx = require('node-xlsx');
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve(__dirname, '..', 'file');

class ExcelFileController extends Controller {
  async index() {
    await this.ctx.render('excelHtml.html');
  }
  // 读写文件
  async readFile() {
    // xlsx.readFile(uploadDir)
    console.info('开始解读文件', uploadDir);
    // const filePath = path.resolve(uploadDir, '健康餐声量趋势_2.xlsx');
    const filePath = path.resolve(uploadDir, '黄金橄榄炸鸡_声量趋势_new.xlsx');
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
    const JSONKey = [ 'index', 'reference_name', 'datetime', 'actualVolume', 'predictionVolume', 'predictionVolumeMin', 'predictionVolumeMax' ];
    // const JSONKey = [ 'index', 'dateValue', 'datetime', 'actualVolume', 'predictionVolume', 'predictionVolumeMin', 'predictionVolumeMax' ];
    const finalArr = [];
    console.info('当前JSONkey', JSONKey);
    // 表内容
    const jsonData = excelSheet.slice(1);
    console.info(jsonData);
    jsonData.forEach(lineItem => {
      const arrItem = {};
      // console.info(lineItem);
      lineItem.forEach((item, index) => {
        Object.assign(arrItem, { [JSONKey[index]]: item ? item : '-' });
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
    await this.ctx.render('index');
  }
}

module.exports = ExcelFileController;
