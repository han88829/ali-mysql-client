'use strict';

module.exports = app => {
  app.get('/', app.controller.home.index);
  app.get('/foo', app.controller.home.foo);
};
