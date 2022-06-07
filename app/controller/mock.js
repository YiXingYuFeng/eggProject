'use strict';

const Controller = require('egg').Controller;

class MockController extends Controller {
  async index() {
    await this.ctx.render('mock');
  }
}

module.exports = MockController;
