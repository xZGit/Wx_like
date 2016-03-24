'use strict';

import localStorage from 'localStorage';




export class UuidLocalStore {

  constructor() {
    this._uuidName = `wx-uuid`;

  }

  get() {
    const uuid = localStorage.getItem(this._uuidName);
    return uuid;
  }

  set(uuid) {
    localStorage.setItem(this._uuidName, uuid);
  }


}
