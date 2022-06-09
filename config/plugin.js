'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  origin: {
    enable: true,
    package: 'egg-origin',
  },
};
