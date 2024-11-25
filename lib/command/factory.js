'use strict';

const assert = require('assert');
const Rds = require('knex');

function createMysql(options) {
  // 优先从options.mysql中取得配置没到时才从options中取 
  assert(options, '初始化参数不能为空！');

  // 如果传入的已经是ali-rds或egg-mysql对象则直接使用
  if (options.transaction && options.raw) {
    return options;
  }

  // 创建一个ali-rds对象  
  if (options.client && options.connection) {
    return new Rds(options);
  }

  throw new Error('初始化参数不正确！');
}

module.exports = createMysql;
