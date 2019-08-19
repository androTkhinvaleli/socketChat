import {Router} from '@vaadin/router';
import {BaseElement, html, css} from './base-element';


class MyLogin extends BaseElement {
    static get properties() {
        return {
            username: {
                type: String
            }
        }
    }

    static get styles(){
        //language=css
        return css `
            .container{
                width: 960px;
                margin: auto;
                height: 100vh;
                display: flex;
                justify-content: center;
            }
            .wrapper{
                align-items: center;
                height: 100vh;
                
                display: flex;
            }
            .username{
                align-items: center;
                width: 200px;
                display: block;
                margin :  auto;
                border: solid 2px rgb(254, 103, 57);
                /* border-radius:10px 0 0 10px;  */
                font-size: 1.2em;
                color: #FE6E39;
                height: 30px;
                background-color: rgba(255,255,255,.5);
                text-align: center;
            }
            .username:focus {
                outline: none;
            }
            h2{
                display: block;
                margin :  auto;
                align-items: center;
                color: white;
                font-size: 2em;
            }
            
            @media only screen and (max-width: 960px){
                .container{
                    width: 100%;
                }
            }
            
            
        `;
    }

    constructor() {
        super();
        this.username = this.username = sessionStorage.getItem('username');
        if (this.username){
            this.redirectTo('/chat')
        }
    }

    submitUsername(e) {
        if(e.keyCode !==13) return ;

        // e.preventDefault();
        let username = e.target.value;
        if (username.length > 10){
            alert('username is too long');
            e.target.value = '';
            return;
        }
        sessionStorage.setItem('username', username);
        this.redirectTo('/chat');

    }

    render() {
        return html`
            <div class="container">
                <div class="wrapper">
                    <div>
                        <h2>Tell Us Your Name</h2>
                        <input type="text" class="username"  @keydown="${this.submitUsername}">
                    </div>
                </div>
            </div>
        `;
    }
}

window.customElements.define('x-login', MyLogin);