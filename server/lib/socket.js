/**
 * Created by xx on 16/3/24.
 */
const botInstance = require('./wc-instance');

const IO = require('koa-socket');
const socket = new IO();
const debug = require('debug')('app:socket');

module.exports = function (app, config) {

    socket.attach(app);


    socket.use(async (ctx, next) => {
        debug('Socket middleware');
        debug('ctx:', ctx.event, ctx.data, ctx.socket.id);
        const start = new Date;
        await next();
        const ms = new Date - start;
        debug(`WS ${ ms }ms`)
    });


    /**
     * Socket handlers
     */



    socket.on('connection', ctx => {
        debug('Join event', ctx.socket.id);
    });


    socket.on('login', ctx => {
        let bot = botInstance.get(ctx.data);
        if (!bot) {
            ctx.acknowledge('error');
            return
        }
        ctx.socket.uuid = ctx.data;
        bot.socket = ctx.socket;
        ctx.acknowledge('success');
    })

    socket.on('sendMsg', ctx => {
        let bot = botInstance.get(ctx.data.uuid);
        if (!bot) {
            ctx.acknowledge('error');
            return
        }
        bot.send(ctx.data.content, ctx.data.to);
        ctx.acknowledge('success');
    })





};