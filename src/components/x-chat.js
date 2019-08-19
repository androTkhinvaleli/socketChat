import {BaseElement, html, css} from './base-element';

import './app-message-box';


class MyChat extends BaseElement {

    static get properties() {
        return {
            message: {
                type: String,
                reflect: true,
            },
            status: {
                type: String,
                reflect: true,
            },
            Messages: {
                type: Array,

            },
            People: {
                type: String,

            },
            username: {
                type: String,

            },
            receiver: {
                type: String,

            }
        }
    }
    static get styles(){
        // language=CSS
        return css`
            *{
                padding: 0;
                margin: 0;
                box-sizing: border-box;
                list-style-type: none;
            }
            :host{
                color: white;
                background-color: rgba(254, 103, 57, .7);
            }
            /* width */
            ::-webkit-scrollbar {
                width: 7.5px;
            }

            /* Track */
            ::-webkit-scrollbar-track {
                
                background: transparent;
            }

            /* Handle */
            ::-webkit-scrollbar-thumb {
                background: #b1b1b1;
                border-radius: 10px;
            }

            /* Handle on hover */
            ::-webkit-scrollbar-thumb:hover {
                background: #ccc;
            }
            .container{
                width: 960px;
                margin: auto
            }
            header .container{
                display: flex;
                justify-content: space-between;
            }
            .account{
                /*display: flex;*/
                /*justify-content: flex-end;*/
                text-align: end;
            }
            #logout{
                border: 0;
                padding: 10px;
                margin-left: 5vw;
                background-color: darkorange;
                color: white;
                cursor: pointer;
                transition: 0.5s;
            }
            #logout:hover{
                background-color: #FE6E39;
            }
            .chat-wrapper{
                height: 85vh;
                width: 100%;
                margin-top: 10px;
                font-family: Arial, Helvetica, sans-serif;
                display: flex;
                background-color: rgba(150,150,150, .5);
            }
            #messanger-wrapper{
                height: 100%;
                width: 70%;
                border: solid 2px #FE6E39;

                position: relative;

            }
            #messages{
                height: 94%;
                overflow: hidden;
                padding: 5px;
                overflow-y: auto;
                position: relative;
                scroll-behavior: smooth;
            }
            .input-wrapper{
                display: flex;
                /* width: 99.9%; */
            }
            .send-to{
                min-width: 30%;
                height: 30px;
                position: absolute;
                bottom: 0;
                font-size: 1.2em;
                font-weight: 400;
                /* padding: 5px 10px; */
                justify-content: center;
                background-color: rgba(255,255,255,.5);
                color: #FE6E39;
                
                display: flex;
                align-items: center;
                border-right: #FE6E39 solid 2px;
                border-top: #FE6E39 solid 2px;
            }
            #message{
                height: 30px;
                position: absolute;
                bottom: 0;
                right: 0;
                width: 70% ;
                border: none;
                /* border-radius:10px 0 0 10px;  */
                font-size: 1.2em;
                color: #FE6E39;
                background-color: rgba(255,255,255,.5);
                border-top: #FE6E39 solid 2px;
                padding: 0 5px;
            }
            #message::placeholder{
                color: rgba(254, 103, 57, .5);
            }
            .count{
                padding: 10px;
                font-size: 1.2em;
                position: fixed;
                left: 0;
                top: 15vh;
                writing-mode: vertical-rl;
                text-orientation: mixed;
                background-color: rgba(0, 0, 0, 0.4);
                z-index: 1;
                display: none;
                cursor: pointer;
                transition: 0.3s
            }
            .users-list{
                height: 100%;
                
                transition: 0.3s
            }
            .list-wrapper{
                height: 100%;
                width: 30%;
                border: solid 2px #FE6E39;
            }

            .users-list h3{
                text-align: center;
                margin-bottom:  10px;
                border-bottom: 2px solid  #FE6E39;
            }
            .list{
                height: 100%;
                list-style-type: none;
                font-size: 1.2em;
                overflow: hidden;
                
                overflow-y: auto;
                
                scroll-behavior: smooth;
            }
            .list li{
                text-align: center;

            }
            .list li:hover{
                cursor: pointer;
            }
            .selected{
                color: white;
                background-color: #FE6E39;

            }

            @media only screen and (max-width: 960px){
                .container{
                    width: 100%;
                }
            }

            @media only screen and (max-width: 676px){
                .chat-wrapper{
                    display: block;
                }
                #messanger-wrapper{
                    width: 100%;
                }
                .list-wrapper{
                    border: 0;
                    width: 150px;
                    position: fixed;
                    left: -150px;
                    top: 0;
                    z-index: 1;
                }
                .users-list{
                    width: 150px;
                    position: fixed;
                    left: -150px;
                    background-color: rgba(0, 0, 0, 0.4);
                    border: 0;
                    z-index: 1;
                    top: 0;
                }
                .users-list h3{
                    border: 0;
                    margin: 0;
                    padding-bottom: 10px;
                    background-color: #FE6E39;
                }
                .count{
                    display: block;
                }
            }
            @media only screen and (max-width: 480px){
                .send-to{
                    bottom: 30px;
                    width: 100%;
                    border-right: 0;
                    
                }
                #message{
                    width: 100%;
                }
                #messages{
                    height: 89%;
                }
            }
        `;
    }

    constructor() {
        super();
        this.username = sessionStorage.getItem('username');
        if (!this.username) {
            this.redirectTo('/login');
            return;
        }
        this.message = 'Joined as ' + this.username;
        this.Messages = [];
        this.People = [];
        this.receiver = 'all';
        this.socket = new WebSocket('ws://localhost:3001/?key=' + this.username);
        this.socket.onopen = () => this.status = 'connected';
        this.socket.onclose = () => this.status = 'disconnected';
        this.socket.onmessage = (message) => {
            let msg = JSON.parse(message.data);
            if (msg.type === 'message') {
                this.Messages = [...this.Messages, msg];
                setTimeout(() => {

                    if (this.$.messages) this.$.messages.scrollTop = this.$.messages.scrollHeight;
                }, 10);
            }
            if (msg.type === 'join') {
                this.People = msg.arr;

            }
            if (msg.type === 'remove') {
                this.People = this.People.filter((people) => people !== msg.usr);
                if (this.receiver === msg.usr){
                    this.receiver = 'all';
                }
            }
        }
        // console.log(this.querySelector('#messages'));
    }

    sendMessage(event) {
        if (event.keyCode !== 13) return;
        if (event.target.value === '') return;
        let message = {
            usr: this.username,
            type: 'message',
            to: this.receiver,
            text: event.target.value,
        };
        this.socket.send(JSON.stringify(message));
        event.target.value = '';
    }

    selectReceiver(event) {
        if (event.target.innerText !== this.receiver) {
            this.receiver = event.target.innerText;
            console.log(this.receiver);
            event.target.parentNode.querySelectorAll('li').forEach(li => {
                li.classList.remove('selected');
            });

            event.target.classList.add('selected');
        } else {
            this.receiver = 'all';
            event.target.classList.remove('selected');
        }

    }
    slideBar(event){
        if (event.target.offsetLeft ===0){
            event.target.parentElement.querySelectorAll('div').forEach(div =>{
                div.style.left = div.offsetLeft + 150 + 'px';
            });
        } else if(event.target.offsetLeft === 150){
            event.target.parentElement.querySelectorAll('div').forEach(div =>{
                div.style.left = div.offsetLeft - 150 + 'px';
            });
        }
    }

    logout() {
        sessionStorage.removeItem("username");
        // document.location.reload(true);
        this.socket.close();
        this.redirectTo('/login');


    }

    // firstUpdated(changedProperties) {
    //     let event = new CustomEvent('my-event', {
    //         detail:{message:'my-event happened.'},
    //         bubbles: true,
    //         composed: true
    //     });
    //     this.dispatchEvent(event);
    // }
    //
    // scrollMessages(event){
    //    console.log(event.detail.message)
    // }

    render() {
        //language html
        return html`
            <section>
                 <header>
                    <div class="container">
                      <div><h2>You Are ${this.status}</h2></div>
                      <div class="account">
                        <span>${this.message}</span>
                        <button @click="${this.logout}" id="logout" href="/login">Logout</button>
                      </div>
                    </div>
                </header>
            </section>
            <section>
                <div class="container">
                    <div class="chat-wrapper">
                       <div class="list-wrapper">
                        <div class="count" @click="${this.slideBar}">Active People <span class="quantity"></span> </div>
                        <div class="users-list">
                          <h3>Active People</h3>
                          <ul class="list">
                            ${this.People.filter((j) => j !== this.username).map(i => html`<li @click="${this.selectReceiver}" >${i}</li>`)}
                          </ul>
                        </div>
                       </div>
                        <div id="messanger-wrapper">   
                          <div id="messages" >
                          
                            ${this.Messages.map(i => html`<app-message-box .message ="${i}"></app-message-box>`)}
                          
                          </div>
                          <div class="input-wrapper">
                            <div class="send-to">To- <span class="receiver"> ${this.receiver}</span> </div>   
                            <div>
                                <input id="message" autocomplete="off" type="text" placeholder="Your Message..." @keydown="${this.sendMessage}">
                            </div>
                          </div>
                      </div>
                     </div>
                  </div>
              </section>
         `;
    }

}

window.customElements.define('x-chat', MyChat);
