'use strict';

function DrawerTab (el, apod, drawer) {
    this.el = el;
    this.apod = apod;
    this.drawer = drawer;
    this.title = 'Tab Name';
    this.template = '';
    this.el.addEventListener('click', this.toggle.bind(this));
}

DrawerTab.prototype = {

    preRender () {
        let drawerView = this.drawer.el.querySelector('.apod__drawer-view');
        drawerView.innerHTML = this.template;
    },

    render () {
        this.preRender();

        console.log('default render me!!!!');
    },

    toggle (e) {
        this.render();

        this.drawer.el.classList.toggle('show');
    },

}
