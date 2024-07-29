    class CustomButton extends HTMLElement {
        static get observedAttributes() {
            return [
                'icon-left', 
                'button-text', 
                'icon-right', 
                'color'
            ];
        }

        constructor() {
            super();
            const template = document.getElementById('custom-button-template').content;
            this.attachShadow({ mode: 'open' }).appendChild(template.cloneNode(true));
        }

        connectedCallback() {
            this.shadowRoot.querySelector('.button').addEventListener('click', () => {
                alert('Button clicked!');
            });
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                this.render();
            }
        }

        render() {
            const shadow = this.shadowRoot;
            // shadow.querySelector('.button').style.backgroundColor = this.getAttribute('color') || '#6200ea';
            shadow.querySelector('.button__icon-left').textContent = this.getAttribute('icon-left') || '';
            shadow.querySelector('.button__text').textContent = this.getAttribute('button-text') || '';
            shadow.querySelector('.button__icon-right').textContent = this.getAttribute('icon-right') || '';
        }
    }

    customElements.define('custom-button', CustomButton);
