/**
 * Created by xx on 16/3/23.
 */



'use strict';
import Koa from 'koa'

const config = require('./config');
const app = new Koa();
const convert = require('koa-convert')
const staticServe = require('koa-static');


require(`./lib/routes`)(app, config);
require(`./lib/socket`)(app, config);

app.use(convert(staticServe(config.staticPath)));



app.listen(config.port, () => console.log(`server start: ${config.port}`));


export default app
