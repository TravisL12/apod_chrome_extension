'use strict';

class KnowMoreTab extends DrawerTab {

    constructor (el, apod, drawer) {
        super(el, apod, drawer);
        this.items = [];
        this.loader = new SunLoader();
        this.keycode = drawer.tabs.length + 48; // tab populates with `super` so you start at 49 (number 1 key)

        this.template = `
            <div class='know-links'>
                <div class='loading-spinner hide'>${this.loader.render()}</div>
                <ul></ul>
            </div>
        `;
    }

    showLoader () {
        this.baseView.querySelector('.loading-spinner').classList.remove('hide');
    }

    render () {
        if (!this.items.length) {
            this.showLoader();
        }

        let links = '';
        for (let i in this.items) {
            let item = this.items[i];
            links += `
                <li>
                    <a href="${item.link}" target="_blank">${item.title}</a>
                </li>`;
        }

        this.baseView.querySelector('.know-links ul').innerHTML = links;
    }

};
