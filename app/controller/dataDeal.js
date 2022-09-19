'use strict';

const Controller = require('egg').Controller;
const geoCoordMap = require('../json/index');
const city = require('../json/city');
const commUse = require('../json/commonUse');
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve(__dirname, '..', 'json');

class DataDealController extends Controller {
  async index() {
    // const result = {};
    // const notDealData = [];
    // 处理匹配已有经纬度数据
    // city.map(item => {
    //   const cityName = item.city_name.substring(0, item.city_name.length - 1);
    //   const data = geoCoordMap[cityName];
    //   if (data) {
    //     result[item.city_code] = {
    //       name: item.city_name,
    //       alias: cityName,
    //       value: data,
    //     };
    //   } else {
    //     notDealData.push(item);
    //   }
    // });
    // fs.writeFile(`${uploadDir}/target.json`, JSON.stringify(result, null, '\t'), function(err) {
    //   if (err) {
    //     console.error(err);
    //   }
    // });
    // fs.writeFile(`${uploadDir}/${notDealData.length - 1}_notDealData.json`, JSON.stringify(notDealData, null, '\t'), function(err) {
    //   if (err) {
    //     console.error(err);
    //   }
    // });
    // 处理常用数据
    const commonResultData = [];
    commUse.map(item => {
      city.map(cityItem => {
        if (item.CityPK === cityItem.standard_code) {
          commonResultData.push({
            ...item,
            ...cityItem,
          });
        }
      });
    });
    // fs.writeFile(`${uploadDir}/${commonResultData.length}_commonResultData.json`, JSON.stringify(commonResultData, null, '\t'), function(err) {
    //   if (err) {
    //     console.error(err);
    //   }
    // });
    // 处理常用结果数据
    const commonDealData = {};
    commonResultData.map(item => {
      const cityName = item.city_name.substring(0, item.city_name.length - 1);
      const data = geoCoordMap[cityName];
      if (data) {
        commonDealData[item.city_code] = {
          name: item.city_name,
          value: data
        };
      } else {
        console.log(cityName);
      }
    });
    fs.writeFile(`${uploadDir}/commonDealData.json`, JSON.stringify(commonDealData, null, '\t'), function(err) {
      if (err) {
        console.error(err);
      }
    });
    await this.ctx.render('index');
  }
}

module.exports = DataDealController;
