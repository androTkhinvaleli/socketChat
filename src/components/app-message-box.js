import {LitElement, html, css} from 'lit-element';

class AppMessageBox extends LitElement {
    static get properties() {
        return {
            message: {
                type: Object,
                observer: '_messageChanged',
            },
            left: {
                type: Boolean,
                reflect: true,
            },
            right: {
                type: Boolean,
                reflect: true,
            },
            username:{
                type:String,
            }
        };
    }

    static get styles() {
        // language=CSS
        return css`
            :host {
                display: flex;
                flex-direction: column;
            }

            :host([left]) {
                align-items: flex-start;
            }
            :host([left]) div{
                width: 300px;
                background-color: lightgrey;
                min-height: 50px;
                padding: 5px;
                border-radius: 10px;
                margin-bottom: 7px;
                color: black;
            }

            :host([right]) {
                align-items: flex-end;
            }
            :host([right]) div{
                width: 300px;
                background-color: #FE6E39;
                color: white;
                min-height: 50px;
                padding: 5px;
                border-radius: 10px;
                margin-bottom: 7px;
            }
        `;
    }

    update(props) { // handle property change
        const properties = this.constructor.properties;
        props.forEach((oldValue, name) => {
            if (this[properties[name].observer]) {
                this[properties[name].observer].apply(this, [this[name], oldValue]);
            }
        });
        super.update(props);
    }

    render() {
        // language=HTML
        return html`<div><strong>${this.message.usr} to ${this.message.to}: </strong> ${this.message.text}</div>`;
    }

    constructor() {
        super();
        this.username = sessionStorage.getItem('username');
    }



    _messageChanged() {
        if (this.message.usr === this.username) {
            this.right = true;
        } else {
            this.left = true;
        }
    }
}

window.customElements.define('app-message-box', AppMessageBox);
