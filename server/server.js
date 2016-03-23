/**
 * Created by xx on 16/3/23.
 */



'use strict';
import Koa from 'koa'

const config = require('./config');
const app = new Koa();
const IO = require( 'koa-socket' );
const socket = new IO();
const convert = require('koa-convert')
const staticServe = require('koa-static');


require(`./lib/routes`)(app, config);

app.use(convert(staticServe(config.staticPath)));


socket.attach( app );



socket.use(async (  ctx, next) =>{
    console.log( 'Socket middleware' );
    console.log( 'ctx:', ctx.event, ctx.data, ctx.socket.id );
    const start = new Date;
    await next();
    const ms = new Date - start;
    console.log( `WS ${ ms }ms` )
});

/**
 * Socket handlers
 */
socket.on('connection', ctx => {
    console.log( 'Join event', ctx.socket.id );
});
















app.listen(config.port, () => console.log(`server start: ${config.port}`));


export default app
