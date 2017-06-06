'use strict';

function DrawerTab (el, apod, drawer) {
    this.el       = el;
    this.apod     = apod;
    this.drawer   = drawer;
    this.title    = 'Tab Name';
    this.template = '';
    this.isOpen   = false;
    this.baseView = drawer.el.querySelector('.apod__drawer-view');
    this.el.addEventListener('click', this.toggle.bind(this));
}

DrawerTab.prototype = {

    render () {
        this.baseView.innerHTML = this.template;

        console.log('default render me!!!!');
    },

    toggle (e) {
        if (!this.drawer.isOpen) {
            this.render();
            this.el.classList.add('is_open');
        } else {
            this.el.classList.remove('is_open');
        }

        this.drawer.toggle();
    },

}
