/**
 * Created by xx on 16/3/28.
 */
'use strict';
import {Http} from 'angular2/http';

export class HttpService {

    constructor(http: Http) {
        this._http = http;

    }

    getFriends(uuid) {

        return new Promise((resolve, reject) => {
            this._http.get(`/friends/${uuid}`).subscribe(
                    res=>resolve(res.json()),
                    err => reject(err)
            );
        });

    }
}
