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

    }

    ngOnInit(){
        this._uuid = this._uuidStore.get();
        if(!this._uuid) {
            this._router.navigate( ['Todo']);
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


    getFriends(){
        this._http.get(`/friends/${this._uuid}`).subscribe(res=> {
            res = res.json();
            if(res.status == 0){
                this.friends = res.friends;
            }else{
                this.backLogin();
            }
        });
    }


    initSocket(socket){
        const self = this;
        socket.emit('login' , this._uuid, function (status) {
            if(status != "success"){
                //self._router.navigate( ['Todo']);
            }
            self.getFriends();
        });

        socket.on('newMessage' , function(){
            console.log(arguments);
        });

    }



}