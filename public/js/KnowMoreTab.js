'use strict';

class KnowMoreTab extends DrawerTab {

    constructor (el, apod, drawer) {
        super(el, apod, drawer);
        this.title = 'Learn More';
        this.keycode = 76;
        this.template = `
            <div class='apod__know-more'>
                <ul></ul>
            </div>
        `;
    }

    render () {
        this.baseView.innerHTML = this.template;
        const knowMoreEl = this.baseView.querySelector('ul');
        const results = this.apod.knowMore.results;

        for (let i in results) {
            knowMoreEl.appendChild(this.apod.knowMore.createLink(results[i]));
        }
    }

}
