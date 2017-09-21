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

        document.addEventListener('keydown', (e) => {
            if (e.which === this.keycode) {
                ga('send', 'event', 'Keydown', 'pressed', this.el.id);
                apod[this.action]();
            }
        });
    }

}
