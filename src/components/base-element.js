import {LitElement, html, css} from 'lit-element';

class BaseElement extends LitElement {
    constructor() {
        super();

        this.$ = new Proxy({},{
                get: (obj, id) => this.shadowRoot.getElementById(id),
            }
        );
    }

    redirectTo(route) {

        if (window.location.pathname !== route) {

            window.history.pushState(null, null, route);

            window.dispatchEvent(new PopStateEvent('popstate'));

        }

    }
}

export {BaseElement, html, css};