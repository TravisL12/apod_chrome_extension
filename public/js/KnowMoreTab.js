'use strict';

class KnowMoreTab extends DrawerTab {

    constructor (el, apod, drawer) {
        super(el, apod, drawer);
        this.items = [];
        this.template = `
            <div class='know-links'></div>
        `;

        // let google search event listener handle toggle()
        this.el.removeEventListener('click', this.toggle);
    }

    render () {
        this.baseView.innerHTML = this.template;

        const links  = this.baseView.querySelector('.know-links');
        for (let i in this.items) {
            let item = this.items[i];
            links.innerHTML += `<a href="${item.link}" target="_blank">${item.htmlTitle}</a>`;
        }
    }

};
