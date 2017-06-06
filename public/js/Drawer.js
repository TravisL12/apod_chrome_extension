'use strict';

class Drawer {

    constructor (el) {
        this.el = $(el);
        this.tabsEl = this.el.querySelector('.apod__drawer-tabs');
        this.tabs = [];
        this.isOpen = false;
        this.currentTabIdx;
    }

    toggle () {
        this.el.classList.toggle('show');
        this.isOpen = this.el.classList.contains('show');
    }

    setCurrentTabIdx (idx) {
        this.currentTabIdx = idx;
    }

}
