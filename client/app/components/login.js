'use strict';
import {Component, Inject} from 'angular2/core';
import {Router} from 'angular2/router';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {UuidLocalStore} from '../services/store';
import loginTemplate from './login.html';
import QRCode from  '../lib/qrcode';


@Component({
  selector: 'login',
  template: loginTemplate,
  providers: [ HTTP_PROVIDERS ],
})
export class Login {
  constructor(uuidStore: UuidLocalStore, http: Http,  router: Router) {
    this._uuidStore = uuidStore;
    this._router= router;
    this._http = http;
    this.qrcode = null;

  }
  showQrcode() {

    return this._http.get('/uuid').subscribe(res=> {
      res = res.json();
      this._uuid = res.uuid;
      if(this.qrcode) {
        this.clearQrcode();
      }
      setTimeout(() =>{
        this.qrcode = new QRCode("qrcode", `https://login.weixin.qq.com/l/${res.uuid}`);
        setTimeout(() => {this.checkLogin()}, 5000)
      },0);
      return this._uuid;
    });
  }

  clearQrcode(){
    document.getElementById("qrcode").innerHTML =null;
  }

  checkLogin() {
    return this._http.get(`/login/${this._uuid}`).subscribe(res=> {
      res = res.json();
      if(res.status == 0){
        this._uuidStore.set(this._uuid);
        this._router.navigate( ['Chat']);
        return;
      }else{
        this.showQrcode();
      }
    });
  }


  ngOnInit(){
    this.showQrcode();
  }


}