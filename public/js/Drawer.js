'use strict';

function Drawer (el) {
    this.el = el;
    this.tabsEl = el.querySelector('.apod__drawer-tabs');
    this.tabs = [];
}

Drawer.prototype = {

    toggle () {
        this.el.classList.toggle('show');
    },

}
