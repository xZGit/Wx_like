/**
 * Created by xx on 16/3/23.
 */


const router = require('koa-router')();
const fs = require( 'fs' );
const path = require( 'path' );
const Wechat = require('wechat4u');
const botInstance = require('./wc-instance');

module.exports = function routers(app, config){

    router.get('/', function (ctx, next) {
        ctx.type = 'text/html';
        ctx.body = fs.createReadStream( path.join( config.staticPath, 'index.html' ) );

    });


    router.get('/uuid',  async function  (ctx, next) {
        let bot = new Wechat();
        const uuid = await bot.getUUID();
        botInstance.set(uuid, bot);
        ctx.body = {uuid: uuid};
    });






    app
        .use(router.routes())
        .use(router.allowedMethods());


};