'use strict';

class DrawerTab {

    constructor (el, apod, drawer) {
        this.el        = $(el);
        this.apod      = apod;
        this.keycode   = null;
        this.drawer    = drawer;
        this.isOpen    = false;
        this.drawerIdx = this.drawer.tabs.length;
        this.baseView  = drawer.el.querySelector('.apod__drawer-view');
        this.drawer.tabs.push(this);

        this.el.addEventListener('click', this.toggle.bind(this));
        document.addEventListener('keydown', this.setKeydownListener.bind(this));
    }

    setKeydownListener (e) {
        if (this.keycode && e.which === this.keycode) {
            this.toggle();
        }
    }

    render () {
        this.baseView.innerHTML = this.template;
    }

    openTab () {
        this.render();
        this.drawer.setCurrentTabIdx(this.drawerIdx);
        this.el.classList.add('is-open');
        this.isOpen = true;
    }

    closeTab () {
        this.el.classList.remove('is-open');
        this.isOpen = false;
    }

    toggle () {
        if (!this.drawer.isOpen) {
            this.openTab();
            this.drawer.openDrawer();
        } else {
            if (this.drawer.currentTabIdx !== this.drawerIdx) {
                this.closeTab.call(this.drawer.tabs[this.drawer.currentTabIdx]);
                this.openTab();
            } else {
                this.closeTab();
                this.drawer.closeDrawer();
            }
        }
    }

}
