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
  async readJson() {
    // 高德key
    const key = '950c3ba41e1757b4419ec0b13102938a';
    const data = await axios.get('http://restapi.amap.com/v3/place/text', {
      key,
      keywords: '家乐福',
      types: '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施',
    });
    console.log(data);
  }
}

module.exports = ExcelFileController;
