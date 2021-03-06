/**
 * Created by xx on 16/3/24.
 */


const W4u = require('wechat4u');
const debug = require('debug')('app:wechatlib');

module.exports = class Wechat extends W4u {

    constructor() {
        super();
        this.members = [];
        this.users = new Map();
        this.socket = null;
        this.openRobot = false;
        this.on('text-message', msg => this._botReply(msg));
        this.on('login', () => {
            debug('用户', this.user);
            this.sendMsg("主人好，我是微信机器人小M，欢迎调戏。嫌烦的话请回复‘拜拜’关闭我。", this.user['UserName'])
        })
    };

     get friends() {
         if(this.members.length == 0){
             let members = this.friendList;
             for (let member of members) {
                 member.switch = true;
                 this.users.set(member.username , 1);  //1为开启自动回复
             }
             this.members = members;

         }
        return this.members;
    };


    _tuning(word) {
        let params = {
            'key': '2ba083ae9f0016664dfb7ed80ba4ffa0',
            'info': word
        };
        return this.axios.request({
            method: 'GET',
            url: 'http://www.tuling123.com/openapi/api',
            params: params
        }).then(res => {
            const body = res.data;
            if (body.code == 100000) {
                return body.text + "[微信机器人]" ;
            } else if (body.code == 200000) {
                return body.text + ": " + body.url;
            } else if (body.code == 302000) {
                return body.list.map(n=>n.article + ": " + n.detailurl).join('\n');
            } else if (body.code == 308000) {
               return body.text + '\n' + body.list.map(n=>n.name + ": " + n.info + "<" + n.detailurl + ">").join('\n');
            } else {
                return "现在思路很乱，最好联系下我哥 T_T..."
            }
        }).catch(err => {
            debug(err);
            return "现在思路很乱，最好联系下我哥 T_T..."
        })
    };

    _botReply(msg) {
        debug('消息', msg);
        let isQun = false ;
        if (msg['FromUserName'].substr(0,2) == "@@") {
            msg['Content'] = msg['Content'].split(':<br/>')[1];
            debug('群消息', msg['Content']);
            isQun = true;
        }

        if(this.socket && msg['FromUserName'] === this.user.UserName){  //自己发送的消息
            this.socket.emit("sendText",{
                to: msg['ToUserName'],
                content: msg['Content']
            })
        } else {
            this.socket.emit("receiveText",{  //别人回复的消息
                from: msg['FromUserName'],
                content: msg['Content']
            })
        }

        if(!this.openRobot || isQun) {
            debug(`robot is close or is qun msg`);
            return
        }


        const status = this.users.has(msg['FromUserName']) ? this.users.get(msg['FromUserName']) : 0 ;
        debug(`begin reply auto status : ${status}`);
        if (status !== 0) {

            if (msg['Content'] == "拜拜") {
                this.users.set(msg['FromUserName'] , 0);
                this.send("对不起打扰了了，拜拜咯", msg['FromUserName']);
            } else {
                let replyContent= "你好，我是微信机器人小M，欢迎调戏。嫌烦的话请回复‘拜拜’关闭我。";
                if (status == 1) {
                    this.users.set(msg['FromUserName'] , 2);
                    this.send(replyContent, msg['FromUserName']);
                }else{
                    this._tuning(msg['Content']).then((reply) => {
                        replyContent = reply;
                        this.send(reply, msg['FromUserName']);
                        debug('自动回复:', reply)
                    })
                }
            }
        }
    }

    send(content , to){
        this.socket.emit("sendText",{
            to: to,
            content: content
        });
        this.sendMsg(content, to);
    }


};