'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async home() {
    await this.ctx.render('index');
  }
}

module.exports = HomeController;
