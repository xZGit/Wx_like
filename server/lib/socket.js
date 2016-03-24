/**
 * Created by xx on 16/3/24.
 */
const botInstance = require('./wc-instance');

const IO = require( 'koa-socket' );
const socket = new IO();

module.exports = function (app, config) {

    socket.attach( app );


    socket.use(async (ctx, next) => {
        console.log('Socket middleware');
        console.log('ctx:', ctx.event, ctx.data, ctx.socket.id);
        const start = new Date;
        await next();
        const ms = new Date - start;
        console.log(`WS ${ ms }ms`)
    });


    /**
     * Socket handlers
     */



    socket.on('connection', ctx => {
        console.log('Join event', ctx.socket.id);
    });



    socket.on('login' , ctx => {
        let bot = botInstance.get(ctx.data);
        if(!bot) {
            ctx.acknowledge('error');
            return
        }
        ctx.acknowledge('success');
    })


};