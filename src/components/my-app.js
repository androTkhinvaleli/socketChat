
import {Router} from '@vaadin/router';
import './app-message-box';
import './x-chat'
import './x-login'


const router = new Router(document.getElementById('outlet'), {
    baseUrl: '/'
});
router.setRoutes([

    {path:'/', redirect:'/chat'},
    {path: '/chat', component: 'x-chat'},
    {path: '/login', component: 'x-login'},

]);

// import {LitElement, html, css} from 'lit-element';
//
// import './app-message-box';LitElement


