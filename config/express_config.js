const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

module.exports = () => {
  const app = express();

  if(process.env.NODE_ENV === 'development') {
      console.log('Development Mode');
      app.use(morgan('dev'));
   } else if (process.env.NODE_ENV === 'production') {
      console.log('Production Mode');
      app.use(compress());
   }

  app.use(bodyParser.urlencoded({
    extended:true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  require('../app/routes/users.server.routes.js')(app);
  require('./error_handler.js')(app);

  return app;
};
