'use strict';

class NavigationButton {

    constructor (el, keycode, action) {
        this.el = $(el);
        this.keycode = keycode;
        this.action = action;

        this.el.addEventListener('click', (e) => {
            ga('send', 'event', 'Button', 'clicked', this.el.id);
            apod[this.action]();
        });

        document.addEventListener('keydown', function (e) {
            if (e.which === this.keycode) {
                this.showHoverState();
            }
        }.bind(this));
    }

    showHoverState () {
        if (apod.isRequestInProgress) {
            return;
        }

        ga('send', 'event', 'Keydown', 'pressed', this.el.id);
        const delay = 125;
        this.el.classList.add('hover');

        setTimeout(() => {
            this.el.classList.remove('hover');
        }, delay);

        apod[this.action]();
    }

}
