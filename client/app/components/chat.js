/**
 * Created by xx on 16/3/24.
 */



'use strict';
import {Component, Inject} from 'angular2/core';
import {Router} from 'angular2/router';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {UuidLocalStore} from '../services/store';
import chatTemplate from './chat.html';
import IO  from 'socket.io-client';

@Component({
    selector: 'chat',
    template: chatTemplate,
    providers: [ HTTP_PROVIDERS ],
})
export class Chat {
    constructor(uuidStore: UuidLocalStore,  http: Http,  router: Router) {
        this._uuidStore = uuidStore;
        this._router= router;
        this._http = http;
        this.friendsMap = new Map();
    }

    ngOnInit(){
        this._uuid = this._uuidStore.get();
        if(!this._uuid) {
            this.backLogin();
            return
        }
        this.socket = IO.connect('/' , {
            'reconnection delay': 0,
            'reopen delay': 0,
            'force new connection': true,
        });
        this.initSocket(this.socket);

    }

    backLogin(){
        this._router.navigate( ['Login']);
    }

    setChatFriend(friend){
        friend.msgCount = 0;
        this.chatFriend = friend;
        console.log(this.chatFriend);
    }

    getFriends(){
        this._http.get(`/friends/${this._uuid}`).subscribe(res=> {
            res = res.json();
            if(res.status == 0){
                this.friends = res.friends;
                for (let f of  this.friends.values()) {
                     f.msg = [];
                     f.msgCount = 0;
                     this.friendsMap.set(f.username, f);
                }
            }else{
                this.backLogin();
            }
        });
    }

    initSocket(socket){
        const self = this;
        socket.emit('login' , self._uuid, function (status) {
            console.log("login" , status);
            if(status != "success"){
                 self.backLogin();
            }
            self.getFriends();
        });

        socket.on('receiveText' , function(data){
            console.log('receive' , data);
            if(data && data["from"]){
                let f =self.friendsMap.get(data["from"]);
                f.msg.push({type: "receive" , content : data["content"]});
                if(!self.chatFriend || self.chatFriend.username !== data["from"])f.msgCount++ ;
                self.friends  = self.sort(self.friends, f);
                self.scroll();
            }
        });



        socket.on('sendText' , function(data){
            console.log('send' , data);
            if(data && data["to"]){
                let f =self.friendsMap.get(data["to"]);
                f.msg.push({type: "send" , content : data["content"]});
                self.friends  = self.sort(self.friends , f);
                self.scroll();
        }
        });

    }

    sort(arr , key){
        console.log("sort begin");
        if(!arr){
            return [];
        }
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === key) {
                arr.splice(i, 1);
                break;
            }
        }
        arr.unshift(key);
        return arr;
    }

    scroll(){
        document.getElementById("msg_body").scrollTop = 1000000;
    }


    sendMsg(friend, content){
        content = content.trim();
        if(!friend || !friend.username || !content || content.length ==0) return;
        const msg = {
            uuid: this._uuid,
            to: friend.username,
            content:content
        };
        this.newMsg = null ;
        this.socket.emit('sendMsg' , msg , function (status) {
        });
    }


}



