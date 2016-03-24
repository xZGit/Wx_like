import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import appTemplate from './app.html';
import {Login} from './login';
import {Chat} from './chat';
@Component({
  selector: 'todo-app',
  directives: [ROUTER_DIRECTIVES],
  template: appTemplate
})
@RouteConfig([
  { path: '/', component: Login, as: 'Login' },
  {
    path:'/chat',
    name: 'Chat',
    component: Chat
  },
])
export class App {
}