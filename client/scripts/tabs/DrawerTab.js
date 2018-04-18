import { $, clearElement } from '../utilities';
import { apod, drawer } from '../../index';

export default class DrawerTab {
    constructor(el) {
        this.el = $(el);
        this.apod = apod;
        this.keycode = null;
        this.drawer = drawer;
        this.drawerIdx = this.drawer.tabs.length;
        this.baseView = drawer.el.querySelector('.apod__drawer-view');
        this.drawer.tabs.push(this);

        this.el.addEventListener('click', this.toggle.bind(this));
        document.addEventListener('keydown', this.setKeydownListener.bind(this));
    }

    setKeydownListener(e) {
        if (this.keycode && e.which === this.keycode) {
            this.toggle();
        }
    }

    render() {
        this.baseView.appendChild(this.template);
    }

    clearDrawer() {
        while (this.baseView.firstChild) {
            this.baseView.removeChild(this.baseView.firstChild);
        }
    }

    openTab() {
        clearElement(this.baseView);
        this.baseView.appendChild(this.template);
        this.render();
        this.drawer.setCurrentTabIdx(this.drawerIdx);
        this.el.classList.add('is-open');
    }

    closeTab() {
        this.el.classList.remove('is-open');
    }

    toggle() {
        if (!this.drawer.isOpen) {
            this.openTab();
            this.drawer.openDrawer();
        } else {
            // Drawer open, click another tab
            if (this.drawer.currentTabIdx !== this.drawerIdx) {
                this.closeTab.call(this.drawer.tabs[this.drawer.currentTabIdx]);
                this.openTab();
                // Click opened tab to close
            } else {
                this.closeTab();
                this.drawer.closeDrawer();
            }
        }
    }
}
