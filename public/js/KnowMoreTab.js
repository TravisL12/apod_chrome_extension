'use strict';

class KnowMoreTab extends DrawerTab {

    constructor (el, apod, drawer) {
        super(el, apod, drawer);
        this.items = [];
        this.template = `
            <div class='know-links'>
                <span class='loading-spinner hide'></span>
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
            links += `<li><a href="${item.link}" target="_blank">${item.htmlTitle}</a></li>`;
        }

        this.baseView.querySelector('.know-links ul').innerHTML = links;
    }

};