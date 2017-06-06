'use strict';

function Drawer (el) {
    this.el = el;
    this.tabsEl = el.querySelector('.apod__drawer-tabs');
    this.tabs = [];
    this.isOpen = false;
    this.currentTabIdx;
}

Drawer.prototype = {

    toggle () {
        this.el.classList.toggle('show');

        this.isOpen = this.el.classList.contains('show');
    },

    setCurrentTabIdx (idx) {
        this.currentTabIdx = idx;
    }

}
