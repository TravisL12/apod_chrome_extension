'use strict';

class KnowMoreTab extends DrawerTab {

    constructor (el, apod, drawer, index, searchCallback) {
        super(el, apod, drawer);
        this.items = [];
        this.loader = new SunLoader();
        this.index = index;
        this.searchFn = searchCallback;
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

    setClickListener () {
        const tabs = document.getElementsByClassName(`keyword-${this.index}`);

        for (let i = 0; i < tabs.length; i++) {
            tabs[i].onclick = () => {
                this.toggle();
                this.searchFn();
            }
        }
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
                    <a href="${item.link}" target="_blank">${item.htmlTitle}</a>
                </li>`;
        }

        this.baseView.querySelector('.know-links ul').innerHTML = links;
    }

};
