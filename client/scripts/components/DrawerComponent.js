'use strict';

class Drawer {

    constructor (el) {
        this.el = $(el);
        this.tabsEl = this.el.querySelector('.apod__drawer-tabs');
        this.tabs = [];
        this.isOpen = false;
        this.currentTabIdx;

        document.addEventListener('keydown', (e) => {
            if (e.which === 27 && this.isOpen) {
                this.closeDrawer();
            }
        });
    }

    clearKnowMoreTabs () {
        this.currentTabIdx = null;
        this.tabs = this.tabs.slice(0,2);
    }

    openDrawer () {
        this.el.classList.add('show');
        this.isOpen = true;
    }

    closeDrawer () {
        this.el.classList.remove('show');
        this.isOpen = false;

        if (this.currentTabIdx && this.currentTabIdx >= 0) {
            this.tabs[this.currentTabIdx].closeTab();
        }
    }

    setCurrentTabIdx (idx) {
        this.currentTabIdx = idx;
    }

}
