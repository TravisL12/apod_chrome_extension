'use strict';

class DrawerTab {

    constructor (el, apod, drawer) {
        this.el        = $(el);
        this.apod      = apod;
        this.drawer    = drawer;
        this.title     = 'Tab Name';
        this.isOpen    = false;
        this.drawerIdx = this.drawer.tabs.length;
        this.baseView  = drawer.el.querySelector('.apod__drawer-view');
        this.drawer.tabs.push(this);

        this.el.addEventListener('click', this.toggle.bind(this));
        document.addEventListener('keydown', this.setKeydownListener.bind(this));
    }

    setKeydownListener (e) {
        if (e.which === this.keycode) {
            this.toggle();
        }
    }

    render () {
        this.baseView.innerHTML = this.template;
    }

    toggle () {
        if (!this.drawer.isOpen) {
            this.render();
            this.drawer.setCurrentTabIdx(this.drawerIdx);
            this.el.classList.add('is_open');
        } else {
            this.el.classList.remove('is_open');
        }

        this.drawer.toggle();
    }

}
